import puppeteer from 'puppeteer-core'
import axios from 'axios'

const baseurl = process.env.API_BASE_URL

const loginBillsPc = async () => {
    const loginInfo = {}
    loginInfo.user = {}
    loginInfo.user.user_name = 'kyle'
    loginInfo.user.user_password = process.env.GYM_LEADER_PASS
    // login and set cookies
    try {
        const apiCredentials = await axios.post(`${baseurl}/api/v1/auth/login`, loginInfo)
        return apiCredentials.headers['set-cookie']
    } catch (err) {
        throw new Error(err)
    }
}

const getSetsBillsPc = async (cookies) => {
    try {
        const expansionsRes = await axios({
            baseURL: baseurl,
            url: '/api/v1/sets-v2',
            headers: { Cookie: cookies }
        })
        const expansions = expansionsRes.data
        expansions.sort((a, b) => {
            if (a.set_v2_name < b.set_v2_name) return -1
            else if (a.set_v2_name > b.set_v2_name) return 1
            else return 0
        })
        return expansions
    } catch (err) {
        throw new Error(err)
    }
}

const getCardsBillsPc = async (expansion, cookies) => {
    try {
        const billsPcCardsV2 = await axios({
            baseURL: baseurl,
            url: '/api/v1/cards-v2',
            headers: { Cookie: cookies },
            params: { card_v2_set_id: expansion.set_v2_id }
        })        
        return billsPcCardsV2.data
    } catch (err) {
        throw new Error(err)
    }
}

const getProductsBillsPc = async (expansion, cookies) => {
    try {
        const billsPcProducts = await axios({
            baseURL: baseurl,
            url: '/api/v1/products',
            headers: { Cookie: cookies },
            params: { product_set_id: expansion.set_v2_id }
        })        
        return billsPcProducts.data
    } catch (err) {
        throw new Error(err)
    }
}

const getMarketPricesBillsPc = async (cookies, parameters) => {
    try {
        const billsPcMarketPrices = await axios({
            baseURL: baseurl,
            url: '/api/v1/market-prices',
            headers: { Cookie: cookies },
            params: parameters
        })
        return billsPcMarketPrices.data
    } catch (err) {
        throw new Error(err)
    }
}

const getMarketPricesByCardIdBillsPc = async (cookies, cardId, parameters) => {
    try {
        const billsPcMarketPricesByCardId = await axios({
            baseURL: baseurl,
            url: `/api/v1/market-prices/card-id/${cardId}`,
            headers: { Cookie: cookies },
            params: parameters
        })
        return billsPcMarketPricesByCardId.data
    } catch (err) {
        throw new Error(err)
    }
}

const getMarketPricesByProductIdBillsPc = async (cookies, productId, parameters) => {
    try {
        const billsPcMarketPricesByProductId = await axios({
            baseURL: baseurl,
            url: `/api/v1/market-prices/product-id/${productId}`,
            headers: { Cookie: cookies },
            params: parameters
        })
        return billsPcMarketPricesByProductId.data
    } catch (err) {
        throw new Error(err)
    }
}

const addMarketPricesBillsPc = async (marketPricesToAdd, cookies, set_) => {
    // add market prices to bills_pc
    try {
        const addedMarketPrices = await axios({
            method: 'post',
            baseURL: baseurl,
            url: '/api/v1/market-prices',
            data: marketPricesToAdd,
            headers: { Cookie: cookies }
        })
        console.log(addedMarketPrices.status)
        console.log(`----------added ${marketPricesToAdd.length} prices from ${set_.set_v2_name}----------`)
    } catch (err) {
        console.log(`--DEBUG: Attempted to add these items: ${marketPricesToAdd}`)
        throw new Error(err)
    }
}

const addCardsBillsPc = async (cardsToAdd, cookies, set_) => {
    try {
        const addedCards = await axios({
            method: 'post',
            baseURL: baseurl,
            url: 'api/v1/cards-v2',
            data: cardsToAdd,
            headers: { Cookie: cookies }
        })
        console.log(addedCards.status)
        console.log(`added ${cardsToAdd.length} from ${set_.set_v2_name}`)
    } catch (err) {
        throw new Error(err)
    }
}

