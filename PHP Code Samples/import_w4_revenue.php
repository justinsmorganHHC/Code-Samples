<?php

include ("/company/lib/db.php");
include ("/company/lib/logger.php");

/************************************************
* Download revenue data from Flex Marketing API *
************************************************/

if ($argc < 2) {
    echo "Please provide # of days previous to pull as an argument to this script\n";
    exit;
}

$network_id = 21;
$start = date("Y-m-d", time() - (86400 * $argv[1]));
$end = date("Y-m-d", time() + 86400);

$url = "http://reporting.trk4.com/api.php";
$url .= "?key=73376dec278343b6c005e8daa5c5bc11ea5cf3b902bbf355";
$url .= "&start={$start}";
$url .= "&end={$end}";
$url .= "&type=sales";
$url .= "&format=csv";
$url .= "&nozip=1";

echo $url . "\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$result = curl_exec($ch);
curl_close($ch);

$lines = explode("\n", $result);
array_shift($lines);

$rollup = array();
foreach ($lines as $line) {
    $fields = explode(",", $line);
    if (count($fields) >= 7) {
        $date = date("Y-m-d", strtotime($fields[1]));
        $offer = $fields[0];
        $subid = $fields[2] ?: $fields[3] ?: $fields[4];

        if (!isset($rollup[$date])) $rollup[$date] = array();
        if (!isset($rollup[$date][$offer])) $rollup[$date][$offer] = array();
        if (!isset($rollup[$date][$offer][$subid])) $rollup[$date][$offer][$subid] = 0;

        $rollup[$date][$offer][$subid] += $fields[6];
    }
}

$mysqli = mocade_db_connect();

foreach ($rollup as $date => $date_stats) {
    foreach ($date_stats as $offer => $offer_stats) {
        foreach ($offer_stats as $subid => $amount) {
            $mysqli->query(
               "INSERT revenue (date, network_id, offer_id, subid, amount, created, updated)
                VALUES ('{$date}', {$network_id}, {$offer}, '{$subid}', {$amount}, unix_timestamp(), unix_timestamp())
                ON DUPLICATE KEY UPDATE amount = {$amount}, updated = unix_timestamp();"
            );
        }
    }
}

$mysqli->close();

?>

 
