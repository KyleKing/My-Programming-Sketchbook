# My Raspberry Pi Documentation

You are viewing the main guide, but there is additional guides for [JavaScript (Meteor/Node)](JavaScript.md), [Peripherals (Cameras, etc.) and Wifi](PeripheralsAndWifi.md), and [Electronics](Electronics.md)

<!-- MarkdownTOC depth="6" autolink="true" bracket="round" -->

- [About](#about)
- [Starting from Scratch](#starting-from-scratch)
    - [Download `Raspbian-Jessie`](#download-raspbian-jessie)
    - [Format a fresh microSD Card](#format-a-fresh-microsd-card)
    - [Prep your microSD Card](#prep-your-microsd-card)
- [Booting a Fresh Installation - Easiest Setup](#booting-a-fresh-installation---easiest-setup)
- [Booting a Fresh Installation - \(Alternative\) Headless Connection](#booting-a-fresh-installation---alternative-headless-connection)
    - [Tools for Working With a Headless Connection](#tools-for-working-with-a-headless-connection)
        - [Troubleshooting SSH](#troubleshooting-ssh)
        - [Accessing the Raspberry Pi GUI](#accessing-the-raspberry-pi-gui)
        - [Headless File Transfer \(rsync\)](#headless-file-transfer-rsync)
- [Configure the Raspberry Pi](#configure-the-raspberry-pi)
- [Other Useful Tools and Raspberry Pi Notes](#other-useful-tools-and-raspberry-pi-notes)
    - [Backup an Entire SD Card](#backup-an-entire-sd-card)
    - [Keeping the Pi Running Smoothly](#keeping-the-pi-running-smoothly)
    - [Alerting on the End of Long Commands](#alerting-on-the-end-of-long-commands)
    - [Mastering Bash History](#mastering-bash-history)

<!-- /MarkdownTOC -->

## About

I always reference some version of this guide while working on the Raspberry Pi, so I figured I would clean it up and make it accessible to everyone.

## Starting from Scratch

First, I will walk you through how to make a clean installation of Jessie on an 8gb SD card or larger.

### Download `Raspbian-Jessie`

Download the [latest distribution hosted by the Raspberry Pi foundation](https://www.raspberrypi.org/downloads/raspbian/). The `.img` file is about 1.5 gb, so it will take some time to download.

### Format a fresh microSD Card

Using a microSD adapter, erase the microSD card to the `MS-DOS (FAT)` format. On a Mac this can be done through the Disk Utility application.

### Prep your microSD Card

To make the SD card bootable by the Raspberry Pi, you will need to open Terminal on Linux/Mac or gnome-terminal for PC (I think?). For the most part you can copy and paste these commands, but make sure to read them first.

1. Get the microSD disk number and unmount the specified disk (in this case, /dev/disk2)

    ```bash
    diskutil list | grep 0: # then match up the disk name and disk ID
    diskutil unmountDisk /dev/disk2
    ```

2. See the notes prepended by `#`. Make sure to update the file name and disk ID appropriately. To check the current status, while writing to the SD card press <kbd>Ctrl</kbd>+<kbd>T</kbd> (on Mac).

    ```bash
    # Navigate to your downloads folder
    cd ~/Downloads
    # Unzip the newly downloaded file
    unzip 2016-05-27-raspbian-jessie.zip
    # Write the unzipped file to your card
    sudo dd bs=1m if=2016-05-27-raspbian-jessie.img of=/dev/rdisk2
    ```

3. For additional assistance, see the [Raspberry Pi official guide](http://raspberrypi.stackexchange.com/a/313)

4. After a short wait, the SD card will be ready to go. Plug the microSD card into the Raspberry Pi and connect the USB Devices/HDMI/Ethernet cord with the micro USB power supply last. You should the green light blink to confirm the SD card is booting. The green light will stop when completed booting.

## Booting a Fresh Installation - Easiest Setup

Grab an HDMI display (or HDMI adapter and display), mouse, and keyboard and connect them to the Raspberry Pi. When powered on you can interact with the Pi as if a full size computer.

## Booting a Fresh Installation - (Alternative) Headless Connection

* Connect to a wifi network that allows internet sharing
* Open System Preferences -> Network and make sure there is a profile for an Ethernet connection and a Wifi profile
* The wifi connection should be first and Ethernet second (you can change this by clicking on the cog wheel (bottom of window) > set service order)
* Navigate to the sharing profile and turn on Wifi > Ethernet internet sharing
* Connect the Raspberry Pi, then power it on
* Find the IP address and SSH into the pi (see instructions below)

You will need nmap, which can be [downloaded here](https://nmap.org/download.html#macosx). Look for the `Latest release installer: nmap-7.12.dmg` link (alternatively, you can install nmap with Homebrew `brew install nmap`).

Using nmap, find the raspberry pi's IP address ([Source](http://raspberrypi.stackexchange.com/questions/13936/find-raspberry-pi-address-on-local-network/13937#13937)):

```bash
nmap -p 22 --open -sV 192.168.2.*
# Alternatively:
sudo nmap -sP 192.168.2.* | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'

# If using a Wifi adapter, there is a slight variation:
sudo nmap -sP 192.168.1.* | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'
```

Now connect to the Raspberry Pi. The initial password is `raspberry`, while the user is pi.

```bash
# Use the address returned by the previous command
ssh pi@192.168.2.8
```

### Tools for Working With a Headless Connection

These brief notes will help you master working with a headless connection.

#### Troubleshooting SSH

If having trouble with “man in the middle” warnings, regenerate the SSH key:

```bash
ssh-keygen -R # "<enter hostname>”
# For example:
ssh-keygen -R 192.168.2.9
```

#### Accessing the Raspberry Pi GUI

*VNC Server (Headless GUI) [Source](http://thejackalofjavascript.com/getting-started-raspberry-pi-node-js/)*

You will be prompted to create an 8 character password. Once set, in Safari (Chrome doesn't appear to work) go to `vnc://192.168.2.8:5901` as if a regular URL (or whichever IP address matches your Pi) and enter the password you set in the popup.

```bash
sudo apt-get install tightvncserver
tightvncserver
vncserver :5901

vncserver -kill :5901 # When done
```

#### Headless File Transfer (rsync)

Rsync is a realy great tool. Lets say you have:

```bash
# on your computer:
dir1/
|__file1.txt
|__file2.txt
|__subdir
    |__file3.txt

# on the pi:
dir2/
|__file4.txt

# to sync, run this from your computer
rsync -a dir1 pi@192.168.2.8:dir2/

# Then on the pi:
dir2/
|__file4.txt
|__dir1/
    |__file1.txt
    |__file2.txt
    |__subdir
        |__file3.txt
```

That's it. Just use `rsync -a ./dirName pi@192.168.2.7:~`. **There is one important note**. If you use `dir/` then you will only transfer the subdirectories and folders. I prefer to use `dir`, which keeps the parent directory.

Additionally, you may want to ignore folders or files: `rsync -a --exclude=ignoredDir/ ./dirName pi@192.168.2.7:~`. Or delete old files: `rsync -a --delete ./dirName pi@192.168.2.7:~`, but be careful and test this with: `rsync -a --delete --dry-run ./dirName pi@192.168.2.7:~`. I most often use the options: `rsync -azP ./dirName pi@192.168.2.7:~`, which shows a progress bar and allows a stopped process to continue.

If you would like to read more about rsync, read the full [Digital Ocean guide](https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories-on-a-vps). If you would like to edit specific files and don't need to sync an entire directory, there are several options using SCP for Sublime Text among other editors.

## Configure the Raspberry Pi

The initial password is `raspberry`. Once logged in you will need to run:

```bash
sudo raspi-config
```

Click through the menu options using your arrow keys. You will want to make sure to:

* Expand the file system
* Change password
* Set locale (Internationalisation Options -> Change Locale ->  en_GB.UTF-8 -> then set again as default)
* and any other options you see fit
* Reboot, especially if you changed the filesystem

## Other Useful Tools and Raspberry Pi Notes

### Backup an Entire SD Card

You will use the dd command line tool to convert a given disk (disk2) into a `.img` file. To reach a more sane file size, use gzip or on a Mac, right click on the file and choose the “compress” menu option.

First get the disk number and go to your Desktop or Downloads directory:

```bash
diskutil list
cd ~/Downloads
```

Then use dd, but change the filename to one that makes sense:

```bash
sudo dd if=/dev/rdisk2 of=2016-06-23_Backup.img bs=1m
```

If you need to delete a .img file, use ```rm``` from the command line, otherwise the file system doesn't properly account for the removal of the large file if done through the GUI.

### Keeping the Pi Running Smoothly

You will want to keep the Raspberry Pi up to date. I made a short script that makes this easy. First it checks to make sure that you are using root permission and then does its thing.

```bash
# RPI Update Script
# Written By Kyle King

if [[ $EUID -ne 0 ]]; then
    tput setaf 3; echo "This script needs to be run as root:
    sudo bash update.sh
    "
    exit 1
fi

# Begin by updating the RPI
tput setaf 6; echo "
Searching for out of date packages, installing updates, and cleaning up afterward"
tput setaf 7; echo ""
apt-get update
apt-get upgrade -y # automatic yes to prompts
apt-get dist-upgrade -y
apt-get autoremove && apt-get autoclean
```

The entire file is included in `update.sh`, which I like to store in my `~/bin/` as an executable file. See below for more info on making a file executable and how to add notifications on long script completions.

### Alerting on the End of Long Commands

This [great guide](http://www.pratermade.com/2014/08/use-pushbullet-to-send-notifications-from-your-pi-to-your-phone/) walks through how to use Pushbullet for bash notifications. I summarized and added my own tweaks below:

1. Make a [Pushbullet](https://www.pushbullet.com/) account and install the app wherever you want to get notifications
2. In Pushbullet, go to `Settings`, `Account`, and then click `Create Access Token`.
3. Create a file: `pushbullet` somewhere on your computer (for now):

    ```bash
    #!/bin/bash

    API="<Your Access Token Goes Here>"
    BODY="<Your Raspberry Pi Alert Phrase Here>"
    MSG="$1"

    # Output text as grey
    tput setaf 8; curl -u $API: https://api.pushbullet.com/v2/pushes -d type=note -d title="$MSG" -d body="$BODY"

    # Add some spacing and return to white terminal color
    tput setaf 7; echo '

    '
    ```

4. Test the script, try `bash pushbullet 'IT WORKS!'`
5. If successful, make the script executable from any directory under your user account:

    ```bash
    cp pushbullet ~/bin/pushbullet
    chmod +x ~/bin/pushbullet # or chmod 755 ~/bin/pushbullet
    # now you can call: pushbullet "message text"
    ```

6. **Making a quick reference snippet**. I use the snippet, `; p ` to generate something like: `; pushbullet "Long Script Finished 11:19 AM"`, so I can write: `sleep 2; pushbullet "Long Script Finished 11:20 AM"`. In [Dash](https://kapeli.com/dash), this snippet looks like: `; pushbullet "Long Script Finished @time"` and could easily be added to any snippet manager you use.

### Mastering Bash History

Cherry picked advice from [this guide](https://www.eriwen.com/bash/effective-shorthand/).

1. Edit your .bash_profile or .bashrc by running:

    ```bash
    echo '
    # Modified profile to ignore duplicate history entries on $(date)
    export HISTCONTROL=ignoredups
    " >> ~/.bashrc'
    ```

2. Create an `inputrc` file, which allows you to auto-complete from history on an arrow key press and a any typed characters:

    ```bash
    cd ~
    touch inputrc

    # Then copy and past the below text into the nano editor
    nano inputrc
    ```

    ```bash
    "\eOA": history-search-backward
    "\e[A": history-search-backward
    "\eOB": history-search-forward
    "\e[B": history-search-forward
    "\eOC": forward-char
    "\e[C": forward-char
    "\eOD": backward-char
    "\e[D": backward-char
    ```
