//==========================
#define PIN_LED1 5	//LED1
#define PIN_LED2 6	//LED2
#define PIN_key1 A6	//按键1
//==========================
#define init_oled 600			//OLED刷新时间
#define init_oled_updata 2000	//按键动作时，提示持续时间
#define init_updata 500			//gps数据刷新时间
#define init_sdwrite 3000		//SD卡写入间隔
unsigned long time_oled = millis();
unsigned long time_oled_updata = millis();
unsigned long timer = millis();
unsigned long time_sdwrite = millis();

boolean b_oled_updata=false;	//按键动作触发OLED

//key=========================
boolean key1;			//按键
boolean key1_cache;		//检测按键松开缓存

//==========================
boolean STA;	//GPS状态

float f_latitude,f_longitude;	//经纬度
char c_lat,c_lon;		//经纬极向

int itime[3];	//时间
int idate[3];	//日期

float f_Speed;	//速度
int i_Speed[2];	//速度格式化

float f_Height;	//海拔

int i_satellites;	//卫星数

float f_fixquality;	//信号质量


//PKJ=======================================
#define num_name 13		//文件名字长

char file_name[num_name]="";	//文件名
String file_name_cache ="";		//文件名缓存

boolean file_updata;		//是否更新新的GPX文件
boolean sd_sta,file_sta;	//SD卡状态、文件状态
int file_num;				//文件名后两位序号

int idate_cache;			//日期（日）缓存


//oled=======================================
#include <U8glib.h>
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);	// HW SPI Com: CS = 10, A0 = 9 (Hardware Pins are  SCK = 13 and MOSI = 11)

//-------字体设置，大、中、小
#define setFont_L  u8g.setFont(u8g_font_courB14)
#define setFont_M u8g.setFont(u8g_font_fixed_v0r)
#define setFont_S u8g.setFont(u8g_font_chikitar)
/*
font:
 u8g.setFont(u8g_font_7x13)
 u8g.setFont(u8g_font_fixed_v0r);
 u8g.setFont(u8g_font_chikitar);
 u8g.setFont(u8g_font_osb21);
 */

#define u8g_logo_width 128
#define u8g_logo_height 18

const unsigned char u8g_logo_bits[] U8G_PROGMEM =
{
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x01, 0xE0,
  0x03, 0x00, 0x00, 0x00, 0x00, 0x7E, 0x00, 0xF0, 0x01, 0x00, 0x00, 0x00,
  0x00, 0xFE, 0xF9, 0xF7, 0x07, 0x00, 0x00, 0x00, 0x00, 0x3C, 0x00, 0xF8,
  0x03, 0x00, 0x00, 0x00, 0x00, 0xFC, 0xF9, 0xE1, 0x03, 0x00, 0x00, 0x00,
  0x00, 0x38, 0x00, 0xF0, 0x01, 0x00, 0x00, 0x00, 0x00, 0xFC, 0xFF, 0x01,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x38, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0xFC, 0xEF, 0xF9, 0x8F, 0xD7, 0x73, 0xF1, 0xC1, 0x3B, 0x9F, 0xFF,
  0xFF, 0x1E, 0x3E, 0x00, 0x00, 0xBC, 0xEF, 0xC1, 0xE1, 0x9F, 0xFF, 0xDD,
  0xE3, 0x3F, 0xCC, 0xE1, 0xF0, 0xBF, 0x7B, 0x00, 0x00, 0x3C, 0xF7, 0xE1,
  0xE1, 0x9F, 0xFF, 0xC6, 0xF7, 0x3E, 0x8E, 0xF3, 0xF0, 0xFF, 0xF8, 0x00,
  0x00, 0x3C, 0xF3, 0xE1, 0xF1, 0x93, 0xFF, 0xE6, 0xF7, 0x3C, 0x8F, 0xF7,
  0xF0, 0xFF, 0xFC, 0x00, 0x00, 0x7C, 0xF2, 0xE1, 0xF1, 0x83, 0x87, 0xFE,
  0xF7, 0x39, 0xFF, 0xF7, 0xF0, 0xFF, 0xFF, 0x00, 0x00, 0x7C, 0xF0, 0xE3,
  0xF3, 0xA3, 0x03, 0xFE, 0xF7, 0x3F, 0xFF, 0xF7, 0x71, 0xFC, 0xFF, 0x00,
  0x00, 0x7C, 0xF8, 0xE3, 0xF3, 0xBF, 0x03, 0xFE, 0xE3, 0x3F, 0xFF, 0xF3,
  0x71, 0xDC, 0x7F, 0x00, 0x00, 0x7E, 0xFC, 0xE7, 0xE3, 0xBF, 0x03, 0xFC,
  0xE3, 0x3F, 0xFE, 0xF3, 0x71, 0x9C, 0x7F, 0x00, 0x00, 0xC1, 0x03, 0xF8,
  0xCF, 0xE7, 0x0F, 0xF0, 0x00, 0x7F, 0xFC, 0xFC, 0xFF, 0x3E, 0x1E, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};

//==========================
#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>
Adafruit_GPS GPS(&Serial);

// Set GPSECHO to 'false' to turn off echoing the GPS data to the Serial console
// Set to 'true' if you want to debug and listen to the raw GPS sentences
#define GPSECHO false


