import React from 'react'
import BackArrow from '../../components/buttons/back-arrow'
import './assets/banner.less'

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
