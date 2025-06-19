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
            havingPortion += ` GROUP_CONCAT(${formattedComponentType}Id ORDER BY ${formattedComponentType}Id) ${idString ? `= '${idString}'` : 'IS NULL'}`
            return havingPortion
        }).join('')
    }
    let query = `
        SELECT labelId
        FROM V3_LabelComponent
        GROUP BY labelId
        ${buildHaving()}
    ;`   
    const req = { queryQueue: [{ query, variables: [] }] }
    const res = {}
    let labels
    await executeQueries(req, res, (err) => {
        if (err) throw new Error(err)
        labels = req.results
    })
    req.queryQueue = []
    return labels   
}

const createLabel = async (labelId, label) => {
    const queryQueue = []
    queryQueue.push({ query: `INSERT INTO V3_Label (id) VALUES (?);`, variables: [labelId] })
    Object.keys(label).filter(component => label[component].length !== 0).forEach(component => {
        label[component].forEach(componentId => queryQueue.push({
            query: `INSERT INTO V3_LabelComponent (id, labelId, ${formatSingularComponent(component)}Id) 
                VALUES ('${uuidV4()}', ?, ?);`,
            variables: [labelId, componentId]
        }))
    })
    const req = { queryQueue }
    const res = {}
    await executeQueries(req, res, (err) => {
        if (err) throw err
    })
}

module.exports = { getLabelByExactComponents, createLabel }