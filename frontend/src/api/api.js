// Base points to your hosting folder containing the /api/*.php files
// e.g. https://krishivlimo.com.au/boomerang-backend/api
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/backend/api';

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
