//==========================
#define PIN_LED1 5	//LED1
#define PIN_LED2 6	//LED2
#define PIN_key1 4	//Button 1
//==========================
#define init_oled 600			//OLED refresh timer
#define init_oled_updata 2000	//When button has action, use to keep the timer
#define init_updata 500			//gps data refresh timer 
#define init_sdwrite 3000		//SD card write interval
unsigned long time_oled = millis(); 
unsigned long time_oled_updata = millis();
unsigned long timer = millis();
unsigned long time_sdwrite = millis();

boolean b_oled_updata=false;	//Button action triggers the OLED

//key=======================
boolean key1;			//Button
boolean key1_cache;		//Button free cache

//==========================
boolean STA;	//GPS state

float f_latitude,f_longitude;	//Latitude and longitude
char c_lat,c_lon;		//Latitude and longitude's direction

int itime[3];	//Time
int idate[3];	//Date

float f_Speed;	//Speed
int i_Speed[2];	//Speed format

float f_Height;	//Altitude

int i_satellites;	//The number of satellite

float f_fixquality;	//Signal quality


//PKJ=======================================
#define num_name 13		//File name length

char file_name[num_name]="";	//File name
String file_name_cache ="";     //File name cache

boolean file_updata;		//Update GPX file flag
boolean sd_sta,file_sta;	//SD card state and file state
int file_num;			//After file name with two serial number

int idate_cache;		//Data cache


//oled=======================================
#include <U8glib.h>
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);	// HW SPI Com: CS = 10, A0 = 9 (Hardware Pins are  SCK = 13 and MOSI = 11)

//-------Set font size, big, middle and small
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
Adafruit_GPS GPS(&Serial1);

// Set GPSECHO to 'false' to turn off echoing the GPS data to the Serial console
// Set to 'true' if you want to debug and listen to the raw GPS sentences
#define GPSECHO false

//SD=======================================
#include <SD.h>

File myFile;

//EEPROM====================================
#include <EEPROM.h>
#define EEPROM_write(address, p) {int i = 0; byte *pp = (byte*)&(p);for(; i < sizeof(p); i++) EEPROM.write(address+i, pp[i]);}
#define EEPROM_read(address, p)  {int i = 0; byte *pp = (byte*)&(p);for(; i < sizeof(p); i++) pp[i]=EEPROM.read(address+i);}

struct config_type
{
  long l_long;
  float f_float;
  int i_int_idate;			//Data cache
  int i_int_num;			//File sequence 
  char c_char[num_name];	//File name
};

void eeprom_read()
{
  Serial.println(" ");
  Serial.println("===EEPROM===");

  config_type config_readback;
  EEPROM_read(0, config_readback);		//Read from address 0

  // 4) Read the data from serial port

  idate_cache=config_readback.i_int_idate;	//Read the data cache from EEPROM
  file_num=config_readback.i_int_num;		//Read file sequence from EEPROM

  for(int a=0;a<(num_name-1);a++)			//Read file name from EEPROM
  {
    file_name[a]=config_readback.c_char[a];
  }

  file_name_cache=file_name;		//Start file name cache

  Serial.print("=== EEPROM file_name:");
  Serial.println(file_name);
  Serial.print("=== EEPROM file_num:");
  Serial.println(file_num);
  Serial.print("=== EEPROM idate_cache:");
  Serial.println(idate_cache);


  Serial.println("=== EEPROM Complete===");
  Serial.println(" ");
}  

void eeprom_write()
{
  config_type config;

  config.l_long=9999999;
  config.f_float = 3.14;
  config.i_int_idate = idate_cache;		//Set value: date
  config.i_int_num = file_num;			//Set value: file sequence
  strcpy(config.c_char, file_name);		//Set value: file name

  EEPROM_write(0, config);		//Write from address 0
}

