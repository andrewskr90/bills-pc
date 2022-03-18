import React, { useState } from 'react';
import '../App.css';
import { dummy_collection } from '../../data/dummy_collection';

// import CollectedCard from './CollectedCard'

const MyCollection = (props) => {

    const [myCollectionArray, setMyCollectionArray] = useState(dummy_collection);

    return (
        <section class='my-collection'>
            <div class='container'>

            </div>
        </section>
    )

// old version of MyCollection   
//     const { myCollectionArray } = props

//     const filteredCollectionArray = (array) => {
//         return array
//     }
//     return(
//         <div>
//             {filteredCollectionArray(myCollectionArray).map(cardObj => {
//                 return <CollectedCard cardObj={cardObj} />
//             })}
//         </div>
//     )
}

export default MyCollection