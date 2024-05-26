import React from 'react'
import { formatDate } from '../../../../../utils/date'
import { useNavigate } from 'react-router-dom'

const Transaction = (props) => {
    const { transaction, userClaims } = props
    const navigate = useNavigate()
    let transactionType
    let transactionDate
    let transactionId
    if (transaction.sale_id) {
        transactionDate = transaction.sale_date
        transactionId = transaction.sale_id
        if (transaction.sale_purchaser_id === userClaims.user_id) {
            transactionType = 'purchase'
        } else transactionType = 'sale'
    } else if (transaction.sorting_id) {
        transactionType = 'sorting'
        transactionDate = transaction.sorting_date
        transactionId = transaction.sorting_id
    }

    return (<div 
            style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                boxShadow: '2px 2px 4px gray', 
                borderRadius: '10px', 
                marginTop: '10px', 
                padding: '4px' 
            }}
            onClick={() => navigate(`/collection/transactions/${transactionType}/${transactionId}`)}
        >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
            <p>{transactionType}</p>
            <p>{formatDate(transactionDate)}</p>
        </div>
        {transactionType === 'purchase' ? <>
            <p>{transaction.sale_total}</p>
            <p>{transaction.saleItems.length + transaction.saleBulkSplits.length} item(s)</p>
        </> : <></>}
        {transactionType === 'sorting' ? <>
            <p>Sorted {transaction.sortingSplits.length} bulk splits</p>
            <p>Found {transaction.sortingGems.length} gems</p>
        </> : <></>}
    </div>)
}

export default Transaction