const addProductsBillsPc = async (productsToAdd, cookies, set_) => {
    try {
        const addedProducts = await axios({
            method: 'post',
            baseURL: baseurl,
            url: 'api/v1/products',
            data: productsToAdd,
            headers: { Cookie: cookies }
        })
        console.log(addedProducts.status)
        console.log(`added ${productsToAdd.length} from ${set_.set_v2_name}`)
    } catch (err) {
        throw new Error(err)
    }
}

const formatSetNameForUrl = (set_) => {
    // format set name to match webpage url
    let curSetName = set_.set_v2_name
    curSetName = curSetName.replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/\ /g, '-')
        .replace(/\---/g, '-')
        .replace(/\--/g, '-')
        .replace(/\'/g, '')
        .replace(/\:/g, '')
        .replace(/\&/g, 'and')
    return curSetName.toLowerCase()
}

const gatherPageNewItems = async (referenceLib, results) => {
    const currentSetCards = referenceLib.currentSetCards
    const currentSetProducts = referenceLib.currentSetProducts
    const currentSetCardsLib = referenceLib.currentSetCardsLib
    const currentSetProductsLib = referenceLib.currentSetProductsLib
    const cardsToAdd = referenceLib.cardsToAdd
    const productsToAdd = referenceLib.productsToAdd
    const set_ = referenceLib.set_
    const page = referenceLib.page
    for (let i=0; i<results.length; i++) {
        // item set id
        const itemSetId = set_.set_v2_id
        // item tcg product id
        const itemATag = await results[i].$$("xpath/./div[@class='search-result__content']/a")
        const itemATagHref = await page.evaluate((element) => element.href, itemATag[0])
        const itemTcgProductId = itemATagHref.split('/')[4]
        // item name
        const itemNameElement = await results[i].$('.search-result__title')
        const itemName = await page.evaluate((element) => element.textContent, itemNameElement)
        const resultRaritySection = await results[i].$$("xpath/./div/a/section/section[@class='search-result__rarity']")
        // item is card
        if (resultRaritySection.length === 1) {
            // card rarity
            const cardRaritySection = await resultRaritySection[0].$$('xpath/./span[1]')
            let cardRarity = null
            if (cardRaritySection.length === 1) {
                const cardRarityElement = cardRaritySection[0]
                cardRarity = await page.evaluate(element => element.textContent, cardRarityElement)
            }
            // card number
            const cardNumberSection = await resultRaritySection[0].$$('xpath/./span[3]')
            let cardNumber = null
            if (cardNumberSection.length === 1) {
                const cardNumberElement = cardNumberSection[0]
                cardNumber = await page.evaluate(element => element.textContent, cardNumberElement)
            }
            if (!currentSetCardsLib[parseInt(itemTcgProductId)]) {
                // format card
                const cardToAdd = {}
                cardToAdd.card_v2_set_id = itemSetId
                cardToAdd.card_v2_name = itemName
                cardToAdd.card_v2_number = cardNumber
                cardToAdd.card_v2_rarity = cardRarity
                cardToAdd.card_v2_tcgplayer_product_id = parseInt(itemTcgProductId)
                cardToAdd.card_v2_foil_only = null
                console.log(`**found NEW CARD, ${cardToAdd.card_v2_name}, tcgId:${cardToAdd.card_v2_tcgplayer_product_id}`)                    
                cardsToAdd.push(cardToAdd)
                currentSetCards.push(cardToAdd)
                currentSetCardsLib[cardToAdd.card_v2_tcgplayer_product_id] = 1
            }
        } else {
            // format product
            const productToAdd = {}
            productToAdd.product_set_id = itemSetId
            productToAdd.product_name = itemName
            productToAdd.product_release_date = null
            productToAdd.product_description = null
            productToAdd.product_tcgplayer_product_id = parseInt(itemTcgProductId)
            if  (!currentSetProductsLib[productToAdd.product_tcgplayer_product_id]) {
                console.log(`**found NEW PRODUCT, ${productToAdd.product_name}, tcgId:${productToAdd.product_tcgplayer_product_id}`)
                productsToAdd.push(productToAdd)
                currentSetProducts.push(productToAdd)
                currentSetProductsLib[productToAdd.product_tcgplayer_product_id] = 1
            }
        }
    }

    referenceLib.currentSetCards = currentSetCards
    referenceLib.currentSetProducts = currentSetProducts
    referenceLib.currentSetCardsLib = currentSetCardsLib
    referenceLib.currentSetProductsLib = currentSetProductsLib
    referenceLib.cardsToAdd = cardsToAdd
    referenceLib.productsToAdd = productsToAdd
    return referenceLib
}

