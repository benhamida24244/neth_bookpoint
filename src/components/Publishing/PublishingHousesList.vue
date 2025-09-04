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
  <div class="gap-4 p-4 overflow-x-auto">
    <div class="inline-flex gap-4">
      <PublishingHousesItem v-for="PublishingHouse in PublishingHouses" :key="PublishingHouse.id || PublishingHouse.name" :PublishingHouse="PublishingHouse" />
    </div>
    </div>
</template>
