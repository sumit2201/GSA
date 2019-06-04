<?php
// Application middleware
use Slim\Http\Request;
use Slim\Http\Response;
// e.g: $app->add(new \Slim\Csrf\Guard);
require_once("common/utility.php");
function addActionDetail($db, $logger, ActionInfo $actionInfo, UserInfo $userInfo)
{
    try {
        $time = TimeUtility::getCurrentTime();
        $sql = "INSERT INTO user_action_audit  VALUES (null, " . $userInfo->userId . "," . $db->quote($actionInfo->title) . "," . quoteStr($time) . "," . quoteStr($userInfo->ip_address) . "," . quoteStr($userInfo->user_agent) . ")";
        $sth = $db->prepare($sql);
        $sth->execute();
        return true;
    } catch (PDOException $e) {
        $logger->error("Error in inserting action details");
        $logger->error($e->getMessage());
    }
}

function getUserDetailsFromDb($db, $logger, $login_token)
{
    // global $db, $logger;
    try {
        if (CommonUtils::isValid($login_token)) {
            $sql = "select * from  jos_users  where login_token='" . $login_token . "'";
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

$app->add(function (Request $request, Response $response, callable $next) {
    $requestbody = $request->getBody();
    // $requestobject = json_decode($requestbody);
    $requestobject = $request->getParsedBody();
    // echo "bady";print_r($request->getParsedBody());
    // echo "res"; print_r($requestobject);
    // $authKey = $request->headers("Authorization");
    // print_r($authKey);die;
    $actionDetails = $request->getParam("actionInfo");
    $userDetails = $request->getParam("userInfo");
    $requestParams = $request->getParam("requestParams");
    $actionTitle = "null";
    // echo "<pre>";
    // print_r($actionDetails);
    // print_r($userDetails);
    // print_r($requestParams);
    // die;
    if (CommonUtils::isValid($actionDetails)) {
        $parsedActionDetails = json_decode($actionDetails);
        $actionTitle = $parsedActionDetails->title;
    }
    $actionInfo = new ActionInfo($actionTitle);
    $userDetails = $request->getParam("userInfo");
    $userInfo = new UserInfo();
    $userDataFromDb = new stdClass();
    if (CommonUtils::isValid($userDetails)) {
        $parsedUserDetails = json_decode($userDetails);
        if (CommonUtils::isValid($parsedUserDetails->token)) {
            $userDataFromDb = getUserDetailsFromDb($this->db, $this->logger, $parsedUserDetails->token);
            $userInfo->userId = $userDataFromDb->id;
        }         
        $userInfo->ip_address = isset($parsedUserDetails->ip_address) ? $parsedUserDetails->ip_address: null;
        $userInfo->user_agent = isset($parsedUserDetails->user_agent) ? $parsedUserDetails->user_agent : null;
    }
    addActionDetail($this->db, $this->logger, $actionInfo, $userInfo);
    # validation and modification of $requestobject takes place here   
    // echo "<pre>";
    $request = $request->withParsedBody($requestobject);
    $response = $next($request, $response);
    // print_r($response);
    $response->getBody()->rewind();
    // print_r($response);
    $object = json_decode($response->getBody());
    // print_r($response->getBody());
    // echo "<pre>";
    // print_r($userDataFromDb);
    // print_r($object);
    // echo "Finish";
    // die;
    if (CommonUtils::isValid($object)) {
        $object->action = $actionInfo;
    } else {
        $this->logger->error("response is not valid in action" + json_encode($actionInfo));
    }
    $response = $response->withJson($object); // output should be {"data":" Hello, User  seq1  seq2 "}
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    return $response;
});

// $app->add($mw);
