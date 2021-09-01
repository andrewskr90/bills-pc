import React, { useState } from 'react'

const initialFormValues = {   
    type: '',
    set:'',
    price:''
}

const spendingHistory = [
    {
        type: 'booster pack',
        set: 'evolving skies',
        individualCost:'4',
        quantity: '5',
        totalCost: '20',
        date: '08312021',
        seller: 'shanes',
        transactionId:'001'
    }
]

const mySealedProducts = [
    {
        type: 'booster pack',
        set: 'evolving skies',
        originalCost: '4',
        originalSeller: 'shanes',
        datePurchased: '08312021',
        transactionId: '001'
    },
    {
        type: 'booster pack',
        set: 'evolving skies',
        originalCost: '4',
        originalSeller: 'shanes',
        datePurchased: '08312021',
        transactionId: '001'
    },
    {
        type: 'booster pack',
        set: 'evolving skies',
        originalCost: '4',
        originalSeller: 'shanes',
        datePurchased: '08312021',
        transactionId: '001'
    },
    {
        type: 'booster pack',
        set: 'evolving skies',
        originalCost: '4',
        originalSeller: 'shanes',
        datePurchased: '08312021',
        transactionId: '001'
    },
    {
        type: 'booster pack',
        set: 'evolving skies',
        originalCost: '4',
        originalSeller: 'shanes',
        datePurchased: '08312021',
        transactionId: '001'
    }
]
// id: 82720211,
    // date: 8/27/2021,
//         {OT:trainerId, id: 827202111, name:'Espeon VMAX', rarity:'ultra rare', set:'Evolving Skies', number:65},
//         {OT:trainerId, id: 827202112, name:'Glaceon V', rarity:'full art', set:'Evolving Skies', number:174},
//         {name:'bulk', reverseHolos:8, reverseHoloRares: 1, holoRares:0, nonHoloRares:6}

const productBoosters = (setName, type, ripId) => {
    if(type === 'etb') {
        return [
            {
                id:`${ripId}-1`,
                set: setName,
                status:'sealed'
            },
            {
                id:`${ripId}-2`,
                set: setName,
                status:'sealed'
            },
            {
                id:`${ripId}-3`,
                set: setName,
                status:'sealed'
            },
            {
                id:`${ripId}-4`,
                set: setName,
                status:'sealed'
            },
            {
                id:`${ripId}-5`,
                set: setName,
                status:'sealed'
            },
            {
                id:`${ripId}-6`,
                set: setName,
                status:'sealed'
            },
            {
                id:`${ripId}-7`,
                set: setName,
                status:'sealed'
            },
            {
                id:`${ripId}-8`,
                set: setName,
                status:'sealed'
            }
        ]
    } else if(type === 'hanger') {
        return [
            {
                id:`${ripId}-1`,
                set: setName,
                status:'sealed'
            }
        ]
    } else if(type === 'booster pack')
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
            OT: 'Ronhaar'
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