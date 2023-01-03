import os
import requests
from logger import logger

baseurl = os.environ['API_BASE_URL']

def loginBillsPc():
    loginInfo = {}
    loginInfo['user'] = {}
    loginInfo['user']['user_name'] = 'kyle'
    loginInfo['user']['user_password'] = os.environ['GYM_LEADER_PASS']
    #login and set credentials
    try:
        apiCredentials = requests.post(f'{baseurl}/api/v1/auth/login', json=loginInfo)
        if apiCredentials.status_code != 200:
            message = apiCredentials.json()['message']
            logger.debug(message)
            raise SystemExit(message) 
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    return apiCredentials.cookies

def getSetsBillsPc(credentials, parameters):
    endpoint = '/api/v1/sets-v2'
    if parameters:
        endpoint += f"?{parameters}"
    # get sets already present in bills_pc db
    try:
        billsPcSetsV2 = requests.get(f'{baseurl}{endpoint}', cookies=credentials)
        if billsPcSetsV2.status_code != 200:
            message = billsPcSetsV2.json()['message']
            logger.debug(message)
            raise SystemExit(message)  
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    # alphabetize set names
    def takeSetName(set):
        return set['set_v2_name']
    
    sets = billsPcSetsV2.json()
    sets.sort(key=takeSetName)
    return sets

def getCardsBillsPc(set_, credentials):
    try:
        billsPcCardsV2 = requests.get(f"{baseurl}/api/v1/cards-v2?card_v2_set_id={set_['set_v2_id']}", cookies=credentials)
        if billsPcCardsV2.status_code != 200:
            message = billsPcCardsV2.json()['message']
            logger.debug(message)
            raise SystemExit(message)  
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    return billsPcCardsV2.json()

def getProductsBillsPc(set_, credentials):
    try:
        billsPcProducts = requests.get(f"{baseurl}/api/v1/products?product_set_id={set_['set_v2_id']}", cookies=credentials)
        if billsPcProducts.status_code != 200:
            message = billsPcProducts.json()['message']
            logger.debug(message)
            raise SystemExit(message)
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    return billsPcProducts.json()

def getMarketPricesBillsPc(credentials, parameters):
    try:
        billsPcMarketPrices = requests.get(f"{baseurl}/api/v1/market-prices{parameters}", cookies=credentials)
        if billsPcMarketPrices.status_code != 200:
            message = billsPcMarketPrices.json()['message']
            logger.debug(message)
            raise SystemExit(message)
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    return billsPcMarketPrices.json()

def getMarketPricesByCardIdBillsPc(credentials, cardId, parameters):
    try:
        billsPcMarketPricesByCardId = requests.get(f"{baseurl}/api/v1/market-prices/card-id/{cardId}?{parameters}", cookies=credentials)
        if billsPcMarketPricesByCardId.status_code != 200:
            message = billsPcMarketPricesByCardId.json()['message']
            logger.debug(message)
            raise SystemExit(message)
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    return billsPcMarketPricesByCardId.json()

def getMarketPricesByProductIdBillsPc(credentials, productId, parameters):
    try:
        billsPcMarketPricesByProductId = requests.get(f"{baseurl}/api/v1/market-prices/product-id/{productId}?{parameters}", cookies=credentials)
        if billsPcMarketPricesByProductId.status_code != 200:
            message = billsPcMarketPricesByProductId.json()['message']
            logger.debug(message)
            raise SystemExit(message)
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    return billsPcMarketPricesByProductId.json()

def addMarketPricesBillsPc(marketPricesToAdd, credentials, set_):
    #add market prices to bills_pc
    try:
        addedMarketPrices = requests.post(f'{baseurl}/api/v1/market-prices', json=marketPricesToAdd, cookies=credentials)
        print(addedMarketPrices)
        if addedMarketPrices.status_code != 201:
            message = addedMarketPrices.json()['message']
            print(message)
            print(f"--DEBUG: Attmpted to add these items: {marketPricesToAdd}")
        else:
            print(f"----------added {len(marketPricesToAdd)} prices from {set_['set_v2_name']}----------")
    except requests.exceptions.RequestException as e:
        logger(e)
        raise SystemExit(e)

def addCardsBillsPc(cardsToAdd, credentials, set_):
    try:
        addedCards = requests.post(f'{baseurl}/api/v1/cards-v2', json=cardsToAdd, cookies=credentials)
        print(addedCards)
        if addedCards.status_code != 201:
            message = addedCards.json()['message']
            print(message)
        else:
            print(f"added {len(cardsToAdd)} from {set_['set_v2_name']}")
    except requests.exceptions.RequestException as e:
        logger(e)
        raise SystemExit(e)

def addProductsBillsPc(productsToAdd, credentials, set_):
    try:
        addedProducts = requests.post(f'{baseurl}/api/v1/products', json=productsToAdd, cookies=credentials)
        print(addedProducts)
        if addedProducts.status_code != 201:
            message = addedProducts.json()['message']
            print(message)
        else:
            print(f"added {len(productsToAdd)} from {set_['set_v2_name']}")
    except requests.exceptions.RequestException as e:
        logger(e)
        raise SystemExit(e)

def updateSetBillsPc(updatedSet, credentials):
    set_v2_id = updatedSet['set_v2_id']
    print(set_v2_id)
    try:
        results = requests.put(f'{baseurl}/api/v1/sets-v2/{set_v2_id}', json=updatedSet, cookies=credentials)
        print(results)
        if results.status_code != 200:
            message = results.json()['message']
            print(message)
    except requests.exceptions.RequestException as e:
        logger(e)
        raise SystemExit(e)