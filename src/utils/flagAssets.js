// Flag SVGs are vendored into src/assets/flags rather than imported from the
// country-flag-icons package: that package's exports map only exposes bundles
// containing all ~250 flags, which added 256 KB to the JS bundle. These are the
// ones the site actually needs, at ~800 bytes each.
//
// Source: country-flag-icons (MIT, (c) 2020 @catamphetamine).
// Add a country here when one is added to the database.
import AE from '../assets/flags/AE.svg';
import AU from '../assets/flags/AU.svg';
import BD from '../assets/flags/BD.svg';
import CA from '../assets/flags/CA.svg';
import CN from '../assets/flags/CN.svg';
import DE from '../assets/flags/DE.svg';
import EG from '../assets/flags/EG.svg';
import ES from '../assets/flags/ES.svg';
import FR from '../assets/flags/FR.svg';
import GB from '../assets/flags/GB.svg';
import GD from '../assets/flags/GD.svg';
import GH from '../assets/flags/GH.svg';
import HK from '../assets/flags/HK.svg';
import ID from '../assets/flags/ID.svg';
import IE from '../assets/flags/IE.svg';
import IN from '../assets/flags/IN.svg';
import IT from '../assets/flags/IT.svg';
import JP from '../assets/flags/JP.svg';
import KE from '../assets/flags/KE.svg';
import KR from '../assets/flags/KR.svg';
import LK from '../assets/flags/LK.svg';
import MT from '../assets/flags/MT.svg';
import MX from '../assets/flags/MX.svg';
import MY from '../assets/flags/MY.svg';
import NG from '../assets/flags/NG.svg';
import NL from '../assets/flags/NL.svg';
import NP from '../assets/flags/NP.svg';
import NZ from '../assets/flags/NZ.svg';
import PH from '../assets/flags/PH.svg';
import PK from '../assets/flags/PK.svg';
import QA from '../assets/flags/QA.svg';
import SA from '../assets/flags/SA.svg';
import SG from '../assets/flags/SG.svg';
import TH from '../assets/flags/TH.svg';
import TR from '../assets/flags/TR.svg';
import US from '../assets/flags/US.svg';
import VN from '../assets/flags/VN.svg';
import ZA from '../assets/flags/ZA.svg';

const FLAGS = {
    AE, AU, BD, CA, CN, DE, EG, ES, FR, GB, GD, GH, HK, ID, IE, IN, IT, JP,
    KE, KR, LK, MT, MX, MY, NG, NL, NP, NZ, PH, PK, QA, SA, SG, TH, TR, US,
    VN, ZA,
};

// Next.js imports images as { src, width, height } objects; callers use the URL.
export const flagAssetFor = (code) => {
    const flag = code ? FLAGS[code] : null;
    return flag ? flag.src ?? flag : null;
};

export default flagAssetFor;
