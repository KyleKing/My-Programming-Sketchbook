# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import json
from pprint import pprint
import config as cg
from titlecase import titlecase as titlec

pin_LCD = 17
status_file = 'status.json'


def update_status(new_status, target_file):
    """Print the JSON object, then write to file"""
    pprint(new_status)
    json.dump(new_status, target_file, sort_keys=True, indent=4,
              ensure_ascii=False)


def close():
    cg.send('Closing m_LCD')
    GPIO.cleanup()


def configure():
    cg.send('Configuring m_LCD')
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(pin_LCD, GPIO.OUT)
    GPIO.output(pin_LCD, GPIO.HIGH)
    # Make sure file exists with initial state of on/True
    with open('status.json', 'w') as target_file:
        new_status = {'status': True}
        update_status(new_status, target_file)


def toggle(line):
    # Get previous status:
    with open(status_file, 'r') as target_file:
        new_status = {'status': True}
        prev_status = json.load(target_file)
        new_status['status'] = not prev_status['status']

    # Keep current screen state:
    if titlec(line) == str(prev_status['status']):
        cg.send('Already in desired state (' + str(line) + ')')
        # pprint(prev_status)
    # Toggle LCD State:
    elif titlec(line) == str(new_status['status']):
        cg.send('Updating to desired state from: ' +
                str(prev_status['status']))
        # pprint(prev_status)
        GPIO.output(pin_LCD, GPIO.LOW)
        time.sleep(0.75)
        with open(status_file, 'w') as target_file:
            update_status(new_status, target_file)
    # Deal with gibberish:
    else:
        cg.send("Warning, unknown requested state:")
        cg.send(line)

    GPIO.output(pin_LCD, GPIO.HIGH)
    time.sleep(3)
