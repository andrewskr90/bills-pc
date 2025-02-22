import axios from 'axios'
import config from '../../../config'

const { BILLS_PC_API } = config

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
    getSetsV2(config) {
        const { params } = config
        return axios({
            ...options,
            url: `/api/v1/sets-v2`,
            params
        })
    },
    getExpansionSeries(config) {
        const { params } = config
        return axios({
            ...options,
            url: `/api/v1/expansion-series`,
            params
        })
    },
    authenticateSession() {
        return axios({
            ...options,
            url: '/api/v1/auth',
            method: 'post'
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
    getMarketPricesByItemId(itemId, params) {
        return axios({
            ...options,
            url: `/api/v1/market-prices/item-id/${itemId}`,
            params
        })
    },
    getReferenceData() {
        return axios({
            ...options,
            url: '/api/v1/reference-data'
        })
    },
    postSale({ params, data }) {
        return axios({
            ...options, 
            params,
            data,
            method: 'post',
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
    getTransactions(params) {
        return axios({
            ...options,
            url: '/api/v1/transactions',
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
            url: '/api/v1/types'
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
            url: '/api/v1/rarities'
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
            url: '/api/v1/printings'
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
            url: '/api/v1/bulk-splits'
        })
    },
    postSortings(config) {
        const { data } = config
        return axios({
            ...options,
            method: 'post',
            url: '/api/v1/sortings',
            data
        })
    },
    getUsers(config) {
        const { params } = config
        return axios({
            ...options,
            url: '/api/v1/users',
            params
        })
    },
    postUser(config) {
        const { data, params } = config
        return axios({
            ...options,
            method: 'post',
            url: '/api/v1/users',
            data,
            params
        })
    },
    postListing(config) {
        const { data, params } = config
        return axios({
            ...options,
            method: 'post',
            url: '/api/v1/listings',
            data,
            params
        })
    },
    getListings(config) {
        const { params } = config
        return axios({
            ...options,
            url: '/api/v1/listings',
            params
        })
    },
    getLotById(id, params) {
        return axios({
            ...options,
            url: `/api/v1/lots/${id}`,
            params
        })
    },
    getListingById(id) {
        return axios({
            ...options,
            url: `/api/v1/listings/${id}`
        })
    },
    getConditions() {
        return axios({
            ...options,
            url: '/api/v1/conditions'
        })
    },
    getItems(config) {
        const { params } = config
        return axios({
            ...options,
            url: '/api/v1/items',
            params
        })
    },
    createListingPrice({ data }) {
        return axios({
            ...options,
            method: 'post',
            data,
            url: `/api/v1/listing-prices/`
        })
    },
    createLotEdit({ data, params }) {
        return axios({
            ...options,
            method: 'post',
            data,
            params,
            url: `/api/v1/lot-edits`
        })
    },
    getCollectedItem(config) {
        const { id, params } = config
        return axios({
            ...options,
            url: `/api/v1/transactions/collected-item/${id}`,
            params: params
        })
    },
    createListing({ data }) {
        return axios({
            ...options,
            url: `/api/v1/listings`,
            data,
            method: 'post'
        })
    }
}


export default BillsPcService