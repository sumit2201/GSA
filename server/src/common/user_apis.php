<?php
require_once("utility.php");
global $db;

function getUserDetail($userEmail, $userPhone = null)
{
    global $db, $logger;
    $userDetailPayload = new stdClass();
    if ($userEmail) {
        $userDetailPayload->email = $userEmail;
    }
    if ($userPhone) {
        $userDetailPayload->primary = $userPhone;
    }
    $whereCondition = DatabaseUtils::getWhereConditionBasedOnPayload($db, $userDetailPayload, MetaUtils::getMetaColumns("GSAUSER"), "", " OR ");
    if (!CommonUtils::isValid($whereCondition)) {
        $logger->error("user detail is asked without giving email or phone");
        return false;
    }
    try {
        $query = "SELECT *  FROM `jos_users` $whereCondition";
        $sth = $db->prepare($query);
        $sth->execute();
        $userDetails = $sth->fetchObject();
        return $userDetails;
    } catch (PDOException $e) {
        $logger->error("error in getuserdetails");
        $logger->error($e->getMessage());
        return null;
    }
}

function getUserDetailByUserId($userId)
{
    global $db, $logger;
    $userDetailPayload = new stdClass();
    if ($userId) {
        $userDetailPayload->id = $userId;
    }

    if (!CommonUtils::isValid($userId)) {
        $logger->error("user detail is asked without giving userId");
        return false;
    }
    try {
        $query = "SELECT *  FROM `jos_users` where `id`=" . $userId;
        //print_r($query);die;
        $sth = $db->prepare($query);
        $sth->execute();
        $userDetails = $sth->fetchObject();
        return $userDetails;
    } catch (PDOException $e) {
        $logger->error("error in getuserdetails");
        $logger->error($e->getMessage());
        return null;
    }
}

function login($db, $logger, $payload)
{
    // echo "<pre>";
    // print_r($payload);
    global $db, $logger;
    $userName = $payload->username;
    $userDetails = getUserDetail($userName);
    if (CommonUtils::isValid($userDetails)) {
        $passwordMatch = checkUserPassword($userDetails->password, $payload->password);
        // $parts = explode(':', $userDetails->password);
        // $crypt = $parts[0];
        // $salt = @$parts[1];
        // $testcrypt = Authontication::getCryptedPassword($payload->password, $salt);
        if ($passwordMatch) {
            //print_r($userDetails);die;
            if ($userDetails->isEmailVerified == 0 && $userDetails->isPhoneVerified == 0) {
                $data = new stdClass();
                $data->userId = $userDetails->id;
                return new ActionResponse(0, $data, 1100, USER_VERIFICATION_PENDING);
            } else if ($userDetails->isEmailVerified == 1 && $userDetails->isPhoneVerified == 0) {
                $data = new stdClass();
                $data->userId = $userDetails->id;
                return new ActionResponse(0, $data, 1101, USER_MOBILE_VERIFICATION_PENDING);
            } else if ($userDetails->block == 1) {
                return new ActionResponse(0, null, 0, USER_NOT_ENABLED);
            } else {
                // echo "Coming in else how??";
                $loginResponse = new stdClass();
                $loginResponse->userId = $userDetails->id;
                $loginResponse->userName = $userDetails->name;
                $loginResponse->token = Authontication::generateToken();
                $tokenPayload = new stdClass();
                $tokenPayload->token = $loginResponse->token;
                updateUserDetails($userDetails->id, $tokenPayload);
                $loginResponse->features = getAvailableFeatures($userDetails->userRoleId);
                $loginResponse->isSuperAdmin = $userDetails->gid == 25 ? true : false;
                $loginResponse->isDirector = $userDetails->gid == 31 ? true : false;
                return new ActionResponse(1, $loginResponse);
            }
        }
    }
    $res = new ActionResponse(0, null, 403);
    return $res;
}

function checkUserPassword($savePassword, $enterPassword)
{
    // print_r($savePassword);
    // echo "<br>";
    // print_r($enterPassword);die;
    $parts = explode(':', $savePassword);
    $crypt = $parts[0];
    $salt = @$parts[1];
    $testcrypt = Authontication::getCryptedPassword($enterPassword, $salt);
    // print_r($crypt);
    // echo "test ";
    // print_r($testcrypt);die;
    if ($crypt == $testcrypt) {
        return true;
    }
    return false;
}

