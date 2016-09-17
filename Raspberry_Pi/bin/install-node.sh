tput setaf 6; echo "
Node Installation Script for RPI Written By Kyle King
Probably only works for Jessie Distribution of Raspbian
"
if [[ $EUID -ne 0 ]]; then
    tput setaf 3; echo "This script needs to be run as root:
    sudo bash install-node.sh
    "
    exit 1
fi

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
