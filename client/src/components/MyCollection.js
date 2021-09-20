import React from 'react'
import CollectedCard from './CollectedCard'

const MyCollection = (props) => {
    const { myCollectionArray } = props

    const filteredCollectionArray = (array) => {
        return array
    }
    return(
        <div>
            {filteredCollectionArray(myCollectionArray).map(cardObj => {
                return <CollectedCard cardObj={cardObj} />
            })}
        </div>
    )
}

export default MyCollection