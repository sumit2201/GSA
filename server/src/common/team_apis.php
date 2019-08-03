<?php
require_once("utility.php");
require_once('constants.php');

function preparePayloadForUserRegistration($payload, $isCoach = false)
{
    $userPayload = new stdClass();
    if ($isCoach) {
        if ($payload->coach_password !== $payload->coach_verifyPassword) {
            return false;
        }
        $userPayload->name = $payload->coach_name;
        $userPayload->email = $payload->coach_email;
        $userPayload->primary = $payload->team_primary;
        $userPayload->password = $payload->coach_password;
    } else {
        if ($payload->user_password !== $payload->user_verifyPassword) {
            return false;
        }
        $userPayload->name = $payload->user_name;
        $userPayload->email = $payload->user_email;
        $userPayload->primary = $payload->user_primary;
        $userPayload->password = $payload->user_password;
    }
    return $userPayload;
}

function preparePayloadToCheckTeamDuplicacy($payload)
{
    $teamPayload = new stdClass();
    $teamPayload->name = $payload->name;
    $teamPayload->state = $payload->state;
    $teamPayload->sportId = $payload->sportId;
    $teamPayload->agegroup = $payload->agegroup;
    return $teamPayload;
}

function getSingleTeamDetail($payload)
{
    global $db, $logger;
    $whereCondition = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TEAM"));
    if (!CommonUtils::isValid($whereCondition)) {
        $logger->error("can not fetch team detail because no correct reuest is provided ");
        return false;
    }
    $query = "SELECT  * FROM `jos_community_groups` $whereCondition";
    $sth = $db->prepare($query);
    $sth->execute();
    $teamDetails = $sth->fetchObject();
    return $teamDetails;
}

