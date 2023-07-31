export const formatLabel = (label, bulkReferenceData) => {
    let formattedLabel = ''
    Object.keys(label).forEach(key => {
        const labelComponents = label[key]
        let idKey
        let nameKey
        if (key === 'rarities') {
            idKey = 'rarity_id'
            nameKey = 'rarity_name'
        }
        if (key === 'types') {
            idKey = 'type_id'
            nameKey = 'type_name'
        }
        if (key === 'printings') {
            idKey = 'printing_id'
            nameKey = 'printing_name'
        }
        if (key === 'expansions') {
            idKey = 'set_v2_id'
            nameKey = 'set_v2_name'
        }

        labelComponents.filter(componentId => componentId !== null).forEach((componentId, idx) => {
            const component = bulkReferenceData[key].find(component => {
                return component[idKey] === componentId
            })
            if (idx === 0) formattedLabel += component[nameKey]
            else formattedLabel += `/${component[nameKey]}`
        })
        if (labelComponents.length > 1) formattedLabel += ', '
    })
    const splitByComma = formattedLabel.split(', ')
    splitByComma.pop(-1)
    return splitByComma.join(', ')
}