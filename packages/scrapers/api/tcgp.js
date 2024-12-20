import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
// curl --include --request POST \
// --header "application/x-www-form-urlencoded" \
// --data-binary "grant_type=client_credentials&client_id=PUBLIC_KEY&client_secret=PRIVATE_KEY" \
// "https://api.tcgplayer.com/token"

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
    async categories(apiToken, offset) {
        try {
            const categoriesRes = await axios({
                ...tcgpapiConfig,
                url: `/catalog/categories`,
                params: { offset },
                headers: {
                    Authorization: `bearer ${apiToken}`
                }
            })
            return categoriesRes.data.results
        } catch (err) {
            throw new Error(err)
        }
    },
    async groups(apiToken, offset, categoryId) {
        try {
            const groupsRes = await axios({
                ...tcgpapiConfig,
                url: `/catalog/categories/${categoryId}/groups`,
                params: { offset },
                headers: {
                    Authorization: `bearer ${apiToken}`
                }
            })
            return groupsRes.data.results
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
            throw err.response
        }
    },
    async skus(apiToken, productId) {
        try {
            const skusRes = await axios({
                ...tcgpapiConfig,
                url: `/catalog/products/${productId}/skus`,
                headers: {
                    Authorization: `bearer ${apiToken}`
                }
            })
            return skusRes.data.results
        } catch (err) {
            throw new Error(err)
        }
    },
    async pricesBySkus(apiToken, skus) {
        try {
            const pricingRes = await axios({
                ...tcgpapiConfig,
                url: `/pricing/sku/${skus}`,
                // params: { groupId, offset },
                headers: {
                    Authorization: `bearer ${apiToken}`
                }
            })
            return pricingRes.data.results
        } catch (err) {
            throw new Error(err)
        }
    },
    async languages(apiToken, categoryId) {
        try {
            const languages = await axios({
                ...tcgpapiConfig,
                url: `/catalog/categories/${categoryId}/languages`,
                headers: {
                    Authorization: `bearer ${apiToken}`
                }                
            })
            return languages.data.results
        } catch (err) {
            throw new Error(err)
        }
    },
    async printings(apiToken, categoryId) {
        try {
            const printings = await axios({
                ...tcgpapiConfig,
                url: `/catalog/categories/${categoryId}/printings`,
                headers: {
                    Authorization: `bearer ${apiToken}`
                }                
            })
            return printings.data.results
        } catch (err) {
            throw new Error(err)
        }
    },
    async conditions(apiToken, categoryId) {
        try {
            const conditions = await axios({
                ...tcgpapiConfig,
                url: `/catalog/categories/${categoryId}/conditions`,
                headers: {
                    Authorization: `bearer ${apiToken}`
                }                
            })
            return conditions.data.results
        } catch (err) {
            throw new Error(err)
        }
    }
}
