const Transaction = require('../models/Transaction')
const CollectedItem = require('../models/CollectedItem')
const Condition = require('../models/Condition')
const Printing = require('../models/Printing')

const collectedItemActionTypes = {
    list: 'List',
    viewListing: 'View Listing',
    viewSale: 'View Sale',
    viewGift: 'View Gift',
    gift: 'Gift',
    viewLot: 'View Lot',
    removeFromLot: 'Remove from lot',
    updatePrice: 'Update Price',
    removeListing: 'Remove Listing',
    recordSale: 'Record Sale',
    appraise: 'Appraise'
}


const transactionTypes = {
    IMPORT: 'import',
    GIFT: 'gift',
    PURCHASE: 'purchase',
    SALE: 'sale',
    LISTING: 'listing',
    LISTING_PRICE: 'listingPrice',
    RELISTING: 'relisting',
    LISTING_REMOVAL: 'listingRemoval',
    LOT_EDIT: 'lotEdit'
}

const interpretTransactions = (transactions, userId) => {
    return transactions.map(transaction => {
        const {
            lotEditId,
            lotInsertId,
            lotRemovalId,
            lotId,
            importId,
            importerId,
            importerName,
            importCount,
            saleId,
            purchaserId,
            purchaserName,
            sellerId,
            sellerName,
            listingId,
            initialPrice,
            listingPriceId,
            relisted,
            updatedPrice,
            listingRemovalId,
            offerPrice,
            giftId,
            recipientId,
            recipientName,
            giverId,
            giverName,
            time
        } = transaction
        let id = ''
        let type = ''
        let transactionInfo = ''
        let actions = []
        if (lotEditId) {
            id = lotEditId
            type = transactionTypes.LOT_EDIT 




            // TODO inserted or removed from listed lot. Look at collectedItemId = '49f7a6cb-cf28-4fa6-9b22-49776939c794', '32596c51-a138-4d14-93d3-f8ec99876795'
            if (lotInsertId) {
                if (listingId) {
                    if (listingRemovalId) {
                        transactionInfo = 'Removed from lot'
                        actions = [
                            collectedItemActionTypes.list,
                            collectedItemActionTypes.gift,
                            collectedItemActionTypes.appraise
                        ]
                    } else {
                        transactionInfo = `Inserted in lot listed at ${updatedPrice ? updatedPrice : initialPrice}`
                        actions = [
                            collectedItemActionTypes.viewLot,
                            collectedItemActionTypes.viewListing,
                            collectedItemActionTypes.appraise
                        ]
                    }
                } else {
                    // inserted into lot
                    transactionInfo = 'Inserted in lot'
                    actions = [
                        collectedItemActionTypes.viewLot,
                            collectedItemActionTypes.appraise
                    ]
                }
            } else if (lotRemovalId) {
                // removed from lot
                transactionInfo = 'Removed from lot'
                actions = [
                    collectedItemActionTypes.list,
                    collectedItemActionTypes.gift,
                            collectedItemActionTypes.appraise
                ]
            }






        } else if (importId) {
            id = importId
            type = transactionTypes.IMPORT 


            // imported
            transactionInfo = `Imported by ${importerName}`
            actions = [
                collectedItemActionTypes.list, 
                collectedItemActionTypes.gift,
                collectedItemActionTypes.appraise
            ]


        } else if (giftId) {
            id = giftId
            type = transactionTypes.GIFT 
            if (recipientId === userId) {
                if (lotId) {

                    // gifted
                    transactionInfo = `Gift from ${giverName}`
                    actions = [
                        collectedItemActionTypes.list, 
                        collectedItemActionTypes.gift,
                        collectedItemActionTypes.appraise
                    ]

                } else {
                    // gifted
                    transactionInfo = `Lot gift from ${giverName}`
                    actions = [
                        collectedItemActionTypes.viewLot,
                        collectedItemActionTypes.appraise
                    ]
                }
            } else {

                if (lotId) {

                    // gifted
                    transactionInfo = `Gift to ${recipientName}`

                } else {
                    // gifted
                    transactionInfo = `Lot gift to ${recipientName}`
                
                }

                actions = [
                    collectedItemActionTypes.viewGift, 
                ]

            }
        } else if (listingId) {
            if (saleId) {
                id = saleId
                if (purchaserId === userId) {
                    type = transactionTypes.PURCHASE 



                    // purchased listing
                    if (lotId) {
                        transactionInfo = `Lot purchased by ${purchaserName} for $${updatedPrice ? updatedPrice : initialPrice}`
                        actions = [
                            collectedItemActionTypes.viewLot,
                            collectedItemActionTypes.appraise
                        ]
                    } else {
                        transactionInfo = `Purchased by ${purchaserName} for $${updatedPrice ? updatedPrice : initialPrice}`
                        actions = [
                            collectedItemActionTypes.list,
                            collectedItemActionTypes.gift,
                            collectedItemActionTypes.appraise
                        ]
                    }


                } else if (sellerId === userId) {
                    type = transactionTypes.SALE 


                    // sold listing
                    if (lotId) {
                        transactionInfo = `Lot sold to ${purchaserName} for $${updatedPrice ? updatedPrice : initialPrice}`
                        
                    } else {
                        transactionInfo = `Sold to ${purchaserName} for $${updatedPrice ? updatedPrice : initialPrice}`
                    
                    }
                    actions = [
                        collectedItemActionTypes.viewSale
                    ]


                } 
            } else {
                if (listingRemovalId) {
                    id = listingRemovalId
                    type = transactionTypes.LISTING_REMOVAL


                    // listing removal
                    if (lotId) {
                        transactionInfo = `Lot listing removed`
                        actions = [
                            collectedItemActionTypes.viewLot,
                            collectedItemActionTypes.appraise
                        ]
                    } else {
                        transactionInfo = `Item listing removed`
                        actions = [
                            collectedItemActionTypes.list, 
                            collectedItemActionTypes.gift,
                            collectedItemActionTypes.appraise
                        ]
                    }


                } else if (listingPriceId) {
                    id = listingPriceId
                    // relisted
                    if (relisted) {
                        type = transactionTypes.RELISTING 

                        if (lotId) {
                            transactionInfo = `Relisted lot for $${updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing,
                                collectedItemActionTypes.viewLot,
                                collectedItemActionTypes.appraise
                            ]
                        } else {
                            transactionInfo = `Relisted for $${updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing,
                                collectedItemActionTypes.appraise
                            ]
                        }

                    // price updated
                    } else {
                        type = transactionTypes.LISTING_PRICE


                        if (lotId) {
                            transactionInfo = `Updated lot listing price to $${updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing,
                                collectedItemActionTypes.viewLot,
                                collectedItemActionTypes.appraise
                            ]
                        } else {
                            transactionInfo = `Updated listing price to $${updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing,
                                collectedItemActionTypes.appraise
                            ]
                        }


                    }
                } else {
                    id = listingId
                    type = transactionTypes.LISTING


                    // initial listing
                    if (lotId) {
                        transactionInfo = `Listed in lot for $${initialPrice}`
                        actions = [
                            collectedItemActionTypes.viewListing,
                            collectedItemActionTypes.viewLot,
                            collectedItemActionTypes.appraise
                        ]
                    } else {
                        transactionInfo = `Listed for $${initialPrice}`
                        actions = [
                            collectedItemActionTypes.viewListing,
                            collectedItemActionTypes.appraise
                        ]
                    }


                }
            }
        }
        let coreType = type
        if (coreType === transactionTypes.PURCHASE) coreType = transactionTypes.SALE
        if (coreType === transactionTypes.RELISTING) coreType = transactionTypes.LISTING_PRICE        
        return {
            ...transaction,
            id,
            type,
            coreType,
            transactionInfo,
            actions
        }
    })
}

