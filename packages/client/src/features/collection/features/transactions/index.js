import React from 'react'
import { formatDate } from '../../../../utils/date'

const Transactions = (props) => {
    const { portfolio } = props

    return (<div className='transactions' style={{ overflow: 'auto', paddingBottom: '100px' }}>
        {portfolio.sales.length > 0 ? <>
            {portfolio.sales.map(sale => <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <p>{formatDate(sale.sale_date)}</p>
                <p>{sale.sale_total}</p>
                <p>{sale.saleCards.length + sale.saleProducts.length + sale.saleBulkSplits.length} item(s)</p>
            </div>)}
        </> : <>...loading</>}
    </div>)
}

export default Transactions
