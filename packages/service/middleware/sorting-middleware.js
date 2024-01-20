const { v4: uuidV4 } = require('uuid')
const { createCollectedCard } = require('./sale-middleware')
const { fetchOrCreateLabelIds } = require('../utils/bulk-splits')


const createSorting = (sorting, sorterId) => {
    return {
        sorting_id: uuidV4(),
        sorting_sorter_id: sorterId,
        sorting_bulk_split_id: sorting.sorting_bulk_split_id,
        sorting_date: sorting.sorting_date
    }
}

const createSortingGem = (sortingId, collectedCardId) => {
    return {
        sorting_gem_id: uuidV4(),
        sorting_gem_sorting_id: sortingId,
        sorting_gem_collected_card_id: collectedCardId
    }
}

const formatSortings = async (req, res, next) => {
    const sorterId = req.claims.user_id

    const createdSortings = []
    const createdBulkSplits = []
    const createdBulkSplitNotes = []
    const createdSortingSplits = []
    const createdCollectedCards = []
    const createdCollectedCardNotes = []
    const createdSortingGems = []
    if (!Array.isArray(req.body)) return next({ message: "Sortings must be provided in the form of an array." })
    if (req.body.length < 1) return next({ message: "No sortings present in request." })
    for (let i=0; i<req.body.length; i++) {
        req.body[i] = {
            ...createSorting(req.body[i], sorterId),
            sortingSplits: req.body[i].sortingSplits,
            sortingGems: req.body[i].sortingGems,
            bulkSplits: []
        }
        for (let j=0; j<req.body[i].sortingSplits.length; j++) {
            const { count, estimate, labels } = req.body[i].sortingSplits[j]
            const bulk_split_id = uuidV4()
            const sorting_split_id = uuidV4()
            req.body[i].bulkSplits[j] = {
                bulk_split_id,
                bulk_split_count: count,
                bulk_split_estimate: estimate,
                labels
            }
            try {
                const formattedLabels = await fetchOrCreateLabelIds(req.body[i].bulkSplits[j])
                    req.body[i].bulkSplits[j] = {
                    ...req.body[i].bulkSplits[j],
                    labels: formattedLabels
                }
            } catch(err) {
                return next(err)
            }
            req.body[i].sortingSplits[j] = {
                sorting_split_bulk_split_id: bulk_split_id,
                sorting_split_id,
                sorting_split_sorting_id: req.body[i].sorting_id
            }
        }

        for (let j=0; j<req.body[i].sortingGems.length; j++) {
            // consider the quantity of gem found in sorting
            for (let k=0; i<req.body[i].sortingGems[j].quantity; k++) {
                const createdCollectedCard = createCollectedCard(
                    req.body[i].sortingGems[j].card_id, 
                    req.body[i].sortingGems[j].itemNote, 
                    sorterId
                )
                req.body[i].sortingGems[j] = createSortingGem(
                    req.body[i].sorting_id, 
                    createdCollectedCard.collected_card_id
                )
                if (createdCollectedCard.collected_card_note) { 
                    createdCollectedCardNotes.push(createdCollectedCard.collected_card_note)
                }
                delete createdCollectedCard.collected_card_note
                createdCollectedCards.push(createdCollectedCard)
            }
        }
    }
    

    req.bulkSplits = createdBulkSplits
    req.sortingBulkSplits = createdSortingSplits
    req.collectedCards = createdCollectedCards
    req.collectedCardNotes = createdCollectedCardNotes
    req.bulkSplitNotes = createdBulkSplitNotes
    req.sortingGems = createdSortingGems
    next()
}

module.exports = { formatSortings }
