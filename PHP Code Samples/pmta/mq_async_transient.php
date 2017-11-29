#!/usr/bin/php

<?php

require('pmta_queue.php');
$transient_queue = new PMTAQueue("transient_errors", PMTAQueue::WRITE);

$f = fopen("php://stdin","r");

jslog("Transient error logger starting...");

while ($line = fgets($f)) {
    $message = trim($line);
    $transient_queue->send($message);
}

jslog("Transient error logger ended");

fclose($f);

/*********** FUNCTIONS *************/

function jslog($message) {
   $line = date("Y-m-d H:i:s", time()) . "> [MQ_TS] " . $message . "\n";
   file_put_contents('/var/log/js_delivery.log', $line, FILE_APPEND);
}

?>

