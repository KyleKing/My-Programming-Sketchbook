//Pin8 connect to  ST_CP of 74HC595
int latchPin = 8;
//Pin12 connect to SH_CP of 74HC595
int clockPin = 12;
//Pin11 connect to DS of 74HC595
int dataPin = 11;

//define time
unsigned long time;

//mask row define
byte masks[8]={
  B01111111,B10111111,B11011111,B11101111,B11110111,B11111011,B11111101,B11111110};

  
  //smail action define
byte rows[2][8]={
  {
    B00111100,B01000010,B10100101,B10000001,B10100101,B10011001,B01000010,B00111100  }
  ,
  {
    B00111100,B01000010,B10100101,B10000001,B10111101,B10000001,B01000010,B00111100  }
};


void setup() {
  Serial.begin(9600);
  //set latchpin is output
  pinMode(latchPin, OUTPUT);

}

void loop() {

  //smail action change
  for(int j=0;j<2;j++) {

    unsigned long startTime = millis();
    for (unsigned long elapsed=0; elapsed < 1000; elapsed = millis() - startTime) {//continue display 600ms
      for(int i=0;i<8;i++) {
        digitalWrite(latchPin, 0);
        shiftOut(dataPin, clockPin, masks[i]);  //mask(col)
        shiftOut(dataPin, clockPin, rows[j][i]);  //row
        digitalWrite(latchPin, 1);
      }
    }
    //time=0;

  }
}

void shiftOut(int myDataPin, int myClockPin, byte myDataOut) {
  // This shifts 8 bits out MSB first,
  //on the rising edge of the clock,
  //clock idles low

  //internal function setup
  int i=0;
  int pinState;
  pinMode(myClockPin, OUTPUT);
  pinMode(myDataPin, OUTPUT);

  //clear everything out just in case to
  //prepare shift register for bit shifting
  digitalWrite(myDataPin, 0);
  digitalWrite(myClockPin, 0);

  //for each bit in the byte myDataOut&#239;&#191;&#189;
  //NOTICE THAT WE ARE COUNTING DOWN in our for loop
  //This means that %00000001 or "1" will go through such
  //that it will be pin Q0 that lights.
  for (i=7; i>=0; i--)  {
    digitalWrite(myClockPin, 0);

    //if the value passed to myDataOut and a bitmask result
    // true then... so if we are at i=6 and our value is
    // %11010100 it would the code compares it to %01000000
    // and proceeds to set pinState to 1.
    if ( myDataOut & (1<<i) ) {
      pinState= 1;
    }
    else {       
      pinState= 0;
    }

    //Sets the pin to HIGH or LOW depending on pinState
    digitalWrite(myDataPin, pinState);
    //register shifts bits on upstroke of clock pin  
    digitalWrite(myClockPin, 1);
    //zero the data pin after shift to prevent bleed through
    digitalWrite(myDataPin, 0);
  }

  //stop shifting
  digitalWrite(myClockPin, 0);
}




