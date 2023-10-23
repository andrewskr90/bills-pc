const formatSaleFromPortfolioResult = (result) => {
    const {
        sale_id,
        sale_seller_id,
        sale_purchaser_id,
        sale_date,
        sale_vendor,
        sale_subtotal,
        sale_discount,
        sale_shipping,
        sale_tax_amount,
        sale_total,
        sale_note_id,
        sale_note_note
    } = result
    console
    return {
        sale_id,
        sale_seller_id,
        sale_purchaser_id,
        transaction_date: sale_date,
        sale_vendor,
        sale_subtotal: sale_subtotal ? parseFloat(sale_subtotal) : null,
        sale_discount: sale_discount ? parseFloat(sale_discount) : null,
        sale_shipping: sale_shipping ? parseFloat(sale_shipping) : null,
        sale_tax_amount: sale_tax_amount ? parseFloat(sale_tax_amount) : null,
        sale_total: sale_total ? parseFloat(sale_total) : null,
        sale_note_id,
        sale_note_note,
        saleItems: [],
        saleCards: [],
        saleProducts: [],
        saleBulkSplits: []
    }
}

module.exports = { formatSaleFromPortfolioResult }