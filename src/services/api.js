import axios from "axios";

// ================================================================
// 🌐 إعداد axios
// ================================================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api", // يجب أن يحتوي على /api
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔑 Interceptor لإضافة التوكن
api.interceptors.request.use(
  (config) => {
    const url = config.url;
    const adminToken = localStorage.getItem('token');
    const customerToken = localStorage.getItem('customer_token');
    let tokenToSend = null;

    // Admin routes
    if (url.startsWith('/admin/')) {
        tokenToSend = adminToken;
    }
    // Customer routes
    else if (url.startsWith('/customer/') || url.startsWith('/cart') || url.startsWith('/orders')) {
        tokenToSend = customerToken;
    }
    // Other specific admin routes that are not prefixed
    else if (url === '/logout' || url === '/profile' || url === '/user/avatar') {
        tokenToSend = adminToken;
    }
    // For public routes, no token is attached.

    if (tokenToSend) {
        config.headers.Authorization = `Bearer ${tokenToSend}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// ================================================================
// 🛠️ دالة مساعدة لرفع الملفات (FormData)
// ================================================================
const uploadFile = (url, formData) =>
  api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ================================================================
// 🔑 Admin Authentication & User
// ================================================================
const auth = {
  register: (userData) => api.post("/register", userData),
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),
  uploadAvatar: (formData) => createFile("/user/avatar", formData),
};

const customerAuth = {
  register: (userData) => api.post("/customer/register", userData),
  login: (credentials) => api.post("/customer/login", credentials),
  logout: () => api.post("/customer/logout"),
  getProfile: () => api.get("/customer/profile"),
  updateProfile: (data) => api.put("/customer/profile", data),
};

// ================================================================
// 👤 Customer Authentication & Profile
// ================================================================
const customer = {
  register: (userData) => api.post('/customer/register', userData),
  login: (credentials) => api.post('/customer/login', credentials),
  logout: () => api.post('/customer/logout'),
  getProfile: () => api.get('/customer/profile'),
  updateProfile: (data) => api.put('/customer/profile', data),
};

// ================================================================
// 📚 Public Resources
// ================================================================
const publicResources = {
  books: {
    all: (params) => api.get("/books", { params }),
    get: (id) => api.get(`/books/${id}`),
  },
  categories: {
    all: () => api.get("/categories"),
    get: (id) => api.get(`/categories/${id}`),
  },
  publishers: {
    all: () => api.get("/publishers"),
    get: (id) => api.get(`/publishers/${id}`),
  },
  authors: {
    all: () => api.get("/authors"),
    get: (id) => api.get(`/authors/${id}`),
  },
  settings: () => api.get("/settings"),
};

// ================================================================
// 🛒 Cart
// ================================================================
const cart = {
  show: () => api.get("/cart"),
  add: (data) => api.post("/cart", data),
  update: (id, data) => api.put(`/cart/${id}`, data),
  remove: (id) => api.delete(`/cart/${id}`),
};

// ================================================================
// 📦 User Orders
// ================================================================
const orders = {
  all: () => api.get("/orders"),
  create: (data) => api.post("/orders", data),
};

// ================================================================
// ⚙️ Admin Panel
// ================================================================
const admin = {
  dashboard: () => api.get("/admin/dashboard"),

  profile: {
    all: () => api.get("/admin/profile"),
    get: (id) => api.get(`/admin/profile/${id}`),
    update: (id, data) => api.put(`/admin/profile/${id}`, data),
  },
  orders: {
    all: () => api.get("/admin/orders"),
    get: (id) => api.get(`/admin/orders/${id}`),
    update: (id, data) => api.put(`/admin/orders/${id}`, data),
  },

  books: {
    add: (data) => uploadFile("/admin/books", data),
    update: (id, data) => uploadFile(`/admin/books/${id}`, data),
    delete: (id) => api.delete(`/admin/books/${id}`),
  },

  categories: {
    add: (data) => api.post("/admin/categories", data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
  },

 publishers: {
  add: (data) => uploadFile("/admin/publishers", data),

  update: (id, data) =>
    api.post(`/admin/publishers/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { _method: "PUT" }, // trick: Laravel هيفهم إنها PUT
    }),

  delete: (id) => api.delete(`/admin/publishers/${id}`),
},

  authors: {
    add: (data) => uploadFile("/admin/authors", data),
    update: (id, data) => uploadFile(`/admin/authors/${id}`, data),
    delete: (id) => api.delete(`/admin/authors/${id}`),
  },

  settings: {
    update: (data) => uploadFile("/admin/settings", data),
  },
};

// ================================================================
// 📌 Export apiService
// ================================================================
const apiService = {
  auth,
  customerAuth,
  customer,
  publicResources,
  cart,
  orders,
  admin,
};

export default apiService;
