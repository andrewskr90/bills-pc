import os
from datetime import datetime, timedelta
import time
import requests
from dotenv import load_dotenv
import mysql.connector
from threading import Timer
load_dotenv()
import json

db = mysql.connector.connect(
    host= 'localhost',
    user= 'root',
    database= 'bills_pc',
    password= os.getenv('SQL_PASSWORD')
)

# cursor.execute('SELECT * FROM collected_cards')
# for row in cursor:
#     print(row)
# cursor.execute('SELECT * FROM collected_card_notes')
# for row in cursor:
#     print(row)

cursor=db.cursor()

cookieValue = os.getenv('BILLS_PC_SESSION')

cookies = {'billsPcSession': cookieValue}

addedSets = {}
currentSet = ''
currentSetCardCount = 0
startId = 0
for i in range(146650, 146750):
    try:
        product = requests.get(f'https://mpapi.tcgplayer.com/v2/product/{i}/details').json()
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    if 'productLineUrlName' in product:
        if product['productLineUrlName'] == 'Pokemon':
            if product['productTypeName'] == 'Cards':
                if product['setName'] not in addedSets:
                    #share previous set details
                    if startId:
                        print(f'SetName:{currentSet}, firstItem:{startId}, itemCount:{currentSetCardCount}')
                    startId = product['productId']
                    currentSet = product['setName']
                    currentSetCardCount = 0
                    #add tcgPlayerDetails flag to notify sets router where the set is coming from
                    product['tcgPlayerDetails'] = True
                    try:
                        addedSet= requests.post('http://localhost:7070/api/v1/sets', json=[product], cookies=cookies)   
                        print(addedSet.json()) 
                        set_v2_id = addedSet.json()['addedSets'][0]['set_v2_id']
                        addedSets[product['setName']] = set_v2_id
                    except requests.exceptions.RequestException as e:
                        raise SystemExit(e)
                try:
                    cardSetId = addedSets[product['setName']]
                    product['tcgPlayerDetails'] = True
                    product['set_v2_id'] = set_v2_id
                    addedCard = requests.post('http://localhost:7070/api/v1/cards', json=[product], cookies=cookies)
                    print(addedCard)
                    currentSetCardCount += 1
                except requests.exceptions.RequestException as e:
                        raise SystemExit(e)

print(addedSets)
