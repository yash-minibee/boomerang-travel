const BASE = import.meta.env.VITE_API_BASE || '/backend/api/v1';

async function request(method, path, data = null) {
  const headers = { 'Content-Type': 'application/json' };
  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(`${BASE}${path}`, options);
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.message || 'Request failed');
    err.errors = json.errors || {};
    throw err;
  }
  return json;
}

export const api = {
  getPackages: (params = {}) => request('GET', '/packages?' + new URLSearchParams(params)),
  getPackage: (slug) => request('GET', `/packages/${slug}`),
  getDestinations: (params = {}) => request('GET', '/destinations?' + new URLSearchParams(params)),
  getTestimonials: () => request('GET', '/testimonials'),
  submitInquiry: (data) => request('POST', '/inquiries', data),
  submitTestimonial: (data) => request('POST', '/testimonials', data),
  getContent: (page) => request('GET', `/content/${page}`),
};
