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
const char* myReadAPIKey = "KXTTNBBK66UCLUZO";
unsigned long myWriteChannel = 1825191;
unsigned long myReadChannel = 1863500;

String server = "https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-23/Node-1/Data";

struct Data {
  float rps, current;
  int dutyCycle;
  unsigned int t;
};

const int DataBufferLen = 15;
struct Data DataBuffer[DataBufferLen];
int DataLen = 0; 

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

void pushThingspeak(){
  unsigned int push_time = millis()-1;
  
  if (DataLen < DataBufferLen){
    return;
  }

  String json = "[";
  for (int  i = 0; i < DataBufferLen; i++) {
    if (i != 0) {
      json += ",";
    }

    json += "{\"delta_t\":" + String((push_time - DataBuffer[i].t)/1000) + ",\"field1\":" + String(DataBuffer[i].rps) + 
    ",\"field2\":" + String(DataBuffer[i].current) + ",\"field3\":" + String(DataBuffer[i].dutyCycle) + "}";
  }
  json += "]";

  Serial.println("Pushing data to Thingspeak");
  Serial.println(json);

  char TSserver[] = "https://api.thingspeak.com/channels/1825191/bulk_update.json";
  HTTPClient http;
  http.begin(TSserver);
  http.addHeader("Content-Type","application/json");
  int code = http.POST("{\"write_api_key\":\"95X1SMC8POQD264A\",\"updates\":" + json + "}");
  Serial.println("Code returned : " + String(code));
  if (code == -1)
  {
    Serial.println("Connection failed");
    return;
  }
  http.end();
  DataLen = 0;
}


void pushOnem2m(String val)
{
  static int last_push = millis();

  if (millis() - last_push < 0)
  {
    return;
  }
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
  last_push = millis();
}


float getRPS() {

  unsigned long stTime = millis();
  float Rota = 0;
  unsigned long enTime = stTime + 1000;
  while (millis() < enTime) {
    if (digitalRead(Rpmsensor))  {
      Rota += 1;
      while (digitalRead(Rpmsensor));

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
    delay(1);
  }
  Serial.println(resultVol);

  resultVol = (resultVol / 1000) * 5 / 4096;
  Serial.println(resultVol);
  resultCurr = (resultVol-3.3) / 0.1;
  Serial.println(resultCurr);

  return resultCurr;
}


void loop() {
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

   int dutyCycle = ThingSpeak.readIntField(myReadChannel,1,myReadAPIKey);
  
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);

    ledcWrite(pwmChannel, dutyCycle);
    float curr = getCurrent();
    float rps = getRPS();
    Serial.print("duty cycle =  ");
    Serial.println(dutyCycle);
    Serial.print("current = ");
    Serial.println(curr);
    Serial.print("Rotations per sec = ");
    Serial.println(rps);

    DataBuffer[DataLen].rps = rps;
    DataBuffer[DataLen].current = curr;
    DataBuffer[DataLen].dutyCycle = dutyCycle;
    DataBuffer[DataLen].t = millis();

    DataLen++;

    pushThingspeak();
    
//    ThingSpeak.setField(1, rps);
//    ThingSpeak.setField(2, curr);
//    ThingSpeak.setField(3, dutyCycle);
//    pushOnem2m(String("["+String(rps)+","+String(curr)+","+String(dutyCycle)+"]"));

//    int x = ThingSpeak.writeFields(myWriteChannel, myWriteAPIKey);
//    if (x == 200) {
//      Serial.println("Channel update successful.");
//    }
//    else {
//      Serial.println("Problem updating channel. HTTP error code " + String(x));
//    }

    Serial.println("---------------------------------------------");

  delay(1 * 1000);
}
