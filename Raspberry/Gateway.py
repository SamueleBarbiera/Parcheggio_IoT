#import psycopg2
import requests as rq
import json
import pandas as pd
import numpy as np
import random as ran
import flask as fk
import sqlite3
from sqlite3.dbapi2 import Error
from datetime import datetime, timedelta
import time
import mysql.connector
import cuid
  
#http://10.30.134.19:3000/
CLOUD = "https://parcheggio-iot.vercel.app/"

app = fk.Flask(__name__)
app.config["DEBUG"] = True

def createTables():
  createTablesCommands = [
      """ CREATE TABLE IF NOT EXISTS tickets (
        ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
        entrata TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uscita TIMESTAMP,
        costo REAL,
        rfid_codice VARCHAR (255)
        );""",
      """ CREATE TABLE IF NOT EXISTS utenti (
        utente_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR (255) NOT NULL,
        email VARCHAR (255) NOT NULL,
        emailVerified VARCHAR (255) NOT NULL,
        image VARCHAR (255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP
        );""",
      """ CREATE TABLE IF NOT EXISTS rfids (
        rfid_id INTEGER PRIMARY KEY AUTOINCREMENT,
        codice VARCHAR(255) NOT NULL,
        stato BOOLEAN NOT NULL,
        user_id_fk INTEGER UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP,
        FOREIGN KEY(user_id_fk) REFERENCES utenti(utente_id)
        );""",
      """ CREATE TABLE IF NOT EXISTS parcheggi (
        parcheggio_id INTEGER PRIMARY KEY AUTOINCREMENT,
        n_parcheggio VARCHAR (255) NOT NULL,
        stato BOOLEAN NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP
        ); """,
      """CREATE TABLE IF NOT EXISTS durate (
        durata_id INTEGER PRIMARY KEY AUTOINCREMENT,
        parcheggio_id_fk INTEGER NOT NULL,
        tempo_calcolato FLOAT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP,
        FOREIGN KEY(parcheggio_id_fk) REFERENCES parcheggi(parcheggio_id)
        );"""
      ]
  conn = sqlite3.connect('Raspberry/ParkingTest.db')
  if conn is not None:
    try:
      for command in createTablesCommands:
        c = conn.cursor()
        c.execute(command)
        conn.commit()
        c.close()

    except Error as e:
        print(e)
    finally:
      conn.close()

    conn = sqlite3.connect('Raspberry/ParkingTest.db')
    results = conn.cursor().execute("SELECT * FROM utenti").fetchall()
    if results.__len__() == 0:
      populateTables()

