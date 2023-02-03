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
            topTenAverageToday: {
                defaultDirection: 'desc',
                formatted: 'Top 10 Average'
            },
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
    cards: [],
    products: [],
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    shipping: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    saleNote: ''
}
