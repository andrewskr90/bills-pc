import os
import requests
import logging
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import argparse

# configure logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler('priceCheck.log', 'w', 'utf-8')
logger.addHandler(handler)

# configure login info
loginInfo = {}
loginInfo['user'] = {}
loginInfo['user']['user_name'] = 'kyle'
loginInfo['user']['user_password'] = os.environ['GYM_LEADER_PASS']
baseurl = os.environ['API_BASE_URL']

#login and set credentials
try:
    apiCredentials = requests.post(f'{baseurl}/api/v1/auth/login', json=loginInfo)
    if apiCredentials.status_code != 200:
        message = apiCredentials.json()['message']
        logger.debug(message)
        raise SystemExit(message) 
except requests.exceptions.RequestException as e:
    raise SystemExit(e)
credentials = apiCredentials.cookies

## configure selenium ##
# this one is for docker
service = Service(r'/usr/bin/chromedriver')
# # this one is for development
# service = Service(r'C:\Program Files\chromedriver\bin\chromedriver')

# # WARNING
# # Using a fake user agent results in being blocked by the site
# ua = UserAgent()
# userAgent = ua.chrome

options = webdriver.ChromeOptions() 
# options.add_argument(f"user-agent={userAgent}")
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument("--no-sandbox")
options.add_argument("enable-automation")
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-extensions")
options.add_argument("--dns-prefetch-disable")
options.add_argument("enable-features=NetworkServiceInProcess")

# try this one next
options.add_argument("disable-features=NetworkService")

parser = argparse.ArgumentParser()

