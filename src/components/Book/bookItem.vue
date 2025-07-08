<template>
  <div class="group relative cursor-pointer w-44 transition-all duration-300 ease-in-out m-4 p-3 flex flex-col bg-white rounded-lg  hover:shadow-lg">
    <div class="relative mb-2 overflow-hidden rounded-md">
      <img :src="book.img" :alt="book.name" class="w-full h-52 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out" />

      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-md">
        <button class="bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-yellow-700 transition hover:scale-105">
          Quick Add
        </button>
      </div>
    </div>

    <div class="mt-auto text-center">
      <h3 class="font-bold text-md font-bona truncate" :title="book.name">{{ book.name }}</h3>
      <p class="text-sm text-gray-500 font-BonaRegular underline">{{ book.author }}</p>

      <!-- ⭐️ التقييم بالنجوم -->
      <div class="flex justify-center mt-2">
        <span v-for="i in 5" :key="i">
          <i
            class="pi"
            :class="i <= book.rating ? 'pi-star-fill text-yellow-500' : 'pi-star text-gray-400'"
            style="font-size: 1rem; margin: 0 1px"
          ></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
})
</script>
