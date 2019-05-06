<?php 
require_once("utility.php");
global $db;


function isValidResponse($actionResponse)
{
    if (!CommonUtils::isValid($actionResponse)) {
        return false;
    } else if ($actionResponse->status === 0) {
        return false;
    }
    return true;
}

function isRequestHasValidParameters($requestPayload, $validParamList)
{
    global $logger;
    $valid = true;
    if (count($validParamList) > 0) {
        foreach ($validParamList as $paramKey) {
            if (!isset($requestPayload->$paramKey) || !CommonUtils::isValid($requestPayload->$paramKey)) {
                $valid = false;
                break;
            }
        }
    }
    if (!$valid) {
        $logger->error("Mendatory parameter is not provided for rest call in payload");
        $logger->error(json_encode($requestPayload));
        return new ActionResponse(0, null, 0, "Mendatory parameters are not provided");
    }
    return false;
}

function getUserDetailsFromToken($login_token)
{
    global $db, $logger;
    try {
        if (CommonUtils::isValid($login_token)) {
            $sql = "select id as userId from  jos_users  where login_token='" . $login_token . "'";
            $sth = $db->prepare($sql);
            $sth->execute();
            return $sth->fetchObject();
        } else {
            return null;
        }
    } catch (PDOException $e) {
        $logger->error("Error in updating user details");
        $logger->error($e->getMessage());
        return null;
    }
}

function fetchMenuList($db, $logger, $payload)
{
    // print_r($payload);
    $userName = isset($payload->userId) ? $payload->userId : 0;
    $query = "SELECT  * FROM `gsa_user_menu` WHERE  `userId`=" . $db->quote($userName) . " || `userId`=0 order by item_order";
    $sth = $db->prepare($query);
    $sth->execute();
    $menuDetails = $sth->fetchAll();
    // print_r($userDetails);
    if (CommonUtils::isValid($menuDetails)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $menuDetails;
        return new ActionResponse(1, $dataResponse);
    }
    // print_r($userDetails);die;
    return new ActionResponse(0, null);
}

function getRowCountOfData($db, $query)
{
    $total = 0;
    $sth = $db->prepare($query);
    try {
        $sth->execute();
        $total = $sth->rowCount();
    } catch (PDOException $e) {
        // echo $e->getMessage();
        // TODO: Log error message
    }
    return $total;

}

function prepareQueryResult($db, $query, $payload)
{
    // echo $query;
    $isPaginRequired = true;
    if (isset($payload->isPagingRequired) && $payload->isPagingRequired == false) {
        $isPaginRequired = false;
    }
    if ($isPaginRequired) {
        if (!isset($payload->pagingInfo) || !CommonUtils::isValid($payload->pagingInfo)) {
            $pagingInfo = new stdClass();
            $pagingInfo->offset = 0;
            $pagingInfo->limit = 10;
            $payload->pagingInfo = $pagingInfo;
        }
    // $pagingInfo = null;
        if (CommonUtils::isValid($payload->pagingInfo)) {
            if (isset($payload->pagingInfo->offset) && isset($payload->pagingInfo->limit)) {
                $pagingInfo = new PagingInfo();
                $pagingInfo->offset = $payload->pagingInfo->offset;
                $pagingInfo->limit = $payload->pagingInfo->limit;
                $pagingInfo->total = getRowCountOfData($db, $query);
                $start = $payload->pagingInfo->offset == 0 ? 1 : $payload->pagingInfo->offset * $payload->pagingInfo->limit;
                $query .= " limit " . $start . "," . $payload->pagingInfo->limit;
            }
        }
    }
    // echo $query;
    $sth = $db->prepare($query);
    $sth->execute();
    $data = $sth->fetchAll();
    if (CommonUtils::isValid($data)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = CommonUtils::UTF_ENCODE($data);
        if ($isPaginRequired && CommonUtils::isValid($pagingInfo)) {
            $dataResponse->pagingInfo = $pagingInfo;
        }
        return new ActionResponse(1, $dataResponse);
    }
}

function fetchMenuItem($db, $logger, $payload)
{
    $whereCondition = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("USERMENU"));
    if (CommonUtils::isValid($whereCondition)) {
        $query = "SELECT * FROM `gsa_user_menu` $whereCondition ";
        $sth = $db->prepare($query);
        $sth->execute();
        $menuDetails = $sth->fetchObject();
        if (CommonUtils::isValid($menuDetails)) {
            $dataResponse = new DataResponse();
            $dataResponse->data = $menuDetails;
            return new ActionResponse(1, $dataResponse);
        }
    }
    return new ActionResponse(0, null);
}

