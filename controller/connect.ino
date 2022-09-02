#include "WiFi.h"
#include "PubSubClient.h"
#include "ThingSpeak.h"
#include "HTTPClient.h"

#include "connect.h"

WiFiClient wclient;
PubSubClient client(wclient);

void connectWifi() {
  WiFi.begin(ssid, pwd);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
}

void pushOnem2m(String& val)
{
  HTTPClient http;
  http.begin(server + ae + "/" + cnt + "/");
  http.addHeader("X-M2M-Origin", "admin:admin");
  http.addHeader("Content-Type", "application/json;ty=4");
  int code = http.POST("{\"m2m:cin\": {\"cnf\":\"application/json\",\"con\": " + String(val) + "}}");
  Serial.println(code);
  if (code == -1)
    Serial.println("Connection failed");
  http.end();
}

class MQTT {
  private:
    static void mqttSubscriptionCallback( char* topic, byte* payload, unsigned int length ) {
      // Print the details of the message that was received to the serial monitor.
      Serial.print("Message arrived [");
      Serial.print(topic);
      Serial.print("] ");
      for (int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
      }

      //  if (length >= 1)
      //  {
      //    if (payload[0] == '1')
      //      digitalWrite(2,HIGH);
      //    else
      //      digitalWrite(2,LOW);
      //  }

      Serial.println();
    }

    void reconnect() {
      // Loop until we're reconnected
      while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        if (client.connect(clientID, mqttUser, apikey)) {
          Serial.println("connected");
        } else {
          Serial.print("failed, rc=");
          Serial.print(client.state());
          Serial.println(" try again in 5 seconds");
          // Wait 5 seconds before retrying
          delay(1000);
        }
      }
    }
  public:
    void setup() {
      client.setServer(tsserver, 1883);
      client.setCallback(mqttSubscriptionCallback);
    }


    void loop() {
      if (!client.connected())
      {
        reconnect();
        String myTopic = "channels/" + String( subChID ) + "/subscribe/fields/field1";
        client.subscribe(myTopic.c_str());
      }
      client.loop();
    }

    void publish(String& data) {
      String topicString = "channels/" + String(chID) + "/publish";
      String dataString = "field1=" + String(data);
      client.publish(topicString.c_str(), dataString.c_str());
    }

};
