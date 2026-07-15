// Base points to your hosting folder containing the /api/*.php files
// e.g. https://ldvevents.site/boomerangglobaltravels-backend/api
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/boomerangglobaltravels-backend/api';

// Root URL for uploaded files.
// VITE_UPLOADS_URL should point to wherever the boomerangglobaltravels-backend/uploads folder is served from.
// e.g.  https://ldvevents.site/boomerangglobaltravels-backend/uploads  (production on Hostinger)
//       http://localhost:8000/boomerangglobaltravels-backend/uploads    (local dev)
const UPLOADS_URL = (import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8000/boomerangglobaltravels-backend/uploads').replace(/\/$/, '');

// Google Apps Script Web App URL (Paste your URL here after deploying)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxptVsHkwyWT4ziOX3iL0-7bUpoTXLq_gTY46XeqTWxeBYxtE2AEOdcw6gW9Qljdx64dg/exec" || '';

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

const get = (file, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `${BASE}/${file}${qs ? '?' + qs : ''}`);
};
const post = (file, params, data) => {
  const qs = new URLSearchParams(params).toString();
  return request('POST', `${BASE}/${file}${qs ? '?' + qs : ''}`, data);
};

export const api = {
  getPackages: (params = {}) => get('packages.php', params),
  getPackage: (slug) => get('packages.php', { slug }),
  getDestinations: (params = {}) => get('destinations.php', params),
  getCruises: (params = {}) => get('cruises.php', params),
  getCruise: (slug) => get('cruises.php', { slug }),
  getCruiseDestinations: (params = {}) => get('cruise_destinations.php', params),
  getTestimonials: () => get('testimonials.php'),
  submitInquiry: async (data) => {
    const res = await post('inquiries.php', {}, data);

    // Send data to Google Sheets if URL is configured
    if (GOOGLE_SCRIPT_URL) {
      try {
        let type = 'inquiry';
        if (data.type === 'custom_mice' || data.type === 'mice') type = 'mice';

        // Determine inquiry source
        let inquiryFrom = "Unknown";
        let inquiryFor = "";

        if (data.type === 'package') inquiryFrom = "Package Page";
        else if (data.type === 'cruise') inquiryFrom = "Cruise Page";
        else if (data.type === 'custom_package' || data.type === 'custom_cruise') {
          inquiryFrom = "Contact Form";
          inquiryFor = data.type === 'custom_package' ? "Holiday Tour Package" : "Cruise Trip";
        }
        else if (data.type === 'custom_mice' || data.type === 'mice') {
          inquiryFrom = "MICE Page";
        }

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Important for Google Apps Script
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: type,
            inquiryFrom: inquiryFrom,
            inquiryFor: inquiryFor,
            name: data.customer_name || data.name,
            email: data.customer_email || data.email,
            phone: data.customer_phone || data.phone,
            country: data.customer_country || data.country,
            destination: data.package_name || data.destination,
            date: data.travel_date || data.expected_date,
            travellers: data.travellers || data.group_size,
            children: data.children || '',
            budget: data.budget_range || '',
            message: data.message || data.requirements,
            company: data.company || data.company_name || '',
            event_type: data.event_type || '',
            group_size: data.group_size || data.travellers || '',
            expected_date: data.expected_date || data.travel_date || '',
            requirements: data.requirements || data.message || ''
          })
        });
      } catch (err) {
        console.error("Google Sheets Error:", err);
      }
    }
    return res;
  },
  submitSubscriber: async (email) => {
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'subscriber', email })
        });
      } catch (err) {
        console.error("Google Sheets Error:", err);
      }
    }
    return { success: true };
  },
  submitTestimonial: (data) => post('testimonials.php', {}, data),
  getContent: (page) => get('content.php', { page }),
  getSettings: () => get('settings.php'),
  getCurrencyRate: () => get('currency.php'),
};
