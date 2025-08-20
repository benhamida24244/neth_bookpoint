import axios from "axios";

// إنشاء instance من axios مع إعدادات أساسية
// The VITE_API_BASE_URL should point to your Laravel backend's /api endpoint
// For example: http://localhost:8000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
export const register = (userData) => api.post("/api/register", userData);

// تسجيل الدخول
export const login = (credentials) => api.post("/api/login", credentials);

// تسجيل الخروج
export const logout = () => api.post("/api/logout");

// جلب ملف المستخدم الحالي
export const getProfile = () => api.get("/api/profile");

// تحديث ملف المستخدم الحالي
export const updateProfile = (profileData) => api.put("/api/profile", profileData);

// رفع الصورة الرمزية للمستخدم (يتطلب FormData)
export const uploadAvatar = (formData) => api.post("/api/user/avatar", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});


// =================================================================
// 📚 الموارد العامة (Public Resources)
// =================================================================

// --- الكتب (Books) ---
export const getBooks = (params) => api.get("/api/books", { params }); // params for pagination, search, etc.
export const getBook = (id) => api.get(`/api/books/${id}`);

// --- الفئات (Categories) ---
export const getCategories = () => api.get("/api/categories");
export const getCategory = (id) => api.get(`/api/categories/${id}`);

// --- الناشرون (Publishers) ---
export const getPublishers = () => api.get("/api/publishers");
export const getPublisher = (id) => api.get(`/api/publishers/${id}`);

// --- المؤلفون (Authors) ---
export const getAuthors = () => api.get("/api/authors");
export const getAuthor = (id) => api.get(`/api/authors/${id}`);

// --- الإعدادات العامة (Settings) ---
export const getSettings = () => api.get("/api/settings");


// =================================================================
// 🛒 سلة التسوق (Cart)
// =================================================================

// عرض محتويات السلة
export const getCart = () => api.get("/api/cart");

// إضافة منتج إلى السلة
export const addToCart = (cartData) => api.post("/api/cart", cartData); // e.g., { book_id: 1, quantity: 1 }

// تحديث كمية منتج في السلة
export const updateCartItem = (cartItemId, updateData) => api.put(`/api/cart/${cartItemId}`, updateData); // e.g., { quantity: 3 }

// حذف منتج من السلة
export const deleteCartItem = (cartItemId) => api.delete(`/api/cart/${cartItemId}`);


// =================================================================
// 📦 الطلبات (User Orders)
// =================================================================

// جلب طلبات المستخدم الحالي
export const getUserOrders = () => api.get("/api/orders");

// إنشاء طلب جديد
export const createOrder = (orderData) => api.post("/api/orders", orderData);


// =================================================================
// ⚙️ لوحة تحكم المدير (Admin Panel)
// =================================================================

// --- لوحة التحكم الرئيسية ---
export const getAdminDashboard = () => api.get("/api/admin/dashboard");

// --- إدارة الطلبات (Admin Orders) ---
export const getAdminOrders = () => api.get("/api/admin/orders");
export const getAdminOrder = (orderId) => api.get(`/api/admin/orders/${orderId}`);
export const updateAdminOrder = (orderId, updateData) => api.put(`/api/admin/orders/${orderId}`, updateData);

// --- إدارة الكتب (Admin Books CRUD) ---
export const adminAddBook = (bookData) => api.post("/api/admin/books", bookData);
export const adminUpdateBook = (bookId, bookData) => api.put(`/api/admin/books/${bookId}`, bookData);
export const adminDeleteBook = (bookId) => api.delete(`/api/admin/books/${bookId}`);

// --- إدارة الفئات (Admin Categories CRUD) ---
export const adminAddCategory = (categoryData) => api.post("/api/admin/categories", categoryData);
export const adminUpdateCategory = (categoryId, categoryData) => api.put(`/api/admin/categories/${categoryId}`, categoryData);
export const adminDeleteCategory = (categoryId) => api.delete(`/api/admin/categories/${categoryId}`);

// --- إدارة الناشرين (Admin Publishers CRUD) ---
export const adminAddPublisher = (publisherData) => api.post("/api/admin/publishers", publisherData);
export const adminUpdatePublisher = (publisherId, publisherData) => api.put(`/api/admin/publishers/${publisherId}`, publisherData);
export const adminDeletePublisher = (publisherId) => api.delete(`/api/admin/publishers/${publisherId}`);

// --- إدارة المؤلفين (Admin Authors CRUD) ---
export const adminAddAuthor = (authorData) => api.post("/api/admin/authors", authorData);
export const adminUpdateAuthor = (authorId, authorData) => api.put(`/api/admin/authors/${authorId}`, authorData);
export const adminDeleteAuthor = (authorId) => api.delete(`/api/admin/authors/${authorId}`);

// --- إدارة الإعدادات (Admin Settings) ---
export const adminUpdateSettings = (settingsData) => api.post("/api/admin/settings", settingsData);

// --- رفع الصور (Admin Image Uploads) ---
// Note: These functions expect FormData as the second argument.
export const uploadBookCover = (bookId, formData) => api.post(`/api/admin/upload/book/${bookId}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const uploadAuthorLogo = (authorId, formData) => api.post(`/api/admin/upload/authors/${authorId}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const uploadPublisherLogo = (publisherId, formData) => api.post(`/api/admin/upload/publisher/${publisherId}`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const uploadBackgroundImage = (formData) => api.post("/api/admin/upload/setting", formData, {
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
  adminUpdateSettings,
  uploadBookCover,
  uploadAuthorLogo,
  uploadPublisherLogo,
  uploadBackgroundImage,
};

export default apiService;
