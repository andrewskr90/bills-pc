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