const gatherPageMarketPrices = async (referenceLib, results) => {
    // initialize variables
    const set_ = referenceLib.set_
    const currentSetCards = referenceLib.currentSetCards
    const currentSetProducts = referenceLib.currentSetProducts
    const marketPricesToAdd = referenceLib.marketPricesToAdd
    const visitedItems = referenceLib.visitedItems
    const curSetId = set_.set_v2_id
    const page = referenceLib.page
    // format and add each item market price to bills_pc db
    for (let i=0; i<results.length; i++) {
        // item set id
        const itemSetId = curSetId
        // item tcg product id
        const itemATag = await results[i].$$("xpath/./div[@class='search-result__content']/a")
        const itemATagHref = await page.evaluate(element => element.href, itemATag[0])
        const itemTcgProductId = parseInt(itemATagHref.split('/')[4])
        // item name
        const itemNameElement = await results[i].$$('.search-result__title')
        const itemName = await page.evaluate(element => element.textContent, itemNameElement[0])
        const resultRaritySection = await results[i].$$("xpath/./div/a/section/section[@class='search-result__rarity']")
        // item market price
        const itemMarketPriceSectionToCheck = await results[i].$$("xpath/./div/a/section/section[@class='search-result__market-price']/section")
        // check if market price not available
        const sectionClassNames = await page.evaluate(element => element.className, itemMarketPriceSectionToCheck[0])
        let itemMarketPrice = null
        if (!sectionClassNames.includes('unavailable')) {
            const itemMarketPriceElement = await itemMarketPriceSectionToCheck[0].$$("xpath/./span[@class='search-result__market-price--value']")
            let itemMarketPriceString = await page.evaluate(element => element.textContent, itemMarketPriceElement[0])
            itemMarketPriceString = itemMarketPriceString.replace(/\$/g, '')
            itemMarketPriceString = itemMarketPriceString.replace(/\,/g, '')
            itemMarketPrice = parseFloat(itemMarketPriceString)
        }
        const marketPriceToAdd = {}
        // make sure item not visited
        if (!visitedItems[itemTcgProductId]) {
            // add item to visitedItems
            visitedItems[itemTcgProductId] = 1
            // item is card
            if (resultRaritySection.length === 1) {
                // find card_v2_id
                if (currentSetCards.length > 0) {
                    const matchedCard = currentSetCards.filter(card => {
                        return card.card_v2_tcgplayer_product_id === itemTcgProductId
                    })
                    if (matchedCard.length === 0) {
                        console.log(`WARNING: Card with tcgId ${itemTcgProductId} not present in Bills Pc DB. Update bills_pc.cards_v2 with cards from set with id: ${curSetId}.`)
                    } else {
                        // format card market price
                        marketPriceToAdd.market_price_card_id = matchedCard[0].card_v2_id
                        marketPriceToAdd.market_price_price = itemMarketPrice
                        marketPriceToAdd.market_price_product_id = null
                        marketPricesToAdd.push(marketPriceToAdd)
                    }    
                } else {
                    console.log(`WARNING: No cards added to current set with id ${curSetId}`)
                }
            // item is product
            } else {
                // find product_id
                if (currentSetProducts.length > 0) {
                    const matchedProduct = currentSetProducts.filter(product => {
                        return product.product_tcgplayer_product_id === itemTcgProductId
                    })
                    if (matchedProduct.length === 0) {
                        console.log(`WARNING: Product with tcgId ${itemTcgProductId} not present in Bills Pc DB. Update bills_pc.products with products from set with id: ${curSetId}.`)
                    } else {
                        // format product market price
                        marketPriceToAdd.market_price_card_id = null
                        marketPriceToAdd.market_price_price = itemMarketPrice
                        marketPriceToAdd.market_price_product_id = matchedProduct[0].product_id
                        marketPricesToAdd.push(marketPriceToAdd)
                    }    
                } else {
                    console.log(`WARNING: No products added to current set with id ${curSetId}`)
                }
            }
        }
    }
    referenceLib.marketPricesToAdd = marketPricesToAdd
    referenceLib.visitedItems = visitedItems
    return referenceLib
}

