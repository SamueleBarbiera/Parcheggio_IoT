import psycopg2

try:
    conn = psycopg2.connect(database="parcheggioDb", user="gruppo3", password="myPassword", host="127.0.0.1", port="5432")
    print("Opened database successfully")

    cur = conn.cursor()

    cur.execute('''CREATE TABLE IF NOT EXISTS rfids (
      rfid_id VARCHAR ( 255 ) PRIMARY KEY,
      codice VARCHAR ( 255 ) NOT NULL,
      stato VARCHAR ( 255 ) NOT NULL,
      user_id VARCHAR ( 255 ) UNIQUE NOT NULL,
      createdAt timestamp NOT NULL DEFAULT NOW(),
      updatedAt timestamp NOT NULL
      );''')
    print("Table rfids created successfully")

    cur.execute('''CREATE TABLE IF NOT EXISTS utente (
      id VARCHAR ( 255 ) PRIMARY KEY,
      name VARCHAR ( 255 ) NOT NULL,
      email VARCHAR ( 255 ) NOT NULL,
      emailVerified VARCHAR ( 255 ) NOT NULL,
      image VARCHAR ( 255 ) NOT NULL,
      createdAt timestamp NOT NULL DEFAULT NOW(),
      updatedAt timestamp NOT NULL
      );''')
    print("Table utente created successfully")

    cur.execute('''CREATE TABLE IF NOT EXISTS parcheggi (
      parcheggio_id VARCHAR ( 255 ) PRIMARY KEY,
      n_parcheggio VARCHAR ( 255 ) NOT NULL,
      stato VARCHAR ( 255 ) NOT NULL,
      createdAt timestamp NOT NULL DEFAULT NOW(),
      updatedAt timestamp NOT NULL
      );''')
    print("Table parcheggi created successfully")

    cur.execute('''CREATE TABLE IF NOT EXISTS durate (
      durataid VARCHAR ( 255 ) PRIMARY KEY,
      parcheggio_id_fk VARCHAR ( 255 ) NOT NULL,
      tempo_calcolato timestamp NOT NULL,
      createdAt timestamp NOT NULL DEFAULT NOW(),
      updatedAt timestamp NOT NULL
      );''')
    print("Table durate created successfully")

    cur.execute('''ALTER TABLE public.rfids ADD CONSTRAINT rfids_fk FOREIGN KEY(user_id) REFERENCES public.utente(id) ON DELETE CASCADE ON UPDATE CASCADE''')
    cur.execute('''ALTER TABLE public.durate ADD CONSTRAINT durate_fk FOREIGN KEY (parcheggio_id_fk) REFERENCES public.parcheggi(parcheggio_id) ON DELETE CASCADE ON UPDATE CASCADE;''')

except:
    print('Errore')

conn.commit()
conn.close()
