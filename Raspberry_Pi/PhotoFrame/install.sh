# Installation Script - updates system, then installs fbi (Need to be run as root)
# chmod +rwx ./install.sh

echo ""
echo "Searching for out of date packages, installing updates, and cleaning up afterward"
echo ""

apt-get update && apt-get -y upgrade && apt-get autoremove && apt-get autoclean
# Bypass the yes prompt

echo ""
echo "Installing framebuffer imageviewer (fbi)"
echo ""
apt-get install fbi -y

echo ""
echo "Possible successful? Find out in a few moments:"
echo ""

# Test fbi
chmod +rwxrwx ./slideshow.sh
bash ./slideshow.sh

# Wake up user
echo $'\a'

# Only works on mac:
# say FBI Install Process Complete