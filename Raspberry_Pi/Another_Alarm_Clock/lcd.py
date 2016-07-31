# !/usr/bin/python
import sys
# import time
import Adafruit_CharLCD as LCD

# Raspberry Pi pin configuration:
lcd_rs = 24  # 27 - yellow
lcd_en = 25  # 22 - green
lcd_d4 = 12  # 25 - blue
lcd_d5 = 13  # 24 - violet
lcd_d6 = 16  # 23 - grey
lcd_d7 = 19  # 27 - white
lcd_backlight = 4

# Define LCD column and row size for 16x2 LCD.
lcd_columns = 16
lcd_rows = 2

# Initialize the LCD using the pins above.
lcd = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7,
                           lcd_columns, lcd_rows, lcd_backlight)


def full_message(message):
    lcd.clear()
    if len(message) < lcd_columns:
        # Normal Method
        lcd.message(message)
    elif len(message) <= 2 * lcd_columns:
        # Split into two rows
        first_line = message[:lcd_columns]
        second_line = message[lcd_columns:]
        lcd.message(first_line + "\n" + second_line)
    # FIXME # This is a mess...
    # elif len(message) > 2 * lcd_columns:
    #     lcd.message(message)
    #     for i in range(len(message) - lcd_columns):
    #         time.sleep(0.5)
    #         lcd.move_left()
    #     for i in range(len(message) - lcd_columns):
    #         time.sleep(0.5)
    #         lcd.move_right()
    #     return True
    else:
        lcd.message(message)
        return False
    return True

while True:
    line = sys.stdin.readline()
    message = line.rstrip()
    full_message(message)
    print message
    # Force buffer to close and send all data to Node application
    sys.stdout.flush()

# # Manual Tests
# full_message('Very long Message to Test Maximum String Allowed')
# time.sleep(3.0)
# full_message('Really Long Scroll Message')
# time.sleep(3.0)
# full_message('Short Message')
