#include <LiquidCrystal.h> // libreria per il display LCD
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <ArduinoJson.h>

//definisco tutti i pin del display LCD
#define rs 13
#define en 12
#define d4 14
#define d5 27
#define d6 26
#define d7 25
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

//variabili per la connessione alla rete e al nostro server
const char* ssid = "TCPBerry_2.4";
const char* password =  "Vmware1!";
String serverName = "http://172.16.5.193:5000/posti";

//NTP Server per ricavare l'ora corrente
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 3600;

// variabili generiche di supporto
int lastTime;
int timerDelay;
int postiPianoTerra=50;
int postiPianoUno=50;
String dataString;
struct tm timeinfo;
int currentHour=0;

void setup() {
  lcd.begin(16, 2); // imposto il numero di colonne e di righe del display LCD
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  lastTime = 0;
  timerDelay = 10000;
  //configuro le impostazioni per ricevere l'orrio in formato corretto
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {
  
  if ((millis() - lastTime) > timerDelay) {
    //Controllo stato connessione
    if(WiFi.status()== WL_CONNECTED){

      //provo a ottenere l'orario attuale con una chiamata al server NTP
      if(!getLocalTime(&timeinfo)){
        Serial.println("Failed to obtain time");
      }
      else
      {
        // se va tutto bene mi salvo i minuti e le ore correnti e me le salvo
        // in formato intero
        char timeHour[3];
        strftime(timeHour,3, "%H", &timeinfo);
        currentHour = atoi(timeHour);
        currentHour=currentHour+1;

        if(currentHour==24)
        {
          currentHour=0;
        }

        // Se l'orario è compreso tra le 00:00 e le 06:00 allora il parcheggio risulta chiuso
        if(currentHour >= 0 && currentHour < 6)
        {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("PARCHEGGIO");
          lcd.setCursor(0, 1);
          lcd.print("CHIUSO");
        }
        else
        {
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

          // Nel caso si verificasse un errore ugualmente il display fa visualizzare gli
          // ultimi dati ricevuti
          
          //setto display per il parcheggio terra
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Piano 00:");
          lcd.setCursor(0, 1);
          if(postiPianoTerra == 0)
            lcd.print("PIENO");
          else
            lcd.print("Liberi: "+String(postiPianoTerra));

          delay(5000);

          //setto display per il parcheggio piano uno
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("Piano 01:");
          lcd.setCursor(0, 1);
          if (postiPianoUno == 0)
            lcd.print("PIENO");
          else
            lcd.print("Liberi: "+String(postiPianoUno));
        }
      }
    }
    else
    {
      Serial.print("Wifi not connected");
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