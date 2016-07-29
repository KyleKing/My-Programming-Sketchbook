# Node and FBI Installation Script for RPI
# Written By Kyle King

tput setaf 6; echo "
Meteor Installation Script for RPI
Only works for Jessie Distribution of Raspbian
"

# Change the Node install version: see https://nodejs.org/dist/
nodeInstallV=v6.0.0

# Check for proper permissions:
if [[ $EUID -ne 0 ]]; then
	tput setaf 3; echo "This script needs to be run as root:
	su
	bash install.sh
	"
	exit 1
fi

# Begin by updating RPI
tput setaf 6; echo "
Searching for out of date packages, installing updates, and cleaning up afterward"
tput setaf 7; echo ""
apt-get update
apt-get upgrade -y # automatic yes to prompts
apt-get dist-upgrade -y
apt-get autoremove && apt-get autoclean

# Install Node
tput setaf 6; echo "
Installing Node $nodeInstallV:"
tput setaf 7; echo ""
wget https://nodejs.org/dist/v6.0.0/node-$nodeInstallV-linux-armv7l.tar.gz
tar -xvf node-$nodeInstallV-linux-armv7l.tar.gz
cd node-$nodeInstallV-linux-armv7l

tput setaf 6; echo "Probably done!"
