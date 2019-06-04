<?php 
require_once("utility.php");
global $db, $logger;

function fetchAllSports($payload)
{
    global $db, $logger;
    $query = "SELECT  id, name as title  FROM `jos_community_groups_category`";
    if(isset($payload->sportIds) && $payload->sportIds){
        $query .= " where id in ($payload->sportIds)";
    }
    $query .=" order by title ";   
    // echo $query;
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

function fetchAgegroupById($id)
{
    global $db, $logger;
    $query = "SELECT  agegroup from jos_league_agegroup where id=$id";
    $sth = $db->prepare($query);
    $sth->execute();
    $res = $sth->fetchObject();
    if (CommonUtils::isValid($res)) {
        return $res->agegroup;
    } else {
        return null;
    }
}

function fetchAllAgegroup($payload, $onlyColumn = false)
{
    global $db, $logger;
    if (!isset($payload->columnToFetch)) {
        $payload->columnToFetch = ["age as id", "agegroup as title"];
    }
    $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("AGEGROUPS"));
    $query = "SELECT  $columnToFetch   FROM `jos_league_agegroup` $whereCondition order by age asc ";
    $sth = $db->prepare($query);
    $sth->execute();
    if ($onlyColumn) {
        $ageGroupDetails = $sth->fetchAll(PDO::FETCH_COLUMN, 0);
    } else {
        $ageGroupDetails = $sth->fetchAll();
    }
    if (CommonUtils::isValid($ageGroupDetails)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $ageGroupDetails;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchAllClassifications($payload, $onlyColumn = false)
{
    global $db, $logger;
    if (!isset($payload->columnToFetch)) {
        $payload->columnToFetch = ["id", "classification as title"];
    }
    if (!isset($payload->classificationid)) {
        $payload->classificationid = 1;
    }
    $columnToFetch = DataBaseUtils::getColumnToFetchBasedOnPayload($payload);
    $whereCondition = DataBaseUtils::getWhereConditionBasedOnPayload($db, $payload, MetaUtils::getMetaColumns("CLASSIFICATIONS"));
    $query = "SELECT  $columnToFetch   FROM `jos_league_classification` $whereCondition order by winning_criteria asc ";
    $sth = $db->prepare($query);
    $sth->execute();
    if ($onlyColumn) {
        $ageGroupDetails = $sth->fetchAll(PDO::FETCH_COLUMN, 0);
    } else {
        $ageGroupDetails = $sth->fetchAll();
    }
    if (CommonUtils::isValid($ageGroupDetails)) {
        $dataResponse = new DataResponse();
        $dataResponse->data = $ageGroupDetails;
        return new ActionResponse(1, $dataResponse);
    } else {
        return new ActionResponse(0, null);
    }
}

function loadAllClassificationsOfTournament($payload)
{
    global $db, $logger;
    if (isset($payload->tournamentId)) {
        $sportsPayload = new stdClass();
        $sportsPayload->sportId = getTournamentSportsId($payload->tournamentId);
        return fetchAllClassifications($sportsPayload);
    } else {
        return new ActionResponse(0, null);
    }
}

function fetchAllAgegroupsOfTournament($payload)
{
    global $db, $logger;
    if (isset($payload->tournamentId)) {
        $sportsPayload = new stdClass();
        $sportsPayload->sportId = getTournamentSportsId($payload->tournamentId);
        $sportsPayload->columnToFetch = $payload->columnToFetch;
        return fetchAllAgegroup($sportsPayload);
    } else {
        return new ActionResponse(0, null);
    }
}

function getTournamentSportsId($tournamentId)
{
    global $db, $logger;
    $sql = " select sportstypeid from jos_gsa_tournament where id=" . $tournamentId;
    $sth = $db->prepare($sql);
    $sth->execute();
    $result = $sth->fetchObject();
    return $result->sportstypeid;
}

function getDatesForsport($sportid, $year = null, $ismk = false)
{
    $data = new stdClass();
    if (!$year) {
        $year = date('Y');
    }
    if ($sportid == 7 || $sportid == 16) {
        $data->firstDate = ($year - 1) . '-08-01';
        $data->lastDate = $year . '-07-31';
    } else {
        $data->firstDate = $year . '-01-01';
        $data->lastDate = $year . '-12-31';
    }

    if ($ismk) {
        $data->firstDate = CommonUtils::getMktime($data->firstDate);
        $data->lastDate = CommonUtils::getMktime($data->lastDate);
    }
    return $data;
}