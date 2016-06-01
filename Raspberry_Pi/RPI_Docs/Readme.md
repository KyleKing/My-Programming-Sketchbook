# Raspberry Pi Notes

<!-- TODO Check for errors -->
<!-- TODO Clean up bad links -->
<!-- TODO Clean up whole document in general -->

*About*

All of this content was in a Google Document on Google Drive, but it was difficult to navigate and the code examples were difficult to read. This version is meant to be easier to access and read. Please submit a PR or open an issue if you have any suggestions or comments.

## Setting up or Backing up

#### Write to a new SD card

You must have a .img file. To start fresh, download an image file from the [official raspberry pi site](https://www.raspberrypi.org/downloads/) and follow their guide. Get the microSD disk number and unmount the specified disk (in this case, /dev/disk2)

```bash
diskutil list
diskutil unmountDisk /dev/disk2
```

Then run dd, but enter the path to the image file you want to install. To check the current status, press <kbd>Ctrl</kbd>+<kbd>T</kbd>

```
sudo dd bs=1m if=2016-01-12_Backup.img of=/dev/rdisk2
```

When ready, plug the microSD card into the Raspberry Pi and connect the USB Devices/HDMI/Ethernet cord with the micro USB power supply last. If the raspberry pi turns on and off, try removing as many USB devices as possible, switching the power supply, or using an external USB hub.

[The original guide](http://raspberrypi.stackexchange.com/a/313)

### Backup progress from one SD card to another

Shutdown the raspberry pi and wait a few moments to be safe, then pull out the SD card and plug into computer. You will use the dd command line tool to convert a given disk (disk2) into a .img file. To reach a more sane file size, use gzip or on a Mac, right click on the file and choose the “compress” menu option.

#### Backup a microSD card

First get the disk number and navigate to the directory you want to backup .img file

```bash
diskutil list
cd ~/Downloads
```

Then run dd, but change the filename to one that makes sense:

```
sudo dd if=/dev/rdisk2 of=2016-01-12_Backup.img bs=1m
```

If you need to delete a .img file, use ```rm``` from the command line, otherwise the file system doesn't properly account for the removal of the large file if done through the GUI.

## Set Up Headless Connection

There are several ways to connect to a raspberry pi. I prefer to use an Ethernet cord and boot the raspberry pi headless, but it is just as easy to use a keyboard and display to boot the raspberry pi.

For an Ethernet based approach on a Mac:

* Connect to a wifi network that allows internet sharing (most WPA2 and in my case, UMD (not UMD-Secure))
* Go into network settings, make sure there is a profile for an Ethernet connection and a wifi profile
* The wifi connection should be first and Ethernet second (you can change this by clicking on the cog wheel (bottom of window) > set service order)
* Navigate to the sharing profile and turn on wifi > Ethernet internet sharing
* Connect the raspberry pi, then power it on
* Find the IP address and SSH into the pi

You will need nmap, which is best installed through Homebrew on a Mac [ To install Homebrew, visit their [official documentation](http://brew.sh/) ]. There are similar alternatives for PC's.

```bash
brew install nmap
```

Find the raspberry pi's IP address ([Source](http://raspberrypi.stackexchange.com/questions/13936/find-raspberry-pi-address-on-local-network/13937#13937)):

```bash
nmap -p 22 --open -sV 192.168.2.* # search for pi
# Alternatively:
sudo nmap -sP 192.168.2.0/24 | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'

# For wifi
sudo nmap -sP 192.168.1.0/24
# If not properly sharing internet, search for IP address listed for ethernet port (~169.254.129.1)
```

Connect via SSH by typing this command into terminal. The initial password is raspberry, while the user is pi.

```bash
ssh pi@192.168.2.8 # or whichever IP address nmap returns
```

Configure the raspberry pi using the graphical interface. You will want to make sure to:

* Expand the file system
* Change password
* Set locale
* and any other options you see fit.

```bash
sudo raspi-config
```

##### Troubleshooting SSH

If having trouble with “man in the middle” warnings, try:

```bash
ssh-keygen -R # "<enter hostname>”
# For example:
ssh-keygen -R 192.168.2.9 # re-generates RSS key for given hostname
```

##### SSH file transfer/syncing (Rsync)

[Full Guide](https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories-on-a-vps)
The full guide is great. You can easily edit files in sublime on your personal computer while remotely connected to the raspberry pi. I have two notes that may prove useful. First the difference between ~/dir1 vs ~/dir1/ matters. Second, this is the code I ran:

```bash
rsync -a /Path/To/<MyFolderName> pi@192.168.2.7:/home/pi
```

This was the most crucial step and not on the guide:

```bash
ssh -R 52698:localhost:52698 pi@192.168.1.128
```

Install subl command line tool:

```bash
cd /usr/local/bin
#if using Sublime Text 3:
ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" subl
#if using Sublime Text 2:
ln -s "/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl" subl
#Install rmate on raspberry pi :
sudo wget -O /usr/local/bin/rsub https://raw.github.com/aurora/rmate/master/rmate
# Make executable:
sudo chmod +x /usr/local/bin/rsub
```

Prefer to use Sublime text to remotely edit the files? Try out one of these guides [plugin method](http://www.knight-of-pi.org/using-a-host-computer-for-coding-on-the-raspberry-pi/) or the [terminal approach](http://www.knight-of-pi.org/scp-copy-linux-raspberry/)

### Accessing the Raspberry Pi GUI

*VNC Server (Headless GUI) [Source](http://thejackalofjavascript.com/getting-started-raspberry-pi-node-js/)*

You will be prompted to create an 8 character password. Once set, in Safari (doesn't seem to work in chrome, at least for Mac's) go to vnc://192.168.2.8:5901 and enter the password you just set.

```bash
sudo apt-get install tightvncserver
tightvncserver
vncserver :5901

vncserver -kill :5901 # When done
```

## Misc. Notes

### How to Update

Run these often (Note: the -y option is an automatic yes to prompts)

```bash
sudo apt-get update; sudo apt-get upgrade -y;
```

## Working in JavaScript

### Node Installation

If you've installed Meteor, then you have Node. If not, follow [this guide for a quick 5 minute install](https://github.com/hendrikmaus/node-pi#install-nodejs).

To start playing around with Node right away, try [this fun, on/off demo](https://github.com/fivdi/onoff) and the [associated guide from Adafruit](https://learn.adafruit.com/node-embedded-development?view=all).

![GIF](https://learn.adafruit.com/system/assets/assets/000/021/906/original/raspberry_pi_demo.gif?1448314329)

### Meteor Installation

To see all of my notes, navigate to [the Meteor-only guide](http://kyleking.github.io/RPI_Docs/meteor.html)

If you just want to see the code, try this Bash Script, which is best downloaded from [Github](https://raw.githubusercontent.com/KyleKing/MML_WIP/master/Build_Scripts/make.sh). The script includes my abbreviated notes and is meant for the Jessie distribution.

#### How to run Meteor

This is of course if your ```.meteor``` directory is in the ```GPIO-test``` folder

```bash
cd GPIO-test
meteor update
sudo meteor # otherwise there are 99 problems
```

### PID Controllers

Liquid PID
https://www.npmjs.com/package/liquid-pid

Arduino Ported library
https://github.com/wilberforce/pid-controller

Alternate
https://www.npmjs.com/package/node-pid-controller

### LocalTunnel (not installed/tested)

*simple sharing of a localhost port*

```bash
sudo npm install -g localtunnel
top # useful to see current use of system
sudo reboot
```

## Peripheral Installation

#### RealTek Wireless USB Dongle Installation

Basically, plug it in and boot the raspberry pi. There shouldn't be any necessary drivers. To connect to a network, either use the UI (easiest) or the command line, both of which are explained in [this Adafruit guide](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup?view=all).Alternatively, these two guides are equally useful:
[Make Tech Easier](https://www.maketecheasier.com/setup-wifi-on-raspberry-pi/) or an [alternative guide](http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/).

#### USB Webcam
>Works! but can't share over wifi :(

```bash
fswebcam -r 1280x720 --no-banner image3.jpg
fswebcam  --no-banner image.jpg
(/dev/video0)
```

Misc. Links:
http://pimylifeup.com/raspberry-pi-webcam-server/
http://thejackalofjavascript.com/rpi-live-streaming/
https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=control+%27usb+webcam%27+from+node+server+raspberry+pi
https://www.google.com/search?q=raspberry%20pi%20webcam%20node%20usb#q=raspberry+pi+webcam+node+npm

Following this guide: http://www.eevblog.com/2015/05/19/how-to-live-stream-a-usb-webcam-on-a-raspberry-pi-2/
sudo apt-get update
sudo apt-get install libav-tools
# sudo apt-get install libav-tools

*Didn’t work… Avconv isn’t accessible*
Consider:
http://raspberrypi.stackexchange.com/questions/23182/how-to-stream-video-from-raspberry-pi-camera-and-watch-it-live
http://pimylifeup.com/raspberry-pi-webcam-server/

*Future for Webcam: FFMPEG*
Node: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg (Old guide referenced by this post)
http://sirlagz.net/2013/01/07/how-to-stream-a-webcam-from-the-raspberry-pi-part-3/
https://www.raspberrypi.org/forums/viewtopic.php?f=27&t=14020

### The Pi Module

[Great Guide](https://github.com/raspberrypilearning/guides/blob/master/camera/README.md)

### Thermocouple Sensor (MAX31855)

- [Arduino Guide for MAX31855](https://learn.adafruit.com/thermocouple?view=all)
- [~Tessel~](https://github.com/tessel/thermocouple-max31855)
- [*Pi NPM Package*](https://www.npmjs.com/package/max31855pi)
- [Python Guide](https://learn.adafruit.com/max31855-thermocouple-python-library?view=all)

Attempted Python version to confirm that the hardware works:

```bash
sudo apt-get update
sudo apt-get install build-essential python-dev python-pip python-smbus git
```

## An Arduino

*I guess this counts as a peripheral?*

How to Connect an Arduino over Serial
Source -> possible to symlink if trouble identifying multiple devices
http://arduino.stackexchange.com/questions/3680/in-linux-how-to-identify-multiple-arduinos-connected-over-usb

The connected arduino should follow this pattern: /dev/ttyACM0 or /dev/ttyACM1 etc.
Search by running $ ls /dev/ttyACM*
Also useful: “Get to know your RPI”
http://raspberry-pi-guide.readthedocs.org/en/latest/system.html

<!-- TODO Add Node/Meteor Guide and Sample Code-->


## Electronics / Real World Notes

### MOSFETS
[A brief overview of theory](http://blog.oscarliang.net/how-to-use-mosfet-beginner-tutorial/) and a [basic guide with in process images](http://aruljohn.com/blog/raspberrypi-christmas-lights-rgb-led/). Note: it may be useful to use a diode on the drain pin of the MOSFET to protect your circuit, however most common diodes only accept up to 1A.

![Example Circuit Diagram](http://aruljohn.com/blog/pix/ChristmasRGBLEDLights_aruljohn.png)

### Analog to Digital Converter

The [Adafruit Guide](https://learn.adafruit.com/reading-a-analog-in-and-controlling-audio-volume-with-the-raspberry-pi?view=all) and my variation of the example code:

```python
#!/usr/bin/env python

# Written by Limor "Ladyada" Fried for Adafruit Industries, (c) 2015
# This code is released into the public domain

import time
import os
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
DEBUG = 1

# read SPI data from MCP3008 chip, 8 possible adc's (0 thru 7)
def readadc(adcnum, clockpin, mosipin, misopin, cspin):
        if ((adcnum > 7) or (adcnum < 0)):
                return -1
        GPIO.output(cspin, True)

        GPIO.output(clockpin, False)  # start clock low
        GPIO.output(cspin, False)     # bring CS low

        commandout = adcnum
        commandout |= 0x18  # start bit + single-ended bit
        commandout <<= 3    # we only need to send 5 bits here
        for i in range(5):
                if (commandout & 0x80):
                        GPIO.output(mosipin, True)
                else:
                        GPIO.output(mosipin, False)
                commandout <<= 1
                GPIO.output(clockpin, True)
                GPIO.output(clockpin, False)

        adcout = 0
        # read in one empty bit, one null bit and 10 ADC bits
        for i in range(12):
                GPIO.output(clockpin, True)
                GPIO.output(clockpin, False)
                adcout <<= 1
                if (GPIO.input(misopin)):
                        adcout |= 0x1

        GPIO.output(cspin, True)

        adcout >>= 1       # first bit is 'null' so drop it
        return adcout

# change these as desired - they're the pins connected from the
# SPI port on the ADC to the Cobbler
SPICLK = 18
SPIMISO = 23
SPIMOSI = 24
SPICS = 25

# set up the SPI interface pins
GPIO.setup(SPIMOSI, GPIO.OUT)
GPIO.setup(SPIMISO, GPIO.IN)
GPIO.setup(SPICLK, GPIO.OUT)
GPIO.setup(SPICS, GPIO.OUT)

while True:
        # read the analog pin
        CH0 = readadc(0, SPICLK, SPIMOSI, SPIMISO, SPICS)
        CH1 = readadc(1, SPICLK, SPIMOSI, SPIMISO, SPICS)
        CH2 = readadc(2, SPICLK, SPIMOSI, SPIMISO, SPICS)
        CH3 = readadc(3, SPICLK, SPIMOSI, SPIMISO, SPICS)

        print '{0},{1},{2},{3}'.format(CH0, CH1, CH2, CH3)
        if DEBUG:
                print ">> CH0:", CH0
                print "   CH1:", CH1
                print "   CH2:", CH2
                print "   CH3:", CH3
```

### Raspberry Pi Pinout

[Printable version](https://github.com/splitbrain/rpibplusleaf)

### Connecting an LED

Long pin === positive (+) (Somehow I always forget this, so this is part of any guide I make)
Connect the long (+ cathode) leg to source and the short leg (- anode) into ground
[Suggested resistor is ~1kΩ](http://www.ladyada.net/learn/arduino/lesson3.html)
_Ideally keep the current under 15mA_

## General Troubleshooting

### HDMI Not Displaying
You can change the configuration, [but first](http://blog.mivia.dk/solved-hdmi-working-raspberry-pi/)

- [ ] Remove all USB peripherals (keyboard, mouse, especially wifi, etc)
- [ ] Check HMI adapter with laptop to confirm function
- [ ] Shutoff raspberry pi and plug in only micro-usb power and HDMI
	- [ ] Confirm raspberry pi is on by connecting via ethernet/headless]
- [ ] If still no progress, try a different power supply (5V - 2A is recommended [iPhone USB charger adapter, laptop (note: can only supply ~900mA), etc.])
- [ ] Then try a different monitor
- [ ] If this still doesn’t work, try a fresh SD card
- [ ] If still no luck, play around with the configuration file following [this guide](http://blog.mivia.dk/solved-hdmi-working-raspberry-pi/)
