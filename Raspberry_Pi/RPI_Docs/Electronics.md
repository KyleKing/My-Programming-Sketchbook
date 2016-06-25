# Electronics

<!-- MarkdownTOC depth="6" autolink="true" bracket="round" -->

- [Printable Raspberry Pi Pinout](#printable-raspberry-pi-pinout)
- [Connecting an LED](#connecting-an-led)
- [Thermocouple Sensor \(MAX31855\)](#thermocouple-sensor-max31855)
- [Raspberry Pi PWM](#raspberry-pi-pwm)
- [MOSFETS](#mosfets)
- [Analog to Digital Converter \(ADC\)](#analog-to-digital-converter-adc)

<!-- /MarkdownTOC -->

## Printable Raspberry Pi Pinout

[Printable version](https://github.com/splitbrain/rpibplusleaf)

<p align="center">
  <img width="450" height=auto src="https://www.splitbrain.org/_media/blog/2015-03/gpio.jpg?w=200&tok=ee4ac3">
</p>
<p align="center">The pin diagram in use</p>

## Connecting an LED

(Somehow I always forget this) `Long pin === positive (+)`. Connect the long (+ cathode) leg to source and the short leg (- anode) into ground/resistor (a good [resistor is ~1kΩ](http://www.ladyada.net/learn/arduino/lesson3.html), but keep the current under 15mA).

## Thermocouple Sensor (MAX31855)

Download the library for the [Adafruit Python MAX31855](https://github.com/adafruit/Adafruit_Python_MAX31855)

```bash
cd ~
sudo apt-get install build-essential python-dev python-smbus -y
git clone https://github.com/adafruit/Adafruit_Python_MAX31855.git
cd Adafruit_Python_MAX31855
sudo python setup.py install
```

To use, try this sample Python code:

```python
# -*- coding: utf-8 -*-

import Adafruit_MAX31855.MAX31855 as MAX31855
import time
import sys

# Change the pins to the correct numbers you configured:
DO__one = 25
CS__one = 20
CLK__one = 19
sensor__one = MAX31855.MAX31855(CLK__one, CS__one, DO__one)
# Note: Pins that didn't work as CLK pins: 16, 21, 6, 5, 13


# Linear calibration
def calib(raw):
    calibrated = raw - 5.5
    return calibrated


# Convert Celsius to Fahrenheit
def c_to_f(celsius):
    fahrenheit = celsius * 9.0 / 5 + 32
    return fahrenheit


# Loop printing measurements every second.
while True:
    temp__one = c_to_f(calib(sensor__one.readTempC()))
    internal__one = c_to_f(calib(sensor__one.readInternalC()))
    CSV = '{0:0.3F}, {1:0.3F}'
    print CSV.format(temp__one, internal__one)

    # Force buffer to close and send data
    sys.stdout.flush()
    # Check temperature every second
    time.sleep(1.0)
```

## Raspberry Pi PWM

You will want [Pi-Blaster](https://github.com/sarfata/pi-blaster)

```bash
sudo apt-get install autoconf -y
cd ~
git clone https://github.com/sarfata/pi-blaster.git
cd ~/pi-blaster/
./autogen.sh; ./configure && make
```

To automatically start Pi-Blaster, use: `sudo ~/pi-blaster/pi-blaster`.

To call Pi-Blaster from your node.js app, install the dependency (`npm install pi-blaster.js --save`), then refer to this snippet:

```js
var piblaster = require('pi-blaster.js');
// Available Pins:
// GPIO number   Pin in P1 header
//      4              P1-7
//      17             P1-11
//      18             P1-12
//      21             P1-13
//      22             P1-15
//      23             P1-16
//      24             P1-18
//      25             P1-22

// Example Code
piblaster.setPwm(17, 1.0 ); // 100% brightness
piblaster.setPwm(22, 0.2 ); // 20% brightness
piblaster.setPwm(23, 0 ); // off
```

## MOSFETS

[A brief overview of theory](http://blog.oscarliang.net/how-to-use-mosfet-beginner-tutorial/) and a [basic guide with in process images](http://aruljohn.com/blog/raspberrypi-christmas-lights-rgb-led/). *Note*: it may be useful to use a diode on the drain pin of the MOSFET to protect your circuit, however most common diodes only accept up to 1A.

<p align="center">
  <img width="350" height=auto src="http://aruljohn.com/blog/pix/ChristmasRGBLEDLights_aruljohn.png">
</p>
<p align="center">Basic MOSFET circuit diagram</p>

## Analog to Digital Converter (ADC)

The [Adafruit Guide](https://learn.adafruit.com/reading-a-analog-in-and-controlling-audio-volume-with-the-raspberry-pi?view=all) and my variation of the example code is available at test_ADC.py
