# Meteor Installation Script for RPI
# Written By Kyle King

tput setaf 6; echo "
Meteor Installation Script for RPI
Only works for Jessie Distribution of Raspbian
"
if [[ $EUID -ne 0 ]]; then
	tput setaf 3; echo "This script needs to be run as root:
	su
	bash install-meteor.sh
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

tput setaf 6; echo "
Installing necessary packages for Meteor"
tput setaf 7; echo ""
apt-get install build-essential debian-keyring autoconf automake libtool flex bison scons git mongodb
apt-get autoremove --purge
apt-get clean

# # No longer necessary with pre-built version
# tput setaf 7; echo "
# Installing Node v0.10.40:"
# tput setaf 1; echo ""
# cd /tmp
# git clone https://github.com/joyent/node.git
# cd node
# echo 'Moved to /tmp/node'
# git checkout v0.10.40
# ./configure --without-snapshot
# echo 'Making now - no turning back!'
# make # about 2 hours and do not cancel
# make install
# node --version
# npm --version

tput setaf 6; echo "
Installing Meteor Universal from: https://github.com/4commerce-technologies-AG/meteor#quick-start"
tput setaf 7; echo ""
cd $HOME
git clone --depth 1 https://github.com/4commerce-technologies-AG/meteor.git
$HOME/meteor/meteor --version # this may take a long time...

tput setaf 3; echo "
To Uninstall Meteor:
rm -r $HOME/meteor
"

tput setaf 6; echo 'To make meteor easier to run, add "export PATH=$PATH:$HOME/meteor/" to your .bashrc file'
tput setaf 7; echo "For example, copy and run:"
echo 'echo "
# Modified profile for Meteor Universal Installation on $(date)
export PATH=$PATH:$HOME/meteor/
" >> ~/.bashrc
'


tput setaf 6; echo 'Create and run a "reactJS" example (optional):'
tput setaf 7; echo "cd $HOME

# get the command line to checkout the meteor example
$HOME/meteor/meteor create --example simple-todos-react

# this is what you will receive as command hint, so put it in
git clone https://github.com/meteor/simple-todos-react

# jump into the project folder
cd simple-todos-react

# get necessary npm stuff
$HOME/meteor/meteor npm install

# bring that project up to latest module updates
$HOME/meteor/meteor update --packages-only

# add one package to avoid counting of modules usage and DDP error message on start
$HOME/meteor/meteor add package-stats-opt-out

# run that app
$HOME/meteor/meteor
# # or if you have appended your bash profile (see above)
# meteor
"
