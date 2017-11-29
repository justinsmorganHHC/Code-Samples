#!/usr/bin/php
<?php

/***
Array
(
    [0] => t
    [1] => 2017-09-07 11:50:25-0400
    [2] => 2017-09-07 09:44:47-0400
    [3] => pulsesensors@pulsesensors.com
    [4] => lorrainezadroznykes@yahoo.com
    [5] =>
    [6] => delayed
    [7] => 4.0.0 (undefined status)
    [8] => smtp;421 4.7.0 [TS01] Messages from 23.90.9.100 temporarily deferred - 4.16.55.2; see http://postmaster.yahoo.com/errors/421-ts01.html
    [9] => mta7.am0.yahoodns.net (63.250.192.45)
    [10] => other
    [11] => smtp
    [12] => pulsesensors.com (52.36.76.52)
    [13] => smtp
    [14] => 23.90.9.100
    [15] => 63.250.192.45
    [16] => "PIPELINING
    [17] => 8BITMIME
    [18] => SIZE
    [19] => STARTTLS"
    [20] => 4202
    [21] => mta02-range16
    [22] => 5295466
    [23] =>
    [24] => yahoo.com/mta02-range16
    [25] =>
    [26] =>
    [27] =>
    [28] =>
)
***/

// MODIFY SETTINGS HERE
$error_limit = 10;                     // 10 errors
$time_limit = 120;                     // 2 min
$enable_after = 300;                   // 5 min
$date = date("Y-m-d");                 // log file filter
$cutoff = time() - $time_limit - 60;   // subtract 60s to account for cron interval

// ADD VMTAS HERE (empty means apply to all)
$vmtas = array();
//$vmtas[] = "yahoo.com/mta03-t9-r18";
//$vmtas[] = "yahoo.com/mta03-t2-r5";
//$vmtas[] = "yahoo.com/mta05-r14";
//$vmtas[] = "yahoo.com/mta07-r11";

$grep = shell_exec("grep ^t /var/log/pmta/full_log*{$date}*.csv");
$lines = explode(PHP_EOL, $grep);
$source_ips = array();

foreach ($lines as $line) {

    $fields = explode(",", $line);

    if (count($fields) < 25)
        continue;

    // parse the csv
    $error = new stdClass();
    $error->time = strtotime($fields[1]);
    $error->desc = $fields[8];
    $error->ip = $fields[14];
    $error->vmta = $fields[24];

    // should we count this error?
    if ($error->time >= $cutoff && strpos($error->desc, "TS01") !== false) {
        if (!isset($source_ips[$error->ip]))
            $source_ips[$error->ip] = array();
        $source_ips[$error->ip][] = $error;
    }

}

ksort($source_ips);

foreach ($source_ips as $ip => $errors) {

    $count = count($errors);
    $vmta = $errors[0]->vmta;
    $over_limit = $count >= $error_limit;
    $apply_to_vmta = count($vmtas) == 0 || in_array($vmta, $vmtas);

    // should we disable it?
    if ($over_limit && $apply_to_vmta) {

        $pmta_cmd = "pmta disable source --reenable-after={$enable_after}s {$ip} {$vmta}";
        echo date("Y-m-d H:i:s") . " running command: {$pmta_cmd}\n";

        $output = shell_exec($pmta_cmd);
        echo date("Y-m-d H:i:s") . " command output: {$output}\n";

    }

}

?>
