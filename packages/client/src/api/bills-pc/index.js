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
    getSets() {
        return axios({
            ...options,
            url: `/api/v1/sets`
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
    getSales(filter) {
        return axios({
            ...options,
            url: '/api/v1/sales',
            params: filter
        })
    },
    postSale(sale) {
        return axios({
            ...options,
            url: '/api/v1/sales',
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
    }
}

export default BillsPcService
