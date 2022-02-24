function verifyProduct(req, res, next) {
    const { product_name } = req.body
    if (!product_name) {
        next({
            status: 400,
            message: 'Must include data type string, product_name'
        })
    }
    next()
}

module.exports = {
    verifyProduct
}