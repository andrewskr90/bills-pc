import React from 'react'
import './assets/sort.less'

const Sort = (props) => {
    const { dataObject, setDataObject, sortKey } = props

    const handleChangeValue = (e) => {
        setDataObject({
            ...dataObject,
            [sortKey]: {
                ...dataObject[sortKey],
                value: e.target.value,
                direction: dataObject[sortKey].values[e.target.value].defaultDirection
            }
        })
    }

    const toggleDirection = (e) => {
        if (e.currentTarget.value === 'asc') {
            setDataObject({
                ...dataObject,
                [sortKey]: {
                    ...dataObject[sortKey],
                    direction: 'desc'
                }
            })
        } else {
            setDataObject({
                ...dataObject,
                [sortKey]: {
                    ...dataObject[sortKey],
                    direction: 'asc'
                }
            })
        }
    }

    return (<div className='sort'>
        <button className='direction' value={dataObject[sortKey].direction} onClick={toggleDirection}>
            {dataObject[sortKey].direction === 'asc' ? <i className='upArrow' /> : <i className= 'downArrow' />}
        </button>
        <select className='value' onChange={handleChangeValue}>
            {Object.keys(dataObject[sortKey].values).map(value => {
                if (dataObject[sortKey].value === value) return <option value={value} selected>{dataObject[sortKey].values[value].formatted}</option>
                return <option value={value}>{dataObject[sortKey].values[value].formatted}</option>
            })}
        </select>
    </div>)
}

export default Sort
