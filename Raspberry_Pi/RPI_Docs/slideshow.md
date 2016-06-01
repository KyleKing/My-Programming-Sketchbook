Install FBI and upgrade packages anyway
$ apt-get update
$ apt-get upgrade
$ apt-get install fbi
Test: $ fbi -a -noverbose -t 4 /home/pi/Raspberry\ Pi/Aloo/imgs/*.png
Stopped screen blanking (Guide)
sudo nano /etc/kbd/config
Change:
BLANK_TIME=0
POWERDOWN_TIME=0
sudo nano /etc/xdg/lxsession/LXDE/autostart
Add:
@xset s noblank
@xset s off
@xset -dpms
sudo nano /etc/lightdm/lightdm.conf (based on additional step in this guide)
https://www.bitpi.co/2015/02/14/prevent-raspberry-pi-from-sleeping/

Add: xserver-command=X -s 0 -dpms (below particular header)
Other options:
Discussion on xscreensaver and others
https://www.raspberrypi.org/forums/viewtopic.php?t=24047&p=247319

PQIV or FEH
https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=17033&start=25
http://raspberrypi.stackexchange.com/questions/1391/can-anyone-recommend-a-simple-image-viewer
