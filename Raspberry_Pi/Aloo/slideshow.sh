# Start FBI Image Viewer:
# From original blog:
# fbi -noverbose -m 640x480 -a -u -t 6 /home/pi/art/**/*
#
# My version to open one particular image
sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/imgs/6.png
# Note: -T opens on tty2 because working on console from my laptop (Source below)
# http://www.linuxquestions.org/questions/linux-general-1/open-images-in-separate-tty-820536/


# NOTES:
# Syncing
# rsync -a /Users/kyleking/Developer/My-Programming-Sketchbook/Raspberry_Pi pi@192.168.2.7:/home/pi

# To run this file, make sure to first set executable permission:
# chmod +x ./slideshow.sh
# Then execute this script:
# bash ./slideshow.sh

# How to kill processes
# ps -ef | grep fbi
# ...from list, pick PID:
# sudo kill -2 1986 or: sudo pkill fbi
# If reset was set to be one second or less, the process will refresh before it can be killed
# To fix, create a longer refresh fbi and kill both processes