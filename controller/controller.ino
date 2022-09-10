#include "WiFi.h"
#include "ThingSpeak.h"
#include "HTTPClient.h"

const int motor1Pin1 = 27;
const int motor1Pin2 = 26;
const int enable1Pin = 14;
const int sensorIn = 34;
const int Rpmsensor = 25;
const int freq = 30000;
const int pwmChannel = 0;
const int resolution = 8;
int dutyCycle = 200;
float vv = 4.9;

char* ssid = "Harsh";
char* pwd = "rudranshpratapsingh";
const char* myWriteAPIKey = "95X1SMC8POQD264A";
const char* myReadAPIKey = "PQGEZA20RGHXTE68";
unsigned long myChannelNumber = 1825191;

String server = "https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-23/Node-1/Data";

WiFiClient client;

void setup() {
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(enable1Pin, OUTPUT);
//    pinMode(sensorIn, INPUT);
  pinMode(Rpmsensor, INPUT);
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(enable1Pin, pwmChannel);

  Serial.begin(9600);
  Serial.print("Testing DC Motor...");
  WiFi.mode(WIFI_STA);
  ThingSpeak.begin(client);  // Initialize ThingSpeak
}

void pushOnem2m(String val)
{
  HTTPClient http;
  http.begin(server);
  http.addHeader("X-M2M-Origin", "!qH#A6:WvyYXL");
  http.addHeader("Content-Type", "application/json;ty=4");
//  Serial.println("{\"m2m:cin\": {\"cnf\":\"application/json\",\"con\": " + \"+String(val)+\" + "}}");
  int code = http.POST("{\"m2m:cin\": {\"cnf\":\"application/json\",\"con\": \"" + String(val) + "\"}}");
  Serial.println(code);
  if (code == -1)
    Serial.println("Connection failed");
  http.end();
}


float getRPS() {

  unsigned long stTime = millis();
  float Rota = 0;
  unsigned long enTime = stTime + 1000;
  while (millis() < enTime) {
    //       Serial.println(digitalRead(Rpmsensor));

    //    Serial.println(Rota);
    if (digitalRead(Rpmsensor))  {
      Rota += 1;
      //        Serial.println(digitalRead(Rpmsensor));
      while (digitalRead(Rpmsensor));
      //        Serial.println(digitalRead(Rpmsensor));

    }
  }
  Rota /= 40;

  return Rota ;

}

float getCurrent()
{
  float resultVol = 0;
  float resultCurr;
  for (int i = 0; i < 1000; i++) {
    resultVol += (analogRead(sensorIn));
    //      resultCurr = analogRead(sensorIn);
    //      resultVol+=resultCurr;
    //    Serial.println(resultCurr);
    //    Serial.println(resultVol);
    delay(1);
  }
  Serial.println(resultVol);

  //  resultVol /=1000;
  //  resultVol *= (5/4096);
  resultVol = (resultVol / 1000) * 5 / 4096;
  Serial.println(resultVol);
  resultCurr = (resultVol-3.3) / 0.1;
  Serial.println(resultCurr);

  return resultCurr;
}


void loop() {
  
  
  //  Serial.println("Moving Forward");
  //  digitalWrite(motor1Pin1, LOW);
  //  digitalWrite(motor1Pin2, HIGH);
  //  delay(2000);

  //  // Stop the DC motor
  //  Serial.println("Motor stopped");
  //  digitalWrite(motor1Pin1, LOW);
  //  digitalWrite(motor1Pin2, LOW);
  //  delay(1000);

  //  // Move DC motor backwards at maximum speed
  //  Serial.println("Moving Backwards");
  //  digitalWrite(motor1Pin1, HIGH);
  //  digitalWrite(motor1Pin2, LOW);
  //  delay(2000);
  //
  //  // Stop the DC motor
  //  Serial.println("Motor stopped");
  //  digitalWrite(motor1Pin1, LOW);
  //  digitalWrite(motor1Pin2, LOW);
  //  delay(1000);



  // Move DC motor forward with increasing speed
  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    while (WiFi.status() != WL_CONNECTED) {
      WiFi.begin(ssid, pwd);  // Connect to WPA/WPA2 network. Change this line if using open or WEP network
      Serial.print(".");
      delay(5000);
    }
    Serial.println("\nConnected.");
  }
  vv=vv+ 0.1;
  if(vv > 7){
    vv = 4.9;
  }
  // float voltage = ThingSpeak.readFloatField(myChannelNumber,4,myReadAPIKey);
  // dutyCycle = 255*voltage/7;
  
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);

//  for (dutyCycle = 180; dutyCycle <= 255 ; dutyCycle += 5) {
    ledcWrite(pwmChannel, dutyCycle);
    float curr = getCurrent();
    float rps = getRPS();
    Serial.print("duty cycle =  ");
    Serial.println(dutyCycle);
    Serial.print("current = ");
    Serial.println(curr);
    Serial.print("Rotations per sec = ");
    Serial.println(rps);
    ThingSpeak.setField(1, rps);
    ThingSpeak.setField(2, curr);
    ThingSpeak.setField(3, dutyCycle);
    pushOnem2m(String("["+String(rps)+","+String(curr)+","+String(dutyCycle)+"]"));

    int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
    if (x == 200) {
      Serial.println("Channel update successful.");
    }
    else {
      Serial.println("Problem updating channel. HTTP error code " + String(x));
    }

    Serial.println("---------------------------------------------");

//  }
  //  while (dutyCycle <= 255){
  //    ledcWrite(pwmChannel, dutyCycle);
  //    Serial.print("Forward with duty cycle: ");
  //    Serial.println(dutyCycle);
  //    dutyCycle = dutyCycle + 5;
  //    delay(500);
  //  }
  //  dutyCycle = 200;
  delay(15 * 1000);
}
