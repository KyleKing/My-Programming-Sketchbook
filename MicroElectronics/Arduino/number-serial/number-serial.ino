// To learn how to use Serial.parseFloat() and read a number from serial

/* Right Triangle - User Interactive via Serial Terminal
   M. Ray Burnette 20130125
   Arduino Nano 328P target processor
   Binary sketch size: 5,184 bytes (of a 30,720 byte maximum)
*/

#include "math.h"               // include the Math Library

float a;
float b;
float h;
char junk = ' ';


void setup()                    // run once, when the sketch starts
{
  Serial.begin(9600);           // set up Serial library at 9600 bps

  Serial.println("Lets calculate a hypotenuse, h");
  Serial.println("");


  Serial.flush();
}

void loop()
{
  Serial.println("Enter value for leg 'a', Press ENTER");
  while (Serial.available() == 0) ;  // Wait here until input buffer has a character
  {
      //Side 1
    a = Serial.parseFloat();        // new command in 1.0 forward
    Serial.print("a = "); Serial.println(a, DEC);

    while (Serial.available() > 0)  // .parseFloat() can leave non-numeric characters
    { junk = Serial.read() ; }      // clear the keyboard buffer
  }

  Serial.println("Enter value for leg 'b', Press ENTER");
  while (Serial.available() == 0) ;
  {
      //Side 2
    b = Serial.parseFloat();
    Serial.print("b = "); Serial.println(b, DEC);
    while (Serial.available() > 0)
    { junk = Serial.read() ; }

    h = sqrt (float( a*a + b*b ));

    Serial.print("hypotenuse = ");
    Serial.println(h, DEC); Serial.println();
  }
}