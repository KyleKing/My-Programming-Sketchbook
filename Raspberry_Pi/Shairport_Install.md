```bash
sudo apt-get install build-essential git -y
sudo apt-get install autoconf automake libtool libdaemon-dev libasound2-dev libpopt-dev libconfig-dev -y
sudo apt-get install avahi-daemon libavahi-client-dev -y
sudo apt-get install libssl-dev -y
sudo apt-get install libsoxr-dev -y

git clone https://github.com/mikebrady/shairport-sync.git
cd shairport-sync
autoreconf -i -f
./configure --sysconfdir=/etc --with-alsa --with-avahi --with-ssl=openssl --with-metadata --with-soxr --with-systemd

make

sudo getent group shairport-sync &>/dev/null || sudo groupadd -r shairport-sync >/dev/null
sudo getent passwd shairport-sync &> /dev/null || sudo useradd -r -M -g shairport-sync -s /usr/bin/nologin -G audio shairport-sync >/dev/null

sudo make install
```