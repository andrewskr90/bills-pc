import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const CardsToolbar = (props) => {
    const { handlePostCardsToCards } = props
    const {setId } = useParams()
    const navigate = useNavigate()

    const backToSets = () => {
        navigate('/gym-leader/card-manager/ptcgio')
    }

    return (<div className='cardsSidebar sidebar'>
        <h2>Current Set: {setId}</h2>
        <button onClick={backToSets}>Back to Sets</button>
        <div>
            <p>POST selected set's cards to Cards Table</p>
            <button onClick={handlePostCardsToCards}>POST</button>
        </div>
    </div>)
}

export default CardsToolbar