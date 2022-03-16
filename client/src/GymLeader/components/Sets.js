import React from 'react'

const Sets = (props) => {

    const { filteredSets, selectSet } = props

    return (<>
        <div className='sets'>
            {filteredSets.map(set => {
                const { id, name, series } = set
                return <div key={id} className='set'>
                    <p>Name:</p>
                    <p>{name}</p>
                    <p>Series:</p>
                    <p>{series}</p>
                    <button value={id} onClick={selectSet}>Search Set Cards</button>
                </div>
            })}
        </div>
    </>)
}

export default Sets