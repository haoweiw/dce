<?php /* -*- PHP -*- */
/* DHCPD configuration file */
define ("DHCPDCONFIG", "/etc/dhcp/dhcpd.conf");
//define ("DHCPDCONFIG", "~/chromeos-admin/puppet/modules/lab/files/dhcp-server/dhcpd.conf");
/* DHCPD restart command */
define ("DHCPDRESTART", "sudo service isc-dhcp-server restart");
//define ("DHCPDRESTART", "sudo service isc-dhcp-server restart");
?>
