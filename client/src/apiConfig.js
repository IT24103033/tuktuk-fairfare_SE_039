// Dynamic API Base URL configuration
// In production (Vercel deployment), defaults to the live Render backend URL: https://tuktuk-fairfare-se-039.onrender.com
// In local development, falls back to empty string (so Vite proxies /api to http://localhost:5000)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://tuktuk-fairfare-se-039.onrender.com'
    : '')
