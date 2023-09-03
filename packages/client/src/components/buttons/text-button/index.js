import React from 'react'
import './assets/button.less'

const Button = (props) => {
    const { children, onClick, variation, color, disabled, style } = props
    
    const secondaryStyles = {
        border: `solid 2px ${color ? color : '#6065cb'}`,
        borderRadius: '10px',
        color: color ? color : '#6065cb',
        backgroundColor: 'white',
        
    }

    let styleObj = {}
    if (style) styleObj = { ...style }
    if (variation === 'secondary') styleObj = { ...styleObj, ...secondaryStyles }

    return <button disabled={disabled} className='button' 
        style={styleObj} 
        onClick={onClick}
    >
        {children}
    </button>
}

export default Button
