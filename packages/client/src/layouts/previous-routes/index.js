import React from 'react'
import { useNavigate } from 'react-router-dom'
import { locationPathnameParsed } from '../../utils/location'
import './assets/previousRoutes.less'

const PreviousRoutes = (props) => {
    const { location, referenceData } = props
    const navigate = useNavigate()

    const formatPrevMarketRoutes = (prevRoutes) => {
        let dynamicPath = ''
        return prevRoutes.filter((route, idx) => idx < prevRoutes.length-1) // remove current route
            .map((route) => {

                if (referenceData.sets.filter(expansion => expansion.set_v2_id === route).length > 0) {
                    dynamicPath += `/${route}`
                    return {
                        [route]: {
                            formatted: referenceData.sets.filter(expansion => expansion.set_v2_id === route)[0].set_v2_name,
                            path: dynamicPath
                        }
                    }
                } else if (route === 'market') {
                    dynamicPath += `/${route}`
                    return { 
                        [route]: {
                            formatted: 'Market',
                            path: dynamicPath
                        } 
                    }
                }
        })
    }

    const generatePrevRoutes = () => {
        const parsedPath = locationPathnameParsed(location)
        if (parsedPath[0] === 'market'){
            return formatPrevMarketRoutes(parsedPath)
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
