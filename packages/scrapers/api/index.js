import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()

export const baseurl = process.env.API_BASE_URL

export const loginBillsPc = async () => {
    const loginInfo = {}
    loginInfo.user = {}
    loginInfo.user.user_name = 'kyle'
    loginInfo.user.user_password = process.env.GYM_LEADER_PASS
    // login and set cookies
    try {
        const apiCredentials = await axios.post(`${baseurl}/api/v1/auth/login`, loginInfo)
        return apiCredentials.headers['set-cookie']
    } catch (err) {
        throw err
    }
}

export const getPortfolioBillsPc = async (cookies) => {
    try {
        const portfolioRes = await axios({
            baseURL: baseurl,
            url: '/api/v1/portfolio',
            headers: { Cookie: cookies }
        })
        const portfolio = portfolioRes.data
        return portfolio
    } catch (err) {
        throw err
    }
}

export const getWatchedListings = async (cookies) => {
    try {
        const watchedListingRes = await axios({
            baseURL, baseurl,
            url: '/api/v1/listings',
            params: { watching: true },
            headers: { Cookie: cookies }
        })
        const watchedListings = watchedListingRes.data
        return watchedListings
    } catch (err) {
        throw err
    }
}

export const getProxyUsers = async (cookies) => {
    try {
        const proxyUserRes = await axios({
            baseURL: baseurl,
            url: '/api/v1/users',
            params: { proxy: true },
            headers: { Cookie: cookies }
        })
        const proxyUsers = proxyUserRes.data
        return proxyUsers
    } catch (err) {
        throw err
    }
}

export const createProxyUser = async (cookies, data) => {
    try {
        const proxyUserRes = await axios({
            baseURL: baseurl,
            method: 'post',
            url: '/api/v1/users',
            params: { proxy: true },
            headers: { Cookie: cookies },
            data
        })
        const proxyUsers = proxyUserRes.data
        return proxyUsers
    } catch (err) {
        throw err
    }
}

export const convertSaleItemToListing = async (cookies, data) => {
    try {
        return axios({
            baseURL: baseurl,
            method: 'post',
            url: '/api/v1/listings',
            data,
            params: { convertSaleItems: true },
            headers: { Cookie: cookies },
        })
    } catch (err) {
        throw err
    }
}

export const getListingById = async (cookies, id) => {
    try {
        return axios({
            baseURL: baseurl,
            url: `/api/v1/listings/${id}`,
            headers: { Cookie: cookies },
        })
    } catch (err) {
        throw err
    }
}

export const getSetsBillsPc = async (cookies, params) => {
    try {
        const expansionsRes = await axios({
            baseURL: baseurl,
            url: '/api/v1/sets-v2',
            params,
            headers: { Cookie: cookies }
        })
        const expansions = expansionsRes.data.expansions
        expansions.sort((a, b) => {
            if (a.set_v2_name < b.set_v2_name) return 1
            else if (a.set_v2_name > b.set_v2_name) return -1
            else return 0
        })
        return expansions
    } catch (err) {
        throw err
    }
}

export const postSetsBillsPc = async (cookies, data) => {
    try {
        const postSetsRes = await axios({
            baseURL: baseurl,
            method: 'post',
            url: '/api/v1/sets-v2',
            data,
            headers: { Cookie: cookies },
        })
        return postSetsRes.data.addedSets
    } catch (err) {
        throw err
    }
}

export const patchSetBillsPc = async (cookies, setId, data) => {
    try {
        const patchSetRes = await axios({
            baseURL: baseurl,
            method: 'patch',
            url: `/api/v1/sets-v2/${setId}`,
            data,
            headers: { Cookie: cookies },
        })
        return patchSetRes.data
    } catch (err) {
        throw err
    }
}

export const getCardsBillsPc = async (params, cookies) => {
    try {
        const billsPcCardsV2 = await axios({
            baseURL: baseurl,
            url: '/api/v1/cards-v2',
            headers: { Cookie: cookies },
            params
        })        
        return billsPcCardsV2.data
    } catch (err) {
        throw err
    }
}

export const getProductsBillsPc = async (params, cookies) => {
    try {
        const billsPcProducts = await axios({
            baseURL: baseurl,
            url: '/api/v1/products',
            headers: { Cookie: cookies },
            params
        })        
        return billsPcProducts.data
    } catch (err) {
        throw err
    }
}

export const postItemsBillsPc = async (data, cookies) => {
    try {
        const billsPcItems = await axios({
            baseURL: baseurl,
            method: 'post',
            url: '/api/v1/items',
            data,
            headers: { Cookie: cookies },
        })        
        return billsPcItems.data
    } catch (err) {
        throw err
    }
}

export const getAllItemsInExpansionBillsPc = async (expansionid, cookies) => {
    const items = []
    let moreItems = true
    let page = 1
    while (moreItems) {
        try {
            const currentPageItems = await getItemsBillsPc(cookies, { page, expansionid })
            items.push(...currentPageItems.items)
            if (currentPageItems.items.length > 0) {
                page += 1
            } else {
                moreItems = false
            }
        } catch (err) {
            console.log(err)
        }
    }
    return items
}

