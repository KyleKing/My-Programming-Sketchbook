# fbi -noverbose -m 640x480 -a -u -t 6 /home/pi/art/**/*
# Note: -T opens on tty2 because working on console from my laptop (Source below)
# http://www.linuxquestions.org/questions/linux-general-1/open-images-in-separate-tty-820536/
sudo fbi -a -noverbose -T 4 /home/pi/Raspberry\ Pi/Aloo/imgs/*.png
# sudo fbi -a -noverbose -T 1 /home/pi/Raspberry\ Pi/Aloo/imgs/4.png
