const sortLotTransactions = (lotTransactions) => {
    // TODO enable desc and asc
    return lotTransactions.sort((a, b) => {
        if (a.time < b.time) return -1
        else if (a.time > b.time) return 1
        else {
        // transaction times are the same
        // default order:
        // lotEditId, giftId, tradeId, ripId, listingid, saleId
            if (a.lotEditId) {
                if (b.lotEditId) return 0
                return -1
            }
            if (a.giftId) {
                if (b.lotEditId) return 1
                if (b.giftId) return 0
                return -1
            }
            if (a.tradeId) {
                if (b.lotEditId || b.giftId) return 1
                if (b.tradeId) return 0
                return -1
            }
            if (a.ripId) {
                if (b.lotEditId || b.giftId || b.tradeId) return 1
                if (b.ripId) return 0
                return -1
            }
            if (a.listingId) {
                if (b.saleId) return -1
                if (b.listingId) return 0
                return 1
            }
            if (a.saleId) {
                if (b.saleId) return 0
                return 1
            }
        }
    })
}

module.exports = { sortLotTransactions }