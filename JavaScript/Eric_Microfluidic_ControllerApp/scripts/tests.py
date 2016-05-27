# -*- coding: utf-8 -*-
import time
import sys

counter = 1

# Loop printing measurements every second.
while counter <= 6:
    time.sleep(2)
    CSV = 'Completed Step #{0}'
    print CSV.format(counter)
    counter = counter + 1

    # Force buffer to close and send all data to Node application
    sys.stdout.flush()
