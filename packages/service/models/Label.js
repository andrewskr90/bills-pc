const { executeQueries } = require('../db')
const { v4: uuidV4 } = require('uuid')
const { formatSingularComponent } = require('../utils/label')

const getLabelByExactComponents = async (label) => {
    let havingInitiated = false
    const buildHaving = () => {
        return Object.keys(label).map(componentType => {
            // if (label[componentType].length === 0) return ''
            let havingPortion = ''
            if (!havingInitiated) {
                havingInitiated = true
                havingPortion = ' HAVING'
            } else havingPortion = ' AND'
            let formattedComponentType = formatSingularComponent(componentType)
            const sortedIds = label[componentType].sort((a, b) => {
                if (a > b) return 1
                if (a < b) return -1
                return 0
            })
            const idString = sortedIds.map(id => id).join(',')
            havingPortion += ` GROUP_CONCAT(label_component_${formattedComponentType}_id ORDER BY label_component_${formattedComponentType}_id) ${idString ? `= '${idString}'` : 'IS NULL'}`
            return havingPortion
        }).join('')
    }
    let query = `
        SELECT label_component_label_id
        FROM label_components
        GROUP BY label_component_label_id
        ${buildHaving()}
    ;`   
    const req = { queryQueue: [query] }
    const res = {}
    let labels
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        labels = req.results
    })
    return labels   
}

const createLabel = async (label_id, label) => {
    const queryQueue = []
    queryQueue.push(`INSERT INTO labels (label_id) VALUES ('${label_id}');`)
    Object.keys(label).filter(component => label[component].length !== 0).forEach(component => {
        label[component].forEach(id => queryQueue.push(`
            INSERT INTO label_components (label_component_id, label_component_label_id, label_component_${formatSingularComponent(component)}_id) 
                VALUES ('${uuidV4()}', '${label_id}', '${id}');
        `))
    })
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
}

module.exports = { getLabelByExactComponents, createLabel }