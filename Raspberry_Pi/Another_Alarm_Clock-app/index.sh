# Meteor Installation Script for RPI
# Written By Kyle King

# Only works for Jessie Distribution of Raspbian
# Needs to be run as root:
# 	To make executable, use: chmod +rwx ./Install.sh
# 	then, bash Install.sh

# Begin by updating RPI
echo ""
echo "Searching for out of date packages, installing updates, and cleaning up afterward"
echo ""
sudo apt-get update
sudo apt-get upgrade -y # automatic yes to prompts
sudo apt-get dist-upgrade -y
sudo apt-get autoremove && sudo apt-get autoclean

echo ""
echo "Fixing Locale Issue"
echo ""
sudo apt-get install locales
sudo locale-gen en_US.UTF-8
sudo localedef -i en_GB -f UTF-8 en_US.UTF-8

echo ""
echo "Installing Node"
echo ""
curl -sLS https://apt.adafruit.com/add | sudo bash
sudo apt-get install node

echo ""
echo ""
echo "Possibly successful, try running:"
echo "		node -v"
echo "		npm -v"
echo "If returns a version number, like 'v0.12.0' - then it works!"
