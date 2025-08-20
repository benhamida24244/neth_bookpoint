import axios from "axios";

// إنشاء instance من axios مع إعدادات أساسية
// The VITE_API_BASE_URL should point to your Laravel backend's /api endpoint
// For example: http://localhost:8000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor لإضافة توكن المصادقة لكل طلب يتم إرساله
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // أو أي مكان آخر تخزن فيه التوكن
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =================================================================
// 🔑 المصادقة والمستخدم (Authentication & User)
// =================================================================

// تسجيل مستخدم جديد
export const register = (userData) => api.post("/register", userData);

// تسجيل الدخول
export const login = (credentials) => api.post("/login", credentials);

// تسجيل الخروج
export const logout = () => api.post("/logout");

// جلب ملف المستخدم الحالي
export const getProfile = () => api.get("/profile");

// تحديث ملف المستخدم الحالي
export const updateProfile = (profileData) => api.put("/profile", profileData);

// رفع الصورة الرمزية للمستخدم (يتطلب FormData)
export const uploadAvatar = (formData) => api.post("/user/avatar", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});


// =================================================================
// 📚 الموارد العامة (Public Resources)
// =================================================================

// --- الكتب (Books) ---
export const getBooks = (params) => api.get("/books", { params }); // params for pagination, search, etc.
export const getBook = (id) => api.get(`/books/${id}`);

// --- الفئات (Categories) ---
export const getCategories = () => api.get("/categories");
export const getCategory = (id) => api.get(`/categories/${id}`);

// --- الناشرون (Publishers) ---
export const getPublishers = () => api.get("/publishers");
export const getPublisher = (id) => api.get(`/publishers/${id}`);

// --- المؤلفون (Authors) ---
export const getAuthors = () => api.get("/authors");
export const getAuthor = (id) => api.get(`/authors/${id}`);

// --- الإعدادات العامة (Settings) ---
export const getSettings = () => api.get("/settings");


// =================================================================
// 🛒 سلة التسوق (Cart)
// =================================================================

// عرض محتويات السلة
export const getCart = () => api.get("/cart");

// إضافة منتج إلى السلة
export const addToCart = (cartData) => api.post("/cart", cartData); // e.g., { book_id: 1, quantity: 1 }

// تحديث كمية منتج في السلة
export const updateCartItem = (cartItemId, updateData) => api.put(`/cart/${cartItemId}`, updateData); // e.g., { quantity: 3 }

// حذف منتج من السلة
export const deleteCartItem = (cartItemId) => api.delete(`/cart/${cartItemId}`);


// =================================================================
// 📦 الطلبات (User Orders)
// =================================================================

// جلب طلبات المستخدم الحالي
export const getUserOrders = () => api.get("/orders");

// إنشاء طلب جديد
export const createOrder = (orderData) => api.post("/orders", orderData);


// =================================================================
// ⚙️ لوحة تحكم المدير (Admin Panel)
// =================================================================

// --- لوحة التحكم الرئيسية ---
export const getAdminDashboard = () => api.get("/admin/dashboard");

// --- إدارة الطلبات (Admin Orders) ---
export const getAdminOrders = () => api.get("/admin/orders");
export const getAdminOrder = (orderId) => api.get(`/admin/orders/${orderId}`);
export const updateAdminOrder = (orderId, updateData) => api.put(`/admin/orders/${orderId}`, updateData);
export const adminDeleteOrder = (orderId) => api.delete(`/admin/orders/${orderId}`);

// --- إدارة الكتب (Admin Books CRUD) ---
export const adminAddBook = (bookData) => api.post("/admin/books", bookData);
export const adminUpdateBook = (bookId, bookData) => api.put(`/admin/books/${bookId}`, bookData);
export const adminDeleteBook = (bookId) => api.delete(`/admin/books/${bookId}`);

// --- إدارة الفئات (Admin Categories CRUD) ---
export const adminAddCategory = (categoryData) => api.post("/admin/categories", categoryData);
export const adminUpdateCategory = (categoryId, categoryData) => api.put(`/admin/categories/${categoryId}`, categoryData);
export const adminDeleteCategory = (categoryId) => api.delete(`/admin/categories/${categoryId}`);

// --- إدارة الناشرين (Admin Publishers CRUD) ---
export const adminAddPublisher = (publisherData) => api.post("/admin/publishers", publisherData);
export const adminUpdatePublisher = (publisherId, publisherData) => api.put(`/admin/publishers/${publisherId}`, publisherData);
export const adminDeletePublisher = (publisherId) => api.delete(`/admin/publishers/${publisherId}`);

// --- إدارة المؤلفين (Admin Authors CRUD) ---
export const adminAddAuthor = (authorData) => api.post("/admin/authors", authorData);
export const adminUpdateAuthor = (authorId, authorData) => api.put(`/admin/authors/${authorId}`, authorData);
export const adminDeleteAuthor = (authorId) => api.delete(`/admin/authors/${authorId}`);

// --- إدارة العملاء (Admin Clients CRUD) ---
export const adminGetClients = () => api.get("/admin/clients");
export const adminGetClient = (clientId) => api.get(`/admin/clients/${clientId}`);
export const adminAddClient = (clientData) => api.post("/admin/clients", clientData);
export const adminUpdateClient = (clientId, clientData) => api.put(`/admin/clients/${clientId}`, clientData);
export const adminDeleteClient = (clientId) => api.delete(`/admin/clients/${clientId}`);

// --- إدارة الإعدادات (Admin Settings) ---
export const adminUpdateSettings = (settingsData) => api.post("/admin/settings", settingsData);

// --- رفع الصور (Admin Image Uploads) ---
// Note: These functions expect FormData as the second argument.
export const uploadBookCover = (bookId, formData) => api.post(`/admin/upload/book/${bookId}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const uploadAuthorLogo = (authorId, formData) => api.post(`/admin/upload/author/${authorId}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const uploadPublisherLogo = (publisherId, formData) => api.post(`/admin/upload/publisher/${publisherId}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const uploadBackgroundImage = (formData) => api.post("/admin/upload/setting", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

// يمكنك تصدير كل الدوال في كائن واحد إذا أردت
const apiService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadAvatar,
  getBooks,
  getBook,
  getCategories,
  getCategory,
  getPublishers,
  getPublisher,
  getAuthors,
  getAuthor,
  getSettings,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getUserOrders,
  createOrder,
  getAdminDashboard,
  getAdminOrders,
  getAdminOrder,
  updateAdminOrder,
  adminDeleteOrder,
  adminAddBook,
  adminUpdateBook,
  adminDeleteBook,
  adminAddCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminAddPublisher,
  adminUpdatePublisher,
  adminDeletePublisher,
  adminAddAuthor,
  adminUpdateAuthor,
  adminDeleteAuthor,
  adminGetClients,
  adminGetClient,
  adminAddClient,
  adminUpdateClient,
  adminDeleteClient,
  adminUpdateSettings,
  uploadBookCover,
  uploadAuthorLogo,
  uploadPublisherLogo,
  uploadBackgroundImage,
};

export default apiService;
