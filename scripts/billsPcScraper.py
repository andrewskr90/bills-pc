import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from billsPcApi import addCardsBillsPc, addProductsBillsPc, getCardsBillsPc, getProductsBillsPc

def initSelenium():
    ## configure selenium ##
    if os.environ['NODE_ENV'] == 'development':
        service = Service(r'C:\Program Files\chromedriver\bin\chromedriver')
    else:
        service = Service(r'/usr/bin/chromedriver')

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument("--no-sandbox")
    options.add_argument("enable-automation")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-extensions")
    options.add_argument("--dns-prefetch-disable")
    options.add_argument("enable-features=NetworkServiceInProcess")
    options.add_argument("disable-features=NetworkService")
    return webdriver.Chrome(options=options, service=service)

def formatSetNameForUrl(set_):
    # format set name to match webpage url
    curSetName = set_['set_v2_name']
    curSetName = curSetName.replace('(', '')
    curSetName = curSetName.replace(')', '')
    curSetName = curSetName.replace(' ', '-')
    curSetName = curSetName.replace('---', '-')
    curSetName = curSetName.replace('--', '-')
    curSetName = curSetName.replace("'", '')
    curSetName = curSetName.replace(':', '')
    curSetName = curSetName.replace('&', 'and')
    return curSetName.lower()

def gatherPageMarketPrices(referenceLib, results):
    # initialize variables
    set_ = referenceLib['set_']
    currentSetCards = referenceLib['currentSetCards']
    currentSetProducts = referenceLib['currentSetProducts']
    marketPricesToAdd = referenceLib['marketPricesToAdd']
    visitedItems = referenceLib['visitedItems']
    curSetId = set_['set_v2_id']
    # format and add each item market price to bills_pc db
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
                    card_v2_id = False
                    for card in currentSetCards:
                        if card['card_v2_tcgplayer_product_id'] == itemTcgProductId:
                            card_v2_id = card['card_v2_id']
                            break
                    if card_v2_id is False:
                        print(f'WARNING: Card with tcgId {itemTcgProductId} not present in Bills Pc DB. Update bills_pc.cards_v2 with cards from set with id: {curSetId}.')
                    else:    
                        # format card market price
                        marketPriceToAdd['market_price_card_id'] = card_v2_id
                        marketPriceToAdd['market_price_price'] = itemMarketPrice
                        marketPriceToAdd['market_price_product_id'] = None
                        marketPricesToAdd.append(marketPriceToAdd)
                else:
                    print(f'WARNING: No cards added to current set with id {curSetId}')
            # item is a product
            else:
                # find product_id
                if len(currentSetProducts) > 0:
                    product_id = False
                    for product in currentSetProducts:
                        if product['product_tcgplayer_product_id'] == itemTcgProductId:
                            product_id = product['product_id']
                            break
                    if product_id is False:
                        print(f'WARNING: Product with tcgId {itemTcgProductId} not present in Bills Pc DB. Update bills_pc.products with products from set with id: {curSetId}.')
                    else:
                        #format product market price
                        marketPriceToAdd['market_price_product_id'] = product_id
                        marketPriceToAdd['market_price_price'] = itemMarketPrice
                        marketPriceToAdd['market_price_card_id'] = None
                        marketPricesToAdd.append(marketPriceToAdd)
                else:
                    print(f'WARNING: No products added to current set with id {curSetId}')
    referenceLib['marketPricesToAdd'] = marketPricesToAdd
    referenceLib['visitedItems'] = visitedItems
    return referenceLib

def gatherPageNewItems(referenceLib, results):
    currentSetCards = referenceLib['currentSetCards']
    currentSetProducts = referenceLib['currentSetProducts']
    currentSetCardsLib = referenceLib['currentSetCardsLib']
    currentSetProductsLib = referenceLib['currentSetProductsLib']
    cardsToAdd = referenceLib['cardsToAdd']
    productsToAdd = referenceLib['productsToAdd']
    set_ = referenceLib['set_']

    for resultsIdx, result in enumerate(results):
        # item set id
        itemSetId = set_['set_v2_id']
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
            if int(itemTcgProductId) not in currentSetCardsLib:
                # format card
                cardToAdd = {}
                cardToAdd['card_v2_set_id'] = itemSetId
                cardToAdd['card_v2_name'] = itemName
                cardToAdd['card_v2_number'] = cardNumber
                cardToAdd['card_v2_rarity'] = cardRarity
                cardToAdd['card_v2_tcgplayer_product_id'] = int(itemTcgProductId)
                cardToAdd['card_v2_foil_only'] = None
                print(f"**found NEW CARD, {cardToAdd['card_v2_name']}, tcgId:{cardToAdd['card_v2_tcgplayer_product_id']}")                    
                cardsToAdd.append(cardToAdd)
                currentSetCards.append(cardToAdd)
                currentSetCardsLib[cardToAdd['card_v2_tcgplayer_product_id']] = 1
        else:
            #format product
            productToAdd = {}
            productToAdd['product_set_id'] = itemSetId
            productToAdd['product_name'] = itemName
            productToAdd['product_release_date'] = None
            productToAdd['product_description'] = None
            productToAdd['product_tcgplayer_product_id'] = int(itemTcgProductId)
            if productToAdd['product_tcgplayer_product_id'] not in currentSetProductsLib:
                print(f"**found NEW PRODUCT, {productToAdd['product_name']}, tcgId:{productToAdd['product_tcgplayer_product_id']}")
                productsToAdd.append(productToAdd)
                currentSetProducts.append(productToAdd)
                currentSetProductsLib[productToAdd['product_tcgplayer_product_id']] = 1

    referenceLib['currentSetCards'] = currentSetCards
    referenceLib['currentSetProducts'] = currentSetProducts
    referenceLib['currentSetCardsLib'] = currentSetCardsLib
    referenceLib['currentSetProductsLib'] = currentSetProductsLib
    referenceLib['cardsToAdd'] = cardsToAdd
    referenceLib['productsToAdd'] = productsToAdd
    return referenceLib

