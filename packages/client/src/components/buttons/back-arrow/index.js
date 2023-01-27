import React from 'react'
import { useNavigate } from 'react-router-dom'
import BackArrowPNG from './assets/backArrow.png'
import './assets/backArrow.less'

const BackArrow = () => {
    const navigate = useNavigate()
    return (<button className='backArrow' onClick={() => navigate(-1)}>
        <img src={BackArrowPNG} />
    </button>)
}

export default BackArrow
