import React from 'react'
import { Route, Routes, useNavigate } from "react-router-dom"
import PlusButton from '../../../../components/buttons/plus-button'
import ImportListing from './ImportListing'

const Watching = (props) => {
    const { watchingToAdd, setWatchingToAdd, referenceData, setReferenceData } = props
    const navigate = useNavigate()
    return (
        <Routes>
            <Route 
                path='/'
                element={
                    <>  
                        <div style={{ width: 'full', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <p>Import External Listing</p>
                            <PlusButton handleClick={() => navigate('import')} />
                        </div>
                        <div>
                            {watchingToAdd.map(item => {
                                // watched item is ultimately a listing item or lot
                                console.log(item)
                                return <p>{item.name}</p>
                            })}
                        </div>
                    </>
                }
            />
            <Route 
                path="/import/*"
                element={<ImportListing 
                    watchingToAdd={watchingToAdd} 
                    setWatchingToAdd={setWatchingToAdd}
                    referenceData={referenceData} 
                    setReferenceData={setReferenceData} 
                />}
            />
        </Routes>
    )
}

export default Watching
