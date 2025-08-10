<template>
  <div
    class="relative m-4 flex w-44 cursor-pointer flex-col rounded-lg bg-white p-3 shadow-md transition-shadow duration-300 hover:shadow-xl"
  >
    <!-- صورة الكتاب -->
    <div class="relative mb-3 overflow-hidden rounded-md">
      <img
        :src="book.cover"
        :alt="book.title"
        class="h-56 w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>

    <!-- تفاصيل الكتاب -->
    <div class="flex flex-grow flex-col items-center text-center space-y-2">
      <h3
        class="font-bona truncate text-md font-bold w-full"
        :title="book.title"
      >
        {{ book.title }}
      </h3>
      <p class="font-BonaRegular text-sm text-gray-600">
        {{ book.author }}
      </p>

      <!-- التقييم -->
      <div class="flex justify-center">
        <span v-for="i in 5" :key="i">
          <i
            class="pi mx-px text-base"
            :class="i <= book.rating ? 'pi-star-fill text-yellow-500' : 'pi-star text-gray-300'"
          ></i>
        </span>
      </div>

      <!-- السعر -->
      <p class="text-lg font-semibold text-gray-800">
        ${{ book.price }}
      </p>

      <!-- زر الإضافة إلى السلة -->
      <button
        class="mt-2 rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-yellow-700"
      >
        Add to Cart
      </button>
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
