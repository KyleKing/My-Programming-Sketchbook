# -*- coding: utf-8 -*-

import Adafruit_MAX31855.MAX31855 as MAX31855
import time
import sys
import json

with open('settings.json') as settings:
    data = json.load(settings)

# Hot (Usually Left-Most reader - closest to USB ports)
which = data["wiring"]["Hot"]
DO_hot = int(data["wiring"][which]["DO"])
CS_hot = int(data["wiring"][which]["CS"])
CLK_hot = int(data["wiring"][which]["CLK"])
sensor_hot = MAX31855.MAX31855(CLK_hot, CS_hot, DO_hot)

# # Middle
# which = data["wiring"]["Optional"]
# DO_middle = int(data["wiring"][which]["DO"])
# CS_middle = int(data["wiring"][which]["CS"])
# CLK_middle = int(data["wiring"][which]["CLK"])
# sensor_middle = MAX31855.MAX31855(CLK_middle, CS_middle, DO_middle)

# # Cold (Usually Right-Most reader)
# which = data["wiring"]["Cold"]
# DO_cold = int(data["wiring"][which]["DO"])
# CS_cold = int(data["wiring"][which]["CS"])
# CLK_cold = int(data["wiring"][which]["CLK"])
# sensor_cold = MAX31855.MAX31855(CLK_cold, CS_cold, DO_cold)

# Bad pins for CLK: 16, 21, 6, 5, 13


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
    # temp_hot = calib(sensor_hot.readTempC())
    # internal_hot = calib(sensor_hot.readInternalC())
    # temp_cold = calib(sensor_cold.readTempC())
    # internal_cold = calib(sensor_cold.readInternalC())
    # CSV = '{0:0.3F}, {1:0.3F}, {2:0.3F}, {3:0.3F}'
    # print CSV.format(temp_hot, internal_hot, temp_cold, internal_cold)

    temp_hot = calib(sensor_hot.readTempC())
    internal_hot = calib(sensor_hot.readInternalC())
    CSV = '{0:0.3F}, {1:0.3F}'
    print CSV.format(temp_hot, internal_hot)

    # Force buffer to close and send all data to Node application
    sys.stdout.flush()
    # Check temperature every second
    time.sleep(1.0)