//lat_lon_transform================================
void lat_lon_transform()
{
  f_latitude=(int(f_latitude)/100)+((int(f_latitude)%100)/60.0)+((f_latitude-int(f_latitude))/60.0);
  if(c_lat=='S')		//South latitude
    f_latitude=-f_latitude;

  //---------------------------------

  f_longitude=(int(f_longitude)/100)+((int(f_longitude)%100)/60.0)+((f_longitude-int(f_longitude))/60.0);
  if(c_lon=='W')		//West longitude
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

//KEY==========================================
void vokey()
{
  key1=digitalRead(PIN_key1);

  if(key1 && key1_cache)		//Press the button and then free it
  {
    file_updata=true;
    delay(5);
  }

  key1_cache=!key1;		//check the cache
}

//GPS========================================
void vogps_databegin()
{
  digitalWrite(PIN_LED2,true);	//LED2 light£ºGPS starts read data

  char c = GPS.read();
  // if you want to debug, this is a good time to do it!
  if (GPSECHO)
    if (c) Serial.print(c);
  // if a sentence is received, we can check the checksum, parse it...
  if (GPS.newNMEAreceived()) {
    // a tricky thing here is if we print the NMEA sentence, or data
    // we end up not listening and catching other sentences!
    // so be very wary if using OUTPUT_ALLDATA and trytng to print out data
    //    Serial.println(GPS.lastNMEA()); // this also sets the newNMEAreceived() flag to false
    if (!GPS.parse(GPS.lastNMEA())) // this also sets the newNMEAreceived() flag to false
      return; // we can fail to parse a sentence in which case we should just wait for another
  }

  digitalWrite(PIN_LED2,false);	//LED2 off£ºGPS reading end
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

    f_fixquality=GPS.fixquality;	//Signal quality
    STA=GPS.fix;					//GPS positioning state

    /*
    Serial.print("int Time: ");
     Serial.print(itime[0]);
     Serial.print(":");
     Serial.print(itime[1]);
     Serial.print(":");
     Serial.print(itime[2]);
     Serial.println(" ");
     */

    Serial.println("=== GPS READ ===");

    Serial.print("=== GPS Time: ");
    Serial.print(GPS.hour, DEC); 
    Serial.print(':');
    Serial.print(GPS.minute, DEC); 
    Serial.print(':');
    Serial.print(GPS.seconds, DEC); 
    Serial.print('.');
    Serial.println(GPS.milliseconds);
    Serial.print("=== GPS Date: ");
    Serial.print(GPS.day, DEC); 
    Serial.print('/');
    Serial.print(GPS.month, DEC); 
    Serial.print("/20");
    Serial.println(GPS.year, DEC);
    Serial.print("=== GPS Fix: "); 
    Serial.print((int)GPS.fix);
    Serial.print(" quality: "); 
    Serial.println((int)GPS.fixquality);

    if (STA)		//GPS position on
    {
      f_latitude=GPS.latitude;
      f_longitude=GPS.longitude;
      c_lat=GPS.lat;
      c_lon=GPS.lon;

      lat_lon_transform();		//Latitude and longitude conversion

      f_Speed=1.852*GPS.speed;			//Speed conversion
      i_Speed[0]=int(f_Speed*10)%10;	//Speed format
      i_Speed[1]=int(f_Speed);			//Speed format

      f_Height=GPS.altitude;			//Altitude

      i_satellites=GPS.satellites;      //satellite number

      Serial.println(" ");

      Serial.print("=== GPS lat/lon data: ");
      Serial.print(f_latitude,6);
      Serial.print("   ");
      Serial.print(f_longitude,6);
      Serial.println(" "); 
      Serial.print("=== GPS f_Speed: ");
      Serial.print(f_Speed,1);
      Serial.println(" ");
      Serial.print("=== GPS Altitude: "); 
      Serial.print(GPS.altitude);
      Serial.println(" ");
      Serial.print("=== GPS Satellites: "); 
      Serial.println((int)GPS.satellites);

      Serial.println("=== GPS READ Complete === ");
      Serial.println(" ");

      /*
      Serial.print("Location: ");
       Serial.print(GPS.latitude, 4); 
       Serial.print(GPS.lat);
       Serial.print(", ");
       Serial.print(GPS.longitude, 4); 
       Serial.println(GPS.lon);
       Serial.print("Speed (knots): "); 
       Serial.println(GPS.speed);
       Serial.print("Angle: "); 
       Serial.println(GPS.angle);
       */
    }
  }
}

