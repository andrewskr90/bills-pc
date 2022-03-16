import React, { useState } from 'react'

const FilterSets = (props) => {

    const { initialSets, 
            setFilteredSets, 
            filterFormValues, 
            setFilterFormValues,
            setSetsToPost } = props

    const updateValuesAndFilter = (e) => {
        setFilterFormValues({
            ...filterFormValues,
            setSubstring: e.target.value
        })

        const searchFor = e.target.value.toLowerCase()

        //reset filteredSets to initialSets if user clears filter field
        if (searchFor === '') {
            setFilteredSets(initialSets)
            return
        }

        const filteredInitialSets = initialSets.filter(set => {
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
        setFilteredSets(filteredInitialSets)
        setSetsToPost(filteredInitialSets)
    }

    return (<>
        <div className='filterSets'>
            <h2>Filters</h2>
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