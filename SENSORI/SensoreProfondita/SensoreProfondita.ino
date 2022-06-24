#include <WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define LED_FIRST 16
#define LED_SECOND 17
#define TRIG_PIN_FIRST 26
#define TRIG_PIN_SECOND 25
#define ECHO_PIN_FIRST 13
#define ECHO_PIN_SECOND 12

// defines variables
long durationFirst, durationSecond;
String firstParking = "0010", secondParking = "0011", startFirstDate = "", startSecondDate = "";
float distanceFirst, distanceSecond;
float countFirst, countSecond;
const char* ssid = "SESSO";
const char* password =  "zuik2486";
String serverName = "http://192.168.66.222:5000/prossimita";
String dataString = "";
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

void setup(){
  // firstParking = random(1, 48);
  // secondParking = firstParking+1;
  pinMode(LED_FIRST, OUTPUT);
  pinMode(LED_SECOND, OUTPUT);

  WiFi.begin(ssid, password);
  pinMode(TRIG_PIN_FIRST, OUTPUT); // Sets the TRIG_PIN_FIRST as an OUTPUT
  pinMode(ECHO_PIN_FIRST, INPUT); // Sets the ECHO_PIN_FIRST as an INPUT

  pinMode(TRIG_PIN_SECOND, OUTPUT);
  pinMode(ECHO_PIN_SECOND, INPUT);

  timeClient.begin();
  timeClient.setTimeOffset(3600);
  
  Serial.begin(9600); // // Serial Communication is starting with 9600 of baudrate speed
  Serial.println("Application start...");
}

void ResponceCode(int httpResponseCode){
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
}

void sensorPost(String json, String path){
  HTTPClient http;

  http.begin(path);
  http.addHeader("Content-Type", "application/json");
  //Serial.println(json);
  int httpResponseCode = http.POST(json);
  ResponceCode(httpResponseCode);
  String response = http.getString();
  Serial.println(httpResponseCode);
  Serial.println(response);
  http.end();
}

float readDistance(int ultrasonic_trigger, int ultrasonic_echo){
    delay(500);
    // generate 10-microsecond pulse to TRIG pin
    digitalWrite(ultrasonic_trigger, HIGH);
    delayMicroseconds(10);
    digitalWrite(ultrasonic_trigger, LOW);

    // measure duration of pulse from ECHO pin
    float duration_us = pulseIn(ultrasonic_echo, HIGH);

    // calculate the distance
    return 0.017 * duration_us;
}

//return true if the park is occupied
bool readStatus(int ultrasonic_trigger, int ultrasonic_echo){
    float currentDistance = readDistance(ultrasonic_trigger, ultrasonic_echo);
    return (currentDistance < 10);
}

void sendJson(int n, bool stato){
  if(WiFi.status() == WL_CONNECTED)
  {
    StaticJsonDocument<256> doc;
    if (n == 0)
    {
      //sensore 0
      JsonObject sensore_0 = doc.createNestedObject(String(firstParking));
      //JsonObject sensore_0_0 = sensore_0.createNestedObject(String(firstParking));
      sensore_0["distanza"] = distanceFirst;
      sensore_0["stato"] = stato;
      if(stato == false)
      {
        sensore_0["sosta"] = startFirstDate;
        startFirstDate = "";
      }
    }
    else if (n == 1)
    {
      //sensore 1
      JsonObject sensore_0 = doc.createNestedObject(String(secondParking));
      //JsonObject sensore_0_0 = sensore_0.createNestedObject(String(firstParking));
      sensore_0["distanza"] = distanceSecond;
      sensore_0["stato"] = stato;
      if(stato == false)
      {
        sensore_0["sosta"] = startSecondDate;
        startSecondDate = "";
      }
    }

    String json;
    serializeJson(doc, json);
    sensorPost(json, serverName);
  }
  else {
    Serial.println("WiFi Disconnected");
  }
}

void loop(){
  timeClient.update();

  distanceFirst = readDistance(TRIG_PIN_FIRST, ECHO_PIN_FIRST);
  Serial.println("Distance Parking " + String(firstParking) + ": " + String(distanceFirst) + " cm");

  if (readStatus(TRIG_PIN_FIRST, ECHO_PIN_FIRST))
  {
    digitalWrite(LED_FIRST, HIGH);
    sendJson(0, true);
    countFirst = true;
    if(startFirstDate == ""){
      startFirstDate = timeClient.getFormattedDate();
    }
  }
  else
  {
    if(countFirst == true)
    {
      digitalWrite(LED_FIRST, LOW);
      sendJson(0, false);
      countFirst = false;
    }
  }

  distanceSecond = readDistance(TRIG_PIN_SECOND, ECHO_PIN_SECOND);
  Serial.println("Distance Parking " + String(secondParking) + ": " + String(distanceSecond) + " cm");

  if (readStatus(TRIG_PIN_SECOND, ECHO_PIN_SECOND))
  {
    digitalWrite(LED_SECOND, HIGH);
    sendJson(1, true);
    countSecond = true;
    if(startSecondDate == ""){
      startSecondDate = timeClient.getFormattedDate();
    }
  }
  else
  {
    if(countSecond == true)
    {
      digitalWrite(LED_SECOND, LOW);
      sendJson(1, false);
      countSecond = false;
    }
  }
}