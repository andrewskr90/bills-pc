import BillsPcService from "../../api/bills-pc"
import { escapeApostrophes } from '../string'

export const conditionSearchString = (value) => {
    // created new function for ability to combine 
    // multiple functions in the future
    return escapeApostrophes(value)
}

export const searchForItems = async (category, searchValue) => {
    let marketSearchResults = []
    const conditionedValue = conditionSearchString(searchValue)
    if (category === 'all' || category === 'cards') {
        if (conditionedValue === '') {
            await BillsPcService.getCardsV2WithValues()
                .then(res => marketSearchResults = [
                    ...marketSearchResults,
                    ...res.data
                ])
                .catch(err => console.log(err))

        } else {
            await BillsPcService.getCardsV2WithValues({ searchValue: conditionedValue })
                    .then(res => marketSearchResults = [
                    ...marketSearchResults,
                    ...res.data
                ])
        }
    } if (category === 'all' || category === 'products') {
        if (conditionedValue === '') {
            await BillsPcService.getProductsWithValues()
                .then(res => marketSearchResults = [
                    ...marketSearchResults,
                    ...res.data
                ])
                .catch(err => console.log(err))

        } else {
            await BillsPcService.getProductsWithValues({ searchValue: conditionedValue })
                    .then(res => marketSearchResults = [
                    ...marketSearchResults,
                    ...res.data
                ])
                    .catch(err => console.log(err))
        }
    }
    return { data: marketSearchResults }
}