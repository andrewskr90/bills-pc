import React, { useState } from 'react'
import { etb, hanger } from '../data/scratch_data/productAssets'
const initialFormValues = {   
    type: '',
    set:'',
    price:''
}

const productBoosters = (setName, type, ripId) => {
    if(type === 'etb') {
        return etb
    } else if(type === 'hanger') {
        return hanger
    }
}

const RipForm = () => {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [todaysRipCount, setTodaysRipCount] = useState(0)
    const [rippedObjects, setRippedObjects] = useState([])
    const [subRipCount, setSubRipCount] = useState(0)

    let today = new Date()
    let dd = String(today.getDate()).padStart(2,'0')
    let mm = String(today.getMonth()+1).padStart(2,'0')
    let yyyy = String(today.getFullYear())
    
    const onChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        let ripId = `${mm}${dd}${yyyy}-${todaysRipCount}`
        let includedPacks = productBoosters(formValues.set, formValues.type, ripId)
        let newRippedObject = {
            ...formValues,
            OT: 'Ronhaar',
            id:ripId,
            assets: includedPacks
        }
        setRippedObjects([
            ...rippedObjects,
            newRippedObject
        ])
        setTodaysRipCount(todaysRipCount+1)
    }
    console.log(rippedObjects)

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label>Set Name
                    <select
                        id='set'
                        name='set'
                        type='text'
                        value={formValues.set}
                        onChange={onChange}
                    >
                        <option
                            id='select'
                            value=''
                        >
                            --Select One--
                        </option>
                        <option
                            id='evolvingSkies'
                            value='evolvingSkies'
                        >
                            Evolving Skies
                        </option>
                        <option
                            id='chillingReign'
                            value='chillingReign'
                        >
                            Chilling Reign
                        </option>
                    </select>
                </label>
                <label>Product Type
                    <select
                        id='type'
                        name='type'
                        type='text'
                        value={formValues.type}
                        onChange={onChange}
                    >
                        <option
                            id='etb'
                            value='etb'
                        >
                            Elite Trainer Box
                        </option>
                        <option
                            id='hanger'
                            value='hanger'
                        >
                            Hanger Booster Pack
                        </option>
                    </select>
                </label>
                <label>Price
                    <input
                        id='price'
                        name='price'
                        type='text'
                        value={formValues.price}
                        onChange={onChange}
                    />
                </label>
                <button>Rip</button>
            </form>
            <div>
                {rippedObjects.map(product => {
                    return(
                        <div>
                            <h3>{`${product.set} ${product.type}`}</h3>
                            {product.assets.map(pack => {
                                return (
                                    <div>
                                        <p>{`${pack.set} booster pack`}</p>
                                        <p>Click to Rip!</p>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RipForm