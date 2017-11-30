<?php

/************************************************
* Page template for Company CMS GUI              *
************************************************/

include ("/Companys/lib/db.php");
include ("/Companys/lib/logger.php");
include ("/Companys/lib/string_functions.php");
include (__DIR__."/header.php");


$inspire = inspire_db_connect();
$Company = Company_db_connect();

// only display things that match a search string
$today = strtotime("today");
$start = (isset($_REQUEST['d']) ? $_REQUEST['d'] : $today);
$end = $start + 86400;
$ymd = date("ymd", $start);
$search_query = (isset($_REQUEST['q']) ? $_REQUEST['q'] : '');
$search_strings = preg_split('/\s+/', $search_query);
$include_inactive = isset($_REQUEST['include_inactive']) || 0;
$list_group = (isset($_REQUEST['lg']) ? $_REQUEST['lg'] : '0');

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['completeMail']) {
    $completed = $_POST['completed_drops'];
    $scheduled = $_POST['scheduled_drops'];
    $undelivered = $_POST['undelivered_volume'];
    $unsent = $_POST['unsent_drops'];
    if ($Company->query("SELECT 1 FROM Company.kpis WHERE date = CURDATE();")->num_rows == 0) {
        $Company->query("INSERT Company.kpis (date, global_active_unique_count, mailing_done, completed_drops, scheduled_drops, undelivered_volume, unsent_drops) 
            VALUES (CURDATE(), 0, NOW(), {$completed}, {$scheduled}, {$undelivered}, '{$unsent}');");
    } else {
        $Company->query("UPDATE Company.kpis SET mailing_done=NOW(), completed_drops={$completed}, scheduled_drops={$scheduled}, undelivered_volume={$undelivered}, unsent_drops='{$unsent}' WHERE date = CURDATE();");
    }
    echo $Company->error;
}

$show_complete_button = $Company->query("SELECT * FROM Company.kpis WHERE date=CURDATE() AND mailing_done IS NOT NULL;")->num_rows;

$test_lists = $inspire->query(
   "SELECT DISTINCT SUBSTRING_INDEX(l.name, '_', 1) as code
    FROM i.email_lists l
    JOIN cfg.lists c ON c.listid = l.listid
    WHERE c.type = 'test'
    AND c.active = 1
    AND l.subscribecount > 0;"
);

$test_codes = array();
while ($code = $test_lists->fetch_object())
    $test_codes[] = $code->code;

$lists = $inspire->query(
   "SELECT l.listid,
        l.name,
        l.subscribecount as size,
        SUBSTRING_INDEX(l.name, '_', 1) as code,
        SUBSTRING_INDEX(l.name, '_', 2) as domain,
        SUBSTRING_INDEX(l.name, '_', 3) as seq,
        c.type,
        c.active,
        COALESCE(c.range_id_primary, 0) as range_id_primary,
        COALESCE(c.range_id_backup, 0) as range_id_backup,
        COALESCE(c.range_id_third, 0) as range_id_third,
        l.mailablecount as mailable
    FROM i.email_lists l
    JOIN cfg.lists c ON c.listid = l.listid
    WHERE c.type IN ('new', 'opnr', 'clkr', 'test')
    AND l.name NOT LIKE '%\_inactive'
    AND l.subscribecount > 0
    ORDER BY 4, 7, 6;"
);

$segment_groups = $Company->query("SELECT id, name FROM Company.segment_groups;");

$range_rows = $Company->query("SELECT * FROM ranges");

$ranges = array();
while ($row = $range_rows->fetch_object()) {
    $ranges[$row->id] = $row;
}

$job_rows = $inspire->query(
   "SELECT *
    FROM injection.jobs
    WHERE scheduled BETWEEN {$start} AND {$end}
    AND type = 'prod'
    ORDER BY id;"
);

$jobs = array();
while ($row = $job_rows->fetch_object()) {
    if (!isset($jobs[$row->list_id]))
        $jobs[$row->list_id] = array();
    $jobs[$row->list_id][$row->mailing_id] = $row;
}

?>

<h2>Production Schedule</h2>

<form method="GET">

<h3>Filter</h3>

<table class='puffy grid' style='width:100%;'>
  <tr>
    <th class='rowlabel'>Date</th>
    <td>
      <select name='d'>
<?php
    for ($i = $today - (7*86400); $i < $today + (3*86400); $i += 86400) {
        echo "<option value='{$i}'" . ($i == $start ? ' selected' : '') . ">" . date("Y-m-d", $i) . ($i == $today ? ' [Today]' : '') . "</option>";
    }
?>
      </select>
    </td>
    <th class='rowlabel'>Lists</th>
    <td>
      <select name='lg'>
        <option value='0'>[All]</option>
<?php
    while ($g = $segment_groups->fetch_object()) {
        echo "<option value='{$g->id}'" . ($g->id == $list_group ? ' selected' : '') . ">{$g->name}</option>";
    }
?>
      </select>
    </td>
    <th class='rowlabel'>Search</th>
    <td>
      <input name="q" type="text" size="25" placeholder="search strings" value="<?php echo $search_query ?>" />
      <input type="checkbox" name="include_inactive" value="1" <?php echo ($include_inactive) ? "checked" : "" ?>> Include Inactive Lists
    </td>
    <td style='text-align:center;'>
      <a class='save button' onclick='$("form:first").submit();' style='margin-right:0px;'>Filter</a>
    </td>
  </tr>
</table>

</form>

<br>

<div class='clear'></div>

<h3>Schedule</h3>

<table class='smallish grid' style='width: 100%'>
  <tr>
    <th>List</th>
    <th>Content</th>
  </tr>
<?php

$total_volume = 0;
$undelivered_volume = 0;
$unsent_drops = "";
$total = 0;
$scheduled = 0;
$injecting = 0;
$completed = 0;

while ($list = $lists->fetch_object()) {
    if (!$include_inactive && $list->active == 0)
        continue;

    $row_total = 0;
    $row_scheduled = 0;
    $row_injecting = 0;
    $row_completed = 0;

    $mailings = $Company->query(
       "SELECT id, name, from_name, slot, schedule_date, segment_group_id
        FROM Company.mailings
        WHERE segment_id='{$list->listid}'
        AND name LIKE '%\_{$ymd}'
        AND (segment_group_id = {$list_group} OR {$list_group} = 0)
        AND archived IS NULL
        ORDER BY slot, created;"
    );

    if ($mailings->num_rows == 0)
        continue;

    $row = "<tr>";
    $row .= "<td style='width: 18%; text-align: center; vertical-align: middle;border-right:none'>";
    $row .= "<a style='font-size: 1.25em; font-weight: bold;' href='inspire_list.php?l={$list->listid}'>{$list->name}</a><br>";
    $row .= "ID: <b>{$list->listid}</b> ";
    $row .= "Size: <b>" . number_format($list->mailable, 0) . "</b>";
    $row .= "</td><td style='border-left:none;'>";

    $has_test = in_array($list->code, $test_codes);
    $is_test = ends_with($list->name, "_test");
    $i = 0;

    $div_style = 'width:32%;float:left;margin:8px 6px;height:100px;text-align:center;border-radius:2px;';
    $div_inv = 'width:32%;float:left;margin:8px 6px;height:116px;';

    $m_volume = 0;
    $u_volume = 0;

    while ($mailing = $mailings->fetch_object()) {
        // test list/slot detection
        $final_slot = ($i + 1 == $mailings->num_rows);
        if ($has_test && (($is_test && !$final_slot) || (!$is_test && $final_slot))) {
            $row .= "<div style='{$div_inv}'></div>";
            $i++;
            continue;
        }

        $info = '';
        $color = 'rgba(255,160,122,0.5)';
        $display_schedule_button = true;

        $range_id = 0;
        if ($i == 0) { $range_id = $list->range_id_primary; }
        if ($i == 1) { $range_id = $list->range_id_backup; }
        if ($i == 2) { $range_id = $list->range_id_third; }

        if (isset($jobs[$list->listid]) && isset($jobs[$list->listid][$mailing->id])) {
            $job = $jobs[$list->listid][$mailing->id];
            $progress = ($job->progress > 0 ? $job->delivered / $job->progress * 100.0 : 0);
            $inc = ($range_id) ? 1 : 0;
            switch ($job->status) {
                case 'scheduled': $color = 'rgba(143,188,255,0.5)'; $row_scheduled += $inc; break;
                case 'injecting': $color = 'rgba(255,215,0,0.5)'; $row_injecting += $inc; break;
                case 'complete': $color = 'rgba(50,205,50,0.33)'; $row_completed += $inc; break;
            }

            $info = "Job:&nbsp;<b><a href='job_stats.php?j={$job->id}'>{$job->id}</a></b>&nbsp;&nbsp;";
            $info .= "Date:&nbsp;<b>" . date("Y-m-d H:i A", $job->scheduled) . "</b><br>";
            $info .= "Status:&nbsp;<b>{$job->status}</b>&nbsp;&nbsp;";
            $info .= "Delivered:&nbsp;<b>" . number_format($progress, 1) . "%</b>&nbsp;";
            $info .= "<progress max='100' value='" . number_format($progress, 0) . "' style='width:30px;'></progress>";
            $display_schedule_button = false;
            $range_id = $job->range_id;

            // allow them to reschedule if the previous job was canceled
            if ($job->status == 'cancelled')
                $display_schedule_button = true;
        }

        $range = false;
        $range_name = "Missing";
        $default_from = false;

        if ($range_id) {
            $range = $ranges[$range_id];
            $range_name = $range->name;

            $range_row = $inspire->query(
               "SELECT s.friendly_from, s.from_alias, s.domain
                FROM cfg.ip_range i
                JOIN injection.range_juice_settings s ON s.range_id = i.id
                WHERE i.id = {$range_id};"
            )->fetch_object();

            $default_from = $range_row->from_alias . "@" . $range_row->domain;
            $row .= "<div style='{$div_style};background-color: {$color};padding: 8px 0px;'>";
            $row .= "<a style='font-size: 1.1em; font-weight: bold;' href='mailing_detail.php?m={$mailing->id}'>{$mailing->name}</a><br>";
            $row .= "Range: <b>{$range_name}</b><br>\n";
            $row .= "Friendly: <b>{$mailing->from_name}</b><br>";

            if ($default_from) {
                $row .= "From: <b>$default_from</b><br>";
            }

            $row .= (!empty($info) ? $info : '');

            $schedule_button = "";
            if ($range_id) {
                $swap_url = "change_group_schedule.php?g={$mailing->segment_group_id}&d=".strtotime($mailing->schedule_date)."&s={$mailing->slot}&m={$mailing->id}";
                $juice_url = "schedule_juice.php?r={$range_id}&m={$mailing->id}";
                $schedule_button .= "<form action='/admin/schedule_prod.php' method='GET' style='margin-top:4px;margin-bottom:0px;'>";
                $schedule_button .= "  <input type='hidden' name='r' value='{$range_id}'>";
                $schedule_button .= "  <input type='hidden' name='l' value='{$list->listid}'>";
                $schedule_button .= "  <input type='hidden' name='m' value='{$mailing->id}'>";
                $schedule_button .= "  <a class='add button' onclick='$(this).parent().submit();'>Schedule<a>&nbsp;";
                $schedule_button .= "  <a class='button' style='background: url(img/swap.png) 9px 6px no-repeat #f3f3f3;padding-left: 30px;' onclick='swap({$mailing->id})'>Swap</a>";
                $schedule_button .= "  <a class='button' style='background: url(img/juice.png) 9px 6px no-repeat #f3f3f3;padding-left: 30px;' href='{$juice_url}'>Juice</a>";
                $schedule_button .= "</form>";
            }

            $row .= ($display_schedule_button ? $schedule_button : "");
            $row .= "</div>";
            $row_total++;
            $m_volume += $list->mailable;
            if ($display_schedule_button) {
                $u_volume += $list->mailable;
                $unsent_drops .= $mailing->name.",";
            }
        }
        else {
            $ht = $i + 1;
            $row .= "<div style='{$div_style};padding:8px 0px;background-color:rgba(230,230,250,0.5);'><br>";
            $row .= "<a style='font-size: 1.1em; font-weight: bold;' href='mailing_detail.php?m={$mailing->id}'>{$mailing->name}</a>";
            $row .= "<br><span style='font-size: 1.1em; color: gray;'><i>NO RANGE ROUTED</i></span><br><br>";
            $row .= "<a class='button' href='range_routing.php?hs={$list->listid}&ht={$ht}' style='background: url(img/route.png) 9px 6px no-repeat #f3f3f3;padding-left: 30px;'>Set Range</a></div>";
        }

        $i++;
    }

    $row .= "</td></tr>";

    $display = false;
    if ($search_query == "") {
        $display = true;
    } else {
        $search = 0;
        $found = 0;
        foreach($search_strings as $str) {
            if ($str) {
                $search++;
                if(strpos(strtolower($row), strtolower($str)) !== false) {
                    $found++;
                }
            }
        }

// *** Change to logical OR ***
//        if ($search == $found) {
        if ($found > 0) {
            $display = true;
        }
    }


    if ($display) {
        $total += $row_total;
        $injecting += $row_injecting;
        $scheduled += $row_scheduled;
        $completed += $row_completed;
        $total_volume += $m_volume;
        $undelivered_volume += $u_volume;
        echo $row;
    }

}

$inspire->close();
$Company->close();

?>
</table>
<p style='text-align: center;'>Total: <b><?php echo $total; ?></b> | Complete: <b><?php echo $completed; ?></b> | Injecting: <b><?php echo $injecting; ?></b> | Scheduled: <b><?php echo $scheduled; ?></b> | Volume: <b><?php echo number_format($total_volume, 0); ?></b></p>
<?php
    if($show_complete_button === 0) {
        echo "<div style='text-align: center;'>";
        echo "<form id='complete_mailings' action='prod_schedule.php' method='post'>";
        echo "<input type=hidden name='completeMail' value='1'>";
        echo "<input type=hidden name='completed_drops' value='{$completed}'>";
        echo "<input type=hidden name='scheduled_drops' value='{$total}'>";
        echo "<input type=hidden name='undelivered_volume' value='{$undelivered_volume}'>";
        echo "<input type=hidden name='unsent_drops' value='{$unsent_drops}'>";
        echo "<a class='button' style='margin-top: 8px;' onclick='document.getElementById("."\"complete_mailings\"".").submit();'>Mailings Completed</a>";
        echo "</form>";
        echo "</div>";
    }
?>
<script>
  $(function($){ $("#m_inject").addClass("active"); });

  function swap(id) {
    document.cookie = "prodScheduleURL=" + window.location + "; expires=Fri, 01 Jan 2021 00:00:00 UTC; path=/";
    window.location = "change_group_schedule.php?id=" + id;
  }
</script>

<?php

include(__DIR__."/footer.php")

?>
 
 