function addTeam($payload)
{
    global $db, $logger;
    $teamResponse = new ActionResponse(0, null);
    try {

        $isRequestInValid = isRequestHasValidParameters($payload, ["name", "coach_name", "coach_email", "agegroup", "state"]);
        if ($isRequestInValid) {
            return $isRequestInValid;
        }
        $teamFetchPayload = preparePayloadToCheckTeamDuplicacy($payload);
        $isTeamAlreadyExist = getSingleTeamDetail($teamFetchPayload);
        if ($isTeamAlreadyExist) {
            $teamResponse->errorCode = "12";
            $teamResponse->errorMessage = "Team profile already exist";
            $teamResponse->payload = $isTeamAlreadyExist->id;
            return $teamResponse;
        }
        // if team is not created by coach
        if (CommonUtils::isValid($payload->user_email) || CommonUtils::isValid($payload->user_primary)) {
            $userPayload = preparePayloadForUserRegistration($payload);
            if (!$userPayload) {
                $teamResponse->errorMessage = "User info is not correct";
                return $teamResponse;
            }
            $userRegisterResponse = createUser($userPayload, false);
            if ($userRegisterResponse->status === 0) {
                $teamResponse->errorMessage = "Error in creating user";
                return $teamResponse;
            }
           
        }
            // create coach profiel
        $userPayload = preparePayloadForUserRegistration($payload, true);
        if (!$userPayload) {
            $teamResponse->errorMessage = "Coach info is not correct";
            return $teamResponse;
        }
        $coachRegisterResponse = createUser($userPayload, false);
        if ($coachRegisterResponse->status === 0) {
            $teamResponse->errorMessage = "Error in creating coach profile";
            return $teamResponse;
        }
        // by reaching we are assure that coach and user-profile(if applicable) is created;
        $payload->ownerid = $coachRegisterResponse->payload;
        if (isset($userRegisterResponse)) {
            $payload->createdBy = $userRegisterResponse->payload;
        } else if (isset($payload->userId)) {
            $payload->createdBy = $payload->userId;
        }
        // add team communication detail by copying coach details 
        $payload->team_email = $payload->coach_email;
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TEAM"), true);
        if (CommonUtils::isValid($updateStr)) {
            $sql = "INSERT INTO jos_community_groups set " . $updateStr . "";
            $sth = $db->prepare($sql);
            $sth->execute();
            $createdTeamId = $db->lastInsertId();

            // update sanction number for team
            $state_code = fetchStateCode($payload->state);
            $sanctionNo = prepareTeamSanctionNumber($state_code, $createdTeamId);
            $updateTeamPayload = new stdClass();
            $updateTeamPayload->team_sanction = $sanctionNo;
            $updateTeamPayload->teamId = $createdTeamId;
            updateTeamDetails($updateTeamPayload);
            // add team member info for
            $memberPayload = new stdClass();
            $memberPayload->groupid = $createdTeamId;
            $memberPayload->memberid = $payload->ownerid;
            $memberPayload->approved = 1;
            $memberPayload->permissions = 1;
            insertTeamMember($memberPayload);
            // add if teams is not created by coach
            if (isset($userRegisterResponse)) {
                $memberPayload->memberid = $userRegisterResponse->payload;
                insertTeamMember($memberPayload);
            }
            $res_payload = CommonUtils::prepareResponsePayload(["teamId"], [$createdTeamId]);
            
            return new ActionResponse(1, $res_payload);
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in creating team profile");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function addTeamLogin($payload)
{
    //print_r($payload);die;
    global $db, $logger;
    $teamResponse = new ActionResponse(0, null);
    try {

        $isRequestInValid = isRequestHasValidParameters($payload, ["name", "agegroup", "state"]);
        if ($isRequestInValid) {
            return $isRequestInValid;
        }
        if (!$payload->coach_email) {
            $userId = $payload->userId;
            $user_detail = getUserDetailByUserId($userId);
            $payload->coach_email = $user_detail->email;
            //  print_r($payload->coach_email);die;
        }
        $teamFetchPayload = preparePayloadToCheckTeamDuplicacy($payload);
        $isTeamAlreadyExist = getSingleTeamDetail($teamFetchPayload);
        if ($isTeamAlreadyExist) {
            $teamResponse->errorCode = "12";
            $teamResponse->errorMessage = "Team profile already exist";
            $teamResponse->payload = $isTeamAlreadyExist->id;
            return $teamResponse;
        }
        // if team is not created by coach        

        // create coach profile
        $userPayload = preparePayloadForUserRegistration($payload, true);
        if (!$userPayload) {
            $teamResponse->errorMessage = "Coach info is not correct";
            return $teamResponse;
        }
        $coachRegisterResponse = createUser($userPayload, false);
        if ($coachRegisterResponse->status === 0) {
            $teamResponse->errorMessage = "Error in creating coach profile";
            return $teamResponse;
        }
        // by reaching we are assure that coach and user-profile(if applicable) is created;
        $payload->ownerid = $coachRegisterResponse->payload;
        if (isset($payload->userId)) {
            $payload->createdBy = $payload->userId;
        }
        // add team communication detail by copying coach details 
        $payload->team_email = $payload->coach_email;
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TEAM"), true);
        if (CommonUtils::isValid($updateStr)) {
            $sql = "INSERT INTO jos_community_groups set " . $updateStr . "";
            // print_r($sql);die;
            $sth = $db->prepare($sql);
            $sth->execute();
            $createdTeamId = $db->lastInsertId();

            // update sanction number for team
            $state_code = fetchStateCode($payload->state);
            $sanctionNo = prepareTeamSanctionNumber($state_code, $createdTeamId);
            $updateTeamPayload = new stdClass();
            $updateTeamPayload->team_sanction = $sanctionNo;
            $updateTeamPayload->teamId = $createdTeamId;
            updateTeamDetails($updateTeamPayload);
            // add team member info for
            $memberPayload = new stdClass();
            $memberPayload->groupid = $createdTeamId;
            $memberPayload->memberid = $payload->ownerid;
            $memberPayload->approved = 1;
            $memberPayload->permissions = 1;
            insertTeamMember($memberPayload);
            // add if teams is not created by coach           
            $res_payload = CommonUtils::prepareResponsePayload(["teamId"], [$createdTeamId]);
            return new ActionResponse(1, $res_payload);
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in creating team profile");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function updateTeam($payload)
{
    //print_r($payload);die;
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId", "name", "agegroup", "sportId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $teamUpdateRes = new ActionResponse(0, null);
    $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TEAM"), true);
    // TODO: need to think about how to stop duplicate team  creation 
    if (CommonUtils::isValid($updateStr)) {
        $sql = "update jos_community_groups set" . $updateStr;
        $sql .= " where id=" . $payload->teamId;
        //echo($sql);die;
        $sth = $db->prepare($sql);
        $res = $sth->execute();
        if (CommonUtils::isValid($res)) {
            $teamUpdateRes->status = 1;
            $res_payload = CommonUtils::prepareResponsePayload(["teamId"], [$payload->teamId]);
            $teamUpdateRes->payload = $res_payload;
        } else {
            $teamUpdateRes->errorMessage = "Error in updating team";
            $logger->error("Error in updating team for payload");
            $logger->error(json_encode($payload));
            $logger->error($sql);
        }
    } else {
        $teamUpdateRes->errorMessage = "Error in updating team";
        $logger->error("Error in generating update string for team for payload");
        $logger->error(json_encode($payload));
    }
    return $teamUpdateRes;
}

function fetchStateCode($state)
{
    global $db, $logger;
    $query = "SELECT  state_code  from jos_states where state='" . $state . "'";
    $sth = $db->prepare($query);
    $sth->execute();
    $result = $sth->fetch();
    return $result["state_code"];
}

function prepareTeamSanctionNumber($state_code, $teamId)
{
    return $state_code . $teamId;
}


function insertTeamMember($payload)
{
    global $db, $logger;
    $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TEAMMEMBER"));
    if (CommonUtils::isValid($updateStr)) {
        $sql = "INSERT INTO jos_community_groups_members set " . $updateStr . "";
        $sth = $db->prepare($sql);
        $sth->execute();
        return new ActionResponse(1, true);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchTeamListByEmail($payload)
{
    $isRequestInValid = isRequestHasValidParameters($payload, ["search_email"]);

    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $teamResponse = new ActionResponse(0, null);
    $userPayload = new stdClass();
    $userPayload->email = $payload->search_email;
    $userDeatils = fetchSingleUser($userPayload);
    //print_r($userDeatils);die;
    if (!CommonUtils::isValid($userDeatils)) {
        $teamResponse->errorMessage = "User Not found";
        $teamResponse->errorCode = "11000";
        return $teamResponse;
    } else {
        $teamPayload = new stdClass();
        $teamPayload->memberid = $userDeatils['id'];
        $teamPayload->isPagingRequired = false;
        $teamPayload->columnToFetch = ["t.id", "t.name as title"];
        $teamResponse = fetchTeamList($teamPayload);
        if ($teamResponse->status === 0) {
            $teamResponse->errorMessage = "Team Not found";
            $teamResponse->errorCode = "11000";
        }
    }
    return $teamResponse;
}

function fetchTeamList($payload)
{
    //echo "<pre>";
    // print_r($payload);die;
    global $db, $logger;
    $teamResponse = new ActionResponse(0, null);
    $whereCondition = DataBaseUtils::getWhereConditionArrayBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TEAM"), "t");
    $userWhereCondition = DataBaseUtils::getWhereConditionArrayBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TEAMMEMBER"), "gm");
    $tournamentWhereCondtion = array();
    if (isset($payload->columnToFetch)) {
        $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload, "t");
    } else {
        $columnToFetch = "t.id as teamId, t.team_primary, t.team_state, t.group_banner, t.name as name, a.agegroup as agegroup, s.name as sport, u.name as coach, c.classification as classification";
    }
    if (isset($payload->tournamentId) && $payload->tournamentId) {
        $tournamentWhereCondtion = DataBaseUtils::getWhereConditionArrayBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENTTEAMS"), "td");
    }
    $whereAr = array_merge($whereCondition, $userWhereCondition, $tournamentWhereCondtion);
    $whereStr = DataBaseUtils::getWhereStringFromArray($whereAr);
    $query = "SELECT  $columnToFetch";
    // $query = "SELECT  t.id as teamId, t.name as name, s.name as sport";
    $query .= " from jos_community_groups as t ";
    $query .= " left join jos_league_agegroup as a on t.age = a.id  and t.categoryid = a.sports_type_id";
    $query .= " left join jos_league_classification as c on t.team_classification = c.id  and t.categoryid = c.sportstypeid";
    $query .= " left join jos_community_groups_category as s on t.categoryid = s.id";
    $query .= " left join jos_community_groups_members as gm on gm.groupid = t.id";
    $query .= " left join jos_users as u on gm.memberid = u.id";
    if (isset($payload->tournamentId) && $payload->tournamentId) {
        $query .= " left join jos_tournament_details as td on td.tournament_teams=t.id";
    }
    $query .= $whereStr;
    $query .= " order by t.id desc, t.name";
    // echo $query;
    $result = prepareQueryResult($db, $query, $payload);
    //print_r($result);die;

    if ($result) {
        addOwnerShipDetailsIfApplicable($payload, $result);
        // echo "<pre>";
        // print_r($result);
        // die;
        return $result;
    } else {
        $errorMsg = "Team Profile result is not valid";
        $teamResponse->errorMessage = $errorMsg;
        $logger->error($errorMsg);
    }
    return $teamResponse;
}

function hasAccessToUpdateTeam($userDetails, $teamDetails)
{
    global $db, $logger;
    $userId = $userDetails->userId;
    $teamId = $teamDetails['teamId'];
    // print_r($userDetails);
    $sql = " select permissions from jos_community_groups_members where memberid = $userId and groupid = $teamId ";
    $sth = $db->prepare($sql);
    $sth->execute();
    $res = $sth->fetchObject();
    if ($res && $res->permissions == 1) {
        return true;
    }
    return false;
}

function addOwnerShipDetailsIfApplicable($payload, &$result, $type = "team")
{
    if (isset($payload->requireOwnership) && $payload->requireOwnership) {
        if (isset($payload->token) && $payload->token) {
            $userDeatils = getUserDetailsFromToken($payload->token);
            if ($userDeatils && isset($result->payload) && isset($result->payload->data)) {
                foreach ($result->payload->data as &$dataObj) {
                    if ($type === "team") {
                        $ownershipDetails = new stdClass();
                        // print_r($dataObj);die;
                        $ownershipDetails->isOwner = hasAccessToUpdateTeam($userDeatils, $dataObj);
                        $dataObj['ownershipDetails'] = $ownershipDetails;
                    }
                }
            }
        }
    }
}

function fetchTeamDetail($payload)
{
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
    if (!CommonUtils::isValid($columnToFetch) && !isset($payload->columnToFetch) && count($payload->columnToFetch) === 0) {
        return new ActionResponse(0, null);
    }
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TEAM"));
    $query = "SELECT  $columnToFetch , id as teamId, age as agegroup, team_classification as classification, team_cell as team_secondary from jos_community_groups";
    // $query = "SELECT  t.id as teamId, t.name as name, s.name as sport";
    $query .= $whereCondition;
    // echo $query;
    $sth = $db->prepare($query);
    $sth->execute();
    $result = $sth->fetch();
    if (CommonUtils::isValid($result)) {
        $dataResponse = new DataResponse();
        if (isset($payload->columnToFetch) && CommonUtils::isValid($payload->columnToFetch)) {
            $dataResponse->data = $result[$payload->columnToFetch[0]];
        } else {
            $dataResponse->data = $result;
        }
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function getTeamName($teamId)
{
    $teamPayload = new stdClass();
    $teamPayload->teamId = $teamId;
    $teamPayload->columnToFetch = ["name"];
    $teamDetails = fetchTeamDetail($teamPayload);
    if ($teamDetails->status == 1) {
        return $teamDetails->payload->data;
    }
    return null;
}

function getTeamSportId($teamId)
{
    global $logger;
    $detailPayload = new stdClass();
    $detailPayload->teamId = $teamId;
    $detailPayload->columnToFetch = ["categoryId"];
    $detailResult = fetchTeamDetail($detailPayload);
    if ($detailResult->status === 1) {
        return $detailResult->payload->data;
    } else {
        $logger->error(" Error in fetching team sport for team" . $teamId);
    }
}

function getTeamBannerDetails($payload)
{
    global $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId"]);
    if ($isRequestInValid) {
        $isRequestInValid->errorMessage = " Require parameter is not provided in getTeamBannerDetail call";
        return $isRequestInValid;
    }
    $detailPayload = new stdClass();
    $detailPayload->teamId = $payload->teamId;
    $detailPayload->columnToFetch = ["group_banner"];
    $detailResult = fetchTeamDetail($detailPayload);
    if ($detailResult->status === 1) {
        $banner_image = $detailResult->payload->data;
        $finalPayload = new stdClass();
        $finalPayload->group_banner = $detailResult->payload->data;
        $detailResult->payload->data = $finalPayload;
        return $detailResult;
    } else {
        $logger->error(" Error in fetching team banner for team" . $payload->teamId);
    }
}

function updateTeamDetails($payload)
{
    global $db, $logger;
    // TODO: check for access 
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // prevenet setting id in query
    $teamId = $payload->teamId;
    // unset($payload->teamId);
    $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TEAM"));
    if (!CommonUtils::isValid($updateStr)) {
        return new ActionResponse(0, null);
    }
    $query = "update jos_community_groups set";
    $query .= $updateStr;
    $query .= " where id =" . $teamId;
    $sth = $db->prepare($query);
    $sth->execute();
    // echo $query;
    if (CommonUtils::isValid($sth)) {
        $dataResponse = new DataResponse();
        $resultData = new stdClass();
        $resultData->teamId = $teamId;
        if (isset($payload->tournamentId)) {
            $resultData->tournamentId = $payload->tournamentId;
        }
        $dataResponse->data = $resultData;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}


function updateTeamGalleryImages($payload, $filesData)
{
    global $db, $logger;
    // TODO: check for access
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // prevenet setting id in query
    $teamId = $payload->teamId;
    $gallery_details = $payload->galleryDetails;
    $gallery_response = new ActionResponse(0, null);
    $isAnyImageAdded = false;
    $updatedImageIds = array();
    if (CommonUtils::isValid($gallery_details)) {
        foreach ($gallery_details as &$detail) {
            $galleryPayload = new stdClass();
            $isUpdate = false;
            $fileNameForStore = null;
            if (isset($detail->gallery_image_id) && CommonUtils::isValid($detail->gallery_image_id)) {
                $previous_id = $detail->gallery_image_id;
                $isUpdate = true;
            }
            if ((CommonUtils::isValid($detail->gallery_image_hidden) || $isUpdate)) {
                $isFileUploadSuccess = false;
                if (isset($filesData[$detail->gallery_image_hidden])) {
                    // print_r($filesData[$detail->player_image_hidden]->name);
                    $name = $filesData[$detail->gallery_image_hidden]->getClientFilename();
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    $fileNameForStore = $detail->gallery_image_hidden . "." . $ext;
                    $isFileUploadSuccess = uploadTeamGalleryImage($filesData[$detail->gallery_image_hidden], $fileNameForStore, $teamId);
                } else {
                    $logger->error("image not found in data");
                }
                if ($isFileUploadSuccess || $isUpdate) {
                    $queryType = " Insert into";
                    $where = "";
                    if ($isUpdate) {
                        $queryType = " update ";
                        $where = " where id=" . $previous_id;
                    }
                    // echo "Image upload success";
                    $galleryPayload->teamId = $teamId;
                    if ($fileNameForStore) {
                        $galleryPayload->main_image = $fileNameForStore;
                    }
                    $updateStr = DatabaseUtils::getUpdateString($db, $galleryPayload, MetaUtils::getMetaColumns("TEAMGALLERY"));
                    $query = "$queryType gsa_team_gallery set";
                    $query .= $updateStr;
                    $query .= $where;
                    // echo $query;
                    $sth = $db->prepare($query);
                    $sth->execute();

                    if ($sth) {
                        $isAnyImageAdded = true;
                        if ($isUpdate) {
                            array_push($updatedImageIds, $previous_id);
                        } else {
                            array_push($updatedImageIds, $db->lastInsertId());
                        }
                    }
                } else {
                    $logger->error("gallery image is not valid for team Id" . $payload->teamId);
                    $logger->error(json_encode($detail));
                }
            } else {
                $logger->error("Gallery details is not valid for team Id" . $payload->teamId);
                $logger->error(json_encode($detail));
            }
        }
    }
    // echo $query;
    // die;
    if ($isAnyImageAdded) {
        $res_payload = CommonUtils::prepareResponsePayload(["teamId"], [$teamId]);
        deleteNonUpdatedTeamGalleryImages($updatedImageIds, $teamId);
        return new ActionResponse(1, $res_payload);
    } else {
        $gallery_response->errorMessage = " Player details is not valid";
        return $gallery_response;
    }
}


function deleteNonUpdatedTeamGalleryImages($updatedImageIds, $teamId)
{
    global $db, $logger;
    if (CommonUtils::isValid($updatedImageIds)) {
        $idStr = implode(",", $updatedImageIds);
        $sql = " select main_image from gsa_team_gallery where 
        id not in ($idStr) and teamId = $teamId";
        $sth = $db->prepare($sql);
        $sth->execute();
        $all_images = $sth->fetchAll();
        if (CommonUtils::isValid($all_images)) {
            $teamRosterPath = getTeamGalleryImagePath($teamId);
            foreach ($all_images as $single_image_obj) {
                $imageToDelete = $teamRosterPath . "/" . $single_image_obj['main_image'];
                deleteFile($imageToDelete);
            }
        }
        $sql = " delete from gsa_team_gallery where 
        id not in ($idStr) and teamId = $teamId";
        $sth = $db->prepare($sql);
        $sth->execute();
    }
}

function addRoster($payload, $filesData)
{
    // echo "<pre>";
    //  print_r($filesData);
    global $db, $logger;
    // TODO: check for access
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId", "season_year"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // prevenet setting id in query
    $teamId = $payload->teamId;
    $player_details = $payload->playerDetails;
    $season_year = $payload->season_year;
    $roster_response = new ActionResponse(0, null);
    $isAnyPlayerAdded = false;
    $updatedRosterIds = array();
    if (CommonUtils::isValid($player_details)) {
        foreach ($player_details as &$detail) {
            $playerPayload = new stdClass();
            $isUpdate = false;
            $fileNameForStore = null;
            if (isset($detail->player_roster_id) && CommonUtils::isValid($detail->player_roster_id)) {
                $previous_id = $detail->player_roster_id;
                $isUpdate = true;
            }
            if ((CommonUtils::isValid($detail->player_image_hidden) || $isUpdate) && CommonUtils::isValid($detail->name)
                && CommonUtils::isValid($detail->position)
            ) {
                $isFileUploadSuccess = false;
                if (isset($filesData[$detail->player_image_hidden])) {
                    // print_r($filesData[$detail->player_image_hidden]->name);
                    $name = $filesData[$detail->player_image_hidden]->getClientFilename();
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    $fileNameForStore = $detail->player_image_hidden . "." . $ext;
                    $isFileUploadSuccess = addRosterPlayerImages($filesData[$detail->player_image_hidden], $fileNameForStore, $teamId);
                } else {
                    $logger->error("image not found in data");
                }
                if ($isFileUploadSuccess || $isUpdate) {
                    $queryType = " Insert into";
                    $where = "";
                    if ($isUpdate) {
                        $queryType = " update ";
                        $where = " where id=" . $previous_id;
                    }
                    // echo "Image upload success";
                    $playerPayload->teamId = $teamId;
                    $playerPayload->season_year = $season_year;
                    if ($fileNameForStore) {
                        $playerPayload->player_image = $fileNameForStore;
                    }
                    $playerPayload->player_name = $detail->name;
                    $playerPayload->player_position = $detail->position;
                    $updateStr = DatabaseUtils::getUpdateString($db, $playerPayload, MetaUtils::getMetaColumns("TEAMROSTER"));
                    $query = "$queryType gsa_team_roster set";
                    $query .= $updateStr;
                    $query .= $where;
                    // echo $query;
                    $sth = $db->prepare($query);
                    $sth->execute();

                    if ($sth) {
                        $isAnyPlayerAdded = true;
                        if ($isUpdate) {
                            array_push($updatedRosterIds, $previous_id);
                        } else {
                            array_push($updatedRosterIds, $db->lastInsertId());
                        }
                    }
                } else {
                    $logger->error("player image is not valid for team Id" . $payload->teamId);
                    $logger->error(json_encode($detail));
                }
            } else {
                $logger->error("player details is not valid for team Id" . $payload->teamId);
                $logger->error(json_encode($detail));
            }
        }
    }

    if ($isAnyPlayerAdded) {
        $res_payload = CommonUtils::prepareResponsePayload(["teamId"], [$teamId]);
        deleteNonUpdatedRosterPlayers($updatedRosterIds, $season_year, $teamId);
        return new ActionResponse(1, $res_payload);
    } else {
        $roster_response->errorMessage = " Player details is not valid";
        return $roster_response;
    }
}

function deleteNonUpdatedRosterPlayers($updatedRosterIds, $season_year, $teamId)
{
    global $db, $logger;
    if (CommonUtils::isValid($updatedRosterIds)) {
        $idStr = implode(",", $updatedRosterIds);
        $sql = " select image from gsa_team_roster where 
        id not in ($idStr) and season_year=$season_year and teamId = $teamId";
        $sth = $db->prepare($sql);
        $sth->execute();
        $all_images = $sth->fetchAll();
        if (CommonUtils::isValid($all_images)) {
            $teamRosterPath = getTeamRosterImagePath($teamId);
            foreach ($all_images as $single_image_obj) {
                $imageToDelete = $teamRosterPath . "/" . $single_image_obj['image'];
                deleteFile($imageToDelete);
            }
        }
        $sql = " delete from gsa_team_roster where 
        id not in ($idStr) and season_year=$season_year and teamId = $teamId";
        $sth = $db->prepare($sql);
        $sth->execute();
    }
}

function addTeamGalleryImages($payload, $filesData)
{
    global $db, $logger;
    // TODO: check for access
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // prevenet setting id in query
    $teamId = $payload->teamId;
    $roster_response = new ActionResponse(0, null);
    $isAnyImageAdded = false;
    if (CommonUtils::isValid($filesData)) {
        foreach ($filesData as $fileName => $file) {
            $name = $filesData[$fileName]->getClientFileName();
            $ext = pathinfo($name, PATHINFO_EXTENSION);
            $fileNameForStore = $fileName . "." . $ext;
            $isFileUploadSuccess = uploadTeamGalleryImage($filesData[$fileName], $fileNameForStore, $teamId);
            if ($isFileUploadSuccess) {
                $galleryPayload = new stdClass();
                $galleryPayload->teamId = $teamId;
                $galleryPayload->main_image = $fileNameForStore;
                $updateStr = DatabaseUtils::getUpdateString($db, $galleryPayload, MetaUtils::getMetaColumns("TEAMGALLERY"));
                $query = "insert into gsa_team_gallery set";
                $query .= $updateStr;
                $sth = $db->prepare($query);
                $sth->execute();
                if ($sth) {
                    $isAnyImageAdded = true;
                }
            } else {
                $logger->error("gallery image is not valid for team Id" . $payload->teamId);
                $logger->error($fileName);
            }
        }
    }
    // echo $query;
    if ($isAnyImageAdded) {
        $res_payload = CommonUtils::prepareResponsePayload(["teamId"], [$teamId]);
        return new ActionResponse(1, $res_payload);
    } else {
        $roster_response->errorMessage = " Gallery images were not valid";
        return $roster_response;
    }
}

function updateTeamBannerImgae($payload, $filesData)
{
    // echo "check response";
    global $db, $logger;

    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // prevenet setting id in query
    $teamId = $payload->teamId;
    $banner_response = new ActionResponse(0, null);
    $isAnyImageAdded = false;
    if (CommonUtils::isValid($filesData)) {
        foreach ($filesData as $fileName => $file) {
            $name = $filesData[$fileName]->getClientFileName();
            $ext = pathinfo($name, PATHINFO_EXTENSION);
            $fileNameForStore = $fileName . "." . $ext;
            $isFileUploadSuccess = uploadTeamBannerImage($filesData[$fileName], $fileNameForStore, $teamId);
            if ($isFileUploadSuccess) {
                $query = "select group_banner from jos_community_groups where id = $teamId";
                $sth = $db->prepare($query);
                $sth->execute();
                $banner_res = $sth->fetchObject();
                $previous_banner = $banner_res->group_banner;
                if (CommonUtils::isValid($previous_banner)) {
                    $banner_path = getTeamBannerImagePath($teamId);
                    $banner_path = $banner_path . '/' . $previous_banner;
                    deleteFile($banner_path);
                }
                $query = "update jos_community_groups set group_banner='" . $fileNameForStore . "' where id = $teamId";
                $sth = $db->prepare($query);
                $sth->execute();
                if ($sth) {
                    $isAnyImageAdded = true;
                }
            } else {
                $logger->error("gallery image is not valid for team Id" . $payload->teamId);
                $logger->error($fileName);
            }
        }
    }
    // echo $query;
    if ($isAnyImageAdded) {
        $res_payload = CommonUtils::prepareResponsePayload(["teamId"], [$teamId]);
        return new ActionResponse(1, $res_payload);
    } else {
        $banner_response->errorMessage = " details are not valid";
        return $banner_response;
    }
}

function getTeamGalleryImagePath($teamId)
{
    $directory = SITE_ROOT_IMAGE_FOLDER_PATH;
    $teamPathParent = $directory . DIRECTORY_SEPARATOR . "teams";
    $teamPath = $teamPathParent . DIRECTORY_SEPARATOR . $teamId;
    $galleryPath = $teamPath . DIRECTORY_SEPARATOR . "gallery";
    createDirectory($teamPath);
    createDirectory($galleryPath);
    return $galleryPath;
}

function getTeamThumbnailImagePath($teamId)
{
    $directory = SITE_ROOT_IMAGE_FOLDER_PATH;
    $teamPathParent = $directory . DIRECTORY_SEPARATOR . "teams";
    $teamPath = $teamPathParent . DIRECTORY_SEPARATOR . $teamId;
    $galleryPath = $teamPath . DIRECTORY_SEPARATOR . "gallery";
    $thumbnailPath = $galleryPath . DIRECTORY_SEPARATOR . "thumbnail";
    createDirectory($teamPath);
    createDirectory($galleryPath);
    createDirectory($thumbnailPath);
    return $thumbnailPath;
}

function getTeamBannerImagePath($teamId)
{
    $directory = SITE_ROOT_IMAGE_FOLDER_PATH;
    $teamPathParent = $directory . DIRECTORY_SEPARATOR . "teams";
    $teamPath = $teamPathParent . DIRECTORY_SEPARATOR . $teamId;
    $galleryPath = $teamPath . DIRECTORY_SEPARATOR . "banner";
    createDirectory($teamPath);
    createDirectory($galleryPath);
    return $galleryPath;
}

function getTeamRosterImagePath($teamId)
{
    $directory = SITE_ROOT_IMAGE_FOLDER_PATH;
    $teamPathParent = $directory . DIRECTORY_SEPARATOR . "teams";
    $teamPath = $teamPathParent . DIRECTORY_SEPARATOR . $teamId;
    $rosterPath = $teamPath . DIRECTORY_SEPARATOR . "roster";
    createDirectory($teamPath);
    createDirectory($rosterPath);
    return $rosterPath;
}


function addRosterPlayerImages($file, $fileName, $teamId)
{
    global $logger;
    $rosterPath = getTeamRosterImagePath($teamId);
    if (CommonUtils::isValid($file)) {

        $sizeOfImage = getImageSizeInMB($file);
        if ($sizeOfImage > ROSTER_IMAGE_SIZE_LIMIT) {
            return false;
        }
        $finalFilePath = moveUploadedFile($rosterPath, $file, $fileName);
        if ($finalFilePath) {
            if (resizeImage($finalFilePath, ROSTER_IMAGE_WIDTH, ROSTER_IMAGE_HEIGHT)) {
                return true;
            } else {
                $logger->error("resize function is failed ");
                deleteFile($finalFilePath);
                return false;
            }
        }
    }
    return false;
}

function uploadTeamGalleryImage($file, $fileName, $teamId)
{
    global $logger;
    $rosterPath = getTeamGalleryImagePath($teamId);
    $thumbnailPath = getTeamThumbnailImagePath($teamId);
    if (CommonUtils::isValid($file)) {
        $finalFilePath = moveUploadedFile($rosterPath, $file, $fileName);
        if ($finalFilePath) {
            if (compressImage($finalFilePath, GALLERY_IMAGE_QUALITY)) {

                $thumbnailPathFinalPah =   $thumbnailPath . DIRECTORY_SEPARATOR . $fileName;
                if (resizeImage($finalFilePath, THUMBNAIL_IMAGE_WIDTH, THUMBNAIL_IMAGE_HEIGHT, false, $thumbnailPathFinalPah)) {
                    return true;
                } else {
                    $logger->error("Make Gallary thumbnail is Failed");
                    deleteFile($thumbnailPath);
                    return false;
                }
            } else {
                $logger->error("Compress Gallary Image is Failed");
                deleteFile($finalFilePath);
                return false;
            }
        }
    }
    return false;
}


function uploadTeamBannerImage($file, $fileName, $teamId)
{
    // print_r($fileName);die;
    global $logger;
    $bannerPath = getTeamBannerImagePath($teamId);
    $sizeOfImage = getImageSizeInMB($file);
    if ($sizeOfImage > BANNER_IMAGE_SIZE_LIMIT) {
        return false;
    }

    if (CommonUtils::isValid($file)) {
        $finalFilePath = moveUploadedFile($bannerPath, $file, $fileName);
        if ($finalFilePath) {
            if (isValidBanner($finalFilePath, BANNER_IMAGE_MIN_RESOLUTION, BANNER_IMAGE_MAX_RESOLUTION, BANNER_IMAGE_MIN_WIDTH, BANNER_IMAGE_MIN_HIGHT)) {
                compressImage($file, BANNER_IMAGE_QUALITY);
                return true;
            } else {
                $logger->error("Banner Image Is not Valid");
                deleteFile($finalFilePath);
                return false;
            }
        }
    }
    return false;
}

function fetchTeamRoster($payload)
{
    global $db, $logger;
    // TODO: check for access 
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId", "season_year"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // prevenet setting id in query
    $teamId = $payload->teamId;
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TEAMROSTER"), "r");
    if (CommonUtils::isValid($whereCondition)) {
        $query = "select r.id as player_roster_id, r.*  from gsa_team_roster as r ";
        $query .= $whereCondition;
        $sth = $db->prepare($query);
        // echo $query;
        $sth->execute();
        $rosterData = $sth->fetchAll();
        if (CommonUtils::isValid($rosterData)) {
            $res_payload = CommonUtils::prepareResponsePayload(["data"], [$rosterData]);
            return new ActionResponse(1, $res_payload);
        } else {
            return new ActionResponse(0, null, 1, "Roster details is not present");
        }
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchTeamGallery($payload)
{
    global $db, $logger;
    // TODO: check for access 
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // prevenet setting id in query
    $teamId = $payload->teamId;
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TEAMGALLERY"));
    if (CommonUtils::isValid($whereCondition)) {
        $query = "select g.id as gallery_image_id, g.* from gsa_team_gallery as g";
        $query .= $whereCondition;
        $sth = $db->prepare($query);
        // echo $query;
        $sth->execute();
        $rosterData = $sth->fetchAll();
        if (CommonUtils::isValid($rosterData)) {
            // $galleryData = new stdClass();
            // $galleryData->sourceFolder = "assets/images/teams/$teamId/gallery/";
            // $galleryData->imagesData = $rosterData;
            $res_payload = CommonUtils::prepareResponsePayload(["data"], [$rosterData]);
            return new ActionResponse(1, $res_payload);
        } else {
            return new ActionResponse(0, null, 1, "Gallery details is not present");
        }
    } else {
        return new ActionResponse(0, null);
    }
}