def populateTables():
  insertDataCommands = ["tickets" ,"utenti", "rfids",  "parcheggi"]
  rfids = [15725016189159,21721418013750,1921269426250,1184298172146, ""]

  #mysql://5lak2a276iet:pscale_pw_Ui_CnfJRVTvWG6A4FzBmCuQmMfVukpreh_5F0ES05MM@3c48ak2k4r4j.eu-central-2.psdb.cloud/parcheggio-iot?sslaccept=strict
  cloudConnection = mysql.connector.connect(
    host = "3c48ak2k4r4j.eu-central-2.psdb.cloud",
    user = "5lak2a276iet",
    passwd = "pscale_pw_Ui_CnfJRVTvWG6A4FzBmCuQmMfVukpreh_5F0ES05MM",
    database = "parcheggio-iot"
  )
  
  conn = sqlite3.connect('Raspberry/ParkingTest.db')
  if conn is not None:
    try:
      cursor = conn.cursor()
      cloudCursor = cloudConnection.cursor()
      # cloudCursor.execute("DELETE FROM durata;")
      # cloudConnection.commit()
      
      for table in insertDataCommands:
        command = ""
        if table == "tickets":
          print("Inizio inserimento tickets:")
          sub_days = 11
          for n in range(1000):
            if n % 100 == 0:
              sub_days -= 1
            data_entrata = datetime.now().replace(hour = ran.randint(6, 22), minute = ran.randint(0,59), second = ran.randint(0,59), microsecond=0) - timedelta(days = sub_days)

            data_uscita = data_entrata
            if data_entrata.hour != 22:
              data_uscita = data_entrata.replace(hour = data_entrata.hour+1, minute = ran.randint(0,59), second = ran.randint(0,59), microsecond=0)
            elif data_entrata.hour < 20:
              data_uscita = data_entrata.replace(hour = data_entrata.hour+ran.randint(2,4), minute = ran.randint(0,59), second = ran.randint(0,59), microsecond=0)

            costo = 0
            n_hours = (data_uscita - data_entrata).total_seconds()/3600
            if n_hours >= 1:
              costo = round(n_hours*ran.uniform(2,5),2)
            else:
              costo = 0.5
            command = f"INSERT INTO tickets(entrata, uscita, costo, rfid_codice) VALUES('{data_entrata}', '{data_uscita}', '{costo}', '{rfids[ran.randint(0,len(rfids)-1)]}');"
            print(command)
            
            cloudCursor.execute(f"SELECT parcheggi_id FROM parcheggi WHERE parcheggio_stato = 0 AND piano = {ran.randint(1,2)} AND posto = {ran.randint(0,49)};")
            id_parcheggio = (cloudCursor.fetchall())[0][0]
            cloudCursor.execute(f"INSERT INTO durata(durata_id, tempo, costo_finale, pagamento_effettuato, parcheggi_id_fk, created_at, updated_at) VALUES('{cuid.cuid()}', {round((data_uscita - data_entrata).total_seconds()/3600,2)}, {costo}, 1, '{id_parcheggio}', '{data_entrata}', '{data_uscita}');")
            cursor.execute(command)
            cloudConnection.commit()
            
          cloudConnection.close()
          conn.commit()
          print("Fine inserimento tickets...\n")

        elif table == "utenti":
          print("Inizio inserimento utenti:")
          for n in range(4):
            command = f"INSERT INTO {table}(name, email, emailVerified, image, createdAt, updatedAt) VALUES ('nameUser_{n}', 'emailUser_{n}', 'emailverifiedUser_{n}', 'imageUser_{n}', '{datetime.now()}', '0000-00-00 00:00:00.0000');"
            print(command)
            cursor.execute(command)
          conn.commit()
          print("Fine inserimento utenti...\n")

        elif table == "rfids":
          print("Inizio inserimento rfids:")
          for r in rfids:
            if r != '':
              command = f"INSERT INTO {table}(codice, stato, user_id_fk, createdAt, updatedAt) VALUES('{r}', True, {rfids.index(r)+1}, '{datetime.now()}', '0000-00-00 00:00:00.0000');"
              print(command)
              cursor.execute(command)
          conn.commit()
          print("Fine inserimento rfids...\n")

        elif table == "parcheggi":
          floor = 0
          print("Inizio inserimento parcheggi:")
          for parck in range(0,100):
            if parck == 49:
              floor += 1
            if parck <= 9:
              command = f"INSERT INTO {table}(n_parcheggio, stato, createdAt, updatedAt) VALUES ('0{floor}0{parck}', {False}, '{datetime.now()}', '0000-00-00 00:00:00.0000');"
            else:
              command = f"INSERT INTO {table}(n_parcheggio, stato, createdAt, updatedAt) VALUES ('0{floor}{parck}', {False}, '{datetime.now()}', '0000-00-00 00:00:00.0000');"
            print(command)
            cursor.execute(command)
          conn.commit()
          print("Fine inserimento parcheggi...\n")

        # elif table == "durate":
        #   print("Inizio inserimento durate:")
        #   for parck in range(100):
        #     command = f"INSERT INTO {table}(parcheggio_id_fk, tempo_calcolato, createdAt, updatedAt) VALUES ({parck+1}, {ran.uniform(0.5,18)}, '{datetime.now()}', '0000-00-00 00:00:00.0000');"
        #     print(command)
        #     cursor.execute(command)
        #   print("Fine inserimento durate...\n")

    except Error as e:
      print(e)
    finally:
      if conn:
        
        conn.close()

@app.route('/', methods=['GET'])
def home():
  orario = datetime.now()
  if orario.hour > 6 and (orario.hour <= 23 and orario.minute < 59):
    return fk.render_template("serviceON.html")
  else:
    return fk.render_template("serviceOFF.html")

