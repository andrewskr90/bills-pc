import logging

# configure logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler('priceCheck.log', 'w', 'utf-8')
logger.addHandler(handler)