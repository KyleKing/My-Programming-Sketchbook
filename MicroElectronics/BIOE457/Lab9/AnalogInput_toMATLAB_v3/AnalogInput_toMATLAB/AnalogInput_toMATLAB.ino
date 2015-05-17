/* Analog Input to MATLAB */

// Communicate with MATLAB using Arduino and Serial communication

const int RedPin = A0;    // select the input pin for the potentiometer
const int IRPin = A1;
int Redval = 0;  // variable to store the value coming from the sensor
int IRval = 0;

// Testing
int i = 1;

void setup() {
  //Initialize serial port
  Serial.begin(9600);
}

void loop() {

  // Testing
  i = i+1;
  Redval = 2+i;
  IRval = 5+i;

  // // read the value from the sensor:
  // Redval = 2; // analogRead(RedPin);
  // IRval = 5; // analogRead(IRPin);

  // Output sensorValue to Serial Monitor
  Serial.print(Redval); // Print value
  Serial.println("*1"); // Print channel identifier (for MATLAB)
  Serial.print(IRval);
  Serial.println("*2");
  delay(100);
}
