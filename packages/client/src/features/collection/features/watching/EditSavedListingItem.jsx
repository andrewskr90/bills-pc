import React, { useState } from "react"

const EditSavedListingItem = (props) => {
    const { item, referenceData, deletedCollectedItemIds, setDeletedCollectedItemIds } = props
    const [editCondition, setEditCondition] = useState(item.conditionId)
    return (
        <div className="flex justify-between border-2 border-gray-500 border-solid rounded-sm">
            <div>
                <p className={deletedCollectedItemIds.includes(item.collectedItemId) ? 'line-through decoration-red' : ''}>{item.name}</p>
                <select
                    value={editCondition} 
                    onChange={(e) => setEditCondition(e.target.value)}
                    className={item.conditionId !== editCondition ? 'bg-yellow' : ''}
                >
                    {referenceData.bulk.condition.filter(c => {
                        if (item.sealed && c.condition_id === '7e464ec6-0b23-11ef-b8b9-0efd996651a9') return true
                        else if (!item.seadled && c.condition_id !== '7e464ec6-0b23-11ef-b8b9-0efd996651a9') return true
                    }).map(c => {
                        return <option value={c.condition_id}>{c.condition_name}</option>
                    })}
                </select>
            </div>
            {deletedCollectedItemIds.includes(item.collectedItemId) ? (
                <button onClick={() => setDeletedCollectedItemIds(deletedCollectedItemIds.filter(id => id !== item.collectedItemId))}>undo delete</button>
            ) : (
                <button 
                    className="bg-red"
                    onClick={() => setDeletedCollectedItemIds([...deletedCollectedItemIds, item.collectedItemId])}
                >delete</button>
            )}
        </div>
    )
}

export default EditSavedListingItem