const processNewItemsThenMarketPerPage = async (referenceLib, gatherPageMarketPrices, gatherPageNewItems) => {
    const collectionArray = []
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: ['--no-sandbox']
    })
    const page = await browser.newPage()
    // initialize variables
    let pageNum = 1
    let notLastPage = true   
    const curSetName = formatSetNameForUrl(referenceLib.set_)
    // skipping dp training kit blue and gold until I can confirm they should be removed
    if (curSetName === 'dp-training-kit-1-blue' || curSetName === 'dp-training-kit-1-gold') {
        console.log('deprecated set', curSetName)
        return referenceLib
    }
    while (notLastPage) {
        let category = 'pokemon'
        if (curSetName === 'pokemon-international-storage-albums') {
            category = 'storage-albums'
        }
        // open product page with driver, using current set and current page
        const setUrl = `https://www.tcgplayer.com/search/${category}/${curSetName}?Price_Condition=Less+Than&advancedSearch=true&productLineName=${category}&view=grid&setName=${curSetName}&page=${pageNum}`
        await page.goto(setUrl)
        await page.setViewport({width: 1080, height: 1024})
        const nextPageElement = await page.waitForSelector('aria/Next page')
        const nextPageButtonClasses = await page.evaluate(element => element.classList, nextPageElement)
        if (Object.values(nextPageButtonClasses).indexOf('is-disabled') > -1) {
            notLastPage = false
        }
        //  select all product results
        const results = await page.$$('.search-result')

        //  update referenceLib with new items on current page, if any
        referenceLib.page = page
        referenceLib = await gatherPageNewItems(referenceLib, results)
        const cookies = referenceLib.cookies
        const set_ = referenceLib.set_

        //  add any new cards to bills pc
        const cardsToAdd = referenceLib.cardsToAdd
        if (cardsToAdd.length > 0) {
            try {
                await addCardsBillsPc(cardsToAdd, cookies, set_)
                //  update referenceData with newly added cards
                const currentSetCards = await getCardsBillsPc(set_, cookies)
                referenceLib.currentSetCards = currentSetCards
            } catch (err) {
                console.log(err)
            }
        }
        //  add any new products to bills pc
        const productsToAdd = referenceLib.productsToAdd
        if (productsToAdd.length > 0) {
            try {
                await addProductsBillsPc(productsToAdd, cookies, set_)
                //  update referenceData with newly added products
                const currentSetProducts = await getProductsBillsPc(set_, cookies)
                referenceLib.currentSetProducts = currentSetProducts
            } catch (err) {
                console.log(err)
            }
        }

        //  reset cards and products to add arrays
        referenceLib.cardsToAdd = []
        referenceLib.productsToAdd = []

        //  update referenceLib with page market prices, including the new items from current page
        referenceLib = await gatherPageMarketPrices(referenceLib, results)
        pageNum = (parseInt(pageNum) + 1).toString()
    }
    await browser.close()
    return referenceLib
}

