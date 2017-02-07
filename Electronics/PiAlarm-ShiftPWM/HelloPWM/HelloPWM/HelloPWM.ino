/************************************************************************************************************************************
 * ShiftPWM blocking RGB fades example, (c) Elco Jacobs, updated August 2012.
 * with modifications (c)2015 Josh Levine [http://josh.com]
 *
 * ShiftPWM blocking RGB fades example. This example uses simple delay loops to create fades.
 * If you want to change the fading mode based on inputs (sensors, buttons, serial), use the non-blocking example as a starting point.
 * Please go to www.elcojacobs.com/shiftpwm for documentation, fuction reference and schematics.
 * If you want to use ShiftPWM with LED strips or high power LED's, visit the shop for boards.
 ************************************************************************************************************************************/

// These are the Arduino pins connected to your shift register string
const int ShiftPWM_latchPin=8;
const int ShiftPWM_dataPin = 11;
//const int ShiftPWM_dataPin = 9;
const int ShiftPWM_clockPin = 13;
//const int ShiftPWM_clockPin = 10;

// The number of 8-bit shift registers connected
// const unsigned int ShiftPWM_numRegisters=5;       // The number of 8-bit shift registers connected
const unsigned int ShiftPWM_numRegisters=1;       // The number of 8-bit shift registers connected

// If your LED's turn on if the pin is low, set this to true, otherwise set it to false
const bool ShiftPWM_invertOutputs = false;
// const bool ShiftPWM_invertOutputs = true;

// You can enable the option below to shift the PWM phase of each shift register by 8 compared to the previous.
// This will slightly increase the interrupt load, but will prevent all PWM signals from becoming high at the same time.
// This will be a bit easier on your power supply, because the current peaks are distributed.
const bool ShiftPWM_balanceLoad = false;

#include <ShiftPWM.h>   // include ShiftPWM.h after setting the pins!


unsigned char maxBrightness = 255;
int pwmFrequency=100;

int numRGBleds = ShiftPWM_numRegisters*8/3;

void setup(){

  // SetPinGrouping allows flexibility in LED setup.
  // If your LED's are connected like this: RRRRGGGGBBBBRRRRGGGGBBBB, use SetPinGrouping(4).
  ShiftPWM.SetPinGrouping(1); //This is the default, but I added here to demonstrate how to use the function

  Serial.begin(9600);
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
    Serial.println("\nfading!:");
  }
  // Fade out all outputs
  for(int j=maxBrightness;j>=0;j--){
    ShiftPWM.SetAll(j);
    delay(20);
  }


  // // Fade in and out 2 outputs at a time
  // for(int output=0;output<ShiftPWM_numRegisters*8-1;output++){
  //   ShiftPWM.SetAll(0);
  //   for(int brightness=0;brightness<maxBrightness;brightness++){
  //     ShiftPWM.SetOne(output+1,brightness);
  //     ShiftPWM.SetOne(output,maxBrightness-brightness);
  //     delay(1);
  //   }
  // }

  // // Hue shift all LED's
  // for(int hue = 0; hue<360; hue++){
  //   ShiftPWM.SetAllHSV(hue, 255, 255);
  //   delay(50);
  // }

  // // Alternate LED's in 6 different colors
  // for(int shift=0;shift<6;shift++){
  //   for(int led=0; led<numRGBleds; led++){
  //     switch((led+shift)%6){
  //     case 0:
  //       ShiftPWM.SetRGB(led,255,0,0);    // red
  //       break;
  //     case 1:
  //       ShiftPWM.SetRGB(led,0,255,0);    // green
  //       break;
  //     case 2:
  //       ShiftPWM.SetRGB(led,0,0,255);    // blue
  //       break;
  //     case 3:
  //       ShiftPWM.SetRGB(led,255,128,0);  // orange
  //       break;
  //     case 4:
  //       ShiftPWM.SetRGB(led,0,255,255);  // turqoise
  //       break;
  //     case 5:
  //       ShiftPWM.SetRGB(led,255,0,255);  // purple
  //       break;
  //     }
  //   }
  //   delay(2000);
  // }

  // // Update random LED to random color. Funky!
  // for(int i=0;i<1000;i++){
  //   ShiftPWM.SetHSV(random(numRGBleds),random(360),255,255);
  //   delay(15);
  // }


  // // Imitate a VU meter
  // int peak=0;
  // int prevPeak=0;

  // int currentLevel = 0;
  // for(int i=0;i<40;i++){
  //   prevPeak = peak;
  //   while(abs(peak-prevPeak)<5){
  //     peak =  random(numRGBleds); // pick a new peak value that differs at least 5 from previous peak
  //   }
  //   // animate to new top
  //   while(currentLevel!=peak){
  //     if(currentLevel<peak){
  //       currentLevel++;
  //     }
  //     else{
  //       currentLevel--;
  //     }
  //     for(int led=0;led<numRGBleds;led++){
  //       if(led<=currentLevel){
  //         int hue = (numRGBleds-1-led)*120/numRGBleds; // From green to red
  //         ShiftPWM.SetHSV(led,hue,255,255);
  //       }
  //       else{
  //         ShiftPWM.SetRGB(led,0,0,0);
  //       }
  //     }
  //     delay((64/numRGBleds)*(numRGBleds-currentLevel)); // go slower near the top
  //   }
  // }

  // //  A moving rainbow for RGB leds:
  // rgbLedRainbow(numRGBleds, 5, 3, ShiftPWM_numRegisters*8/3); // Fast, over all LED's
  // rgbLedRainbow(numRGBleds, 10, 3, ShiftPWM_numRegisters*8/3*4); //slower, wider than the number of LED's
}

// void rgbLedRainbow(int numRGBLeds, int delayVal, int numCycles, int rainbowWidth){
//   // Displays a rainbow spread over a few LED's (numRGBLeds), which shifts in hue.
//   // The rainbow can be wider then the real number of LED's.

//   ShiftPWM.SetAll(0);
//   for(int cycle=0;cycle<numCycles;cycle++){ // loop through the hue shift a number of times (numCycles)
//     for(int colorshift=0;colorshift<360;colorshift++){ // Shift over full color range (like the hue slider in photoshop)
//       for(int led=0;led<numRGBLeds;led++){ // loop over all LED's
//         int hue = ((led)*360/(rainbowWidth-1)+colorshift)%360; // Set hue from 0 to 360 from first to last led and shift the hue
//         ShiftPWM.SetHSV(led, hue, 255, 255); // write the HSV values, with saturation and value at maximum
//       }
//       delay(delayVal); // this delay value determines the speed of hue shift
//     }
//   }
// }
