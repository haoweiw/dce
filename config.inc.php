<?php /* -*- PHP -*- */
//define ("DHCPDCONFIG", "/etc/dhcp/dhcpd.conf");

/* DHCPD configuration file for chromeos2*/
define ("DHCPDCONFIG_CHROMEOS2", "/etc/dhcp/chromeos2");
//* DHCPD configuration file for chromeos4*/
define ("DHCPDCONFIG_CHROMEOS4", "/etc/dhcp/chromeos4");
/* DHCPD configuration file for chromeos2*/
define ("DHCPDCONFIG_CHROMEOS6", "/etc/dhcp/chromeos6");


/* DHCPD restart command */
define ("DHCPDRESTART", "sudo service isc-dhcp-server restart");
//define ("DHCPDRESTART", "sudo service isc-dhcp-server restart");
?>
