import React from 'react'
import Transaction from './components/Transaction'

const Transactions = (props) => {
    const { portfolio, userClaims } = props

    return (<div className='transactions' style={{ overflow: 'auto', paddingBottom: '100px' }}>
        {portfolio.sales.length > 0 || portfolio.sortings.length > 0 ? <>
            {portfolio.sales.map(sale => <Transaction transaction={sale} userClaims={userClaims} />)}
            {portfolio.sortings.map(sorting => <Transaction transaction={sorting} userClaims={userClaims} />)}
        </> : <>...loading</>}
    </div>)
}

export default Transactions
