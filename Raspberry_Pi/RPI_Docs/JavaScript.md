# JavaScript (Node/Meteor) on the Raspberry Pi

## How to install Meteor:

Run the file, `sudo bash install-meteor.sh` and follow the advice printed. The installation is based on the [universal fork of Meteor](https://github.com/4commerce-technologies-AG/meteor).

### Shorthand

To make meteor easier to run, add `"export PATH=$PATH:$HOME/meteor/"`` to your `.bashrc file`

For example:

```bash
echo '
# Modified profile for Meteor Universal Installation on $(date)
export PATH=$PATH:$HOME/meteor/
" >> ~/.bashrc'
```

## Working in JavaScript

### Install and use Node:

```
# Increment this to get a newer/older version:
nodeInstallV=v6.0.0
echo "Installing Node $nodeInstallV:"
wget https://nodejs.org/dist/v6.0.0/node-$nodeInstallV-linux-armv7l.tar.gz
tar -xvf node-$nodeInstallV-linux-armv7l.tar.gz
cd node-$nodeInstallV-linux-armv7l
```

To start playing around with Node right away, try [this easy, on/off demo](https://github.com/fivdi/onoff) and the [associated guide from Adafruit](https://learn.adafruit.com/node-embedded-development?view=all).

![GIF](https://learn.adafruit.com/system/assets/assets/000/021/906/original/raspberry_pi_demo.gif?1448314329)
