import os
from datetime import datetime, timedelta
import time
import requests
import mysql.connector
from threading import Timer
import json
import logging
logging.basicConfig(filename='insertCardsAndSets.log', encoding='utf-8', level=logging.DEBUG)

db = mysql.connector.connect(
    host = 'localhost',
    port = 3306,
    user = 'root',
    database = 'bills_pc',
    password = os.getenv('SQL_PASSWORD')
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

addedSetIds = {}
for i in range(42721, 42741):
    try:
        product = requests.get(f'https://mpapi.tcgplayer.com/v2/product/{i}/details').json()
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    if 'productLineUrlName' in product:
        if product['productLineUrlName'] == 'Pokemon':
                if product['setName'] not in addedSetIds:
                    #add tcgPlayerDetails flag to notify sets router where the set is coming from
                    product['tcgPlayerDetails'] = True
                    try:
                        addedSet= requests.post('http://localhost:7070/api/v1/sets', json=[product], cookies=cookies) 
                        if addedSet.json()['message'] == 'Set(s) already inserted.':
                            setName = product['setName']
                            set_v2_id = requests.get(f'http://localhost:7070/api/v1/sets?set_v2_name={setName}', cookies=cookies).json()[0]['set_v2_id']
                        else:
                            set_v2_id = addedSet.json()['addedSets'][0]['set_v2_id']
                        addedSetIds[product['setName']] = set_v2_id
                    except requests.exceptions.RequestException as e:
                        raise SystemExit(e)
                try:
                    if product['productTypeName'] == 'Cards':
                        cardSetId = addedSetIds[product['setName']]
                        #add tcgPlayerDetails flag to notify cards router where the card is coming from
                        product['tcgPlayerDetails'] = True
                        product['set_v2_id'] = cardSetId
                        productId = product['productId']
                        addedCard = requests.post('http://localhost:7070/api/v1/cards', json=[product], cookies=cookies)
                        if addedCard.status_code != 201:
                            message = addedCard.json()['message']
                            logging.debug(f'Card not added: ProductId:{productId}, message:{message}')
                    elif product['productTypeName'] == 'Sealed Products':
                        productSetId = addedSetIds[product['setName']]
                        #add tcgPlayerDetails flag to notify products router where the product is coming from
                        product['tcgPlayerDetails'] = True
                        product['set_v2_id'] = productSetId
                        addedProduct = requests.post('http://localhost:7070/api/v1/products', json=[product], cookies=cookies)
                        if addedProduct.status_code != 201:
                            message = addedCard.json()['message']
                            logging.debug(f'Product not added: ProductId:{productId}, message:{message}')
                except requests.exceptions.RequestException as e:
                        raise SystemExit(e)


print(addedSetIds)
