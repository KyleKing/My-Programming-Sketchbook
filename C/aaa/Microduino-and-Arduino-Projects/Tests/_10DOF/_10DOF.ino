// Works! 10DOF + OLED


#include "U8glib.h"

U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);	// HW SPI Com: CS = 10, A0 = 9 (Hardware Pins are  SCK = 13 and MOSI = 11)
//-------Set the font, big, middle and small
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


/*-------fangxiang (direction)------*/
#include "Wire.h"
#include "I2Cdev.h"

#include "HMC5883L.h"
#include "BMP085.h"
#include "MPU6050_6Axis_MotionApps20.h"

MPU6050 mpu;
float x,y,z,cache_x,cache_y,cache_z;
float mpu6050_right,mpu6050_left,mpu6050_up,mpu6050_down;
boolean error=false;

long err1=1;


#define OUTPUT_READABLE_YAWPITCHROLL

#define OUTPUT_TEAPOT


// MPU control/status vars
bool dmpReady = false;  // set true if DMP init was successful
uint8_t mpuIntStatus;   // holds actual interrupt status byte from MPU
uint8_t devStatus;      // return status after each device operation (0 = success, !0 = error)
uint16_t packetSize;    // expected DMP packet size (default is 42 bytes)
uint16_t fifoCount;     // count of all bytes currently in FIFO
uint8_t fifoBuffer[64]; // FIFO storage buffer

// orientation/motion vars
Quaternion q;           // [w, x, y, z]         quaternion container
VectorFloat gravity;    // [x, y, z]            gravity vector
float ypr[3];           // [yaw, pitch, roll]   yaw/pitch/roll container and gravity vector

int mpu_x,mpu_y;

HMC5883L mag;

int16_t mx, my, mz;

#define xXIAO 90

float xHeading,yHeading,zHeading;
int xDegrees,yDegrees,zDegrees;

/*-------gaodu (height)------*/
BMP085 barometer;

float temperature;
float pressure;
float altitude;
int32_t lastMicros;

//==================
unsigned long time1=millis();


void setup ()
{
  Serial.begin(9600);

  u8g.setRot90();

  Wire.begin();

  // initialize serial communication
  // it's really up to you depending on your project)
  Serial.begin(9600);

  // initialize device
  Serial.println("Initializing I2C devices...");
  mag.initialize();
  barometer.initialize();
  mpu.initialize();

  // verify connection
  Serial.println("Testing device connections...");
  Serial.println(mag.testConnection() ? "HMC5883L connection successful" : "HMC5883L connection failed");
  Serial.println(barometer.testConnection() ? "BMP085 connection successful" : "BMP085 connection failed");

  Serial.println(mpu.testConnection() ? F("MPU6050 connection successful") : F("MPU6050 connection failed"));


  Serial.println(F("Initializing DMP..."));
  devStatus = mpu.dmpInitialize();

  // make sure it worked (returns 0 if so)
  if (devStatus == 0) {
    // turn on the DMP, now that it's ready
    Serial.println(F("Enabling DMP..."));
    mpu.setDMPEnabled(true);

    // enable Arduino interrupt detection
    Serial.println(F("Enabling interrupt detection (Arduino external interrupt 0)..."));

    mpuIntStatus = mpu.getIntStatus();

    // set our DMP Ready flag so the main loop() function knows it's okay to use it
    Serial.println(F("DMP ready! Waiting for first interrupt..."));
    dmpReady = true;

    // get expected DMP packet size for later comparison
    packetSize = mpu.dmpGetFIFOPacketSize();
  }
  else {
    // ERROR!
    // 1 = initial memory load failed
    // 2 = DMP configuration updates failed
    // (if it's going to break, usually the code will be 1)
    Serial.print(F("DMP Initialization failed (code "));
    Serial.print(devStatus);
    Serial.println(F(")"));
  }

}

void loop()
{
  vompu6050();
  vobmp085();
  vofangxiang();

  if(millis()-time1>90)
  {
    u8g.firstPage();
    do {
      draw();
    }
    while( u8g.nextPage() );

    time1=millis();
  }


}