@app.route('/posti', methods=['GET'])
def getPosti():
  conn = sqlite3.connect('Raspberry/ParkingTest.db')
  terra, primo = range(2)
  try:
    req = rq.get(f"{CLOUD}api/data/parcheggi/liberi",  headers={"Content-Type": "application/json"}, timeout = 2)
    if req.status_code == 200:
      json = req.json()
      print(json)
      return {"posti": {"0":json['piano1_TOT'], "1":json['piano2_TOT']}}
  except Exception as e:
    print(e)
    
  terra = conn.cursor().execute("SELECT COUNT(*) FROM parcheggi WHERE stato = 0 AND parcheggio_id <= 50;").fetchone()
  primo = conn.cursor().execute("SELECT COUNT(*) FROM parcheggi WHERE stato = 0 AND parcheggio_id > 50;").fetchone()
  print(f"Parcheggi liberi: terra({pd.DataFrame(terra)[0][0]}), primo({pd.DataFrame(primo)[0][0]})")
  conn.commit()
  conn.close()
  return {"posti": {"0": np.int16(pd.DataFrame(terra)[0][0]).item(), "1":np.int16(pd.DataFrame(primo)[0][0]).item()}}

@app.route('/check-in', methods=['POST'])
def checkIn():
  conn = sqlite3.connect('Raspberry/ParkingTest.db')
  cancello = fk.request.get_json()
  print(cancello)
  
  try:
    #se il utente entra con rfid
    if cancello['entrata'] == "rfid":
      req = rq.post(f"{CLOUD}api/data/rfids-btn/check-in", headers={"Content-Type": "application/json"}, json={"rfid_codice": cancello['codice']}, timeout = 2)
      #se rfid è autentico
      if req.status_code == 200:
        print(f"rfid {cancello['codice']} trovato...")
        return {"trovato": True}
      elif req.status_code == 404:
        print(f"rfid {cancello['codice']} non trovato...")
        return {"trovato": False}
    #se utente entra con button
    elif cancello['entrata'] == "button":
      req = rq.post(f"{CLOUD}api/data/rfids-btn/check-in", headers={"Content-Type": "application/json"}, json={"rfid_codice": ""}, timeout = 2)
      print(f"Check-in effettuato tramite bottone...")
      return {"trovato": True}
  except Exception as e:
    print(e)
  
  if cancello['entrata'] == "rfid":
    rfid = conn.cursor().execute(f"SELECT * FROM rfids WHERE codice = {cancello['codice']};").fetchmany()
    user = conn.cursor().execute(f"SELECT * FROM utenti WHERE utente_id = {pd.DataFrame(rfid)[3][0]};").fetchmany()
    print(pd.DataFrame(rfid))
    print(pd.DataFrame(user))

    if user is not None:
      conn.cursor().execute(f"INSERT INTO tickets(entrata, uscita, costo, rfid_codice) VALUES('{datetime.now()}', '0000-00-00 00:00:00.0000', 0, '{cancello['codice']}');").fetchone()
      conn.commit()
      print(f"rfid {cancello['codice']} assegnato ad utente {pd.DataFrame(user)[0][0]} {pd.DataFrame(user)[1][0]}")
      last_ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets ORDER BY ticket_id DESC LIMIT 1;").fetchone())
      conn.close()
      print("Last check-in:")
      print(f"\n{last_ticket}\n")
      return {"trovato": True}
    else:
      conn.close()
      return {"trovato": False}

  elif cancello['entrata'] == "button":
    conn.cursor().execute(f"INSERT INTO tickets(entrata, uscita, costo, rfid_codice) VALUES('{datetime.now()}', '0000-00-00 00:00:00.0000', '{0.00}', '{cancello['codice']}');")
    last_ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets ORDER BY ticket_id DESC LIMIT 1;").fetchone())
    conn.commit()
    conn.close()
    print("Last check-in:")
    print(f"\n{last_ticket}\n")
    return {"trovato": True}

