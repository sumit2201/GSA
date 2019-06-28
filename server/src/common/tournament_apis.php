<?php
use FastRoute\RouteParser\Std;

require_once("utility.php");


function fetchTournamentList($payload)
{
    global $db, $logger;
    $orderBy = "";
    if (isset($payload->orderBy) && CommonUtils::isValid($payload->orderBy)) {
        $orderBy = $payload->orderBy;
    } else {
        $orderBy = " ORDER BY CONCAT(SUBSTR(DATE_ADD(t.`start_date`,INTERVAL 6 DAY),4) < SUBSTR(CURDATE(),4), SUBSTR(DATE_ADD(t.`start_date`,INTERVAL 6 DAY),4)) ";
    }
    if (!isset($payload->columnToFetch) || !CommonUtils::isValid($payload->columnToFetch)) {
        $payload->columnToFetch = ["t.id as tournamentId, t.title as tournament_title, t.start_date, t.end_date,t.state"];
    }
    $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
    $whereCondition = DataBaseUtils::getWhereConditionArrayBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENT"), "t");
    // $whereConditionOfTeam = DataBaseUtils::getWhereConditionArrayBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENTTEAMS"), "tt");
    $whereConditionOfTeam = array();
    if (isset($payload->onlyUpcoming) && $payload->onlyUpcoming == true) {
        $date = date("Y-m-d");
        $whereCondition[] = "t.start_date > '" . $date . "'";
    }
    $whereAr = array_merge($whereCondition, $whereConditionOfTeam);
    $whereStr = DataBaseUtils::getWhereStringFromArray($whereAr);
    $query = "SELECT s.name as sport, u.name as director, u.email,u.primary, t.numberofgames, t.id as tournamentId, t.description, count(tt.tournament_teams) as numberOfTeams, $columnToFetch  from jos_gsa_tournament as t";
    // $query = "SELECT  t.id as teamId, t.name as name, s.name as sport";
    $query .= " left join jos_tournament_details as tt on t.id=tt.tournament_id";
    $query .= " left join jos_users as u on t.postedBy=u.id";
    $query .= " left join jos_community_groups_category as s on t.sportstypeid=s.id";
    $query .= $whereStr;
    $query .= " group by t.id";
    $query .= $orderBy;
    $result = prepareQueryResult($db, $query, $payload);
    //echo $query;
    if ($result) {
        return $result;
    }
    return new ActionResponse(0, null);
}

function fetchTournamentForDropDown($payload)
{
    global $db, $logger;
    $tResponse = new ActionResponse(0, null);
    $isRequestInValid = isRequestHasValidParameters($payload, ["directorId"]);
    if ($isRequestInValid) {
        $tResponse->errorMessage = "Request is not valid for tournament list";
        return $tResponse;
    }
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENT"), "t");
    if (CommonUtils::isValid($whereCondition)) {
        $query = " select t.id, t.title, t.start_date, t.end_date from jos_gsa_tournament as t";
        $query .= $whereCondition;
        $orderBy = " ORDER BY t.start_date desc";
        $query .= $orderBy;
        $sth = $db->prepare($query);
        $sth->execute();
        // echo $query;
        $allTournamentsOfDirector = $sth->fetchAll();
        $finalData = array();
        if (CommonUtils::isValid($allTournamentsOfDirector)) {
            foreach ($allTournamentsOfDirector as $singleTournament) {
                $rowObj = array();
                $dates = getTournamentdates($singleTournament['start_date'], $singleTournament['end_date']);
                $rowObj['title'] = $dates;
                $rowObj['id'] = $singleTournament['id'];
                array_push($finalData, $rowObj);
            }
            $dataResponse = new DataResponse();
            $dataResponse->data = CommonUtils::UTF_ENCODE($finalData);
            $tResponse->status = 1;
            $tResponse->payload = $dataResponse;
        }
    }
    return $tResponse;
}

function fetchTournamentFees($payload)
{
    global $db, $logger;
    $feesResponse = new ActionResponse(0, null);
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId"]);
    if ($isRequestInValid) {
        $feesResponse->errorMessage = "Request is not valid for tournament fees";
        return $feesResponse;
    }
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENTFEES"), "tf");
    if (CommonUtils::isValid($whereCondition)) {
        try {
            $sql = "SELECT min(a.age) as minAge , max(a.age) as maxAge  , tf.cost as fees, tf.tournamentId FROM `jos_gsa_tournament_agecost` as tf left join `jos_league_agegroup` as a 
    on tf.agegroup=a.age ";
            $sql .= $whereCondition;
            $sql .= " group by tf.cost";
            $sth = $db->prepare($sql);
            // echo $sql;
            $sth->execute();
            $result = $sth->fetchAll();
            $finalData = array();
            $singeTournamentData = getSingleTournamentDetail($payload->tournamentId);
            // fetch gate fees and reservation fees
            //print_r($teamfeedata);
            if ($result) {
                // print_r($result);
                foreach ($result as $row) {
                    $res = new stdClass();
                    $dataResponse = new DataResponse();
                    // create 5 keys
                    $startAgegroup = fetchAgegroupById($row['minAge']);
                    $endAgegroup = fetchAgegroupById($row['maxAge']);
                    $res->fromAgegroup = $row['minAge'];
                    $res->toAgegroup = $row['maxAge'];
                    $res->cost = $row['fees'];
                    $res->division = $startAgegroup . "-" . $endAgegroup;
                    $res->fees = $row['fees'];
                    $res->gateFees = $singeTournamentData->gate_fees;
                    $res->reservationFees = $singeTournamentData->reservation_fees;
                    $total = $row['fees'] + $singeTournamentData->gate_fees + $singeTournamentData->reservation_fees;
                    $res->total = $total; // add fees in total
                    array_push($finalData, $res);
                }
            }
            $dataResponse->data = $finalData;
            return new ActionResponse(1, $dataResponse);
        } catch (Exception $e) {
            $logger->error("Error in fetching tournament fees");
            $logger->error($e->getMessage());
            $logger->error(json_encode($payload));
            $feesResponse->errorMessage = "Error in fetching tournament fees ";
            return $feesResponse;
        }
    } else {
        $feesResponse->errorMessage = "Request is not valid for tournament fees";
    }
}


function getTournamentDetail($payload)
{
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $result = getSingleTournamentDetail($payload->tournamentId);
    if (CommonUtils::isValid($result)) {
        $dataResponse = new DataResponse();
        // in order to prefill values in form add some keys matching with field id of forms
        $result->sportId = $result->sportstypeid;
        // fetch tournament fees records
        $feesPayload = new stdClass();
        $feesPayload->tournamentId = $payload->tournamentId;
        $tournamentFeesResponse = fetchTournamentFees($feesPayload);
        if ($tournamentFeesResponse->status === 1) {
            $result->fees = $tournamentFeesResponse->payload->data;
        }
        // fetch park details for tournament
        $parkPayload = new stdClass();
        $parkPayload->tournamentId = $payload->tournamentId;
        if (CommonUtils::isValid($result->parkIds)) {
            $parkPayload->columnToFetch = [" id as parkId"];
            $tournamentParkResponse = fetchParkDetailsForTournament($parkPayload);
            if ($tournamentParkResponse->status === 1) {
                $result->parkDetails = $tournamentParkResponse->payload->data;
            }
        }
        $dataResponse->data = $result;
        // echo "<pre>";
        // print_r($result);
        // die;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, $dataResponse);
    }
}

function getSingleTournamentDetail($tournamentId)
{
    //print_r($tournamentId);die;
    global $db;
    if ($tournamentId) {
        $sql = "SELECT * FROM `jos_gsa_tournament` WHERE `id`='$tournamentId'";
        $res = $db->prepare($sql);
        $res->execute();
        if ($res) {
            $result = $res->fetchObject();
            return $result;
        }
    }
}

function addTournament($payload)
{
    // print_r($payload);die;
    global $db, $logger;
    try {
        echo "<pre>";
        print_r($payload);
        // die;
        $actionResponse = new ActionResponse(0, null);
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TOURNAMENT"), true);
        echo $updateStr;die;
        if (CommonUtils::isValid($updateStr)) {
            try {
                $tournamentId = null;
                $initStr = "INSERT INTO ";
                if (isset($payload->tournamentId) && CommonUtils::isValid($payload->tournamentId)) {
                    $initStr = " UPDATE ";
                    $tournamentId = $payload->tournamentId;
                }
                $sql = "$initStr jos_gsa_tournament set " . $updateStr . "";
                $sth = $db->prepare($sql);
                $sth->execute();
            } catch (PDOException $e) {
                $actionResponse->errorMessage = "Could not add tournament details";
                return $actionResponse;
            }
            if (CommonUtils::isValid($tournamentId)) {
                $inserted_tournament_id = $tournamentId;
            } else {
                $inserted_tournament_id = $db->lastInsertId();
            }
            $isFailed = false;
            $tournament_fees_response = addUpdateTournamentFees($inserted_tournament_id, $payload);
            // print_r($tournament_fees_response);die;
            if ($tournament_fees_response->status === 0) {
                $actionResponse->errorMessage = "Could not add tournament fees";
                $isFailed = true;
            }
            // add park details
            if (!$isFailed) {
                $tournament_park_response = addUpdateTournamentParks($inserted_tournament_id, $payload);
                if ($tournament_park_response->status === 0) {
                    $actionResponse->errorMessage = "Could not add tournament parks";
                    $isFailed = true;
                } else {
                    $sql = "update jos_gsa_tournament set parkIds = '" . implode(",", $tournament_park_response->payload) . "' where id = $inserted_tournament_id";
                    $sth = $db->prepare($sql);
                    $sth->execute();
                }
            }
            if ($isFailed && $inserted_tournament_id > 0) {
                $sql = "delete from jos_gsa_tournament where id = $inserted_tournament_id";
                $sth = $db->prepare($sql);
                $sth->execute();
            } else {
                // echo "Tournament creation successful";
                $responseData = CommonUtils::prepareResponsePayload(["tournamentId"], [$inserted_tournament_id]);
                return new ActionResponse(1, $responseData);
            }
        }

        if ($isFailed) {
            return $actionResponse;
        }
    } catch (PDOException $e) {
        $logger->error("Error in inserting tournament details");
        $logger->error($e->getMessage());
        $actionResponse->errorMessage = "Error in inserting tournament details";
        return $actionResponse;
    }
}

