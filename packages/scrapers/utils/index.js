import { getConditionsBillsPc, getLanguagesBillsPc, getPrintingsBillsPc } from '../api/index.js'
import TCGPAPI from '../api/tcgp.js'

export const buildTCGPReferenceData = async (cookies, apiToken, curCategoryid) => {
    const tcgp_languages = await TCGPAPI.languages(apiToken, curCategoryid)
    const tcgp_printings = await TCGPAPI.printings(apiToken, curCategoryid)
    const tcgp_conditions = await TCGPAPI.conditions(apiToken, curCategoryid)
    const bpc_languages = await getLanguagesBillsPc(cookies)  
    const bpc_printings = await getPrintingsBillsPc(cookies)  
    const bpc_conditions = await getConditionsBillsPc(cookies)  
    const referenceData = {
        tcgp: { languages: {}, printings: {}, conditions: {} },
        bpc: { languages: {}, printings: {}, conditions: {} }
    } 
    tcgp_languages.forEach(l => {
        referenceData.tcgp.languages[l.languageId] = { 
            bpcId: bpc_languages.find(bpc_l => bpc_l.tcgpId === l.languageId).id,
            ...l 
        }
    })
    tcgp_printings.forEach(p => {
        referenceData.tcgp.printings[p.printingId] = { 
            bpcId: bpc_printings.find(bpc_p => {
                if (bpc_p.printing_tcgp_printing_id === p.printingId) return true
                // TODO update printings to include japanese tcgp ids. Automate printing updates in bpc db
                // if (bpc_p.printing_tcgp_printing_id === p.printingId) return true
                if (bpc_p.printing_name === p.name) return true
            }).printing_id,
            ...p
        }
    })
    tcgp_conditions.forEach(c => {
        referenceData.tcgp.conditions[c.conditionId] = { 
            bpcId: bpc_conditions.find(bpc_c => bpc_c.condition_tcgp_condition_id === c.conditionId).condition_id,
            ...c
        }
    })
    bpc_languages.forEach(x => referenceData.bpc.languages[x.id] = { ...x })
    bpc_printings.forEach(x => referenceData.bpc.printings[x.printing_id] = { ...x })
    bpc_conditions.forEach(x => referenceData.bpc.conditions[x.condition_id] = { ...x })
    return referenceData
}

export const intArraysMatch = (array1, array2) => {
    const array1Sorted = array1.sort()
    const array2Sorted = array2.sort()
    if (array1Sorted.length !== array2Sorted.length) return false
    let matching = true
    for (let i=0; i< array1Sorted.length; i++) {
        if (array1[i] !== array2[i]) {
            matching = false
            break
        }
    }
    return matching
}