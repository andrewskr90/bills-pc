import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PreviousRoutes from '../../../../layouts/previous-routes/index.jsx'
import Item from '../../../../components/item/index.jsx'
import '../../assets/marketplace.css'
import Toolbar from '../../../../layouts/toolbar/index.jsx'
import ItemContainer from '../../../../components/item-container/index.jsx'
import { conditionSearchString } from '../../../../utils/search'
import PageSelection from '../../../../components/page-selection'
import { buildParams } from '../../../../utils/location/index.js'
import BillsPcService from '../../../../api/bills-pc/index.js'

const SearchResults = (props) => {
    const { referenceData, setReferenceData, includePrintings } = props
    const [value, setValue] = useState('')
    const [count, setCount] = useState()
    const location = useLocation()
    const sortKey = 'itemSort'
    const filterKey = 'market'
    const navigate = useNavigate()
    const [isGrid, setIsGrid] = useState(false)
    const [marketSearchResults, setMarketSearchResults] = useState([])
    useEffect(() => {
        (async () => {
            const params = buildParams(location)
            params.searchvalue = conditionSearchString(params.searchvalue)
            if (includePrintings) params.includeprintings = true
            if (params.searchvalue) {
                setValue(params.searchvalue)
                await BillsPcService.getItems({ params })
                        .then(res => {
                            setMarketSearchResults(res.data.items)
                            setCount(res.data.count)
                        })
                        .catch(err => console.log(err))
            }
        })()
    }, [location.search])

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
            filterKey={filterKey}
            referenceData={referenceData}
            setReferenceData={setReferenceData}
            viewToggleRowGrid={true}
            isGrid={isGrid}
            setIsGrid={setIsGrid}
            defaultSortDirection='asc'
        />
        {marketSearchResults.length > 0
        ?
        <>
            <PageSelection location={location} count={count} />
            <ItemContainer>
                {marketSearchResults.map(result => {
                    return <Item 
                        key={result.id} 
                        referenceData={referenceData} 
                        item={result} 
                        handleSelectItem={handleSelectItem} 
                        isGrid={isGrid} 
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
