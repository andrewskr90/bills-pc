import React, { useState, useEffect } from 'react'
import { compileBulkLabels } from './utils/bulk'
import { useNavigate, useParams } from 'react-router-dom'
import Transaction from "./features/transactions/components/Transaction.jsx"
import Button from '../../components/buttons/text-button/index.jsx'

const  BulkSplitInfo = (props) => {
    const { portfolio, userClaims } = props
    const [selectedBulkSplit, setSelectedBulkSplit] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    
    useEffect(() => {
        if (params.bulkSplitId) {
            const foundBulkSplit = portfolio.inventory.bulkSplits.find(split => split.bulk_split_id === params.bulkSplitId)
            if (!foundBulkSplit) navigate('/gym-leader/collection/assets')
            else {
                setSelectedBulkSplit(foundBulkSplit)
            }
        }
    }, [])

    const findBulkSplitTransaction = (split) => {
        if (split.sale_id) {
            return portfolio.sales.find(sale => sale.sale_id === split.sale_id)
        }
        if (split.sorting_id) {
            return portfolio.sortings.find(sorting => sorting.sorting_id === split.sorting_id)
        }
    }

    return (<div>
        {selectedBulkSplit ? <>
            <h2>Bulk Split Details</h2>
            <label>Labels</label>
            <p>{compileBulkLabels(selectedBulkSplit.labels)}</p>
            <label>Count</label>
            <p>{selectedBulkSplit.bulk_split_estimate ? '~' : ''}{selectedBulkSplit.bulk_split_count}</p>
            <label>Transaction</label>
            <Transaction transaction={findBulkSplitTransaction(selectedBulkSplit)} userClaims={userClaims} />
            <Button onClick={() => navigate('sort')}>Sort</Button>
        </> : <>...loading</>}
        
    </div>)
}

export default BulkSplitInfo
