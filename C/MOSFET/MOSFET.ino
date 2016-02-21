// Potentiometer-Controlled MOSFET with indicator light
// Built for a vent for a soldering station

int Potentiometer = 0;
int MOSFET = 10;
int LED = 11;
// int Source = 12;

void setup()  {
  // // Make a 5V pin
  // pinMode(Source, OUTPUT);
  // digitalWrite(Source, HIGH);

  // Control the Fan based on Ptmr input
  pinMode(Potentiometer, INPUT);
  pinMode(MOSFET, OUTPUT);
  // pinMode(LED, OUTPUT);

  // Begin serial communcation
  Serial.begin(9600);
}

void loop()  {
  int ptmr = analogRead(Potentiometer);
  int power = ptmr/4;

  Serial.print( ptmr );
  Serial.print(" of 1023, which /4 =  ");
  Serial.print( power );
  Serial.println(" out of 255 for AW.");

  // Write the value of the photoresistor to the serial monitor.
   // analogWrite(MOSFET, 600/4 );
  analogWrite(MOSFET, power );
  // analogWrite(LED, power );
}



















