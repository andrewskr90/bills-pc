import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import CollectedCards from './CollectedCards'
import CollectedCardModal from './CollectedCardModal'
import PurchaseCardsModal from './PurchaseCardsModal'
import './assets/collection.less'

const initialSelectedPurchaseCardsValues = [{
    sale_date: '',
    sale_total: 0,
    sale_notes: '',
    sale_vendor: '',
    sale_note_note: ''
}]

const initialSelectedCollectedCardValues = {
    card_name: '',
    set_name: '',
    set_language: '',
    sale_card_price: 0,
    card_image_large: '',
    sale_card_sale_id: '',
    collected_card_note_note: ''
}

const Collection = (props) => {
    const { userClaims } = props
    const [collectedCards, setCollectedCards] = useState([])
    const [selectedCardModal, setSelectedCardModal] = useState(false)
    const [selectedPurchaseModal, setSelectedPurchaseModal] = useState(false)
    const [selectedPurchaseCards, setSelectedPurchaseCards] = useState(initialSelectedPurchaseCardsValues)
    const [selectedCollectedCard, setSelectedCollectedCard] = useState(initialSelectedCollectedCardValues)
    
    const viewCardInfo = (cardId) => {
        const params = {
            collected_card_id: cardId
        }
        BillsPcService.getCollectedCards(params)
            .then(res => {
                setSelectedCollectedCard(res.data[0])
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        BillsPcService.getCollectedCards()
            .then(res => {
                setCollectedCards(res.data)
            }).catch(err => {
                console.log(err)
            })
    }, [])

    const selectCollectedCard = (e) => {
        setSelectedPurchaseModal(false)
        setSelectedCardModal(true)
        viewCardInfo(e.currentTarget.id)
    }

    const handleViewCardPurchase = (e) => {
        const params = {
            sale_id: e.currentTarget.id
        }
        BillsPcService.getTransactionSales(params)
            .then(res => {
                setSelectedPurchaseCards(res.data)
                setSelectedCardModal(false)
                setSelectedPurchaseModal(true)
            }).catch(err => {
                console.log(err)
            })
    }

    const handleCloseCardModal = (e) => {
        setSelectedCardModal(false)
    }

    const handleClosePurchaseModal = () => {
        setSelectedPurchaseModal(false)
    }

    return (<div className='collection'>
        {collectedCards.length > 0
        ?
        <div className='collectionPage'>
            <h1>Card Collection</h1>
            <CollectedCards 
                collectedCards={collectedCards} 
                selectCollectedCard={selectCollectedCard} 
            />
            {selectedCardModal
            ?
            <CollectedCardModal 
                userClaims={userClaims} 
                selectedCollectedCard={selectedCollectedCard} 
                handleViewCardPurchase={handleViewCardPurchase} 
                handleCloseCardModal={handleCloseCardModal}
            />
            :
            <></>}
            {selectedPurchaseModal
            ?
            <PurchaseCardsModal 
                selectedPurchaseCards={selectedPurchaseCards} 
                selectCollectedCard={selectCollectedCard} 
                handleClosePurchaseModal={handleClosePurchaseModal} 
            />
            :
            <></>}
        </div>
        :
        <div className='emptyCollection page flexColumnCenter'>
            <p>No items in your collection!</p>
            <Link to='/import'>
                <button>Add Items</button>
            </Link>
        </div>}
    </div>)
}

export default Collection
