import { convertSaleItemToListing, getPortfolioBillsPc, getProxyUsers, loginBillsPc } from "./api/index.js";

const cookies = await loginBillsPc()
const portfolio = await getPortfolioBillsPc(cookies)
const proxyUsers = await getProxyUsers(cookies)

// TODO: convert gifts given to me
// TODO: check all transactions are formatted (sortings, where did the splits come from)

// delete sale items I converted, and only convert transactions outside of the Watched Listing component

const sellerLib = {}
for (let i=0; i<portfolio.sales.length; i++) {
    const sale = portfolio.sales[i]
    let saleVendor = sale.sale_vendor.toLowerCase()
    saleVendor = saleVendor.split('')
        .filter(letter => letter.match((/[a-z]/i))).join('')
    if (saleVendor === 'cafemox') {
        saleVendor = 'mox'
    }
    if (saleVendor === 'pokemonbyswift') {
        saleVendor = 'pokemonbyswyft'
    }
    if (!sellerLib[saleVendor]) sellerLib[saleVendor] = 1
    else  sellerLib[saleVendor] =  sellerLib[saleVendor] + 1
   
    const filteredUsers = proxyUsers.filter(user => user.user_name === saleVendor)
    if (filteredUsers.length > 1) console.log(filteredUsers)
    let sellerId = filteredUsers[0].user_id
    if (
        sale.sale_id === 'e45a8492-f189-44f3-b698-cf69bfd346bf' || 
        sale.sale_id === 'bb9293d0-5566-4471-9334-a783c92e5473' ||
        sale.sale_id === '9c5fe7d8-dc25-430e-9f35-5505f509d766'
    ) {
        // create listing with lot
        const listing = {
            date: sale.sale_date,
            description: undefined,
            sellerId,
            price: sale.sale_subtotal,
            cards: sale.saleCards.map(card => {
                return { collected_card_id: card.collected_card_id }
            }),
            products: sale.saleProducts.map(product => {
                return { collected_product_id: product.collected_product_id }
            }),
            bulkSplits: [],
            saleId: sale.sale_id
        }
        if (!listing.sellerId) console.log(listing)
        // console.log(listing)
        await convertSaleItemToListing(cookies, listing)
    } else {
        // create individual listings for each item
        for (let j=0; j<sale.saleCards.length; j++) {
            const saleCard = sale.saleCards[j]
            let price = saleCard.sale_card_price
            if (!saleCard.sale_card_price) price = sale.sale_subtotal
            // create listing using card price
            const listing = {
                date: sale.sale_date,
                description: undefined,
                sellerId,
                price,
                cards: [{ collected_card_id: saleCard.collected_card_id }],
                products: [],
                bulkSplits: [],
                saleId: sale.sale_id
            }
            if (!listing.sellerId) console.log(listing)
            await convertSaleItemToListing(cookies, listing)
        }
        for (let j=0; j<sale.saleProducts.length; j++) {
            // create listing
            const saleProduct = sale.saleProducts[j]
            const { collected_product_id } = saleProduct
            const listing = {
                date: sale.sale_date,
                description: undefined,
                sellerId,
                price: saleProduct.sale_product_price,
                cards: [],
                products: [{ collected_product_id }],
                bulkSplits: [],
                saleId: sale.sale_id
            }
            if (!listing.sellerId) console.log(listing)
            await convertSaleItemToListing(cookies, listing)
        }
        for (let j=0; j<sale.saleBulkSplits.length; j++) {
            // create listing
            const saleBulkSplit = sale.saleBulkSplits[j]
            let price = parseFloat(saleBulkSplit.sale_bulk_split_rate)* saleBulkSplit.bulk_split_count
            if (saleBulkSplit.bulk_split_id === 'fc7ed3d2-f286-46b2-bfea-4552299a5b82') price = 5
            if (saleBulkSplit.bulk_split_id === '0a139bc1-6279-4dcd-bc14-2fd964b3cd25') price = 100
            const listing = {
                date: sale.sale_date,
                description: undefined,
                sellerId,
                price,
                cards: [],
                products: [],
                bulkSplits: [{ bulk_split_id: saleBulkSplit.bulk_split_id }],
                saleId: sale.sale_id
            }
            if (!listing.sellerId) console.log(listing)
            await convertSaleItemToListing(cookies, listing)
        }
    }
    // WHAT ABOUT FREE CARDS INCLUDED WITH PURCHASE AT GAMESTOP?????
    // if (sale.saleCards.length === 1) console.log(sale)
}

// create listings
// update listing with sale