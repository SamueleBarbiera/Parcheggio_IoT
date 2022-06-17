import signal
import time
import sys
import RPi.GPIO as GPIO
import time
from datetime import datetime
import json
from paho.mqtt.client import Client
CLIENT = Client(client_id="client_swag_gattino_barca")



ip="broker.emqx.io"
def creaJson(stato):
    json = {
            "RFID": stato,
            "Timestamp": str(datetime.now())

        }
    mqttpublish(json)

def mqttpublish(jsondata):
    CLIENT.connect(ip, 1883, 60)
    y = json.dumps(jsondata)
    CLIENT.publish(topic=f"InvioDatiRFID/", payload=y)
    print(f'Inviato: {y}')



ledverze = 5
ledosso = 7
from pirc522 import RFID
 
run = True
rdr = RFID()
util = rdr.util()
util.debug = True


GPIO.setup(ledverze,GPIO.OUT) #led
GPIO.setup(ledosso,GPIO.OUT) #led
def end_read(signal, frame):
    global run
    print("\nCtrl+C captured, ending read.")
    run = False
    rdr.cleanup()
    sys.exit()
 
 
signal.signal(signal.SIGINT, end_read)

def controllarfiddb(codice):
    i=0
    carteautorizzate=[[244,170,178,137,101],[86,195,39,172,30]]

    for x in carteautorizzate:
        if codice[0]==x[0] and codice[1]==x[1] and codice[2]==x[2] and codice[3]==x[3] and codice[4]==x[4]:
            i=1
            break
    return i 

print("Starting")
GPIO.output(ledverze, 0)
GPIO.output(ledosso, 0)

while run:

    (error, data) = rdr.request()
    if not error:
        print("\nDetected: " + format(data, "02x"))
 
    (error, uid) = rdr.anticoll()
    if not error:
        #print("Card read UID: " + str(uid[0]) + "," + str(uid[1]) + "," +str(uid[2]) + "," + str(uid[3]))
        print(uid)
        numero=controllarfiddb(uid)
        if numero==1:
            print ("LED on")
            GPIO.output(ledverze, 1)
            GPIO.output(ledosso, 0)
            
        else:
            print ("LED off")
            GPIO.output(ledosso, 1)
            GPIO.output(ledverze, 0)
            
        creaJson(uid)
        time.sleep(1)
        GPIO.output(ledverze, 0)
        GPIO.output(ledosso, 0)
        