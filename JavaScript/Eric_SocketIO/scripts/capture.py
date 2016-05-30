# -*- coding: utf-8 -*-
import time
import sys
import os
from os import listdir
from os.path import isfile, join

# TAKE PHOTO...sort of
time.sleep(1)

# http://stackoverflow.com/a/3207973
# Get dir down to /scripts/
# print os.path.dirname(os.path.abspath(__file__))
mypath = os.getcwd() + '/public/photos/'
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
# print onlyfiles[2]

counter = 1
publicPath = str(counter) + onlyfiles[2]

os.rename(mypath + '/' + onlyfiles[2], mypath + '/' + publicPath)
print(publicPath)

# Force buffer to close and send all data to Node application
sys.stdout.flush()
