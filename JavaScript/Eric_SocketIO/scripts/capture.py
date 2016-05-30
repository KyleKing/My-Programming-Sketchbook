# -*- coding: utf-8 -*-
from time import sleep
import sys
import os


# INSERT TAKE PHOTO CODE HERE!
sleep(1)


# ------ Kyle's CODE - Don't Touch ------ #
# Accept input arguments
oldFileName = sys.argv[1]
newFileName = sys.argv[2]
# Create unique and incremented filename
mypath = os.getcwd() + '/public/photos/'
os.rename(mypath + '/' + oldFileName, mypath + '/' + newFileName)
print(newFileName)
# Force buffer to close and send all data to Node application
sys.stdout.flush()
# ------ Kyle's CODE - Don't Touch ------ #