//SD==========================================
void vosdbegin(char* name_cache)		//SD card file check
{
  Serial.println(" ");
  Serial.println("=== SD BEGIN ===");
  if (SD.exists(name_cache)) 	//SD card has the existing file
  {
    Serial.println("=== SD exists.OK");
    file_sta=true;    
  }
  else 							//SD card doesn't have the file
  {
    Serial.println("=== SD exist.ERROR");

    Serial.println("=== SD Creating NEW.HEAD...");
    vosdwrite(file_name,'H');	//Creat new file 
//    vosdread(file_name);

    Serial.println("  ");
    Serial.print("=== SD The NUM ");
    Serial.print(file_num);
    Serial.print(" File:");
    Serial.print(file_name);
    Serial.print(" is ");
    Serial.print("Create");
    Serial.println("  ");

    // open a new file and immediately close it:

    if (SD.exists(name_cache)) 	//Check the existing file again
    {
      Serial.println("=== SD exists.OK");
      file_sta=true;    
    }
    else 
    {
      Serial.println("=== SD exist.ERROR");
      file_sta=false;    
    }
  }

  Serial.println(" ");
  Serial.println("===SD BEGIN Complete===");
}

void vosdread(char* name_cache)		//Read file from SD card
{
  Serial.println(" ");
  Serial.println("=== SD READ ===");

  myFile = SD.open(name_cache);		//Read the finished file
  if (myFile) 						
  {
    // read from the file until there's nothing else in it:
    while (myFile.available()) {
      Serial.write(myFile.read());	//Serial port output
    }
    myFile.close();					//End
  } 
  else 								//can't find the file
  {
    Serial.println("=== SD error opening test.");
  }
  Serial.println("=== SD READ Complete ===");
  Serial.println(" ");
}

void vosdwrite(char* name_cache,char choose)		//Write the fiel to SD card
{
  Serial.println(" ");
  Serial.println("=== SD WRITE ===");

  myFile = SD.open(name_cache, FILE_WRITE);		//Open the file that needs to update

  if (myFile) 					
  {
    digitalWrite(PIN_LED1,true);		//LED1 light£¬SD card starts write

    switch(choose)			//Write file head, content and tail
    {
    case 'H':
      myFile.println("<?xml version=\"1.0\"?>");
      myFile.println("<gpx creator=\"Geoinfor Scientek Consultant Inc.\" version=\"1.1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://www.topografix.com/GPX/1/0\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd\">");
      myFile.println("<time>2013-09-27T13:10:31Z</time>");
      myFile.println("<trk>");
      myFile.println("<trkseg>");

      Serial.println("=== SD ~~~choose Head");      
      break;
    case 'M':
      {
        static char buf1[46];
        static char buf2[20];
        static char buf3[46];
        static char buf4[20];
        static char buf5[20];
        static char buf6[20];
        static char buf7[20];

        {
          //buf1_float-------------
          char c_latitude[20],c_longitude[20];

          dtostrf(f_latitude,4,6,c_latitude);  //Convert the number to char array
          dtostrf(f_longitude,4,6,c_longitude);  //Convert the number to char array

          sprintf(buf1, "<trkpt lat=\"%s\" lon=\"%s\">", c_latitude,c_longitude); 

          //buf2_float-------------
          float s_Height;
          char c_Height[10];

          s_Height=f_Height;

          dtostrf(s_Height,4,1,c_Height);           

          sprintf(buf2, "<ele>%s</ele>", c_Height); 

          //buf3_int--------------
          sprintf(buf3, "<time>20%d-%d-%dT%d:%d:%dZ</time>", idate[0], idate[1], idate[2],itime[0],itime[1],itime[2]); 

          //buf4_normal--------------
          sprintf(buf4, "<sym>Dot</sym>"); 

          //buf5_int--------------
          sprintf(buf5, "<sat>%d</sat>",i_satellites); 

          //buf6_float--------------
          float s_fixquality;
          char c_fixquality[10];

          s_fixquality=f_fixquality;

          dtostrf(s_fixquality,4,1,c_fixquality);           

          sprintf(buf6, "<pdop>%s</pdop>",c_fixquality); 

          //buf7_normal--------------
          sprintf(buf7, "</trkpt>"); 
        }

        myFile.println(buf1);
        myFile.println(buf2);
        myFile.println(buf3);
        myFile.println(buf4);
        myFile.println(buf5);
        myFile.println(buf6);
        myFile.println(buf7);

        Serial.println("=== SD ~~~choose Main");
      }
      break;
    case 'B':
      myFile.println("</trkseg>");
      myFile.println("</trk>");
      myFile.println("</gpx>");

      Serial.println("=== SD ~~~choose Body");
      break;
    }

    myFile.close();			

    Serial.println("===SD Write DONE===");
  }
  else 			
  {
    Serial.println("===SD Write ERROR===");
  }


  digitalWrite(PIN_LED1,false);		//LED1 off, finished writing

  Serial.println("=== SD WRITE Complete ===");
  Serial.println(" ");
}

