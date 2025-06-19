import React from 'react'

const ToggleRowOrGrid = (props) => {
    const { isGrid, setIsGrid } = props
    return (
        <button className='w-[120px] flex justify-center items-center' onClick={() => setIsGrid(!isGrid)}>
            {isGrid ? (
                <>Row</>
            ) : (
                <>Grid</>
            )}
        </button>
    )
}

export default ToggleRowOrGrid;
