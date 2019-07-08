<?php

function send_verfication_email($id, $domin_id)
{
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

   $code = Genrate_verifycode($user_id, true);

   include('activation_email.php');

   //$email_html = file_get_contents('activation_email.php');
   //$message = $email_html;

   $header = "From:sumit@technideus.com \r\n";
   // $header .= "Cc:afgh@somedomain.com \r\n";
   $header .= "MIME-Version: 1.0\r\n";
   $header .= "Content-type: text/html\r\n";

   //echo $message;

   $retval = mail($to, $subject, $message, $header);

   return true;
   // if( $retval == true ) {
   //    echo "Message sent successfully...";
   // }
   // else {
   //    echo "Message could not be sent...";
   // }

}

function send_email_for_reset_password($id, $domin_id)
{
   $userPayload = new stdClass();
   $userPayload->userId = $id;
   $userPayload->columnToFetch = ["id,name,email,`primary`"];
   $user_data = fetchSingleUser($userPayload);
   // print_r($user_data['name']);
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "[GSA] Reset user password.";

   $code = Genrate_verifycode($user_id, false);
   $message = 'http://gsaserver.com/public/resetPassword?key='.$code.'&domid='.$domin_id;

   $header = "From:sumit@technideus.com \r\n";
   // $header .= "Cc:afgh@somedomain.com \r\n";
   $header .= "MIME-Version: 1.0\r\n";
   $header .= "Content-type: text/html\r\n";

      echo $message;die;

   $retval = mail($to, $subject, $message, $header);

   return true;
}

function Genrate_verifycode($user_id, $forRegistration)
{
   global $db;
   global $logger;

   if ($forRegistration) {
      $colum = "email_activation";
   } else {
      $colum = "password_reset_code";
   }

   $code = substr(md5(mt_rand()), 0, 15);
   try {
      if (CommonUtils::isValid($code)) {
         //echo $user_id;
         $sql = "update jos_users set " . $colum . " = '" . $code . "'  where id=" . $user_id;
         $sth = $db->prepare($sql);
         $sth->execute();
        
         //  return new ActionResponse(1,"Success");         
      } else {
         // return new ActionResponse(0, null);
      }
   } catch (PDOException $e) {
      $logger->error("Error in inserting menu details");
      $logger->error($e->getMessage());
      // return new ActionResponse(0, null);
   }
   return $code;
}
