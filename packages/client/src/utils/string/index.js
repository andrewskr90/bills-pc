export const capitalizeWords = (string) => {
    const wordsSeperated = string.split(' ')
    return wordsSeperated.map(word => {
        const lettersSeperated = word.split('').map((letter, idx) => {
            if (idx === 0) return letter.toUpperCase()
            else return letter.toLowerCase()
        })
        return lettersSeperated.join('')
    }).join(' ')
}