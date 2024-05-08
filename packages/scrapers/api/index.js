import axios from "axios"

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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        const expansions = expansionsRes.data
        expansions.sort((a, b) => {
            if (a.set_v2_name < b.set_v2_name) return 1
            else if (a.set_v2_name > b.set_v2_name) return -1
            else return 0
        })
        return expansions
    } catch (err) {
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
    }
}

export const getItemsBillsPc = async (params, cookies) => {
    try {
        const billsPcItems = await axios({
            baseURL: baseurl,
            url: '/api/v1/items',
            headers: { Cookie: cookies },
            params
        })        
        return billsPcItems.data
    } catch (err) {
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
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
        throw new Error(err)
    }
}