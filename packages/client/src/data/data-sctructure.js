const userObject = {
    id: '',
    name: '',
    role: '',
    favorite_gen: 1,
    email: '',
    created_date: '',
    collected_cards: [
        {
            id: '',
            card_id: '',
            notes: [
                {
                    id: '',
                    note: ''
                }
            ]
        }
    ],
    collected_products: [
        {
            id: '',
            product_id: '',
            notes: [
                {
                    id: '',
                    note: ''
                }
            ]
        }
    ],
    sales: [
        {
            id: '',
            date: '',
            vendor: '',
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax_amount: 0,
            tax_rate: 0,
            total: 0,
            cards: [
                {
                    id: '',
                    collected_card_id: '',
                    price: 0
                }
            ],
            products: [
                {
                    id: '',
                    collected_product_id: '',
                    price: 0
                }
            ],
            notes: [
                {
                    id: '',
                    note: ''
                }
            ]     
        }
    ],
    purchases: [
        {
            id: '',
            date: '',
            vendor: '',
            subtotal: 0,
            discount: 0,
            shipping: 0,
            tax_amount: 0,
            tax_rate: 0,
            total: 0,
            cards: [
                {
                    id: '',
                    collected_card_id: '',
                    price: 0
                }
            ],
            products: [
                {
                    id: '',
                    collected_product_id: '',
                    price: 0
                }
            ],
            notes: [
                {
                    id: '',
                    note: ''
                }
            ]     
        }
    ]
}

const marketData = {
    sets: [
        {
            id: '',
            name: '',
            cards: [
                {
                    id: '',
                    name: '',
                    number: '',
                    rarity: '',
                    foil_only: '',
                    market_prices: []
                }
            ],
            products: [
                {
                    id: '',
                    name: '',
                    release_date: '',
                    description: '',
                    market_prices: []
                }
            ]
        }
    ]
}