function verifyMobile($payload)
{
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["userId", "mobile_activation"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    $whereCondition = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
    if (CommonUtils::isValid($whereCondition)) {
        $query = "SELECT id FROM `jos_users` $whereCondition";
        $sth = $db->prepare($query);
        $sth->execute();
        $userDetails = $sth->fetchObject();
        if ($userDetails) {
            // print_r($userDetails);
            $userUpdatePayload = new stdClass();
            $userUpdatePayload->isPhoneVerified = 1;
            $isUserUpdated = updateUserDetails($userDetails->id, $userUpdatePayload);
            if ($isUserUpdated->status == 0) {
                return $isUserUpdated;
            }
            $isEnabled = enableUserBasedOnVerification($userDetails->id);
            if ($isEnabled->status == 0) {
                return $isEnabled;
            }
            $res_payload = CommonUtils::prepareResponsePayload(["userId"], [$userDetails->id]);
            return new ActionResponse(1, $res_payload);
        }
    }
    // print_r($userDetails);die
    return new ActionResponse(0, null);
}


function updateUserDetails($userId, $payload)
{
    global $db, $logger;
    try {
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
        if (CommonUtils::isValid($updateStr)) {
            $sql = "update jos_users set " . $updateStr . " where id=$userId ";
            $sth = $db->prepare($sql);
            $sth->execute();
            return new ActionResponse(1, $userId);
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in updating user details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null, 0, "Error in updating user details");
    }
}

function enableUserBasedOnVerification($userId)
{
    global $db, $logger;
    try {
        $query = "SELECT isPhoneVerified, isEmailVerified FROM `jos_users` where id=$userId";
        $sth = $db->prepare($query);
        $sth->execute();
        $userDetails = $sth->fetchObject();
        // TODO: change it to && when both verification become mendatory
        if ($userDetails->isPhoneVerified == 1 && $userDetails->isEmailVerified == 1) {
            $userType = getUserTypeByUserId($userId);
            if ($userType == 31) { // Director gID = 31
                // isPhoneVerified  
                $userDetails->isApprovalRequired = true;
                return $userDetails;
            } else {
                $query = "update `jos_users` set block = 0  where id=$userId";
                $sth = $db->prepare($query);
                $sth->execute();
            }
        }
    } catch (PDOException $e) {
        $logger->error("error in enable user after verification");
        $logger->error($e->getMessage());
        // echo $e->getMessage();
        return new ActionResponse(0, null);
    }
    return $userDetails;
}

function getAvailableFeatures($roleTypeId)
{
    global $db;
    $query = "SELECT  `feature` FROM `gsa_role_features` WHERE  `roleTypeId`=" . $roleTypeId . "";
    $sth = $db->prepare($query);
    $sth->execute();
    $userDetails = $sth->fetchAll(PDO::FETCH_COLUMN, 0);
    if (CommonUtils::isValid($userDetails)) {
        return $userDetails;
    } else {
        return array();
    }
}

function fetchUserTypes($payload)
{
    global $db, $logger;
    if (!isset($payload)) {
        $payload = new stdClass();
    }
    $payload->enabled = 1;
    $whereCondition = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("USERTYPE"));
    $query = "SELECT  id, title  FROM `jos_core_acl_aro_groups`  $whereCondition order by display_order";
    $sth = $db->prepare($query);
    $sth->execute();
    // die;
    $menuDetails = $sth->fetchAll();
    if (CommonUtils::isValid($menuDetails)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $menuDetails;
        return new ActionResponse(1, $dataResponse);
    }
}

function userVerification()
{
    global $db, $logger;
    $activation_code = $_REQUEST['key'];
    $domain_id = $_REQUEST['domid'];

    // print_r($activation_code);

    $sql = "select id from jos_users where email_activation='$activation_code'";
    $sth = $db->prepare($sql);
    $sth->execute();
    $result = $sth->fetchObject();
    $activate_user_id = $result->id;

    if (CommonUtils::isValid($activate_user_id)) {
        // echo $user_id;
        $emailVerify = 1;
        $sql = "update jos_users set `isEmailVerified`= '" . $emailVerify . "'  where id=" . $activate_user_id;
        $sth = $db->prepare($sql);
        $sth->execute();

        $verifyCallResponse = enableUserBasedOnVerification($activate_user_id);

        if (CommonUtils::isValid($verifyCallResponse)) {
            $domain = getDomain($domain_id);
            if ($verifyCallResponse->isPhoneVerified == 0) {
                $newURL = $domain . '/mobile-verification/' . $activate_user_id;
            } else if ($verifyCallResponse->isApprovalRequired) {
                $newURL = $domain . '/pending-profile-approval';
            } else {
                $newURL = $domain . '/login';
            }
            print_r($newURL);
            header('Location: ' . $newURL);
        } else { }
    }
}

