import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseLocationPathname } from '../../utils/location'
import './assets/previousRoutes.css'
import BillsPcService from '../../api/bills-pc'

const PreviousRoutes = (props) => {
    const { location } = props
    const [prevRoutes, setPrevRoutes] = useState([])
    const navigate = useNavigate()

    const formatPrevMarketRoutes = async (parsedPath) => {
        let dynamicPath = ''
        const routes = []
        for (let i=0; i<parsedPath.length; i++) {
            let cur = parsedPath[i]
            if (cur.toLowerCase() === 'market') {
                dynamicPath += `/${cur.toLowerCase()}`
                routes.push({
                    [cur.toLowerCase()]: {
                        formatted: 'Market',
                        path: dynamicPath
                    }
                })
            } else if (cur.toLowerCase() === 'expansion') {
                if (parsedPath.length > 3) {
                    dynamicPath += `/${cur.toLowerCase()}`
                    i++
                    cur = parsedPath[i]
                    let expansions
                    await BillsPcService.getSetsV2({ params: { set_v2_id: cur } })
                        .then(res => expansions = res.data.expansions)
                        .catch(err => console.log(err))
                    if (expansions.length > 0) {
                        dynamicPath += `/${cur}`
                        routes.push({
                            [cur]: {
                                formatted: expansions[0].set_v2_name,
                                path: dynamicPath
                            }
                        })
                    }
                }
            }
        }
        return routes
    }

    const generatePrevRoutes = async () => {
        const parsedPath = parseLocationPathname(location)
        if (parsedPath[0].toLowerCase() === 'market'){
            return await formatPrevMarketRoutes(parsedPath)
        } else if (location.pathname.includes('/gym-leader/collection/assets')) {
            return [{
                ['assets']: {
                    formatted: 'Assets',
                    path: '/gym-leader/collection/assets'
                }
            }]
        } else if (location.pathname.includes('/gym-leader/vendors')) {
            return [{
                ['vendors']: {
                    formatted: 'Vendors',
                    path: '/gym-leader/vendors'
                }
            }]
        }
    }

    useEffect(() => {
        (async () => {
            const routesToSet = await generatePrevRoutes()
            setPrevRoutes(routesToSet)
        })()
    }, [location])
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
