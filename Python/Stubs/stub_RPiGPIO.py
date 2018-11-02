"""Stub the RPi.GPIO public methods."""

import logging

import log

logger = log.init_logger(logging.getLogger(__name__), 'RPi.GPIO.log')

# Public Variables
BCM = 'BCM'
HIGH = 'HIGH'
LOW = 'LOW'
IN = 'IN'
OUT = 'OUT'
RISING = 'RISING'


def setwarnings(state):
    logger.debug('setwarnings to:{}'.format(state))


def setmode(mode):
    logger.debug('Set RPi Mode as:{}'.format(mode))


def setup(pin, value):
    logger.debug('Pin:{} Set As:{}'.format(pin, value))


def output(pin, value):
    logger.debug('Pin:{} Set To:{}'.format(pin, value))


def input(pin):
    logger.debug('Reading Pin:{}'.format(pin))
    return True


def add_event_detect(pin, type, callback, bouncetime=100):
    logger.debug("""Adding event detection for: Pin:{} Type:{} bounce:{}
func:{}""".format(pin, type, callback, bouncetime))


def remove_event_detect(pin):
    logger.debug('Removing event detection for Pin:{}'.format(pin))


def cleanup():
    pass
