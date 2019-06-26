<?php 
require_once('constants.php');
function quoteStr($str)
{
    return "'" . $str . "'";
}
class TimeUtility
{
    public static function getCurrentTime()
    {
        return time();
    }
}
class CommonUtils
{
    public static function isValid($param)
    {
        if (isset($param) && !empty($param)) {
            return true;
        }
    }

    public static function UTF_ENCODE($data) // so that json encode works
    {
        $newData = array();
        if (CommonUtils::isValid($data) && is_array($data)) {
            foreach ($data as $row) {
                $row = array_map('utf8_encode', $row);
                array_push($newData, $row);
            }
            $data = $newData;
        }

        return $data;
    }

    public static function prepareResponsePayload($keys, $values)
    {
        $resposneData = new stdClass();
        for ($key_count = 0; $key_count < count($keys); $key_count++) {
            $key_val = $keys[$key_count];
            $val = $values[$key_count];
            $resposneData->$key_val = $val;
        }
        return $resposneData;
    }

    public static function getNumericValue($stringVal)
    {
        $strVal = trim($stringVal);
        return is_numeric($strVal) ? $strVal : 0;
    }

    public static function getNumberFormat($number)
    {
        return is_float($number) ? number_format($number, 2) : $number;
    }

    public static function getMktime($date)
    {
        $dateArray = explode('-', $date);
        return mktime(0, 0, 0, $dateArray[1], $dateArray[2], $dateArray[0]);

    }

}

class Authontication
{
    public static function generateToken()
    {
        return bin2hex(openssl_random_pseudo_bytes(8));
    }

    public static function getCryptedPassword($plaintext, $part)
    {
        // TODO can add different authontication encryption 
        $salt = self::getSalt($part);
        $encrypted = ($salt) ? md5($plaintext . $salt) : md5($plaintext);
        return $encrypted;
    }

    public static function genRandomPassword($length = 8)
    {
        $salt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $len = strlen($salt);
        $makepass = '';

        $stat = @stat(__FILE__);
        if (empty($stat) || !is_array($stat)) $stat = array(php_uname());

        mt_srand(crc32(microtime() . implode('|', $stat)));

        for ($i = 0; $i < $length; $i++) {
            $makepass .= $salt[mt_rand(0, $len - 1)];
        }

        return $makepass;
    }

    public static function generatePassWordToStore($plainText)
    {
        $salt = self::genRandomPassword(32);
        $crypt = self::getCryptedPassword($plainText, $salt);
        return $crypt . ':' . $salt;
    }

    public static function getSalt($part)
    {
        // implement for different encryption technique
        // file for 1.5/old site is /ibraries/joomla/user/helper.php
        return $part;
    }
}

class ActionResponse
{
    public $status;
    public $payload;
    public $errorCode;
    public $errorMessage;
    function __construct($status, $payload, $errorCode = 0, $errorMessage = null)
    {
        $this->status = $status;
        $this->payload = $payload;
        $this->errorCode = $errorCode;
        $this->errorMessage = $errorMessage;
    }

    public function getResponse()
    {
        $response = new stdClass();
        $response->status = $this->status;
        $response->payload = $this->payload;
        $response->errorCode = $this->errorCode;
        $response->errorMessage = $this->errorMessage;
        // return $response;
        // echo "<pre>";
        // print_r($response);
        // echo json_encode($response);die;
        return json_encode($response);
    }

}

class DataResponse
{
    public $data;
    public $pagingInfo;
}

class PagingInfo
{
    public $total;
    public $offset;
    public $limit;
}

class ActionInfo
{
    public $title;
    function __construct($title)
    {
        $this->title = $title;
    }
}


class UserInfo
{
    public $ip_address;
    public $user_agent;
    public $userId;
    function __construct($ip_address = "null", $user_agent = "null", $userId = 0)
    {
        $this->ip_address = $ip_address;
        $this->user_agent = $user_agent;
        $this->userId = $userId;
    }
}

class DatabaseUtils
{

    public static function getColumnToFetchBasedOnPayload($payload, $alias = "", $columnToFetch = array())
    {
        if (!CommonUtils::isValid($columnToFetch) && isset($payload->columnToFetch)) {
            $columnToFetch = $payload->columnToFetch;
        }
        if (count($columnToFetch) === 0) {
            return $alias . "*";
        } else {
            if ($alias !== "") {
                global $alias;
                array_walk($columnToFetch, function (&$item) {
                    global $alias;
                    $item = $alias . $item;
                });
            }
            return implode(",", $columnToFetch);
        }
    }

    public static function getWhereConditionBasedOnPayload($db, $values, $columnArray, $alias = "", $conditionType = " AND ")
    {
        if ($alias !== "") {
            $alias = $alias . ".";
        }
        $updateStrArr = self::getColumnArrayWithValue($db, $values, $columnArray, false, $alias);
        if ($updateStrArr) {
            return " where " . implode($conditionType, $updateStrArr);
        }
    }

