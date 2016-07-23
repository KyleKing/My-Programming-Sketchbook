# Node and FBI Installation Script for RPI
# Written By Kyle King

tput setaf 6; echo "
PhotoFrame Installation Script for RPI
Only works for Jessie Distribution of Raspbian
"
if [[ $EUID -ne 0 ]]; then
	tput setaf 3; echo "This script needs to be run as root:
	sudo bash install.sh
	"
	exit 1
fi

curDir=$(pwd)

tput setaf 7; echo 'Configure Bash settings by running both of these commands:

mv inputrc $HOME/inputrc

echo "# Modified profile to ignore duplicate history entries on $(date)
export HISTCONTROL=ignoredups
" >> ~/.bashrc'


# Begin by updating RPI
tput setaf 6; echo "
Searching for out of date packages, installing updates, and cleaning up afterward"
tput setaf 7; echo ""
apt-get update
apt-get upgrade -y # automatic yes to prompts
apt-get dist-upgrade -y
apt-get autoremove && apt-get autoclean

# Get system info, then install Node:
# Increment this to get a newer/older version:
nodeInstallV=v6.0.0
armVersion=$(cat /proc/cpuinfo | egrep -o -m 1 "\(v[0-9]l\)" | egrep -o "v[0-9]l")
echo "Found armVersion = $armVersion"
armV=arm$armVersion
tput setaf 6; echo "
Installing Node $nodeInstallV for processor $armV"

tput setaf 7; cd $HOME
wget https://nodejs.org/dist/$nodeInstallV/node-$nodeInstallV-linux-$armV.tar.gz
tar -xf node-$nodeInstallV-linux-$armV.tar.gz
cd node-$nodeInstallV-linux-$armV
sudo cp -R * /usr/local/
echo "Done installing Node and NPM, now checking installation:
When running 'which node', you should see: $(which node)
When running 'which npm', you should see: $(which npm)
Installed $(node -v) and $(npm -v)"
cd $curDir

# # Now the component for the PhotoFrame
# tput setaf 6; echo "
# Installing framebuffer imageviewer (fbi)"
# tput setaf 7; echo ""
# apt-get install fbi -y

# tput setaf 6; echo '
# # Test fbi
# chmod +rwx ./slideshow.sh
# bash ./slideshow.sh
# # or:
# fbi -a -noverbose -t 4 /home/pi/Raspberry\ Pi/Aloo/imgs/*.png
# '

# tput setaf 3; echo '
# # To stop screen blanking:

# # Edit:
# sudo nano /etc/kbd/config
# # Change:
# BLANK_TIME=0
# POWERDOWN_TIME=0

# # Edit:
# sudo nano /etc/xdg/lxsession/LXDE/autostart
# # Add:
# @xset s noblank
# @xset s off
# @xset -dpms

# # Edit:
# sudo nano /etc/lightdm/lightdm.conf # [based on additional step in this guide](https://www.bitpi.co/2015/02/14/prevent-raspberry-pi-from-sleeping/)

# # Add:
# xserver-command=X -s 0 -dpms # (below particular header)
# # Other options:
# Discussion on xscreensaver and others
# https://www.raspberrypi.org/forums/viewtopic.php?t=24047&p=247319

# # Other:
# # PQIV or FEH
# https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=17033&start=25
# http://raspberrypi.stackexchange.com/questions/1391/can-anyone-recommend-a-simple-image-viewer
# '
