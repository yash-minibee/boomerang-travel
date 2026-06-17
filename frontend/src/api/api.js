// Base points to your hosting folder containing the /api/*.php files
// e.g. https://ldvevents.site/backend/api
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/backend/api';

// Derive the storage root from BASE (strip /api suffix)
// e.g. http://localhost:8000/backend/api → http://localhost:8000
// Relative URLs from backend are like /backend/uploads/... so we just need the origin.
const ORIGIN = BASE.replace(/\/backend\/api\/?$/, '').replace(/\/api\/?$/, '');

/**
 * Convert a relative image path returned by the API into a full URL.
 * Handles:
 *   /backend/uploads/packages/file.jpg  → http://localhost:8000/backend/uploads/...
 *   uploads/packages/file.jpg           → http://localhost:8000/backend/uploads/...
 *   https://any-absolute-url/...        → returned as-is
 *   http://localhost:8000/uploads/...   → rewritten to current origin (old DB records)
 */
export function imageUrl(path) {
  if (!path) return '';
  // Rewrite old absolute localhost URLs stored in the DB to use the current origin
  if (path.startsWith('http://localhost') || path.startsWith('https://localhost')) {
    // strip everything up to and including the port, keep the path
    path = path.replace(/^https?:\/\/localhost(:\d+)?/, '');
  }
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Normalise: strip leading /backend/ or backend/ since we add it below if needed
  if (path.startsWith('/')) return ORIGIN + path;
  return ORIGIN + '/backend/' + path;
}

async function request(method, url, data = null) {
  const headers = { 'Content-Type': 'application/json' };
  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.message || 'Request failed');
    err.errors = json.errors || {};
    throw err;
  }
  return json;
}

const get  = (file, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `${BASE}/${file}${qs ? '?' + qs : ''}`);
};
const post = (file, params, data) => {
  const qs = new URLSearchParams(params).toString();
  return request('POST', `${BASE}/${file}${qs ? '?' + qs : ''}`, data);
};

export const api = {
  getPackages:       (params = {}) => get('packages.php', params),
  getPackage:        (slug)        => get('packages.php', { slug }),
  getDestinations:   (params = {}) => get('destinations.php', params),
  getTestimonials:   ()            => get('testimonials.php'),
  submitInquiry:     (data)        => post('inquiries.php', {}, data),
  submitTestimonial: (data)        => post('testimonials.php', {}, data),
  getContent:        (page)        => get('content.php', { page }),
};
