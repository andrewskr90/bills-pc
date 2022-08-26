const createConnection = require('..')
const QueryFormatters = require('../../utils/queryFormatters')

//find, add, update, remove verbage

const addProductsMySQL = async (req, res, next) => {
    const products = req.products
    const query = QueryFormatters.objectsToInsert(products, 'products')
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next({ status: 400, message: 'Product(s) already inserted.'})
            }
            return next(err)
        } else {
            req.results = results
            connection.end()
            return next()
        }
    })
}

const getProductsBySetIdMySQL = async (req, res, next) => {
    const setId = req.params.setId
    const query = `SELECT * FROM products WHERE product_set_id = '${setId}'`
    const connection = createConnection()
    connection.connect()
    connection.query(query, (err, results) => {
        if (err) {
            return next(err)
        } else {
            req.results = results
            connection.end()
            return next()
        }
    })
}

module.exports = {
    addProductsMySQL,
    getProductsBySetIdMySQL
}
