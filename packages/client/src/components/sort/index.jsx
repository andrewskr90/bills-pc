import React from 'react'
import './assets/sort.css'

const Sort = (props) => {
    const { referenceData, setReferenceData, sortKey } = props

    const handleChangeValue = (e) => {
        setReferenceData({
            ...referenceData,
            [sortKey]: {
                ...referenceData[sortKey],
                value: e.target.value,
                direction: referenceData[sortKey].values[e.target.value].defaultDirection
            }
        })
    }

    const toggleDirection = (e) => {
        if (e.currentTarget.value === 'asc') {
            setReferenceData({
                ...referenceData,
                [sortKey]: {
                    ...referenceData[sortKey],
                    direction: 'desc'
                }
            })
        } else {
            setReferenceData({
                ...referenceData,
                [sortKey]: {
                    ...referenceData[sortKey],
                    direction: 'asc'
                }
            })
        }
    }

    return (<div className='sort'>
        <button className='direction' value={referenceData[sortKey].direction} onClick={toggleDirection}>
            {referenceData[sortKey].direction === 'asc' ? <i className='upArrow' /> : <i className= 'downArrow' />}
        </button>
        <select className='value' onChange={handleChangeValue}>
            {Object.keys(referenceData[sortKey].values).map(value => {
                if (referenceData[sortKey].value === value) return <option value={value} selected>{referenceData[sortKey].values[value].formatted}</option>
                return <option value={value}>{referenceData[sortKey].values[value].formatted}</option>
            })}
        </select>
    </div>)
}

export default Sort
