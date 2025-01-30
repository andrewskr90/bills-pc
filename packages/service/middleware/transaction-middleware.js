const Transaction = require('../models/Transaction')
const CollectedItem = require('../models/CollectedItem')
const Condition = require('../models/Condition')
const Printing = require('../models/Printing')

const actionTypes = {
    list: 'List',
    viewListing: 'View Listing',
    gift: 'Gift',
    viewLot: 'View Lot',
    removeFromLot: 'Remove from lot',
    updatePrice: 'Update Price',
    removeListing: 'Remove Listing',
    recordSale: 'Record Sale',
}

const interpretTransactions = (transactions, userId) => {
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
                            actionTypes.list,
                            actionTypes.gift
                        ]
                    } else {
                        transactionInfo = `Inserted in lot listed at ${transaction.updatedPrice ? transaction.updatedPrice : transaction.initialPrice}`
                        actions = [
                            actionTypes.viewLot,
                            actionTypes.viewListing
                        ]
                    }
                } else {
                    // inserted into lot
                    transactionInfo = 'Inserted in lot'
                    actions = [
                        actionTypes.viewLot
                    ]
                }
            } else if (transaction.lotRemovalId) {
                // removed from lot
                transactionInfo = 'Removed from lot'
                actions = [
                    actionTypes.list,
                    actionTypes.gift
                ]
            }
        } else if (transaction.importId) {
            // imported
            transactionInfo = `Imported by ${transaction.importerName}`
            actions = [
                actionTypes.list, 
                actionTypes.gift
            ]
        } else if (transaction.listingId) {
            if (transaction.saleId) {
                // sold listing
                if (transaction.lotId) {
                    transactionInfo = `Lot purchased by ${transaction.purchaserName} for $${transaction.updatedPrice ? transaction.updatedPrice : transaction.initialPrice}`
                    actions = [
                        actionTypes.viewLot
                    ]
                } else {
                    transactionInfo = `Purchased by ${transaction.purchaserName} for $${transaction.updatedPrice ? transaction.updatedPrice : transaction.initialPrice}`
                    if (transaction.purchaserId === userId) {
                        actions = [
                            actionTypes.list,
                            actionTypes.gift
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
                                actionTypes.viewListing,
                                actionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Relisted at ${transaction.updatedPrice}`
                            actions = [
                                actionTypes.viewListing
                            ]
                        }
                    } else {
                        // price updated
                        if (transaction.lotId) {
                            transactionInfo = `Lot listing price updated to $${transaction.updatedPrice}`
                            actions = [
                                actionTypes.viewListing,
                                actionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Listing price updated to $${transaction.updatedPrice}`
                            actions = [
                                actionTypes.viewListing
                            ]
                        }
                    }
                } else {
                    if (transaction.listingRemovalId) {
                        // listing removal
                        if (transaction.lotId) {
                            transactionInfo = `Lot listing removed`
                            actions = [
                                actionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Item listing removed`
                            actions = [
                                actionTypes.list, 
                                actionTypes.gift
                            ]
                        }
                    } else {
                        // initial listing
                        if (transaction.lotId) {
                            transactionInfo = `Listed in lot for $${transaction.initialPrice}`
                            actions = [
                                actionTypes.viewListing,
                                actionTypes.viewLot
                            ]
                        } else {
                            transactionInfo = `Listed for $${transaction.initialPrice}`
                            actions = [
                                actionTypes.viewListing
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
        const transactions = await Transaction.getByCollectedCardIdNew(collectedItemId, userId)
        const conditions = await Condition.find()
        const printings = await Printing.find()
        const interpretedTransactions = interpretTransactions(transactions, userId)
        // TODO only return acquisition transaction and current state. With count of transactions between
        // TODO filter transactions based on user permissions (only transactions they participated in)
        req.results = {
            ...collecteItemInfo,
            conditionName: conditions.find(condition => condition.condition_id === collecteItemInfo.appraisals[0][1]).condition_name,
            printingName: printings.find(printing => printing.printing_id === collecteItemInfo.printingId).printing_name,
            transactions: interpretedTransactions
        }
        next()
    } catch (err) {
        next(err)
    }
    next()
}

module.exports = { getCollectedItemTransactions }