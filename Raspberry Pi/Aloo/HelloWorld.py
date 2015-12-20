# May not work without overwriting the SD use of the LED?

#!/usr/bin/python

import RPi.GPIO as GPIO
from time import sleep

LED_PIN = 16


def blink(pin):
    GPIO.output(pin, GPIO.HIGH)
    print " ---> On"
    sleep(.5)
    GPIO.output(pin, GPIO.LOW)
    print " ---> Off"
    sleep(.5)
    return

# # to use Raspberry Pi board pin numbers
# GPIO.setmode(GPIO.BOARD)

# Needs to be BCM. GPIO.BOARD lets you address GPIO ports by peripheral
# connector pin number, and the LED GPIO isn't on the connector
GPIO.setmode(GPIO.BCM)
# set up GPIO output channel
GPIO.setup(LED_PIN, GPIO.OUT)
for _ in range(0, 3):
    blink(LED_PIN)
GPIO.cleanup()
