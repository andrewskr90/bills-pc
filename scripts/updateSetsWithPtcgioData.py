from PtcgioApi import getSetsPtcgio
from billsPcApi import getSetsBillsPc, loginBillsPc, updateSetBillsPc

ptcgioSets = getSetsPtcgio()['data']
billsPcCredentials = loginBillsPc()
billsPcSets = getSetsBillsPc(billsPcCredentials, None)
sameCount = 0
diffCount = 0
bSetLib = {}
pSetLib = {}
unmatchedNames = []

# loop through my sets
    # loop through their sets
    # if my set name equals their set name
        # save the id
        # break
    # if my parsed name is shiny vault
        # check for sm or swsh
            # save correct id
            # break
    # if my parsed name = their name
        # save the id
        # break
for bSet in billsPcSets:
    parsedName = None
    bSet['set_v2_ptcgio_id'] = None
    for pSet in ptcgioSets:
        # name's are identical
        if bSet['set_v2_name'] == pSet['name']:
            bSet['set_v2_ptcgio_id'] = pSet['id']    
            break
        else:
            # check for shiny vault
            if 'Shiny Vault' in bSet['set_v2_name']:
                if 'Hidden Fates' in bSet['set_v2_name']:
                    if pSet['id'] == 'sma':
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
                elif 'Shining Fates' in bSet['set_v2_name']:
                    if pSet['id'] == 'swsh45sv':
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
            # check for split similarities
            nameSplit = bSet['set_v2_name'].split()
            if nameSplit[0] == 'XY':
                if nameSplit[1] == '-':
                    nameSplit.pop(0)
                    nameSplit.pop(0)
                    parsedName = ' '.join(nameSplit)
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
                elif bSet['set_v2_name'] == 'XY Base Set':
                    parsedName = 'XY'
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
                elif bSet['set_v2_name'] == 'XY Promos':
                    parsedName = 'XY Black Star Promos'
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
            elif nameSplit[0] == 'SM':
                if nameSplit[1] == '-':
                    nameSplit.pop(0)
                    nameSplit.pop(0)
                    parsedName = ' '.join(nameSplit)
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
                elif bSet['set_v2_name'] == 'SM Base Set':
                    parsedName = 'Sun & Moon'   
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
                elif bSet['set_v2_name'] == 'SM Promos':
                    parsedName = 'SM Black Star Promos'
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']
                        break
            elif 'SWSH' in nameSplit[0]:
                nameSplit.pop(0)
                postColon = ' '.join(nameSplit)
                if postColon == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
                elif bSet['set_v2_name'] == 'SWSH01: Sword & Shield Base Set':
                    parsedName = 'SWSH01: Sword & Shield Base Set'
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']    
                        break
                elif bSet['set_v2_name'] == 'SWSH: Sword & Shield Promo Cards':
                    parsedName = 'SWSH: Sword & Shield Promo Cards'
                    if parsedName == pSet['name']:
                        bSet['set_v2_ptcgio_id'] = pSet['id']    
                        break
            elif bSet['set_v2_name'] == 'Unleashed':
                parsedName = 'HS—Unleashed'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Undaunted':
                parsedName = 'HS—Undaunted'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Triumphant':
                parsedName = 'HS—Triumphant'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Alternate Art Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'BW Trainer Kit: Excadrill & Zoroark':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Base Set':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Base Set (Shadowless)':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Battle Academy':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Battle Academy 2022':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Best of Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Black and White':
                parsedName = 'Black & White'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Black and White Promos':
                parsedName = 'BW Black Star Promos'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Blister Exclusives':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Burger King Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Countdown Calendar Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'DP Trainer Kit: Manaphy & Lucario':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'DP Training Kit 1 Blue':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'DP Training Kit 1 Gold':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Deck Exclusives':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Diamond and Pearl':
                parsedName = 'Diamond & Pearl'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Diamond and Pearl Promos':
                parsedName = 'DP Black Star Promos'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'EX Battle Stadium':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'EX Trainer Kit 1: Latias & Latios':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'EX Trainer Kit 2: Plusle & Minun':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Expedition':
                parsedName = 'Expedition Base Set'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'First Partner Pack':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Generations: Radiant Collection':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'HGSS Promos':
                parsedName = 'HGSS Black Star Promos'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'HGSS Trainer Kit: Gyarados & Raichu':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'HeartGold SoulSilver':
                parsedName = 'HeartGold & SoulSilver'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Hidden Fates: Shiny Vault':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Jumbo Cards':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Kids WB Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'League & Championship Cards':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Legendary Treasures: Radiant Collection':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's 25th Anniversary Promos":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2011":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2012":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2014":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2015":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2016":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2017":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2018":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2019":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == "McDonald's Promos 2022":
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Miscellaneous Cards & Products':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Nintendo Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Pikachu World Collection Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Pokemon GO':
                parsedName = 'Pokémon GO'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Professor Program Promos':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Ruby and Sapphire':
                parsedName = 'Ruby & Sapphire'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Rumble':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'SM Trainer Kit: Alolan Sandslash & Alolan Ninetales':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'SM Trainer Kit: Lycanroc & Alolan Raichu':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Shining Fates: Shiny Vault':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'Trick or Trade BOOster Bundle':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'WoTC Promo':
                parsedName = 'Wizards Black Star Promos'
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'World Championship Decks':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'XY Trainer Kit: Bisharp & Wigglytuff':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'XY Trainer Kit: Latias & Latios':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'XY Trainer Kit: Pikachu Libre & Suicune':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            elif bSet['set_v2_name'] == 'XY Trainer Kit: Sylveon & Noivern':
                parsedName = ''
                if parsedName == pSet['name']:
                    bSet['set_v2_ptcgio_id'] = pSet['id']    
                    break
            else:
              continue
    
    # print(bSet)
    updateSetBillsPc(bSet, billsPcCredentials)
    # parsedName is set
    # copy pSet values to bSet
    
    
