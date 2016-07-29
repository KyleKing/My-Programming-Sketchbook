# -*- coding: utf-8 -*-

import time
import sys


# convert Celsius to Fahrenheit
def c_to_f(celsius):
    fahrenheit = celsius * 9.0 / 5 + 32
    return fahrenheit


# Loop printing measurements every second.
while True:

    CSV = '{0:0.3F}, {1:0.3F}, {2:0.3F}, {3:0.3F}'
    print CSV.format(40, 40, 30, 30)

    # Force buffer to close and send all data to Node application
    sys.stdout.flush()
    # Check temperature every second
    time.sleep(1.0)
