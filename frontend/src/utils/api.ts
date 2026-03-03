const API_URL = 'http://localhost/api/controllers';

export const api = {
  // Products
  getProducts: async (params?: { artisan_id?: number; category?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_URL}/products.php?${query}`);
    const text = await res.text();
    if (!text) return [];
    try {
      return JSON.parse(text);
    } catch(e) {
      console.error('Failed to parse:', text);
      return [];
    }
  },

  getProduct: async (id: number) => {
    const res = await fetch(`${API_URL}/products.php?id=${id}`);
    return res.json();
  },

  createProduct: async (data: any) => {
    const res = await fetch(`${API_URL}/products.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    console.log('Response:', text);
    try {
      return JSON.parse(text);
    } catch(e) {
      throw new Error('API returned: ' + text.substring(0, 200));
    }
  },

  updateProduct: async (data: any) => {
    const res = await fetch(`${API_URL}/products.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/products.php?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Cart
  getCart: async (buyer_id: number) => {
    const res = await fetch(`${API_URL}/cart.php?buyer_id=${buyer_id}`);
    return res.json();
  },

  addToCart: async (data: { buyer_id: number; product_id: number; quantity: number }) => {
    const res = await fetch(`${API_URL}/cart.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateCartItem: async (data: { buyer_id: number; product_id: number; quantity: number }) => {
    const res = await fetch(`${API_URL}/cart.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  removeFromCart: async (buyer_id: number, product_id: number) => {
    const res = await fetch(`${API_URL}/cart.php?buyer_id=${buyer_id}&product_id=${product_id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  clearCart: async (buyer_id: number) => {
    const res = await fetch(`${API_URL}/cart.php?buyer_id=${buyer_id}&clear=1`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Orders
  getOrders: async (params?: { buyer_id?: number; artisan_id?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_URL}/orders.php?${query}`);
    return res.json();
  },

  createOrder: async (data: any) => {
    const res = await fetch(`${API_URL}/orders.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateOrder: async (data: any) => {
    const res = await fetch(`${API_URL}/orders.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
