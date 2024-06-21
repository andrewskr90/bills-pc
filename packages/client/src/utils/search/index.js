import BillsPcService from "../../api/bills-pc"
import { escapeApostrophes } from '../string'

export const conditionSearchString = (value) => {
    // created new function for ability to combine 
    // multiple functions in the future
    return escapeApostrophes(value)
}

export const searchForItems = async (searchValue) => {
    let marketSearchResults = []
    const conditionedValue = conditionSearchString(searchValue)
    if (conditionedValue !== '') {
        marketSearchResults = await BillsPcService.getItemsWithValues({ searchValue: conditionedValue })
                .then(res => res.data)
                .catch(err => console.log(err))
    }
    return { data: marketSearchResults }
}