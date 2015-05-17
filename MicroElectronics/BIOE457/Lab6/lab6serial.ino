void setup() {
  Serial.begin(115200); // initialize serial communication at 115200 bits per second:
  for (int i = 2; i <= 5; i++) {
    pinMode(i, INPUT); // Declare each input pin
  }
}

// the loop routine runs over and over again forever:
void loop() {
  for (int i = 2; i <= 5; i++) {
    // read the input pin:
    int buttonState = digitalRead(i);
    Serial.print(buttonState);
  }
  delay(1000);        // delay in between reads for stability
  Serial.println();
}