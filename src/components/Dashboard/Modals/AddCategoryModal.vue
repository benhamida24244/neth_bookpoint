<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close', 'save'])

const newCategory = ref({
  name: '',
  description: '',
})

function closeModal() {
  emit('close')
}

function saveCategory() {
  if (!newCategory.value.name) {
    alert('Please enter a category name.')
    return
  }
  emit('save', { ...newCategory.value })
  closeModal()
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
      <div class="p-6 border-b">
        <h3 class="text-xl font-semibold">Add New Category</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="saveCategory">
          <div class="space-y-6">
            <div>
              <label for="category-name" class="block text-sm font-medium text-gray-700"
                >Category Name</label
              >
              <input
                v-model="newCategory.name"
                type="text"
                id="category-name"
                class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="category-description" class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                v-model="newCategory.description"
                id="category-description"
                rows="4"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
      <div class="p-6 bg-gray-50 flex justify-end gap-4">
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="saveCategory"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-light)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-primary)]"
        >
          Save Category
        </button>
      </div>
    </div>
  </div>
</template>
