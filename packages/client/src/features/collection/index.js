import React, { useState, useEffect } from 'react'
import { Route, Routes, Link } from 'react-router-dom'
import BillsPcService from '../../api/bills-pc'
import CollectedCards from './CollectedCards'
import ItemContainer from '../../components/item-container'
import PortfolioToolbar from './PortfolioToolbar'
import CollectedCardModal from './CollectedCardModal'
import PurchaseCardsModal from './PurchaseCardsModal'
import LoginForm from '../authenticate/LoginForm'
import { initialSelectedPurchaseCardsValues, initialSelectedCollectedCardsValues, initialPortfolioValues } from '../../data/initialData'
import './assets/collection.less'
import ImportPurchase from '../import-purchase'
import UpdatePortfolio from './features/update-portfolio'
import Header from '../../layouts/header'

const Collection = (props) => {
    const { userClaims, setUserClaims, referenceData, setReferenceData } = props
    const [collectedCards, setCollectedCards] = useState([])
    const [selectedCardModal, setSelectedCardModal] = useState(false)
    const [selectedPurchaseModal, setSelectedPurchaseModal] = useState(false)
    const [selectedPurchaseCards, setSelectedPurchaseCards] = useState(initialSelectedPurchaseCardsValues)
    const [selectedCollectedCards, setSelectedCollectedCards] = useState(initialSelectedCollectedCardsValues)
    const [portfolio, setPortfolio] = useState(initialPortfolioValues)

    const formatDate = (dateCode) => {
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
        const visitedCards = {}
        const visitedProducts = {}
        const findItemStats = (itemToCheck) => {
            let quantity = 0
            let amountInvested = 0
            collection.forEach(item => {
                if (item.card_id) {
                    if (itemToCheck.card_id === item.card_id) {
                        quantity++
                        amountInvested += parseFloat(item.sale_card_price)
                    }
                } else if (item.product_id) {
                    if (itemToCheck.product_id === item.product_id) {
                        quantity++
                        amountInvested += parseFloat(item.sale_product_price)
                    }
                }
            })
            const averagePrice = Math.round(amountInvested / quantity *100) /100
            const itemWithStats = {
                ...itemToCheck,
                collected_item_quantity: quantity,
                collected_item_average_price: averagePrice
            }
            return itemWithStats
        }
        const updateWithMultiples = (uniqueItems) => {
            const updatedWithMultiples = uniqueItems.map((uniqueItem, idx) => {
                const collectionArray = []
                collection.forEach(collectedItem => {
                    if (collectedItem.card_id) {
                        if (uniqueItem.card_id === collectedItem.card_id) {
                            collectionArray.push(collectedItem)
                        }
                    } else if (collectedItem.product_id) {
                        if (uniqueItem.product_id === collectedItem.product_id) {
                            collectionArray.push(collectedItem)
                        }
                    }
                })
                const uniqueItemWithCollection = {
                    item_id: uniqueItem.card_id || uniqueItem.product_id,
                    collected_item_quantity: uniqueItem.collected_item_quantity,
                    collected_item_average_price: uniqueItem.collected_item_average_price,
                    collection: collectionArray
                }
                return uniqueItemWithCollection
            })
            return updatedWithMultiples
        }

        const uniqueItems = collection.filter(item => {
            if (item.card_id) {
                if (!visitedCards[item.card_id]) {
                    visitedCards[item.card_id] = 1
                    return item
                }
            } else if (item.product_id) {
                if (!visitedProducts[item.product_id]) {
                    visitedProducts[item.product_id] = 1
                    return item
                }
            }
        })
        const evaluatedCollection = uniqueItems.map(item => {
            const itemWithStats = findItemStats(item)
            return itemWithStats
        })
        const updatedWithMultiples = updateWithMultiples(evaluatedCollection)
        return updatedWithMultiples
    }

    useEffect(() => {
        (async () => { 
            await BillsPcService.getPortfolio({ timeFrame: '2w' })
                .then(res => console.log(res))
                .catch(err => console.log(err))
        })()
    }, [userClaims])

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

    if (userClaims) {
        return (<div className='collection'>
            <Header main title={'Portfolio'}>
                <Link to='support-us'>Support Us</Link>
            </Header>
            <Routes>
                <Route 
                    path='/'
                    element={<>
                        {/* <CollectedCards 
                            collectedCards={collectedCards} 
                            selectCollectedCards={selectCollectedCards} 
                        /> */}
                        <Link to='update/purchase'><button>Update Collection</button></Link>
                        {collectedCards.length > 0
                        ?
                            // <div className='collectedCards'>
                            //     {collectedCards.map(card => {
                            //         return <CollectedCard card={card} selectCollectedCards={selectCollectedCards} />
                            //     })}
                            // </div>
                            <ItemContainer>
                                {collectedCards.map(item => {
                                    return <p>{item.collection[0].card_v2_id ? item.collection[0].card_v2_id : item.collection[0].product_id}</p>
                                })}
                            </ItemContainer>
                        :
                            <div className='emptyCollection'>
                                <p>No items in your collection!</p>
                                <p>Update your collection with a purchase.</p>
                                <Link to='update/purchase'>
                                    <button>Update Collection</button>
                                </Link>
                            </div>
                        }
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
                    </>} 
                />
                <Route 
                    path='/update/*'
                    element={<UpdatePortfolio
                        referenceData={referenceData}
                        setReferenceData={setReferenceData}
                     />}
                />
            </Routes>
        </div>)
    } else {
        return (<div className='collection'>
            <p className='loginWarning'>You must be logged in to view your portfolio.</p>
            <LoginForm setUserClaims={setUserClaims} />
        </div>)
    }

}

export default Collection
