function verifyProduct(req, res, next) {
    const { 
        product_name,
        product_type,
        product_retail_price,
        product_release_date,
        product_description,
        set_id
    } = req.body
    if (!product_name) {
        next({
            status: 400,
            message: 'Must include data type string, product_name'
        })
    } else if (!product_type) {
        next({
            status: 400,
            message: 'Must include set data type string, product_type'
        })
    } else if (!product_retail_price) {
        next({
            status: 400,
            message: 'Must include data type decimal, product_retail_price'
        })
    } else if (!product_release_date) {
        next({
            status: 400,
            message: 'Must include data type date, product_release_date'
        })
    } else if (!product_description) {
        next({
            status: 400,
            message: 'Must include data type string, product_description'
        }) 
    }else if (!set_id) {
        next({
            status: 400,
            message: 'Must include foreign key, set_id'
        })
    }
    next()
}

module.exports = {
    verifyProduct
}