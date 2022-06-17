import RPi.GPIO as GPIO #Importe la bibliothèque pour contrôler les GPIOs
from pirc522 import RFID
import eventlet
import time
import requests as r
import requests.exceptions

URL = "http://192.168.66.241:5000/"

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

RED = 29
GREEN = 31
YELLOW = 33
SONAR = 3

GPIO.setup(RED,GPIO.OUT)
GPIO.setup(GREEN,GPIO.OUT)
GPIO.setup(YELLOW,GPIO.OUT)
GPIO.setup(SONAR,GPIO.OUT)

rc522 = RFID()

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
            try:
                response = r.get(url=URL+"cancello", json=jsonOBJ)
                response.raise_for_status()
                print("Fatto")
            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                print("Down")
                GPIO.output(YELLOW,1)
                GPIO.output(SONAR,1)
                time.sleep(0.100)
                GPIO.output(SONAR,0)
                time.sleep(0.050)
                GPIO.output(SONAR,1)
                time.sleep(0.100)
                GPIO.output(SONAR,0)
                GPIO.output(YELLOW,0)

            except requests.exceptions.HTTPError:
                print("4xx, 5xx")
                GPIO.output(YELLOW,1)
                GPIO.output(SONAR,1)
                time.sleep(0.100)
                GPIO.output(SONAR,0)
                time.sleep(0.050)
                GPIO.output(SONAR,1)
                time.sleep(0.100)
                GPIO.output(SONAR,0)
                GPIO.output(YELLOW,0)
            else:
                print("All good!")  # Proceed to do stuff with `r` 
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
                        print(response.content)
                        GPIO.output(GREEN,1)
                        GPIO.output(SONAR,1)
                        time.sleep(1)
                        GPIO.output(SONAR,0)
                        time.sleep(2)
                        GPIO.output(GREEN,0)
            finally:
                response.close()

            time.sleep(1)