<?php
   
function send_verfication_email($id,$domin_id){

    $userPayload = new stdClass();
    $userPayload->userId = $id;
    $userPayload->columnToFetch = ["id,name,email,`primary`"];
    $user_data = fetchSingleUser($userPayload);    
         //print_r($user_data['id']);

        $email_id = $user_data['email'];
        $user_id = $user_data['id'];
        $to = 'ravendra@technideus.com';
        $subject = "This is subject";
       
        $code = Genrate_verifycode($user_id);
         
        include ('activation_email.php');

        //$email_html = file_get_contents('activation_email.php');
       //$message = $email_html;

        $header = "From:sumit@technideus.com \r\n";        
        // $header .= "Cc:afgh@somedomain.com \r\n";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/html\r\n";

        echo $message;
        
        $retval = mail($to,$subject,$message,$header);       

         
      // if( $retval == true ) {
      //    echo "Message sent successfully...";
      // }
      // else {
      //    echo "Message could not be sent...";
      // }

}
function Genrate_verifycode($user_id)
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
         
         //  return new ActionResponse(1,"Success");         
      } else
      {
         // return new ActionResponse(0, null);
      }
  } catch (PDOException $e) {
      $logger->error("Error in inserting menu details");
      $logger->error($e->getMessage());
      // return new ActionResponse(0, null);
  } 
  return $code;     
}