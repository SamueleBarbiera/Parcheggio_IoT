from sqlite3.dbapi2 import Error 
from werkzeug.wrappers import request 
import Package as pk 
 
app = pk.fk.Flask(__name__) 
app.config["DEBUG"] = True  
 
@app.route('/', methods=['GET']) 
def home(): 
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading data from ESP32 board.</p>" 
 
@app.route('/posti', methods=['GET']) 
def getPosti(): 
    return {"posti": {"0":pk.ran.randint(1, 50), "1":pk.ran.randint(1, 50)}} 
 
@app.route('/cancello', methods=['GET']) 
def getUserAuth(): 
    rfid_list = [ 
        #{"nome": "Filippo", "codice": '15725016189159'}, 
        {"nome": "Michele", "codice": '21721418013750'}, 
        {"nome": "Nicola", "codice": '1921269426250'}, 
        {"nome": "Samuel", "codice": '1184298172146'} 
    ] 
    codice = pk.fk.request.get_json() 
     
    res = "" 
    for x in rfid_list: 
        if x['codice'] == codice['codice']: 
            res += f"{x['nome']} ha effettuato l'accesso!" 
            break 
     
    return res 
 
@app.route('/prossimita', methods=['POST']) 
def postSensoriProssimita(): 
    try: 
        sensor=pk.fk.request.get_json() 
        print(sensor) 
    except Error as e: 
        print(e) 
 
    return "Record inserted successfully" 
 
@app.errorhandler(404) 
def page_not_found(e): 
    return "<h1>404</h1><p>The resource could not be found.</p>", 404 
 
if __name__=="__main__": 
    app.run(host='0.0.0.0', port=5000)