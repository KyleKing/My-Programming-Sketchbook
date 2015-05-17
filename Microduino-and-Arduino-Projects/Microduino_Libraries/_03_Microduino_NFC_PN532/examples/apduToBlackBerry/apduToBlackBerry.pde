/**  
   Copyright (c) 2011, 2012, 2013 Research In Motion Limited.
  
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
  
   http://www.apache.org/licenses/LICENSE-2.0
  
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
**/
#include <Wire.h>
#include "Adafruit_NFCShield_I2C.h"

// PWM LED will be on the following PINs.
#define R_PIN (9)
#define G_PIN (10)
#define B_PIN (11)

#define IRQ   (2)
#define RESET (3)  // Not connected by default on the NFC Shield

Adafruit_NFCShield_I2C nfc(IRQ, RESET);

// Initial values of RGB.
uint8_t r = 0x00;
uint8_t g = 0x00;
uint8_t b = 0x7f;

/**
 * Write the current color to the output pins.
 */
void showColor() {
  analogWrite(R_PIN,r);
  analogWrite(G_PIN,g);
  analogWrite(B_PIN,b);
}

void setup() {
  Serial.begin(115200);

  pinMode(R_PIN,OUTPUT);
  pinMode(G_PIN,OUTPUT);
  pinMode(B_PIN,OUTPUT);
  showColor();

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.println("Did not find the shield - locking up");
    while (true) {
    }
  }

  Serial.print("Found chip PN5"); 
  Serial.println((versiondata>>24) & 0xFF, HEX); 
  Serial.print("Firmware ver. "); 
  Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); 
  Serial.println((versiondata>>8) & 0xFF, DEC);

  // configure board to read RFID tags
  nfc.SAMConfig();

  nfc.begin();
}

uint8_t message[4];

void loop(void) {
  uint8_t i;

  // Serial.println("Listening...");
  if (nfc.inListPassiveTarget()) {
    // Serial.println("Something's there...");
    while(true) {
      message[0] = 1;
      message[1] = r;
      message[2] = g;
      message[3] = b;
      uint8_t responseLength = sizeof(message);
      if (nfc.inDataExchange(message,sizeof(message),message,&responseLength)) {
        uint8_t command = message[0];
        switch(command) {
        case 0:
          // NOP
          break;
        case 1:
          if (responseLength==4) {
            r = message[1];
            g = message[2];
            b = message[3];
            showColor();
            //Serial.print("Read a color: ");
            //for (i=0; i<3; ++i) {
            //  Serial.print(message[i+1],HEX);
            //  Serial.print(' ');
            //}
            //Serial.println();
          } 
          else {
            //Serial.println("Doesn't seem to be a color...");
          }
          break;
        default:
          //Serial.print("Unknown command ");
          //Serial.println(message[0]);
          ;
        }
        delay(10);
      } 
      else {
        //Serial.println("It's gone...");
        break;
      }
    }
  } 
  else {
    //Serial.print("Trying again...");
  }
}

