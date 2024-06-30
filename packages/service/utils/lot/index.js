const sortLotTransactions = (lotTransactions) => {
    return lotTransactions.sort((a, b) => {
        if (a.time < b.time) return -1
        else if (a.time > b.time) return 1
        else {
            if (a.lotEditId) return -1
            if (a.giftId) {
                if (b.lotEditId) return 1
                if (b.listingId) return -1
            }
            if (a.listingId) return 1
        }
    })
}

module.exports = { sortLotTransactions }