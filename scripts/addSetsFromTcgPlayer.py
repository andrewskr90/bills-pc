import os
import requests
import logging
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

# configure logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler('priceCheck.log', 'w', 'utf-8')
logger.addHandler(handler)

# configure login info
loginInfo = {}
loginInfo['user_name'] = 'kyle'
loginInfo['user_password'] = os.environ['GYM_LEADER_PASS']
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

browser = webdriver.Chrome(options=options, service=service)

# get all set options from tcgplayer
cardPriceUrl = 'https://shop.tcgplayer.com/price-guide/pokemon/'
cardPricePage = browser.get(cardPriceUrl)
setListDropDown = WebDriverWait(browser, 10).until(
    EC.presence_of_element_located((By.ID, "set"))
)
setListOptions = setListDropDown.find_elements(By.XPATH, './option')
# setListOptions = setListDropDown[0].select('option')

#get sets already present in bills_pc db
try:
    billsPcSetsV2 = requests.get(f'{baseurl}/api/v1/sets-v2', cookies=credentials)
    if billsPcSetsV2.status_code != 200:
        message = billsPcSetsV2.json()['message']
        logger.debug(message)
        raise SystemExit(message)  
except requests.exceptions.RequestException as e:
    raise SystemExit(e)
billsPcSetsData = billsPcSetsV2.json()

##create library of sets already present in db
existingSets = billsPcSetsV2.json()
billsPcSetsV2Obj = {}
for set_ in existingSets:
    existingSetName = set_['set_v2_name']
    billsPcSetsV2Obj[existingSetName] = 1
##add new sets to list
newSets = []
for option in setListOptions:
    setName = option.get_attribute('textContent')
    if setName in billsPcSetsV2Obj:
        continue
    else:
        setObj = {}
        setObj['set_v2_name'] = setName
        newSets.append(setObj)
##insert new sets into db
if len(newSets) < 1:
    print('Sets up to date.')
else:
    try:
        addedSets = requests.post(f'{baseurl}/api/v1/sets-v2', json=newSets, cookies=credentials)
        print(addedSets)
        if addedSets.status_code != 201:
            message = addedSets.json()['message']
            logger.debug(message)
            raise SystemExit(message)
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    print(f"-----------Added sets json: {addedSets.json()}")
    print(f"-----Number of sets inserted: {len(addedSets.json()['addedSets'])}")
    print('Script complete!')