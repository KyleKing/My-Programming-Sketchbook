"""Stub the Adafruit_CharLCD public methods."""

import logging

import log

logger = log.init_logger(logging.getLogger(__name__), 'RPi.GPIO.log')


class Adafruit_CharLCD(object):

    def __init__(self, lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7, lcd_columns, lcd_rows, lcd_backlight, gpio):
        pass

    def message(self, msg):
        logger.debug('New Message:`{}`'.format(msg))

    def clear(self):
        logger.debug('Cleared LCD')

