import axios from 'axios'

const baseURL = process.env.REACT_APP_BILLS_PC_API_URL

const findSetByPtcgioId = (id) => {
    return axios.get(`${baseURL}/sets/ptcgio/${id}`)
}

const postSetsToSets = (setsArray) => {
    return axios.post(`${baseURL}/sets`, setsArray)
}

const postCardsToCards = (cardsArray) => {
    console.log('post cards', cardsArray)
    return axios.post(`${baseURL}/cards`, cardsArray)
}

export { postSetsToSets, postCardsToCards, findSetByPtcgioId }