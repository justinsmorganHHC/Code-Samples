#!/usr/bin/php

<?php

require('pmta_queue.php');

if ($argc < 2) {
    echo "Usage: sqs_send.php queue\n";
    echo " [queue]: the queue to watch and relay to SQS\n";
    exit;
}

$start = microtime(true);

use Aws\Sqs\SqsClient;

include ("/opt/aws/aws.phar");

$queue_name = $argv[1];
$queue = new PMTAQueue($queue_name, PMTAQueue::READ);

$client = SqsClient::factory(
    array(
        'region'  => 'us-west-2',
        'credentials' => array(
            'key' => 'AKIAIFXEYEXL3LUTD2OA',
            'secret' => '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'
        )
    )
);

$url = "https://sqs.us-west-2.amazonaws.com/392427529724/{$queue_name}";
while ($message = $queue->read()) {
    try {
        $result = $client->sendMessage(
            array(
                'QueueUrl' => $url,
                'MessageBody' => $message,
            )
        );
        $message_id = $result->get("MessageId");
        if (!($message_id)) {
            jslog("Error: No message id returned");
            exit(0);
        }


        $diff = microtime(true) - $start;
        $sec = intval($diff);
        $micro = $diff - $sec;
        $ms = strftime('%T', mktime(0, 0, $sec)) . str_replace('0.', '.', sprintf('%.3f', $micro));
        jslog("Message sent queue={$queue_name} size=" . strlen($message) . " $message_id time={$ms}");

    } catch (Exception $e) {
        jslog("Error: " . $e->getTraceAsString());
        exit(0);
    }
}
/*********** FUNCTIONS *************/

function jslog($message) {
   $line = date("Y-m-d H:i:s", time()) . "> [SQS] {$message}\n";
   file_put_contents('/var/log/js_delivery.log', $line, FILE_APPEND);
}

?>
