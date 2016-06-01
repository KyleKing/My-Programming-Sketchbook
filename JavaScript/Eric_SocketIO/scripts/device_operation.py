# -*- coding: utf-8 -*-
from time import sleep
import sys


# ------ Kyle's CODE - Don't Touch ------ #
def log_to_web_app(counter):
    CSV = 'Completed Step #{0}'
    print CSV.format(counter)
    # Force buffer to close and send all data to Node application
    sys.stdout.flush()
    return 'true'

# Fake device operation:
counter = 0
while counter <= 5:
    counter = counter + 1
# ------ Kyle's CODE - Don't Touch ------ #

    # INSERT RUN DEVICE CODE!
    sleep(1)

    # Tell Kyle's code a step was completed!
    log_to_web_app(counter)
