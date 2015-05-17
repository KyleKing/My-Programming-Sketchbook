// To test the ability to set the angle of the servo motor from a serial monitor


#include <Servo.h>
Servo myservo;  // create servo object to control a servo
int serialPos = 0;    // variable to store the servo position

void setup() {
   // initialize serial:
   Serial.begin(9600);
   int serialPos = 0;
   myservo.attach(9);  // attaches the servo on pin 9 to the servo object
}

void loop() {
  // print the string when a newline arrives:
  // if (stringComplete) {
  //   Serial.println(inputString);
  //   // clear the string:
  //   inputString = "";
  //   stringComplete = false;
  // }
}

// SerialEvent occurs whenever a new data comes in the hardware serial RX.  This routine is run between each time loop() runs, so using delay inside loop can delay response.  Multiple bytes of data may be available.

void serialEvent() {

   while (Serial.available()) {
      // get the new byte:
      int serialPos = Serial.parseInt();

      // Print out results
      String disp = "serialPos = ";
      disp.concat(serialPos);
      Serial.println(disp);

      myservo.write(serialPos);      // tell servo to go to position in variable 'serialPos'
   }
}