import React, { useEffect, useState } from 'react'
import { PTCGIO_API } from '../../../../../config'
import PtcgioService from '../../api/pokemon-tcg-io'

const CollectedCard = (props) => {
    const { card, selectCollectedCards } = props
    const { 
        collected_card_quantity,
        collected_card_average_price,
        collection
    } = card

    const { 
        card_id,
        collected_card_id, 
        card_image_small, 
        set_name, 
        card_name,
        sale_card_price,
        set_ptcgio_id,
        card_number 
    } = collection[0]

    return (<div className='collectedCard' onClick={selectCollectedCards} id={card_id}>
        <img 
                className='collectedCardImg' 
                src={card_image_small}
            />
        <div className='miniPanel'>
            <div className='top'>
                <div>
                    <p className='setName'>{set_name}</p>
                    <p>{card_name}</p>
                </div>
                <h3>x{collected_card_quantity}</h3>
            </div>
            <div className='bottom'>
                <p>Average Cost</p>
                <h3>${collected_card_average_price}</h3>
            </div>
        </div>
    </div>)
}

export default CollectedCard
