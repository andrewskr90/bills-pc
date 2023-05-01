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
    getCollectionMarketPrices(collection, date) {
        return axios({
            ...options,
            url: `/api/v1/market-prices/collection/${date}`,
            data: collection
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
    }
}

export default BillsPcService
