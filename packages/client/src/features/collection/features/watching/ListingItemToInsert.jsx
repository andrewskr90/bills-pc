import React from 'react'

const ListingItemToInsert = (props) => {
    const { item, idx, referenceData, insertedItems, setInsertedItems } = props
    const updatedItemToInsertCondition = (e) => {
        setInsertedItems(insertedItems.map((item, jdx) => {
            if (jdx === idx) return { ...item, conditionId: e.target.value }
            return item
        }))
    }
    return (
        <div className="flex justify-between border-2 border-gray-500 border-solid rounded-sm">
            <div>
                <p>{item.name}</p>
                <select
                    defaultValue={item.condition_id}
                    onChange={updatedItemToInsertCondition}
                >
                    {referenceData.bulk.condition.filter(c => {
                        if (item.sealed && c.condition_id === '7e464ec6-0b23-11ef-b8b9-0efd996651a9') return true
                        else if (!item.sealed && c.condition_id !== '7e464ec6-0b23-11ef-b8b9-0efd996651a9') return true
                    }).map(c => {
                        return <option value={c.condition_id}>{c.condition_name}</option>
                    })}
                </select>
            </div>
            <button 
                onClick={() => setInsertedItems(insertedItems.filter(curItem => curItem.itemId !== item.itemId))} 
                className="bg-red"
            >undo insert</button>
        </div>
    )
}

export default ListingItemToInsert
