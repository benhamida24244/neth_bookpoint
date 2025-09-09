<script setup lang="ts">
import AuthorsList from '@/components/Author/AuthorsPage/AuthorsList.vue';
import { useAuthorStore } from '@/stores/Authors';
import { onMounted,computed } from 'vue';

const authorsStore = useAuthorStore();
onMounted(async () => {
  try {
    await authorsStore.fetchAuthors();
    window.scrollTo(0,0);
  } catch (err) {
    console.error('Failed to load authors:', err);
  }
});
const authors = computed(() => authorsStore.authors);
</script>

<template>
  <AuthorsList :authors="authors"/>
</template>