    public static function getWhereConditionArrayBasedOnPayload($db, $values, $columnArray, $alias = "", $conditionType = " AND ")
    {
        if ($alias !== "") {
            $alias = $alias . ".";
        }
        $updateStrArr = self::getColumnArrayWithValue($db, $values, $columnArray, false, $alias);
        return $updateStrArr;
    }

    public static function getWhereStringFromArray($conditionAr, $conditionType = " AND "){
        if ($conditionAr) {
            return " where " . implode($conditionType, $conditionAr);
        }
        return "";
    }


    public static function getUpdateString($db, $values, $columnArray, $forInsert = false)
    {
        $updateStrArr = self::getColumnArrayWithValue($db, $values, $columnArray, $forInsert);
        return implode(",", $updateStrArr);
    }

    public static function modifyValueIfApplicable($columnObj, $value)
    {
        // tmp fix for autocomplete values
        if (isset($value->value)) {
            $updatedValue = $value->value;
        } else {
            $updatedValue = $value;
        }
        if ($columnObj->columnId === "password") {
            $updatedValue = Authontication::generatePassWordToStore($value);
        } else if ($columnObj->columnId === "start_date" || $columnObj->columnId === "end_date") {
            $timestamp = strtotime($value);
            $updatedValue = date('Y-m-d', $timestamp);
        }
        return $updatedValue;
    }

    public static function checkIfParameterHasValueForColumn($values, $columnObj, $forInsert)
    {
        $columnId = $columnObj->columnId;
        if ($columnObj->isCurrentDateTime && $forInsert) { // if a colunn requires current date & time then populate value here no need to find in request payload
            return Date("y-m-d h:i:s");
        } else if (isset($values->$columnId)) {
            if ($columnObj->operator === "between") {
                if ($values->from && $values->to) {
                    return " " . $values->from . " AND " . $values->to;
                }
            } else {
                return $values->$columnId;
            }
        } else {
            if (count($columnObj->additionalNames) > 0)
                foreach ($columnObj->additionalNames as $colName) {
                if (isset($values->$colName) && $values->$colName !== "") {
                    return $values->$colName;
                }
            }
        }
        return null;
    }

    public static function getColumnArrayWithValue($db, $values, $columnArray, $forInsert, $alias = "")
    {
        $updateStrArr = array();
        foreach ($columnArray as $columnObj) {
            $columnId = $columnObj->columnId;
            if ($forInsert && $columnObj->isPrimary) {
                continue;
            }
            $type = $columnObj->type;
            $operator = isset($columnObj->operator) ? $columnObj->operator : "=";
            // force fully set $operator = "=" in case of insert
            if ($forInsert) {
                $operator = "=";
            }
            $valueOfColumnInParameter = self::checkIfParameterHasValueForColumn($values, $columnObj, $forInsert);
            if (CommonUtils::isValid($valueOfColumnInParameter)) {
                $valueToUpdate = self::modifyValueIfApplicable($columnObj, $valueOfColumnInParameter);
                // print_r($valueToUpdate);
                // 1 for number, 2 for array, 0 for string
                if ($type === 2 && is_array($valueToUpdate)) {
                    $updateStr = "$alias`" . $columnId . "` in (" . implode(",", $valueToUpdate).")";
                } else if ($type === 1) {
                    $updateStr = "$alias`" . $columnId . "`" . $operator . $valueToUpdate;
                } else if($operator=="like"){
                    $updateStr = "$alias`" . $columnId . "` like " . "'%".$valueToUpdate."%'";
                }else{
                    $updateStr = "$alias`" . $columnId . "`" . $operator . $db->quote($valueToUpdate);
                }
                array_push($updateStrArr, $updateStr);
            }
        }
        return $updateStrArr;
    }
}