parser.add_argument("-s", "--set", help='Takes name of set to target for adding items.')
parser.add_argument("-i", "--id", help='Takes id of set to target for adding items.')
args = parser.parse_args()
# if set flag exists
if args.set:
    try:
        billsPcSetsV2 = requests.get(f"{baseurl}/api/v1/sets-v2?set_v2_name={args.set}", cookies=credentials)
        if billsPcSetsV2.status_code != 200:
            message = billsPcSetsV2.json()['message']
            logger.debug(message)
            raise SystemExit(message)  
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    setsToSearch = billsPcSetsV2.json()
# else if id flag exists
elif args.id:
    try:
        billsPcSetsV2 = requests.get(f"{baseurl}/api/v1/sets-v2?set_v2_id={args.id}", cookies=credentials)
        if billsPcSetsV2.status_code != 200:
            message = billsPcSetsV2.json()['message']
            logger.debug(message)
            raise SystemExit(message)  
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    setsToSearch = billsPcSetsV2.json()
# else, loup through all sets in bills_pc
else:
    try:
        billsPcSetsV2 = requests.get(f'{baseurl}/api/v1/sets-v2', cookies=credentials)
        if billsPcSetsV2.status_code != 200:
            message = billsPcSetsV2.json()['message']
            logger.debug(message)
            raise SystemExit(message)  
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    setsToSearch = billsPcSetsV2.json()
try:
    for set_ in setsToSearch:
        print(f"------------------------Scraping Set: {set_['set_v2_name']}------------------------")
        curSetId = set_['set_v2_id']
        curSetName = set_['set_v2_name']
        curSetName = curSetName.replace(' ', '-')
        curSetName = curSetName.replace('---', '-')
        curSetName = curSetName.replace('--', '-')
        curSetName = curSetName.replace("'", '')
        curSetName = curSetName.replace(':', '')
        curSetName = curSetName.replace('&', 'and')
        curSetName = curSetName.lower()

        pageNum = '1'
        notLastPage = True
        cardsToAdd = []
        visitedCardsToAdd = {}
        productsToAdd =[]
        visitedProductsToAdd = {}

        # get cards and products already in bills_pc db
        try:
            billsPcSetCards = requests.get(f'{baseurl}/api/v1/cards-v2/set-id/{curSetId}', cookies=credentials)
            billsPcSetProducts = requests.get(f'{baseurl}/api/v1/products?product_set_id={curSetId}', cookies=credentials)
            if billsPcSetCards.status_code != 200:
                message = billsPcSetCards.json()
                print(message)
            if billsPcSetProducts.status_code != 200:
                message = billsPcSetProducts.json()
                print(message)
        except requests.exception.RequestException as e:
            raise SystemExit(e)
        # flag cards as visited
        for card in billsPcSetCards.json():
            cardTcgId = card['card_v2_tcgplayer_product_id']
            visitedCardsToAdd[cardTcgId] = 1
        # flag products as visited
        for product in billsPcSetProducts.json():
            productTcgId = product['product_tcgplayer_product_id']
            visitedProductsToAdd[productTcgId] = 1

        # start browser
        browser = webdriver.Chrome(options=options, service=service)

        while notLastPage:
            # open product page with driver, using current set and current page
            setUrl = f'https://www.tcgplayer.com/search/pokemon/{curSetName}?Price_Condition=Less+Than&advancedSearch=true&productLineName=pokemon&view=grid&setName={curSetName}&page={pageNum}'
            browser.get(setUrl)

            #check if on last page, signal to end while loup
            nextButton = WebDriverWait(browser, 10).until(
                    EC.presence_of_element_located((By.ID, "nextButton"))
            )
            nextButtonClasses = nextButton.get_attribute('class')
            if 'disable' in nextButtonClasses:
                notLastPage = False

            try:
                # select all product results
                results = WebDriverWait(browser, 10).until(
                    EC.presence_of_all_elements_located((By.CLASS_NAME, "search-result"))
                )
                # format and add each item to bills_pc db
                for resultsIdx, result in enumerate(results):
                    # item set id
                    itemSetId = curSetId
                    # item tcg product id
                    itemATag = result.find_element(By.XPATH, "./div[@class='search-result__content']/a")
                    itemTcgProductId = itemATag.get_attribute('href').split('/')[4]
                    # item name
                    itemNameElement = result.find_element(By.CLASS_NAME, 'search-result__title')
                    itemName = itemNameElement.get_attribute('textContent')
                    resultRaritySection = result.find_elements(By.XPATH, "./div/a/section/section[@class='search-result__rarity']")
                    # item is card
                    if len(resultRaritySection) == 1:
                        # card rarity
                        cardRaritySection = resultRaritySection[0].find_elements(By.XPATH, './span[1]')
                        if len(cardRaritySection) == 1:
                            cardRarityElement = cardRaritySection[0]
                            cardRarity = cardRarityElement.get_attribute('textContent')
                        else:
                            cardRarity = None
                        # card number
                        cardNumberSection = resultRaritySection[0].find_elements(By.XPATH, './span[3]')
                        if len(cardNumberSection) == 1:
                            cardNumberElement = cardNumberSection[0]
                            cardNumber = cardNumberElement.get_attribute('textContent')
                        else:
                            cardNumber = None
                        # format card
                        cardToAdd = {}
                        cardToAdd['card_v2_set_id'] = itemSetId
                        cardToAdd['card_v2_name'] = itemName
                        cardToAdd['card_v2_number'] = cardNumber
                        cardToAdd['card_v2_rarity'] = cardRarity
                        cardToAdd['card_v2_tcgplayer_product_id'] = int(itemTcgProductId)
                        cardToAdd['card_v2_foil_only'] = None
                        tcgpid = cardToAdd['card_v2_tcgplayer_product_id']
                        if cardToAdd['card_v2_tcgplayer_product_id'] not in visitedCardsToAdd:
                            print(f"**found NEW CARD, {cardToAdd['card_v2_name']}, tcgId:{cardToAdd['card_v2_tcgplayer_product_id']}")                    
                            cardsToAdd.append(cardToAdd)
                            visitedCardsToAdd[cardToAdd['card_v2_tcgplayer_product_id']] = 1
                    else:
                        #format product
                        productToAdd = {}
                        productToAdd['product_set_id'] = itemSetId
                        productToAdd['product_name'] = itemName
                        productToAdd['product_release_date'] = None
                        productToAdd['product_description'] = None
                        productToAdd['product_tcgplayer_product_id'] = int(itemTcgProductId)
                        if productToAdd['product_tcgplayer_product_id'] not in visitedProductsToAdd:
                            print(f"**found NEW PRODUCT, {productToAdd['product_name']}, tcgId:{productToAdd['product_tcgplayer_product_id']}")
                            productsToAdd.append(productToAdd)
                            visitedProductsToAdd[productToAdd['product_tcgplayer_product_id']] = 1
                #wait 5 seconds
                time.sleep(5)
                pageNum = str(int(pageNum) + 1)
            except requests.exceptions.RequestException as e:
                logger(e)
                print(e)
                raise SystemExit(e)
        #add items to bills_pc
        if len(cardsToAdd) > 0:
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
        if len(productsToAdd) > 0:
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
        if len(cardsToAdd) == 0 and len(productsToAdd) == 0:
            print(f"Items from {set_['set_v2_name']} up to date.")
        
        browser.close()
        time.sleep(3)
        browser.quit()
        time.sleep(3)
finally:
    print('Finished searching for new items to add to Bills Pc DB!')
