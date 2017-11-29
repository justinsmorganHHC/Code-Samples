#!/usr/bin/php

<?php
require('pmta_queue.php');
$fbl_queue = new PMTAQueue("fbl", PMTAQueue::WRITE);

$f = fopen("php://stdin","r");

jslog("FBL logger starting...");

$delivered = array();

while ($line = fgets($f)) {
    $message = trim($line);
    $fbl_queue->send($message);
}

jslog("FBL logger ended");

fclose($f);

/*********** FUNCTIONS *************/

function jslog($message) {
   $line = date("Y-m-d H:i:s", time()) . "> [MQ_FBL] " . $message . "\n";
   file_put_contents('/var/log/js_delivery.log', $line, FILE_APPEND);
}

?>

