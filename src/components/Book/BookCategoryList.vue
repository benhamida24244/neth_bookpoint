<script setup>

// استيراد الأنماط
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BookItemsCategory from './BookItemsCategory.vue'

const BestSellerBook = [
  {
    id: 1,
    name: 'We Are Not Strangers',
    author: 'Joshunda Sanders',
    rating: 3.5,
    price: 12.99,
    img: 'https://m.media-amazon.com/images/I/81WcnNQ-TBL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    id: 2,
    name: 'Wreck: A Novel',
    author: 'Cathrine Newman',
    rating: 4.5,
    price: 14.5,
    img: 'https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg',
  },
  {
    id: 3,
    name: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    rating: 2,
    price: 11.0,
    img: 'https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg',
  },
  {
    id: 4,
    name: 'The Midnight Library',
    author: 'Matt Haig',
    rating: 5,
    price: 16.25,
    img: 'https://images-na.ssl-images-amazon.com/images/I/91zbi9M+mKL.jpg',
  },
  {
    id: 5,
    name: 'The Silent Patient',
    author: 'Alex Michaelides',
    rating: 4,
    price: 13.75,
    img: 'https://images-na.ssl-images-amazon.com/images/I/81bGKUa1e0L.jpg',
  },
  {
    id: 6,
    name: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    rating: 4.5,
    price: 15.5,
    img: 'https://images-na.ssl-images-amazon.com/images/I/81-vv6O8HnL.jpg',
  },
  {
    id: 7,
    name: 'It Ends with Us',
    author: 'Colleen Hoover',
    rating: 2.5,
    price: 10.99,
    img: 'https://images-na.ssl-images-amazon.com/images/I/81s0B6NYXML.jpg',
  },
  {
    id: 8,
    name: 'Verity',
    author: 'Colleen Hoover',
    rating: 3.5,
    price: 12.49,
    img: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
  },
  {
    id: 9,
    name: 'The House in the Cerulean Sea',
    author: 'TJ Klune',
    rating: 5,
    price: 17.0,
    img: 'https://images-na.ssl-images-amazon.com/images/I/91NKNlVw6FL.jpg',
  },
  {
    id: 10,
    name: 'The Alchemist',
    author: 'Paulo Coelho',
    rating: 4,
    price: 13.0,
    img: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
  },
  {
    id: 11,
    name: 'Atomic Habits',
    author: 'James Clear',
    rating: 5,
    price: 18.5,
    img: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
  },
  {
    id: 12,
    name: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    rating: 1,
    price: 9.75,
    img: 'https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg',
  },
  {
    id: 13,
    name: 'The Book Thief',
    author: 'Markus Zusak',
    rating: 2,
    price: 11.99,
    img: 'https://images-na.ssl-images-amazon.com/images/I/81e+tdJpQ5L.jpg',
  },
  {
    id: 14,
    name: 'A Man Called Ove',
    author: 'Fredrik Backman',
    rating: 3.5,
    price: 12.25,
    img: 'https://images-na.ssl-images-amazon.com/images/I/91zO+ezrFCL.jpg',
  },
  {
    id: 15,
    name: 'Lessons in Chemistry',
    author: 'Bonnie Garmus',
    rating: 4,
    price: 14.99,
    img: 'https://images-na.ssl-images-amazon.com/images/I/81Amg7V9CwL.jpg',
  },
]

</script>

<template>
  <div class="relative flex flex-wrap justify-center w-full max-w-6xl mx-auto px-4">
        <BookItemsCategory v-for="book in BestSellerBook" :book="book" />
  </div>
</template>
