import React, { useState } from 'react'
import { purchases } from '../data/scratch_data/purchases';
import { productCatalogue as catalogue, productCatalogue } from '../data/scratch_data/productCatalogue';
import { sellers } from '../data/scratch_data/sellers';

const initialFormValues = {   
    type: '',
    set:'',
    price:'',
    seller:'',
    sellerLocation:''
}

const initialPurchaseCounter = purchases.length

const PurchaseForm = () => {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [purchaseCounter, setPurchaseCounter] = useState(initialPurchaseCounter)
    const [purchases, setPurchases] = useState([])
    const [productCatalogue, setProductCatalogue] = useState(catalogue)

    let today = new Date()
    let dd = String(today.getDate()).padStart(2,'0')
    let mm = String(today.getMonth()+1).padStart(2,'0')
    let yyyy = String(today.getFullYear())

    const filterProductAssets = (setName, inputType, newId) => {
        let filteredSet = productCatalogue.filter(setObject => setObject.set === setName)
        let filteredProduct = filteredSet[0].products.filter(product => {
            return product.type === inputType
        })
        return ({
            purchase_id: newId,
            ...filteredProduct[0].assets
        })
    }
    
    const onChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        let newId = `${purchaseCounter}`
        let dateToday = `${mm}${dd}${yyyy}`
        let productAssets = filterProductAssets(formValues.set, formValues.type, newId)
        let newPurchasedObject = {
            ...formValues,
            OT: 'Ronhaar',
            id: newId,
            date: dateToday,
            assets: productAssets
        }
        setPurchases([
            ...purchases,
            newPurchasedObject
        ])
        setPurchaseCounter(purchaseCounter+1)
    }

    return (
        <div>
            <h2>Purchase Form</h2>
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
                            value=''
                        >
                            --Select One--
                        </option>
                        <option
                            value='etb'
                        >
                            Elite Trainer Box
                        </option>
                        <option
                            value='hanger'
                        >
                            Hanger Booster Pack
                        </option>
                    </select>
                </label>
                <label>Seller
                    <select
                        id='seller'
                        name='seller'
                        onChange={onChange}
                    >
                        <option
                            value=''
                        >--Select Seller--</option>
                        {sellers.map(sellerValue => {
                            return (<>
                                <option
                                    value={sellerValue.id}
                                >
                                    {sellerValue.name}
                                </option>
                            </>)
                        })}
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
            {/* <div>
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
            </div> */}
        </div>
    )
}

export default PurchaseForm