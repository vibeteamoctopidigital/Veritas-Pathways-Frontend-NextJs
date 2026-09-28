// The ten featured partner logos shown on the live page, downloaded so the page
// does not hotlink veritaspathways.co.uk.
import birmingham from '../../assets/ify/universities/birmingham.png';
import leeds from '../../assets/ify/universities/leeds.jpg';
import cardiff from '../../assets/ify/universities/cardiff.png';
import sussex from '../../assets/ify/universities/sussex.jpg';
import newcastle from '../../assets/ify/universities/newcastle.png';
import auckland from '../../assets/ify/universities/auckland.png';
import unsw from '../../assets/ify/universities/unsw.jpg';
import ottawa from '../../assets/ify/universities/ottawa.png';
import queenMary from '../../assets/ify/universities/queen-mary.png';
import manchester from '../../assets/ify/universities/manchester.png';

import asic from '../../assets/ify/accreditations/asic.png';
import ncuk from '../../assets/ify/accreditations/ncuk.png';
import othm from '../../assets/ify/accreditations/othm.webp';
import languagecert from '../../assets/ify/accreditations/languagecert.jpeg';
import ifg from '../../assets/ify/accreditations/ifg.png';
import cla from '../../assets/ify/accreditations/logo-print.png';
import ico from '../../assets/ify/accreditations/ico.png';

export const partnerLogos = [
    { name: 'University of Birmingham', image: birmingham },
    { name: 'University of Leeds', image: leeds },
    { name: 'Cardiff University', image: cardiff },
    { name: 'University of Sussex', image: sussex },
    { name: 'Newcastle University', image: newcastle },
    { name: 'University of Auckland', image: auckland },
    { name: 'UNSW Sydney', image: unsw },
    { name: 'University of Ottawa', image: ottawa },
    { name: 'Queen Mary University of London', image: queenMary },
    { name: 'University of Manchester', image: manchester },
];

// Same logos, in the same order, as the "Our accreditations" row on
// https://veritaspathways.co.uk/international-foundation-year/.
export const accreditationLogos = [
    { name: 'ASIC Accredited 2025-26', image: asic },
    { name: 'NCUK', image: ncuk },
    { name: 'International Foundation Group', image: ifg },
    { name: 'OTHM Qualifications', image: othm },
    { name: 'LanguageCert', image: languagecert },
    { name: 'CLA', image: cla },
    { name: "ICO, Information Commissioner's Office", image: ico },
];

export default partnerLogos;
