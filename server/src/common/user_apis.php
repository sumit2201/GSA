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
function login($db, $logger, $payload)
{
    // echo "<pre>";
    // print_r($payload);
    $userName = $payload->username;
    $userDetails = getUserDetail($userName);
    if (CommonUtils::isValid($userDetails)) {
        $parts = explode(':', $userDetails->password);
        $crypt = $parts[0];
        $salt = @$parts[1];
        $testcrypt = Authontication::getCryptedPassword($payload->password, $salt);
        if ($crypt == $testcrypt) {
            if ($userDetails->isEmailVerified == 0 && $userDetails->isPhoneVerified == 0) {
                return new ActionResponse(0, null, 0, USER_VERIFICATION_PENDING);
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
        if ($userDetails->isPhoneVerified == 1 || $userDetails->isEmailVerified == 1) {
            $query = "update `jos_users` set block = 0  where id=$userId";
            $sth = $db->prepare($query);
            $sth->execute();
        }
    } catch (PDOException $e) {
        $logger->error("error in enable user after verification");
        $logger->error($e->getMessage());
        // echo $e->getMessage();
        return new ActionResponse(0, null);
    }
    return new ActionResponse(1, $userId);
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
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
        if (CommonUtils::isValid($updateStr)) {
            $sql = "INSERT INTO jos_users set " . $updateStr . "";
            $sth = $db->prepare($sql);
            $sth->execute();
            $res_payload = CommonUtils::prepareResponsePayload(["userId"], [$db->lastInsertId()]);
            return new ActionResponse(1, $res_payload);
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in inserting user details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null, 0, "Error in adding user details");
    }
}

function fetchUserList($payload)
{
    global $db, $logger;
    try {
        $updateStr = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("GSAUSER"));
        $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
        $orderBy = "";
        if (isset($payload->orderBy) && $orderBy) {
            $orderBy = $payload->orderBy;
        }
        if (CommonUtils::isValid($updateStr)) {
            $sql = "select $columnToFetch FROM jos_users " . $updateStr;
            $sql .= $orderBy;
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
                $dataResponse = new DataResponse();
                $dataResponse->data = $userDetails;
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