<template>
  <RouterLink
    :to="`/book/${book.id}`"
    class="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white p-3 shadow-md transition-shadow duration-300 hover:shadow-xl"
  >
    <!-- صورة الكتاب -->
    <div class="relative mb-3 overflow-hidden rounded-md">
      <img
        :src="`${apiBaseUrl}${book.cover}`"
        :alt="book.title"
        class="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- تفاصيل الكتاب -->
    <div class="flex flex-grow flex-col items-center text-center space-y-2">
      <h3 class="font-bona truncate text-md font-bold w-full" :title="book.title">
        {{ book.title }}
      </h3>
      <p class="font-BonaRegular text-sm text-gray-600">
        {{ book.author.name }}
      </p>

      <!-- التقييم -->
      <div class="flex justify-center">
        <span v-for="i in 5" :key="i">
          <i
            class="pi mx-px text-base"
            :class="
              i <= book.rating ? 'pi-star-fill text-[var(--color-light)]' : 'pi-star text-gray-300'
            "
          ></i>
        </span>
      </div>

      <!-- السعر -->
      <p class="text-lg font-semibold text-gray-800">
        {{ book.price }} {{ settingsStore.currency }}
      </p>

      <!-- زر الإضافة إلى السلة -->
      <button
        @click.prevent="addToCart(book)"
        class="mt-2 flex-shrink-0 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[var(--color-hover)]"
      >
        {{ t('bookdetails.addToCart') }}
      </button>
    </div>
  </RouterLink>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useCartStore } from '@/stores/Cart'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const settingsStore = useSettingsStore()
const cartStore = useCartStore()

// دالة لإضافة الكتاب إلى سلة المشتريات
const addToCart = async (book) => {
  try {
    await cartStore.addToCart(book.id, 1)
    // يمكن إضافة رسالة نجاح هنا إذا رغبت
  } catch (error) {
    console.error('Failed to add book to cart:', error)
    // يمكن إضافة رسالة خطأ هنا إذا رغبت
  }
}
</script>
