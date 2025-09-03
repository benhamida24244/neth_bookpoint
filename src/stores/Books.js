// stores/Books.js
import { defineStore } from 'pinia';

// Static data for books. In a real application, this would come from an API.
// const staticBooks = [
//   {
//     id: 1,
//     title: 'Vue.js for Beginners: A Comprehensive Guide',
//     author: 'Sarah Chen',
//     cover: 'https://m.media-amazon.com/images/I/71h02AXdgTL._UF1000,1000_QL80_.jpg',
//     description: 'An approachable guide for aspiring Vue.js developers that covers everything from basic concepts to advanced techniques. Learn how to build modern, reactive web applications with Vue.js 3 and the Composition API.',
//     stock: 132,
//     publishingHouse: 'Dragon House Publishing',
//     publisherDate: '2023-09-15',
//     pages: 320,
//     category: 'Programming',
//     language: 'English',
//     status: 'published',
//     price: 29.99,
//     rating: 4.5,

//     pricing: {
//       basePrice: 29.99,
//       shipping: 5.99,
//       tax: 2.40,
//       discount: 0
//     },
//     dates: {
//       created: '2023-09-01T10:00:00Z',
//       updated: '2023-09-15T14:30:00Z'
//     }
//   },
//   {
//     id: 2,
//     title: 'Advanced Tailwind CSS: Building Modern Interfaces',
//     author: 'Michael B. Davis',
//     cover: 'https://m.media-amazon.com/images/I/5125KM6SBQL._UF1000,1000_QL80_.jpg',
//     description: 'Dive deep into Tailwind CSS with this advanced guide that teaches you how to create stunning, responsive user interfaces. Master utility-first CSS and learn best practices for scalable design systems.',
//     stock: 45,
//     publishingHouse: 'Modern Web Solutions',
//     publisherDate: '2024-03-20',
//     pages: 280,
//     category: 'Web Development',
//     language: 'English',
//     status: 'pending',
//     price: 34.50,
//     rating: 4.8,

//     pricing: {
//       basePrice: 34.50,
//       shipping: 5.99,
//       tax: 2.76,
//       discount: 5.00
//     },
//     dates: {
//       created: '2024-03-01T09:00:00Z',
//       updated: '2024-03-20T16:45:00Z'
//     }
//   },
//   {
//     id: 3,
//     title: 'Mastering Laravel: From Novice to Artisan',
//     author: 'Jessica Lee',
//     cover: 'https://m.media-amazon.com/images/I/61NLKoD4kVL._UF1000,1000_QL80_.jpg',
//     description: 'Unlock the full potential of Laravel with this comprehensive guide that takes you from basic concepts to advanced architectural patterns. Learn to build robust, scalable web applications with PHP\'s most popular framework.',
//     stock: 18,
//     publishingHouse: 'Artisan Press',
//     publisherDate: '2022-11-01',
//     pages: 410,
//     category: 'Web Development',
//     language: 'English',
//     status: 'draft',
//     price: 49.99,
//     rating: 4.7,

//     pricing: {
//       basePrice: 49.99,
//       shipping: 7.99,
//       tax: 4.00,
//       discount: 10.00
//     },
//     dates: {
//       created: '2022-10-15T11:30:00Z',
//       updated: '2022-11-01T13:20:00Z'
//     }
//   },
//   {
//     id: 4,
//     title: 'The Art of Clean Code',
//     author: 'Robert C. Martin',
//     cover: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
//     description: 'A must-read for every programmer. This book teaches you principles of writing clean, maintainable, efficient code that stands the test of time and collaborative development.',
//     stock: 210,
//     publishingHouse: 'Prentice Hall',
//     publisherDate: '2008-08-01',
//     pages: 464,
//     category: 'Software Engineering',
//     language: 'English',
//     status: 'published',
//     price: 45.00,
//     rating: 4.9,

//     pricing: {
//       basePrice: 45.00,
//       shipping: 6.99,
//       tax: 3.60,
//       discount: 0
//     },
//     dates: {
//       created: '2008-07-15T08:00:00Z',
//       updated: '2008-08-01T12:00:00Z'
//     }
//   },
//   {
//     id: 5,
//     title: 'Data Science with Python',
//     author: 'Wes McKinney',
//     cover: 'https://m.media-amazon.com/images/I/51WiLueukxL._SX379_BO1,204,203,200_.jpg',
//     description: 'An in-depth introduction to data science tools and techniques using Python. Learn pandas, NumPy, matplotlib, and other essential libraries for data analysis and visualization.',
//     stock: 78,
//     publishingHouse: 'O\'Reilly Media',
//     publisherDate: '2017-10-25',
//     pages: 560,
//     category: 'Data Science',
//     language: 'English',
//     status: 'published',
//     price: 59.95,
//     rating: 4.6,