class MetaUtils
{
    public static $dbColumnMapping = array();
    public static function setMetaColumns()
    {
        $ob = function ($columnId, $dataType = 0, $additionalNames = [], $isPrimary = false, $operator = "=", $isCurrentDateTime = false) {
            $obj = new stdClass();
            $obj->type = $dataType;
            $obj->isPrimary = $isPrimary;
            $obj->columnId = $columnId;
            $obj->additionalNames = $additionalNames;
            $obj->operator = $operator;
            $obj->isCurrentDateTime = $isCurrentDateTime;
            return $obj;
        };
        $dbColumnMapping = array();
        $dbColumnMapping["USERMENU"] = array($ob("id", 1, [], true), $ob("title"), $ob("content"), $ob("parentId", 1), $ob("type"));
        $dbColumnMapping["TEAM"] = array(
            $ob("id", 1, ["teamId"], true), $ob("name", 0, ["team_name"], false, "like"), $ob("age", 1, ["agegroup"]), $ob("team_classification", 1, ["classification"]), $ob("team_state", 0, ["state"]), $ob("team_city"),$ob("team_cell", 0, ["team_secondary"]),
            $ob("categoryid", 1, ["sportId"]), $ob("ownerid", 1), $ob("team_sanction", 0),
            $ob("team_primary", 0, ["primary"]), $ob("group_banner", 0, ["team_banner"]),
            $ob("email", 0, ["team_email"]),
            $ob("createdBy", 1), $ob("created", 0, [], false, "=", true)
        );
        $dbColumnMapping["USERTYPE"] = array($ob("enabled", 1));
        $dbColumnMapping["TOURNAMENT"] = array(
            $ob("id", 1, ["tournamentId"], true), $ob("title"), $ob("start_date", 0, [], false, ">="), $ob("end_date", 0, [], false, "<="), $ob("description"), $ob("postedBy"),
            $ob("directorid",1,["directorId"]), $ob("sportstypeid", 1, ["sportId"]),
            $ob("state"), $ob("show_in_front", 1, [], false, "!="),
            $ob("is_double", 1), $ob("gate_fees", 1), $ob("reservation_fees", 1)
        );
        $dbColumnMapping["GSAUSER"] = array(
            $ob("id", 1, [], true), $ob("id", 1, ["userId"]), $ob("id", 1, ["except"], true, "!="), $ob("name"),
            $ob("last_name"), $ob("password"), $ob("email", 0, ["search_email"]),
            $ob("primary"), $ob("gid", 1), $ob("mobile_activation", 1),
            $ob("isEmailVerified", 1), $ob("isPhoneVerified", 1), $ob("profileImage", 0), $ob("login_token", 0, ["token"])
        );
        $dbColumnMapping["AGEGROUPS"] = array($ob("sports_type_id", 1, ["sportId"]), $ob("age", 1, [], true, "between"));
        $dbColumnMapping["CLASSIFICATIONS"] = array($ob("sportstypeid", 1, ["sportId"]), $ob("classificationid", 1));
        $dbColumnMapping["PARKS"] = array($ob("id", 1, ["parkId"], true), $ob("id", 2, ["parkIds"]), $ob("parkname", 0, ["parkName"]), $ob("state", 0, ["parkState"]), $ob("city", 0, ["parkCity"]), $ob("zip", 0, ["parkZipCode"]), $ob("address", 0, ["parkAddress"]));
        $dbColumnMapping["TOURNAMENTTEAMS"] = array($ob("tournament_teams", 1, ['teamId']), $ob("tournament_id", 1, ["tournamentId"]), $ob("comments"));
        $dbColumnMapping["TOURNAMENTBRACKET"] = array(
            $ob("id", 1, [], true), $ob("tournament_id", 1, ["tournamentId"]), $ob("teams", 0, []), $ob("brackettypeid", 1, []), $ob("numberofteams", 1, []),
            $ob("directorid", 1, []), $ob("startdate", 0, []), $ob("enddate", 0, []), $ob("agegroup", 1, []),
            $ob("classification", 1, []), $ob("bracketplaytime", 0, []), $ob("poolplaytime", 0, []),
            $ob("championshipgametime", 0, []), $ob("ifgametime", 0, []), $ob("add_info", 0, []),
            $ob("add_footer_info", 0, []), $ob("orderoffinish", 0, []), $ob("orderofwin", 0, []), $ob("orderofloss", 0, []), $ob("orderoftie", 0, []), $ob("total", 0, []), $ob("ranking_status", 1, [])
        );
        $dbColumnMapping["TOURNAMENTBRACKETSCORE"] = array(
            $ob("game"), $ob("team1shortform"), $ob("team2shortform"),
            $ob("team1id"), $ob("team2id"), $ob("team1_score", 1),
            $ob("team2_score", 1), $ob("team1_rankscore", 1),
            $ob("team2_rankscore", 1), $ob("game_time"), $ob("game_day"),
            $ob("game_field"), $ob("bracketid")
        );
        $dbColumnMapping["TOURNAMENTRANK"] = array($ob("tournament_id", 1), $ob("team_id", 1), $ob("runs_scored", 1), $ob("runs_allowed", 1), $ob("win", 1), $ob("loss", 1), $ob("tie", 1));
        $dbColumnMapping["TEAMMEMBER"] = array($ob("groupid", 1), $ob("memberid", 1), $ob("approved", 1), $ob("permissions", 1));
        $dbColumnMapping["TEAMROSTER"] = array($ob("id", 1, [], true), $ob("season_year", 1), $ob("teamId", 1, []), $ob("image", 0, ['player_image']), $ob("name", 0, ['player_name']), $ob("position", 0, ['player_position']));
        $dbColumnMapping["TEAMGALLERY"] = array($ob("id", 1, [], true), $ob("teamId", 1, []), $ob("main_image"), $ob("thumb_image"));
        $dbColumnMapping["TOURNAMENTFEES"] = array($ob("tournamentId", 1), $ob("agegroup",1));
        $dbColumnMapping["MULTISITESETTINGS"] = array($ob("domainId", 1), $ob("heading",0,["siteHeading"]),$ob("newsTicker",0,["siteNews"]));
        self::$dbColumnMapping = $dbColumnMapping;
    }

    public static function getMetaColumns($type)
    {
        self::setMetaColumns();
        return self::$dbColumnMapping[$type];
    }
}

?>