function fetchMenuParent($db, $logger, $payload)
{
    if (!isset($payload)) {
        $payload = new stdClass();
    }
    $payload->type = "group";
    $whereCondition = DatabaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("USERMENU"));
    $query = "SELECT  id, title  FROM `gsa_user_menu` WHERE $whereCondition ";
    $sth = $db->prepare($query);
    $sth->execute();
    // die;
    $menuDetails = $sth->fetchAll();
    if (CommonUtils::isValid($menuDetails)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $menuDetails;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchAllStates($payload)
{
    global $db, $logger;
    $query = "SELECT  state_name as id  FROM `jos_league_states` order by id ";
    $sth = $db->prepare($query);
    $sth->execute();
    $menuDetails = $sth->fetchAll();
    if (CommonUtils::isValid($menuDetails)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $menuDetails;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function addMenuItem($db, $logger, $payload)
{
    try {
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("USERMENU"));
        if (CommonUtils::isValid($updateStr)) {
            $sql = "INSERT INTO gsa_user_menu set " . $updateStr . "";
            $sth = $db->prepare($sql);
            $sth->execute();
            return new ActionResponse(1, $db->lastInsertId());
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error("Error in inserting menu details");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function editMenuItem($db, $logger, $payload)
{
    try {
        $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("USERMENU"));
        if (CommonUtils::isValid($updateStr) && isset($payload->id) && $payload->id > 0) {
            $sql = "update gsa_user_menu  set $updateStr  where id=" . $payload->id;
            $sth = $db->prepare($sql);
            $sth->execute();
            return new ActionResponse(1, "Success");
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error(" Error in editing menu details ");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function deleteMenuItem($db, $logger, $payload)
{
    try {
        if (isset($payload->menuId) && $payload->menuId > 0) {
            $sql = "delete from gsa_user_menu  where id=" . $payload->menuId;
            $sth = $db->prepare($sql);
            $sth->execute();
            return new ActionResponse(1, "Success");
        } else {
            return new ActionResponse(0, null);
        }
    } catch (PDOException $e) {
        $logger->error(" Error in deleting menu details ");
        $logger->error($e->getMessage());
        return new ActionResponse(0, null);
    }
}

function getDomainIdFromName($domain)
{
    global $db, $logger;
    $sql = " select id from gsa_multisites where domain like '%$domain%'";
    $sth = $db->prepare($sql);
    $sth->execute();
    $result = $sth->fetchObject();
    return $result ? $result->id : null;
}

function fetchSiteGlobals($payload, $domainId = 0)
{
    global $db, $logger;
    $siteGlobalResponse = new ActionResponse(0, null);
    if ($domainId === 0) {
        $isRequestInValid = isRequestHasValidParameters($payload, ["domain"]);
        if ($isRequestInValid) {
            $siteGlobalResponse->errorMessage = "Request is not valid for fetching site globals";
            return $siteGlobalResponse;
        }
        $payload->domainId = getDomainIdFromName($payload->domain);
    } else {
        $payload->domainId = $domainId;
    }
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("MULTISITESETTINGS"), "ms");
    if (CommonUtils::isValid($whereCondition)) {
        try {
            $sql = "SELECT ms.id as domainId, ms.heading as siteHeading, ms.sportIds,  ";
            $sql .= " ms.images as images, ms.states, ms.newsTicker as siteNews from gsa_multisite_settings as ms ";
            $sql .= $whereCondition;
            $sth = $db->prepare($sql);
            // echo $sql;
            $sth->execute();
            $result = $sth->fetchObject();
            $res = &$result;
            $dataResponse = new DataResponse();
            $sportPayload = new stdClass();
            $sportPayload->sportIds = $result->sportIds;
            $sportResponse = fetchAllSports($sportPayload);
            if ($sportResponse->status === 1) {
                $res->sportValues = $sportResponse->payload->data;
            }
            if (CommonUtils::isValid($result->states)) {
                $stateArray = explode(",", $result->states);
                if (CommonUtils::isValid($stateArray)) {
                    $stateValues = array();
                    foreach ($stateArray as $state) {
                        $stateObj = new stdClass();
                        $stateObj->id = $state;
                        $stateObj->title = $state;
                        array_push($stateValues, $stateObj);
                    }
                }
                $res->stateValues = $stateValues;
            }
            $dataResponse->data = $res;
            return new ActionResponse(1, $dataResponse);
        } catch (Exception $e) {
            $logger->error("Error in fetching site settings");
            $logger->error($e->getMessage());
            $logger->error(json_encode($payload));
            echo $e->getMessage();
            $siteGlobalResponse->errorMessage = "Error in fetching site settings";
            return $siteGlobalResponse;
        }
    } else {
        $siteGlobalResponse->errorMessage = "Request is not valid for site settings";
    }
    return $siteGlobalResponse;
}

function updateSiteGlobals($payload)
{

    global $db, $logger;
    $siteGlobalResponse = new ActionResponse(0, null);
    $isRequestInValid = isRequestHasValidParameters($payload, ["domainId"]);
    if ($isRequestInValid) {
        $siteGlobalResponse->errorMessage = "Request is not valid for fetching site globals";
        return $siteGlobalResponse;
    }
    if (isset($payload->domainId) && $payload->domainId) {
        $domainId = $payload->domainId;
    } else {
        $domainId = getDomainIdFromName($payload->domain);
    }

    $updateStr = DatabaseUtils::getUpdateString($db, $payload, MetaUtils::getMetaColumns("MULTISITESETTINGS"));
    if (CommonUtils::isValid($updateStr)) {
        try {
            $sql = "update gsa_multisite_settings set $updateStr";
            $sql .= " where id = " . $domainId;
            $sth = $db->prepare($sql);
            // echo $sql;die;
            $sth->execute();
            $newPayload = new stdClass();
            $newDetail = fetchSiteGlobals($newPayload, $payload->domainId);
            return $newDetail;
            // print_r($newDetail);
            // die;
        } catch (Exception $e) {
            // echo $e->getMessage();
            $logger->error(" error in updating site gloabls");
            $logger->error($e->getMessage());
        }
    }
    return $siteGlobalResponse;
}