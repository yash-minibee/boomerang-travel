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

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, url, data = null, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const options = { method, headers };
  if (data) options.body = isFormData ? data : JSON.stringify(data);

  const res = await fetch(url, options);
  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || 'Request failed');
    err.errors = json.errors || {};
    err.status = res.status;
    throw err;
  }
  return json;
}

const get  = (file, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `${BASE}/${file}${qs ? '?' + qs : ''}`);
};
const post  = (file, params, data, isForm) => {
  const qs = new URLSearchParams(params).toString();
  return request('POST', `${BASE}/${file}${qs ? '?' + qs : ''}`, data, isForm);
};
const put   = (file, params, data) => {
  const qs = new URLSearchParams(params).toString();
  return request('PUT', `${BASE}/${file}${qs ? '?' + qs : ''}`, data);
};
const patch = (file, params, data) => {
  const qs = new URLSearchParams(params).toString();
  return request('PATCH', `${BASE}/${file}${qs ? '?' + qs : ''}`, data);
};
const del   = (file, params) => {
  const qs = new URLSearchParams(params).toString();
  return request('DELETE', `${BASE}/${file}${qs ? '?' + qs : ''}`);
};

// ── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:  (body)  => post('auth.php', { action: 'login' }, body),
  logout: ()      => post('auth.php', { action: 'logout' }),
  me:     ()      => get('auth.php',  { action: 'me' }),
  updateProfile: (body) => put('auth.php', { action: 'profile' }, body),
};

// ── Packages ────────────────────────────────────────────────────────────────
export const packagesAPI = {
  list:          (params = {})    => get('packages.php', params),
  getById:       (id)             => get('packages.php', { id }),
  get:           (slug)           => get('packages.php', { slug }),
  create:        (data)           => post('packages.php', {}, data),
  update:        (id, data)       => put('packages.php', { id }, data),
  delete:        (id)             => del('packages.php', { id }),
  toggleFeatured:(id)             => patch('packages.php', { id, action: 'featured' }),
  getItinerary:  (id)             => get('itinerary.php', { package_id: id }),
  saveItinerary: (id, days)       => post('itinerary.php', { package_id: id }, { days }),
  getHotels:     (id)             => get('hotels.php', { package_id: id }),
  saveHotels:    (id, hotels)     => post('hotels.php', { package_id: id }, { hotels }),
};

// ── Destinations ────────────────────────────────────────────────────────────
export const destinationsAPI = {
  list:   (params = {}) => get('destinations.php', params),
  get:    (id)          => get('destinations.php', { id }),
  create: (data)        => post('destinations.php', {}, data),
  update: (id, data)    => put('destinations.php', { id }, data),
  delete: (id)          => del('destinations.php', { id }),
};

// ── Inquiries ───────────────────────────────────────────────────────────────
export const inquiriesAPI = {
  list:         (params = {}) => get('inquiries.php', params),
  get:          (id)          => get('inquiries.php', { id }),
  submit:       (data)        => post('inquiries.php', {}, data),
  updateStatus: (id, status)  => patch('inquiries.php', { id, action: 'status' }, { status }),
};

// ── Customers ────────────────────────────────────────────────────────────────
export const customersAPI = {
  list: (params = {}) => get('customers.php', params),
  get:  (id)          => get('customers.php', { id }),
};

// ── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialsAPI = {
  listPublic:   ()             => get('testimonials.php'),
  listAll:      ()             => get('testimonials.php', { scope: 'all' }),
  submit:       (data)         => post('testimonials.php', {}, data),
  update:       (id, data)     => put('testimonials.php', { id }, data),
  updateStatus: (id, status)   => patch('testimonials.php', { id, action: 'status' }, { status }),
  delete:       (id)           => del('testimonials.php', { id }),
};

// ── Media ────────────────────────────────────────────────────────────────────
export const mediaAPI = {
  list:   ()         => get('media.php'),
  upload: (formData) => post('media.php', {}, formData, true),
  delete: (id)       => del('media.php', { id }),
};

// ── Content ──────────────────────────────────────────────────────────────────
export const contentAPI = {
  get:    (page)       => get('content.php', { page }),
  update: (page, data) => put('content.php', { page }, data),
};

// ── Settings ──────────────────────────────────────────────────────────────────
export const settingsAPI = {
  get:    ()     => get('settings.php'),
  update: (data) => put('settings.php', {}, data),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  stats:   () => get('dashboard.php'),
  revenue: () => get('dashboard.php', { view: 'revenue' }),
};
