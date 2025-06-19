import BillsPcService from "../../api/bills-pc"
import { escapeApostrophes } from '../string'

export const conditionSearchString = (value) => {
    // created new function for ability to combine 
    // multiple functions in the future
    return escapeApostrophes(value)
}

export const searchForItems = async (unconditionedSearchValue, params) => {
    let marketSearchResults = { items: [] }
    params.searchvalue = conditionSearchString(unconditionedSearchValue)
    if (params.searchvalue) {
        marketSearchResults = await BillsPcService.getItems({ params })
                .then(res => res.data)
                .catch(err => console.log(err))
    }
    return { 
        data: marketSearchResults
    }
}