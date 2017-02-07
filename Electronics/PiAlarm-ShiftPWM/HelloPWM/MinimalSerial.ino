// These are the Arduino pins connected to your shift register string
const int ShiftPWM_latchPin=8;
const int ShiftPWM_dataPin = 11;
const int ShiftPWM_clockPin = 13;

const unsigned int ShiftPWM_numRegisters=1;       // The number of 8-bit shift registers connected
const bool ShiftPWM_invertOutputs = false;
const bool ShiftPWM_balanceLoad = false;

#include <ShiftPWM.h>   // include ShiftPWM.h after setting the pins!

unsigned char maxBrightness = 255;
int pwmFrequency=100;

int numRGBleds = ShiftPWM_numRegisters*8/3;

void setup(){

  // SetPinGrouping allows flexibility in LED setup.
  // If your LED's are connected like this: RRRRGGGGBBBBRRRRGGGGBBBB, use SetPinGrouping(4).
  ShiftPWM.SetPinGrouping(1); //This is the default, but I added here to demonstrate how to use the function

  ShiftPWM.Start(pwmFrequency,maxBrightness);
}



void loop()
{
  // Turn all LED's off.
  ShiftPWM.SetAll(255);
  delay(1000);
  ShiftPWM.SetAll(0);

  // Fade in and fade out all outputs one by one fast. Usefull for testing your hardware. Use OneByOneSlow when this is going to fast.
  ShiftPWM.OneByOneFast();

  // Fade in all outputs
  for(int j=0;j<maxBrightness;j++){
    ShiftPWM.SetAll(j);
    delay(20);
  }
  // Fade out all outputs
  for(int j=maxBrightness;j>=0;j--){
    ShiftPWM.SetAll(j);
    delay(20);
  }
}
