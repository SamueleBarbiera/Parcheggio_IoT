import RPi.GPIO as GPIO
from pirc522 import RFID
import time
import requests as r
import requests.exceptions
import random as rnd
from datetime import datetime

URL = "http://192.168.66.241:5000/"

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

RED = 29
GREEN = 31
YELLOW = 33
SONAR = 3
BUTTONENTRATA = 5
BUTTONUSCITA = 32

rc522 = RFID()
rfids = []
count_button = 0
    
GPIO.setup(RED,GPIO.OUT)
GPIO.setup(GREEN,GPIO.OUT)
GPIO.setup(YELLOW,GPIO.OUT)
GPIO.setup(SONAR,GPIO.OUT)
GPIO.setup(BUTTONENTRATA,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(BUTTONUSCITA,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)

def sendPostNewEntry(rfid):
    today = datetime.now()
    if today.hour == 23 and today.minute <= 30:
        jsonOBJ = {"rfid":rfid,"durata":30}
        try:
            r.post(url=URL+"entrata",json=jsonOBJ,timeout=5)
        except(requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            print("Server è in down")
            return False
        except requests.exceptions.HTTPError as e:
            print("ERRORE: "+e.args)
            return False
        else:
            return True
    elif today.hour >= 6:
        oreDisponibili = 24-today.hour
        minutiDisponibili = (60 * oreDisponibili)-today.minute
        durata = rnd.randint(30, minutiDisponibili)
        jsonOBJ = {"rfid":rfid,"durata":durata}
        try:
            r.post(url=URL+"entrata",json=jsonOBJ,timeout=5)
        except(requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            print("Server è in down")
            return False
        except requests.exceptions.HTTPError as e:
            print("ERRORE: "+e.args)
            return False
        else:
            return True

def sendPostNewExit(rfid): #non credo serva
    jsonOBJ = {"rfid":rfid}
    r.post(url=URL+"uscita",json=jsonOBJ)

def buttonEntrata_callback(channel):
    if sendPostNewEntry(""):
        print("Utente senza RFID Entrato")

        GPIO.output(GREEN,1)
        GPIO.output(SONAR,1)
        time.sleep(0.200)
        GPIO.output(SONAR,0)
        time.sleep(2)
        GPIO.output(GREEN,0)  
    else:
        doItFor = 3
        countBeepYellow = 0
        while countBeepYellow < doItFor:
            GPIO.output(YELLOW,1)
            GPIO.output(SONAR,1)
            time.sleep(0.100)
            GPIO.output(SONAR,0)
            time.sleep(0.050)
            GPIO.output(SONAR,1)
            time.sleep(0.100)
            GPIO.output(SONAR,0)
            GPIO.output(YELLOW,0)
            time.sleep(0.500)
            countBeepYellow += 1

def buttonUscita_callback(channel):
    #sendPostNewExit("")
    print("Utente senza RFID Entrato")

    GPIO.output(GREEN,1)
    GPIO.output(SONAR,1)
    time.sleep(0.200)
    GPIO.output(SONAR,0)
    time.sleep(2)
    GPIO.output(GREEN,0)

GPIO.add_event_detect(BUTTONENTRATA,GPIO.RISING,callback=buttonEntrata_callback)
GPIO.add_event_detect(BUTTONUSCITA,GPIO.RISING,callback=buttonUscita_callback)

print('In attesa di un badge o schedina (per uscire, Ctrl + c): ')

while True:
    rc522.wait_for_tag()
    (error, tag_type) = rc522.request()

    if not error :
        (error, uid) = rc522.anticoll()

        if not error :
            uidString = ""
            for byteUID in uid:
                uidString += str(byteUID)

            jsonOBJ = {'codice': uidString}
            print("RFID Ricevuto")
            if uidString in rfids:
                print("Utente "+uidString+" sta uscendo")
                rfids.remove(uidString)
                GPIO.output(GREEN,1)
                GPIO.output(SONAR,1)
                time.sleep(0.200)
                GPIO.output(SONAR,0)
                time.sleep(2)
                GPIO.output(GREEN,0)
            else:
                try:
                    response = r.get(url=URL+"cancello", json=jsonOBJ, timeout=5)
                    response.raise_for_status()
                except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                    print("Down")
                    doItFor = 3
                    countBeepYellow = 0
                    while countBeepYellow < doItFor:
                        GPIO.output(YELLOW,1)
                        GPIO.output(SONAR,1)
                        time.sleep(0.100)
                        GPIO.output(SONAR,0)
                        time.sleep(0.050)
                        GPIO.output(SONAR,1)
                        time.sleep(0.100)
                        GPIO.output(SONAR,0)
                        GPIO.output(YELLOW,0)
                        time.sleep(0.500)
                        countBeepYellow += 1

                except requests.exceptions.HTTPError:
                    print("4xx, 5xx")
                    doItFor = 3
                    countBeepYellow = 0
                    while countBeepYellow < doItFor:
                        GPIO.output(YELLOW,1)
                        GPIO.output(SONAR,1)
                        time.sleep(0.100)
                        GPIO.output(SONAR,0)
                        time.sleep(0.050)
                        GPIO.output(SONAR,1)
                        time.sleep(0.100)
                        GPIO.output(SONAR,0)
                        GPIO.output(YELLOW,0)
                        time.sleep(0.500)
                        countBeepYellow += 1
                else:
                    if response.status_code != 200:
                        
                        while response.status_code != 200:
                            GPIO.output(YELLOW,1)
                            GPIO.output(SONAR,1)
                            time.sleep(1)
                            GPIO.output(SONAR,0)
                            GPIO.output(YELLOW,0)
                            time.sleep(2)
                            response = r.get(url=URL+"cancello", json=jsonOBJ)

                    if response.status_code == 200:
                        if response.text == "":
                            GPIO.output(RED,1)
                            GPIO.output(SONAR,1)
                            time.sleep(1)
                            GPIO.output(SONAR,0)
                            time.sleep(2)
                            GPIO.output(RED,0)
                        else:
                            print(response.text)
                            if sendPostNewEntry(uidString):
                                rfids.append(uidString)
                                GPIO.output(GREEN,1)
                                GPIO.output(SONAR,1)
                                time.sleep(0.200)
                                GPIO.output(SONAR,0)
                                time.sleep(2)
                                GPIO.output(GREEN,0)
                            else:
                                GPIO.output(YELLOW,1)
                                GPIO.output(SONAR,1)
                                time.sleep(0.100)
                                GPIO.output(SONAR,0)
                                time.sleep(0.050)
                                GPIO.output(SONAR,1)
                                time.sleep(0.100)
                                GPIO.output(SONAR,0)
                                GPIO.output(YELLOW,0)
                        response.close()

            time.sleep(1)