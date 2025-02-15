const portfolioRouter = require('express').Router()
const { verifyCookie, decodeSessionToken } = require('../../middleware/auth-middleware')
const { getPortfolioItems, formatPortfolioItems } = require('../../middleware/portfolio-middleware')

portfolioRouter.get('/', 
    verifyCookie,
    decodeSessionToken,
    getPortfolioItems,
    formatPortfolioItems,
    async (req, res, next) => {
        res.status(200).json(req.results)
})

module.exports = portfolioRouter


// const portfolio = {
//     sales: [
//         {
//             saleId,
//             saleDate,
//             salePurchaser,
//             saleSeller,
//             saleCards: [
//                 {
//                     saleCardId,
//                     price,
//                     collectedCardId
//                 }
//             ],
//             saleProducts: [],
//             saleBulkSplits: []
//         }
//     ],
//     sortings: [
//         {
//             sortingId,
//             sortingDate,
//             sortingParent,
//             sortingChildren: [
//                 {
//                     sortingChildrenId,
//                     bulkSplitId
//                 }
//             ]
//         }
//     ],
//     collectedCards: [
//         {
//             collectedCardId,
//             cardId,
//             source: { type: 'sale', id }
//         }
//     ],
//     collectedProducts: [],
//     bulkSplits: []
// }