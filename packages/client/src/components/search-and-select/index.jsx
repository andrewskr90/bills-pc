import React from 'react'

const SearchAndSelect = (props) => {
    const { 
        selected,
        value,
        handleChange,
        searched,
        displayKey,
        handleSelect,
        label,
        handleCreateNew,
        createNewText
    } = props
    return (<>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
            {label}
            {selected ? (
                <p>{selected[displayKey]}</p>
                ) : (
                <>
                    <input value={value} onChange={handleChange} />
                    {value ? (
                        <div style={{ width: '100%' }}>
                            {!searched.find(item => item[displayKey].toLowerCase() === value.toLocaleLowerCase()) ? (<button style={{ width: '100%' }} onClick={() => handleCreateNew(value)}>{createNewText}</button>) : (<></>)}
                            {searched.filter(item => item[displayKey].includes(value.toLowerCase()))
                                .map((item, idx) => <button key={idx} style={{ width: '100%' }} onClick={() => handleSelect(item)}>{item[displayKey]}</button>)}
                        </div>
                    ) : (<></>)}
                </>
            )}
        </label>
    </>)
}

export default SearchAndSelect
