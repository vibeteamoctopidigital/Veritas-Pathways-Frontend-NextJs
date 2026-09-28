import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { resolveMediaUrl } from '../../config/api';

// Initials stand in for a missing logo, e.g. "University Of Leeds" -> "UL".
const initialsOf = (name = '') =>
    name
        .split(/\s+/)
        .filter((word) => !['of', 'the', 'and'].includes(word.toLowerCase()))
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');

/**
 * A university's logo, falling back to its initials.
 *
 * Most universities have no logo uploaded, and some stored logo URLs point at
 * files that are no longer served, so both cases fall back rather than showing
 * a broken image.
 */
const UniversityAvatar = ({ university, className = 'w-11 h-11', textClassName = 'text-sm' }) => {
    const [failed, setFailed] = useState(false);
    const url = resolveMediaUrl(university?.universityLogo?.url);

    if (url && !failed) {
        return (
            <img
                src={url}
                alt={university.name}
                loading="lazy"
                onError={() => setFailed(true)}
                className={`${className} rounded-lg object-contain bg-white border border-gray-200 p-1 shrink-0`}
            />
        );
    }

    const initials = initialsOf(university?.name);

    return (
        <div
            className={`${className} ${textClassName} rounded-lg bg-[#1BA39C]/10 text-[#1BA39C] font-bold flex items-center justify-center shrink-0`}
            aria-label={university?.name}
        >
            {initials || <GraduationCap className="w-1/2 h-1/2" />}
        </div>
    );
};

export default UniversityAvatar;
