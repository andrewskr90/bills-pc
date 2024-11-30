import { getAllItemsInExpansionBillsPc, getCardsBillsPc, getProductsBillsPc, getSetsBillsPc, loginBillsPc, postItemsBillsPc } from "./api/index.js";

const cookies = await loginBillsPc()
let moreSets = true
let page = 1
while (moreSets) {
    try {
        const sets = await getSetsBillsPc(cookies, { page })
        for (let i=0; i<sets.length; i++) {
            const curSet = sets[i]
            const existingItems = await getAllItemsInExpansionBillsPc(curSet.set_v2_id, cookies)
            const existingItemLib = {}
            existingItems.forEach(item => existingItemLib[item.tcgpId] = 1)
            const curCards = await getCardsBillsPc({ card_v2_set_id: curSet.set_v2_id }, cookies)
            const cardsToAdd = curCards.filter(card => !existingItemLib[card.card_v2_tcgplayer_product_id])
            const formattedCards = cardsToAdd.map(card => ({
                id: card.card_v2_id,
                setId: card.card_v2_set_id,
                tcgpId: card.card_v2_tcgplayer_product_id, // must be unique
                name: card.card_v2_name,
            }))
            if (formattedCards.length > 0) {
                const createdIds = await postItemsBillsPc(formattedCards, cookies)
                console.log(`Created items for ${curSet.set_v2_name} cards`)
            } else console.log('no cards to add to items')

            const curProducts = await getProductsBillsPc({ product_set_id: curSet.set_v2_id }, cookies)
            const productsToAdd = curProducts.filter(product => !existingItemLib[product.product_tcgplayer_product_id])
            const filteredDifference = curProducts.length - productsToAdd.length
            if (filteredDifference !== 0) console.log(`${filteredDifference} products already present`)
            const formattedProducts = productsToAdd.map(product => ({
                id: product.product_id,
                setId: product.product_set_id,
                tcgpId: product.product_tcgplayer_product_id, // must be unique
                name: product.product_name,
            }))
            if (formattedProducts.length > 0) {
                const createdIds = await postItemsBillsPc(formattedProducts, cookies)
                console.log(`CREATED items for ${curSet.set_v2_name} products`)
            } else console.log(`no products to add from ${curSet.set_v2_name}`)
        }
        if (sets.length === 0) moreSets = false
    } catch (err) {
        console.log(err)
    }
    page += 1
}