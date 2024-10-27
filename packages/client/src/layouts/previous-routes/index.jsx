import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseLocationPathname } from '../../utils/location'
import './assets/previousRoutes.css'
import BillsPcService from '../../api/bills-pc'

const PreviousRoutes = (props) => {
    const { location, referenceData } = props
    const [prevRoutes, setPrevRoutes] = useState([])
    const navigate = useNavigate()

    const formatPrevMarketRoutes = async (prevRoutes) => {
        let dynamicPath = ''
        const filteredRoutes = prevRoutes.filter((route, idx) => idx < prevRoutes.length-1) // remove current route
        const routes = []
        for (let i=0; i<filteredRoutes.length; i++) {
            if (filteredRoutes[i].toLowerCase() === 'market') {
                dynamicPath += `/${filteredRoutes[i].toLowerCase()}`
                routes.push({
                    [filteredRoutes[i].toLowerCase()]: {
                        formatted: 'Market',
                        path: dynamicPath
                    }
                })
            } else if (filteredRoutes[i].toLowerCase() === 'expansion') {
                dynamicPath += `/${filteredRoutes[i].toLowerCase()}`
                i++
                let expansions
                await BillsPcService.getSetsV2({ params: { set_v2_id: filteredRoutes[i] } })
                    .then(res => expansions = res.data)
                    .catch(err => console.log(err))
                if (expansions.length > 0) {
                    dynamicPath += `/${filteredRoutes[i]}`
                    routes.push({
                        [filteredRoutes[i]]: {
                            formatted: expansions[0].set_v2_name,
                            path: dynamicPath
                        }
                    })
                }
            }
        }
        return routes
    }

    const generatePrevRoutes = async () => {
        const parsedPath = parseLocationPathname(location)
        if (parsedPath[0].toLowerCase() === 'market'){
            return await formatPrevMarketRoutes(parsedPath)
        }
    }

    useEffect(() => {
        (async () => {
            const routesToSet = await generatePrevRoutes()
            setPrevRoutes(routesToSet)
        })()
    }, [])
    return (<div className='previousRoutes'>
        {prevRoutes.length > 0 ? <>
            {prevRoutes.map((route, idx) => {
                return <div key={idx} className='prevRoute' onClick={() => navigate(route[Object.keys(route)[0]].path)}>
                    {`< ${route[Object.keys(route)[0]].formatted}`}
                </div>
            })}
        </> : <>...loading</>}
    </div>)
}

export default PreviousRoutes