def calcoloCosto(data_entrata):
  data_entrata = datetime.strptime(str(data_entrata), '%Y-%m-%d %H:%M:%S.%f')
  conn = sqlite3.connect('Raspberry/ParkingTest.db')
  data_uscita = datetime.now()

  yesterday = data_entrata - timedelta(days=7)
  apertura = yesterday.replace(hour=6, minute=0, second=0, microsecond=0)
  chiusura = yesterday.replace(hour=23, minute=59, second=59, microsecond=0)

  old_data = pd.DataFrame(conn.cursor().execute(f"SELECT COUNT(*), AVG(costo/((JULIANDAY(uscita) - JULIANDAY(entrata))*24)) FROM tickets WHERE entrata BETWEEN '{apertura}' AND '{chiusura}';").fetchone())
  print(f"Settimana precedente:\nAffluenza({old_data[0][0]}), CostoMedio({round(old_data[0][1], 2)})")

  costo = 0
  n_hours = (data_uscita - data_entrata).total_seconds()/60 #3600
  if n_hours < 1:
    costo = 0.5
  else:
    #numero ore * (costo medio sett ptima*(affluenza stimata di oggi)/affluenza di sett prima)
    costo = n_hours*((old_data[0][1]*(old_data[0][0]-ran.randint(100,500)))/old_data[0][0])
    costo = costo - (costo*10/100)
  return round(costo,2)

#deve ritornare il costo totale del tiket
@app.route('/check-out', methods=['POST'])
def checkOut():
  conn = sqlite3.connect('Raspberry/ParkingTest.db')
  cancello = fk.request.get_json()
  print(cancello)
  try:
    ticket = range(1)
    if cancello['uscita'] == "rfid":
      ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets WHERE rfid_codice = '{cancello['codice']}' ORDER BY ticket_id DESC LIMIT 1;").fetchone())
    elif cancello['uscita'] == "button":
      ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets WHERE ticket_id = {cancello['codice']};").fetchone())

    durata = (datetime.now() - datetime.strptime(str(ticket[0][1]), '%Y-%m-%d %H:%M:%S.%f')).total_seconds()/60
    req = rq.post(f"{CLOUD}api/data/rfids-btn/check-out", headers={"Content-Type": "application/json"}, json={"rfid_codice": cancello['codice']}, timeout = 2)

    #se il utente esce con rfid
    if cancello['uscita'] == "rfid":
      return {"trovato": True}
    #se utente esce con button
    elif cancello['uscita'] == "button":
      return {"trovato": True}

  except Exception as e:
    print(e)
  
  if cancello['uscita'] == "rfid":
    ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets WHERE rfid_codice = '{cancello['codice']}' ORDER BY ticket_id DESC LIMIT 1;").fetchone())
    costo = calcoloCosto(str(ticket[0][1]))
    
    update_ticket = conn.cursor().execute(f"UPDATE tickets SET uscita = '{datetime.now()}', costo = {costo} WHERE ticket_id = '{ticket[0][0]}';").fetchone()
    last_ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets ORDER BY ticket_id DESC LIMIT 1;").fetchone())
    print("Last check-out:")
    print(f"\n{last_ticket}\n")

    conn.commit()
    conn.close()
    return {"costo": str(costo)}

  elif cancello['uscita'] == "button":
    ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets WHERE uscita = '0000-00-00 00:00:00.0000' AND rfid_codice = '' ORDER BY ticket_id DESC LIMIT 1;").fetchone())
    costo = calcoloCosto(str(ticket[0][1]))
    update_ticket = conn.cursor().execute(f"UPDATE tickets SET uscita = '{datetime.now()}', costo = {costo} WHERE ticket_id = '{ticket[0][0]}';").fetchone()
    last_ticket = pd.DataFrame(conn.cursor().execute(f"SELECT * FROM tickets ORDER BY ticket_id DESC LIMIT 1;").fetchone())
    print("Last check-out:")
    print(f"\n{last_ticket}\n")

    conn.commit()
    conn.close()
    return {"costo": str(costo)}

