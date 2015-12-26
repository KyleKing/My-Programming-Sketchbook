//1. Screen display setting=============================
#include "U8glib.h"
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);        // HW SPI Com: CS = 10, A0 = 9 (Hardware Pins are  SCK = 13 and MOSI = 11)
//-------Set font size, big, middle and small
#define setFont_L u8g.setFont(u8g_font_7x13)
#define setFont_M u8g.setFont(u8g_font_fixed_v0r)
#define setFont_S u8g.setFont(u8g_font_chikitar)
/*
font:
 u8g.setFont(u8g_font_7x13)
 u8g.setFont(u8g_font_fixed_v0r);
 u8g.setFont(u8g_font_chikitar);
 u8g.setFont(u8g_font_osb21);
 */
//1.Screen display setting=============================

#define INTERVAL_LCD             100
#define INTERVAL_SENSOR          500

unsigned long lcd_time=millis();
unsigned long sensor_time=millis();

//2.Sensor setting================================
#include <Wire.h>
#include "I2Cdev.h"
//Temperature and humidity
#include <AM2321.h>
AM2321 am2321;
//Air pressure
#include "BMP085.h"
BMP085 barometer;
//Light
#include <Adafruit_Sensor.h>
#include <Adafruit_TSL2561_U.h>
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_LOW, 12345);
//2.Sensor setting================================

//3. Define the sensor variable
float sensor_tem,sensor_hum,sensor_alt,sensor_pre,sensor_lux; //Temperature, humidity,altitude,air pressure and light

void setup(void)
{
  //  u8g.setRot180();
  //-------------------------------------------------------
  Serial.begin(115200);
  //Initialize air pressure
  barometer.initialize();
  Serial.println(barometer.testConnection() ? "BMP085 connection successful" : "BMP085 connection failed");

  //Initialize light
  Serial.println(tsl.begin() ? "TSL2561 connection successful" : "TSL2561 connection failed");
  tsl.enableAutoGain(true);          /* Auto-gain ... switches automatically between 1x and 16x */
  tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_13MS);      /* fast but low resolution */

  //Delay 500ms
  delay(500);
}

void loop(void)
{
  if (sensor_time > millis()) sensor_time = millis();
  if(millis()-sensor_time>INTERVAL_SENSOR)
  {
    //Get the temperature and humidity
    {
      am2321.read();
      sensor_tem=am2321.temperature/10.0;
      sensor_hum=am2321.humidity/10.0;
    }

    //Get the air pressure and altitude
    {
      barometer.setControl(BMP085_MODE_TEMPERATURE);
      // wait appropriate time for conversion (4.5ms delay)
      unsigned long lastMicros = micros();
      while (micros() - lastMicros < barometer.getMeasureDelayMicroseconds());
      // read calibrated temperature value in degrees Celsius
      barometer.getTemperatureC();
      // request pressure (3x oversampling mode, high detail, 23.5ms delay)
      barometer.setControl(BMP085_MODE_PRESSURE_3);
      while (micros() - lastMicros < barometer.getMeasureDelayMicroseconds());
      // read calibrated pressure value in Pascals (Pa)
      sensor_pre = barometer.getPressure();

      // calculate absolute altitude in meters based on known pressure
      // (may pass a second "sea level pressure" parameter here,
      // otherwise uses the standard value of 101325 Pa)
      sensor_alt = barometer.getAltitude(sensor_pre);
      // that is equal to 101500 Pascals.
    }

    //Get the light
    {
      sensors_event_t event;
      tsl.getEvent(&event);

      /* Display the results (light is measured in lux) */
      if (event.light)
        sensor_lux=event.light;
      else
        Serial.println("Sensor overload");
    }
    sensor_time=millis();
  }


  //Refresh the screen
  if (lcd_time > millis()) lcd_time = millis();
  if(millis()-lcd_time>INTERVAL_LCD)
  {
    volcd();
    lcd_time=millis();
  }
}

//===================================

void volcd()
{
  u8g.firstPage();
  do {
    setFont_L;

    u8g.setPrintPos(0, 15*1);
    u8g.print(sensor_tem ,1);
    u8g.print(" `C");
    u8g.print(" ");
    u8g.print(sensor_hum ,1);
    u8g.print(" %");

    u8g.setPrintPos(0, 15*2);
    u8g.print(sensor_pre/1000.0 ,3);
    u8g.print(" kPa");
    u8g.setPrintPos(0, 15*3);
    u8g.print(sensor_alt ,1);
    u8g.print(" Meters");

    u8g.setPrintPos(0, 15*4);
    u8g.print(sensor_lux ,1);
    u8g.print(" Lux");
  }
  while( u8g.nextPage() );
}
