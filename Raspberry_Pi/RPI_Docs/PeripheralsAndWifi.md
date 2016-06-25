# Peripherals

<!-- MarkdownTOC depth="6" autolink="true" bracket="round" -->

- [FIXME - Wifi](#fixme---wifi)
- [Pi Camera](#pi-camera)
- [USB Webcam](#usb-webcam)
- [FIXME An Arduino](#fixme-an-arduino)

<!-- /MarkdownTOC -->

## FIXME - Wifi

Using the [Realtek Wireless dongle]()

Basically, plug it in and boot the raspberry pi. There shouldn't be any necessary drivers. To connect to a network, either use the UI (easiest) or the command line, both of which are explained in [this Adafruit guide](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup?view=all).Alternatively, these two guides are equally useful:
[Make Tech Easier](https://www.maketecheasier.com/setup-wifi-on-raspberry-pi/) or an [alternative guide](http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/).

You will need a 2 amp micro USB power supply otherwise you may have a slow or inconsistent connection.

## Pi Camera

[The best guide](https://github.com/raspberrypilearning/guides/blob/master/camera/README.md)

## USB Webcam

```bash
fswebcam -r 1280x720 --no-banner image3.jpg
fswebcam  --no-banner image.jpg
# (/dev/video0)
```

These "how to stream a webcam" guides might be useful:

- Node: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg (Old guide referenced by this post)
- [http://sirlagz.net/2013/01/07/how-to-stream-a-webcam-from-the-raspberry-pi-part-3/](http://sirlagz.net/2013/01/07/how-to-stream-a-webcam-from-the-raspberry-pi-part-3/)
- [https://www.raspberrypi.org/forums/viewtopic.php?f=27&t=14020](https://www.raspberrypi.org/forums/viewtopic.php?f=27&t=14020)

## FIXME An Arduino

*I guess this counts as a peripheral?*

How to Connect an Arduino over Serial
Source -> possible to symlink if trouble identifying multiple devices
http://arduino.stackexchange.com/questions/3680/in-linux-how-to-identify-multiple-arduinos-connected-over-usb

The connected arduino should follow this pattern: /dev/ttyACM0 or /dev/ttyACM1 etc.
Search by running $ ls /dev/ttyACM*
Also useful: “Get to know your RPI”
http://raspberry-pi-guide.readthedocs.org/en/latest/system.html