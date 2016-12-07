String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complet

#define speakerPIN 3

void setup() {
        Serial.begin(9600);
        inputString.reserve(200);
        pinMode(speakerPIN, OUTPUT);
        analogWrite(speakerPIN, 0);
}

void loop() {
        if (stringComplete) {
                int newValue = inputString.toInt();
                Serial.println("\nReceived:");
                Serial.println(newValue);
                analogWrite(speakerPIN, newValue);

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

