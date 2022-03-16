import { findSetByPtcgioId } from '../../../api/bills-pc'

const formatCardsArray = async (cardsArray) => {
    let setId
    if (cardsArray.length > 0) {
        await findSetByPtcgioId(cardsArray[0].set.id)
            .then(res => {
                setId = res.data[0].set_id
            })
            .catch(err => console.log(err))
    }

    let nationalDexNumbersValue
    let regulationMarkValue
    let flavorTextValue
    let rulesValue

    const formattedCards = cardsArray.map(card => {

        if (card.nationalPokedexNumbers) {
            let nationalDexNumbersString = ''
            card.nationalPokedexNumbers.forEach(number => {
                let numString = number.toString()
                nationalDexNumbersString += numString + ','
            })
            let removeLastComma = nationalDexNumbersString.slice(0,-1)
            nationalDexNumbersValue = removeLastComma
        } else {
            nationalDexNumbersValue = null
        }

        if (card.regulationMark) {
            regulationMarkValue = card.regulationMark
        } else {
            regulationMarkValue = null
        }

        if (card.flavorText) {
            flavorTextValue = card.flavorText
        } else {
            flavorTextValue = null
        }

        if (card.rules) {
            rulesValue = ''
            for (let i=1; i<=card.rules.length; i++) {
                rulesValue += `${i}:${card.rules[i-1]}`
            }
        } else {
            rulesValue = null
        }

        const formattedCard = {
            card_set_id: setId,
            card_name: card.name,
            card_number: card.number,
            card_image_small: card.images.small,
            card_image_large: card.images.large,
            card_rarity: null,
            card_rarity_type: card.rarity,
            card_national_pokedex_numbers: nationalDexNumbersValue,
            card_regulation_mark: regulationMarkValue,
            card_flavor_text: flavorTextValue,
            card_rules: rulesValue,
            card_artist: card.artist
        }

        return formattedCard
    })
    
    return formattedCards
}

const formatSetsArray = (setsArray) => {
    const visitedSets = {}
    let setName
    const formattedSets = setsArray.map(set => {
        if (!(set.name in visitedSets)) {
            visitedSets[set.name] = 1 
            setName = set.name
        } else {
            setName = set.name += '2'
        }
        let secretCount = set.total - set.printedTotal
        const formattedSet = {
            set_pokemon_tcg_io_id: set.id,
            set_name: setName,
            set_release_date: set.releaseDate,
            set_language: 'english',
            set_number: null,
            set_normal_card_count: set.printedTotal,
            set_secret_card_count: secretCount,
            set_image: set.images.logo,
            set_symbol: set.images.symbol,
            set_ptcgo_code: set.ptcgoCode,
            set_series: set.series
        }
        return formattedSet
    })
    return formattedSets
}

export { formatCardsArray, formatSetsArray }
