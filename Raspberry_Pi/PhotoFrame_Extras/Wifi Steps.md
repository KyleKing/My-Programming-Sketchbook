// How to connect to WPA2 Wifi over SSH connection:









///////////////////////////////////////////////////////////////////////////////
    ///////////////////// Ignore Below This Line /////////////////////
///////////////////////////////////////////////////////////////////////////////






To get wlan0/wifi IP address of raspberry pi -> sudo ifconfig




Guide: http://www.savagehomeautomation.com/projects/raspberry-pi-installing-the-edimax-ew-7811un-usb-wifi-adapte.html

// Plug in the USB wlan device
lsusb -> Look for USB device
lsmod -> Look for kernel: 8192cu
iwconfig -> look for wlan0

// Edit interface File
sudo nano /etc/network/interfaces
///////////////////////////////////////////////////////
// Original
# interfaces(5) file used by ifup(8) and ifdown(8)

# Please note that this file is written to be used with dhcpcd
# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'

# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d

auto lo
iface lo inet loopback

iface eth0 inet manual

allow-hotplug wlan0
iface wlan0 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

allow-hotplug wlan1
iface wlan1 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
// Edited
# interfaces(5) file used by ifup(8) and ifdown(8)

# Please note that this file is written to be used with dhcpcd
# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'

# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d

auto lo
iface lo inet loopback

iface eth0 inet manual

auto wlan0
allow-hotplug wlan0
iface wlan0 inet manual
		wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
    # wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

allow-hotplug wlan1
iface wlan1 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
///////////////////////////////////////////////////////

// Switched guide to: http://ubuntuforums.org/showthread.php?t=249654
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
///////////////////////////////////////////////////////
// Original
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

///////////////////////////////////////////////////////
// Working example?
# ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
# update_config=1

network={
  SSID="eduroam"
  scan_ssid=1
  key_mgmt=IEEE8021X
  eap=PEAP
  phase2="auth=MSCHAPV2"
  identity="kmking72@terpmail.umd.edu"
  password="Kyotoro22"
}
///////////////////////////////////////////////////////
// Not working example...
network={
	identity="my_identity"
	password="my_password"
	ca_cert="/etc/ssl/certs/my-cert-name"
	eap=PEAP
	anonymous_identity="anonymous@my_uni.edu"
	phase2="auth=MSCHAPV2"
	priority=999
	disabled=0
	ssid="eduroam"
	scan_ssid=0
	mode=0
	auth_alg=OPEN
	// proto=WPA RSN
	proto=WPA2
	pairwise=CCMP TKIP
	key_mgmt=WPA-EAP
	proactive_key_caching=1
}
///////////////////////////////////////////////////////

<!-- Restart -->
sudo /etc/init.d/networking restart



Note, this might work: http://www.willprice.org/2014/03/17/eduroam-on-the-raspberry-pi.html


Undid whatever I could, then opened up the GUI on my laptop with a tighvncserver
$ sudo nano /etc/init.d/PhotoFrameStart
(Commented out the node line to prevent the boot of the photoframeapp, for now)
$ tightvncserver
$ vncserver :5901
then opened in safari: