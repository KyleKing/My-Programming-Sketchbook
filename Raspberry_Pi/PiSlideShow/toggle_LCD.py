# -*- coding: utf-8 -*-
import sys
import RPi.GPIO as GPIO
import time
import json
from pprint import pprint

print "Initializing LCD Toggle Script"
sys.stdout.flush()

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
pin_LCD = 17
GPIO.setup(pin_LCD, GPIO.OUT)
GPIO.output(pin_LCD, GPIO.HIGH)


def update_status(new_status, target_file):
    """Print the JSON object, then write to file"""
    pprint(new_status)
    sys.stdout.flush()
    json.dump(new_status, target_file, sort_keys=True, indent=4,
              ensure_ascii=False)


# Make sure file exists with initial state of on/True
status_file = 'status.json'
with open('status.json', 'w') as target_file:
    new_status = {'status': True}
    update_status(new_status, target_file)

line = ' '
while line:
    line = sys.stdin.readline().strip()
    print 'Received: ' + line
    sys.stdout.flush()

    # Get previous status:
    with open(status_file, 'r') as target_file:
        new_status = {'status': True}
        prev_status = json.load(target_file)
        new_status['status'] = not prev_status['status']

    # Keep current screen state:
    if line == str(prev_status['status']):
        print 'Already in desired state (' + str(line) + ')'
        # pprint(prev_status)
    # Toggle LCD State:
    elif line == str(new_status['status']):
        print 'Updating to desired state from: ' + str(prev_status['status'])
        # pprint(prev_status)
        GPIO.output(pin_LCD, GPIO.LOW)
        time.sleep(0.75)
        with open(status_file, 'w') as target_file:
            update_status(new_status, target_file)
    # Deal with gibberish:
    else:
        print "Warning, unknown requested state:"
        print line

    sys.stdout.flush()
    GPIO.output(pin_LCD, GPIO.HIGH)
    time.sleep(3)

GPIO.cleanup()
