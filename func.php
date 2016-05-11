<?php /* -*- PHP -*- */

/* configuration file */
define ("CONFIGFILE", "config.inc.php");
if (!defined ("_UNIT_TEST_")) require_once (CONFIGFILE);
if (!defined ("DHCPDCONFIG,")) define ("DHCPDCONFIG", "");
if (!defined ("DHCPDRESTART,")) define ("DHCPDRESTART", "");

/* XML header */
Header("content-type: application/xml");

/* default return values */
$stat = -1;
$content = "";

/* check for action */
if (array_key_exists ("action", $_POST)) {

    /* select action */
    switch ($_POST["action"]) {
    case "load":

        /* open file and  read it */
        $data = file_get_contents (DHCPDCONFIG);
        if ($data !== false) {
            $content = "<data><![CDATA[" . base64_encode ($data) . "]]></data>";
            $stat = 0;
        }
        break;

    case "save":

        /* get data from request */
        if (!array_key_exists ("data", $_POST))
            break;
        $data = base64_decode ($_POST["data"]);

        /* open file for writing */
        $fd = fopen (DHCPDCONFIG, "w");
        if ($fd) {

            /* write file */
            $stat = 0;
            for ($written = 0; $written < strlen ($data); $written += $fwrite) {
                $fwrite = fwrite ($fd, substr ($data, $written));
                if ($fwrite === false) {
                    $stat = 1;
                    break;
                }
            }
            fclose ($fd);
        }
        break;

    case "apply":

        /* restart daemon */
        exec (DHCPDRESTART, $msg, $stat);
        break;

    }
}

/* create XML string */
echo "<xml><message>$content<stat>" . $stat . "</stat></message></xml>";
