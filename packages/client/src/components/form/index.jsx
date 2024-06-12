import React from 'react'
import './assets/form.less'
import Button from '../buttons/text-button'

const Form = (props) => {
    const { config, children } = props
    const buildElement = (elements, idx) => {
        const element = elements[idx]
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
                {element.warning ? <p>{element.warning}</p> : <></>}
            </div>
        } else if (elements[idx].type === 'button') {
            if (elements[idx].onSubmit) {
                return <Button color={elements[idx].color} disabled={elements[idx].disabled} variation={elements[idx].variation} onSubmit={elements[idx].onSubmit} style={styleObj}>{elements[idx].title}</Button>
            } else {
                return <Button color={elements[idx].color} disabled={elements[idx].disabled} variation={elements[idx].variation} onClick={elements[idx].onClick} style={styleObj}>{elements[idx].title}</Button>
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
        } else if (elements[idx].type === 'checkbox') {
            return <div 
                className='labelInput checkbox'
                style={styleObj}
            >
                <label>{elements[idx].title}</label>
                <input 
                    id={elements[idx].id}
                    className='checkbox'
                    name={elements[idx].name}
                    type='checkbox'
                    value={elements[idx].value}
                    defaultChecked={element.defaultChecked}
                    onChange={elements[idx].onChange}
                />
            </div>
        } else if (elements[idx].type === 'header') {
            return <h2>{elements[idx].title}</h2>
        } else if (elements[idx].type === 'select') {
            return <div className='labelInput select' style={styleObj}>
                <label>{elements[idx].title}</label>
                <select value={element.value} name={element.name} onChange={element.onChange}>
                    {elements[idx].options.map(option => {
                        return <option value={option[elements[idx].optionValueKey]}>{option[elements[idx].optionDisplayKey]}</option>
                    })}
                </select>
            </div>
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
