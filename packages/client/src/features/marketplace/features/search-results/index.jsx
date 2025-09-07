import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PreviousRoutes from '../../../../layouts/previous-routes/index.jsx'
import Item from '../../../../components/item/index.jsx'
import '../../assets/marketplace.css'
import Toolbar from '../../../../layouts/toolbar/index.jsx'
import ItemContainer from '../../../../components/item-container/index.jsx'
import { conditionSearchString } from '../../../../utils/search'
import PageSelection from '../../../../components/page-selection'
import { buildQueryParams } from '../../../../utils/location/index.js'
import BillsPcService from '../../../../api/bills-pc/index.js'

const SearchResults = (props) => {
    const { referenceData, setReferenceData, loading, setLoading } = props
    const [value, setValue] = useState('')
    const [count, setCount] = useState()
    const location = useLocation()
    const queryParams = buildQueryParams(location)
    const sortKey = 'itemSort'
    const navigate = useNavigate()
    const [marketSearchResults, setMarketSearchResults] = useState([])
    const filterConfig = { itemType: ['card', 'product'] }

    useEffect(() => {
        (async () => {
            queryParams.searchvalue = conditionSearchString(queryParams.searchvalue)
            if (queryParams.searchvalue) {
                setValue(queryParams.searchvalue)
                await BillsPcService.getItems({ params: queryParams })
                        .then(res => {
                            setMarketSearchResults(res.data.items)
                            setCount(res.data.count)
                            setLoading(false)
                        })
                        .catch(err => console.log(err))
            }
        })()
    }, [queryParams.searchvalue, queryParams.page, queryParams.direction])

    const handleSelectItem = (item) => {
        navigate(`/market/expansion/${item.set.id}/item/${item.id}`)
    }

    return (<div className='searchResults'>
        <PreviousRoutes location={location} referenceData={referenceData} />
        <div className='title'>
            <h3>{`Search Results for "${value}"`}</h3>
        </div>
        <Toolbar 
            sortKey={sortKey}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            viewToggleRowGrid={true}
            defaultSortDirection='asc'
            filterConfig={filterConfig}
        />
        {marketSearchResults.length > 0
        ?
        <>
            <PageSelection location={location} count={count} />
            <ItemContainer loading={loading} >
                {marketSearchResults.map(result => {
                    return <Item 
                        key={result.id} 
                        referenceData={referenceData} 
                        item={result} 
                        handleSelectItem={handleSelectItem} 
                    />
                })}
                <PageSelection location={location} count={count} />
            </ItemContainer>
        </>
        :
        <>Search for a card or product</>
        }
    </div>)
}

export default SearchResults
