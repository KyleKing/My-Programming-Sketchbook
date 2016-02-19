int Potentiometer = 0;
int Source = 11;
int MOSFET = 10;

void setup()  {
  // Make a 5V pin
  pinMode(Source, OUTPUT);
  // digitalWrite(Source, HIGH);
  analogWrite(Source, 255 );
  // Control the Fan based on Ptmr input
  pinMode(Potentiometer, INPUT);
  pinMode(MOSFET, OUTPUT);
  // Begin serial communcation
  Serial.begin(9600);
} 

void loop()  {
  int ptmr = analogRead(Potentiometer);
  Serial.println( ptmr );

  //Serial.print( ptmr );
  //Serial.print(" of 1023, which /4 =  ");
  //Serial.print( ptmr/4 );
  //Serial.println(" out of 255 for AW.");

  // Write the value of the photoresistor to the serial monitor.
  //  analogWrite(MOSFET, ptmr/4 );
  analogWrite(MOSFET, ptmr/4 );
}









