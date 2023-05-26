import React from 'react'
import './assets/button.less'

const Button = (props) => {
    const { children, onClick } = props
    return <button className='button' onClick={onClick}>{children}</button>
}

export default Button
