<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LoaderWithText from '@/components/LoaderWithText.vue'
import { useLoading } from '@/composables/useLoading'
import { useUIStore } from '@/stores/ui'

const { t } = useI18n()
const uiStore = useUIStore()
const { isLoading } = useLoading(uiStore)

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen bg-black text-white px-4 py-10 font-BonaRegular">
    <div class="max-w-2xl mx-auto text-center">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <LoaderWithText :message="t('loading.general')" />
      </div>
      <div v-else>
        <h1 class="text-3xl font-bold text-[var(--color-primary)] mb-6">{{ t('contact.title') }}</h1>
        <p class="mb-8">{{ t('contact.subtitle') }}</p>

      <form class="space-y-4">
        <input
          type="text"
          :placeholder="t('contact.namePlaceholder')"
          class="w-full px-4 py-2 rounded bg-white text-black"
        />
        <input
          type="email"
          :placeholder="t('contact.emailPlaceholder')"
          class="w-full px-4 py-2 rounded bg-white text-black"
        />
        <textarea
          :placeholder="t('contact.messagePlaceholder')"
          rows="5"
          class="w-full px-4 py-2 rounded bg-white text-black"
        ></textarea>
        <button
          type="submit"
          class="bg-[var(--color-primary)] hover:bg-[var(--color-primary)] px-6 py-2 rounded text-black font-semibold transition"
        >
          {{ t('contact.sendMessage') }}
        </button>
      </form>

      <p class="mt-6 text-sm text-gray-400">
        {{ t('contact.orMessage') }}
        <a
          href="https://wa.me/966XXXXXXXXX"
          target="_blank"
          class="underline text-[var(--color-primary)]"
          >{{ t('contact.whatsapp') }}</a
        >
      </p>
      </div>
    </div>
  </div>
</template>
