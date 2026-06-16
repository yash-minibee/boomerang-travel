const BASE = (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : '/backend/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, data = null, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const options = { method, headers };
  if (data) options.body = isFormData ? data : JSON.stringify(data);

  const res = await fetch(`${BASE}${path}`, options);
  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || 'Request failed');
    err.errors = json.errors || {};
    err.status = res.status;
    throw err;
  }
  return json;
}

const get = (path) => request('GET', path);
const post = (path, data, isForm) => request('POST', path, data, isForm);
const put = (path, data) => request('PUT', path, data);
const patch = (path, data) => request('PATCH', path, data);
const del = (path) => request('DELETE', path);

// Auth
export const authAPI = {
  login: (body) => post('/auth/login', body),
  logout: () => post('/auth/logout'),
  me: () => get('/auth/me'),
};

// Packages
export const packagesAPI = {
  list: (params = {}) => get('/packages?' + new URLSearchParams(params)),
  get: (slug) => get(`/packages/${slug}`),
  getById: (id) => get(`/packages/id/${id}`),
  create: (data) => post('/packages', data),
  update: (id, data) => put(`/packages/${id}`, data),
  delete: (id) => del(`/packages/${id}`),
  toggleFeatured: (id) => patch(`/packages/${id}/featured`),
  getItinerary: (id) => get(`/packages/${id}/itinerary`),
  saveItinerary: (id, days) => post(`/packages/${id}/itinerary`, { days }),
  getHotels: (id) => get(`/packages/${id}/hotels`),
  saveHotels: (id, hotels) => post(`/packages/${id}/hotels`, { hotels }),
};

// Destinations
export const destinationsAPI = {
  list: (params = {}) => get('/destinations?' + new URLSearchParams(params)),
  get: (id) => get(`/destinations/${id}`),
  create: (data) => post('/destinations', data),
  update: (id, data) => put(`/destinations/${id}`, data),
  delete: (id) => del(`/destinations/${id}`),
};

// Inquiries
export const inquiriesAPI = {
  list: (params = {}) => get('/inquiries?' + new URLSearchParams(params)),
  get: (id) => get(`/inquiries/${id}`),
  updateStatus: (id, status) => patch(`/inquiries/${id}/status`, { status }),
  submit: (data) => post('/inquiries', data),
};

// Customers
export const customersAPI = {
  list: (params = {}) => get('/customers?' + new URLSearchParams(params)),
  get: (id) => get(`/customers/${id}`),
};

// Testimonials
export const testimonialsAPI = {
  listPublic: () => get('/testimonials'),
  listAll: () => get('/testimonials/all'),
  submit: (data) => post('/testimonials', data),
  updateStatus: (id, status) => patch(`/testimonials/${id}/status`, { status }),
  delete: (id) => del(`/testimonials/${id}`),
};

// Media
export const mediaAPI = {
  list: () => get('/media'),
  upload: (formData) => post('/media/upload', formData, true),
  delete: (id) => del(`/media/${id}`),
};

// Content
export const contentAPI = {
  get: (page) => get(`/content/${page}`),
  update: (page, data) => put(`/content/${page}`, data),
};

// Settings
export const settingsAPI = {
  get: () => get('/settings'),
  update: (data) => put('/settings', data),
};

// Dashboard
export const dashboardAPI = {
  stats: () => get('/dashboard/stats'),
  revenue: () => get('/dashboard/revenue'),
};
