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
    if (conditionedValue === '') {
        await BillsPcService.getItemsWithValues()
            .then(res => marketSearchResults = [
                ...marketSearchResults,
                ...res.data
            ])
            .catch(err => console.log(err))

    } else {
        await BillsPcService.getItemsWithValues({ searchValue: conditionedValue })
                .then(res => marketSearchResults = [
                ...marketSearchResults,
                ...res.data
            ])
    }
    return { data: marketSearchResults }
}