import React from 'react'
import BackArrow from '../../components/buttons/back-arrow'
import './assets/banner.less'

const Banner = ({ children, titleText }) => {
    return (<div className='banner'>
        <div className='backAndTitle'>
            <h3>{titleText}</h3>
            <BackArrow />
        </div>
        {children}
    </div>)
}

export default Banner
