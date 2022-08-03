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

cookies = {'billsPcSession': 's%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODE2ZWMwODgtMjVkMS00OTkyLTk4ZDktNjI5ZWRiNDFjOTMyIiwidXNlcl9uYW1lIjoiS3lsZSIsInVzZXJfcm9sZSI6Ikd5bUxlYWRlciIsInVzZXJfZW1haWwiOiJhbmRyZXdza3I5MEBnbWFpbC5jb20iLCJ1c2VyX2Zhdm9yaXRlX2dlbiI6IjEiLCJjcmVhdGVkX2RhdGUiOiIyMDIyLTA3LTE1VDA2OjM3OjA5LjAwMFoiLCJtb2RpZmllZF9kYXRlIjpudWxsLCJpYXQiOjE2NTkyMzQzMDEyMTEsImV4cCI6MTY1OTIzNDMzMDAxMX0.7LKCrdOwrUoWFpGK0hRAeyKCw_bO8wN7RP3EjrT6jP0.UrBuuPvrLlVLrXgFUskzaKZovf1AbUEp0OU3alXIn5k'}

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
                        currentSet = product['setName']
                        startId = product['productId']
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
                    print(product)
                    addedCard = requests.post('http://localhost:7070/api/v1/cards', json=[product], cookies=cookies)
                    print(addedCard)
                    currentSetCardCount += 1
                except requests.exceptions.RequestException as e:
                        raise SystemExit(e)

print(addedSets)
