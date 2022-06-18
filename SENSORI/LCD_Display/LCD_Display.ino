#include <LiquidCrystal.h> // libreria per il display LCD
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

//definisco tutti i pin del display LCD
#define rs 12
#define en 27
#define d4 13
#define d5 14
#define d6 25
#define d7 26
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

//variabili per la connessione alla rete e al server
const char* ssid = "Vodafone-23470597";
const char* password =  "t3sztdhib3zxk6e";
String serverName = "http://192.168.1.4:5000/posti";

// variabili generiche di supporto
int lastTime;
int timerDelay;
int postiPianoTerra=0;
int postiPianoUno=0;
String dataString;

void setup() {
  lcd.begin(16, 2); // imposto il numero di colonne e di righe del display LCD
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  lastTime = 0;
  timerDelay = 6000;
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    
    //Controllo stato connessione
    if(WiFi.status()== WL_CONNECTED){
      dataString = httpGETRequest(serverName); //salvo risposta della chiamata get al server
      
      //la risposta ottenuta in formato stringa la converto in formato oggetto json
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, dataString);

      if(doc["ErrorCode"] != -1) // se va tutto bene e non ci sono errori aggiorno i valori di posti occupati
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
      // in caso di mancata connessione imposto il display con la scritta "ERRORE DI CONNESSIONE"
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

// funzione che effettua la chiamata get al server
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
    
    //mi salvo ugualmente una risposta con un errorcode -1
    payload = "{\"ErrorCode\": -1}";
  }
  // Rilascio le risorse per la connessione
  http.end();

  //ritorno in formato stringa la risposta del server
  return payload;
}
