<script setup>
const books = [
  {
    id: 1,
    title: 'The Silent Patient',
    cover: 'https://prodimage.images-bn.com/pimages/9781250301697_p0_v5_s600x595.jpg',
    date: '2025-07-10',
  },
  {
    id: 2,
    title: 'Atomic Habits',
    cover: 'https://prodimage.images-bn.com/pimages/9780735211292_p0_v2_s600x595.jpg',
    date: '2025-07-09',
  },
  {
    id: 3,
    title: 'It Ends With Us',
    cover: 'https://prodimage.images-bn.com/pimages/9781501110368_p0_v1_s600x595.jpg',
    date: '2025-07-07',
  },
  {
    id: 4,
    title: 'The Alchemist',
    cover: 'https://prodimage.images-bn.com/pimages/9780061122415_p0_v2_s600x595.jpg',
    date: '2025-07-06',
  },
]
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md">
    <h2 class="text-xl font-bold text-yellow-600 font-BonaRegular mb-4">
      📚 Recent Books
    </h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="book in books"
        :key="book.id"
        class="bg-gray-50 rounded-xl p-3 shadow-sm hover:shadow-lg transition cursor-pointer"
      >
        <img
          :src="book.cover"
          alt="book cover"
          class="w-full h-48 object-cover rounded-lg mb-2"
        />
        <h3 class="font-semibold text-slate-800 text-sm truncate">{{ book.title }}</h3>
        <p class="text-xs text-gray-500 italic">Published: {{ book.date }}</p>
      </div>
    </div>
  </div>
</template>
