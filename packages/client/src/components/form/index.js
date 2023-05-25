import React from 'react'
import './assets/form.less'

const Form = (props) => {
    const { config, children } = props

    const buildElement = (elements, idx) => {
        let styleObj = {}
        if (elements[idx].styles) styleObj = elements[idx].styles
        if (elements[idx].width) styleObj.width = `${elements[idx].width}%`
        if (idx !== elements.length-1) styleObj.paddingRight = '5px'
        if (elements[idx].type === 'input') {
            return <div 
                className='labelInput'
                style={styleObj}
            >
                <label>{elements[idx].title}</label>
                <input 
                    id={elements[idx].id}
                    type='text'
                    name={elements[idx].name}
                    value={elements[idx].value}
                    onChange={elements[idx].onChange}
                />
            </div>
        } else if (elements[idx].type === 'button') {
            if (elements[idx].onSubmit) {
                return <button onSubmit={elements[idx].onSubmit} style={styleObj}>{elements[idx].title}</button>
            } else {
                return <button onClick={elements[idx].onClick} style={styleObj}>{elements[idx].title}</button>
            }
        } else if (elements[idx].type === 'date') {
            return <div 
                className='labelInput date'
                style={styleObj}
            >
                <label>{elements[idx].title}</label>
                <input 
                    id={elements[idx].id}
                    className='date'
                    name={elements[idx].name}
                    type='date'
                    value={elements[idx].value}
                    onChange={elements[idx].onChange}
                />
            </div>
        } else if (elements[idx].type === 'child') {
            return <>
                {children[elements[idx].childIndex]}
            </>
        }
    }

    return (<form>
        {config.rows.map((row, i) => {
            return <div className='row'>
                {row.elements.map((element, j) => {
                    return buildElement(config.rows[i].elements, j)
                })}
            </div>
        })}
    </form>)
}

export default Form
