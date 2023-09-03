import axios from 'axios'
import { BILLS_PC_API } from '../../../../../config'

const { options } = BILLS_PC_API

const BillsPcService = {
    login(formValues) {
        return axios({
            ...options,
            url: '/api/v1/auth/login',
            method: 'post',
            data: formValues,
        })
    },
    register(formValues) {
        return axios({
            ...options,
            url: '/api/v1/auth/register',
            method: 'post',
            data: formValues
        })
    },
    getSets() {
        return axios({
            ...options,
            url: `/api/v1/sets`
        })
    },
    getSetsV2(filter) {
        return axios({
            ...options,
            url: `/api/v1/sets-v2`,
            params: filter
        })
    },
    getSetsBy(filter) {
        return axios({
            ...options,
            url: `/api/v1/sets`,
            params: filter
        })
    },
    postSetsToSets(setsArray) {
        return axios({
            ...options,
            url: '/api/v1/sets',
            method: 'post',
            data: setsArray
        })
    },
    getCardsBy(filter) {
        return axios({
            ...options,
            url: `/api/v1/cards`,
            params: filter
        })
    },
    getCardsV2(filter) {
        return axios({
            ...options,
            url:`/api/v1/cards-v2`,
            params: filter
        })
    },
    getCardsV2BySetId(setId) {
        return axios({
            ...options,
            url: `api/v1/cards-v2/set-id/${setId}`
        })
    },
    getCardsV2WithValues(filter) {
        return axios({
            ...options,
            url:'/api/v1/cards-v2/values',
            params: filter
        })
    },
    getCardsBySetId(setId) {
        return axios({
            ...options,
            url: `/api/v1/cards/set-id/${setId}`
        })
    },
    postCardsToCards(cardsArray) {
        return axios({
            ...options,
            url: '/api/v1/cards',
            method: 'post',
            data: cardsArray
        })
    },
    authenticateSession() {
        return axios({
            ...options,
            url: '/api/v1/auth',
            method: 'post'
        })
    },
    getTransactionSales(filter) {
        return axios({
            ...options,
            url: '/api/v1/transactions/sales',
            params: filter
        })
    },
    postTransactionSales(sale) {
        return axios({
            ...options,
            url: '/api/v1/transactions/sales/import-purchase',
            method: 'post',
            data: sale
        })
    },
    postTransactionGifts(gift) {
        return axios({
            ...options,
            url: '/api/v1/transactions/gifts/import-gift',
            method: 'post',
            data: gift
        })
    },
    getCollectedCards(filter) {
        return axios({
            ...options,
            url: '/api/v1/collected-cards',
            params: filter
        })
    },
    getCollectedProducts(filter) {
        return axios({
            ...options,
            url: '/api/v1/collected-products',
            params: filter
        })
    },
    getMarketPrices(filter) {
        if (Object.keys(filter)[0] === 'set_v2_id') {
            return axios({
                ...options,
                url: `/api/v1/market-prices/set-id/${filter['set_v2_id']}`,
                params: filter
            })
        } else if (filter[Object.keys(filter)[0]] === true) {
            return axios({
                ...options,
                url: '/api/v1/market-prices/top-ten-average'
            })
        } else {
            return axios({
                ...options,
                url: '/api/v1/market-prices',
                params: filter
            })
        }
    },
    getMarketPricesByCardId(cardId) {
        return axios({
            ...options,
            url: `/api/v1/market-prices/card-id/${cardId}`
        })
    },
    getMarketPricesByProductId(productId) {
        return axios({
            ...options,
            url: `/api/v1/market-prices/product-id/${productId}`
        })
    },
    getProducts(filter) {
        return axios({
            ...options,
            url: '/api/v1/products',
            params: filter
        })
    },
    getProductsWithValues(filter) {
        return axios({
            ...options,
            url: '/api/v1/products/values',
            params: filter
        })
    },
    getReferenceData() {
        return axios({
            ...options,
            url: '/api/v1/reference-data'
        })
    },
    getSales() {
        return axios({
            ...options, 
            url: '/api/v1/sales'
        })
    },
    getPortfolio(params) {
        return axios({
            ...options,
            url: '/api/v1/portfolio',
            params: params
        })
    },
    postType(config) {
        const { data } = config
        return axios({
            ...options,
            url: '/api/v1/types',
            method: 'post',
            data
        })
    },
    getTypes() {
        return axios({
            ...options,
            url: 'api/v1/types'
        })
    },
    updateType({ type }) {
        return axios({
            ...options,
            method: 'put',
            data: type,
            url: `/api/v1/types/${type.type_id}`
        })
    },
    deleteType({ type }) {
        return axios({
            ...options,
            method: 'delete',
            url: `/api/v1/types/${type.type_id}`
        })
    },
    postRarity(config) {
        const { data } = config
        return axios({
            ...options,
            url: '/api/v1/rarities',
            method: 'post',
            data
        })
    },
    getRarities() {
        return axios({
            ...options,
            url: 'api/v1/rarities'
        })
    },
    updateRarity({ rarity }) {
        return axios({
            ...options,
            method: 'put',
            data: rarity,
            url: `/api/v1/rarities/${rarity.rarity_id}`
        })
    },
    deleteRarity({ rarity }) {
        return axios({
            ...options,
            method: 'delete',
            url: `/api/v1/rarities/${rarity.rarity_id}`
        })
    },
    postPrinting(config) {
        const { data } = config
        return axios({
            ...options,
            url: '/api/v1/printings',
            method: 'post',
            data
        })
    },
    getPrintings() {
        return axios({
            ...options,
            url: 'api/v1/printings'
        })
    },
    updatePrinting({ printing }) {
        return axios({
            ...options,
            method: 'put',
            data: printing,
            url: `/api/v1/printings/${printing.printing_id}`
        })
    },
    deletePrinting({ printing }) {
        return axios({
            ...options,
            method: 'delete',
            url: `/api/v1/printings/${printing.printing_id}`
        })
    },
    getBulkSplits() {
        return axios({
            ...options,
            url: 'api/v1/bulk-splits'
        })
    },
    postSortings(config) {
        const { data } = config
        console.log(data)
        return axios({
            ...options,
            method: 'post',
            url: '/api/v1/sortings',
            data
        })
    }
}

export default BillsPcService
