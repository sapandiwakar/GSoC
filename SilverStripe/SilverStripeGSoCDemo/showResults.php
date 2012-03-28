<?php
	include_once('config.php');
	include_once('sendMail.php');

	mysql_connect("localhost", $USERNAME, $PASSWORD) or die ("$errorstr Couldn't execute required action. Try again later.");
	mysql_select_db($DATABASE) or die ("$errorstr Couldn't execute required action. Try again later.");

	$name = mysql_real_escape_string($_POST["name"]);
	$email = mysql_real_escape_string($_POST["email"]);
	$ie = mysql_real_escape_string($_POST["IE"]);
	$firefox = mysql_real_escape_string($_POST["firefox"]);
	$safari = mysql_real_escape_string($_POST["safari"]);
	$chrome = mysql_real_escape_string($_POST["chrome"]);
	$opera = mysql_real_escape_string($_POST["opera"]);
	$konquer = mysql_real_escape_string($_POST["konquer"]);
	$lynx = mysql_real_escape_string($_POST["lynx"]);	
	$reason = mysql_real_escape_string($_POST["reason"]);


	$sql_check_duplicate = "SELECT * FROM SilverStripe WHERE email=\"$email\"";
	$result_check_duplicate = mysql_query($sql_check_duplicate) or die ("$errorstr 1Couldn't execute required action. Try again later.");

		if(mysql_num_rows($result_check_duplicate)!=0) {
			$sql="UPDATE SilverStripe SET name = \"$name\", email = \"$email\", IE = \"$ie\", firefox = \"$firefox\", safari = \"$safari\", chrome = \"$chrome\", opera = \"$opera\", 
				konquer = \"$konquer\", lynx = \"$lynx\", reason = \"$reason\" WHERE email=\"$email\"";

			if (!mysql_query($sql)) {
				die ("$errorstr Couldn't execute required action. Try again later.");
			}
		} else {  
			$isDuplicate = false;
			$sql="INSERT INTO SilverStripe (name, email, IE, firefox, safari, chrome, opera, konquer, lynx, reason, datetime) VALUES (\"$name\", \"$email\", $ie, $firefox, $safari, $chrome, $opera, $konquer,
											$lynx, \"$reason\", NOW())";
			if (!mysql_query($sql)) {
				die ("$errorstr Couldn't execute required action. Try again later.");
			}
		}

		##Send activation Email
		$body = "Details filled person associated with this account \n";
		$body .= "Name:" . $name . "\n";
		$body .= "Your choice for Browsers :\n";
		$count = 1;
		if ($ie == 1) {
			$body .= "\t" . $count . " Internet Explorer \n";
			$count = $count + 1;
		}
		if ($firefox == 1) {
			$body .= "\t" . $count . " Firefox \n";
			$count = $count + 1;
		}
		if ($safari == 1) {
			$body .= "\t" . $count . " Safarii \n";
			$count = $count + 1;
		}
		if ($chrome == 1) { 
			$body .= "\t" . $count . " Chrome \n";
			$count = $count + 1;
		}
		if ($opera == 1) {
			$body .= "\t" . $count . " Opera \n";
			$count = $count + 1;
		}
		if ($konquer == 1) {
			$body .= "\t" . $count . " Konquer \n";
			$count = $count + 1;
		}
		if ($lynx == 1) {
			$body .= "\t" . $count . " Lynx \n";
			$count = $count + 1;
		}
		$body .= "Reason:" . $reason . "\n";

		if (sendMail($email, $body, $SENDERID, $SENDERPASSWD)) {
				echo "An email has been sent to $_POST[email]. ";
		} else {
			echo ($errorstr . "Could not send the mail. Please try again later.");
		}
		
?>