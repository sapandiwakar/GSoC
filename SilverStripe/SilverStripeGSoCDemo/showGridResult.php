<?php
	include_once('config.php');

	mysql_connect("www.sapandiwakar.in", $USERNAME, $PASSWORD) or die ("$errorstr1 Couldnot execute required action. Try again later.");
	mysql_select_db($DATABASE) or die ("$errorstr2 Couldnot execute required action. Try again later.");

	$query = "SELECT * FROM demo_silverstripe ORDER BY ie, firefox, safari, chrome, opera, konquer, lynx, datetime";
	$result = mysql_query($query) or die ("$errorstr3 Could not execute required action. Try again later.");
		
	if(mysql_num_rows($result)==0) {
		echo "You are first person to participate in the Survey.";
	} else {
		$data = "[";
		$first_row = true;
		while($row = mysql_fetch_array($result)) {
			if ($first_row) {
				$first_row = false;
			} else {
				$data .= ', ';
			}
			$data .= "{'name' : '" . $row['name'] . "', 'email' : '" . $row['email'] . "', ";
			$browsers = "'browsers' : '";
			if ($row['IE'] != 0) {
				$browsers .= "IE ";
			}
			if ($row['firefox'] != 0) {
				$browsers .= "Firefox ";
			}
			if ($row['safari'] != 0) {
				$browsers .= "Safari ";
			}
			if ($row['chrome'] != 0) {
				$browsers .= "Chrome ";
			}
			if ($row['opera'] != 0) {
				$browsers .= "Opera ";
			}
			if ($row['Konquer'] != 0) {
				$browsers .= "Konquer ";
			}
			if ($row['Lynx'] != 0) {
				$browsers .= "Lynx ";
			}
			$browsers .= "'";
			$data .= $browsers . ", 'reason' : '" . $row['Reason'] . "', 'time' : '" . $row['datetime'] . "'";
			$data .= "}";
		}
		$data .= "]";
		echo $data;
	}

?>