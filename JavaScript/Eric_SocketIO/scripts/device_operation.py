# -*- coding: utf-8 -*-
from time import sleep
import sys

# Fake device operation:
counter = 1
while counter <= 6:

    # INSERT RUN DEVICE CODE!
    sleep(2)

    # ------ Kyle's CODE - Don't Touch ------ #
    CSV = 'Completed Step #{0}'
    print CSV.format(counter)
    counter = counter + 1
    # Force buffer to close and send all data to Node application
    sys.stdout.flush()
    # ------ Kyle's CODE - Don't Touch ------ #
