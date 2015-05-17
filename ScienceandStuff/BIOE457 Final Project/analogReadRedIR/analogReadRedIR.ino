const int irPin = A0;
const int redPin = A1;

int irval = 0;
int redval = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
//  pinMode(irPin,INPUT);
//  pinMode(redPin,INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  irval = analogRead(irPin);
  Serial.print(irval);
  Serial.println("*1");
  redval = analogRead(redPin);
  Serial.print(redval);
  Serial.println("*2");
  delay(10);
}
