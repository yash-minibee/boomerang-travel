// Base points to your hosting folder containing the /api/*.php files
// e.g. https://ldvevents.site/boomerangglobaltravels-backend/api
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/boomerangglobaltravels-backend/api';

// Root URL for uploaded files.
// VITE_UPLOADS_URL should point to wherever the boomerangglobaltravels-backend/uploads folder is served from.
// e.g.  https://ldvevents.site/boomerangglobaltravels-backend/uploads  (production on Hostinger)
//       http://localhost:8000/boomerangglobaltravels-backend/uploads    (local dev)
const UPLOADS_URL = (import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8000/boomerangglobaltravels-backend/uploads').replace(/\/$/, '');

/**
 * Convert any image path stored in the DB into a full URL.
 * DB may contain any of:
 *   /boomerangglobaltravels-backend/uploads/packages/file.jpg   (new relative format)
 *   uploads/packages/file.jpg            (bare relative)
 *   http://localhost:8000/uploads/...    (old absolute localhost)
 *   https://any-cdn/...                  (external URL — pass through)
 */
export function imageUrl(path) {
  if (!path) return '';

  // Pass through real external URLs (not localhost)
  if ((path.startsWith('http://') || path.startsWith('https://')) &&
      !path.includes('localhost')) {
    return path;
  }

  // Strip any absolute origin (localhost or otherwise) — keep only the path
  path = path.replace(/^https?:\/\/[^/]+/, '');

  // Normalise to just the uploads-relative part
  // e.g. /boomerangglobaltravels-backend/uploads/packages/file.jpg → packages/file.jpg
  //      /uploads/packages/file.jpg         → packages/file.jpg
  //      uploads/packages/file.jpg          → packages/file.jpg
  path = path.replace(/^\/?(?:boomerangglobaltravels-backend|backend)\/uploads\//, '');
  path = path.replace(/^\/?uploads\//, '');
  path = path.replace(/^\//, '');

  return `${UPLOADS_URL}/${path}`;
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
  getSettings:       ()            => get('settings.php'),
};
