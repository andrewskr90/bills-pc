import React from 'react'
import { compileBulkLabels } from "./utils/bulk"

const BulkSplit = (props) => {
    const { bulkSplit, selectBulkSplit } = props
    return <div onClick={() => selectBulkSplit(bulkSplit.bulk_split_id)} className='bulkSplit' style={{ boxShadow: '2px 2px 4px gray', borderRadius: '10px', marginTop: '10px', padding: '4px' }}>
        <p>{compileBulkLabels(bulkSplit.labels)}</p>
        <p>{bulkSplit.bulk_split_estimate ? '~' : ''}{bulkSplit.bulk_split_count}</p>
    </div>
}

export default BulkSplit
