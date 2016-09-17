### Can't be run on the RPi 1 - needs the armhf architecture:

sudo apt-get install -y flex bison libreadline-dev libexif-dev libpng-dev libjpeg-dev libgif-dev libtiff-dev libpoppler-dev checkinstall #maybe others on your system.

wget http://download.savannah.nongnu.org/releases/fbi-improved/fim-0.5-rc1.tar.gz
tar -xf fim-0.5-rc1.tar.gz
cd fim-0.5-rc1

./configure --disable-readline
mkdir -p /usr/local/share/doc # Fim will fail creating by itself.
sudo checkinstall

See: [this user's answer for how to build FIM](http://raspberrypi.stackexchange.com/a/53675/30942)

Additionally, see the [FBI manual](http://manpages.ubuntu.com/manpages/wily/man1/fbi.1.html) and the [FIM documentation](http://manpages.ubuntu.com/manpages/precise/en/man1/fim.1.html)