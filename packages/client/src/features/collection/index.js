import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import CollectedCards from './CollectedCards'
import PortfolioToolbar from './PortfolioToolbar'
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

const initialSelectedCollectedCardsValues = {
    card_id: '',
    collected_card_quantity: 0,
    collected_card_average_price: 0,
    collection: [   
        {
            card_name: '',
            set_name: '',
            set_language: '',
            sale_card_price: 0,
            card_image_large: '',
            sale_card_sale_id: '',
            collected_card_note_note: '',
            set_ptcgio_id: '',
            card_number: ''
        }
    ]
}

const Collection = (props) => {
    const { userClaims } = props
    const [collectedCards, setCollectedCards] = useState([])
    const [selectedCardModal, setSelectedCardModal] = useState(false)
    const [selectedPurchaseModal, setSelectedPurchaseModal] = useState(false)
    const [selectedPurchaseCards, setSelectedPurchaseCards] = useState(initialSelectedPurchaseCardsValues)
    const [selectedCollectedCards, setSelectedCollectedCards] = useState(initialSelectedCollectedCardsValues)

    const formatDate = (dateCode) => {
        console.log(dateCode)
        const dateParts = dateCode.split('-')
        return `${dateParts[1]}-${dateParts[2].split('T')[0]}-${dateParts[0]}`
    }

    const formatCollectedCards = (cards) => {
        const formattedCards = cards.map(card => {
            let collected_card_note_note = card.collected_card_note_note
            if (!card.collected_card_note_note) {
                collected_card_note_note = 'N/A'
            }
            const formattedCard = {
                ...card,
                collected_card_note_note: collected_card_note_note,
            }
            return formattedCard
        })
        return formattedCards
    }

    const evaluateCollection = (collection) => {
        const visited = {}
        const findCardStats = (cardToCheck) => {
            let quantity = 0
            let amountInvested = 0
            collection.forEach(card => {
                if (cardToCheck.card_id === card.card_id) {
                    quantity++
                    amountInvested += card.sale_card_price
                }
            })
            const averagePrice = Math.round(amountInvested / quantity *100) /100
            const cardWithStats = {
                ...cardToCheck,
                collected_card_quantity: quantity,
                collected_card_average_price: averagePrice
            }
            return cardWithStats
        }
        const updateWithMultiples = (uniqueCards) => {
            const updatedWithMultiples = uniqueCards.map((uniqueCard, idx) => {
                const collectionArray = []
                collection.forEach(collectedCard => {
                    if (uniqueCard.card_id === collectedCard.card_id) {
                        collectionArray.push(collectedCard)
                    }
                })
                const uniqueCardWithCollection = {
                    card_id: uniqueCard.card_id,
                    collected_card_quantity: uniqueCard.collected_card_quantity,
                    collected_card_average_price: uniqueCard.collected_card_average_price,
                    collection: collectionArray
                }
                return uniqueCardWithCollection
            })
            return updatedWithMultiples
        }

        const uniqueCards = collection.filter(card => {
            if (!visited[card.card_id]) {
                visited[card.card_id] = 1
                return card
            }
        })
        const evaluatedCollection = uniqueCards.map(card => {
            const cardWithStats = findCardStats(card)
            return cardWithStats
        })
        const updatedWithMultiples = updateWithMultiples(evaluatedCollection)
        return updatedWithMultiples
    }

    useEffect(() => {
        BillsPcService.getCollectedCards()
            .then(res => {
                const evaluatedCollection = evaluateCollection(res.data)
                console.log(evaluatedCollection)
                setCollectedCards(evaluatedCollection)
            }).catch(err => {
                console.log(err)
            })
    }, [])

    const selectCollectedCards = async (e) => {
        const selectedCollectedCards = collectedCards.filter(cards => {
            if (cards.card_id === e.currentTarget.id) {
                return cards
            }
        })

        setSelectedCollectedCards(selectedCollectedCards[0])
        setSelectedPurchaseModal(false)
        setSelectedCardModal(true)
    }
    
    const handleViewCardPurchase = (e) => {
        const params = {
            sale_id: e.currentTarget.id
        }
        const formatPurchaseCards = (purchase) => {
            const formattedPurchaseCards = purchase.map(card => {
                let sale_note_note = card.sale_note_note
                let sale_vendor = card.sale_vendor
                if (!card.sale_note_note) {
                    sale_note_note = 'N/A'
                }
                if (!card.sale_vendor) {
                    sale_vendor = 'N/A'
                }
                const sale_date = formatDate(card.sale_date)
                return {
                    ...card,
                    sale_date: sale_date,
                    sale_note_note: sale_note_note,
                    sale_vendor: sale_vendor
                }
            })
            console.log(formattedPurchaseCards)
            return formattedPurchaseCards
        }
        BillsPcService.getTransactionSales(params)
            .then(res => {
                const formattedPurchaseCards = formatPurchaseCards(res.data)
                setSelectedPurchaseCards(formattedPurchaseCards)
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

    return (<div className='collection page'>
        {collectedCards.length > 0
        ?
        <>
            {/* <PortfolioToolbar /> */}
            <h3>Portfolio</h3>
            <CollectedCards 
                collectedCards={collectedCards} 
                selectCollectedCards={selectCollectedCards} 
            />
            {selectedCardModal
            ?
            <CollectedCardModal 
                userClaims={userClaims} 
                selectedCollectedCards={selectedCollectedCards} 
                handleViewCardPurchase={handleViewCardPurchase} 
                handleCloseCardModal={handleCloseCardModal}
            />
            :
            <></>}
            {selectedPurchaseModal
            ?
            <PurchaseCardsModal 
                selectedPurchaseCards={selectedPurchaseCards} 
                selectCollectedCards={selectCollectedCards} 
                handleClosePurchaseModal={handleClosePurchaseModal} 
            />
            :
            <></>}
        </>
        :
        <div className='emptyCollection page'>
            <p>No items in your collection!</p>
            <Link to='/import'>
                <button>Add Items</button>
            </Link>
        </div>}
    </div>)
}

export default Collection
