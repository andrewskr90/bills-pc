import React from 'react'

const FilterSets = (props) => {

    const { ptcgioSets, 
            setFilteredSets, 
            filterFormValues, 
            setFilterFormValues } = props

    const updateValuesAndFilter = (e) => {
        setFilterFormValues({
            ...filterFormValues,
            setSubstring: e.target.value
        })

        const searchFor = e.target.value.toLowerCase()

        //reset filteredSets to ptcgioSets if user clears filter field
        if (searchFor === '') {
            setFilteredSets(ptcgioSets)
            return
        }

        const filteredptcgioSets = ptcgioSets.filter(set => {
            const setName = set.name.toLowerCase()
            let j = 0
            let searchForSubstring = searchFor[j]
            let searchedSubstring = ''
    
            for (let i=0; i<setName.length; i++) {
                searchedSubstring += setName[i]
                if (searchedSubstring === searchForSubstring) {
                    if (j === searchFor.length -1) {
                        return set
                    }
                    j++
                    searchForSubstring += searchFor[j]
                } else {
                    searchedSubstring = ''
                    j = 0
                    searchForSubstring = searchFor[j]
                }
            }
        })
        setFilteredSets(filteredptcgioSets)
    }

    return (<>
        <div className='filterSets'>
            <p>Filters</p>
            <form>
                <label>Set Name</label>
                <input
                    type='text'
                    name='setSubstring'
                    value={filterFormValues.setSubstring}
                    onChange={updateValuesAndFilter}
                />
            </form>
        </div>
    </>)

}

export default FilterSets