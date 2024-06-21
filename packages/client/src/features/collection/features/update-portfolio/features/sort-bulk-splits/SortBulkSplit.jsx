import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { compileBulkLabels } from '../../../../utils/bulk'
import ItemsTable from '../../../../../import-purchase/feature/items-table/index.jsx'
import PlusButton from '../../../../../../components/buttons/plus-button/index.jsx'
import Banner from '../../../../../../layouts/banner/index.jsx'
import BulkSplitForm from '../../../../../../components/bulk-form/components/bulk-split-form/index.jsx'
import Button from '../../../../../../components/buttons/text-button/index.jsx'
import { initialSortingSplitValues, initialSortingValues } from '../../../../../../data/initialData'
import BillsPcService from '../../../../../../api/bills-pc'
import SelectItem from '../../../../../../components/select-item/index.jsx'

const SortBulkSplit = (props) => {
    const { portfolio, referenceData, setReferenceData } = props
    const params = useParams()
    const [selectedBulkSplit, setSelectedBulkSplit] = useState(portfolio.inventory.bulkSplits.find(split => split.bulk_split_id === params.bulkId))
    const [productBulkSplits, setProductBulkSplits] = useState([])
    const [addBulkOrGem, setAddBulkOrGem] = useState('bulk')
    const [sortingValues, setSortingValues] = useState({ 
        ...initialSortingValues, 
        sorting_bulk_split_id: params.bulkId
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (!selectedBulkSplit) navigate(("/collection/update/sort"))
    }, [])

    const handleToggleAddBulkSplit = () => navigate("add-split")
    const handleToggleSelectCard = () => navigate("add-item")

    const handleAddBulkSorting = (e) => {
        e.preventDefault()
        BillsPcService.postSortings({ data: [sortingValues] })
        navigate('/gym-leader/collection/update/sort')
    }

    const updateSortingValues = (e) => {
        setSortingValues({
            ...sortingValues,
            [e.target.name]: e.target.value
        })
    }

    const addSplitToSorting = (splitToAdd) => {
        updateSortingValues({
            target: {
                name: 'sortingSplits',
                value: [...sortingValues.sortingSplits, splitToAdd]
            }
        })
    }

    const handleSelectBulkOrGem = (e) => {
        setAddBulkOrGem(e.target.value)
    }

    const handleSelectBulkGem = (gem) => {
        const sortedGem = {
            ...gem,
            quantity: 1,
            itemNote: ''
        }
        updateSortingValues({
            target: {
                name: 'sortingGems',
                value: [...sortingValues.sortingGems, sortedGem]
            }
        })
        navigate(-1)
    }

    return <div>
        <Routes>
            <Route path="/" element={<>
                {selectedBulkSplit ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <h2>Sort Bulk Split</h2>
                        <p>{compileBulkLabels(selectedBulkSplit.labels)}</p>
                        <p>Count: {selectedBulkSplit.bulk_split_estimate ? '~' : ''}{selectedBulkSplit.bulk_split_count}</p>
                    </div>
                    <form>
                        <label>Date</label>
                        <input 
                            id='date'
                            className='date'
                            name='sorting_date'
                            type='date'
                            value={sortingValues.sorting_date}
                            onChange={updateSortingValues}
                        />
                        <select 
                            className='addItemOrBulk' 
                            onChange={handleSelectBulkOrGem}
                            value={addBulkOrGem}
                            style={{ width: '25%', marginTop: '10px' }}
                        >
                            <option value='bulk'>Bulk Split</option>
                            <option value='gem'>Bulk Gem</option>
                        </select>
                        {addBulkOrGem === 'gem' ? <>
                            <ItemsTable 
                                format='item'
                                items={sortingValues.sortingGems}
                                referenceData={referenceData}
                            />
                                <PlusButton handleClick={handleToggleSelectCard} />
                        </> : <>
                            <ItemsTable 
                                format='bulkSplit'
                                items={sortingValues.sortingSplits}
                                referenceData={referenceData}
                            />
                            <PlusButton handleClick={handleToggleAddBulkSplit} />
                        </>}
                        <Button onClick={handleAddBulkSorting}>Confirm</Button>
                    </form>
                </div> : <>loading...</>}
                </>} 
            />
            <Route path="/add-split" element={<div className='addPurchaseBulk page'>
                <Banner 
                    titleText={'Add Bulk Split'} 
                    handleClickBackArrow={() => navigate(-1)} 
                />
                <BulkSplitForm 
                    initialSplitValues={initialSortingSplitValues}
                    addSplitToTransaction={addSplitToSorting}
                    referenceData={referenceData}
                />
            </div>} />
            <Route path={"/add-item"} element={<SelectItem 
                    referenceData={referenceData}
                    setReferenceData={setReferenceData}
                    handleSelectItem={handleSelectBulkGem}
                    initialEmptyMessage={"Search for the gem you found in your bulk"}
                />}
            />
        </Routes>
    </div>
}

export default SortBulkSplit