def processResultsPerPage(referenceLib, pageScraperCallback):
    
    collectionArray = []
    browser = initSelenium()
    # initialize variables
    pageNum = '1'
    notLastPage = True   
    curSetName = formatSetNameForUrl(referenceLib['set_'])
    while notLastPage:
        # open product page with driver, using current set and current page
        setUrl = f'https://www.tcgplayer.com/search/pokemon/{curSetName}?Price_Condition=Less+Than&advancedSearch=true&productLineName=pokemon&view=grid&setName={curSetName}&page={pageNum}'
        browser.get(setUrl)
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        #check if on last page, signal to end while loup
        nextButton = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.ID, "nextButton"))
        )
        nextButtonClasses = nextButton.get_attribute('class')
        if 'disable' in nextButtonClasses:
            notLastPage = False
        # select all product results
        results = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "search-result"))
        )
        # callback function to process scraped data for each page
        referenceLib = pageScraperCallback(referenceLib, results)
        time.sleep(3)
        pageNum = str(int(pageNum) + 1)

    browser.close()
    time.sleep(5)
    browser.quit()
    time.sleep(5)
    return referenceLib

def processNewItemsThenMarketPerPage(referenceLib, gatherPageMarketPrices, gatherPageNewItems):
    
    collectionArray = []
    browser = initSelenium()
    # initialize variables
    pageNum = '1'
    notLastPage = True   
    curSetName = formatSetNameForUrl(referenceLib['set_'])
    
    # skipping dp training kit blue and gold until I can confirm they should be removed
    if curSetName == 'dp-training-kit-1-blue' or curSetName == 'dp-training-kit-1-gold':
        print('deprecated set', curSetName)
        return referenceLib

    while notLastPage:
        # open product page with driver, using current set and current page
        setUrl = f'https://www.tcgplayer.com/search/pokemon/{curSetName}?Price_Condition=Less+Than&advancedSearch=true&productLineName=pokemon&view=grid&setName={curSetName}&page={pageNum}'
        browser.get(setUrl)
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        #check if on last page, signal to end while loup
        nextButton = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.ID, "nextButton"))
        )
        nextButtonClasses = nextButton.get_attribute('class')
        if 'disable' in nextButtonClasses:
            notLastPage = False
        # select all product results
        results = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "search-result"))
        )


        # update referenceLib with new items on current page, if any
        referenceLib = gatherPageNewItems(referenceLib, results)
        
        credentials = referenceLib['credentials']
        set_ = referenceLib['set_']

        # add any new cards to bills pc
        cardsToAdd = referenceLib['cardsToAdd']
        if len(cardsToAdd) > 0:
            addCardsBillsPc(cardsToAdd, credentials, set_)
            # update referenceData with newly added cards
            currentSetCards = getCardsBillsPc(set_, credentials)
            referenceLib['currentSetCards'] = currentSetCards
        # add any new products to bills pc
        productsToAdd = referenceLib['productsToAdd']
        if len(productsToAdd) > 0:
            addProductsBillsPc(productsToAdd, credentials, set_)
            # update referenceData with newly added products
            currentSetProducts = getProductsBillsPc(set_, credentials)
            referenceLib['currentSetProducts'] = currentSetProducts

        # reset cards and products to add arrays
        referenceLib['cardsToAdd'] = []
        referenceLib['productsToAdd'] = []

        # update referenceLib with page market prices, including the new items from current page
        referenceLib = gatherPageMarketPrices(referenceLib, results)
        time.sleep(3)
        pageNum = str(int(pageNum) + 1)

    browser.close()
    time.sleep(5)
    browser.quit()
    time.sleep(5)
    return referenceLib
    