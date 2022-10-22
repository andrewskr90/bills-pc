import React from 'react'
import './assets/sort.less'

const Sort = (props) => {
    const { dataObject, setDataObject } = props
    
    const handleChangeValue = (e) => {
        setDataObject({
            ...dataObject,
            sort: {
                ...dataObject.sort,
                value: e.target.value,
                direction: dataObject.sort.values[e.target.value].defaultDirection
            }
        })
    }

    const toggleDirection = (e) => {
        if (e.currentTarget.value === 'asc') {
            setDataObject({
                ...dataObject,
                sort: {
                    ...dataObject.sort,
                    direction: 'desc'
                }
            })
        } else {
            setDataObject({
                ...dataObject,
                sort: {
                    ...dataObject.sort,
                    direction: 'asc'
                }
            })
        }
    }

    return (<div className='sort'>
        <select className='value' onChange={handleChangeValue}>
            {Object.keys(dataObject.sort.values).map(value => {
                if (dataObject.sort.value === value) return <option value={value} selected>{dataObject.sort.values[value].formatted}</option>
                return <option value={value}>{dataObject.sort.values[value].formatted}</option>
            })}
        </select>
        <button className='direction' value={dataObject.sort.direction} onClick={toggleDirection}>
            {dataObject.sort.direction === 'asc' ? <i className='upArrow' /> : <i className= 'downArrow' />}
        </button>
    </div>)
}

export default Sort
