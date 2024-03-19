import React from 'react'

const AffiliateLink = (props) => {
    const { path, children, width } = props
    let pathString = ''
    let widthString = ''
    if (path) pathString = path
    if (width) widthString += width
    return <a 
            target='_blank' 
            href={`https://tcgplayer.pxf.io/vNKjrd?u=https://tcgplayer.com${pathString}`}
            style={{ width: widthString }}
        >{children}</a>
}

export default AffiliateLink
