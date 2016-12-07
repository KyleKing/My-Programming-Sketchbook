# On Off Shutdown

This is a simple wrapper that I deploy to all of my running Raspberry Pi's. I add the below script to the rc.local file with (`sudo nano /etc/rc.local`). See more about utilizing this [script on the Raspberry Pi foundation website](https://www.raspberrypi.org/documentation/linux/usage/rc-local.md)]. The file starts a specified script, logs all output, then on a button interrupt will shut everything down (or whichever action makes sense). See [My-Programming-Sketchbook/Electronics/OnOffShutdown/](https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/Electronics/OnOffShutdown) for a basic circuit

```bash
# Based on http://stackoverflow.com/a/31113532/3219667
export PATH=/sbin:/usr/sbin:$PATH
cd /home/pi/onoff-shutdown
su pi -c 'node init.es6' &
```