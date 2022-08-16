import os
import requests
import logging
import mechanicalsoup
logging.basicConfig(filename='addSetsFromTcgPlayer.log', encoding='utf-8', level=logging.DEBUG)


cookieValue = os.getenv('BILLS_PC_SESSION')
cookies = {'billsPcSession': cookieValue}

browser = mechanicalsoup.Browser()
cardPriceUrl = 'https://shop.tcgplayer.com/price-guide/pokemon/'
cardPricePage = browser.get(cardPriceUrl)
cardPriceHtml = cardPricePage.soup
setListDropDown = cardPriceHtml.select('#set')
setListOptions = setListDropDown[0].select('option')

##get sets already present in db
try:
    billsPcSetsV2 = requests.get('http://localhost:7070/api/v1/sets-v2', cookies=cookies)
    if billsPcSetsV2.status_code != 200:
        message = billsPcSetsV2.json()['message']
        logging.debug(message)
        raise SystemExit(message)  
except requests.exceptions.RequestException as e:
    raise SystemExit(e)

##create library of sets already present in db
existingSets = billsPcSetsV2.json()
billsPcSetsV2Obj = {}
for set_ in existingSets:
    existingSetName = set_['set_v2_name']
    billsPcSetsV2Obj[existingSetName] = 1
##add new sets to list
newSets = []
for option in setListOptions:
    setName = option.string
    if setName in billsPcSetsV2Obj:
        continue
    else:
        setObj = {}
        setObj['set_v2_name'] = setName
        newSets.append(setObj)
##insert new sets into db
try:
    addedSets = requests.post('http://localhost:7070/api/v1/sets-v2', json=newSets, cookies=cookies)
    print(addedSets.json())
    print(len(addedSets.json()))
except requests.exceptions.RequestException as e:
    raise SystemExit(e)
print(addedSets)
print(addedSets.json())