//lat_lon_transform================================
void lat_lon_transform()
{
  f_latitude=(int(f_latitude)/100)+((int(f_latitude)%100)/60.0)+((f_latitude-int(f_latitude))/60.0);
  if(c_lat=='S')		//南纬
    f_latitude=-f_latitude;

  //---------------------------------

  f_longitude=(int(f_longitude)/100)+((int(f_longitude)%100)/60.0)+((f_longitude-int(f_longitude))/60.0);
  if(c_lon=='W')		//西经
    f_longitude=-f_longitude;
}

// FileName_StringtoChar================================
void  vostring()
{
  String s_file_name="";

  for(int a=0;a<3;a++)
  {
    if(idate[a]<10)
      s_file_name+="0";
    s_file_name+=idate[a];
  }
  if(file_num<10)
    s_file_name+="0";
  s_file_name+=file_num;
  s_file_name+=".gpx";

  for(int a=0;a<(num_name-1);a++)
  {
    file_name[a]=s_file_name[a];
  }
}

//GPS========================================
void vogps_databegin()
{
  digitalWrite(PIN_LED2,true);	//LED2亮：GPS开始读取

  char c = GPS.read();
  // if you want to debug, this is a good time to do it!
  // if a sentence is received, we can check the checksum, parse it...
  if (GPS.newNMEAreceived()) {
    // a tricky thing here is if we print the NMEA sentence, or data
    // we end up not listening and catching other sentences!
    // so be very wary if using OUTPUT_ALLDATA and trytng to print out data
    if (!GPS.parse(GPS.lastNMEA())) // this also sets the newNMEAreceived() flag to false
      return; // we can fail to parse a sentence in which case we should just wait for another
  }

  digitalWrite(PIN_LED2,false);	//LED2灭：GPS结束读取
}

void vogps_dataread()
{
  if (timer > millis()) timer = millis();
  if (millis() - timer > init_updata)
  {
    timer = millis(); // reset the timer

    itime[0]=GPS.hour;
    itime[1]=GPS.minute;
    itime[2]=GPS.seconds;

    idate[0]=GPS.year;
    idate[1]=GPS.month;
    idate[2]=GPS.day;

    f_fixquality=GPS.fixquality;	//信号质量
    STA=GPS.fix;					//GPS定位状态

    if (STA)		//当GPS定位上
    {
      f_latitude=GPS.latitude;
      f_longitude=GPS.longitude;
      c_lat=GPS.lat;
      c_lon=GPS.lon;

      lat_lon_transform();		//经纬度转化

      f_Speed=1.852*GPS.speed;			//速度转化
      i_Speed[0]=int(f_Speed*10)%10;	//速度格式化
      i_Speed[1]=int(f_Speed);			//速度格式化

      f_Height=GPS.altitude;			//海拔

      i_satellites=GPS.satellites;      //卫星数

    }
  }
}


//OLED===================================================
void vooled()
{
  if (time_oled > millis()) time_oled = millis();
  if(millis()-time_oled>init_oled)
  {
    u8g.firstPage();
    do
    {
      draw();
    }
    while( u8g.nextPage() );
    time_oled=millis();
  }
}

void volcdlogo(unsigned int x, unsigned int y)
{
  u8g.firstPage();
  do
  {
    u8g.drawXBMP( x, y, u8g_logo_width, u8g_logo_height, u8g_logo_bits);
  }
  while( u8g.nextPage() );
}

void draw(void)
{
  setFont_L;

  u8g.setPrintPos(2, 18);

  u8g.print("Speed:");
  if(STA)
  {
    u8g.print(i_Speed[1]);
    setFont_M;
    u8g.print(".");
    u8g.print(i_Speed[0]);
  }
  else
  {
    u8g.print("N/A");
    setFont_M;
  }

  u8g.setPrintPos(2, 32);
  u8g.print("Lat.: ");
  u8g.print( c_lat);
  u8g.print(" ");
  u8g.print( f_latitude,4);

  u8g.setPrintPos(2, 41);
  u8g.print("Lon.: ");
  u8g.print( c_lon);
  u8g.print(" ");
  u8g.print(f_longitude,4);


  u8g.drawLine(0, 44, 128, 44);

  u8g.drawLine(0, 55, 128, 55);

  u8g.setPrintPos(2, 53);
      u8g.print("20");
      u8g.print(idate[0]);
      u8g.print("-");
      u8g.print(idate[1]);
      u8g.print("-");
      u8g.print(idate[2]);

      u8g.print("  ");
      u8g.print(itime[0]);
      u8g.print(":");
      u8g.print(itime[1]);
      u8g.print(":");
      u8g.print(itime[2]);

  for(int a=0;a<3;a++)
  {
    u8g.drawFrame(2+(5*a), 61-(a*2), 4, 3+(a*2));
  }
  for(int a=0;a<f_fixquality+1;a++)
  {
    u8g.drawBox(2+(5*a), 61-(a*2), 4, 3+(a*2));
  }

  u8g.setPrintPos(72, 64);
  u8g.print("ELE.:");
  u8g.print(int(f_Height));

  u8g.setPrintPos(20, 64);
  u8g.print("Sat.:");
  u8g.print(i_satellites);
}


void setup()
{
  GPS.begin(38400);

  pinMode(PIN_key1,INPUT_PULLUP); 		//上拉

  pinMode(PIN_LED1,OUTPUT); 		//LED
  pinMode(PIN_LED2,OUTPUT); 		//LED


  //  u8g.setRot180();
  volcdlogo(0, 10);
  delay(2000);
}


void loop()
{

  //GPS-------------------------------
  vogps_databegin();

  vogps_dataread();


  //OLED-------------------------------
  vooled();
}


