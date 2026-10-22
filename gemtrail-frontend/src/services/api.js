
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

export async function apiFetch(path, options = {}) {
  const authData =
    sessionStorage.getItem('auth') ||
    localStorage.getItem('auth');

  let token = null;

  try {
    token = authData ? JSON.parse(authData).token : null;
  } catch {
    token = null;
  }

  const headers = new Headers(options.headers || {});

  // Automatically send the JWT token.
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // JSON requests.
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    const message = await response.text();

    const error = new Error(
      message || `Request failed: ${response.status}`
    );

    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export { API_BASE_URL };
