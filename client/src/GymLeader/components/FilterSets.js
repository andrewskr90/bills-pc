import React, { useState } from 'react'

const FilterSets = (props) => {

    const { sets, setFilteredSets } = props
    const [formValues, setFormValues] = useState()

    return (<>
        <div className='filterSets'>
            <h2>Filters</h2>
            <form>
                <input
                    type='text'
                    name='setName'
                    value={formValues.setName}
                />
            </form>
        </div>
    </>)

}

export default FilterSets