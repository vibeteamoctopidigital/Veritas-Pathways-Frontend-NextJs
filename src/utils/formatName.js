// Country and university names are stored lowercase (they come from the Excel
// import, which normalises them). CSS `capitalize` therefore renders "uk" as
// "Uk" rather than "UK", so acronyms need handling in JS instead.
const ACRONYMS = new Set(['uk', 'usa', 'us', 'uae', 'eu', 'nz']);

const capitalizeWord = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

/**
 * Title-case a name, keeping known country acronyms fully uppercase.
 * "uk" -> "UK", "usa" -> "USA", "new zealand" -> "New Zealand".
 */
export const formatCountryName = (name) => {
    if (!name) return '';

    return String(name)
        .trim()
        .split(/\s+/)
        .map((word) =>
            ACRONYMS.has(word.toLowerCase()) ? word.toUpperCase() : capitalizeWord(word),
        )
        .join(' ');
};

export default formatCountryName;
