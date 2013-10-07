RTDMS Server : 129.118.19.167 @ ee
ePDC Server : 129.118.105.44, 192.168.19.223

The connections from xx.xx.xx.xx (outside of TTU) 
to 129.118.19.167 are allowed only two ports,which are 
80 (http) and 113 (ident). The rest of port from 0-65535 is 
filtered by TTU network configuration.

The configuration is same as for 129.118.105.44.


**Incoming packet to p3eserver1.p3e.ttu.edu**

xx.xx.xx.xx 
129.118.4.237 (acfw06-v452.ttu.edu)
129.118.4.234 (acrt02-v451.ttu.edu)
129.118.4.245 (acrt02-v454.tpin.ttu.edu)
129.118.251.130 
129.118.19.67 (p3eserver1.p3e.ttu.edu)

**Incoming packet to p3eepdc.ttu.edu**

xx.xx.xx.xx 
129.118.4.237 (acfw06-v452.ttu.edu)
129.118.4.234 (acrt02-v451.ttu.edu)
129.118.4.245 (acrt02-v454.tpin.ttu.edu)
129.118.251.123 
129.118.105.44 (p3eepdc.ttu.edu)


**Firewall**
12.249.227.126

**allowed port connection from outside TTU**
389

