import React from 'react'
import BackArrowPNG from './assets/backArrow.png'
import './assets/backArrow.less'

const BackArrow = (props) => {
    const { handleClickBackArrow } = props

    return (<button className='backArrow' onClick={handleClickBackArrow}>
        <img src={BackArrowPNG} />
    </button>)
}

export default BackArrow
