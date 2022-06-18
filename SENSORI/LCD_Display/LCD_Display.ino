// include the library code:
#include <LiquidCrystal.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// initialize the library by associating any needed LCD interface pin
// with the arduino pin number it is connected to
#define rs 12
#define en 27
#define d4 13
#define d5 14
#define d6 25
#define d7 26
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

const char* ssid = "Vodafone-23470597";
const char* password =  "t3sztdhib3zxk6e";
String serverName = "http://192.168.1.4:5000/posti";
int lastTime;
int timerDelay;
int postiPianoTerra=0;
int postiPianoUno=0;

String dataString;

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  lastTime = 0;
  timerDelay = 6000;
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    
    //Controllo stato connessione
    if(WiFi.status()== WL_CONNECTED){
      dataString = httpGETRequest(serverName);
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, dataString);

      if(doc["ErrorCode"] != -1)
      {
        postiPianoTerra = int(doc["posti"]["0"]);
        postiPianoUno = int(doc["posti"]["1"]);
  
        Serial.println(postiPianoTerra);
        Serial.println(postiPianoUno);
      }
  
      //setto display per il parcheggio terra
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Parcheggio 00:");
      lcd.setCursor(0, 1);
      lcd.print(String(postiPianoTerra)+"/50");

      delay(3000);

      //setto display per il parcheggio piano uno
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Parcheggio 01:");
      lcd.setCursor(0, 1);
      lcd.print(String(postiPianoUno)+"/50");
    }
    else {
      Serial.println("WiFi Disconnected");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("ERRORE DI");
      lcd.setCursor(0,1);
      lcd.print("CONNESSIONE");
    }
    lastTime = millis();
  }
  
}

String httpGETRequest(String serverName) {
  WiFiClient client;
  HTTPClient http;
    
  // richiedo connessione al server
  http.begin(client, serverName);
  
  // invio richiesta
  int httpResponseCode = http.GET();

  //risposta dal server
  String payload = "{}"; 

  // se va tutto bene
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    //mi salvo la risposta
    payload = http.getString();
  }
  //altrimenti
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    payload = "{\"ErrorCode\": -1}";
  }
  // Rilascio le risorse per la connessione
  http.end();

  //ritorno in formato stringa la risposta del server
  return payload;
}
