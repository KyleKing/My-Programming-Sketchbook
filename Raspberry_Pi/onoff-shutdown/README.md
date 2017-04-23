# On Off Shutdown

> A high level wrapper for all of my Raspberry Pi's

This generic app handles booting a specified app, logging, monitoring wifi connection, logging wifi speed, and on an optional button trigger, the app will trigger a clean shutdown (for an example circuit see [My-Programming-Sketchbook/Electronics/OnOffShutdown/](https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/Electronics/OnOffShutdown))

## General Configuration

Eh, this is bundled in my programming sketchbook for now, so cloning brings the whole project with it...if it wasn't, you would:

```
git clone http://foo/bar
cd onoff-shutdown
npm install
npm start
```

You'll want to modify most of the body of init.es6 to match your app and specific commands, but the pattern is pretty easy to follow - just make sure to create an identifying file like `_velmatron_.ini`. Test that the app works with npm start before preceding

## Boot on Startup

Edit the startup file `sudo nano /etc/rc.local` and append the below snippet; however, make sure to bump the `exit 0` command until after your new snippet. For more about rc.local, [see the Raspberry Pi foundation website](https://www.raspberrypi.org/documentation/linux/usage/rc-local.md)

```
....<append after prior code, but MAKE SURE 'exit 0' is at the end!>...

# Tweaked from http://stackoverflow.com/a/31113532/3219667
# Ampersand from: https://www.raspberrypi.org/documentation/linux/usage/rc-lo$
export PATH=/sbin:/usr/sbin:$PATH
cd /home/pi/onoff-shutdown
su pi -c 'npm start' &

# (optional) Forward port 80 to 3000, so the web server can run with normal permissions
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

exit 0
```

## Refresh Wifi USB on network connection drop

Especially with my 2.4 ghz dongles, my wifi signal may drop in/out and won't be recovered unless I power cycle the USB adapter by plugging/un-plugging, so I made an automatic solution.

### Find the device ID

Run `$ lsusb` and from the list of returned devices, pick the one that coorelates with your USB device. In my case, one USB wifi dongle was `0bda:8176` and my 5ghz dongle is `148f:5572`.

Check that you have the correct ID by inserting it to this statement: `lsusb -d <ID> | awk -F '[ :]'  '{ print "/dev/bus/usb/"$2"/"$4 }'`, which should print the correct bus/device as seen in the lsusb command.

<!-- lsusb -d 148f:5572 | awk -F '[ :]'  '{ print "/dev/bus/usb/"$2"/"$4 }' -->
<!-- sudo $(lsusb -d 148f:5572 | awk -F '[ :]'  '{ print "/dev/bus/usb/"$2"/"$4 }' | xargs -I {} echo "./usbreset {}") -->

### Setup the usbreset.c Script

```
cc usbreset.c -o usbreset # Compile
chmod +x usbreset # Make executable
sudo ./usbreset /dev/bus/usb/<bus>/<device> # test script with sudo privileges
```


- Source for Device ID/one-liner: http://raspberrypi.stackexchange.com/a/9301/30942
- Source for usbreset script: http://askubuntu.com/a/661 which came from: http://marc.info/?l=linux-usb&m=121459435621262&w=2


## Notes

After setup, you should be able to reboot your Raspberry Pi and whichever app you configured will start and begin logging on the next boot. You may also want to see my notes on [configuring wifi and other Raspberry Pi info](https://github.com/KyleKing/Another_Raspberry_Pi_Guide/blob/master/Peripherals.md).