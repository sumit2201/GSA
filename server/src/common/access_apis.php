<?php
require_once("utility.php");
global $db;

function getUserTypeByUserId($userId)
{   
    global $db, $logger;
    try {
        $query = "SELECT `gid` FROM `jos_users` WHERE `id` = " . $userId;
        $sth = $db->prepare($query);
        $sth->execute();
        $userDetails = $sth->fetchObject();
        //print_r($userDetails->gid);die;
        return $userDetails->gid;
    } catch (PDOException $e) {
        $logger->error("error in getuserType");
        $logger->error($e->getMessage());
        return null;
    }
    
}