void vosd_datawrite()		//Write the GPX data
{
  if(time_sdwrite>millis()) time_sdwrite=millis();
  if(millis()-time_sdwrite>init_sdwrite)
  {
    if(STA)
    {
      //      vostring();
      vosdbegin(file_name);		//SD card file check
      if(sd_sta && file_sta)
      {
        Serial.println(" ");
        Serial.println("=== SD DATAWRITE === ");

        vosdwrite(file_name,'M');
        //        vosdread(file_name);    

        Serial.print("=== SD The NUM ");
        Serial.print(file_num);
        Serial.print(" File:");
        Serial.print(file_name);
        Serial.print(" is ");
        Serial.print("Updata");
        Serial.println("=== SD DATAWRITE Complete === ");
        Serial.println(" ");
      }
    }

    time_sdwrite=millis();
  }
}

void  vosd_dataupdata()		//Update new GPX file
{
  eeprom_read();				//Read EEPROM£¬get the last file's date
  if(idate_cache!=idate[2])		//If the date changed
  {
    file_num=1;		
    idate_cache=idate[2];
  }

  //    Serial.print("idate[2]:");
  //    Serial.println(idate[2]);

  vostring();				//Update file name
  vosdbegin(file_name);     //SD card file check

  if(sd_sta && file_sta)	
  {
    Serial.println(" ");
    Serial.println("== SD updata ==");

    vosdwrite(file_name,'B');	//Write file tail
//    vosdread(file_name);


    Serial.print("The NUM ");
    Serial.print(file_num);
    Serial.print(" File:");
    Serial.print(file_name);
    Serial.print(" is ");
    Serial.print("Complete");

    //-------------------
    file_num++;					//Update file sequence
    if(file_num>99)
      file_num=1;

    vostring();					//Update file name
    vosdbegin(file_name); 	    //SD card file check
    //    vosdread(file_name);

    Serial.println(" ");
    Serial.println("== SD updata Complete ==");
  }

  //  Serial.print("idate_cache:");
  //  Serial.println(idate_cache);

  eeprom_write();  			//Write EEPROM
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
  if(STA)
  {
    if(!b_oled_updata)	//Check if the button was pressed
    {
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
    }
    else
    {
      u8g.print("Compl.:\"");
      u8g.print(file_name_cache);
      u8g.print("\"");
    }
  }
  else
    u8g.print("-- GPS is Not Ready --");

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
  Serial.begin(115200);
  GPS.begin(38400);

  pinMode(PIN_key1,INPUT_PULLUP); 		//Pull up

  pinMode(PIN_LED1,OUTPUT); 		//LED
  pinMode(PIN_LED2,OUTPUT); 		//LED

  eeprom_read();					//Read EEPROM

  //  vostring();

  Serial.print("file_name: ");  
  Serial.println(file_name);

  //------------------------------
  Serial.println("Initializing SD card...");

  pinMode(10, OUTPUT);	

  if (!SD.begin(7)) 		//Initialize SD card
  {
    sd_sta=false;			//SD card abnormal
    Serial.println("initialization failed!");
    return;
  }
  else
  {
    sd_sta=true;				//SD card state is ok
    vosdbegin(file_name);		//SD file check
	Serial.println("initialization done.");
  }

  //  u8g.setRot180();
  volcdlogo(0, 10);
  delay(2000);
}


void loop()
{
  //Check the button-------------------------------
  file_updata=false;
  vokey();
  if(file_updata)
  {
    vosd_dataupdata();
    time_oled_updata=millis();
  }

  b_oled_updata=! boolean (millis()-time_oled_updata>init_oled_updata);	

  //GPS-------------------------------
  vogps_databegin();

  vogps_dataread();

  //SD-------------------------------
  vosd_datawrite();

  //OLED-------------------------------
  vooled();
}