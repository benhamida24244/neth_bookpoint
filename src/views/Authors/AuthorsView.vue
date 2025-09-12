<script setup lang="ts">
import AuthorsList from '@/components/Author/AuthorsPage/AuthorsList.vue';
import { useAuthorStore } from '@/stores/Authors';
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import LoaderWithText from '@/components/LoaderWithText.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authorsStore = useAuthorStore();
const { authors, isLoading } = storeToRefs(authorsStore);

onMounted(async () => {
  try {
    await authorsStore.fetchAuthors();
    window.scrollTo(0,0);
  } catch (err) {
    console.error('Failed to load authors:', err);
  }
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <LoaderWithText :message="t('loading.authors')" />
  </div>
  <AuthorsList v-else :authors="authors"/>
</template>
