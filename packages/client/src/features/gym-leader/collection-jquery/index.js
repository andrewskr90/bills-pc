


// const CollectionJQuery = (props) => {
//     const { userClaims } = props

//     const viewCardInfo = (cardId) => {
//         const url = `http://localhost:7070/api/v1/collected-cards?collected_card_id=${cardId}`
//             $.ajax({
//                 url: url,
//                 xhrFields: {
//                     withCredentials: true
//                 }
//             }).done(res => {
//                 const {
//                     card_name,
//                     set_name,
//                     set_language,
//                     sale_card_price,
//                     card_image_large,
//                     sale_card_sale_id,
//                     collected_card_note_note
//                 } = res[0]

//                 const modalClose = '<button class="modalClose"><h2>X</h2></button>'
//                 const collectedCardInfo = `<div class='collectedCardInfo'></div>`
//                 const collectedCardImage = `<img class='collectedCardImage' src='${card_image_large}'/>`
//                 const collectedCardTitle = `<p class='collectedCardTitle'>${userClaims.user_name}'s ${card_name}</p>`
//                 const collectedCardSet = `<p class='collectedCardSet'>${set_name} (${set_language})</p>`
//                 const collectedCardPurchasePrice = `<p class='collectedCardPurchasePrice'>Purchase Price: ${sale_card_price}</p>`
//                 const collectedCardNote = `<div><p>Note:</p><p>"${collected_card_note_note}"</p></div>`
//                 // const collectedCardNote = 
//                 const originalPurchaseButton = `<button id='${sale_card_sale_id}' class="originalPurchaseButton"><h2>Original Purchase</h2></button>`
//                 $('body').toggleClass('modalOpen')

//                 $('.collectionPage').append(modal)

//                 $('.modalContent')
//                     .append(collectedCardImage)
//                     .append(collectedCardInfo)

//                 $('.collectedCardInfo')
//                     .append(collectedCardTitle)
//                     .append(collectedCardSet)
//                     .append(collectedCardPurchasePrice)
//                     .append(originalPurchaseButton)
//                     .append(collectedCardNote)
//                     .append(modalClose)
                
//                 $('.modalClose').on('click', () => {
//                     $('body').toggleClass('modalOpen')
//                     $('.modal').remove()
//                 })
//                 $('.originalPurchaseButton').on('click', (e) => {
//                     $('.modalContent').empty()
//                     const url = `http://localhost:7070/api/v1/sales?sale_id=${e.currentTarget.id}`
//                     $.ajax({
//                         url: url,
//                         xhrFields: {
//                             withCredentials: true
//                         }
//                     }).done(res => {
//                         let {
//                             sale_date,
//                             sale_total,
//                             sale_notes,
//                             sale_vendor,
//                             sale_note_note
//                         } = res[0]
//                         if (!sale_notes) {
//                             sale_notes = 'none'
//                         }
//                         const purchaseInfo = `<div class="purchaseInfo"></div>`
//                         const purchaseDate = `<div class="purchaseDate"><h2>Purchase From:</h2><p>${sale_date}</p></div>`
//                         const itemCount = `<div class="itemCount"><p>Purchased Card Count:</p><p>${res.length}</p></div>`
//                         const totalCost = `<div class="totalCost"><p>Total Cost:</p><p>${sale_total}</p></div>`
//                         const saleVendor = `<div class="saleVendor"><p>Sale Vendor:</p><p>${sale_vendor}</p></div>`
//                         const purchaseNote = `<div class="purchaseNote"><p>Purchase Note:</p><p>"${sale_note_note}"</p></div>`
//                         const purchaseCards = `<div class="purchaseCards"></div>`

//                         $('.modalContent').append(purchaseCards)
//                         res.forEach(card => {
//                             const { card_image_small, collected_card_id } = card
//                             const purchaseCard = `<img id='${collected_card_id}' class='purchaseCard' src='${card_image_small}'/>`
//                             $('.purchaseCards').append(purchaseCard)
//                         })

//                         $('.modalContent').append(purchaseInfo)

//                         $('.purchaseInfo')
//                             .append(purchaseDate)
//                             .append(itemCount)
//                             .append(totalCost)
//                             .append(saleVendor)
//                             .append(purchaseNote)
//                             .append(modalClose)
//                             .append(purchaseCards)
//                         $('.modalClose').on('click', () => {
//                             $('body').toggleClass('modalOpen')
//                             $('.modal').remove()
//                         })
//                         $('.purchaseCards').on('click', '.purchaseCard', (e) => {
//                             $('body').toggleClass('modalOpen')
//                             $('.modal').remove()
//                             viewCardInfo(e.currentTarget.id)
//                         })
//                     })
                    
//                 })
//             })
//     }

//     const modal = "<div class='modal'><div class='modalContent'></div></div>"
//     //when componentDidRender, ajax request for collectedCards
//     useEffect(() => {
//         const url = 'http://localhost:7070/api/v1/collected-cards'
//         $.ajax({
//             url: url,
//             xhrFields: {
//                 withCredentials: true
//             }
//         }).done(res => {
//             //img element renders for each card in response array
//             res.forEach(card => {
//                 const { collected_card_id, card_image_small } = card
//                 const cardDiv = `<img class='collectedCard' id='${collected_card_id}' src='${card_image_small}' />`
//                 $('.collectedCards').append(cardDiv)
//             })
//         })
//         //clicking a card makes an ajax request with card_id query
//         $('.collectedCards').on('click', '.collectedCard', (e) => {
//             viewCardInfo(e.currentTarget.id)
//         })
//     }, [])

//     return (<div className='collectionPage'>
//         <h1>Card Collection</h1>
//         <div className='collectedCards'>
    
//         </div>
//     </div>)
// }