import os
from datetime import datetime, timedelta
import time
import requests
from threading import Timer
# from dotenv import load_dotenv
# load_dotenv()
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import logging


# configure logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler('priceCheck.log', 'w', 'utf-8')
logger.addHandler(handler)

def marketPriceScrape():
    loginInfo = {}
    loginInfo['user_name'] = 'kyle'

    loginInfo['user_password'] = os.environ['GYM_LEADER_PASS']
    baseurl = os.environ['API_BASE_URL']

    #login and set credentials
    try:
        apiCredentials = requests.post(f'{baseurl}/api/v1/auth/login', json=loginInfo)
        if apiCredentials.status_code != 200:
            message = apiCredentials.json()['message']
            logging.debug(message)
            raise SystemExit(message) 
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    credentials = apiCredentials.cookies

    #get sets already present in bills_pc db
    try:
        billsPcSetsV2 = requests.get(f'{baseurl}/api/v1/sets-v2', cookies=credentials)
        if billsPcSetsV2.status_code != 200:
            message = billsPcSetsV2.json()['message']
            logging.debug(message)
            raise SystemExit(message)  
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    billsPcSetsData = billsPcSetsV2.json()

    # alphabetize set names
    def takeSetName(set):
        return set['set_v2_name']
    billsPcSetsData.sort(key=takeSetName)

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
    options.add_argument("--disable-dev-shm-usage")

    browser = webdriver.Chrome(options=options, service=service)

    try:
        for set_ in billsPcSetsData:
            print(f"------------------------Scraping Market Prices: {set_['set_v2_name']}------------------------")

            # get set cards and products from bills_pc
            try:
                billsPcCardsV2 = requests.get(f"{baseurl}/api/v1/cards-v2?card_v2_set_id={set_['set_v2_id']}", cookies=credentials)
                if billsPcCardsV2.status_code != 200:
                    message = billsPcCardsV2.json()['message']
                    logging.debug(message)
                    raise SystemExit(message)  
            except requests.exceptions.RequestException as e:
                raise SystemExit(e)
            currentSetCards = billsPcCardsV2.json()

            try:
                billsPcProducts = requests.get(f"{baseurl}/api/v1/products?product_set_id={set_['set_v2_id']}", cookies=credentials)
                if billsPcProducts.status_code != 200:
                    message = billsPcProducts.json()['message']
                    logging.debug(message)
                    raise SystemExit(message)
            except requests.exceptions.RequestException as e:
                raise SystemExit(e)
            currentSetProducts = billsPcProducts.json()

            # check if current set has been scraped already today
            if len(currentSetCards) > 0:
                firstCardId = currentSetCards[0]['card_v2_id']
                try:
                    billsPcMarketPrices = requests.get(f"{baseurl}/api/v1/market-prices?market_price_card_id={firstCardId}", cookies=credentials)
                    if billsPcMarketPrices.status_code != 200:
                        message = billsPcMarketPrices.json()['message']
                        logging.debug(message)
                        raise SystemExit(message)
                except requests.exceptions.RequestException as e:
                    raise SystemExit(e)
                cardMarketPrices = billsPcMarketPrices.json()
                if len(cardMarketPrices) > 0:
                    mostRecentPriceDate = cardMarketPrices[0]['created_date'].split('T')[0]
                    todaysDate = str(datetime.utcnow().date())
                    # check if most recent date matches todays date
                    if mostRecentPriceDate == todaysDate:
                        print(f"---------{set_['set_v2_name']} has already been scraped today---------")
                        continue

            # just in case current set only has sealed product i.e. World Championship Decks
            elif len(currentSetProducts) > 0:
                firstProductId = currentSetProducts[0]['product_id']
                try:
                    billsPcMarketPrices = requests.get(f"{baseurl}/api/v1/market-prices?market_price_product_id={firstProductId}", cookies=credentials)
                    if billsPcMarketPrices.status_code != 200:
                        message = billsPcMarketPrices.json()['message']
                        logging.debug(message)
                        raise SystemExit(message)
                except requests.exceptions.RequestException as e:
                    raise SystemExit(e)
                productMarketPrices = billsPcMarketPrices.json()
                if len(productMarketPrices) > 0:
                    mostRecentPriceDate = productMarketPrices[0]['created_date'].split('T')[0]
                    todaysDate = str(datetime.utcnow().date())
                    # check if most recent date matches todays date
                    if mostRecentPriceDate == todaysDate:
                        print(f"---------{set_['set_v2_name']} has already been scraped today---------")
                        continue
            
            # format set name to match webpage url
            curSetId = set_['set_v2_id']
            curSetName = set_['set_v2_name']
            curSetName = curSetName.replace(' ', '-')
            curSetName = curSetName.replace('---', '-')
            curSetName = curSetName.replace('--', '-')
            curSetName = curSetName.replace("'", '')
            curSetName = curSetName.replace(':', '')
            curSetName = curSetName.replace('&', 'and')
            curSetName = curSetName.lower()

            # initialize variables
            pageNum = '1'
            notLastPage = True
            marketPricesToAdd = []
            visitedItems = {}        

            while notLastPage:
                print(f'Scraping page {pageNum}...')
                # open product page with driver, using current set and current page
                setUrl = f'https://www.tcgplayer.com/search/pokemon/{curSetName}?Price_Condition=Less+Than&advancedSearch=true&productLineName=pokemon&view=grid&setName={curSetName}&page={pageNum}'
                browser.get(setUrl)
                browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

                # BeautifulSoup prettify is used to debug when necessary, parses the error within the JS
                # soup = BeautifulSoup(browser.page_source, "html.parser")
                # print(soup.prettify())

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
                        itemTcgProductId = int(itemATag.get_attribute('href').split('/')[4])
                        # item name
                        itemNameElement = result.find_element(By.CLASS_NAME, 'search-result__title')
                        itemName = itemNameElement.get_attribute('textContent')
                        resultRaritySection = result.find_elements(By.XPATH, "./div/a/section/section[@class='search-result__rarity']")
                        # item market price
                        itemMarketPriceSectionToCheck = result.find_element(By.XPATH, "./div/a/section/section[@class='search-result__market-price']/section")
                        #check if market price not available
                        sectionClassNames = itemMarketPriceSectionToCheck.get_attribute('class')
                        if 'unavailable' in sectionClassNames:
                            itemMarketPrice = None
                        else: 
                            itemMarketPriceString = itemMarketPriceSectionToCheck.find_element(By.XPATH, "./span[@class='search-result__market-price--value']").get_attribute('textContent')
                            itemMarketPriceString = itemMarketPriceString.replace('$', '')
                            itemMarketPriceString = itemMarketPriceString.replace(',', '')
                            itemMarketPrice = float(itemMarketPriceString)
                        marketPriceToAdd = {}
                        # make sure item not visited
                        if itemTcgProductId not in visitedItems:
                            # add item to visitedItems
                            visitedItems[itemTcgProductId] = 1
                            # item is card
                            if len(resultRaritySection) == 1:
                                # find card_v2_id
                                if len(currentSetCards) > 0:
                                    for card in currentSetCards:
                                        if card['card_v2_tcgplayer_product_id'] == itemTcgProductId:
                                            card_v2_id = card['card_v2_id']
                                            break
                                    
                                    # format card market price
                                    marketPriceToAdd['market_price_card_id'] = card_v2_id
                                    marketPriceToAdd['market_price_price'] = itemMarketPrice
                                    marketPriceToAdd['market_price_product_id'] = None
                                    marketPricesToAdd.append(marketPriceToAdd)
                                else:
                                    print(f'WARNING: set cards exist, but not added to bills_pc yet. Card tcgplayerid: {itemTcgProductId}. Update bills_pc.cards_v2 with cards from {curSetName}.')
                            # item is a product
                            else:
                                # find product_id
                                if len(currentSetProducts) > 0:
                                    for product in currentSetProducts:
                                        if product['product_tcgplayer_product_id'] == itemTcgProductId:
                                            product_id = product['product_id']
                                            break
                                    #format product market price
                                    marketPriceToAdd['market_price_product_id'] = product_id
                                    marketPriceToAdd['market_price_price'] = itemMarketPrice
                                    marketPriceToAdd['market_price_card_id'] = None
                                    marketPricesToAdd.append(marketPriceToAdd)
                                else:
                                    print(f'WARNING: set products exist, but not added to bills_pc yet. Product tcgplayerid: {itemTcgProductId}. Update bills_pc.products with products from {curSetName}.')
                    #wait 5 seconds
                    time.sleep(5)
                    pageNum = str(int(pageNum) + 1)
                except requests.exceptions.RequestException as e:
                    logging(e)
                    print(e)
                    raise SystemExit(e)
            #add market prices to bills_pc
            try:
                addedMarketPrices = requests.post(f'{baseurl}/api/v1/market-prices', json=marketPricesToAdd, cookies=credentials)
                print(addedMarketPrices)
                if addedMarketPrices.status_code != 201:
                    message = addedMarketPrices.json()['message']
                    print(message)
                else:
                    print(f"----------added {len(marketPricesToAdd)} prices from {set_['set_v2_name']}----------")
            except requests.exceptions.RequestException as e:
                logging(e)
                raise SystemExit(e)
    finally:
        browser.quit()

def oneDay():
    x=datetime.today()
    # print(x)
    y=x.replace(day=x.day+1, hour=0, minute=0, second=0, microsecond=0) + timedelta(minutes=1)
    # print(y)
    delta_t=y-x
    # print(delta_t.seconds)
    return delta_t.seconds
def startMarketPriceScrape():
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------It Is Midnight UTC------------------------------------------------')
    print(f'------------------------------------------{datetime.today}-------------------------------------------------')
    print('-------------------------------------Starting Market Price Scrape-------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')

    marketPriceScrape()
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('-------------------------------------Market Price Scrape Finished-------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')

    Timer(oneDay(), startMarketPriceScrape).start()

startMarketPriceScrape()
