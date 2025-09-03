// save as upload-books.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const API = "http://127.0.0.1:8000/api/admin/books/";
const TOKEN = "1|DCIMEQjulfnmWM6WPWoLSIhob9gjHiThADaZRlpz04b4dcfb";
const BASE_DIR = "C:\\Users\\LENOVO\\Desktop\\laravel\\bookpoint-api\\public\\storage\\books";

// بيانات الكتب
const books = [
  {
    file: "A_Thousand_Splendid_Suns.gif",
    title: "A Thousand Splendid Suns",
    description: "A heartbreaking story of friendship, love, and survival in Afghanistan.",
    author_id: 3,
    publisher_id: 3,
    price: 15.99,
    stock: 20,
    category_id: 5,
  },
  {
    file: "KiteRunner.jpg",
    title: "The Kite Runner",
    description: "A story of friendship and redemption, set against the backdrop of a changing Afghanistan.",
    author_id: 3,
    publisher_id: 4,
    price: 14.99,
    stock: 25,
    category_id: 3,
  },
  {
    file: "HarryPotterandphilosopherStone.jpg",
    title: "Harry Potter and the Philosopher's Stone",
    description: "The first book in the Harry Potter fantasy series.",
    author_id: 1,
    publisher_id: 2,
    price: 19.99,
    stock: 30,
    category_id: 2,
  },
  {
    file: "HarryPotterSorcersersStone.jpg",
    title: "Harry Potter and the Sorcerer's Stone",
    description: "The US edition of the first Harry Potter book.",
    author_id: 1,
    publisher_id: 5,
    price: 19.99,
    stock: 30,
    category_id: 3,
  },
  {
    file: "Jonathan-franzen-freedom.jpg",
    title: "Freedom",
    description: "A novel exploring family, love, and freedom in modern America.",
    author_id: 6,
    publisher_id: 5,
    price: 18.50,
    stock: 15,
    category_id: 2,
  },
  {
    file: "Jonathan-franzen-freedom (1).jpg",
    title: "Freedom (Alt Cover)",
    description: "Alternative edition cover of Franzen's novel.",
    author_id: 6,
    publisher_id: 1,
    price: 18.50,
    stock: 10,
    category_id: 4,
  },
  {
    file: "On_Dakika_Otuz_Sekiz_Saniye_(Şafak_novel).png",
    title: "10 Minutes 38 Seconds in This Strange World",
    description: "A novel reflecting on life, memory, and identity.",
    author_id: 8,
    publisher_id: 3,
    price: 16.99,
    stock: 20,
    category_id: 5,
  },
  {
    file: "The_Forty_Rules_of_Love_cover.jpg",
    title: "The Forty Rules of Love",
    description: "A novel blending modern and historical narratives inspired by Rumi.",
    author_id: 8,
    publisher_id: 2,
    price: 17.99,
    stock: 25,
    category_id: 3,
  },
];



async function uploadOne(book) {
  const filepath = path.join(BASE_DIR, book.file);
  if (!fs.existsSync(filepath)) {
    console.error("❌ الملف غير موجود:", filepath);
    return;
  }

  const form = new FormData();
  form.append("title", book.title);
  form.append("description", book.description);
  form.append("price", book.price);
  form.append("author_id", book.author_id);
  form.append("publisher_id", book.publisher_id);
  form.append("stock", book.stock);
  form.append("category_id", book.category_id);
  form.append("cover_image", fs.createReadStream(filepath));

  try {
    const resp = await axios.post(API, form, {
      headers: {
        ...form.getHeaders(),
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      maxBodyLength: Infinity,
    });
    console.log("✅ تم رفع الكتاب:", book.title, "->", resp.status);
  } catch (err) {
    if (err.response) {
      console.error("⚠️ خطأ API:", book.title, err.response.status, err.response.data);
    } else {
      console.error("⚠️ خطأ:", book.title, err.message);
    }
  }
}

(async () => {
  for (const book of books) {
    await uploadOne(book);
  }
})();
