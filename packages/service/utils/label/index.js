const formatSingularComponent = (componentType) => {
    if (componentType === 'rarities') return 'rarity'
    if (componentType === 'expansions') return 'set_v2'
    else return componentType.split('s').slice(0, componentType.length-1).filter(s => s).join('s')
}

module.exports = { formatSingularComponent }