# Node Installation Script for RPI
# Written By Kyle King

# Only works for Jessie Distribution of Raspbian
# Needs to be run as root:
# 	To make executable, use: chmod +rwx ./Install.sh
# 	then, bash Install.sh

# Begin by updating RPI
echo ""
echo "Searching for out of date packages, installing updates, and cleaning up afterward"
echo ""
sudo bash
apt-get update
apt-get upgrade -y # automatic yes to prompts
apt-get dist-upgrade -y
apt-get autoremove && apt-get autoclean

echo ""
echo "Installing necessary packages for Node/Meteor"
echo ""
apt-get install build-essential debian-keyring autoconf automake libtool flex bison mongodb
apt-get autoremove --purge
apt-get clean

echo ""
echo "Installing Node:"
echo ""
cd /tmp
git clone https://github.com/joyent/node.git
cd node
echo 'Moved to /tmp/node'
git checkout v0.10.40
./configure --without-snapshot
echo 'Making now - no turning back!'
make # about 2 hours and do not cancel
make install
node --version
npm --version

echo ""
echo "Installing framebuffer imageviewer (fbi)"
echo ""
apt-get install fbi -y
# Test fbi
chmod +rwxrwx ./slideshow.sh
bash ./slideshow.sh
