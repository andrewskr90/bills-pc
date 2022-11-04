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
from billsPcApi import loginBillsPc, getSetsBillsPc, getCardsBillsPc, getProductsBillsPc, addCardsBillsPc, addProductsBillsPc
from billsPcScraper import processResultsPerPage, gatherPageNewItems

credentials = loginBillsPc()

parser = argparse.ArgumentParser()
parser.add_argument("-s", "--set", help='Takes name of set to target for adding items.')
parser.add_argument("-i", "--id", help='Takes id of set to target for adding items.')
args = parser.parse_args()

# if set flag exists
if args.set:
    parameter = f"set_v2_name={args.set}"
    setsToSearch = getSetsBillsPc(credentials, parameter)
# else if id flag exists
elif args.id:
    parameter = f"set_v2_id={args.id}"
    setsToSearch = getSetsBillsPc(credentials, parameter)
# else, loup through all sets in bills_pc
else:
    setsToSearch = getSetsBillsPc(credentials, False)

try:
    for set_ in setsToSearch:
        print(f"------------------------Scraping Set: {set_['set_v2_name']}------------------------")

        pageNum = '1'
        notLastPage = True
        cardsToAdd = []
        currentSetCardsLib = {}
        productsToAdd =[]
        currentSetProductsLib = {}

        # get cards and products already in bills_pc db
        currentSetCards = getCardsBillsPc(set_, credentials)
        currentSetProducts = getProductsBillsPc(set_, credentials)
        # flag cards as visited
        for card in currentSetCards:
            cardTcgId = card['card_v2_tcgplayer_product_id']
            currentSetCardsLib[cardTcgId] = 1
        # flag products as visited
        for product in currentSetProducts:
            productTcgId = product['product_tcgplayer_product_id']
            currentSetProductsLib[productTcgId] = 1

        referenceLib = {}
        referenceLib['set_'] = set_
        referenceLib['currentSetCards'] = currentSetCards
        referenceLib['currentSetProducts'] = currentSetProducts
        referenceLib['cardsToAdd'] = []
        referenceLib['productsToAdd'] = []
        referenceLib['currentSetCardsLib'] = currentSetCardsLib
        referenceLib['currentSetProductsLib'] = currentSetProductsLib
        referenceLib = processResultsPerPage(referenceLib, gatherPageNewItems)
        cardsToAdd = referenceLib['cardsToAdd']
        productsToAdd = referenceLib['productsToAdd']

        #add items to bills_pc
        if len(cardsToAdd) > 0:
            addCardsBillsPc(cardsToAdd, credentials, set_)
        if len(productsToAdd) > 0:
            addProductsBillsPc(productsToAdd, credentials, set_)
        if len(cardsToAdd) == 0 and len(productsToAdd) == 0:
            print(f"Items from {set_['set_v2_name']} up to date.")
        
finally:
    print('Finished searching for new items to add to Bills Pc DB!')
