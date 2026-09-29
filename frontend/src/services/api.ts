import { Product, Order, CustomCakeRequest, Offer, AdminStats, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('pon_bakery_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    let data: any;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || `HTTP ${res.status} ${res.statusText}` };
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data as T;
  } catch (err: any) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  auth: {
    login: (identifier: string, password: string) =>
      request<{ success: boolean; message: string; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      }),
    register: (userData: { name: string; email: string; phone: string; password: string; address?: string }) =>
      request<{ success: boolean; message: string; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    getMe: () => request<{ success: boolean; user: User }>('/auth/me'),
    updateProfile: (data: Partial<User> & { newPassword?: string }) =>
      request<{ success: boolean; message: string; user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  },

  // Products
  products: {
    getAll: (params?: { category?: string; search?: string; availability?: string; featured?: boolean; sort?: string }) => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.availability) query.append('availability', params.availability);
      if (params?.featured) query.append('featured', 'true');
      if (params?.sort) query.append('sort', params.sort);
      const qs = query.toString();
      return request<{ success: boolean; count: number; products: Product[] }>(`/products${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => request<{ success: boolean; product: Product }>(`/products/${id}`),
    create: (data: Partial<Product>) =>
      request<{ success: boolean; message: string; product: Product }>('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id: string, data: Partial<Product>) =>
      request<{ success: boolean; message: string; product: Product }>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateStock: (id: string, stock: number, availability?: string) =>
      request<{ success: boolean; message: string; product: Product }>(`/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock, availability })
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE'
      })
  },

  // Orders
  orders: {
    create: (orderData: any) =>
      request<{ success: boolean; message: string; order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      }),
    track: (query: string) =>
      request<{ success: boolean; order: Order }>(`/orders/track/${encodeURIComponent(query)}`),
    getMyOrders: () => request<{ success: boolean; orders: Order[] }>('/orders/my-orders'),
    getAll: (params?: { status?: string; deliveryType?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.deliveryType) query.append('deliveryType', params.deliveryType);
      if (params?.search) query.append('search', params.search);
      const qs = query.toString();
      return request<{ success: boolean; count: number; orders: Order[] }>(`/orders${qs ? `?${qs}` : ''}`);
    },
    updateStatus: (id: string, status: string, note?: string) =>
      request<{ success: boolean; message: string; order: Order }>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note })
      })
  },

  // Custom Cakes
  customCakes: {
    submit: (data: any) =>
      request<{ success: boolean; message: string; requestId: string; request: CustomCakeRequest }>('/custom-cakes', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    track: (query: string) =>
      request<{ success: boolean; request: CustomCakeRequest }>(`/custom-cakes/track/${encodeURIComponent(query)}`),
    getMyRequests: () => request<{ success: boolean; requests: CustomCakeRequest[] }>('/custom-cakes/my-requests'),
    getAll: (params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);
      const qs = query.toString();
      return request<{ success: boolean; count: number; requests: CustomCakeRequest[] }>(`/custom-cakes${qs ? `?${qs}` : ''}`);
    },
    updateStatus: (id: string, status: string, estimatedPrice?: number, adminNotes?: string) =>
      request<{ success: boolean; message: string; request: CustomCakeRequest }>(`/custom-cakes/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, estimatedPrice, adminNotes })
      })
  },

  // Offers
  offers: {
    getActive: () => request<{ success: boolean; offers: Offer[] }>('/offers'),
    validateCoupon: (code: string, cartTotal: number) =>
      request<{ success: boolean; valid: boolean; message: string; offer: Offer; discountAmount: number }>('/offers/validate', {
        method: 'POST',
        body: JSON.stringify({ code, cartTotal })
      }),
    getAll: () => request<{ success: boolean; offers: Offer[] }>('/offers/all'),
    create: (data: Partial<Offer>) =>
      request<{ success: boolean; message: string; offer: Offer }>('/offers', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id: string, data: Partial<Offer>) =>
      request<{ success: boolean; message: string; offer: Offer }>(`/offers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/offers/${id}`, {
        method: 'DELETE'
      })
  },

  // Admin Stats
  stats: {
    getAdminStats: () => request<{ success: boolean; stats: AdminStats }>('/stats/admin')
  },

  // Upload image
  upload: async (file: File): Promise<{ success: boolean; imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  }
};
