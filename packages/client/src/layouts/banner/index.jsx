import React from 'react'
import BackArrow from '../../components/buttons/back-arrow/index.jsx'
import './assets/banner.css'

const Banner = ({ children, titleText, handleClickBackArrow }) => {
    return (<div className='banner'>
        <div className='backAndTitle'>
            <h3>{titleText}</h3>
            <BackArrow handleClickBackArrow={handleClickBackArrow} />
        </div>
        {children}
    </div>)
}

export default Banner
