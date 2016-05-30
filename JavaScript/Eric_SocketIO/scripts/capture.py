# -*- coding: utf-8 -*-
from time import sleep
import sys
import os
# from os import listdir
# from os.path import isfile, join

# Accept STDIN
for line in sys.argv[1:]:
    # print(line)

    # TAKE PHOTO...sort of
    sleep(1)

    # http://stackoverflow.com/a/3207973
    # # Get dir path down to /scripts/
    # print os.path.dirname(os.path.abspath(__file__))
    # # But only need CWD on Node.js app:
    mypath = os.getcwd() + '/public/photos/'

    # # Get all filenames in directory:
    # onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    # print onlyfiles[2]

    # Create unqiue and incremented filename
    counter = 1
    publicPath = line + str(counter) + '.jpg'

    os.rename(mypath + '/' + line + '.jpg', mypath + '/' + publicPath)
    print(publicPath)

    # Force buffer to close and send all data to Node application
    sys.stdout.flush()
