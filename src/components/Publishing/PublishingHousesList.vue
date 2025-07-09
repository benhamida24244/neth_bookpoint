<script setup>
import { defineProps } from 'vue'
import PublishingHousesItem from './PublishingHousesItem.vue'

defineProps({
  PublishingHouses: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="flex gap-4 p-4 overflow-x-auto justify-center">
    <PublishingHousesItem v-for="PublishingHouse in PublishingHouses" :key="PublishingHouse.id || PublishingHouse.name" :PublishingHouse="PublishingHouse" />
    </div>
</template>
