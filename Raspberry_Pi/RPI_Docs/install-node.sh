# Node Installation Script for RPI
# Written By Kyle King

tput setaf 6; echo "
PhotoFrame Installation Script for RPI
Only works for Jessie Distribution of Raspbian
"
if [[ $EUID -ne 0 ]]; then
    tput setaf 3; echo "This script needs to be run as root:
    sudo bash install-node.sh
    "
    exit 1
fi
# Increment this to get a newer/older version:
nodeInstallV=v6.0.0
tput setaf 6; echo "
Installing Node $nodeInstallV:"
tput setaf 7; echo ""
wget https://nodejs.org/dist/v6.0.0/node-$nodeInstallV-linux-armv7l.tar.gz
tar -xvf node-$nodeInstallV-linux-armv7l.tar.gz
cd node-$nodeInstallV-linux-armv7l