export const getItemsBillsPc = async (cookies, params) => {
    try {
        const billsPcItems = await axios({
            baseURL: baseurl,
            url: `/api/v1/items`,
            headers: { Cookie: cookies },
            params
        })        
        return billsPcItems.data
    } catch (err) {
        throw err
    }
}

export const getLanguagesBillsPc = async (cookies) => {
    try {
        const billsPcLanguages = await axios({
            baseURL: baseurl,
            url: '/api/v1/languages',
            headers: { Cookie: cookies },
        })        
        return billsPcLanguages.data
    } catch (err) {
        throw err
    }
}

export const getPrintingsBillsPc = async (cookies) => {
    try {
        const billsPcPrintings = await axios({
            baseURL: baseurl,
            url: '/api/v1/printings',
            headers: { Cookie: cookies },
        })        
        return billsPcPrintings.data
    } catch (err) {
        throw err
    }
}

export const getConditionsBillsPc = async (cookies) => {
    try {
        const billsPcConditions = await axios({
            baseURL: baseurl,
            url: '/api/v1/conditions',
            headers: { Cookie: cookies },
        })        
        return billsPcConditions.data
    } catch (err) {
        throw err
    }
}

export const getSkusBillsPc = async (params, cookies) => {
    try {
        const billsPcSkus = await axios({
            baseURL: baseurl,
            url: '/api/v1/skus',
            headers: { Cookie: cookies },
            params
        })        
        return billsPcSkus.data
    } catch (err) {
        throw err
    }
}

export const postSkusBillsPc = async (data, cookies) => {
    try {
        const billsPcSkus = await axios({
            baseURL: baseurl,
            method: 'post',
            url: '/api/v1/skus',
            data,
            headers: { Cookie: cookies },
        })        
        return billsPcSkus.data
    } catch (err) {
        throw err
    }
}

export const postPricesBillsPc = async (data, cookies) => {
    try {
        const billsPcPostedPrices = await axios({
            baseURL: baseurl,
            method: 'post',
            url: '/api/v1/tcgp-market-prices',
            data,
            headers: { Cookie: cookies },
        })        
        return billsPcPostedPrices.data
    } catch (err) {
        throw err
    }
}

export const patchItemByFilterBillsPc = async (params, data, cookies) => {
    try {
        const billsPcUpdatedItem = await axios({
            baseURL: baseurl,
            method: 'patch',
            url: '/api/v1/items',
            params,
            data,
            headers: { Cookie: cookies },
        })        
        return billsPcUpdatedItem.data
    } catch (err) {
        throw err
    }
}

export const patchGiftByFilter = async (params, data, cookies) => {
    try {
        const billsPcUpdatedGift = await axios({
            baseURL: baseurl,
            method: 'patch',
            url: '/api/v1/gifts',
            params,
            data,
            headers: { Cookie: cookies },
        })        
        return billsPcUpdatedGift.data
    } catch (err) {
        throw err
    }
}

export const patchLotEditByFilter = async (params, data, cookies) => {
    try {
        const billsPcUpdatedLotEdit = await axios({
            baseURL: baseurl,
            method: 'patch',
            url: '/api/v1/lot-edits',
            params,
            data,
            headers: { Cookie: cookies },
        })        
        return billsPcUpdatedLotEdit.data
    } catch (err) {
        throw err
    }
}

export const getGiftByFilter = async (params, cookies) => {
        try {
        const giftRes = await axios({
            baseURL: baseurl,
            method: 'get',
            url: '/api/v1/gifts',
            params,
            headers: { Cookie: cookies },
        })        
        return giftRes.data
    } catch (err) {
        throw err
    }
}

export const getLotEditsByFilter = async (params, cookies) => {
        try {
        const lotEditRes = await axios({
            baseURL: baseurl,
            method: 'get',
            url: '/api/v1/lot-edits',
            params,
            headers: { Cookie: cookies },
        })        
        return lotEditRes.data
    } catch (err) {
        throw err
    }
}

export const createImports = async (data, cookies) => {
    try {
        const createImportRes = await axios({
            baseURL: baseurl,
            method: 'post',
            url: '/api/v1/imports',
            data,
            headers: { Cookie: cookies },
        })        
        return createImportRes.data
    } catch (err) {
        throw err
    }
}

export const deleteGiftById = async (giftId, cookies) => {
    try {
        const deletedGiftRes = await axios({
            baseURL: baseurl,
            method: 'delete',
            url: `/api/v1/gifts/${giftId}`,
            headers: { Cookie: cookies },
        })        
        return deletedGiftRes.data
    } catch (err) {
        throw err
    }
}

export const getLotInsertsByFilter = async (params, cookies) => {
        try {
        const lotInsertsRes = await axios({
            baseURL: baseurl,
            method: 'get',
            url: '/api/v1/lot-inserts',
            params,
            headers: { Cookie: cookies },
        })        
        return lotInsertsRes.data
    } catch (err) {
        throw err
    }
}
