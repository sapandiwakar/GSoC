<?php
	include_once('config.php');

	mysql_connect("www.sapandiwakar.in", $USERNAME, $PASSWORD) or die ("$errorstr1 Couldnot execute required action. Try again later.");
	mysql_select_db($DATABASE) or die ("$errorstr2 Couldnot execute required action. Try again later.");
	
	$query = "SELECT SUM(ie) AS IE, SUM(firefox) AS FIREFOX, SUM(safari) AS SAFARI, SUM(chrome) AS CHROME, SUM(opera) AS OPERA, SUM(konquer) AS KONQUER, SUM(lynx) AS LYNX FROM demo_silverstripe";
	$result = mysql_query($query) or die ("$errorstr3 Could not execute required action. Try again later.");
		
	if(mysql_num_rows($result)==0) {
		echo "You are first person to participate in the Survey.";
	} else {
		while($row = mysql_fetch_array($result)) {
			$data = "[";
			if ($row['IE'] != 0) {
				$data .= "{'name' : 'IE', 'choice' : " . $row['IE'] ."},";
			}
			if ($row['FIREFOX'] != 0) {
				$data .= "{'name' : 'Firefox', 'choice' : " . $row['FIREFOX'] ."},";
			}
			if ($row['SAFARI'] != 0) {
				$data .= "{'name' : 'Safari', 'choice' : " . $row['SAFARI'] ."},";
			}
			if ($row['CHROME'] != 0) {
				$data .= "{'name' : 'Chrome', 'choice' : " . $row['CHROME'] ."},";
			}
			if ($row['OPERA'] != 0) {
				$data .= "{'name' : 'Opera', 'choice' : " . $row['OPERA'] ."},";
			}
			if ($row['KONQUER'] != 0) {
				$data .= "{'name' : 'Konquer', 'choice' : " . $row['KONQUER'] ."},";
			}
			if ($row['LYNX'] != 0) {
				$data .= "{'name' : 'Lynx', 'choice' : " . $row['LYNX'] ."},";
			}
			$data .= "]";
			echo $data;
		}
	}

?>