function addParkDetail($payload)
{
    global $db, $logger;
    try {
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("PARKS"), true);
        if (CommonUtils::isValid($updateStr)) {
            $sql = "INSERT INTO jos_gsa_parkaddress set " . $updateStr . "";
            $sth = $db->prepare($sql);
            $sth->execute();
            return new ActionResponse(1, $db->lastInsertId());
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in inserting park details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function addUpdateTournamentParks($tournamnetId, $payload)
{
    $parkIdsToReturn = [];
    $isRequestInValid = isRequestHasValidParameters($payload, ["parkDetails"]);
    if ($isRequestInValid) {
        // echo "Request is not valid for park";
        return $isRequestInValid;
    }
    if (CommonUtils::isValid($payload->parkDetails)) {
        foreach ($payload->parkDetails as $parkInfo) {
            $parkIdObj = $parkInfo->parkId;
            if (isset($parkIdObj->value)) {
                array_push($parkIdsToReturn, $parkIdObj->value);
            } else {
                $parkInfo->parkName = $parkInfo->parkId;
                $parkInfo->parkState = $payload->state;
                if (CommonUtils::isValid($parkInfo->parkName) && $parkInfo->parkName !== "") {
                    $parkInsertResponse = addParkDetail($parkInfo);
                    if ($parkInsertResponse->status === 1) {
                        array_push($parkIdsToReturn, $parkInsertResponse->payload);
                    }
                }
            }
        }
        if (CommonUtils::isValid($parkIdsToReturn)) {
            return new ActionResponse(1, $parkIdsToReturn);
        }
    } else {
        return new ActionResponse(0, null);
    }
}

function deleteTournamentFeesRecord($tournamentId, $agegroups = array())
{
    global $db, $logger;
    if (CommonUtils::isValid($agegroups)) {
        foreach ($agegroups as $age) {
            $sql = "delete from jos_gsa_tournament_agecost where tournamentid = $tournamentId and agegroup=$age";
            $sth = $db->prepare($sql);
            $sth->execute();
        }
    } else {
        $sql = "delete from jos_gsa_tournament_agecost where tournamentid = $tournamentId";
        $sth = $db->prepare($sql);
        $sth->execute();
    }
}

function addUpdateTournamentFees($tournamentId, $payload)
{
    global $db, $logger;
    $insertWorked = false;

    if (isset($payload->same_for_all_agroup) && $payload->same_for_all_agroup == "true") {
        if (isset($payload->sportId) && $payload->sportId > 0 && isset($payload->cost)) {
            $payload->columnToFetch = ["age"];
            $agegroupsArrayOfSportResponse = fetchAllAgegroup($payload, true);
            if ($agegroupsArrayOfSportResponse->status === 0) {
                return new ActionResponse(0, null);
            } else {
                $agegroups = $agegroupsArrayOfSportResponse->payload->data;
                deleteTournamentFeesRecord($tournamentId);
                insertTournamentFees($tournamentId, $agegroups, $payload->cost);
                return new ActionResponse(1, $tournamentId);
            }
        } else {
            return new ActionResponse(0, null);
        }
    } else if (isset($payload->fees) && CommonUtils::isValid($payload->fees)) {
        deleteTournamentFeesRecord($tournamentId);
        foreach ($payload->fees as $agegroupObj) {
            if (CommonUtils::isValid($agegroupObj->fromAgegroup) && CommonUtils::isValid($agegroupObj->toAgegroup) && CommonUtils::isValid($agegroupObj->cost)) {
                $insertWorked = true;
                $ageGroupPayload = new stdClass();
                $ageGroupPayload->age = true;
                $ageGroupPayload->from = $agegroupObj->fromAgegroup;
                $ageGroupPayload->to = $agegroupObj->toAgegroup;
                $ageGroupPayload->columnToFetch = ["age"];
                $ageGroupPayload->sportId = $payload->sportId;
                $agegroupsArrayOfSportResponse = fetchAllAgegroup($ageGroupPayload, true);
                if ($agegroupsArrayOfSportResponse->status === 0) {
                    $insertWorked = false;
                } else if ($agegroupObj->cost !== "") {
                    $agegroups = $agegroupsArrayOfSportResponse->payload->data;
                    // safe gurad to prevent multiple agegroup entry for tournament fess
                    deleteTournamentFeesRecord($tournamentId, $agegroups);
                    $inserted = insertTournamentFees($tournamentId, $agegroups, $agegroupObj->cost);
                    if (!$inserted) {
                        $insertWorked = false;
                        $logger->error(" tournament cost entry failed");
                        $logger->error($tournamentId);
                    }
                }
            }
        }
        if ($insertWorked) {
            return new ActionResponse(1, $tournamentId);
        } else {

            return new ActionResponse(0, null);
        }
    } else {

        return new ActionResponse(0, null);
    }
}

function insertTournamentFees($tournamentId, $agegroups, $cost)
{
    global $db, $logger;
    $isWorked = false;
    if (CommonUtils::isValid($agegroups)) {
        foreach ($agegroups as $age) {
            try {
                $sql = "insert into jos_gsa_tournament_agecost values (null,$tournamentId,$age,$cost)";
                $sth = $db->prepare($sql);
                $sth->execute();
                $isWorked = true;
            } catch (PDOException $e) {
                $logger->error("Error in inserting tournament cost details");
                $logger->error($e->getMessage());
                return new ActionResponse(0, null);
            }
        }
    }
    return $isWorked;
}

function fetchAllParks($payload)
{
    global $db, $logger;
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("PARKS"));

    $columnToFetch = "id, parkName as title";
    if (isset($payload->columnToFetch) && CommonUtils::isValid($payload->columnToFetch)) {
        $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
    }
    $query = "SELECT $columnToFetch  from jos_gsa_parkaddress";
    // $query = "SELECT  t.id as teamId, t.name as name, s.name as sport";
    $query .= $whereCondition;
    $query .= " group by parkName";
    $query .= " order by parkName desc";
    // echo $query;die;
    $sth = $db->prepare($query);
    $sth->execute();
    $result = $sth->fetchAll();
    if (CommonUtils::isValid($result)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $result;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchParkDetail($payload)
{
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["parkId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
    if (!CommonUtils::isValid($columnToFetch) && !isset($payload->columnToFetch) && count($payload->columnToFetch) === 0) {
        return new ActionResponse(0, null);
    }
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("PARKS"));
    $query = "SELECT  $columnToFetch  from jos_gsa_parkaddress";
    // $query = "SELECT  t.id as teamId, t.name as name, s.name as sport";
    $query .= $whereCondition;
    $sth = $db->prepare($query);
    $sth->execute();
    $result = $sth->fetch();
    if (CommonUtils::isValid($result)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $result[$payload->columnToFetch[0]];
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchTournamentTeams($payload)
{
    //print_r($payload);
    global $db, $logger;
    try {
        if (!isset($payload->columnToFetch)) {
            $payload->columnToFetch = ["tournament_teams as id"];
        }
        $updateStr = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENTTEAMS"), "tr");
        if (!isset($payload->teamColumnToFetch)) {
            $payload->teamColumnToFetch = ["t.name as title"];
        }
        if (!isset($payload->orderBy)) {
            $payload->orderBy = "tr.registration_time";
        }

        if (CommonUtils::isValid($updateStr)) {
            $sql = "select a.agegroup as agegroupTitle, c.classification as classificationTitle, c.classification, t.name,u.name as coach, t.team_sanction, t.team_state , t.id as teamId, tr.id as registrationId, tr.Played_Agegroup, tr.comments_by_director, tr.played_class FROM jos_tournament_details as tr ";
            $sql .= " left join jos_community_groups as t";
            $sql .= " on tr.tournament_teams = t.id ";
            $sql .= " left join jos_league_agegroup as a on tr.Played_Agegroup = a.id  and t.categoryid = a.sports_type_id";
            $sql .= " left join jos_league_classification as c on tr.played_class = c.id  and t.categoryid = c.sportstypeid";
            $sql .= " left join jos_users as u on t.ownerId = u.id";
            $sql .= $updateStr . " AND tr.isRemove = 0 order by $payload->orderBy";
            $sth = $db->prepare($sql);
            // echo $sql;die;
            // echo "<pre>";
            $sth->execute();
            $teamDetails = $sth->fetchAll();
            //print_r($teamDetails);die;
            $tournamentConfigData = getTournamentconfig($payload->tournamentId);
            if (CommonUtils::isValid($teamDetails)) {

                $dataResponse = new DataResponse();
                if (isset($payload->onlyTeamData) && $payload->onlyTeamData) {
                    $onlyTeamData = array();
                    foreach ($teamDetails as $singleTeamDetail) {
                        $singleTeamObj = new stdClass();
                        $singleTeamObj->id = $singleTeamDetail['teamId'];
                        $singleTeamObj->title = $singleTeamDetail['name'];
                        array_push($onlyTeamData, $singleTeamObj);
                    }
                    $dataResponse->data = $onlyTeamData;
                } else {
                    $whPlayData = new stdClass();
                    $whPlayData->teamsData = $teamDetails;
                    $whPlayData->tournamentConfig = $tournamentConfigData;
                    $dataResponse->data = $whPlayData;
                }

                return new ActionResponse(1, $dataResponse);
            }
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in inserting user details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function fetchTournamentAgeClassOfTeam($payload)
{
    global $db, $logger;
    $ageClassRes = new ActionResponse(0, null);
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "teamId"]);
    if ($isRequestInValid) {
        $logger->error("Request is not valid for fetching age class of tournament");
        echo "returning from here";
        return $isRequestInValid;
    }

    $sql = "SELECT tournament_teams as teamId, Played_Agegroup, played_class FROM `jos_tournament_details` WHERE `tournament_id` = $payload->tournamentId and tournament_teams=" . $payload->teamId;
    $sth = $db->prepare($sql);
    $sth->execute();
    // echo $sql;die;
    $result = $sth->fetchObject();
    if ($result) {
        $ageClassRes->status = 1;
        $ageClassRes->payload = new stdClass();
        $ageClassRes->payload->data = $result;
    } else {
        $ageClassRes->errorMessage = "Error in fetching agegroup and classification for tournament";
        $logger->error($ageClassRes->errorMessage);
        $logger->error(json_decode($payload));
    }
    return $ageClassRes;
}

function getTournamentconfig($tournamentId)
{
    if (!empty($tournamentId)) {
        global $db, $logger;
        $sql = "SELECT * FROM `gsa_tournament_team_config` WHERE `tournamentId` = '$tournamentId'";
        $sth = $db->prepare($sql);
        $sth->execute();
        $result = $sth->fetchall();
        return $result;
    }
}

function storeDirectorCommentsForTeams($payload)
{
    global $db, $logger;

    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "directorComments"]);
    if (!$isRequestInValid) {
        return $isRequestInValid;
    }
    $storeInfoRes = new ActionResponse(0, null);

    if (!empty($payload->directorCommentsForTeams)) {

        foreach ($payload->directorCommentsForTeams as $payloadData) {

            $sql = "UPDATE `jos_tournament_details` SET `comments_by_director`= '$payloadData->comments_by_director' WHERE `tournament_teams` = '$payloadData->teamId' AND `tournament_id` = '$payload->tournamentId'";
            $sth = $db->prepare($sql);
            $sth->execute();
            if ($sth) {
                $storeInfoRes->status = 1;
            } else {
                $storeInfoRes->errorMessage = "Something went wrong please try again later";
            }
        }
    } else {
        $storeInfoRes->status = 0;
        $logger->error("Error in storing director comments");
    }
    return $storeInfoRes;
}

function removeTeamFromTournamentsByDirector($payload)
{
    global $db, $logger;

    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "teamId"]);
    if ($isRequestInValid) {
        // echo "here is error";die;
        return $isRequestInValid;
    }

    $removeTeamRes = new ActionResponse(0, null);

    if (!empty($payload->teamId)) {
        // echo "in eams";
        $sql = "UPDATE `jos_tournament_details` SET `isRemove`= '1',`removedBy`= '$payload->directorId' WHERE `tournament_id`= '$payload->tournamentId' AND`tournament_teams`= '$payload->teamId'";
        $sth = $db->prepare($sql);
        $sth->execute();
        if ($sth) {
            $removeTeamRes->status = 1;
        } else {
            $removeTeamRes->errorMessage = "Something went wrong please try again later";
        }
    } else {
        $removeTeamRes->status = 0;
        $logger->error("Error in removeing Team From Tournaments By director ");
    }
    //print_r($removeTeamRes);die;
    return $removeTeamRes;
}


function saveMaxNumberOfTeam($payload)
{
    global $db, $logger;

    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "maxNumber", "agegroup"]);
    if ($isRequestInValid) {

        return $isRequestInValid;
    }
    // print_r($payload);die;
    $saveMaxNumberRes = new ActionResponse(0, null);

    if (!empty($payload->maxNumber)) {
        // echo "in eams";
        //print_r($payload);die; 
        $sql1 = "SELECT * FROM `gsa_tournament_team_config` WHERE `tournamentId`= '$payload->tournamentId' AND`agegroup` = '$payload->agegroup'";
        $sth = $db->prepare($sql1);
        $sth->execute();
        $result = $sth->fetchObject();
        // print_r($result);die; 
        if (empty($result)) {
            $sql = "INSERT INTO `gsa_tournament_team_config`(`tournamentId`, `maxNumberOfTeams`,`agegroup`,    `directorId`) VALUES ('$payload->tournamentId','$payload->maxNumber','$payload->agegroup','$payload->directorId')";
        } else {
            $sql = "UPDATE `gsa_tournament_team_config` SET `maxNumberOfTeams`='$payload->maxNumber',`directorId`= '$payload->directorId' WHERE `tournamentId`= '$payload->tournamentId' AND `agegroup` = '$payload->agegroup'";
        }

        $sth = $db->prepare($sql);
        $sth->execute();
        if ($sth) {
            $saveMaxNumberRes->status = 1;
        } else {
            $saveMaxNumberRes->errorMessage = "Something went wrong please try again later";
        }
    } else {
        $saveMaxNumberRes->status = 0;
        $logger->error("Error in save Max number of team By director ");
    }
    //print_r($saveMaxNumberRes);die;
    return $saveMaxNumberRes;
}

