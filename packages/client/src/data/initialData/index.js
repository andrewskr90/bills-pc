import { localYYYYMMDD } from "../../utils/date"

export const initialReferenceDataValues = {
    sets: [],
    cards: [],
    expansionFilters: [],
    expansionItemFilters: [],
    products: [],
    rarities: [],
    marketSearchResults: [],
    dateRange: 'week',
    setSort: {
        value: 'release_date',
        direction: 'desc',
        values: {
            name: {
                defaultDirection: 'asc',
                formatted: 'Name'
            },
            // topTenAverageToday: {
            //     defaultDirection: 'desc',
            //     formatted: 'Top 10 Average'
            // },
            release_date: {
                defaultDirection: 'desc',
                formatted: 'Release Date'
            }
        }
    },
    itemSort: {
        value: 'marketValue',
        direction: 'desc',
        values: {
            name: {
                defaultDirection: 'asc',
                formatted: 'Name'
            },
            marketValue: {
                defaultDirection: 'desc',
                formatted: 'Market Value'
            },
            percentChange: {
                defaultDirection: 'desc',
                formatted: 'Percent Change'}
        }
    },
    filter: {
        market: null
    }
}

export const initialSelectedPurchaseCardsValues = [{
    sale_date: '',
    sale_total: 0,
    sale_notes: '',
    sale_vendor: '',
    sale_note_note: ''
}]

export const initialSelectedCollectedCardsValues = {
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

export const initialPurchaseValues = {
    date: localYYYYMMDD(),
    vendor: '',
    items: [],
    subtotal: null,
    discount: null,
    shipping: null,
    taxRate: null,
    taxAmount: null,
    total: null,
    saleNote: ''
}

// export const initialCollectionValues = {
//     userId: '212',
//     cards: [ 
//         {
//             id: '223',
//             productId: '224',
//             expansionId: '225',
//             rarity: 'Rainbow Rare',
//             name: "Pikachu VMAX",
//             tcgPlayerProductId: '226'
//         },
//         {
//             id: '227',
//             productId: '228',
//             expansionId: '229',
//             rarity: 'Gold Card',
//             name: "Mew",
//             tcgPlayerProductId: '220'
//         }
//     ],
//     bulk: {
//         normal: {
//             general: {},
//             commonUncommon: {},
//             rare: {},
//             trainerSpecialEnergy: {},
//             energy: {}
//         },
//         reverseHolo: {
//             general: {},
//             commonUncommon: {},
//             rare: {},
//             trainerSpecialEnergy: {}
//         },
//         holo: {
//             general: {},
//             rare: {},
//             trainerSpecialEnergy: {},
//             ultraRare: {},
//             fullArt: {},
//             fullArtTrainer: {},
//             energy: {}
//         }
//     },
//     products: [
//         {
//             id: '234',
//             productId: '345',
//             expansionId: '456',
//             type: 'Elite Trainer Box',
//             name: "Champion's Path Elite Trainer Box",
//             tcgPlayerProductId: '567'
//         },
//         {
//             id: '678',
//             productId: '789',
//             expansionId: '890',
//             type: 'Ultra Premium Collection Box',
//             name: "Celebrations Ultra Premium Collection Box",
//             tcgPlayerProductId: '901'
//         }
//     ]
// }

// 'bulk'
// 'bulk_id', 'bulk_normal_general', 'bulk_normal_common_uncommon'

// 'bulk_sortings'
// 'bulk_sorting_id', 