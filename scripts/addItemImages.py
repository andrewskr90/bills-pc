import os
import time
import requests
import shutil
from billsPcApi import loginBillsPc, getSetsBillsPc, getCardsBillsPc, getProductsBillsPc

baseurl = os.environ['API_BASE_URL']

credentials = loginBillsPc()

setsToSearch = getSetsBillsPc(credentials, False)

for set_ in setsToSearch:
    print(f"-----Gathering {set_['set_v2_name']} images-----")
    # create directory for cards if it doesnt exist
    savePath = f"packages/client/src/assets/images/sets/{set_['set_v2_id']}/cards"
    if os.path.exists(savePath) == False:
        os.makedirs(savePath)
    currentSetCards = getCardsBillsPc(set_, credentials)
    for card in currentSetCards:
        smallImageUrl = f"https://product-images.tcgplayer.com/fit-in/200x279/{card['card_v2_tcgplayer_product_id']}.jpg"
        largeImageUrl = f"https://product-images.tcgplayer.com/fit-in/656x656/{card['card_v2_tcgplayer_product_id']}.jpg"
        smallFileName = f"{card['card_v2_id']}-small.jpg"
        smallCompleteName = os.path.join(savePath, smallFileName)
        largeFileName = f"{card['card_v2_id']}-large.jpg"
        largeCompleteName = os.path.join(savePath, largeFileName)

        if os.path.exists(smallCompleteName) == False:
            smallResponse = requests.get(smallImageUrl, stream=True)
            if smallResponse.status_code == 200:
                with open(smallCompleteName, 'wb') as out_file:
                    shutil.copyfileobj(smallResponse.raw, out_file)
                del smallResponse

        if os.path.exists(largeCompleteName) == False:
            largeResponse = requests.get(largeImageUrl, stream=True)
            if largeResponse.status_code == 200:
                with open(largeCompleteName, 'wb') as out_file:
                    shutil.copyfileobj(largeResponse.raw, out_file)
                del largeResponse
                time.sleep(5)

    # create directory for products if it doesnt exist
    savePath = f"packages/client/src/assets/images/sets/{set_['set_v2_id']}/products"
    if os.path.exists(savePath) == False:
        os.makedirs(savePath)
    currentSetProducts = getProductsBillsPc(set_, credentials)
    for product in currentSetProducts:
        smallImageUrl = f"https://product-images.tcgplayer.com/fit-in/200x279/{product['product_tcgplayer_product_id']}.jpg"
        largeImageUrl = f"https://product-images.tcgplayer.com/fit-in/656x656/{product['product_tcgplayer_product_id']}.jpg"
        smallFileName = f"{product['product_id']}-small.jpg"
        smallCompleteName = os.path.join(savePath, smallFileName)
        largeFileName = f"{product['product_id']}-large.jpg"
        largeCompleteName = os.path.join(savePath, largeFileName)

        if os.path.exists(smallCompleteName) == False:
            smallResponse = requests.get(smallImageUrl, stream=True)
            if smallResponse.status_code == 200:
                with open(smallCompleteName, 'wb') as out_file:
                    shutil.copyfileobj(smallResponse.raw, out_file)
                del smallResponse
                
        if os.path.exists(largeCompleteName) == False:
            largeResponse = requests.get(largeImageUrl, stream=True)
            if largeResponse.status_code == 200:
                with open(largeCompleteName, 'wb') as out_file:
                    shutil.copyfileobj(largeResponse.raw, out_file)
                del largeResponse
                time.sleep(5)

