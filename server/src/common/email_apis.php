<?php
   
function send_verfication_email($id,$domin_id){

    $userPayload = new stdClass();
    $userPayload->userId = $id;
    $userPayload->columnToFetch = ["id,name,email,`primary`"];
    $user_data = fetchSingleUser($userPayload);    
        // print_r($user_data['name']);
        $name = $user_data['name'];
        $email_id = $user_data['email'];
        $user_id = $user_data['id'];
        $to = $email_id;
        $subject = "[GSA] Please verify your email address.";
       
        $code = Genrate_Email_verifycode($user_id);
         
        include ('activation_email.php');

        $header = "From:sumit@technideus.com \r\n";       
        // $header .= "Cc:afgh@somedomain.com \r\n";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/html\r\n";

       //echo $message;
        
        $retval = mail($to,$subject,$message,$header);

}
function Genrate_Email_verifycode($user_id)
{
   global $db;
   global $logger;

   $code = substr(md5(mt_rand()),0,15);
   try {      
      if (CommonUtils::isValid($code)) {
         //echo $user_id;
         $sql = "update jos_users set `email_activation`= '".$code."'  where id=" .$user_id;
         $sth = $db->prepare($sql);
         $sth->execute();
                 
      }
  } catch (PDOException $e) {
      $logger->error("Error in inserting menu details");
      $logger->error($e->getMessage());
     
  } 
  return $code;     
}