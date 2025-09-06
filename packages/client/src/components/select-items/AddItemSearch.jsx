import React, { useEffect, useState } from "react"
import { buildQueryParams, buildParamString } from "../../utils/location"
import { useLocation, useNavigate } from "react-router-dom"
import Search from "../../features/search"
import Toolbar from "../../layouts/toolbar"
import PageSelection from "../page-selection"
import ItemContainer from "../item-container"
import Item from "../item"
import { searchForItems } from "../../utils/search"

const AddItemSearch = (props) => {
    const { initialEmptyMessage, referenceData, setReferenceData, countConfig } = props
    const location = useLocation()
    const queryParams = buildQueryParams(location)
    const [searchedItems, setSearchedItems] = useState([])
    const [emptyMessage, setEmptyMessage] = useState(initialEmptyMessage)
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState()

    const sortKey = 'itemSort'

    useEffect(() => {
        (async () => {
            const relayedSearch = queryParams.searchvalue
            if (relayedSearch) {
                await searchForItems(relayedSearch, queryParams)
                    .then(res => {
                        setEmptyMessage('No results found.')
                        setSearchedItems(res.data.items)
                        setCount(res.data.count)
                        setLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                        setLoading(false)
                    })
            }
        })()
    }, [queryParams.searchvalue, queryParams.page, queryParams.direction])

    return (
        <>
            <Search setLoading={setLoading} />
            <Toolbar
                viewRangeSelector={true} 
                referenceData={referenceData} 
                setReferenceData={setReferenceData}
                sortKey={sortKey}
                defaultSortDirection={'asc'}
                viewToggleRowGrid={true}
            />
            <PageSelection location={location} count={count} />
            <ItemContainer emptyMessage={emptyMessage} loading={loading}>
                {searchedItems.map(item => {
                    return <Item
                        key={item.id} 
                        item={item} 
                        referenceData={referenceData} 
                        countConfig={countConfig} 
                        allowSelectPrinting={true}
                        allowSelectCondition={true}
                    />
                })}
            <PageSelection location={location} count={count} />
            </ItemContainer>
        </>
    )
}

export default AddItemSearch
