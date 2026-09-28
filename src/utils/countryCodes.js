// Country names are stored as free text from the Excel import ("uk", "usa"),
// so they need mapping to ISO 3166-1 alpha-2 codes before a flag can be shown.
const NAME_TO_CODE = {
    uk: 'GB',
    'united kingdom': 'GB',
    'great britain': 'GB',
    england: 'GB',
    scotland: 'GB',
    wales: 'GB',
    us: 'US',
    usa: 'US',
    'united states': 'US',
    'united states of america': 'US',
    uae: 'AE',
    'united arab emirates': 'AE',
    australia: 'AU',
    canada: 'CA',
    'new zealand': 'NZ',
    grenada: 'GD',
    japan: 'JP',
    malaysia: 'MY',
    malta: 'MT',
    vietnam: 'VN',
    'viet nam': 'VN',
    ireland: 'IE',
    germany: 'DE',
    france: 'FR',
    spain: 'ES',
    italy: 'IT',
    netherlands: 'NL',
    switzerland: 'CH',
    singapore: 'SG',
    china: 'CN',
    india: 'IN',
    pakistan: 'PK',
    bangladesh: 'BD',
    'sri lanka': 'LK',
    nepal: 'NP',
    nigeria: 'NG',
    ghana: 'GH',
    kenya: 'KE',
    'south africa': 'ZA',
    'saudi arabia': 'SA',
    qatar: 'QA',
    kuwait: 'KW',
    oman: 'OM',
    bahrain: 'BH',
    turkey: 'TR',
    egypt: 'EG',
    morocco: 'MA',
    brazil: 'BR',
    mexico: 'MX',
    colombia: 'CO',
    peru: 'PE',
    chile: 'CL',
    argentina: 'AR',
    indonesia: 'ID',
    thailand: 'TH',
    philippines: 'PH',
    'south korea': 'KR',
    'korea': 'KR',
    taiwan: 'TW',
    'hong kong': 'HK',
};

/**
 * Resolve a stored country name to an ISO alpha-2 code.
 * Returns null when there is no confident match, so the caller can fall back
 * rather than show the wrong flag.
 */
export const countryCodeFor = (name) => {
    if (!name) return null;
    const key = String(name).trim().toLowerCase();
    if (NAME_TO_CODE[key]) return NAME_TO_CODE[key];
    // A name already stored as a two-letter code, e.g. "gb".
    if (/^[a-z]{2}$/.test(key)) return key.toUpperCase();
    return null;
};

export default countryCodeFor;
