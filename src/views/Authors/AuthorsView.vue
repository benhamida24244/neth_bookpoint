<script setup lang="ts">
import AuthorsList from '@/components/Author/AuthorsPage/AuthorsList.vue';
import { useAuthorStore } from '@/stores/Authors';

const authorsStore = useAuthorStore();
const authors = authorsStore.authors;
</script>

<template>
  <AuthorsList :authors="authors"/>
</template>
