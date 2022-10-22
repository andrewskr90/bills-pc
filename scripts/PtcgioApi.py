import os
import requests
from logger import logger

baseurl = 'https://api.pokemontcg.io/v2'

def getSetsPtcgio():
    try:
        ptcgioSets = requests.get(f'{baseurl}/sets')
        if ptcgioSets.status_code != 200:
            message = ptcgioSets.json()['message']
            logger.debug(message)
            raise SystemExit(message) 
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    return ptcgioSets.json()