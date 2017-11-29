#!/usr/bin/php

<?php

require('pmta_queue.php');
$bqueue = new PMTAQueue("bounced", PMTAQueue::WRITE);



$f = fopen("php://stdin","r");

jslog("Bounce logger starting...");

$bounces = array();

while ($line = fgets($f)) {
    $trim = trim($line);

    $bad = strpos($trim, 'bad-mailbox') !== false;
    $inactive = strpos($trim, 'inactive-mailbox') !== false;

    if ($bad || $inactive) {
        // queue hard bounces immediately
        $message = $trim;
        $bqueue->send($message);
    } else {
        // queue soft bounces in batches
        $bounces[] = $trim;
        if (count($bounces) >= 10) {
            $message = implode("\n", $bounces);
            $bqueue->send($message);
            unset($bounces);
            $bounces = array();
        }
    }
}

jslog("Bounce logger ended");

fclose($f);

/*********** FUNCTIONS *************/

function jslog($message) {
   $line = date("Y-m-d H:i:s", time()) . "> [MQ_BNC] " . $message . "\n";
   file_put_contents('/var/log/js_delivery.log', $line, FILE_APPEND);
}

?>

