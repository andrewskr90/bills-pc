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

