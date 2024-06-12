import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sets = (props) => {
    const { filteredSets, setCurrentSetCards } = props

    const navigate = useNavigate()

    return (<div className='panel sets'>
        {filteredSets.length === 0
        ?
        <h2>Loading...</h2>
        :
        filteredSets.map(set => {
            const { id, name, series, images } = set
            return <div onClick={() => {
                setCurrentSetCards([])
                navigate(id)
                }} key={id} className='set'>
                <img src={images.logo} />
                <p>{name}</p>
            </div>
        })
        }
    </div>)
}

export default Sets