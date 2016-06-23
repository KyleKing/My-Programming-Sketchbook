# RPI Update Script
# Written By Kyle King

if [[ $EUID -ne 0 ]]; then
	tput setaf 3; echo "This script needs to be run as root:
	su
	bash update.sh
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
