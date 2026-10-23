
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AUTH_URL = `${API_BASE_URL}/api`;

async function request(endpoint, options = {}, token) {
  const response = await fetch(`${AUTH_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }

  return data;
}

function unwrapList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data[key])) return data[key];
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export const placesApi = {
  async list(token) {
    const data = await request('/places', {}, token);
    return unwrapList(data, 'places');
  },

  async getOne(id, token) {
    return request(`/places/${id}`, {}, token);
  },

  async create(place, token) {
    return request(
      '/places',
      { method: 'POST', body: JSON.stringify(place) },
      token
    );
  },

  async update(id, place, token) {
    return request(
      `/places/${id}`,
      { method: 'PATCH', body: JSON.stringify(place) },
      token
    );
  },

  async remove(id, token) {
    return request(`/places/${id}`, { method: 'DELETE' }, token);
  },

  async topRated(token) {
    const data = await request('/places/top-rated', {}, token);
    return unwrapList(data, 'places');
  },
};

export const categoriesApi = {
  async list(token) {
    const data = await request('/categories', {}, token);
    return unwrapList(data, 'categories');
  },
};