function changeAgegroupAndClassByDirector($payload)
{
    //print_r($payload);
    // echo "check payload";
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["teamId", "Played_Agegroup", "tournamentId"]);
    if ($isRequestInValid) {

        return $isRequestInValid;
    }
    $changeAgegroupAndClass = new ActionResponse(0, null);
    $sql = "UPDATE `jos_tournament_details` SET `Played_Agegroup`='$payload->Played_Agegroup'";
    if (isset($payload->played_class) && $payload->played_class) {
        $sql .= ",`played_class`='$payload->played_class'";
    }

    $sql .= " where `tournament_id`= '$payload->tournamentId' AND `tournament_teams` ='$payload->teamId'";
    // echo $sql;die;
    $sth = $db->prepare($sql);
    $sth->execute();
    if ($sth) {
        $changeAgegroupAndClass->status = 1;
    } else {
        $changeAgegroupAndClass->errorMessage = "Something went wrong please try again later";
    }
    //print_r($changeAgegroupAndClass);die;
    return $changeAgegroupAndClass;
}

function fetchBracketRelatedDetails($payload)
{
    global $db, $logger;
    if (!isset($payload->columnToFetch)) {
        $payload->columnToFetch = ["*"];
    }
    $columnToFetch = "tr.*";
    $columnToFetchForUser = "usr.name as directorName";
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENT"), "tr");
    $query = "SELECT  $columnToFetch , $columnToFetchForUser, sports.name as sport from jos_gsa_tournament as tr";
    $query .= " left join jos_users as usr on tr.directorid = usr.id";
    $query .= " left join jos_community_groups_category as sports on tr.sportstypeid = sports.id";
    $query .= $whereCondition;
    // echo $query;
    $sth = $db->prepare($query);
    $sth->execute();
    $result = $sth->fetchObject();
    if (CommonUtils::isValid($result)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = prepareBracketResultFromQueryResult($result);
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchBracketRelatedDetailsOfTeam($payload)
{
    global $db, $logger;

    $bracketResponse = new ActionResponse(0, null);
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "teamId"]);
    if ($isRequestInValid) {
        $bracketResponse->errorMessage = "Request is not valid for team bracket details";
        $logger->error("InValid request for fetchBracketRelatedDetailsOfTeam");
        $logger->error(json_encode($payload));
        return $bracketResponse;
    }

    $where = array();

    if (isset($payload->teamId) && $payload->teamId) {
        $where[] = "FIND_IN_SET($payload->teamId, b.teams)";
    }

    if (isset($payload->tournamentId) && $payload->tournamentId) {
        $where[] = "b.tournament_id=" . $payload->tournamentId;
    }

    if (CommonUtils::isValid($where)) {
        $where = "\n WHERE  " . implode(' AND ', $where);
    } else {
        $where = '';
    }

    if (CommonUtils::isValid($where)) {
        $query = "SELECT b.id as bracketId, t.id as tournamentId, t.title as tournamentTitle, usr.id as directorId, usr.name as director,a.agegroup,c.classification, p.parkName,p.city from jos_tournament_bracket as b";
        $query .= " left join jos_gsa_tournament as t on b.tournament_id = t.id";
        $query .= " left join jos_users as usr on t.directorid = usr.id";
        $query .= " left join jos_league_agegroup as a on a.id = b.agegroup";
        $query .= " left join jos_league_classification as c on c.id = b.classification";
        $query .= " left join jos_gsa_parkaddress as p on c.id = b.parkId";
        $query .= $where;
        // echo $query;
        $sth = $db->prepare($query);
        $sth->execute();
        $result = $sth->fetchObject();
        if (CommonUtils::isValid($result)) {
            $dataResponse = new DataResponse();
            $averageFinishData = getAverageFinish($payload->teamId, "", $payload->tournamentId);
            $result->orderOfFinish = $averageFinishData->finish;
            $dataResponse->data = array($result);
            return new ActionResponse(1, $dataResponse);
        } else {
            $bracketResponse->errorMessage = " bracket result is not found ";
            $logger->error("bracket result not found");
            $logger->error(json_encode($payload));
        }
    }
    return $bracketResponse;
}

