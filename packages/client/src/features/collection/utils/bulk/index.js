export const compileBulkLabels = (labels) => {
    return labels.map(label => {
        const rarityComponents = []
        const typeComponents = []
        const printingComponents = []
        const expansionComponents = []

        label.components.forEach(component => {
            const { rarity_name, type_name, printing_name, set_v2_name } = component
            if (rarity_name) rarityComponents.push(rarity_name)
            if (type_name) typeComponents.push(type_name)
            if (printing_name) printingComponents.push(printing_name)
            if (set_v2_name) expansionComponents.push(set_v2_name)
        })
        let labelString = ''
        if (expansionComponents.length > 0) {
            labelString += `${expansionComponents.join('/')}`
        }
        if (printingComponents.length > 0) {
            if (labelString) labelString += `, ${printingComponents.join('/')}`
            else labelString += `${printingComponents.join('/')}`
        }            
        if (rarityComponents.length > 0) {
            if (labelString) labelString += `, ${rarityComponents.join('/')}`
            else labelString += `${rarityComponents.join('/')}`
        }
        if (typeComponents.length > 0) {
            if (labelString) labelString += `, ${typeComponents.join('/')}`
            else labelString += `${typeComponents.join('/')}`
        }
        return labelString
    }).join(' OR ')
}