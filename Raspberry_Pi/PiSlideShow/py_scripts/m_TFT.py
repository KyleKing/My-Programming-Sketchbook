# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import json
from pprint import pprint
import config as cg
from titlecase import titlecase as titlec

pin_TFT = 17
status_file = 'status.json'


def update_status(new_status, target_file):
    """Print the JSON object, then write to file"""
    pprint(new_status)
    json.dump(new_status, target_file, sort_keys=True, indent=4,
              ensure_ascii=False)


def configure():
    cg.send('Configuring m_TFT')
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(pin_TFT, GPIO.OUT)
    GPIO.output(pin_TFT, GPIO.HIGH)
    with open('status.json', 'w') as target_file:
        new_status = {'status': True}
        update_status(new_status, target_file)
    cg.send('< DONE configuring m_TFT')


def toggle(line):
    # Get previous status:
    with open(status_file, 'r') as target_file:
        new_status = {'status': True}
        prev_status = json.load(target_file)
        new_status['status'] = not prev_status['status']

    if titlec(line) == str(prev_status['status']):
        # Keep current screen state:
        # pprint(prev_status)
        cg.send('Already in desired state (' + str(line) + ')')
    elif titlec(line) == str(new_status['status']):
        # Toggle TFT State:
        cg.send('Updating to desired state from: ' +
                str(prev_status['status']))
        # pprint(prev_status)
        GPIO.output(pin_TFT, GPIO.LOW)
        time.sleep(0.75)
        with open(status_file, 'w') as target_file:
            update_status(new_status, target_file)
    else:
        # Deal with gibberish:
        cg.send("Error: unknown state: " + line)

    GPIO.output(pin_TFT, GPIO.HIGH)
    time.sleep(5)
    cg.send('< DONE toggling m_TFT state')


def close():
    GPIO.cleanup()
    cg.send('< DONE closing m_TFT')
