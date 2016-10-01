#define FANpin 10

void setup() {
  Serial.begin(9600);
  Serial.println("Connected!");
	pinMode(FANpin, OUTPUT);
  analogWrite(FANpin, 0);
}

void loop() {
  int potVal = analogRead(A0);
  float fanVal = potVal * (5.0 / 1023.0);
  Serial.println("\nWriting new fanval:");
  Serial.println(fanVal);
  analogWrite(FANpin, fanVal);
}