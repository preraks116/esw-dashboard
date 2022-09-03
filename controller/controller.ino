const int motor1Pin1 = 27; 
const int motor1Pin2 = 26; 
const int enable1Pin = 14; 
const int sensorIn = 34;
const int Rpmsensor = 25;
const int freq = 30000;
const int pwmChannel = 0;
const int resolution = 8;
int dutyCycle = 200;

void setup() {
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(enable1Pin, OUTPUT);
//  pinMode(sensorIn, INPUT);
  pinMode(Rpmsensor, INPUT);
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(enable1Pin, pwmChannel);

  Serial.begin(115200);
  Serial.print("Testing DC Motor...");
  WiFi.mode(WIFI_STA); 
  ThingSpeak.begin(client);  // Initialize ThingSpeak
}

int getRPS(){

  unsigned long stTime = millis();
  float Rota = 0;
  unsigned long enTime = stTime + 1000;
  while(millis() < enTime){
//       Serial.println(digitalRead(Rpmsensor));

//    Serial.println(Rota);
    if(digitalRead(Rpmsensor))  {
        Rota +=1;
//        Serial.println(digitalRead(Rpmsensor));
        while(digitalRead(Rpmsensor));
//        Serial.println(digitalRead(Rpmsensor));
        
    }
  }
  Rota /= 20;
  
  return Rota ;
  
}

float getCurrent()
{
  float resultVol = 0;
  float resultCurr;
  for(int i = 0;i<1000;i++){
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
  resultVol = (resultVol/1000)*5/4096;
    Serial.println(resultVol);
  resultCurr = (resultVol-3.575)/0.1;
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
  if(WiFi.status() != WL_CONNECTED){
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    while(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, pwd);  // Connect to WPA/WPA2 network. Change this line if using open or WEP network
      Serial.print(".");
      delay(5000);     
   } 
    Serial.println("\nConnected.");
  }
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);

  for(dutyCycle = 180;dutyCycle <= 255 ; dutyCycle+=5){
    ledcWrite(pwmChannel,dutyCycle);
    float curr = getCurrent();
    float rps = getRPS(); 
    Serial.print("duty cycle =  ");
    Serial.println(dutyCycle);
    Serial.print("current = ");
    Serial.println(curr);
    Serial.print("Rotations per sec = ");
    Serial.println(rps);
    ThingSpeak.setField(1,rps);
    ThingSpeak.setField(2,curr);
    ThingSpeak.setField(3,dutyCycle);

      int x = ThingSpeak.writeFields(myChannelNumber,myWriteAPIKey);
  if(x == 200){
    Serial.println("Channel update successful.");
  }
  else{
    Serial.println("Problem updating channel. HTTP error code " + String(x));
  }
    
    Serial.println("---------------------------------------------");
    
    }
//  while (dutyCycle <= 255){
//    ledcWrite(pwmChannel, dutyCycle);   
//    Serial.print("Forward with duty cycle: ");
//    Serial.println(dutyCycle);
//    dutyCycle = dutyCycle + 5;
//    delay(500);
//  }
//  dutyCycle = 200;
}
