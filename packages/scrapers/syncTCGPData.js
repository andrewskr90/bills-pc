import dotenv from 'dotenv'
import axios from 'axios'
import { getSetsBillsPc, loginBillsPc, postSetsBillsPc } from './api/index.js'
dotenv.config()

const categoryId = 3 // pokemon
const tcgpapiConfig = {
    baseURL: 'https://api.tcgplayer.com',
    headers: {
        Accept: 'application/json',
        Authorization: `bearer ${process.env.TCGP_BEARER_TOKEN}`
    }
}
const buildTCGPReferenceData = async () => {
    const languages = await axios(`/catalog/categories/${categoryId}/languages`, tcgpapiConfig)
    const printings = await axios(`/catalog/categories/${categoryId}/printings`, tcgpapiConfig)
    const conditions = await axios(`/catalog/categories/${categoryId}/conditions`, tcgpapiConfig)
    const referenceData = { languages: {}, printings: {}, conditions: {} }   
    languages.data.results.forEach(l => referenceData.languages[l.languageId] = { name: l.name, abbr: l.abbr })
    printings.data.results.forEach(p => referenceData.printings[p.printingId] = { name: p.name, displayOrder: p.displayOrder })
    conditions.data.results.forEach(c => referenceData.conditions[c.conditionId] = { name: c.name, displayOrder: c.displayOrder, abbr: c.abbreviation })
    return referenceData
}

const main = async () => {
    const tcgpReferenceData = await buildTCGPReferenceData()
    console.log(tcgpReferenceData)


    // const cookies = await loginBillsPc()
    // const setsV2 = await getSetsBillsPc(cookies)
    // const bpcLib = {}
    // for (let i=0; i<setsV2.length; i++) {
    //     const bpcSet = setsV2[i]
    //     bpcLib[bpcSet.set_v2_name] = 1
    // }
    // // const tcgpReferenceData = await buildTCGPReferenceData()
    // let pagination = true
    // let offset = 0
    // const newSets = []
    // while (pagination) {
    //     try {
    //         const groupsRes = await axios.get(`/catalog/categories/${categoryId}/groups?offset=${offset}`, tcgpapiConfig)
    //         const groups = groupsRes.data.results
    //         if (groups.length === 0) pagination = false
    //         else {
    //             for (let i=0; i<groups.length; i++) {
    //                 const group = groups[i]
    //                 if (!bpcLib[group.name]) {
    //                     newSets.push({ set_v2_name: group.name })
    //                 }
    //             }
    //             offset += 10
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         pagination = false
    //     }
    // }
    // try {
    //     console.log(newSets)
    //     // const addedSets = await postSetsBillsPc(cookies, newSets)
    // } catch (err) {
    //     console.log(err)
    // }
    // // initial sync
    // // get all sets from tcgp, pair them with bpc set names
    // // update sets_v2 with tcgp set id

    // // upkeep sync

    
}
main()

// cards_v2
// TCGPItemI