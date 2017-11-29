<?php

define('PMTA_QUEUE_PATH', '/var/run/pmta_queue/');
define('PMTA_QUEUE_SECONDS', 60); // roll the files over every minute

// create a posix fifo queue to exchange informaton between the
// pmta client and the client that communicates with
class PMTAQueue {
    const READ = 'r';
    const WRITE = 'w';


    function __construct($queue_name, $mode) {
        $this->queue_name = $queue_name . "_queue";
        $this->mode = $mode; // either PMTAQueue::READ or PMTAQueue::WRITE
        $this->_write_fh = null;
        $this->_write_fh_name = null;
        $this->_read_fh = null;
        $this->_read_fh_name = null;
    }

    function current_write_file() {
        $now = time();
        $filename = PMTA_QUEUE_PATH . $this->queue_name . "." . ($now - ($now % PMTA_QUEUE_SECONDS));

        // if the current filename doesn't match the existing open file then
        // close the existing file and roll the filenames over
        if ($filename != $this->_write_fh_name) {
            $this->_write_fh_name = null;
            if ($this->_write_fh) {
                fclose($this->_write_fh);
                $this->_write_fh = null;
            }
        }

        // if we don't have a filehandle then create a new file and open it for
        // writing
        if ($this->_write_fh == null) {
            $this->_write_fh_name = $filename;
            $this->_write_fh = fopen($this->_write_fh_name, 'w');
        }
        return $this->_write_fh;
    }

    function current_read_file() {
        // if there is not already an open read_fh then return it. otherwise
        // keep reading this file until we determine that it is empty
        $now = time();
        if (!$this->_read_fh) {
            $files = scandir(PMTA_QUEUE_PATH);
            foreach($files as $file) {
                $file_parts = explode('.', $file);
                $file_ts = (int) array_pop($file_parts);
                if ($file_ts + PMTA_QUEUE_SECONDS < $now &&
                    $this->queue_name == substr($file, 0, strlen($this->queue_name))
                ) {
                    $this->_read_fh_name = PMTA_QUEUE_PATH . $file;
                    error_log("PMTAQueue read from " . $this->_read_fh_name . "\n");
                    $this->_read_fh = fopen($this->_read_fh_name, 'r');
                    break;
                }
            }
        }
        return $this->_read_fh;
    }

    function send($msg) {
        fwrite($this->current_write_file(), base64_encode($msg) . "\n");
    }

    function read() {
        // read the latest file
        $msg = null;
        while (!$msg) {
            $fh = $this->current_read_file();
            if ($fh) {
                $msg = fgets($fh);
                if (!$msg) {
                    unlink($this->_read_fh_name);
                    $this->_read_fh = null;
                    $this->_read_fh_name = null;
                    continue;
                }
                return base64_decode($msg);
            } else {
                sleep(1);
            }
        }
    }
}

/*
// Test mode.  invoke this with an argument of "write" to start a writer and
// "read" to start a reader
if ($argv[1] == "write") {
    $q1 = new PMTAQueue("test", PMTAQueue::WRITE);
    $q2 = new PMTAQueue("test2", PMTAQueue::WRITE);
    while(true) {
        $q1->send("hello");
        $q2->send("world");
        sleep(1);
    }
}

if ($argv[1] == "read") {
    $q1 = new PMTAQueue("test2", PMTAQueue::READ);
    while($msg = $q1->read()) {
        echo $msg;
    }
}
*/




