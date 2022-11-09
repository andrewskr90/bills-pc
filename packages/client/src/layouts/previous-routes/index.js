import React from 'react'
import { useNavigate } from 'react-router-dom'
import './assets/previousRoutes.less'

const PreviousRoutes = (props) => {
    const { location, referenceData } = props
    const navigate = useNavigate()
    const formatPrevMarketRoutes = (prevRoutes) => {
        return prevRoutes.filter((route, idx) => idx < prevRoutes.length-1)
            .map((route) => {
                return { 
                    [route]: {
                        formatted: 'Market',
                        path: `/${route}`
                    } 
                }
        })
    }

    const generatePrevRoutes = () => {
        const prevRoutes = location.pathname.split('/')
        prevRoutes.shift() // remove initial slash in pathname
        if (prevRoutes[0] === 'market'){
            return formatPrevMarketRoutes(prevRoutes)
        }
    }

    return (<div className='previousRoutes'>
        {generatePrevRoutes().map(route => {
            return <div className='prevRoute' onClick={() => navigate(route[Object.keys(route)[0]].path)}>
                {`< ${route[Object.keys(route)[0]].formatted}`}
            </div>
        })}
    </div>)
}

export default PreviousRoutes
