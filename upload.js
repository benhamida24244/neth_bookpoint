import axios from "axios";

const API = "http://127.0.0.1:8000/api/admin/categories/"; // API للتصنيفات
const TOKEN = "1|DCIMEQjulfnmWM6WPWoLSIhob9gjHiThADaZRlpz04b4dcfb";

export const categories = [
  { name: "Adventure", description: "Exciting stories full of journeys and daring exploits.", icon: "fas fa-hiking" },
  { name: "Romance", description: "Heartwarming tales of love and relationships.", icon: "fas fa-heart" },
  { name: "Horror", description: "Stories that will send chills down your spine.", icon: "fas fa-ghost" },
  { name: "Biography", description: "Life stories of fascinating people.", icon: "fas fa-user" },
  { name: "Self-Help", description: "Guides and tips for personal development.", icon: "fas fa-lightbulb" },
  { name: "History", description: "Books that take you back in time.", icon: "fas fa-landmark" },
  { name: "Philosophy", description: "Explorations of human thought and existence.", icon: "fas fa-brain" },
  { name: "Poetry", description: "Collections of beautiful poems and verses.", icon: "fas fa-feather" },
  { name: "Comics", description: "Graphic novels and comic books.", icon: "fas fa-book-open" },
  { name: "Children", description: "Fun and educational books for kids.", icon: "fas fa-child" },
  { name: "Mystery", description: "Whodunit stories full of twists and turns.", icon: "fas fa-search" },
  { name: "Thriller", description: "Fast-paced, suspenseful reads.", icon: "fas fa-bolt" },
  { name: "Science", description: "Books that explain the wonders of the universe.", icon: "fas fa-atom" },
  { name: "Fantasy", description: "Magical worlds and epic adventures.", icon: "fas fa-dragon" },
  { name: "Travel", description: "Guides and tales from around the world.", icon: "fas fa-plane" },
  { name: "Cooking", description: "Recipes and culinary tips.", icon: "fas fa-utensils" },
  { name: "Psychology", description: "Understanding the human mind and behavior.", icon: "fas fa-brain" },
  { name: "Technology", description: "The latest in tech and innovation.", icon: "fas fa-microchip" },
  { name: "Art", description: "Exploring creativity and visual arts.", icon: "fas fa-paint-brush" },
  { name: "Spirituality", description: "Books on faith, meditation, and inner growth.", icon: "fas fa-spa" },
];

async function uploadOne(category) {
  try {
    const resp = await axios.post(API, category, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    console.log("✅ تم رفع التصنيف:", category.name, "->", resp.status);
  } catch (err) {
    if (err.response) {
      console.error("⚠️ خطأ API:", category.name, err.response.status, err.response.data);
    } else {
      console.error("⚠️ خطأ:", category.name, err.message);
    }
  }
}

(async () => {
  for (const category of categories) {
    await uploadOne(category);
  }
})();
