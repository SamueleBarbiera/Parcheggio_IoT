###                                                             LIBRERIE


#Lettura con raspberry
import RPi.GPIO as GPIO          #Pin generali
from mfrc522 import MFRC522      #Pin lettore RFID
from RPLCD.gpio import CharLCD   #Pin display LCD

#Librerie generali
import signal
import time
import requests as r
import requests.exceptions
from datetime import datetime


###                                                             VARIABILI


#Url base del server raspberry
URL = "http://172.16.5.193:5000/"

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

#PIN LED
RED = 29
GREEN = 31
YELLOW = 33

#PIN BUZZER
BUZZER = 32

#PIN PULSANTI
BUTTONENTRATA = 3
BUTTONUSCITA = 5

#Variabili di controllo(Serve per mantenere sicura la simulazione)
pieno = False
chiuso = False
pulsanteEntrata = False
pulsanteUscita = False
rfidEntrata = False
rfidUscita = False

#Variabili rfid
rc522 = MFRC522()
rfids = []

#Variabile per lo schermo LCD
lcd = CharLCD(numbering_mode=GPIO.BOARD, cols=16, rows=2, pin_rs=40, pin_rw=38, pin_e=35, pins_data=[12,10,8,7])

#imposto la retro illuminazione e nascondo il cursore dell'LCD
lcd.backlight = True
lcd.cursor_mode = 'hide'

