import React from 'react'
import BackArrow from '../../components/buttons/back-arrow/index.jsx'
import { useNavigate } from 'react-router-dom'
import './assets/header.less'

const Header = (props) => {
    const { main, sub, title, children } = props
    const navigate = useNavigate()
    if (main) {
        return (<div className='header main'>
            <h2>{title}</h2>
            {children}
        </div>)
    } else if (sub) {
        const handleClickBackArrow = () => {
            navigate(-1)
        }
        return (<div className='header sub'>
            <BackArrow handleClickBackArrow={handleClickBackArrow} />
            <h2>{title}</h2>
            {children}
        </div>) 
    }
}

export default Header
