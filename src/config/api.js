// Set NEXT_PUBLIC_API_BASE_URL per environment (.env locally, project settings
// on Vercel). The fallback is the local API so a fresh clone runs without setup.
//
// Note: Next.js inlines NEXT_PUBLIC_* values into the client bundle at build
// time, so they are public. Never put secrets here.
const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

// A production build with no NEXT_PUBLIC_API_BASE_URL would otherwise silently
// fall back to localhost and fail for every visitor, which is hard to spot from
// the outside. Say so plainly in the console instead.
if (!configuredBaseUrl && process.env.NODE_ENV === 'production') {
  console.error(
    'NEXT_PUBLIC_API_BASE_URL is not set for this build. API requests are falling back ' +
    'to http://localhost:5000 and will fail. Set it in the hosting provider\'s ' +
    'environment variables and redeploy.',
  );
}

export const BASE_URL = configuredBaseUrl || 'http://localhost:5000/api/v1';

export const API_BASE_URL = BASE_URL; // Alias for compatibility

// Origin the API is served from, e.g. https://veritas-pathway-backend-bay.vercel.app.
// Used to turn host-relative upload paths into absolute URLs.
export const API_ORIGIN = (() => {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return '';
  }
})();

/**
 * Turn a stored media path into a URL the browser can load.
 *
 * Uploads are stored host-relative ("/uploads/x.webp"). If the API has not had
 * PUBLIC_API_URL configured it returns them as-is, and the browser would
 * resolve them against the frontend's own origin, which 404s. Prefixing the API
 * origin here makes the frontend correct regardless of that setting.
 */
export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Read the access token without importing utils/auth, which would create a
// circular import (auth helpers are UI-facing, this module is their transport).
const readAccessToken = () => {
  if (typeof document === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];
};

export const baseAPI = {
  baseURL: BASE_URL,

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const token = readAccessToken();
    const config = {
      credentials: 'include',
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        // The cookie is set on the frontend's domain, so it never reaches an API
        // on a different domain. The bearer header is what actually authenticates
        // in production.
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };
    
    if (config.body && typeof config.body === 'object' && !isFormData) {
      config.body = JSON.stringify(config.body);
    }
    
    const response = await fetch(url, config);
    return response.json();
  },
};

baseAPI.upload = {
  singleUpload: (file, folder = '') => {
    const formData = new FormData();
    // Text fields go before the file so they are parsed regardless of how the
    // multipart body is consumed.
    if (folder) formData.append('folder', folder);
    formData.append('file', file);
    return baseAPI.request('/upload/single', {
      method: 'POST',
      body: formData,
    });
  },
  // The backend caps upload.array('files', 10) at ten files per request.
  multipleUpload: (files, folder = '') => {
    const formData = new FormData();
    if (folder) formData.append('folder', folder);
    Array.from(files).forEach((file) => formData.append('files', file));
    return baseAPI.request('/upload/multiple', {
      method: 'POST',
      body: formData,
    });
  },
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.type) queryParams.append('type', params.type);
    if (params.folder) queryParams.append('folder', params.folder);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    const query = queryParams.toString();
    return baseAPI.request(`/upload${query ? `?${query}` : ''}`);
  },
  deleteFile: (id) => baseAPI.request(`/upload/${id}`, {
    method: 'DELETE',
  }),
};

export const MAX_UPLOAD_BATCH = 10;

baseAPI.course = {
  getAllCourse: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.country) queryParams.append('country', params.country);
    if (params.programType) queryParams.append('programType', params.programType);
    if (params.university) queryParams.append('university', params.university);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sort) queryParams.append('sort', params.sort);
    // One result per course, with every programme row under `programmes`.
    if (params.group) queryParams.append('group', 'true');
    const query = queryParams.toString();
    return baseAPI.request(`/course${query ? `?${query}` : ''}`);
  },
  getProgrammes: () => baseAPI.request('/course/programme'),
  createCourse: (data) => baseAPI.request('/course', {
    method: 'POST',
    body: data,
  }),
  updateCourse: (id, data) => baseAPI.request(`/course/${id}`, {
    method: 'PATCH',
    body: data,
  }),
  getUniversities: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    const query = queryParams.toString();
    return baseAPI.request(`/course/university${query ? `?${query}` : ''}`);
  },
  createUniversity: (data) => baseAPI.request('/course/university', {
    method: 'POST',
    body: data,
  }),
  getCountries: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    const query = queryParams.toString();
    return baseAPI.request(`/course/country${query ? `?${query}` : ''}`);
  },
  createCountry: (data) => baseAPI.request('/course/country', {
    method: 'POST',
    body: data,
  }),
  updateCountry: (id, data) => baseAPI.request(`/course/country/${id}`, {
    method: 'PATCH',
    body: data,
  }),
  deleteCountry: (id, data) => baseAPI.request(`/course/country/${id}`, {
    method: 'DELETE',
    body: data,
  }),
  updateUniversity: (id, data) => baseAPI.request(`/course/university/${id}`, {
    method: 'PATCH',
    body: data,
  }),
  deleteUniversity: (id, data) => baseAPI.request(`/course/university/${id}`, {
    method: 'DELETE',
    body: data,
  }),
};