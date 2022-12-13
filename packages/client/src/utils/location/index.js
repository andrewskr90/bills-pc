export const locationPathnameParsed = (location) => {
    const parsedPath = location.pathname.split('/')
    parsedPath.shift() // remove initial slash in pathname
    return parsedPath
}