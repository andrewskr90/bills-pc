import os
from datetime import datetime, timedelta
import time
import requests
from threading import Timer
import json
import argparse
from billsPcApi import loginBillsPc, getSetsBillsPc, getCardsBillsPc, getProductsBillsPc, getMarketPricesBillsPc, addMarketPricesBillsPc, getMarketPricesByCardIdBillsPc, getMarketPricesByProductIdBillsPc
from billsPcScraper import processResultsPerPage, gatherPageMarketPrices

credentials = loginBillsPc()
            
def marketPriceScrape():
    parser = argparse.ArgumentParser()
    parser.add_argument("-s", "--set", help='Takes name of set to target for adding prices.')
    parser.add_argument("-i", "--id", help='Takes id of set to target for adding prices.')
    args = parser.parse_args()

    # if set flag exists
    if args.set:
        parameter = f"set_v2_name={args.set}"
        setsToSearch = getSetsBillsPc(credentials, parameters)
    # else if id flag exists
    elif args.id:
        parameter = f"set_v2_id={args.id}"
        setsToSearch = getSetsBillsPc(credentials, parameters)
    # else, loup through all sets in bills_pc
    else:
        setsToSearch = getSetsBillsPc(credentials, None)
    
    for set_ in setsToSearch:
        print(f"------------------------Scraping Market Prices: {set_['set_v2_name']}------------------------")
        # get set cards and products from bills_pc
        currentSetCards = getCardsBillsPc(set_, credentials)
        currentSetProducts = getProductsBillsPc(set_, credentials)

        # check if current set has been scraped already today
        if len(currentSetCards) > 0:
            firstCardId = currentSetCards[0]['card_v2_id']
            parameters = f"limit=1"
            cardMarketPrice = getMarketPricesByCardIdBillsPc(credentials, firstCardId, parameters)
            if len(cardMarketPrice) > 0:
                mostRecentPriceDate = cardMarketPrice[0]['created_date'].split('T')[0]
                todaysDate = str(datetime.utcnow().date())
                # check if most recent date matches todays date
                if mostRecentPriceDate == todaysDate:
                    print(f"---------{set_['set_v2_name']} has already been scraped today---------")
                    continue
        # just in case current set only has sealed product i.e. World Championship Decks
        elif len(currentSetProducts) > 0:
            firstProductId = currentSetProducts[0]['product_id']
            parameters = f"limit=1"
            productMarketPrices = getMarketPricesByProductIdBillsPc(credentials, firstProductId, parameters)

            if len(productMarketPrices) > 0:
                mostRecentPriceDate = productMarketPrices[0]['created_date'].split('T')[0]
                todaysDate = str(datetime.utcnow().date())
                # check if most recent date matches todays date
                if mostRecentPriceDate == todaysDate:
                    print(f"---------{set_['set_v2_name']} has already been scraped today---------")
                    continue
        referenceLib = {}
        referenceLib['set_'] = set_
        referenceLib['currentSetCards'] = currentSetCards
        referenceLib['currentSetProducts'] = currentSetProducts
        referenceLib['marketPricesToAdd'] = []
        referenceLib['visitedItems'] = {}
        referenceLib = processResultsPerPage(referenceLib, gatherPageMarketPrices)
        marketPricesToAdd = referenceLib['marketPricesToAdd']
        addMarketPricesBillsPc(marketPricesToAdd, credentials, set_)

def oneDay():
    x=datetime.today()
    y=x.replace(day=x.day+1, hour=0, minute=0, second=0, microsecond=0) + timedelta(minutes=1)
    delta_t=y-x
    return delta_t.seconds
def startMarketPriceScrape():
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------------------------------------------------------------------------')
    print('------------------------------------------It Is Midnight UTC------------------------------------------------')
    print(f'------------------------------------------{datetime.today()}-------------------------------------------------')
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
