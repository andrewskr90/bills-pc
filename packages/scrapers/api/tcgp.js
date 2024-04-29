import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()
// curl --include --request POST \
// --header "application/x-www-form-urlencoded" \
// --data-binary "grant_type=client_credentials&client_id=PUBLIC_KEY&client_secret=PRIVATE_KEY" \
// "https://api.tcgplayer.com/token"

const categoryId = 3 // pokemon

const tcgpapiConfig = {
    baseURL: 'https://api.tcgplayer.com',
    headers: {
        Accept: 'application/json'
    }
}

export default {
    async authenticate() {
        try {
            const apiCredentials = await axios({
                ...tcgpapiConfig,
                method: 'post',
                url: '/token',
                data: {
                    grant_type: 'client_credentials',
                    client_id: process.env.TCGP_PUBLIC_KEY,
                    client_secret: process.env.TCGP_PRIVATE_KEY,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            return apiCredentials.data.access_token
        } catch (err) {
            throw new Error(err)
        }
    },
    async expansions(apiToken, offset) {
        try {
            const expansionsRes = await axios({
                ...tcgpapiConfig,
                url: `/catalog/categories/${categoryId}/groups`,
                params: { offset },
                headers: {
                    Authorization: `bearer ${apiToken}`
                }
            })
            return expansionsRes.data.results
        } catch (err) {
            throw new Error(err)
        }
    },
    async items(apiToken, groupId, offset) {
        try {
            const itemsRes = await axios({
                ...tcgpapiConfig,
                url: `/catalog/products`,
                params: { groupId, offset },
                headers: {
                    Authorization: `bearer ${apiToken}`
                }
            })
            return itemsRes.data.results
        } catch (err) {
            throw new Error(err)
        }
    },
    async skus(apiToken, productId, groupId, offset) {
        try {
            const skusRes = await axios({
                ...tcgpapiConfig,
                url: `/catalog/products/${productId}/skus`,
                params: { groupId, offset },
                headers: {
                    Authorization: `bearer ${apiToken}`
                }
            })
            return skusRes.data.results
        } catch (err) {
            throw new Error(err)
        }
    }
}
