#ifndef LCD_H_
#define LCD_H_

void configurationLoop();
void LCDprint(uint8_t i);
void lcd_telemetry();
void initLCD();
void i2c_OLED_DIGOLE_init ();
void i2c_OLED_init();
void LCDclear();
void toggle_telemetry(uint8_t t);
void dumpPLog(uint8_t full);

#endif /* LCD_H_ */

