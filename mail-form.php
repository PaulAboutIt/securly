<?php
usleep(500000);
if (!isset($_POST['cname']) || !isset($_POST['cemail']))) {
    echo 'You forgot one or more fields!';
    exit;
}

$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);

$ip = getenv('REMOTE_ADDR');
$message = $name.' with e-mail address '.$email.' and IP address '.$ip.' sent the following message:
____________________________________
'.$message.'
------------------------------------';

mail('paul.katcher@gmail.com', 'Message from securly', $message, 'From: '.$email);

echo 'Thank you for signing up!';
?>