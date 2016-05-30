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

    # Create unique and incremented filename
    counter = 1
    publicPath = line + str(counter) + '.jpg'

    # # Alteratively, just make a random name and hope for the best:
    # import uuid
    # unique_filename = uuid.uuid4()

    # # Make sure path doesn't exist:
    # if os.path.exists("sample%s.xml" % i):
    #     print('Error: path alreaady exists!')

    os.rename(mypath + '/' + line + '.jpg', mypath + '/' + publicPath)
    print(publicPath)

    # Force buffer to close and send all data to Node application
    sys.stdout.flush()
