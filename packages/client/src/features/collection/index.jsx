import React, { useState, useEffect } from 'react'
import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import LoginForm from '../authenticate/LoginForm'
import { initialPortfolioValues } from '../../data/initialData'
import './assets/collection.less'
import UpdatePortfolio from './features/update-portfolio'
import Header from '../../layouts/header'
import CategorySelector from '../../components/category-selector'
import Transactions from './features/transactions'
import PortfolioAssets from './features/portfolio-assets'
import Watching from './features/watching'

const Collection = (props) => {
    const { userClaims, setUserClaims, referenceData, setReferenceData } = props
    const [portfolio, setPortfolio] = useState(initialPortfolioValues)
    const [createdProxyUsers, setCreatedProxyUsers] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        (async () => { 
            await BillsPcService.getPortfolio({ timeFrame: '2w' })
                .then(res => setPortfolio(res.data))
                .catch(err => console.log(err))
            await BillsPcService.getUsers({ params: { proxy: true } })
                .then(res => setCreatedProxyUsers(res.data))
                .catch(err => console.log(err))
        })()
    }, [userClaims])

    if (userClaims) {
        return (<div className='collection'>
            <Header main title={'Portfolio'}>
                <Link to='support-us'>Support Us</Link>
            </Header>
            <>
                <Link to='update/purchase'><button>Update Collection</button></Link>
                <CategorySelector
                    basePage="collection"
                    categories={['assets', 'transactions', 'watching']} 
                    selectCategory={(category) => navigate(category)} 
                />
            </>
            <Routes>
                <Route 
                    path='/assets/*'
                    element={<PortfolioAssets portfolio={portfolio} userClaims={userClaims} />}
                />
                <Route 
                    path='/transactions/*'
                    element={<Transactions
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                        portfolio={portfolio}
                        userClaims={userClaims}
                     />}
                />
                <Route 
                    path='/update/*'
                    element={<UpdatePortfolio
                        portfolio={portfolio}
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                        createdProxyUsers={createdProxyUsers}
                        setCreatedProxyUsers={setCreatedProxyUsers}
                     />}
                />
                <Route 
                    path='/watching/*'
                    element={
                        <Watching 
                            createdProxyUsers={createdProxyUsers}
                            setCreatedProxyUsers={setCreatedProxyUsers}
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
