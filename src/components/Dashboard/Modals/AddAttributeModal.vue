<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  label: String,
})

const emit = defineEmits(['close', 'save'])
const name = ref('')

function closeModal() {
  emit('close')
}

function save() {
  if (!name.value) {
    alert('Please enter a name.')
    return
  }
  emit('save', name.value)
  name.value = ''
  closeModal()
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <div class="p-6 border-b">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
      </div>
      <div class="p-6">
        <form @submit.prevent="save">
          <div>
            <label :for="label" class="block text-sm font-medium text-gray-700">{{ label }}</label>
            <input
              v-model="name"
              type="text"
              :id="label"
              class="mt-2 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
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
          @click="save"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-light)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-primary)]"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
