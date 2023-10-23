export const parseLocationPathname = (location) => {
    const parsedPath = location.pathname.split('/')
    parsedPath.shift() // remove initial slash in pathname
    if (parsedPath[parsedPath.length-1] === '') parsedPath.pop()
    return parsedPath
}

export const parseLastRouteParameter = (location) => {
    const parsedLocationPathname = parseLocationPathname(location)
    return parsedLocationPathname[parsedLocationPathname.length-1]

}
export const parseSlugAfter = (baseName, location) => {
    const pathname = location.pathname
    const baseNameSplit = pathname.split(baseName)
    if (baseNameSplit.length === 1) return undefined
    return baseNameSplit[1].split('/')[1]
}

export const buildPreviousRoute = (location, optionalNumber) => {
    const parsedLocation = parseLocationPathname(location)
    let routeNumber
    if (optionalNumber) routeNumber = optionalNumber
    else routeNumber = 1
    for (let i=0; i<routeNumber; i++) {
        parsedLocation.pop(-1)
    }
    let previousRoute = '/'
    parsedLocation.forEach(routePiece => {

        previousRoute += `${routePiece}/`
    })
    return previousRoute
}