// current state of collected item
const interpretCollectedItem = (it, userId) => {
    // who owns it? me or proxy user
    // either "Listed for ..." or "Listed by ____ for ..."
    // is there no debit? still own it?
    // if lotId is present
        // it must mean item is in a lot, so return null from sql if removal is present
        // it could also mean it was sold as a lot, and not currently owned
    if (it.debit.saleId) {
        
    }
    // is it currently listed?
        // current price?

    // is it currently in a lot?

    // what is it's current condition?


    if (it.debit.saleId) { // sold
        if (it.debitListing) {

        }
    } else {

    }
}

const getCollectedItemTransactions = async (req, res, next) => {
    const user_id = req.claims.user_id
    const collectedItemId = req.params.id
    try {
        const collectedItemInfo = await CollectedItem.getById(collectedItemId, user_id, new Date().toISOString())
        const collectedItemTransactions = await Transaction.select({ query: { collectedItemId }, claims: { user_id } })
        const interpretedItemTransactions = interpretTransactions(collectedItemTransactions, user_id)
        // TODO only return acquisition transaction and current state. With count of transactions between
        // TODO filter transactions based on user permissions (only transactions they participated in)
        req.results = {
            // ...interpretedCollectedItem(collectedItemInfo, user_id),
            ...collectedItemInfo,
            transactions: interpretedItemTransactions
        }
        next()
    } catch (err) {
        next(err)
    }
}

const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.select({ claims: req.claims, query: req.query })
        const interpretedTransactions = interpretTransactions(transactions, req.claims.user_id)
        req.results = {
            count: interpretedTransactions[0].count,
            transactions: interpretedTransactions.map(transaction => {
                delete transaction.count
                return transaction
            })
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { getCollectedItemTransactions, getTransactions }