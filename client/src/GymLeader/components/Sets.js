import React from 'react'

const Sets = (props) => {

    const { sets, selectSet } = props

    return (<>
        <div className='sets'>
            {sets.map(set => {
                const { id, name, series } = set
                return <div className='set'>
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