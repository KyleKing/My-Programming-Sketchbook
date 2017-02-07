// HelloWorld.ino
// Simple example of using a 74HC595 Shift Register
// Source: http://bildr.org/2011/02/74hc595/


int SER_Pin = 8;   //pin 14 on the 75HC595
int RCLK_Pin = 11;  //pin 12 on the 75HC595
int SRCLK_Pin = 13; //pin 11 on the 75HC595

//How many of the shift registers - change this
#define number_of_74hc595s 1

//do not touch
#define numOfRegisterPins number_of_74hc595s * 8

boolean registers[numOfRegisterPins];

void setup(){
  Serial.begin(9600);

  pinMode(SER_Pin, OUTPUT);
  pinMode(RCLK_Pin, OUTPUT);
  pinMode(SRCLK_Pin, OUTPUT);


  //reset all register pins
  clearRegisters();
  writeRegisters();

  randomSeed(analogRead(0));
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

//set an individual pin HIGH or LOW
int randVal(){
  if (random(10) > 5){
    return HIGH;
  } else{
    return LOW;
  }
}


void loop(){

	delay(1000);

  Serial.println(randVal());

  setRegisterPin(1, randVal());
  setRegisterPin(2, randVal());
  setRegisterPin(3, randVal());
  setRegisterPin(4, randVal());
  setRegisterPin(5, randVal());
  setRegisterPin(6, randVal());
  setRegisterPin(7, randVal());


  writeRegisters();  //MUST BE CALLED TO DISPLAY CHANGES
  //Only call once after the values are set how you need.
}
