<?php
echo "test email activation";
$message = "<b>This is HTML message.</b>";
$message.= "<h1>This is headline.</h1>";

$message .= 'Your Activation Code is '.$code.' Please Click On This link <a href="verification.php">Verify.php?code='.$code.'</a>to activate your account.';