@app.route('/prossimita', methods=['POST'])
def postSensoriProssimita():
  sensor = fk.request.get_json()
  print(sensor)
  
  parking = list(sensor.keys())[0]
  posto = int(str(parking)[2:])
  piano = int(str(parking)[0:-2])+1

  try:
    if sensor[parking]['stato'] == True:
      req = rq.post(f"{CLOUD}api/data/parcheggi/check-in", headers={"Content-Type": "application/json"}, json={"posto":posto, "piano":piano})
    else:
      date = datetime.strptime(str(sensor[parking]['sosta']).replace('T',' ').replace('Z',''), '%Y-%m-%d %H:%M:%S') + timedelta(hours = 1)
      sosta = (datetime.now() - date).total_seconds()/60
      req = rq.post(f"{CLOUD}api/data/dutrata/create", headers={"Content-Type": "application/json"}, json={"posto" :posto, "piano": piano, "tempoGet": sosta }, timeout = 2)
      req = rq.post(f"{CLOUD}api/data/parcheggi/check-out", headers={"Content-Type": "application/json"}, json={"posto": posto, "piano": piano})

  except Exception as e:
    print(e)
    
  stato = range(1)
  if sensor[parking]['stato'] == True:
    stato = 1
  else:
    stato = 0
  conn = sqlite3.connect('Raspberry/ParkingTest.db')
    
  #parcheggio da occupare in caso di entrata con button: piano terra num 10 e 11
  set_parking = conn.cursor().execute(f"UPDATE parcheggi SET stato = {stato}, updatedAt = '{datetime.now()}' WHERE n_parcheggio = '{parking}';")
  conn.commit()
  parking = conn.cursor().execute(f"SELECT * FROM parcheggi WHERE n_parcheggio = '{parking}';")
  print(pd.DataFrame(parking))
  conn.close()
  
  if stato == 0:
    return f"Parcheggio {parking} libero"
  elif stato == 1:
    return f"Parcheggio {parking} occupato"

@app.errorhandler(404)
def page_not_found(e):
  return "<h1>404</h1><p>The resource could not be found.</p>", 404

#region createTables for PostgressDB
# def createTables():
#   try:
#     conn = psycopg2.connect(database="parcheggioDb", user="gruppo3", password="myPassword", host="127.0.0.1", port="5432")
#     print("Opened database successfully")

#     cur = conn.cursor()

#     cur.execute('''CREATE TABLE IF NOT EXISTS rfids (
#       rfid_id VARCHAR ( 255 ) PRIMARY KEY,
#       codice VARCHAR ( 255 ) NOT NULL,
#       stato VARCHAR ( 255 ) NOT NULL,
#       user_id VARCHAR ( 255 ) UNIQUE NOT NULL,
#       createdAt timestamp NOT NULL DEFAULT NOW(),
#       updatedAt timestamp NOT NULL
#       );''')
#     print("Table rfids created successfully")

#     cur.execute('''CREATE TABLE IF NOT EXISTS utente (
#       id VARCHAR ( 255 ) PRIMARY KEY,
#       name VARCHAR ( 255 ) NOT NULL,
#       email VARCHAR ( 255 ) NOT NULL,
#       emailVerified VARCHAR ( 255 ) NOT NULL,
#       image VARCHAR ( 255 ) NOT NULL,
#       createdAt timestamp NOT NULL DEFAULT NOW(),
#       updatedAt timestamp NOT NULL
#       );''')
#     print("Table utente created successfully")

#     cur.execute('''CREATE TABLE IF NOT EXISTS parcheggi (
#       parcheggio_id VARCHAR ( 255 ) PRIMARY KEY,
#       n_parcheggio VARCHAR ( 255 ) NOT NULL,
#       stato VARCHAR ( 255 ) NOT NULL,
#       createdAt timestamp NOT NULL DEFAULT NOW(),
#       updatedAt timestamp NOT NULL
#       );''')
#     print("Table parcheggi created successfully")

#     cur.execute('''CREATE TABLE IF NOT EXISTS durate (
#       durataid VARCHAR ( 255 ) PRIMARY KEY,
#       parcheggio_id_fk VARCHAR ( 255 ) NOT NULL,
#       tempo_calcolato timestamp NOT NULL,
#       createdAt timestamp NOT NULL DEFAULT NOW(),
#       updatedAt timestamp NOT NULL
#       );''')
#     print("Table durate created successfully")

#     cur.execute('''ALTER TABLE public.rfids ADD CONSTRAINT rfids_fk FOREIGN KEY(user_id) REFERENCES public.utente(id) ON DELETE CASCADE ON UPDATE CASCADE;''')
#     cur.execute('''ALTER TABLE public.durate ADD CONSTRAINT durate_fk FOREIGN KEY (parcheggio_id_fk) REFERENCES public.parcheggi(parcheggio_id) ON DELETE CASCADE ON UPDATE CASCADE;''')
#     conn.commit()
#     conn.close()

#   except Exception as e:
#     print(e)
#endregion

if __name__ == "__main__":
  app.before_first_request(createTables)
  app.run(host='0.0.0.0', port=5000)

