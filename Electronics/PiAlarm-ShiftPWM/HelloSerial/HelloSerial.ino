// Working example of sending either integer less than 5 (all off) or
//    greater than (all on) to digitally toggle all of the pins
// Moved onto ShiftPWM to allow PWM control rather than digital control alone



String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complet
#define speakerPIN 3


int SER_Pin = 8;   //pin 14 on the 75HC595
int RCLK_Pin = 10;  //pin 12 on the 75HC59
int SRCLK_Pin = 13; //pin 11 on the 75HC595

//How many of the shift registers - change this
#define number_of_74hc595s 1

//do not touch
#define numOfRegisterPins number_of_74hc595s * 8

boolean registers[numOfRegisterPins];

void setup(){
  pinMode(SER_Pin, OUTPUT);
  pinMode(RCLK_Pin, OUTPUT);
  pinMode(SRCLK_Pin, OUTPUT);
  //reset all register pins
  clearRegisters();
  writeRegisters();

  Serial.begin(9600);
  inputString.reserve(200);
  pinMode(speakerPIN, OUTPUT);
  analogWrite(speakerPIN, 0);
}


//set all register pins to LOW
void clearRegisters(){
  for(int i = numOfRegisterPins - 1; i >=  0; i--){
     registers[i] = LOW;
  }
}


//Set and display registers
//Only call AFTER all values are set how you would like (slow otherwise)
void writeRegisters(){
  digitalWrite(RCLK_Pin, LOW);
  for(int i = numOfRegisterPins - 1; i >=  0; i--){
    digitalWrite(SRCLK_Pin, LOW);
    int val = registers[i];
    digitalWrite(SER_Pin, val);
    digitalWrite(SRCLK_Pin, HIGH);
  }
  digitalWrite(RCLK_Pin, HIGH);
}

//set an individual pin HIGH or LOW
void setRegisterPin(int index, int value){
  registers[index] = value;
}

void loop() {
  if (stringComplete) {
    int newValue = inputString.toInt();
    Serial.println("\nReceived:");
    Serial.println(newValue);
    // analogWrite(speakerPIN, newValue);

    int newLED = LOW;
    if (newValue > 5) {
      newLED = HIGH;
    }
    setRegisterPin(2, newLED);
    setRegisterPin(3, newLED);
    setRegisterPin(4, newLED);
    setRegisterPin(5, newLED);
    setRegisterPin(7, newLED);
    writeRegisters();  //MUST BE CALLED TO DISPLAY CHANGES
    //Only call once after the values are set how you need.

    // Clear global variables:
    inputString = "";
    stringComplete = false;
  }
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

