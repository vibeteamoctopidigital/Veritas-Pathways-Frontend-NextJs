import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { resolveMediaUrl } from '../../config/api';
import { countryCodeFor } from '../../utils/countryCodes';
import { flagAssetFor } from '../../utils/flagAssets';

/**
 * A country's flag.
 *
 * Prefers an uploaded flag image when the record has one, otherwise falls back
 * to a bundled SVG resolved from the country's name, so a flag shows without
 * anyone having to upload one. A stored image whose file no longer exists falls
 * through to the same automatic flag rather than rendering broken.
 */
const CountryFlag = ({ country, className = 'w-8 h-6' }) => {
    const [imageFailed, setImageFailed] = useState(false);

    const uploadedUrl = resolveMediaUrl(country?.flag?.url);
    const autoFlag = flagAssetFor(countryCodeFor(country?.name));

    // A stored image wins, so an admin can override the automatic flag.
    if (uploadedUrl && !imageFailed) {
        return (
            <img
                src={uploadedUrl}
                alt={country?.name ? `${country.name} flag` : 'flag'}
                loading="lazy"
                onError={() => setImageFailed(true)}
                className={`${className} object-cover rounded-sm border border-gray-200`}
            />
        );
    }

    if (autoFlag) {
        return (
            <img
                src={autoFlag}
                alt={country?.name ? `${country.name} flag` : 'flag'}
                title={country?.name}
                loading="lazy"
                className={`${className} object-cover rounded-sm border border-gray-200`}
            />
        );
    }

    return (
        <span
            className={`${className} rounded-sm bg-gray-100 flex items-center justify-center`}
            title={country?.name}
        >
            <Flag className="w-3.5 h-3.5 text-gray-400" />
        </span>
    );
};

export default CountryFlag;
