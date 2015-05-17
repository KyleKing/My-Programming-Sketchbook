#include <PID_v1.h>
#include <OneWire.h>
#include <DallasTemperature.h>
// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 2
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);


int RelayPin = 6;
//Define Variables we'll be connecting to
double Setpoint, Input, Output;
//Specify the links and initial tuning parameters
  // PID(&Input, &Output, &Setpoint, Kp, Ki, Kd, Direction)
PID myPID(&Input, &Output, &Setpoint, 3, 8, 4, DIRECT);

int WindowSize = 500;
double printOutput;
unsigned long windowStartTime;
void setup()
{
  windowStartTime = millis();
  //initialize the variables we're linked to
  Setpoint = 37;
  //tell the PID to range between 0 and the full window size
  myPID.SetOutputLimits(0, WindowSize);
  //turn the PID on
  myPID.SetMode(AUTOMATIC);
  pinMode(RelayPin, OUTPUT);

  // start serial port
  Serial.begin(9600);
  // Serial.println("Dallas Temperature IC Control Library Demo");
  // Start up the library
  sensors.begin();
}

void loop()
{
  // call sensors.requestTemperatures() to issue a global temperature
  // request to all devices on the bus
  // Serial.print("Requesting temperatures...");
  sensors.requestTemperatures(); // Send the command to get temperatures
  // Serial.println("DONE");

  // Serial.print("Temperature: ");
  Input = sensors.getTempCByIndex(0);
  Serial.print(Input);
  Serial.println("*1");

  // Input = analogRead(0);
  myPID.Compute();
  // Serial.print("Output: ");
  printOutput = Output/10.0;
  Serial.print(printOutput);
  Serial.println("*2");

  /************************************************
   * turn the output pin on/off based on pid output
   ************************************************/
  if(millis() - windowStartTime > WindowSize)
  { //time to shift the Relay Window
    windowStartTime += WindowSize;
  }
  if(Output > millis() - windowStartTime) digitalWrite(RelayPin,HIGH);
  else digitalWrite(RelayPin,LOW);
}