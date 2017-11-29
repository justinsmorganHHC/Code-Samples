#!/usr/bin/php

<?php

$f = fopen("php://stdin","r");

require('pmta_queue.php');
$delivered_queue = new PMTAQueue("delivered", PMTAQueue::WRITE);
$mailsort_queue = new PMTAQueue("mailsort", PMTAQueue::WRITE);

jslog("Delivery logger starting...");

$delivered = array();

while ($line = fgets($f)) {
    $delivered[] = trim($line);
    if (count($delivered) >= 100) {
        $message = implode("\n", $delivered);
        $delivered_queue->send($message);
        $mailsort_queue->send($message);
        unset($delivered);
        $delivered = array();
    }
}

jslog("Delivery logger ended");

fclose($f);

/*********** FUNCTIONS *************/

function jslog($message) {
   $line = date("Y-m-d H:i:s", time()) . "> [MQ_DEL] " . $message . "\n";
   file_put_contents('/var/log/js_delivery.log', $line, FILE_APPEND);
}

?>

