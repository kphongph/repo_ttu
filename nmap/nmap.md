# NMAP (Network Mapper) #

## Port Scan Technique ##

### TCP SYN ###
This scanning technque starts by sending TCP SYN to destination host 
with specific port. If the port is *opened*, the destination host will 
reply back with ACK otherwise RST will be replied by destination host 
if the port is closed. The scanner will send RST back to the server to 
discard the connection. By doing this step, we leave no track because
the TCP connection is not completed. We usually call this scenario as
*half-opening* scanning.

`nmap [Scan Types] [Options] {target specification}`

Type of scanning 

 * `sS` TCP SYN Scan
 * `sT` TCP Connect Scan
 * `sF` FIN Scan
 * `sA` ACK Scan
 * `sW` Window Scan

Port Specification 
-p Scan for TCP ports
-sU Scan for UDP ports
-r Do a sequential port scan (don't randomise the ports)
-F Fast scan, scans fewer ports

OS/Service/Version Detection
-O Detect operating system
-sV Version detection

Host Discovery
-sL List targets
-PN Do a 'ping scan'

Timing/Performance
-T(0-5) 5 is the fastest, 0 is the slowest
-F Fast scan, scans fewer ports

Firewall/IDS Evasion and Spoofing
-D IP_Addresses Decoy hosts
-g port_number Spoof source port
-f Fragment packets

Output
-oN Normal output
-oG Grepable output
-oX XML output
-oA Output in all three formats

Target Specification
IP address - 192.169.100.1, 192.168.100.2
List of IP addresses 192.168.100.1-50
CIDR 192.168.100.1/24
-iL filename Read the list of IP addresses from the file


Firewall scanning details
-Blocked (closed port) = most of the firewall ports should be in a closed state
-Filtered = A few ports may be filtered to restrict access of the running services to a few IP addresses
-Allowed (open port) = very few ports should be in a open state.


