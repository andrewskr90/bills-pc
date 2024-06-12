import React from "react"
import AffiliateLink from "../components/affiliate-link/index.jsx"
import SupportUsTcg from './assets/support-us-tcg.jpg'
import './assets/supportUs.less'

const SupportUs = () => {
    const affiliateLink = 'tcgplayer.pxf.io/vNKjrd?u=https://tcgplayer.com'
    return (<div className='supportUs'>
        <h2>Support Bill's PC</h2>
        <p>Thank you for considering supporting us! As an affiliate of 
            <span>
                <AffiliateLink>TCGplayer</AffiliateLink>
            </span>
            , we recieve commission on purchases made by our referalls.
        </p>
        <AffiliateLink>
            <button>Buy on TCGplayer</button>
        </AffiliateLink>
        <p>Clicking this button starts a shopping session in support of Bill's PC. Thank you!</p>
        <AffiliateLink width='80%'>
            <img href={affiliateLink} target='_blank' src={SupportUsTcg} />
        </AffiliateLink>
    </div>)
}

export default SupportUs
