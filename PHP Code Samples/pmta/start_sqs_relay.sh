#!/bin/sh

# the queues that we should be monitoring
QUEUES=(fbl delivered bounced mailsort transient_errors)
# cd /etc/pmta
for QUEUE in ${QUEUES[*]}; do
    RUNNING=`ps auxw | grep sqs_relay.php | grep $QUEUE | wc -l`
    if [ $RUNNING -lt 1 ]; then
        echo "Starting $QUEUE"
        cd /etc/pmta
        nohup php sqs_relay.php $QUEUE >> /var/log/sqs_relay.log 2>&1 &
    fi
done

