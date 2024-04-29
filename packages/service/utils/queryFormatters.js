const QueryFormatters = {
    //takes in array of objects to be inserted
    //into sql table
    objectsToInsert(objectsArray, tableName) {
        const keys = Object.keys(objectsArray[0])
        let query = `INSERT INTO ${tableName} `
        let columns = "("
        keys.sort()
        keys.forEach((key, i) => {
            if (i !== keys.length -1) {
                columns += `${key}, `
            } else {
                columns += `${key})`
            }
        })
        query += `${columns} VALUES `
        //all values enclosed in double quotes, individual value in single
        let valuesString = ""
        objectsArray.forEach((obj, i) => {
            let values = "("
            keys.forEach((key, j) => {      
                let value
                if (obj[key] === null) {
                    value = null
                } else if (obj[key] === undefined) {
                    value = null
                }else if (typeof obj[key] === 'string') {
                    //remove accents
                    let accentsRemoved = obj[key].normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    //escape apostrophes
                    let escapedApostrophe = accentsRemoved.replace(/'/g, "''")
                    value = `'${escapedApostrophe}'`
                } else if (typeof obj[key] === 'number') {
                    value = obj[key]
                } else if (typeof obj[key] === 'boolean') {
                    if (obj[key]) {
                        value = 1
                    } else {
                        value = 0
                    }
                }                 
                if (j !== keys.length -1) {
                    values += `${value}, `
                } else {
                    if (i !== objectsArray.length -1) {
                        values += `${value}), `
                    } else {
                        values += `${value})`
                    }
                    valuesString += values
                }
            })
        })
        query += `${valuesString}`
        return query
    },

    seperateColumnsValues(object) {
        //takes in a single object of keys and STRINGS,
        //concatinates the keys and values to be used as
        //columns and values in sql query
        const concatinated = {}
        concatinated.columns = ''
        concatinated.values = ''
        const keys = Object.keys(object)
    
        keys.forEach((key, index) => {
            if (index === keys.length -1) {
                concatinated.columns += `${key}`
                concatinated.values += `'${object[key]}'`
            } else {
                concatinated.columns += `${key}, `
                concatinated.values += `'${object[key]}', `
            }
        })
        return concatinated
    },
    
    filterConcatinated(filter) {
        let filterStringified = ''
        const keys = Object.keys(filter)
        keys.forEach((key, index) => {
            let value = filter[key]
            if (value.includes("'")) value = value.split("'").join("''")
            if (index === keys.length -1) {
                filterStringified += `${key}='${value}'`
            } else {
                filterStringified += `${key}='${value}' AND `
            }
        })
        return filterStringified
    },

    formatSetStatement(object) {
        let stringForSetStatement = ''
        const keys = Object.keys(object)
        keys.forEach((key, index) => {
            let value
            if (object[key] === null) value = null
            else if (typeof object[key] ==='string') {
                //remove accents
                let accentsRemoved = object[key].normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                //escape apostrophes
                let escapedApostrophe = accentsRemoved.replace(/'/g, "''")
                value = `'${escapedApostrophe}'`
            } else {
                value = object[key]
            }
            if (index === keys.length -1) {
                stringForSetStatement += `${key}=${value}`
            } else {
                stringForSetStatement += `${key}=${value} , `
            }
        })
        return stringForSetStatement
    },

    searchValueToWhereLike(searchValue, nameColumn) {
        const splitSearchValues = searchValue.split(' ')
        let whereAnd = ''
        splitSearchValues.forEach((value, idx) => {
            let lowerCaseValue = value.toLowerCase()
            if (idx === 0) {
                whereAnd += ` WHERE ${nameColumn} LIKE '%${lowerCaseValue}%'`
            } else {
                whereAnd += ` AND ${nameColumn} LIKE '%${lowerCaseValue}%'`
            }
        })
        return whereAnd
    }
}


module.exports = QueryFormatters