const marketScraper = async () => {
    const cookies = await loginBillsPc()
    const setsToSearch = await getSetsBillsPc(cookies)

    for (let i=0; i< setsToSearch.length; i++) {
        console.log(`------------------------Scraping Market Prices: ${setsToSearch[i].set_v2_name}------------------------`)
        //  get set cards and products from bills_pc
        let currentSetCards
        let currentSetProducts
        try {
            currentSetCards = await getCardsBillsPc(setsToSearch[i], cookies)
            currentSetProducts = await getProductsBillsPc(setsToSearch[i], cookies)
        } catch (err) {
            throw new Error(err)
        }
        //  check if current set has been scraped already today
        if (currentSetCards.length > 0) {
            const firstCardId = currentSetCards[0].card_v2_id
            const parameters = { limit: 1 }
            let cardMarketPrice
            try {
                cardMarketPrice = await getMarketPricesByCardIdBillsPc(cookies, firstCardId, parameters)
            } catch (err) {
                throw new Error(err)
            }
            if (cardMarketPrice.length > 0) {
                const mostRecentPriceDate = cardMarketPrice[0].created_date.split('T')[0]
                const todaysDate = new Date()
                todaysDate.setHours(0,0,0,0)

                // check if most recent date matches todays date
                if (mostRecentPriceDate === todaysDate.toISOString().split('T')[0]) {
                    console.log(`---------${setsToSearch[i].set_v2_name} has already been scraped today---------`)
                    continue
                }
            }
        //  just in case current set only has sealed product i.e. World Championship Decks
        } else if (currentSetProducts.length > 0) {
            const firstProductId = currentSetProducts[0].product_id
            const parameters = { limit: 1 }
            let productMarketPrice
            try {
                productMarketPrice = await getMarketPricesByProductIdBillsPc(cookies, firstProductId, parameters)
            } catch (err) {
                throw new Error(err)
            }
            if (productMarketPrice.length > 0) {
                const mostRecentPriceDate = productMarketPrice[0].created_date.split('T')[0]
                const todaysDate = new Date()
                todaysDate.setHours(0,0,0,0)
                //  check if most recent date matches todays date
                if (mostRecentPriceDate === todaysDate.toISOString().split('T')[0]) {
                    console.log(`---------${setsToSearch[i].set_v2_name} has already been scraped today---------`)
                    continue
                }
            }
        }
        //  building currentSet Cards and Products from addItemsFromTcgPlayer
        const currentSetCardsLib = {}
        const currentSetProductsLib = {}

        //  flag cards as visited
        currentSetCards.forEach(card => {
            const cardTcgId = card.card_v2_tcgplayer_product_id
            currentSetCardsLib[cardTcgId] = 1
        })
        //  flag products as visited
        currentSetProducts.forEach(product => {
            const productTcgId = product.product_tcgplayer_product_id
            currentSetProductsLib[productTcgId] = 1
        })
        let referenceLib = {}
        referenceLib.set_ = setsToSearch[i]
        referenceLib.currentSetCards = currentSetCards
        referenceLib.currentSetProducts = currentSetProducts
        referenceLib.marketPricesToAdd = []
        referenceLib.visitedItems = {}
        //  referenceLib variables needed for addItemsFromTcgPlayer
        referenceLib.currentSetCardsLib = currentSetCardsLib
        referenceLib.currentSetProductsLib = currentSetProductsLib
        referenceLib.cardsToAdd = []
        referenceLib.productsToAdd = []
        referenceLib.cookies = cookies
        try {
            referenceLib = await processNewItemsThenMarketPerPage(referenceLib, gatherPageMarketPrices, gatherPageNewItems)
            const marketPricesToAdd = referenceLib.marketPricesToAdd
            if (marketPricesToAdd.length > 0) {
                await addMarketPricesBillsPc(marketPricesToAdd, cookies, setsToSearch[i])
            }
        } catch (err) {
            throw new Error(err)
        }
    }
}

const startScraper = async () => {
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------It Is Midnight UTC------------------------------------------------')
    console.log(`---------------------------------${new Date()}--------------------------------`)
    console.log('-------------------------------------Starting Market Price Scrape-------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')

    await marketScraper()
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('-------------------------------------Market Price Scrape Finished-------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')
    console.log('------------------------------------------------------------------------------------------------------------')

    const now = new Date()
    const midnight = new Date()
    midnight.setDate(midnight.getDate()+1)
    midnight.setUTCHours(0,0,0,0)
    const timeUntilMidnight = midnight-now
    await setTimeout(async () => {
        await startScraper()
    }, timeUntilMidnight)
}

try {
    await startScraper()
} catch (err) {
    console.log(err)
    throw new Error
}