import React from 'react'
import { useNavigate } from 'react-router-dom'
import MinimalPokeball from '../../assets/images/minimal-pokeball.png'

const Expansion = (props) => {
    const { referenceDataExpansion } = props
    const navigate = useNavigate()
    
    let topTenAverage = 'loading...'
    let valueAndChangeClassName = 'valueAndChange'
    if (!referenceDataExpansion.topTenAverage) valueAndChangeClassName += ' loadingGradient'
    
    if (referenceDataExpansion.topTenAverage) {
        topTenAverage = referenceDataExpansion.topTenAverage.today ? `$${referenceDataExpansion.topTenAverage.today.toFixed(2)}` : ''
    }

    const handleSelectSet = () => {
        navigate(referenceDataExpansion.set_v2_id)
    }

    return (<div 
            className='expansion'
            onClick={handleSelectSet}
        >
        <div className='setSymbol'>
            <img src={referenceDataExpansion.set_v2_ptcgio_id ? `https://images.pokemontcg.io/${referenceDataExpansion.set_v2_ptcgio_id}/symbol.png` : MinimalPokeball} />
        </div>
        <p className='setName'>{referenceDataExpansion.set_v2_name}</p>
        {/* <div className={valueAndChangeClassName}>
            <p className='top10Avg'>Top10Avg</p>
            <p className='marketValue'>{topTenAverage}</p>
        </div> */}

    </div>)
}

export default Expansion
