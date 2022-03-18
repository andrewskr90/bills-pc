import React from 'react'

const SearchedCardPage = (props) => {
    const cardObj = props.searchedCardSelect
    const { setMyCollectionArray, myCollectionArray } = props
    console.log(cardObj)
    
    const handleAdd = () => {
        setMyCollectionArray([
            ...myCollectionArray,
            cardObj
        ])
    }
    console.log(cardObj)
    return <>
        <div>
            <button onClick={handleAdd}>Add to MyCollection</button>
            <h2>{cardObj.name}</h2>
            <img src={cardObj.images.large}/>
        </div>
    </>
}

export default SearchedCardPage