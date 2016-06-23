# My Raspberry Pi Documentation

You are viewing the main guide, but there is additional guides for [Meteor](Meteor.md), [test1](test1.md), and [test2](test2.md)

<!-- MarkdownTOC depth="6" autolink="true" bracket="round" -->

- [About](#about)
- [Starting from Scratch](#starting-from-scratch)
        - [Download `Raspbian-Jessie`](#download-raspbian-jessie)
        - [Format a fresh microSD Card](#format-a-fresh-microsd-card)
        - [Prep your microSD Card](#prep-your-microsd-card)
- [Booting a Fresh Installation](#booting-a-fresh-installation)
        - [Easiest Setup](#easiest-setup)
        - [*\(Alternatively\) Headless Connection*](#alternatively-headless-connection)
                - [Troubleshooting SSH](#troubleshooting-ssh)
        - [Configure the Raspberry Pi](#configure-the-raspberry-pi)
- [Backup an Entire SD Card](#backup-an-entire-sd-card)
- [Other Useful Tools](#other-useful-tools)
        - [SSH file transfer/syncing \(Rsync\)](#ssh-file-transfersyncing-rsync)
        - [Accessing the Raspberry Pi GUI](#accessing-the-raspberry-pi-gui)
- [Misc. Notes](#misc-notes)
        - [How to Update](#how-to-update)
- [Working in JavaScript](#working-in-javascript)
        - [Node Installation](#node-installation)
        - [Meteor Installation](#meteor-installation)
                - [How to run Meteor](#how-to-run-meteor)
        - [PID Controllers](#pid-controllers)
        - [LocalTunnel \(not installed/tested\)](#localtunnel-not-installedtested)
- [Peripheral Installation](#peripheral-installation)
                - [RealTek Wireless USB Dongle Installation](#realtek-wireless-usb-dongle-installation)
                - [USB Webcam](#usb-webcam)
        - [The Pi Module](#the-pi-module)
        - [Thermocouple Sensor \(MAX31855\)](#thermocouple-sensor-max31855)
- [An Arduino](#an-arduino)
- [Electronics / Real World Notes](#electronics--real-world-notes)
        - [MOSFETS](#mosfets)
        - [Analog to Digital Converter](#analog-to-digital-converter)
        - [Raspberry Pi Pinout](#raspberry-pi-pinout)
        - [Connecting an LED](#connecting-an-led)
- [General Troubleshooting](#general-troubleshooting)
        - [HDMI Not Displaying](#hdmi-not-displaying)

<!-- /MarkdownTOC -->


<!-- TODO: Add inputrc: -->

"\eOA": history-search-backward
"\e[A": history-search-backward
"\eOB": history-search-forward
"\e[B": history-search-forward
"\eOC": forward-char
"\e[C": forward-char
"\eOD": backward-char
"\e[D": backward-char

<!-- TODO: and history to .bash_profile: -->

# ------- Start Customized Profile -------

# Don't put duplicate lines in the history
# https://www.eriwen.com/bash/effective-shorthand/
export HISTCONTROL=ignoredups

# ------- End Customized Profile -------


<!-- End TODO -->



## About

I always forget time saving steps while working on a Raspberry Pi. These notes started as a rough outline on a shared Google Drive document for my lab, but they were rarely used. I still found them useful, so I moved them to Github which made working with code far easier.

## Starting from Scratch

First, I will walk you through how to make a clean installation of Jessie on an 8gb SD card or larger.

### Download `Raspbian-Jessie`

Download the [latest distribution hosted by the Raspberry Pi foundation](https://www.raspberrypi.org/downloads/raspbian/). The `.img` file is about 1.5 gb, so it will take some time to download.

### Format a fresh microSD Card

Using a microSD adapter, erase the microSD card to the `MS-DOS (FAT)` format. On a Mac this can be done through the Disk Utility application.

### Prep your microSD Card

To make the SD card bootable by the Raspberry Pi, you will need to open Terminal on Linux/Mac or gnome-terminal for PC (I think?). For the most part you can copy and paste these commands, but make sure to read them first.

1. Get the microSD disk number and unmount the specified disk (in this case, /dev/disk2)

    ```sh
    diskutil list | grep 0: # then match up the disk name and disk ID
    diskutil unmountDisk /dev/disk2
    ```

2. See the notes prepended by `#`. Make sure to update the file name and disk ID appropriately. To check the current status, while writing to the SD card press <kbd>Ctrl</kbd>+<kbd>T</kbd> (on Mac).

    ```sh
    # Navigate to your downloads folder
    cd ~/Downloads
    # Unzip the newly downloaded file
    unzip 2016-05-27-raspbian-jessie.zip
    # Write the unzipped file to your card
    sudo dd bs=1m if=2016-05-27-raspbian-jessie.img of=/dev/rdisk2
    ```

3. For additional assistance, see the [Raspberry Pi official guide](http://raspberrypi.stackexchange.com/a/313)

4. After a short wait, the SD card will be ready to go. Plug the microSD card into the Raspberry Pi and connect the USB Devices/HDMI/Ethernet cord with the micro USB power supply last. You should the green light blink to confirm the SD card is booting. The green light will stop when completed booting.

## Booting a Fresh Installation

### Easiest Setup

Grab an HDMI display (or HDMI adapter and display), mouse, and keyboard and connect them to the Raspberry Pi. When powered on you can interact with the Pi as if a full size computer.

### *(Alternatively) Headless Connection*

* Connect to a wifi network that allows internet sharing
* Open System Preferences -> Network and make sure there is a profile for an Ethernet connection and a Wifi profile
* The wifi connection should be first and Ethernet second (you can change this by clicking on the cog wheel (bottom of window) > set service order)
* Navigate to the sharing profile and turn on Wifi > Ethernet internet sharing
* Connect the Raspberry Pi, then power it on
* Find the IP address and SSH into the pi (see instructions below)

You will need nmap, which can be [downloaded here](https://nmap.org/download.html#macosx). Look for the `Latest release installer: nmap-7.12.dmg` link (alternatively, you can install nmap with Homebrew `brew install nmap`).

Using nmap, find the raspberry pi's IP address ([Source](http://raspberrypi.stackexchange.com/questions/13936/find-raspberry-pi-address-on-local-network/13937#13937)):

```sh
nmap -p 22 --open -sV 192.168.2.*
# Alternatively:
sudo nmap -sP 192.168.2.* | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'

# If using a Wifi adapter, there is a slight variation:
sudo nmap -sP 192.168.1.* | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'
```

Now connect to the Raspberry Pi. The initial password is `raspberry`, while the user is pi.

```sh
# Use the address returned by the previous command
ssh pi@192.168.2.8
```

#### Troubleshooting SSH

If having trouble with “man in the middle” warnings, regenerate the SSH key:

```sh
ssh-keygen -R # "<enter hostname>”
# For example:
ssh-keygen -R 192.168.2.9
```

### Configure the Raspberry Pi

The initial password is `raspberry`. Once logged in you will need to run:

```sh
sudo raspi-config
```

Click through the menu options using your arrow keys. You will want to make sure to:

* Expand the file system
* Change password
* Set locale (Internationalisation Options -> Change Locale ->  en_GB.UTF-8 -> then set again as default)
* and any other options you see fit
* Reboot, especially if you changed the filesystem

## Backup an Entire SD Card

You will use the dd command line tool to convert a given disk (disk2) into a `.img` file. To reach a more sane file size, use gzip or on a Mac, right click on the file and choose the “compress” menu option.

First get the disk number and go to your Desktop or Downloads directory:

```bash
diskutil list
cd ~/Downloads
```

Then use dd, but change the filename to one that makes sense:

```
sudo dd if=/dev/rdisk2 of=2016-06-23_Backup.img bs=1m
```

If you need to delete a .img file, use ```rm``` from the command line, otherwise the file system doesn't properly account for the removal of the large file if done through the GUI.

## Other Useful Tools

### SSH file transfer/syncing (Rsync)

[Full Guide](https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories-on-a-vps)

<!-- TODO:
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

Prefer to use Sublime text to remotely edit the files? Try out one of these guides [plugin method](http://www.knight-of-pi.org/using-a-host-computer-for-coding-on-the-raspberry-pi/) or the [terminal approach](http://www.knight-of-pi.org/scp-copy-linux-raspberry/) -->

### Accessing the Raspberry Pi GUI

*VNC Server (Headless GUI) [Source](http://thejackalofjavascript.com/getting-started-raspberry-pi-node-js/)*

You will be prompted to create an 8 character password. Once set, in Safari (Chrome doesn't appear to work) go to `vnc://192.168.2.8:5901` (or whichever IP address matches your Pi) and enter the password you set

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

Works! but can't share over wifi :(

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
