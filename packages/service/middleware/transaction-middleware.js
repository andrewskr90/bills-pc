const Transaction = require('../models/Transaction')
const CollectedItem = require('../models/CollectedItem')
const Condition = require('../models/Condition')
const Printing = require('../models/Printing')

const collectedItemActionTypes = {
    list: 'List',
    viewListing: 'View Listing',
    gift: 'Gift',
    viewLot: 'View Lot',
    removeFromLot: 'Remove from lot',
    updatePrice: 'Update Price',
    removeListing: 'Remove Listing',
    recordSale: 'Record Sale',
}

const interpretItemTransactions = (transactions, userId) => {
    return transactions.map(transaction => {
        let transactionInfo = ''
        let actions = []

        if (transaction.lotEditId) {
            // TODO inserted or removed from listed lot. Look at collectedItemId = '49f7a6cb-cf28-4fa6-9b22-49776939c794', '32596c51-a138-4d14-93d3-f8ec99876795'
            if (transaction.lotInsertId) {
                if (transaction.listingId) {
                    if (transaction.listingRemovalId) {
                        transactionInfo = 'Removed from lot'
                        actions = [
                            collectedItemActionTypes.list,
                            collectedItemActionTypes.gift
                        ]
                    } else {
                        transactionInfo = `Inserted in lot listed at ${transaction.updatedPrice ? transaction.updatedPrice : transaction.initialPrice}`
                        actions = [
                            collectedItemActionTypes.viewLot,
                            collectedItemActionTypes.viewListing
                        ]
                    }
                } else {
                    // inserted into lot
                    transactionInfo = 'Inserted in lot'
                    actions = [
                        collectedItemActionTypes.viewLot
                    ]
                }
            } else if (transaction.lotRemovalId) {
                // removed from lot
                transactionInfo = 'Removed from lot'
                actions = [
                    collectedItemActionTypes.list,
                    collectedItemActionTypes.gift
                ]
            }
        } else if (transaction.importId) {
            // imported
            transactionInfo = `Imported by ${transaction.importerName}`
            actions = [
                collectedItemActionTypes.list, 
                collectedItemActionTypes.gift
            ]
        } else if (transaction.listingId) {
            if (transaction.saleId) {
                // sold listing
                if (transaction.lotId) {
                    transactionInfo = `Lot purchased by ${transaction.purchaserName} for $${transaction.updatedPrice ? transaction.updatedPrice : transaction.initialPrice}`
                    actions = [
                        collectedItemActionTypes.viewLot
                    ]
                } else {
                    transactionInfo = `Purchased by ${transaction.purchaserName} for $${transaction.updatedPrice ? transaction.updatedPrice : transaction.initialPrice}`
                    if (transaction.purchaserId === userId) {
                        actions = [
                            collectedItemActionTypes.list,
                            collectedItemActionTypes.gift
                        ]
                    }
                }
            } else {
                if (transaction.listingPriceId) {
                    if (transaction.relisted) {
                        // listing relisted
                        if (transaction.lotId) {
                            transactionInfo = `Lot relisted at ${transaction.updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing,
                                collectedItemActionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Relisted at ${transaction.updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing
                            ]
                        }
                    } else {
                        // price updated
                        if (transaction.lotId) {
                            transactionInfo = `Lot listing price updated to $${transaction.updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing,
                                collectedItemActionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Listing price updated to $${transaction.updatedPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing
                            ]
                        }
                    }
                } else {
                    if (transaction.listingRemovalId) {
                        // listing removal
                        if (transaction.lotId) {
                            transactionInfo = `Lot listing removed`
                            actions = [
                                collectedItemActionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Item listing removed`
                            actions = [
                                collectedItemActionTypes.list, 
                                collectedItemActionTypes.gift
                            ]
                        }
                    } else {
                        // initial listing
                        if (transaction.lotId) {
                            transactionInfo = `Listed in lot for $${transaction.initialPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing,
                                collectedItemActionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Listed for $${transaction.initialPrice}`
                            actions = [
                                collectedItemActionTypes.viewListing
                            ]
                        }
                    }
                }
            }
        }

        return {
            ...transaction,
            transactionInfo,
            actions
        }
    })
}

const getCollectedItemTransactions = async (req, res, next) => {
    const userId = req.claims.user_id
    const collectedItemId = req.params.id
    try {
        const collecteItemInfo = await CollectedItem.getById(collectedItemId)
        const collectedItemTransactions = await Transaction.getByCollectedCardIdNew(collectedItemId, userId)
        const conditions = await Condition.find()
        const printings = await Printing.find()
        const interpretedItemTransactions = interpretItemTransactions(collectedItemTransactions, userId)
        // TODO only return acquisition transaction and current state. With count of transactions between
        // TODO filter transactions based on user permissions (only transactions they participated in)
        req.results = {
            ...collecteItemInfo,
            conditionName: conditions.find(condition => condition.condition_id === collecteItemInfo.appraisals[0][1]).condition_name,
            printingName: printings.find(printing => printing.printing_id === collecteItemInfo.printingId).printing_name,
            transactions: interpretedItemTransactions
        }
        next()
    } catch (err) {
        next(err)
    }
    next()
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
        if (lotEditId) {
            id = lotEditId
            type = transactionTypes.LOT_EDIT 
        } else if (importId) {
            id = importId
            type = transactionTypes.IMPORT 
        } else if (giftId) {
            id = giftId
            type = transactionTypes.GIFT 
        } else if (listingId) {
            if (saleId) {
                id = saleId
                if (purchaserId === userId) {
                    type = transactionTypes.PURCHASE 
                } else if (sellerId === userId) {
                    type = transactionTypes.SALE 
                } 
            } else {
                if (listingRemovalId) {
                    id = listingRemovalId
                    type = transactionTypes.LISTING_REMOVAL
                } else if (listingPriceId) {
                    id = listingPriceId
                    if (relisted) {
                        type = transactionTypes.RELISTING 
                    } else {
                        type = transactionTypes.LISTING_PRICE
                    }
                } else {
                    id = listingId
                    type = transactionTypes.LISTING
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
            coreType
        }
    })
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