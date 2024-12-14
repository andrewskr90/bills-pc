export const checkIfFilterIsActive = (filterType, filter, params) => {
    const conditionedFilterType = filterType.toLowerCase()
    const conditionedFilter = filter.toLowerCase()
    if (params[`filter-${conditionedFilterType}`]) {
        return params[`filter-${conditionedFilterType}`].includes(conditionedFilter)
    }
    return false
}

export const countFilters = (filterConfig, params) => {
    let filterCount = 0
    Object.keys(filterConfig).forEach(filterType => {
        filterConfig[filterType].forEach(filter => {
            if (checkIfFilterIsActive(filterType, filter, params)) filterCount += 1
        })
    })
    return filterCount
}