import React, { useState } from "react";

const InputSelect = (props) => {
    const { handleSelect, handleCreateNew, items, searchKey, createNewText } = props
    const [searchInput, setSearchInput] = useState("")
    return (
        <div style={{ width: '200px' }}>
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            {searchInput ? (
                <div style={{ width: '100%' }}>
                    {!items.find(item => item[searchKey].toLowerCase() === searchInput.toLocaleLowerCase()) ? (<button style={{ width: '100%' }} onClick={() => handleCreateNew(searchInput)}>{createNewText}</button>) : (<></>)}
                    {items.filter(item => item[searchKey].includes(searchInput.toLowerCase()))
                        .map((item, idx) => <button key={idx} style={{ width: '100%' }} onClick={() => handleSelect(item)}>{item[searchKey]}</button>)}
                </div>
            ) : (<></>)}
        </div>
    )
}

export default InputSelect;
