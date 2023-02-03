export const locationPathnameParsed = (location) => {
    const parsedPath = location.pathname.split('/')
    parsedPath.shift() // remove initial slash in pathname
    return parsedPath
}

export const buildPreviousRoute = (location) => {
    const parsedLocation = locationPathnameParsed(location)
    parsedLocation.pop(-1)
    let previousRoute = ''
    parsedLocation.forEach(routePiece => {

        previousRoute += `/${routePiece}`
    })
    return previousRoute
}
