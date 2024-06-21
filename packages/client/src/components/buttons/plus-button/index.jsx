import React from 'react'
import PlusSVG from './assets/Plus.svg'
import './assets/plusButton.css'

const PlusButton = (props) => {
    const { handleClick } = props

    return (<button className='plusButton pointer' onClick={() => handleClick()}>
        <img src={PlusSVG} />
    </button>)
}

export default PlusButton
