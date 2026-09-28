/**
 * Field formats for every form, mirroring the backend's
 * src/app/utils/validationPatterns.ts (change both together). The backend is
 * the real check; these give people the message before they submit.
 *
 * Each rule returns an error message, or null when the value is fine. Empty
 * optional values are always fine.
 */

export const PATTERNS = {
    personName: /^[\p{L}][\p{L}\p{M} .'’-]*$/u,
    password: /^(?=.*[A-Za-z])(?=.*\d).+$/,
    phone: /^\+?[\d\s().-]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    courseTitle: /^[\p{L}\p{N}][\p{L}\p{M}\p{N} ()[\],.&’'“”:/+–—-]*$/u,
    degree: /^[A-Za-z][A-Za-z ()]*$/,
    courseCode: /^[A-Z0-9][A-Z0-9-]*$/,
    programme: /^[\p{L}][\p{L}\p{M}\p{N} &,'’()/-]*$/u,
    ifyGrades: /^(?:A\*|[A-E])+$/,
    wordGrade: /^[A-Za-z][A-Za-z ]*$/,
    moduleResult: /^[A-Za-z0-9][A-Za-z0-9 *+/-]*$/,
    plainText: /^[^<>]*$/,
    url: /^https?:\/\/[^\s/$.?#][^\s]*$/i,
    institutionName: /^[\p{L}][\p{L}\p{M}\p{N} (),.'’&-]*$/u,
    countryName: /^[\p{L}][\p{L}\p{M} .'’-]*$/u,
    folderName: /^[a-z0-9 _-]*$/i,
};

const isEmpty = (value) => value === null || value === undefined || String(value).trim() === '';

const text = ({ label, required = false, min = 0, max, pattern, message }) => (value) => {
    if (isEmpty(value)) return required ? `${label} is required` : null;
    const trimmed = String(value).trim();
    if (trimmed.length < min) return `${label} must be at least ${min} characters`;
    if (max && trimmed.length > max) return `${label} must be ${max} characters or fewer`;
    if (pattern && !pattern.test(trimmed)) return message;
    return null;
};

const number = ({ label, required = false, min, max, integer = true }) => (value) => {
    if (isEmpty(value)) return required ? `${label} is required` : null;
    const n = Number(value);
    if (!Number.isFinite(n)) return `${label} must be a number`;
    if (integer && !Number.isInteger(n)) return `${label} must be a whole number`;
    if (min !== undefined && n < min) return `${label} must be at least ${min}`;
    if (max !== undefined && n > max) return `${label} must be at most ${max}`;
    return null;
};

const digitsIn = (value) => String(value).replace(/\D/g, '').length;

export const rules = {
    personName: (label = 'Name', required = true) =>
        text({ label, required, max: 100, pattern: PATTERNS.personName, message: `${label} can only contain letters, spaces, apostrophes, hyphens and full stops` }),
    email: (required = true) => (value) => {
        if (isEmpty(value)) return required ? 'Email is required' : null;
        if (String(value).trim().length > 200) return 'Email must be 200 characters or fewer';
        return PATTERNS.email.test(String(value).trim()) ? null : 'Enter a valid email address, e.g. name@example.com';
    },
    password: () => (value) => {
        if (isEmpty(value)) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (value.length > 128) return 'Password must be 128 characters or fewer';
        return PATTERNS.password.test(value) ? null : 'Password must include at least one letter and one number';
    },
    phone: (required = true) => (value) => {
        if (isEmpty(value)) return required ? 'Phone number is required' : null;
        const trimmed = String(value).trim();
        if (!PATTERNS.phone.test(trimmed)) return 'Phone number can only contain digits, spaces and + ( ) - .';
        const digits = digitsIn(trimmed);
        return digits >= 7 && digits <= 15 ? null : 'Enter a phone number with 7 to 15 digits';
    },
    subject: () => text({ label: 'Subject', required: true, min: 2, max: 200, pattern: PATTERNS.courseTitle, message: 'Subject contains characters that are not allowed' }),
    degree: () => text({ label: 'Degree', max: 20, pattern: PATTERNS.degree, message: 'Degree can only contain letters, e.g. BSc' }),
    courseCode: () => text({ label: 'Course code', min: 3, max: 20, pattern: PATTERNS.courseCode, message: 'Course code can only contain capital letters, digits and hyphens, e.g. CC00244' }),
    programme: () => text({ label: 'Programme', required: true, min: 2, max: 100, pattern: PATTERNS.programme, message: 'Programme name contains characters that are not allowed' }),
    ifyPoints: () => number({ label: 'IFY points', min: 0, max: 250 }),
    ifyGrades: () => text({ label: 'IFY grades', max: 10, pattern: PATTERNS.ifyGrades, message: 'Use A*, A, B, C, D or E, e.g. BBB or A*AA' }),
    credits: () => number({ label: 'Credits', min: 0, max: 480 }),
    averageScore: () => number({ label: 'Average score', min: 0, max: 100, integer: false }),
    researchGrade: () => text({ label: 'Research Methods grade', max: 30, pattern: PATTERNS.wordGrade, message: 'Letters only, e.g. Pass' }),
    moduleResult: () => text({ label: 'Module result', max: 30, pattern: PATTERNS.moduleResult, message: 'Letters, digits and * + / - only' }),
    notes: () => text({ label: 'Notes', max: 2000, pattern: PATTERNS.plainText, message: 'Notes cannot contain < or >' }),
    url: (label) => text({ label, max: 500, pattern: PATTERNS.url, message: `${label} must be a full web address starting with https:// and with no spaces` }),
    universityName: () => text({ label: 'University name', required: true, min: 2, max: 120, pattern: PATTERNS.institutionName, message: 'University name contains characters that are not allowed' }),
    countryName: () => text({ label: 'Country name', required: true, min: 2, max: 60, pattern: PATTERNS.countryName, message: 'Country name can only contain letters, spaces, apostrophes, hyphens and full stops' }),
    folderName: () => text({ label: 'Folder name', max: 40, pattern: PATTERNS.folderName, message: 'Folder names can only contain letters, digits, spaces, _ and -' }),
    required: (label) => (value) => (isEmpty(value) ? `${label} is required` : null),
};

/**
 * Runs rules over a set of values. `schema` maps field name to rule; the result
 * maps field name to message for the fields that fail (empty when all pass).
 */
export const validate = (values, schema) => {
    const errors = {};
    for (const [field, rule] of Object.entries(schema)) {
        const message = rule(values[field]);
        if (message) errors[field] = message;
    }
    return errors;
};

// The API returns validation problems as [{ path: 'body.email', message }].
export const errorsFromResponse = (response) => {
    const errors = {};
    (Array.isArray(response?.error) ? response.error : []).forEach(({ path, message }) => {
        const field = String(path).replace(/^body\./, '');
        errors[field] ??= message;
    });
    return errors;
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
