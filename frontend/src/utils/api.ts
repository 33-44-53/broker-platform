const API_URL = 'http://localhost:8000/api';

export const api = {
  // Auth
  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getArtisans: async () => {
    const res = await fetch(`${API_URL}/auth/artisans`);
    return res.json();
  },

  getBuyers: async () => {
    const res = await fetch(`${API_URL}/auth/buyers`);
    return res.json();
  },

  toggleStatus: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/toggle-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Products
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },

  createProduct: async (data: any) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateProduct: async (data: any) => {
    const res = await fetch(`${API_URL}/products/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Orders
  getOrders: async (buyer_id?: number) => {
    const res = await fetch(`${API_URL}/orders${buyer_id ? `?buyer_id=${buyer_id}` : ''}`);
    return res.json();
  },

  createOrder: async (data: any) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Profile
  getProfile: async (user_id: number) => {
    const res = await fetch(`${API_URL}/profile?user_id=${user_id}`);
    return res.json();
  },

  updateProfile: async (data: any) => {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Auctions
  createAuction: async (data: any) => {
    const res = await fetch(`${API_URL}/auctions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getAuctions: async (pending?: boolean) => {
    const res = await fetch(`${API_URL}/auctions${pending ? '?pending=1' : ''}`);
    return res.json();
  },

  approveAuction: async (data: any) => {
    const res = await fetch(`${API_URL}/auctions/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  rejectAuction: async (data: any) => {
    const res = await fetch(`${API_URL}/auctions/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Analytics
  getAnalytics: async (user_id: number, role: string) => {
    const res = await fetch(`${API_URL}/analytics?user_id=${user_id}&role=${role}`);
    return res.json();
  },
};

// Add updateOrder method
api.updateOrder = async (id: number, data: any) => {
  const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
