<?php

function sendEmail($to, $subject, $message)
{

   $header = "From:sumit@technideus.com \r\n";
   // $header .= "Cc:afgh@somedomain.com \r\n";
   $header .= "MIME-Version: 1.0\r\n";
   $header .= "Content-type: text/html\r\n";

   //  print_r($message);

   $retval = mail($to, $subject, $message, $header);
}

function prepareAndSendEmail($data, $dominId, $type)
{
   if (CommonUtils::isValid($data) && isset($data->userId)) {
      $userId = $data->userId;
   }

   if (isset($userId) && CommonUtils::isValid($userId)) {
      $userPayload = new stdClass();
      $userPayload->userId = trim($userId);
      $userPayload->columnToFetch = ["`id`","`name`","`email`","`primary`"];
      $user_data = fetchSingleUser($userPayload);
      // print_r($userPayload);
      //  print_r($user_data);die;
      $name = $user_data['name'];
      $email_id = $user_data['email'];
      $user_id = $user_data['id'];
      $to = $email_id;
   }

   switch ($type) {
      case "emailVerification":
         send_verfication_email($user_data, $dominId);
         return true;
      case "resetPasswordEmail":
         send_email_for_reset_password($user_data, $dominId);
         return true;
      case "resetUserPasswordSuccess":
         send_email_for_password_reset_success($user_data);
         return true;
      case "waitDirectorProfileApproval":
         send_email_wait_for_approval($user_data);
         return true;
      case "newDirectorRegisterApproveByAdmin":
         new_director_register_approveBy_admin($user_data);
         return true;
      case "profileApprovalSuccess":
         send_email_profile_approval_success($user_data);
         return true;
      case "profileBlockBySuperAdmin":
         your_profile_block_by_Admin($user_data);
         return true;
      case "changePasswordsuccessful":
         your_password_change_successfully($user_data);
         return true;
      case "userRegisterSuccessfully":
         your_register_successfully($user_data);
         return true;
      case "tournamentPostsuccessByDirector":
         tournament_post_successby_director($user_data);
         return true;
      case "newTournamentRegister":
         new_tournament_Email_for_admin($user_data);
         return true;
      case "updateuserProfileSuccess":
         update_user_profile_success($user_data);
         return true;
      case "teamRegisterinTournament":
         new_team_registration_for_tournament($data);
         return true;
      default:
         send_thankyou_Email($user_data);
   }
}

function update_user_profile_success($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "your profile update success";
   $message = "your profile update successful";
   sendEmail($to, $subject, $message);
}

function new_tournament_Email_for_admin($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "new tournamnet add by ".$name;
   $message = "new tournamnet add by ".$name." director email-".$email_id;
   sendEmail($to, $subject, $message);
}

function tournament_post_successby_director($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "your tournament post is published   ";
   $message = "your  tournament is published please go and view tournaments";
   sendEmail($to, $subject, $message);
}

function your_register_successfully($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "your profile register in GSA  ";
   $message = "your profile register successful please login for view your profile";
   sendEmail($to, $subject, $message);
}

function your_password_change_successfully($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "your password has been changed";
   $message = "your password change successful please  login with new password";
   sendEmail($to, $subject, $message);
}

function your_profile_block_by_Admin($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "your profile is blocked by admin";
   $message = "your profile blocked please contact to admin";
   sendEmail($to, $subject, $message);
}

function send_email_profile_approval_success($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   print_r($to);die;
   $subject = "your director profile activate success";
   $message = "congratulation your profile approved by admin " . $user_data;
   sendEmail($to, $subject, $message);
}

function new_director_register_approveBy_admin($user_data)
{  
   $adminData = fetchAllSuperAdmin($user_data);
      // mainualy value for geting admin data
   $admin = $adminData->payload->data[4]; // main admin in 4th index
   $name = $admin['title'];
   $email_id = $admin['email'];
   $user_id = $admin['id'];
   $to = $email_id;   
   $subject = "New Director register, please approve this profile";
   $message = "Please approve the director profile ";
   sendEmail($to, $subject, $message);
}
function send_email_wait_for_approval($user_data)
{     
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "your director profile register please wait for approval ";
   $message = "Please wait for approval by Super admin ";
   sendEmail($to, $subject, $message);
}

function send_email_for_password_reset_success($user_data)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "your password reset successful";
   $message = "your password reset successful please login to new password " . $user_data;
   sendEmail($to, $subject, $message);
}

function new_team_registration_for_tournament($data)
{
   global $db;
   $tournamentId  = $data->tournamentId;
   $teamId = $data->teamId;
   // print_r($data);die;
   if (CommonUtils::isValid($tournamentId)) {
      $query = "SELECT `directorid` FROM `jos_gsa_tournament` WHERE `id` = " . $tournamentId;
      $sth = $db->prepare($query);
      $sth->execute();
      $directorId = $sth->fetchObject();
      $userData = getUserDetailByUserId($directorId->directorid);
      $to = $userData->email;
      $subject = "new team register in your tournamnets";
      $message = "New team is register in your tournaments- " . $teamId;
      sendEmail($to, $subject, $message);
   }
   if (CommonUtils::isValid($teamId)) {
      $query = "SELECT `memberid` FROM `jos_community_groups_members` WHERE `groupid` =" . $teamId;
      $sth = $db->prepare($query);
      $sth->execute();
      $allMembers = $sth->fetchAll();
      $subject = "your team register in tournamnets ";
      $message = "your team register in this tournamnets- " . $tournamentId;
      foreach ($allMembers as $memberid) {
         $memberId = $memberid['memberid'];
         $memberData = getUserDetailByUserId($memberId);
         $to = $memberData->email;
         sendEmail($to, $subject, $message);
      }
   }
}

function send_verfication_email($user_data, $domin_id)
{
   $name = $user_data['name'];
   $email_id = $user_data['email'];
   $user_id = $user_data['id'];
   $to = $email_id;
   $subject = "[GSA] Please verify your email address.";

   $code = Genrate_verifycode($user_id, true);

   include('activation_email.php');

   sendEmail($to, $subject, $message);

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
   $message = 'http://gsaserver.technideus.com/public/resetPassword?key=' . $code . '&domid=' . $domin_id;

   sendEmail($to, $subject, $message);

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