//     pricing: {
//       basePrice: 59.95,
//       shipping: 8.99,
//       tax: 4.80,
//       discount: 0
//     },
//     dates: {
//       created: '2017-10-01T14:00:00Z',
//       updated: '2017-10-25T10:30:00Z'
//     }
//   }
// ];

export const useBooksStore = defineStore('books', {
  state: () => ({
    // Flag to indicate if books are being loaded
    isLoading: false,
    // Array to hold the books data, initially empty
    books: [],
    // Error message for API calls
    error: null,
  }),
  getters: {
    /**
     * Getter to return all books.
     * @param {object} state - The store state.
     * @returns {Array} - The array of books.
     */
    allBooks: (state) => state.books,
    RecentBooks: (state) => state.books.filter(book => book.status === 'published').slice(-5),
    getTotalAuthors(state) {
      // نرجع قائمة المؤلفين الفريدة
      const uniqueAuthors = []
      state.books.forEach(book => {
        if (book.author && !uniqueAuthors.includes(book.author)) {
          uniqueAuthors.push(book.author)
        }
      })
      return uniqueAuthors
    },
    getTotalPublishedBooks(state) {
      const uniquePublished = []
      state.books.forEach(book => {
        if (book.publishingHouse && !uniquePublished.includes(book.publishingHouse)) {
          uniquePublished.push(book.publishingHouse)
        }
      })
      return uniquePublished
    },
    getTotalCategories(state) {
      const uniqueCategories = []
      state.books.forEach(book => {
        if(book.category && !uniqueCategories.includes(book.category)) {
          uniqueCategories.push(book.category)
        }
      })
      return uniqueCategories
    }
  },
  actions: {
    /**
     * Action to fetch books from the API.
     */
    async fetchBooks() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(API_URL, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Accept': 'application/json'
          }
        });

        // تحويل بيانات API لتناسب هيكل الكتب في التطبيق
        this.books = response.data.data || response.data || [];

        // التأكد من أن كل كتاب يحتوي على الحقول المطلوبة
        this.books = this.books.map(book => ({
          ...book,
          // تحويل الحقول إذا لزم الأمر
          author: book.author_name || book.author || 'مؤلف غير معروف',
          publishingHouse: book.publisher_name || book.publishingHouse || 'ناشر غير معروف',
          category: book.category_name || book.category || 'فئة غير معروفة',
          status: book.status || 'draft',
          cover: book.cover_image ? `http://127.0.0.1:8000/storage/${book.cover_image}` : '/placeholder-book.jpg',
          publisherDate: book.published_at || book.publisherDate || new Date().toISOString().split('T')[0]
        }));
      } catch (error) {
        console.error('Error fetching books:', error);
        this.error = error.response?.data?.message || error.message || 'فشل تحميل الكتب';
        // في حالة الخطأ، نحاول تحميل بعض البيانات الافتراضية
        this.loadFallbackBooks();
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Load fallback books when API fails
     */
    loadFallbackBooks() {
      // بيانات مؤقتة للكتب في حالة فشل الاتصال بالAPI
      const fallbackBooks = [
        {
          id: 1,
          title: 'عنوان كتاب تجريبي',
          author: 'مؤلف تجريبي',
          cover: '/placeholder-book.jpg',
          description: 'وصف تجريبي للكتاب',
          stock: 10,
          publishingHouse: 'ناشر تجريبي',
          publisherDate: new Date().toISOString().split('T')[0],
          pages: 200,
          category: 'فئة تجريبية',
          language: 'العربية',
          status: 'draft',
          price: 25.99,
          rating: 4.0
        }
      ];

      this.books = fallbackBooks;
    },

    addBook(book, publisherDate) {
      const newBook = {
        id: this.books.length + 1,
        status: 'draft',
        ...book,
        publisherDate
      }

      this.books.push(newBook);
    },
    updateBook(updatedBook) {
      const index = this.books.findIndex(book => book.id === updatedBook.id);
      if (index !== -1) {
        this.books[index] = updatedBook;
      }
    },
    deleteBook(bookId) {
      this.books = this.books.filter(book => book.id !== bookId);
    }
  }
})