function fetchBracketRelatedScoreOfTeam($payload)
{

    global $db, $logger;

    $bracketResponse = new ActionResponse(0, null);
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "teamId"]);
    if ($isRequestInValid) {
        $bracketResponse->errorMessage = "Request is not valid for team bracket details";
        $logger->error("InValid request for fetchBracketRelatedDetailsOfTeam");
        $logger->error(json_encode($payload));
        return $bracketResponse;
    }

    $teamId = $payload->teamId;
    $tournamentId = $payload->tournamentId;
    // If a team plays in more then one bracket in same tournament then 
    // we may need other information such as agegroup to fetch bracket Id
    $bracketPayload = new stdClass();
    $bracketPayload->teamId = $teamId;
    $bracketPayload->tournamentId = $tournamentId;
    $bracketDetailsResponse = fetchBracketRelatedDetailsOfTeam($bracketPayload);
    if ($bracketDetailsResponse->status === 1) {
        $bracketId = $bracketDetailsResponse->payload->data[0]->bracketId;
        $query = "select game_day, team1Id, team2Id, (CASE WHEN team1Id = $teamId 
        THEN team2Id ELSE team1Id END) as teamId,(CASE WHEN team1Id = $teamId
        THEN team1_rankscore ELSE team2_rankscore END) as runs_scored,
        (CASE WHEN team1Id = $teamId THEN team2_rankscore ELSE team1_rankscore END)
        as runs_allowed, (CASE WHEN team1Id = $teamId 
        and team1_rankscore > team2_rankscore THEN 'Win'
        WHEN team2Id=$teamId and team1_rankscore < team2_rankscore THEN 'Win'
        WHEN team1Id = $teamId and team1_rankscore < team2_rankscore THEN 'Loss'
        WHEN team2Id=$teamId and team2_rankscore < team1_rankscore Then 'Loss'
        else 'draw' END) as game_result, 
        (CASE WHEN team1Id = $teamId THEN team2Id ELSE team1Id END)
        as teamId from jos_tournament_scores 
        where (team1Id = $teamId or team2Id = $teamId)
        and bracketId=$bracketId";
        // $query .= $where;
        // echo $query;
        $sth = $db->prepare($query);
        $sth->execute();
        $result = $sth->fetchAll();
        if (CommonUtils::isValid($result)) {
            foreach ($result as &$dataRow) {
                $teamPayload = new stdClass();
                $teamPayload->teamId = $dataRow['teamId'];
                $teamPayload->columnToFetch = ["name"];
                $teamDetailsStatus = fetchTeamDetail($teamPayload);
                if ($teamDetailsStatus->status === 1) {
                    $dataRow['teamName'] = $teamDetailsStatus->payload->data;
                }
            }
            $dataResponse = new DataResponse();
            $dataResponse->data = $result;
            return new ActionResponse(1, $dataResponse);
        } else {
            $bracketResponse->errorMessage = " bracket result is not found ";
            $logger->error("bracket result not found");
            $logger->error(json_encode($payload));
        }
    } else {
        $bracketResponse->errorMessage = " bracket detail is not found for team ";
        $logger->error("bracket detail not found");
        $logger->error(json_encode($payload));
    }
    return $bracketResponse;
}

function getTournamentSport($tournamentId)
{
    global $db, $logger;
    try {
        $sql = "select s.id, s.name as title jos_community_groups_category as s";
        $sql .= " left join jos_gsa_tournament as t on t.sportstypeid = s.id";
        $sql .= " where t.id = $tournamentId";
        $sth = $db->prepare($sql);
        $sth->execute();
        $sport_details = $sth->fetchObject();
        return new ActionResponse(1, $sport_details);
    } catch (PDOException $e) {
        $logger->error("Error in updating user details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null, 0, "Error in updating user details");
    }
}

function fetchSingleBracketDetails($bracketId, $userInfo)
{
    global $db, $logger;
    try {
        $sql = " select t.directorId as tournamentDirectorId, p.parkName as parkName_title ,a.agegroup as agegroup_title, c.classification as classification_title,t.title as tournament_title,t.start_date, t.end_date,  b.* from jos_tournament_bracket as b left join";
        $sql .= " jos_gsa_tournament as t on t.id=b.tournament_Id";
        $sql .= " left join jos_league_agegroup as a on b.agegroup = a.id";
        $sql .= " left join jos_league_classification as c on b.classification = c.id";
        $sql .= " left join jos_gsa_parkaddress as p on p.id = b.parkId";
        $sql .= " where b.id = $bracketId";

        // if user is logged in then if he/she is a director then we need to show all the titles
        // otherwise we need to hide those we are mark as hidden
        if ($userInfo && ($userInfo->token) && isUserOwnerOfTournament($userInfo, $bracketId)) {
            // do nothing
        } else {
            $sql .= " and b.isHidden = 0";
        }
        // echo $sql;die;
        $sth = $db->prepare($sql);
        $sth->execute();
        $bracket_details = $sth->fetchObject();
        if ($bracket_details) {
            return new ActionResponse(1, $bracket_details);
        } else {
            return new ActionResponse(0, new stdClass(), 0, "Bracket is hidden by administrator");
        }
    } catch (PDOException $e) {
        $logger->error("Error in getting bracket details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, new stdClass(), 0, "Error in getting bracket details");
    }
}

function fetchBracketScores($payload, $userInfo = null)
{
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "bracketId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    try {

        $tournament_sport = getTournamentSport($payload->tournamentId);
        $bracket_details = fetchSingleBracketDetails($payload->bracketId, $userInfo);
        $bracket_scores = getTournamentBracketScore($payload->bracketId);
        fillTeamNameInBracketScore($bracket_scores);
        $bracket_data = $bracket_details->payload;
        $bracket_data->bracketScore = $bracket_scores;
        $bracket_data->add_info = utf8_encode($bracket_data->add_info);
        $bracket_data->tournamentDates = getTournamentdates($bracket_data->start_date, $bracket_data->end_date);
        prepareSingleLineToArrayWhileFetchingBracket($bracket_data);
        // $bracket_data = "trsging";
        // backward compatibilty for park names
        if (CommonUtils::isValid($bracket_data->parkName_title)) {
            $bracket_data->parkName = $bracket_data->parkName_title;
        }
        $userPayload = new stdClass();
        $userPayload->userId = $bracket_data->tournamentDirectorId;
        $userPayload->columnToFetch = ["id,name,`primary`"];
        $bracket_data->directorInfo = fetchSingleUser($userPayload);
        $dataResponse = new DataResponse();
        $dataResponse->data = $bracket_data;
        $bracket_data->totalArray = array();
        if (CommonUtils::isValid($bracket_data->total)) {
            $bracket_data->totalArray = explode(",", $bracket_data->total);
        }
        // print_r($dataResponse);
        return new ActionResponse(1, $dataResponse);
    } catch (Exception $e) {
        $logger->error("error in fetching details for bracket");
        $logger->error($e->getMessage());
        $logger->error(json_encode($payload));
        return new ActionResponse(0, null, 0, "Error in getting bracket details");
    }
}

function fillTeamNameInBracketScore(&$bracketScore)
{
    if (CommonUtils::isValid($bracketScore)) {
        foreach ($bracketScore as &$scoreRow) {
            if (CommonUtils::getNumericValue($scoreRow['team1id'])) {
                $scoreRow['team1_name'] = getTeamName($scoreRow['team1id']);
            } else {
                $scoreRow['team1_name'] = $scoreRow['team1id']; // in case when only schedule is created not all details of bracket is filled
            }
            if (CommonUtils::getNumericValue($scoreRow['team2id'])) {
                $scoreRow['team2_name'] = getTeamName($scoreRow['team2id']);
            } else {
                $scoreRow['team2_name'] = $scoreRow['team2id'];
            }
        }
    }
}

function fetchBracketDetails($payload, $userInfo)
{
    $bracketDetailResponse = fetchBracketScores($payload, $userInfo);
    return $bracketDetailResponse;
}

function fetchBracketTitles($payload, $userInfo)
{
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId"]);
    if ($isRequestInValid) {
        return new ActionResponse(0, null);
    }
    $sql = " select b.tournament_id , b.agegroup,b.classification, b.id as bracketId, a.agegroup as agegroupTitle, c.classification as classificationTitle from jos_tournament_bracket as b
    left join jos_league_agegroup as a on a.id=b.agegroup 
    left join jos_league_classification as c on c.id=b.classification
    where tournament_id=$payload->tournamentId";
    // if user is logged in then if he/she is a director then we need to show all the titles
    // otherwise we need to hide those we are mark as hidden
    // print_r($userInfo);
    if ($userInfo && isset($userInfo->token) && isUserOwnerOfTournament($userInfo, $payload->tournamentId)) {
        // do nothing
    } else {
        $sql .= " and b.isHidden = 0";
    }
    // die;
    $sth = $db->prepare($sql);
    $sth->execute();
    $bracket_details = $sth->fetchAll();
    $bracketTitleResponse = new ActionResponse(0, null);
    $allBracketTitlesOfTournament = array();
    if ($bracket_details) {
        foreach ($bracket_details as $single_bracket_details) {
            $bracketTitleObj = new stdClass();
            $bracketTitleObj->agegroupTitle = $single_bracket_details['agegroupTitle'];
            $bracketTitleObj->classificationTitle = $single_bracket_details['classificationTitle'];
            $bracketTitleObj->agegroup = $single_bracket_details['agegroup'];
            $bracketTitleObj->classification = $single_bracket_details['classification'];
            $bracketTitleObj->bracketId = $single_bracket_details['bracketId'];
            $bracketTitleObj->tournamentId = $single_bracket_details['tournament_id'];
            array_push($allBracketTitlesOfTournament, $bracketTitleObj);
        }
        if (!empty($allBracketTitlesOfTournament)) {
            $dataResponse = new DataResponse();
            $dataResponse->data = $allBracketTitlesOfTournament;
            $bracketTitleResponse->payload = $dataResponse;
            $bracketTitleResponse->status = 1;
        } else {
            $bracketTitleResponse->errorMessage = "Bracket details not found for tournament";
        }
    }
    return $bracketTitleResponse;
}

function isUserOwnerOfTournament($userInfo, $tournamentId)
{
    $userDetails = getUserDetailsFromToken($userInfo->token);
    if ($userDetails) {
        if ($userDetails->gid == 31 || $userDetails->gid == 25) {
            return true;
        }
    }
}

function hideUnhideBracket($payload)
{
    global $db, $logger;
    $hideUnhideRes = new ActionResponse(0, null);
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "bracketId"]);
    if ($isRequestInValid) {
        $logger->error("Request is not valid for bracket hide unhide bracket");
        return $isRequestInValid;
    }
    $isHidden = (isset($payload->isHidden) && $payload->isHidden) ? 1 : 0;
    $sql = "update jos_tournament_bracket set isHidden=$isHidden where tournament_id=$payload->tournamentId and id=$payload->bracketId";
    $sth = $db->prepare($sql);
    $res = $sth->execute();
    // die;
    if ($res) {
        $hideUnhideRes->status = 1;
        $responseData = CommonUtils::prepareResponsePayload(["isHidden"], [$isHidden]);
        $hideUnhideRes->payload = $responseData;
    } else {
        $hideUnhideRes->errorMessage = "Error occured in setting bracket state";
        $logger->error($hideUnhideRes->errorMessage . " tournament:" . $payload->tournamentId . " bracket " . $payload->bracketId);
    }
    return $hideUnhideRes;
}

