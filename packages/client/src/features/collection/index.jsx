import React, { useState, useEffect } from 'react'
import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import LoginForm from '../authenticate/LoginForm/index.jsx'
import { initialPortfolioValues } from '../../data/initialData'
import './assets/collection.css'
import Header from '../../layouts/header/index.jsx'
import CategorySelector from '../../components/category-selector/index.jsx'
import Transactions from './features/transactions/index.jsx'
import PortfolioAssets from './features/portfolio-assets/index.jsx'
import Listings from './features/watching/index.jsx'

const Collection = (props) => {
    const { userClaims, setUserClaims, referenceData, setReferenceData } = props
    const [portfolio, setPortfolio] = useState(initialPortfolioValues)
    const [transactions, setTransactions] = useState([])
    const [transactionCount, setTransactionCount] = useState()
    const [count, setCount] = useState()

    const navigate = useNavigate()


    if (userClaims) {
        return (<div className='collection'>
            <Header main title={'Portfolio'}>
                <Link to='support-us'>Support Us</Link>
            </Header>
            <>
                <CategorySelector
                    basePage="collection"
                    categories={['assets', 'listings']} 
                    selectCategory={(category) => navigate(category)} 
                />
            </>
            <Routes>
                <Route 
                    path='/assets/*'
                    element={<PortfolioAssets 
                        portfolio={portfolio} 
                        setPortfolio={setPortfolio} 
                        count={count} 
                        setCount={setCount} 
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                    />}
                />
                <Route 
                    path='/transactions/*'
                    element={<Transactions
                        transactions={transactions} 
                        setTransactions={setTransactions} 
                        transactionCount={transactionCount} 
                        setTransactionCount={setTransactionCount} 
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                     />}
                />
                <Route 
                    path='/listings/*'
                    element={
                        <Listings 
                            referenceData={referenceData} 
                            setReferenceData={setReferenceData} 
                        />
                    }
                />
            </Routes>
        </div>)
    } else {
        return (<div className='collection'>
            <p className='loginWarning'>You must be logged in to view your portfolio.</p>
            <LoginForm setUserClaims={setUserClaims} />
        </div>)
    }

}

export default Collection
