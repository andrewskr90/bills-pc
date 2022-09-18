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
            url: `api/v1/sets-v2`,
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
            url: 'api/v1/sets',
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
            url: '/api/v1/transactions/sales',
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
    getMarketPrices(filter) {
        return axios({
            ...options,
            url: '/api/v1/market-prices',
            params: filter
        })
    },
    getProducts(filter) {
        return axios({
            ...options,
            url: '/api/v1/products',
            params: filter
        })
    }
}

export default BillsPcService