#Imposto Pin di Input e Output
GPIO.setup(RED,GPIO.OUT)
GPIO.setup(GREEN,GPIO.OUT)
GPIO.setup(YELLOW,GPIO.OUT)
GPIO.setup(BUZZER,GPIO.OUT)
GPIO.setup(BUTTONENTRATA,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(BUTTONUSCITA,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)


###                                                            FUNZIONI


# Crea un oggetto json da inviare tramite richiesta Api Rest Post per registrare una nuova entrata
def NewEntryJSON(rfid):
    if rfid == "":
        return {"entrata":"button","codice":rfid}
    else:
        return {"entrata":"rfid","codice":rfid}

# Crea un oggetto json da inviare tramite richiesta Api Rest Post per registrare una nuova uscita
def NewExitJSON(exit, code):
    return {"uscita":exit, "codice": code}

# Restituisce il numero di posti parcheggio liberi totali
def getParcheggiLiberi():
    # chiamata Rest Api Get per ottenere i posti parcheggio liberi per piano(in caso di errore restituisce codice -1)
    try:
        response = r.get(url=URL+"posti", timeout=5)
    except(requests.exceptions.ConnectionError, requests.exceptions.Timeout):
        return -1
    except requests.exceptions.HTTPError :
        print("Errore Server")
        return -1
    else:
        # se va tutto bene dalla risposta mi ricavo un oggetto json con la struttura 
        # {"posti":{"0":postiLiberiPianoTerra,"1":postiLiberiPrimoPiano}} 
        # restituisce infine la somma dei posti liberi per piano
        responseJSON = response.json()
        return responseJSON["posti"]["0"]+responseJSON["posti"]["1"]

# impostazione del buzzer e del LED giallo in caso si verifica un'anomalia generale(errore di connessione o errore server)
def allarmeGenerico():
    doItFor = 3
    countBeepYellow = 0
    while countBeepYellow < doItFor:
        GPIO.output(YELLOW,1)
        GPIO.output(BUZZER,1)
        time.sleep(0.100)
        GPIO.output(BUZZER,0)
        time.sleep(0.050)
        GPIO.output(BUZZER,1)
        time.sleep(0.100)
        GPIO.output(BUZZER,0)
        GPIO.output(YELLOW,0)
        time.sleep(0.500)
        countBeepYellow += 1

# impostazione del buzzer e del LED rosso in caso il codice RFID letto risulta non valido
def rfidNonValido():
    GPIO.output(RED,1)
    GPIO.output(BUZZER,1)
    time.sleep(1)
    GPIO.output(BUZZER,0)
    time.sleep(4)
    GPIO.output(RED,0)

# impostazione del buzzere e del LED verde in caso l'operazione corrente è andata a buon fine
def operazioneConclusa():
    GPIO.output(GREEN,1)
    GPIO.output(BUZZER,1)
    time.sleep(0.200)
    GPIO.output(BUZZER,0)
    time.sleep(4)
    GPIO.output(GREEN,0)


###                                                          CALLBACKS


#quando premo il pulsante di entrata
def buttonEntrata_callback(channel):
    global lcd, pulsanteEntrata, pulsanteUscita, pieno, chiuso, rfidEntrata, rfidUscita
    
    # eseguo la funzione solo se il parcheggio è aperto, non risulta pieno o se non sono in esecuzione altre operazioni
    if pieno == False and pulsanteUscita == False and chiuso == False and rfidEntrata == False and rfidUscita == False:
        pulsanteEntrata = True  # booleano di controllo che imposta l'operazione di entrata tramite pulsante attiva
        jsonObject = NewEntryJSON("")

        # eseguo richiesta post di check-in al server
        try:
            response = r.post(url=URL+"check-in",json=jsonObject,timeout=5)
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            # in caso di errore di connessione al server o di timeout della richiesta
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("SERVER")
            lcd.cursor_pos=(1,0)
            lcd.write_string("NON RAGGIUNGIBILE")
            allarmeGenerico()
            time.sleep(3)
        except requests.exceptions.HTTPError :
            # in caso di errore interno del server
            print("Errore Server")
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("ERRORE")
            lcd.cursor_pos=(1,0)
            lcd.write_string("RICEZIONE DATI")
            allarmeGenerico()
            time.sleep(3)
        else:
            # se tutto va bene
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("RITIRO BIGLIETTO")
            lcd.cursor_pos=(1,0)
            lcd.write_string("CANCELLO APERTO")
            operazioneConclusa()
            response.close()
        pulsanteEntrata=False

# quando premo il pulsante di uscita
def buttonUscita_callback(channel):
    global lcd, pulsanteUscita, pulsanteEntrata, chiuso, rfidEntrata, rfidUscita
    
    # eseguo la funzione solo se il parcheggio risulta aperto e se non sono in esecuzione altre operazioni
    if pulsanteEntrata == False and chiuso == False and rfidEntrata == False and rfidUscita == False:
        pulsanteUscita = True # booleano di controllo che imposta l'operazione di uscita tramite pulsante attiva
        jsonObject = NewExitJSON("button", "")

        # eseguo richiesta post di check-out al server
        try:
            response = r.post(url=URL+"check-out",json=jsonObject,timeout=5)
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            # in caso di errore di connessione al server o di timeout della richiesta
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("SERVER")
            lcd.cursor_pos=(1,0)
            lcd.write_string("NON RAGGIUNGIBILE")
            allarmeGenerico()
            time.sleep(3)
        except requests.exceptions.HTTPError :
            # in caso di errore interno del server
            print("Errore Server")
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("ERRORE")
            lcd.cursor_pos=(1,0)
            lcd.write_string("RICEZIONE DATI")
            allarmeGenerico()
            time.sleep(3)
        else:
            # se tutto va bene
            responseJson = response.json()
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("IMPORTO")
            lcd.cursor_pos=(1,0)
            lcd.write_string(responseJson["costo"]) # dalla risposta mi ricavo il costo del parcheggio
            time.sleep(3) 
            lcd.cursor_pos=(0,0)
            lcd.write_string("PAGAMENTO")
            lcd.cursor_pos=(1,0)
            lcd.write_string("EFFETTUATO")
            operazioneConclusa()
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("ARRIVEDERCI")
            lcd.cursor_pos=(1,0)
            lcd.write_string("E GRAZIE")
            time.sleep(3)
            response.close()
        pulsanteUscita = False

# quando da terminale premo ctrl+c(termino il programma)
def handlerCTRL(signum, frame):
    global lcd

    # resetto tutte le variabili interessate(spengo i LED e termino il display LCD)
    GPIO.output(RED,0)
    GPIO.output(GREEN,0)
    GPIO.output(YELLOW,0)
    lcd.clear()
    lcd.close()
    exit(1)
 
# imposto i callback
signal.signal(signal.SIGINT, handlerCTRL)
GPIO.add_event_detect(BUTTONENTRATA,GPIO.RISING,callback=buttonEntrata_callback)
GPIO.add_event_detect(BUTTONUSCITA,GPIO.RISING,callback=buttonUscita_callback)

#ciclo infinito
while True:
    # ogni ciclo mi salvo la data e l'orario attuale
    timeNow = datetime.now()

    # se l'orario attuale risulta compreso dalle 00:00 alle 06:00 il parcheggio risulta chiuso, imposto il LED rosso 
    # e ricomincia un nuovo ciclo
    if timeNow.hour >= 0 and timeNow.hour < 6: 
        if GPIO.input(RED) == 0:
            lcd.clear()
            lcd.cursor_pos=(0,0)
            lcd.write_string("PARCHEGGIO")
            lcd.cursor_pos=(1,0)
            lcd.write_string("CHIUSO")
            GPIO.output(RED,1)
        chiuso = True # booleano di controllo che indica il parcheggio chiuso
    else:
        # se invece l'orario attuale non è compreso nell'intervallo precedente 
        # imposto la variabile di controllo "chiuso" a False, spengo il LED rosso
        # (in caso nel precedente ciclo il parcheggio risultasse chiuso) 
        # e ottengo il numero di posti parcheggio liberi totali
        chiuso = False
        if GPIO.input(RED) == 1:
            GPIO.output(RED,0)
        parcheggiLiberi = getParcheggiLiberi()

        # se durante l'operazione per ottenere il numero di posti parcheggio liberi totali si verifica un errore
        # ottengo un codice -1 come risposta, dunque imposto il LED giallo e ricomincia un nuovo ciclo
        if parcheggiLiberi == -1:
            if GPIO.input(YELLOW) == 0:
                lcd.clear()
                lcd.cursor_pos=(0,0)
                lcd.write_string("SERVER NON")
                lcd.cursor_pos=(1,0)
                lcd.write_string("RAGGIUNGIBILE")
                GPIO.output(YELLOW,1)
        else:
            # se invece l'operazione per ottenere il numero di posti parcheggio liberi totali va a buon fine
            # spengo il LED giallo in caso di errori precedenti
            if GPIO.input(YELLOW) == 1:
                GPIO.output(YELLOW,0)

            # poi controllo se il numero di posti parcheggio liberi totali equivale a 0 vuol dire
            # che il parcheggio risulta pieno e imposto il LED rosso
            if parcheggiLiberi == 0:
                if GPIO.input(RED) == 0:
                    lcd.clear()
                    lcd.cursor_pos=(0,0)
                    lcd.write_string("PARCHEGGIO")
                    lcd.cursor_pos=(1,0)
                    lcd.write_string("PIENO")
                    GPIO.output(RED,1)
                pieno = True # booleano di controllo che indica il parcheggio chiuso
            else:
                # altrimenti il parcheggio risulta disponibile, quindi imposto la variabile di controllo "pieno" a False
                # e spengo il LED rosso(in caso nel precedente ciclo il parcheggio risultasse pieno) 
                pieno = False
                if GPIO.input(RED) == 1:
                    GPIO.output(RED,0)
            
            # sfruttando le variabili di controllo imposto il display LCD rendendo il parcheggio disponibile
            if pieno == False and pulsanteEntrata == False and pulsanteUscita == False:
                lcd.clear()
                lcd.cursor_pos=(0,0)
                lcd.write_string("PARCHEGGIO")
                lcd.cursor_pos=(1,0)
                lcd.write_string("DISPONIBILE")

            # a questo punto controlla se una scheda o badge RFID è stato passato  
            (status,TagType) = rc522.MFRC522_Request(rc522.PICC_REQIDL)
            
            # successivamente ottiene il suo uid(codice RFID)
            # la funzione Anticoll permette di evitare collisioni in caso più RFID vengano passati sul lettore
            (status,uid) = rc522.MFRC522_Anticoll() 
        
            # se l'uid è stato ottenuto continuo il ciclo, altrimenti(uid non trovato o RFID non letto) ricomincia un nuovo ciclo
            if status == rc522.MI_OK:
                # converto l'uid in stringa
                uidString = ""
                for byteUID in uid:
                    uidString += str(byteUID)

                print("RFID Ricevuto: "+uidString)

                # se l'uid ottenuto risulta presente nella lista "rfids"(quindi un uid già entrato) 
                # e se non sono in esecuzione altre operazioni
                if uidString in rfids and rfidEntrata == False and pulsanteEntrata == False and pulsanteUscita==False:
                    rfidUscita = True # booleano di controllo che imposta l'operazione di uscita tramite RFID attiva
                    jsonObjectUscita = NewExitJSON("rfid",uidString)

                    # chiamata Rest Api Post di check-out al server
                    try:
                        responseUscita = r.post(url=URL+"check-out", json=jsonObjectUscita, timeout=5)
                        responseUscita.raise_for_status()
                    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                        # in caso di errore di connessione al server o di timeout della richiesta
                        lcd.clear()
                        lcd.cursor_pos=(0,0)
                        lcd.write_string("SERVER NON")
                        lcd.cursor_pos=(1,0)
                        lcd.write_string("RAGGIUNGIBILE")
                        allarmeGenerico()
                    except requests.exceptions.HTTPError :
                        # in caso di errore interno del Server
                        print("Errore Server")
                        lcd.clear()
                        lcd.cursor_pos=(0,0)
                        lcd.write_string("ERRORE")
                        lcd.cursor_pos=(1,0)
                        lcd.write_string("RICEZIONE DATI")
                        allarmeGenerico()
                    else:
                        # se va tutto bene visualizzo l'importo da pagare
                        # e che il pagamento è andato a buon fine
                        responseUscitaJson = responseUscita.json()
                        lcd.clear()
                        lcd.cursor_pos=(0,0)
                        lcd.write_string("IMPORTO")
                        lcd.cursor_pos=(1,0)
                        lcd.write_string(responseUscitaJson["costo"])
                        time.sleep(3)    
                        lcd.cursor_pos=(0,0)
                        lcd.write_string("PAGAMENTO")
                        lcd.cursor_pos=(1,0)
                        lcd.write_string("EFFETTUATO")
                        operazioneConclusa()
                        lcd.clear()
                        lcd.cursor_pos=(0,0)
                        lcd.write_string("ARRIVEDERCI")
                        lcd.cursor_pos=(1,0)
                        lcd.write_string("E GRAZIE")
                        time.sleep(3)
                        rfids.remove(uidString)
                        responseUscita.close()
                    rfidUscita = False
                
                # altrimenti(quindi l'RFID è nuovo) se il parcheggio risulta disponibile
                # e se non sono in esecuzione altre operazioni
                elif pieno == False and rfidUscita == False and pulsanteEntrata == False and pulsanteUscita==False:
                    rfidEntrata = True # booleano di controllo che imposta l'operazione di entrata tramite RFID attiva

                    # chiamata Rest Api Post di check-out al server
                    try:
                        jsonObjectEntrata = NewEntryJSON(uidString)
                        responseEntrata = r.post(url=URL+"check-in", json=jsonObjectEntrata, timeout=5)
                        responseEntrata.raise_for_status()
                    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                        # in caso di errore di connessione al server o di timeout della richiesta
                        lcd.clear()
                        lcd.cursor_pos=(0,0)
                        lcd.write_string("SERVER NON")
                        lcd.cursor_pos=(1,0)
                        lcd.write_string("RAGGIUNGIBILE")
                        allarmeGenerico()
                        time.sleep(3)
                    except requests.exceptions.HTTPError :
                        # in caso di errore interno del Server
                        print("Errore Server")
                        lcd.clear()
                        lcd.cursor_pos=(0,0)
                        lcd.write_string("ERRORE")
                        lcd.cursor_pos=(1,0)
                        lcd.write_string("RICEZIONE DATI")
                        allarmeGenerico()
                        time.sleep(3)
                    else:
                        # se va tutto bene ricava dalla risposta un oggetto json {"trovato":True/False}
                        responseEntrataJSON = responseEntrata.json()
                        if responseEntrataJSON["trovato"]:
                            # l'RFID risulta assegnato correttamente a un utente
                            lcd.clear()
                            lcd.cursor_pos=(0,0)
                            lcd.write_string("RFID CONVALIDATO")
                            lcd.cursor_pos=(1,0)
                            lcd.write_string("CANCELLO APERTO")
                            rfids.append(uidString)
                            operazioneConclusa()
                        else:
                            # oppure se l'RFID è sconsociuto o non assegnato a nessun utente
                            lcd.clear()
                            lcd.cursor_pos=(0,0)
                            lcd.write_string("ERRORE")
                            lcd.cursor_pos=(1,0)
                            lcd.write_string("RFID NON VALIDO")
                            rfidNonValido()
                        responseEntrata.close()
                    rfidEntrata = False
    time.sleep(1)