function getDomain($domain_id)
{
    $domain = getDomainNameFromId($domain_id);
    $check_http = explode("/", $domain);
    if ($check_http[0] == 'http:' || $check_http[0] == 'https:') {
        $newURL = $domain;
    } else {
        $newURL = 'http://' . $domain;
    }
    return $newURL;
}

function resend_verfication_email($userId, $DomainId)
{
    $resendEmail = send_verfication_email($userId, $DomainId);
    if ($resendEmail) {
        $responseDetail = new stdClass();
        $responseDetail->message = "Succesfully sent email, Please check your email";
        $dataResponse = new DataResponse();
        $dataResponse->data = $responseDetail;
        return new ActionResponse(1, $dataResponse);
    }
}

function createUser($payload, $returnFalseOnDuplcate = true)
{
    global $db, $logger;
    try {
        $userDetails = getUserDetail($payload->email, $payload->primary);
        if (CommonUtils::isValid($userDetails)) {
            if ($returnFalseOnDuplcate) {
                return new ActionResponse(0, null, 0, "User already exist");
            } else {
                return new ActionResponse(1, $userDetails->id);
            }
        }
        // print_r($userDetails);
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
        if (CommonUtils::isValid($updateStr)) {
            $sql = "INSERT INTO jos_users set " . $updateStr . "";
            $sth = $db->prepare($sql);
            $sth->execute();
            // print_r($payload);
            $lastInsertId = $db->lastInsertId();

            send_verfication_email($lastInsertId, $payload->domainId);

            $res_payload = CommonUtils::prepareResponsePayload(["userId"], [$lastInsertId]);
            return new ActionResponse(1, $res_payload);
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in inserting user details");
        $logger->error($e->getMessage());
        // echo $e->getMessage();
        return new ActionResponse(0, null, 0, "Error in adding user details");
    }
}

function updateUserProfile($payload)
{
    global $db, $logger;
    $userDetails = getUserDetail($payload->email, $payload->primary);
    // TODO: check user aleay exist 
    $userUpdateRes = new ActionResponse(0, null);
    $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
    if (CommonUtils::isValid($updateStr)) {
        $sql = "UPDATE jos_users set " . $updateStr . "";
        $sql .= " WHERE id =" . $payload->userId;
        //print_r($sql);die;
        $sth = $db->prepare($sql);
        $res = $sth->execute();
        if (CommonUtils::isValid($res)) {
            $userUpdateRes->status = 1;
            $res_payload = CommonUtils::prepareResponsePayload(["userId"], [$payload->userId]);
            $userUpdateRes->payload = $res_payload;
        } else {
            $userUpdateRes->errorMessage = "Error in updating user";
            $logger->error("Error in updating user for payload");
            $logger->error(json_encode($payload));
            $logger->error($sql);
        }
    } else {
        $userUpdateRes->errorMessage = "Error in updating user";
        $logger->error("Error in generating update string for user for payload");
        $logger->error(json_encode($payload));
    }
    return $userUpdateRes;
}

function changeUserPassword($payload)
{
    // print_r($payload);
    global $db, $logger;
    $userId = $payload->userId;
    $userUpdateRes = new ActionResponse(0, null);
    $userDetails = getUserDetailByUserId($userId);
    if (CommonUtils::isValid($userDetails)) {
        $passwordMatch = checkUserPassword($userDetails->password, $payload->current_password);
        if ($passwordMatch) {
            $updatedPassword = Authontication::generatePassWordToStore($payload->password);

            $sql = "UPDATE jos_users set `password`= '" . $updatedPassword . "'";
            $sql .= " WHERE id =" . $userId;
            $sth = $db->prepare($sql);
            $res = $sth->execute();
            if (CommonUtils::isValid($res)) {
                $userUpdateRes->status = 1;
            } else {
                $userUpdateRes->errorMessage = "Error in updating password";
                $logger->error("Error in updating user Password");
                $logger->error(json_encode($payload));
                $logger->error($sql);
            }
        }
        return $userUpdateRes;
    }
}

function fetchUserprofile($payload)
{
    $userRes = fetchUserList($payload);
    if (CommonUtils::isValid($userRes)) {
        $dataResponse = new DataResponse();
        if (isset($userRes->payload)) {
            $dataResponse->data = $userRes->payload->data[0];
            return new ActionResponse(1, $dataResponse);
        } else {
            return new ActionResponse(0, null);
        }
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchAllUserList($payload)
{
    //print_r($payload);
    global $db, $logger;
    try {
        $payload->isPhoneVerified = 1;
        $payload->isEmailVerified = 1;
        $userResponse = new ActionResponse(0, null);
        $updateStr = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
        $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
        $orderBy = " order by id desc ";
        if (isset($payload->orderBy) && $orderBy) {
            $orderBy = $payload->orderBy;
        }
        $sql = "select * , id as userId FROM jos_users " . $updateStr;
        $sql .= $orderBy;

        // echo $sql;
        // $sth = $db->prepare($sql);
        // $sth->execute();
        // $userDetails = $sth->fetchAll();
        $result = prepareQueryResult($db, $sql, $payload);
        // print_r($result);die;  
        if ($result) {
            addOwnerShipDetailsIfApplicable($payload, $result);
            return $result;
        } else {
            $errorMsg = "User Profile result is not valid";
            $userResponse->errorMessage = $errorMsg;
            $logger->error($errorMsg);
        }
        return $userResponse;
    } catch (PDOException $e) {
        $logger->error("Error in inserting user details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function fetchUserList($payload)
{
    //print_r($payload);

    global $db, $logger;
    try {
        $userResponse = new ActionResponse(0, null);
        $updateStr = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
        $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
        $orderBy = " order by name ";
        if (isset($payload->orderBy) && $orderBy) {
            $orderBy = $payload->orderBy;
        }
        $sql = "select $columnToFetch FROM jos_users " . $updateStr;
        $sql .= $orderBy;
        // echo $sql;die;
        $sth = $db->prepare($sql);
        $sth->execute();
        $userDetails = $sth->fetchAll();

        if (CommonUtils::isValid($userDetails)) {
            // make sure when requireAccessDetails is true columnToFetch must include gid
            if (isset($payload->requireAccessDetails) && $payload->requireAccessDetails) {
                foreach ($userDetails as &$singleUser) {
                    $singleUser['isSuperAdmin'] = $singleUser['gid'] == 25 ? true : false;
                    $singleUser['isDirector'] = $singleUser['gid'] == 31 ? true : false;
                }
            }
            // echo "coming here";die;
            $dataResponse = new DataResponse();
            $dataResponse->data = $userDetails;
            return new ActionResponse(1, $dataResponse);
        }
    } catch (PDOException $e) {
        $logger->error("Error in inserting user details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function fetchAllDirectors($payload)
{
    if (CommonUtils::isValid($payload)) {
        $payload = new stdClass();
        // TODO should fetch id from table jos_core_acl_aro_groups
        $payload->gid = 31;
        $payload->columnToFetch = ["id", "name as title"];
        $payload->orderby = "title";
        return fetchUserList($payload);
    }
}

function fetchSingleUser($payload)
{
    $userRes = fetchUserList($payload);
    //print_r($payload);die;
    if (CommonUtils::isValid($userRes)) {
        return $userRes->payload->data[0];
    }
}

function changeBlockToUnblock($payload)
{
    global $db, $logger;
    $isRequestInValid = isRequestHasValidParameters($payload, ["userId"]);
    if ($isRequestInValid) {
        return $isRequestInValid;
    }
    // TODO check if user is logged in and super admin then only process below code
    if (CommonUtils::isValid($payload)) {

        $sql = "update `jos_users` set `block`= " . $payload->block . " where id= $payload->userId ";
        $sth = $db->prepare($sql);
        $sth->execute();
        return new ActionResponse(1, $payload->userId);
        //print_r($payload->userId); die;
    }
}