void draw() {
  u8g.drawCircle(mpu_x,mpu_y,4);

  u8g.drawLine(0, 44, 63, 44);
  u8g.drawLine(0, 79, 63, 79);
  u8g.drawLine(0, 127, 63, 127);

  setFont_M;
  u8g.setPrintPos(2, 56);
  u8g.print(temperature,1);
  u8g.print("`C");
  u8g.setPrintPos(2, 66);
  u8g.print(pressure/1000,3);
  u8g.print("Kpa");
  u8g.setPrintPos(2, 76);
  u8g.print(altitude,1);
  u8g.print("M");

  //==========FANGXIANG

  float hudu=3.14*(xDegrees/180.0);
  int x,y;
  x=17*sin(hudu);
  y=17*cos(hudu);

#define xqishi 36
#define yqishi 20

  u8g.drawCircle(xqishi,yqishi,20);

  u8g.drawLine(xqishi, yqishi,   xqishi+x, yqishi-y);
  u8g.drawLine(xqishi, yqishi-1,   xqishi+x, yqishi-y);
  u8g.drawLine(xqishi, yqishi+1,   xqishi+x, yqishi-y);
  u8g.drawLine(xqishi-1, yqishi,   xqishi+x, yqishi-y);
  u8g.drawLine(xqishi+1, yqishi,   xqishi+x, yqishi-y);

}


void vofangxiang()
{
  mag.getHeading(&mx, &my, &mz);
  xHeading = atan2(my, mx)/3.141593*180.0;

  xHeading += xXIAO;

  if(xHeading < 0) xHeading += 360;
  if(xHeading > 360) xHeading -= 360;

  xDegrees = xHeading+0.5;
}

void vobmp085()
{
  barometer.setControl(BMP085_MODE_TEMPERATURE);

  // wait appropriate time for conversion (4.5ms delay)
  lastMicros = micros();
  while (micros() - lastMicros < barometer.getMeasureDelayMicroseconds());

  // read calibrated temperature value in degrees Celsius
  temperature = barometer.getTemperatureC();

  // request pressure (3x oversampling mode, high detail, 23.5ms delay)
  barometer.setControl(BMP085_MODE_PRESSURE_3);
  while (micros() - lastMicros < barometer.getMeasureDelayMicroseconds());

  // read calibrated pressure value in Pascals (Pa)
  pressure = barometer.getPressure();

  // calculate absolute altitude in meters based on known pressure
  // (may pass a second "sea level pressure" parameter here,
  // otherwise uses the standard value of 101325 Pa)
  altitude = barometer.getAltitude(pressure);

}

void vompu6050()
{
  // if programming failed, don't try to do anything
  if (!dmpReady) return;

  // wait for MPU interrupt or extra packet(s) available

  // reset interrupt flag and get INT_STATUS byte
  mpuIntStatus = mpu.getIntStatus();

  // get current FIFO count
  fifoCount = mpu.getFIFOCount();

  // check for overflow (this should never happen unless our code is too inefficient)
  if ((mpuIntStatus & 0x10) || fifoCount == 1024) {
    error=true;

    // reset so we can continue cleanly
    mpu.resetFIFO();
    Serial.println(F("FIFO overflow!"));

    // otherwise, check for DMP data ready interrupt (this should happen frequently)
  }
  else if (mpuIntStatus & 0x02) {
    error=false;

    // wait for correct available data length, should be a VERY short wait
    while (fifoCount < packetSize) fifoCount = mpu.getFIFOCount();

    // read a packet from FIFO
    mpu.getFIFOBytes(fifoBuffer, packetSize);

    // track FIFO count here in case there is > 1 packet available
    // (this lets us immediately read more without waiting for an interrupt)
    fifoCount -= packetSize;

    // display Euler angles in degrees
    mpu.dmpGetQuaternion(&q, fifoBuffer);
    mpu.dmpGetGravity(&gravity, &q);
    mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);
    cache_z=ypr[0] * 180/M_PI;
    cache_y=ypr[1] * 180/M_PI;
    cache_x=ypr[2] * 180/M_PI;

  }
  if(!error)
    err1++;
  else
    err1=0;

  if(err1>1)
  {
    x=cache_x;
    y=cache_y;
    z=cache_z;
  }

  //y:85~120
  //x:5~58
  mpu_y=103+map(x, 90, -90, -17, 17);
  mpu_x=31+map(y, 90, -90, -26, 26);
}