function getDirectorInfoStrForBracket($bracketDetails)
{
    return 'Director - ' . $bracketDetails->directorInfo['name'] . ' - ' . $bracketDetails->directorInfo['primary'];
}

function printBracket($payload)
{
    $bracketDetailResponse = fetchBracketScores($payload);
    // echo "<pre>";
    // print_r($bracketDetailResponse);
    $bracketDetails = $bracketDetailResponse->payload->data;
    $replStr = "hello dear";
    //$data = "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"http://gsateamslocal.com/bracket_print.css\" /></head>";
    $data = "<div class=\"DivMainPrintLayout\">
  <div class=\"div_logo_print\"align=\"center\">
    <img src=\"./assets/logos/app-logo.png\" alt=\"GSA\"/>
  </div>  <div class=\"div_tournaDate_print\" align=\"center\">
    <h2 style=\"margin: 10px 0px; font-size:16px\">
      " . $bracketDetails->tournament_title . "
    </h2>
  </div>
  <div class=\"div_tournaDetail_print\" align=\"center\">
    <table class=\"tbl_tournaDetail_print\"border=\"0\"cellpadding=\"0\"cellspacing=\"0\"width=\"100%\">
      <tbody>
        <tr class=\"tr_tournaDetail_print\">
          <td align=\"center\"style=\"font-size:14px;\"width=\"50%\">
            " . $bracketDetails->tournamentDates . "
          </td>
          <td align=\"center\"style=\"font-size:14px;\"width=\"50%\">
            " . $bracketDetails->agegroup_title . "  " . $bracketDetails->classification_title . "
          </td>
        </tr>
        <tr class=\"tr_tournaDetail_print\">
          <td align=\"center\"width=\"50%\">
            " . $bracketDetails->parkname . "
          </td>
          <td align=\"center\"width=\"50%\">
          " . getDirectorInfoStrForBracket($bracketDetails) . "
          </td>
        </tr>
        <tr class=\"tr_tournaDetail_print\">
          <td  =\"center\"width=\"50%\">Pool
            Play Time Limit :
            " . $bracketDetails->poolplaytime . "
          </td>
          <td align=\"center\" width=\"50%\"align=\"center\"width=\"50%\">Bracket Play Time Limit :
            " . $bracketDetails->bracketplaytime . "
          </td>
        </tr>
        <tr class=\"tr_tournaDetail_print\">
          <td align=\"center\"  width=\"50%\">Championship Game Time Limit :
            " . $bracketDetails->championshipgametime . "
          </td>
          <td align=\"center\" width=\"50%\">
            " . $bracketDetails->ifgametime . "
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div id=\"AddInfo\">
    <table>
      <tr>
        <td>
          <span style=\"font-size:12px;\" [innerHTML]=\"$bracketDetails->add_info\">
          </span>
        </td>
      </tr>
    </table>
  </div>

  <div class=\"div_bracket_print\"align=\"center\">
    <table class=\"tblBracketTeamScore\"border=\"0\"cellpadding=\"4\"cellspacing=\"0\"width=\"100%\">
      <tbody>
        <tr id=\"trHeading_BracketTeams\">
          <th id=\"thFirstHeading_BracketTeamScore\"><span></span></th>
          <th id=\"thSameHeading_BracketTeamScore\"width=\"8%\">
            Day
          </th>
          <th id=\"thSameHeading_BracketTeamScore\"width=\"8%\">
            Time
          </th>
          <th id=\"thSameHeading_BracketTeamScore\"width=\"4%\">
            Field
          </th>
          <th id=\"thSameHeading_BracketTeamScore\"width=\"30%\">
            Team 1
          </th>
          <th id=\"thSameHeading_BracketTeamScore\"width=\"8%\">
            Score 1
          </th>
          <th id=\"thSameHeading_BracketTeamScore\"width=\"30%\">
            Team 2
          </th>
          <th id=\"thLastHeading_BracketTeamScore\"width=\"8%\">
            Score 2
          </th>
        </tr>";
    $i = 0;
    $breakCount = 0;
    foreach ($bracketDetails->bracketScore as $bracketTeamScore) {
        $breakCount++;
        $i++;
        $data .= "
          <tr id=\"trValue_BracketTeamScore\">
            <td id=\"tdFirstValue_BracketTeamScore\"align=\"center\"><span style=\"font-size:12px;\">" . ($i + 1) . "</span></td>
            <td id=\"tdSameValue_BracketTeamScore\"align=\"center\"><span style=\"font-size:12px;\">
                " . $bracketTeamScore['game_day'] . "</span></td>
            <td id=\"tdSameValue_BracketTeamScore\"align=\"center\"><span style=\"font-size:12px;\">
                " . $bracketTeamScore['game_time'] . "</span></td>
            <td id=\"tdSameValue_BracketTeamScore\"align=\"center\"><span style=\"font-size:12px;\">
                " . $bracketTeamScore['game_field'] . "</span></td>
            <td id=\"tdSameValue_BracketTeamScore\"align=\"center\">
              <span style=\"float:left;\">
                " . $bracketTeamScore['team1shortform'] . "</span>
              <span style=\"font-size:12px;\">
                " . $bracketTeamScore['team1_name'] . "
              </span>
            </td>
            <td id=\"tdSameValue_BracketTeamScore\"align=\"center\"><span style=\"font-size:12px;\">
                " . $bracketTeamScore['team1_score'] . "</span></td>
            <td id=\"tdSameValue_BracketTeamScore\"align=\"center\">
              <span style=\"float:left;\">" . $bracketTeamScore['team2shortform'] . "</span>
              <span style=\"font-size:12px;\">" . $bracketTeamScore['team2_name'] . "
              </span>
            </td>
            <td id=\"tdLastValue_BracketTeamScore\"align=\"center\"><span style=\"font-size:12px;\">
                " . $bracketTeamScore['team2_score'] . "</span></td>
          </tr>";
    }
    $data .= "</tbody> </table> </div> </div>";
    if ($breakCount > 13) {
        $data .= "<div class=\"page-break\"></div>";
    }
    $data .= "<div class=\"DivMainPrintLayout\">
  <div class=\"div_ranking_print\"align=\"center\">
    <table class=\"tblBracketRankingScore\"border=\"0\"cellpadding=\"4\"cellspacing=\"0\"width=\"100%\">
      <tbody>
        <tr>
          <td style=\"padding:0px;\"colspan=\"4\"valign=\"top\"width=\"36%\">
            <table class=\"tblBracketTeams\"border=\"0\"cellpadding=\"4\"cellspacing=\"0\"width=\"100%\">
              <tbody>
                <tr id=\"trHeading_BracketTeams\">
                  <th id=\"thHeading_BracketTeams\"colspan=\"2\">
                    Teams
                  </th>
                </tr>";
    $j = 0;
    foreach ($bracketDetails->teamDetails as $bracketTeams) {
        $j++;
        $data .= "<tr id=\"trValue_BracketTeams\" >
                  <td id=\"tdValue_BracketTeams\" align=\"center\"><span>
                      " . $bracketTeams->teamName . "</span></td>
                  <td id=\"tdSNoValue_BracketTeams\"align=\"center\"><span>
                      " . ($j + 1) . "</span>
                </tr>";
    }
    $data .= "<tr id=\"trBlank_BracketTeams\">
                  <td id=\"tdBlank_BracketTeams\"style=\"color:#00E7FF;\"colspan=\"2\"><span><b>Blank</b></span></td>
                </tr>";
    $data .= "</tbody>
            </table>
          </td>
          <td colspan=\"4\"style=\"padding:0px;\"valign=\"top\"width=\"64%\">
            <table class=\"tblBracketOrderOfFinish\"border=\"0\"cellpadding=\"4\"cellspacing=\"0\"width=\"100%\">
              <tbody>
                <tr id=\"trHeading_BracketOrderOfFinish\">
                  <th id=\"thHeading_BracketOrderOfFinish\">
                    Order of Finish
                  </th>
                  <th id=\"thHeading_BracketOrderOfFinish\"width=\"10%\">W</th>
                  <th id=\"thHeading_BracketOrderOfFinish\"width=\"10%\">L</th>
                  <th id=\"thHeading_BracketOrderOfFinish\"width=\"10%\">T</th>
                </tr> ";
    foreach ($bracketDetails->orderOfFinish as $orderOfFinish) {

        $data .= "<tr id=\"trValue_BracketOrderOfFinish\">
                  <td id=\"tdValue_BracketOrderOfFinish\"align=\"center\"><span>
                      " . $orderOfFinish->teamName . "</span></td>
                  <td id=\"tdValue_BracketOrderOfFinish\"align=\"center\"><span>
                      " . $orderOfFinish->win . "</span></td>
                  <td id=\"tdValue_BracketOrderOfFinish\"align=\"center\"><span>
                      " . $orderOfFinish->loss . "</span></td>
                  <td id=\"tdValue_BracketOrderOfFinish\"align=\"center\"><span>
                      " . $orderOfFinish->tie . "</span></td>
                </tr>";
    }
    $data .= "<tr id=\"trTotal_BracketOrderOfFinish\">
                  <td id=\"tdTotal_BracketOrderOfFinish\"align=\"right\"style=\"padding-right: 10px;\"><span><b>Totals</b></span></td>
                  <td id=\"tdTotal_BracketOrderOfFinish\"align=\"center\"><span>
                      " . $bracketDetails->totalArray[0] . "</span></td>
                  <td id=\"tdTotal_BracketOrderOfFinish\"align=\"center\"><span>
                      " . $bracketDetails->totalArray[1] . "</span></td>
                  <td id=\"tdTotal_BracketOrderOfFinish\"align=\"center\"><span>
                      " . $bracketDetails->totalArray[2] . "</span></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>";
    if ($bracketDetails->id == 1) {
        $data .= "<div class =\"div_wincriteria_print\"align=\"center\">
    <h4>Tie Breaker : 1. Head to Head Competition 2. Runs Allowed 3. Runs Scored 4. 1st team that registered </h4>
  </div>";
    }

    $data .= "<br/>
        <div id = \"AddInfo\">
    <table>
      <tr>
        <td>
          <span style=\"font-size:12px;\">
            " . $bracketDetails->add_footer_info . "</span>
        </td>
      </tr>
    </table>

  </div>

  <div class=\"div_msg_print\"align=\"center\">
    <h3>THANK YOU FOR YOUR SUPPORT OF GSA</h3>
  </div>

</div>";

    $data = utf8_encode($data);
    $dataRes = new DataResponse();
    $dataRes->data = $data;
    return new ActionResponse(1, $dataRes);
    // return $bracketDetailResponse;
}

