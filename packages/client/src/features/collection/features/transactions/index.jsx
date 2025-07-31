import React, { useEffect, useState } from 'react'
import Transaction from './components/Transaction.jsx'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ListingInfo from './ListingInfo.jsx'
import { buildParams } from '../../../../utils/location/index.js'
import BillsPcService from '../../../../api/bills-pc/index.js'
import Toolbar from '../../../../layouts/toolbar/index.jsx'
import ItemContainer from '../../../../components/item-container/index.jsx'
import PageSelection from '../../../../components/page-selection/index.jsx'
import { handleViewTransaction } from '../../utils/transaction/index.js'

const Transactions = (props) => {
    const {
        transactions,
        setTransactions,
        transactionCount,
        setTransactionCount,
        referenceData,
        setReferenceData
    } = props
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            const params = buildParams(location)
            params.direction = params.direction ? params.direction : undefined
            await BillsPcService.getTransactions(params)
            .then(res => {
                setTransactionCount(res.data.count)
                setTransactions(res.data.transactions)
                setLoading(false)
            })
            .catch(err => console.log(err))
        })()
    }, [location.search])
    const sortKey = 'transactionSort'

    return (
        <Routes>
            <Route 
                path='/'
                element={<>
                    <Toolbar
                        sortKey={sortKey}
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                        defaultSortDirection='desc'
                        defaultAttribute='date'
                    />
                    <PageSelection location={location} count={transactionCount} />
                    <ItemContainer emptyMessage={'Query yielded no transactions'} loading={loading} >
                        {transactions.map(transaction => <div className='flex justify-between items-center shadow-md rounded-sm mt-3 p-1'>
                            <div className='flex flex-col'>
                                <p className='my-0'>{new Date(transaction.time).toLocaleDateString()}</p>
                                <p className='my-0'>{`${transaction.type} ${transaction.type === 'purchase' ? `from ${transaction.sellerName}` : ''}`}</p>
                            </div>
                            {transaction.type === 'purchase' && <p className='my-0'>{transaction.updatedPrice ? transaction.updatedPrice : transaction.initialPrice}</p>}
                            <button onClick={() => handleViewTransaction(transaction.id, transaction.coreType, navigate)}>View</button>
                        </div>)}
                    </ItemContainer>
                </>}
            />
            <Route 
                path='/listing/:id'
                element={<ListingInfo />}
            />
        </Routes>
    )
}

export default Transactions
