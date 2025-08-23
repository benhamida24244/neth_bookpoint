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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
// 🛠️ دوال مساعدة لرفع الملفات (FormData)
// ================================================================
// تستخدم لإنشاء سجل جديد مع ملف (POST)
const createFile = (url, formData) =>
  api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// تستخدم لتحديث سجل موجود مع ملف (PUT)
// Laravel يتطلب إرسال طلب POST مع حقل _method="PUT"
const updateFile = (url, formData) => {
  formData.append("_method", "PUT");
  return api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ================================================================
// 🔑 Authentication & User
// ================================================================
const auth = {
  register: (userData) => api.post("/register", userData),
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),
  uploadAvatar: (formData) => uploadFile("/user/avatar", formData),
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
    add: (data) => createFile("/admin/books", data),
    update: (id, data) => updateFile(`/admin/books/${id}`, data),
    delete: (id) => api.delete(`/admin/books/${id}`),
  },

  categories: {
    add: (data) => api.post("/admin/categories", data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
  },

  publishers: {
    add: (data) => createFile("/admin/publishers", data),
    update: (id, data) => updateFile(`/admin/publishers/${id}`, data),
    delete: (id) => api.delete(`/admin/publishers/${id}`),
  },

  authors: {
    add: (data) => createFile("/admin/authors", data),
    update: (id, data) => updateFile(`/admin/authors/${id}`, data),
    delete: (id) => api.delete(`/admin/authors/${id}`),
  },

  settings: {
    update: (data) => createFile("/admin/settings", data),
  },
};

// ================================================================
// 📌 Export apiService
// ================================================================
const apiService = {
  auth,
  publicResources,
  cart,
  orders,
  admin,
};

export default apiService;