function prepareBracketResultFromQueryResult($result)
{
    $bracketResult = new stdClass();
    $bracketResult->state = $result->state;
    $bracketResult->sportId = $result->sport;
    return $bracketResult;
}

function fetchParkDetailsForTournament($payload)
{
    global $db, $logger;
    if (isset($payload->tournamentId)) {
        $sql = "select parkIds from jos_gsa_tournament where id=$payload->tournamentId";
        $sth = $db->prepare($sql);
        $sth->execute();
        $park_details = $sth->fetchObject();
        $parkPayload = new stdClass();
        if (CommonUtils::isValid($park_details->parkIds)) {
            $parkPayload->parkIds = explode(",", $park_details->parkIds);
        }
        if (isset($payload->columnToFetch) && CommonUtils::isValid($payload->columnToFetch)) {
            $parkPayload->columnToFetch = $payload->columnToFetch;
        }
        $parkResponse = fetchAllParks($parkPayload);
        if ($parkResponse->status === 1) {
            return $parkResponse;
        } else {
            $parkResponse->errorMessage = "Something went wrong please try again later";
        }
    }
    return new ActionResponse(0, null);
}

function fetchAllBracketTypes($payload)
{
    global $db, $logger;
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("PARKS"));
    $query = "SELECT  id, name as title  from jos_gsa_brackets ";
    // $query = "SELECT  t.id as teamId, t.name as name, s.name as sport";
    $query .= $whereCondition;
    $query .= " order by name asc";
    // echo $query;
    $sth = $db->prepare($query);
    $sth->execute();
    $result = $sth->fetchAll();
    if (CommonUtils::isValid($result)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $result;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchBracketMatches($payload)
{
    global $logger;
    require_once("bracketgames.php");
    $isRequestInValid = isRequestHasValidParameters($payload, ["brackettypeid", "numberofteams"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $matches = array();
    $bracketId = $payload->brackettypeid;
    $noOfTeams = $payload->numberofteams;
    if (isset($bracket_game_numbers[$bracketId]) && isset($bracket_game_numbers[$bracketId][$noOfTeams])) {
        $matches = $bracket_game_numbers[$bracketId][$noOfTeams];
    }
    if (CommonUtils::isValid($matches)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = prepareResultFromBracketMatches($matches);
        return new ActionResponse(1, $dataResponse);
    } else {
        $logger->error("Could not prepare bracket matches data because bracket matches result was not valid");
        return new ActionResponse(0, null);
    }
}

function prepareResultFromBracketMatches($matches)
{
    global $logger;
    $matchesResult = array();
    foreach ($matches as $singleMatch) {
        // key names should be synched with form fields of bracket score
        $matchObj = new stdClass();
        $matchObj->sNo = "";
        $matchObj->game_day = "";
        $matchObj->game_time = "";
        $matchObj->game_field = "";
        $matchObj->team1id = $singleMatch[0];
        $matchObj->team1_score = "";
        $matchObj->team2id = $singleMatch[1];
        $matchObj->team2_score = "";
        $matchObj->team1shortform = $singleMatch[4];
        $matchObj->team2shortform = $singleMatch[5];;
        array_push($matchesResult, $matchObj);
    }
    return $matchesResult;
}

function saveBracketRelatedDetails($payload)
{
    global $db, $logger;

    $mendatoryParamToCheck = ["tournamentId", "teamDetails", "startdate", "orderOfFinish"];
    if (isset($payload->requestFor) && $payload->requestFor === "EDIT") {
        array_push($mendatoryParamToCheck, "bracketId");
    }
    $isRequestInValid = isRequestHasValidParameters($payload, $mendatoryParamToCheck);
    if ($isRequestInValid) {
        echo "Request is not valid for bracket score posting";
        return $isRequestInValid;
    }
    $orderOfFinishArray = prepareArrayToSingleLineValuesToInsertInBracket($payload);
    $actionResponse = new ActionResponse(0, null);
    if (CommonUtils::isValid($orderOfFinishArray)) {
        $response = insertTournamentBracketDetails($payload);
        if ($response->status === 1) {
            $bracketId = $response->payload;
            $bracketScoreResponse = insertTournamentBracketScore($payload, $bracketId);
            if ($bracketScoreResponse->status === 1) {
                $actionResponse->status = 1;
                $team_ranking = array_flip($orderOfFinishArray);

                if (isset($payload->submit_to_rankings) && $payload->submit_to_rankings == 1) {
                    updateRankingForTournament($payload->tournamentId, $bracketScoreResponse->payload, $team_ranking);
                }
                $responseData = CommonUtils::prepareResponsePayload(["tournamentId", "bracketId"], [$payload->tournamentId, $bracketId]);
                return new ActionResponse(1, $responseData);
            } else {
                deleteTournamentBracketDetails($bracketId);
            }
        }
    }
    return $actionResponse;
}

function prepareArrayToSingleLineValuesToInsertInBracket(&$payload)
{
    $teamIdsGroupArray = $payload->teamDetails;
    $orderOfFinishGroupArray = $payload->orderOfFinish;
    $orderOfFinishArray = array();
    $teamIdArray = array();
    $orderOfWinArray = array();
    $orderOfLossArray = array();
    $orderOfTieArray = array();
    if (CommonUtils::isValid($teamIdsGroupArray)) {
        foreach ($teamIdsGroupArray as $teamIdGroupRow) {
            array_push($teamIdArray, $teamIdGroupRow->teamId);
        }
    }

    if (CommonUtils::isValid($orderOfFinishGroupArray)) {
        foreach ($orderOfFinishGroupArray as $orderOfFinishGroupRow) {
            array_push($orderOfFinishArray, $orderOfFinishGroupRow->teamIds);
            array_push($orderOfWinArray, $orderOfFinishGroupRow->win);
            array_push($orderOfLossArray, $orderOfFinishGroupRow->loss);
            array_push($orderOfTieArray, $orderOfFinishGroupRow->tie);
        }
    }

    if (CommonUtils::isValid($teamIdArray) && CommonUtils::isValid($orderOfFinishArray)) {
        $payload->teams = implode(",", $teamIdArray);
        $payload->orderoffinish = implode(",", $orderOfFinishArray);
        $payload->orderofwin = implode(",", $orderOfWinArray);
        $payload->orderofloss = implode(",", $orderOfLossArray);
        $payload->orderoftie = implode(",", $orderOfTieArray);
        $payload->total = array_sum($orderOfWinArray) . ',' . array_sum($orderOfLossArray) . ',' . array_sum($orderOfTieArray);
        return $orderOfFinishArray;
    } else {
        return false;
    }
}

function prepareSingleLineToArrayWhileFetchingBracket(&$payload)
{
    $teamIdsGroupArray = isset($payload->teams) ? explode(",", $payload->teams) : [];
    $orderOfFinishGroupArray = isset($payload->orderoffinish) ? explode(",", $payload->orderoffinish) : [];
    $orderOfFinishArray = array();
    $orderOfWinArray = isset($payload->orderofwin) ? explode(",", $payload->orderofwin) : [];
    $orderOfLossArray = isset($payload->orderofloss) ? explode(",", $payload->orderofloss) : [];
    $orderOfTieArray = isset($payload->orderoftie) ? explode(",", $payload->orderoftie) : [];
    $teamDetails = array();
    if (CommonUtils::isValid($teamIdsGroupArray)) {
        // echo "can set teamDetails";
        // print_r($teamIdsGroupArray);
        foreach ($teamIdsGroupArray as $teamIdGroupRow) {
            $teamDetailsObj = new stdClass();
            $teamDetailsObj->teamId = $teamIdGroupRow;
            $teamDetailsObj->teamName = getTeamName($teamIdGroupRow);
            array_push($teamDetails, $teamDetailsObj);
        }
        $payload->teamDetails = $teamDetails;
        // print_r($teamDetails);
    }

    if (CommonUtils::isValid($orderOfFinishGroupArray)) {
        // echo "can set order of finish";
        // print_r($orderOfFinishGroupArray);
        foreach ($orderOfFinishGroupArray as $orderKey => $orderOfFinishGroupRow) {
            $orderOfFinishObj = new stdClass();
            $orderOfFinishObj->teamIds = $orderOfFinishGroupRow;
            $orderOfFinishObj->teamName = getTeamName($orderOfFinishGroupRow);
            $orderOfFinishObj->win = $orderOfWinArray[$orderKey];
            $orderOfFinishObj->loss = $orderOfLossArray[$orderKey];
            $orderOfFinishObj->tie = $orderOfTieArray[$orderKey];
            array_push($orderOfFinishArray, $orderOfFinishObj);
        }
        $payload->orderOfFinish = $orderOfFinishArray;
        //   print_r($orderOfFinishArray);
    }
}

function insertTournamentBracketDetails($payload)
{
    global $db, $logger;
    $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TOURNAMENTBRACKET"));
    if (CommonUtils::isValid($updateStr)) {
        try {
            $queryType = "INSERT INTO ";
            if (isset($payload->bracketId)) {
                $queryType = " UPDATE ";
            }
            $sql = "$queryType jos_tournament_bracket set " . $updateStr . "";
            if (isset($payload->bracketId)) {
                $sql .= " where id =  $payload->bracketId";
            }
            $sth = $db->prepare($sql);
            $sth->execute();
            $response = isset($payload->bracketId) ? $payload->bracketId : $db->lastInsertId();
            return new ActionResponse(1, $response);
        } catch (PDOException $e) {
            $logger->error("Error in inserting tournament bracket details for" . $updateStr);
            $logger->error($e->getMessage());
            return new ActionResponse(0, null);
        }
    } else {
        return new ActionResponse(0, null);
    }
}

function insertAffectedTeamIdsFromOldTournamentScore($scoreResult, &$affectedTeamIds)
{
    // print_r("previous score results");
    // print_r($scoreResult);

    if (CommonUtils::isValid($scoreResult)) {
        foreach ($scoreResult as $scoreRow) {
            if (is_numeric($scoreRow['team1id']) && !isset($affectedTeamIds[$scoreRow['team1id']])) {
                $affectedTeamIds[$scoreRow['team1id']] = $scoreRow['team1id'];
            }
            if (is_numeric($scoreRow['team2id']) && !isset($affectedTeamIds[$scoreRow['team2id']])) {
                $affectedTeamIds[$scoreRow['team2id']] = $scoreRow['team2id'];
            }
        }
    }
}

function insertTournamentBracketScore($payload, $bracketId)
{
    global $db, $logger;
    $actionResponse = new ActionResponse(0, null);
    if (CommonUtils::isValid($bracketId) && $bracketId > 0) {
        if (CommonUtils::isValid($payload->bracketScore)) {
            $affectedTeamIds = array();
            $previousDetails = getTournamentBracketScore($bracketId);
            insertAffectedTeamIdsFromOldTournamentScore($previousDetails, $affectedTeamIds);
            deleteTournamentBracketScore($bracketId);
            foreach ($payload->bracketScore as $scoreRowPayload) {
                try {
                    $scoreRowPayload->bracketid = $bracketId;
                    $updateStr = DatabaseUtils::getUpdateString($db, $scoreRowPayload, MetaUtils::getMetaColumns("TOURNAMENTBRACKETSCORE"));
                    $sql = "INSERT INTO jos_tournament_scores set " . $updateStr . "";
                    $sth = $db->prepare($sql);
                    $sth->execute();
                } catch (PDOException $e) {
                    $logger->error("Error in inserting tournament score details for " . $updateStr);
                    $logger->error($e->getMessage());
                    echo "exception in inserting score";
                    echo $e->getMessage();
                    // return new ActionResponse(0, null, 0, "Error in inserting tournament score");
                }
            }
            // re update affected team ids 
            $previousDetails = getTournamentBracketScore($bracketId);
            $affectedTeamIdsArrayToReturn = array();
            insertAffectedTeamIdsFromOldTournamentScore($previousDetails, $affectedTeamIds);
            // print_r("affected team ids");
            // print_r($affectedTeamIds);
            foreach ($affectedTeamIds as $teamId => $teamVal) {
                array_push($affectedTeamIdsArrayToReturn, $teamVal);
            }
            return new ActionResponse(1, $affectedTeamIdsArrayToReturn);
        }
    }
}

function deleteTournamentBracketDetails($bracketId)
{
    global $db, $logger;
    if (CommonUtils::isValid($bracketId)) {
        $sql = "delete from jos_tournament_bracket where id = $bracketId";
        $sth = $db->prepare($sql);
        $sth->execute();
    }
}

function deleteTournamentBracketScore($bracketId)
{
    global $db, $logger;
    if (CommonUtils::isValid($bracketId)) {
        $sql = "delete from jos_tournament_scores where bracketid = $bracketId";
        $sth = $db->prepare($sql);
        $sth->execute();
    }
}

function getTournamentBracketScore($bracketId)
{
    global $db, $logger;
    if (CommonUtils::isValid($bracketId)) {
        $sql = "select * from jos_tournament_scores where bracketid = $bracketId";
        $sth = $db->prepare($sql);
        $sth->execute();
        return $sth->fetchAll();
    }
}

function updateRankingForTournament($tournamentId, $teamIds, $team_ranking)
{
    global $db, $logger;
    if (CommonUtils::isValid($teamIds)) {
        foreach ($teamIds as $teamId) {
            $runs_scored = 0;
            $runs_allowed = 0;
            $win = 0;
            $loss = 0;
            $tie = 0;
            deleteRankingDetailsForTournament($tournamentId, $teamId);
            $sql = "select * from jos_tournament_scores as ts left join jos_tournament_bracket as tb
            on ts.bracketid = tb.id where tb.tournament_id = $tournamentId and ts.team1id= $teamId ";
            $sth = $db->prepare($sql);
            $sth->execute();
            $detail_as_team1 = $sth->fetchAll();
            foreach ($detail_as_team1 as $team1Row) {
                $team2_score = CommonUtils::getNumericValue($team1Row['team2_score']);
                $team1_score = CommonUtils::getNumericValue($team1Row['team1_score']);
                $runs_scored = $runs_scored + (trim($team1_score) ? $team1_score : 0);
                $runs_allowed = $runs_allowed + (trim($team2_score) ? $team2_score : 0);
                if ($team1_score > $team2_score) {
                    $win = $win + 1;
                } else if ($team2_score > $team1_score) {
                    $loss = $loss + 1;
                } else {
                    $tie = $tie + 1;
                }
            }

            $sql = "select * from jos_tournament_scores as ts left join jos_tournament_bracket as tb
            on ts.bracketid = tb.id where tb.tournament_id = $tournamentId and ts.team2id= $teamId ";
            $sth = $db->prepare($sql);
            $sth->execute();
            $detail_as_team2 = $sth->fetchAll();
            foreach ($detail_as_team2 as $team2Row) {
                $team2_score = CommonUtils::getNumericValue($team2Row['team2_score']);
                $team1_score = CommonUtils::getNumericValue($team2Row['team1_score']);
                $runs_scored = $runs_scored + (trim($team2_score) ? $team2_score : 0);
                $runs_allowed = $runs_allowed + (trim($team1_score) ? $team1_score : 0);
                if ($team2_score > $team1_score) {
                    $win = $win + 1;
                } else if ($team1_score > $team2_score) {
                    $loss = $loss + 1;
                } else {
                    $tie = $tie + 1;
                }
            }

            $team_rank = isset($team_ranking[$teamId]) ? $team_ranking[$teamId] : 0;
            $rankPayload = new stdClass();
            $rankPayload->tournament_id = $tournamentId;
            $rankPayload->team_id = $teamId;
            $rankPayload->runs_scored = $runs_scored;
            $rankPayload->runs_allowed = $runs_allowed;
            $rankPayload->win = $win;
            $rankPayload->loss = $loss;
            $rankPayload->tie = $tie;
            $rankPayload->team_rank = $team_rank;
            $updateStr = DatabaseUtils::getUpdateString($db, $rankPayload, MetaUtils::getMetaColumns("TOURNAMENTRANK"));
            echo $sql = "INSERT INTO jos_tournament_teamsrank set " . $updateStr . "";
            $sth = $db->prepare($sql);
            $sth->execute();
        }
    }
}

function deleteRankingDetailsForTournament($tournamentId, $teamId)
{
    global $db, $logger;
    if (CommonUtils::isValid($tournamentId) && CommonUtils::isValid($teamId)) {
        $sql = "delete from jos_tournament_teamsrank where tournament_id = $tournamentId and team_id=$teamId";
        $sth = $db->prepare($sql);
        $sth->execute();
    }
}

function getSingleTeamDetailInTournament($payload)
{
    global $db, $logger;
    $whereCondition = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("TOURNAMENTTEAMS"));
    if (!CommonUtils::isValid($whereCondition)) {
        $logger->error("can not fetch team detail because no correct reuest is provided ");
        return false;
    }
    $query = "SELECT  id FROM `jos_tournament_details` $whereCondition";
    $sth = $db->prepare($query);
    $sth->execute();
    $teamDetails = $sth->fetchObject();
    return $teamDetails;
}

function registerForTournament($payload)
{
    global $db, $logger;
    // TODO: check for access 
    $isRequestInValid = isRequestHasValidParameters($payload, ["tournamentId", "teamId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $tournament_register_res = new ActionResponse(0, null);
    $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("TOURNAMENTTEAMS"));
    if (!CommonUtils::isValid($updateStr)) {
        $tournament_register_res->errorMessage = " Parameter is not provided";
        return $tournament_register_res;
    }
    $isTeamAlreadyRegistered = getSingleTeamDetailInTournament($payload);
    if ($isTeamAlreadyRegistered) {
        $tournament_register_res->errorMessage = " Team is already registered for tournament";
        return $tournament_register_res;
    }
    $query = "insert jos_tournament_details set";
    $query .= $updateStr;
    $sth = $db->prepare($query);
    $sth->execute();
    //  echo $query;
    //  print_r($payload);
    if (CommonUtils::isValid($sth)) {
        $dataResponse = new DataResponse();
        $resultData = new stdClass();
        $resultData->tournamentId = $payload->tournamentId;
        $resultData->teamId = $payload->teamId;
        $dataResponse->data = $resultData;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchAllSeasonYear($payload)
{
    global $db, $logger;
    $day = date("d");
    $mon = date("m");
    $current_year = date("Y");
    $year = array();
    $year[0] = $current_year - 3;
    $year[1] = $current_year - 2;
    $year[2] = $current_year - 1;
    $year[3] = $current_year;
    if (((int)$day >= 1) && (int)$mon >= 8) {
        $current_year = date("Y");
        $next_year = $current_year + 1;
        if (!in_array($next_year, $year)) {
            array_push($year, $next_year);
            $year = array_values($year);
        }
    }
    $yearsArray = array_reverse($year);
    $yearDetails = array();
    foreach ($yearsArray as $yearObj) {
        $obj = new stdClass();
        $obj->title = $yearObj;
        $obj->id = $yearObj;
        array_push($yearDetails, $obj);
    }
    if (CommonUtils::isValid($yearDetails)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $yearDetails;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchAllRankingOfTournament($payload)
{
    global $db, $logger;

    $isRequestInValid = isRequestHasValidParameters($payload, ["state", "agegroup", "sportId", "year"]);
    if ($isRequestInValid) {
        // echo "Request is not valid for park";
        return $isRequestInValid;
    }

    $state = $payload->state;
    $agegroup = $payload->agegroup;
    $sport = $payload->sportId;
    $classification = isset($payload->classification) ? $payload->classification : "";
    $year = $payload->year;
    $region = isset($payload->region) ? $payload->region : "";
    $dif_ranking = $sport == 70 ? true : false;
    $ranking_type = 1;

    if ($sport) {
        $where[] = "c.categoryid=" . $sport . "";
    }

    if ($region) {
        $statestr = CFactory::getStatesStr($region);
        $where[] = "c.team_state in ($statestr)";
    } else {
        if ($state && $state != 'ALL') {
            $where[] = "c.team_state='" . $state . "'";
        }
    }
    if ($classification) {
        $where[] = "b.played_class='" . $classification . "'";
    }

    if ($agegroup) {
        if ($dif_ranking) {
            $where[] = " c.age='" . $agegroup . "' ";
        } else {
            $where[] = " b.Played_Agegroup='" . $agegroup . "' ";
        }
    }

    if (isset($where)) {
        $where = "\n WHERE  " . implode(' AND ', $where);
    } else {
        $where = '';
    }
    $orstr = '';

    if ($agegroup) {
        if ($dif_ranking) {
            $orstr = " agegroup='" . $agegroup . "' AND ";
        } else {
            $orstr = " Played_Agegroup='" . $agegroup . "' AND  ";
        }
    }

    if ($classification) {
        $orstr = " played_class='" . $classification . "' AND ";
    }

    $query = "SELECT a.*,c.name as team_name, b.Played_Agegroup,b.played_class, tc.classification as team_classification, ta.agegroup as agegroup
		,c.team_state,c.age,c.id,g.is_double, g.start_date,g.end_date, tc.id as classificationId, ta.id as agegroupId ";
    $query .= " FROM jos_tournament_teamsrank as a  JOIN jos_tournament_details as b on a.team_id=b.tournament_teams 
         and a.tournament_id=b.tournament_id JOIN ";
    $query .= " jos_community_groups as c on a.team_id=c.id JOIN jos_gsa_tournament as g
         on a.tournament_id=g.id ";
    $query .= " left join jos_league_classification as tc on c.team_classification = tc.id";
    $query .= " left join jos_league_agegroup as ta on c.age = ta.id and c.categoryid = ta.sports_type_id";
    $query .= $where;
    $query .= " AND  b.id in (select id from jos_tournament_details where $orstr season_year='" . $year . "')";
    $query .= " group by a.id,b.tournament_id ";
    $query .= " order by a.win-a.loss+a.runs_scored-a.runs_allowed+a.tie DESC, tc.winning_criteria ASC ";
    $sth = $db->prepare($query);
    // echo $query;die;
    $sth->execute();
    $rankingDetails = $sth->fetchAll();
    // echo "<pre>";
    if (CommonUtils::isValid($rankingDetails)) {
        $dataResponse = prepareRankingResult($rankingDetails);
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function prepareRankingResult($rankingDetails)
{
    foreach ($rankingDetails as &$tournamentWiseRanking) {
        $averageFinishData = getAverageFinish($tournamentWiseRanking["team_id"], "", $tournamentWiseRanking["tournament_id"], $tournamentWiseRanking['agegroupId'], $tournamentWiseRanking["classificationId"]);
        if (CommonUtils::isValid($averageFinishData)) {
            $tournamentWiseRanking['finish'] = $averageFinishData->finish;
            $tournamentWiseRanking['number'] = $averageFinishData->number;
        } else {
            $tournamentWiseRanking['finish'] = 0;
            $tournamentWiseRanking['number'] = 0;
        }
        $tournamentWiseRanking['tournamentDates'] = getTournamentdates($tournamentWiseRanking["start_date"], $tournamentWiseRanking["end_date"]);
    }
    $dataResponse = new DataResponse();
    $dataResponse->data = $rankingDetails;
    return $dataResponse;
}

function fetchSpecificRankingOfTournaments($payload)
{
    global $db, $logger;

    $rankingResult = new ActionResponse(0, null);
    $where = array();
    // echo "<pre>";
    // print_r($payload);

    if (isset($payload->teamId) && $payload->teamId) {
        $categoryId = getTeamSportId($payload->teamId);
        if ($categoryId && isset($payload->season_year) && $payload->season_year) {
            $yearCondition = getDatesForsport($categoryId, $payload->season_year);
            $where[] = "g.start_date between '" . $yearCondition->firstDate . "' and '" . $yearCondition->lastDate . "'";
        }
        $where[] = "a.team_id=$payload->teamId";
    }

    if (isset($payload->tournamentId) && $payload->tournamentId) {
        $where[] = "a.tournament_id=$payload->tournamentId";
    }

    if (CommonUtils::isValid($where)) {
        $where = "\n WHERE  " . implode(' AND ', $where);
    } else {
        $where = '';
    }

    if (CommonUtils::isValid($where)) {
        $query = "SELECT a.*, g.id as tournamentId, c.name as team_name, tc.id as classificationId, ta.id as agegroupId, b.Played_Agegroup,b.played_class, tc.classification as team_classification, ta.agegroup as agegroup
    ,c.team_state,c.age,c.id,g.is_double, g.start_date,g.end_date";
        $query .= " FROM jos_tournament_teamsrank as a  JOIN jos_tournament_details as b on a.team_id=b.tournament_teams 
     and a.tournament_id=b.tournament_id JOIN ";
        $query .= " jos_community_groups as c on a.team_id=c.id JOIN jos_gsa_tournament as d 
     on a.tournament_id=d.id ";
        $query .= " left join jos_league_classification as tc on c.team_classification = tc.id";
        $query .= " left join jos_league_agegroup as ta on c.age = ta.id and c.categoryid = ta.sports_type_id";
        $query .= " left join jos_gsa_tournament as g on a.tournament_id=g.id";
        $query .= $where;
        $query .= " group by a.id,b.tournament_id ";
        $query .= " order by b.registration_time ";
        $sth = $db->prepare($query);
        // echo $query;
        $sth->execute();
        $rankingDetails = $sth->fetchAll();
        $dataResponse = prepareRankingResult($rankingDetails);
        $rankingResult->status = 1;
        $rankingResult->payload = $dataResponse;
        // print_r($rankingDetails);
    } else {
        $rankingResult->errorMessage = " Request is not valid for tournament ranking result";
    }
    return $rankingResult;
}

function getAverageFinish($teamid, $tids = [], $singletid = null, $agegroup = null, $classification = null)
{
    global $db, $logger;
    $where = "";
    if ($tids) {
        $tids = implode(',', $tids);
    } else {
        $tids = $singletid;
    }
    if ($agegroup) {
        $where = "and b.agegroup = $agegroup";
    } else {
        if ($classification) {
            $where = "and b.classification = $classification";
        }
    }

    $sql = "select a.team_rank ,b.numberofteams from jos_tournament_teamsrank as a 
    left join jos_tournament_bracket as b on a.tournament_id=b.tournament_id  
    where  a.tournament_id in ($tids) and a.team_id=$teamid " . $where . " 
    and b.tournament_id in ($tids) and FIND_IN_SET($teamid,b.teams) ";
    $sth = $db->prepare($sql);
    $sth->execute();
    $result = $sth->fetchAll();
    $total = count($result);
    $finish = 0;
    $totalteam = 0;
    if (!empty($result)) {
        foreach ($result as $row) {
            $finish = $finish + ($row['team_rank'] + 1);
            $totalteam = $totalteam + $row['numberofteams'];
        }
    }
    $data = new stdClass();
    if ($total == 0 || !$total) {
        $total = 1;
    }
    $data->finish = CommonUtils::getNumberFormat($finish / $total);
    $data->number = CommonUtils::getNumberFormat($totalteam / $total);
    // print_r($data);
    return $data;
}

function getTournamentdates($start_date, $end_date)
{
    $date = explode("-", $start_date);
    $date1 = date('F', mktime(0, 0, 0, $date[1], 1)) . " " . $date[2] . ',' . $date[0];
    $end_date = explode("-", $end_date);
    $date2 = date('F', mktime(0, 0, 0, $end_date[1], 1)) . " " . $end_date[2] . ',' . $end_date[0];
    return $date1 . '-' . $date2;
}
