import React, { useState, useEffect } from 'react'
import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import LoginForm from '../authenticate/LoginForm/index.jsx'
import { initialPortfolioValues } from '../../data/initialData'
import './assets/collection.css'
import UpdatePortfolio from './features/update-portfolio/index.jsx'
import Header from '../../layouts/header/index.jsx'
import CategorySelector from '../../components/category-selector/index.jsx'
import Transactions from './features/transactions/index.jsx'
import PortfolioAssets from './features/portfolio-assets/index.jsx'
import Watching from './features/watching/index.jsx'

const Collection = (props) => {
    const { userClaims, setUserClaims, referenceData, setReferenceData } = props
    const [portfolio, setPortfolio] = useState(initialPortfolioValues)
    const [count, setCount] = useState()
    const [createdProxyUsers, setCreatedProxyUsers] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        (async () => { 
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
                {/* <Link to='update/purchase'><button>Update Collection</button></Link> */}
                <CategorySelector
                    basePage="collection"
                    categories={['assets', 'watching']} 
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
                {/* <Route 
                    path='/transactions/*'
                    element={<Transactions
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                        portfolio={portfolio}
                        userClaims={userClaims}
                     />}
                /> */}
                {/* <Route 
                    path='/update/*'
                    element={<UpdatePortfolio
                        portfolio={portfolio}
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                        createdProxyUsers={createdProxyUsers}
                        setCreatedProxyUsers={setCreatedProxyUsers}
                     />}
                /> */}
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
