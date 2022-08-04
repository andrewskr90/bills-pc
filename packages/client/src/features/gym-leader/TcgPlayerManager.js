import React from 'react'
import axios from 'axios'

const TcgPlayerManager = () => {

    const searchProductNumbers = () => {
        axios.get('https://mpapi.tcgplayer.com/v2/product/272568/details')
            .then(res => {
                console.log(res.data)
            }).catch(err => {
                console.log(err)
            })
    }
    return (<div className='tcgPlayerManager'>
        <p>Search For Pokemon Product Numbers</p>
        <p>Results logged</p>
        <button onClick={searchProductNumbers}>Search</button>
    </div>)
}

export default TcgPlayerManager
