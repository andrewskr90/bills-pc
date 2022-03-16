import axios from 'axios'

const baseURL = process.env.REACT_APP_POKEMON_TCG_IO_API_URL

const getSets = async () => {
    return axios.get(`${baseURL}/sets`)
}

const getCardsFromSet = async (setId) => {
    return axios.get(`${baseURL}/cards?q=set.id:${setId}`)
}

export { getSets, getCardsFromSet }