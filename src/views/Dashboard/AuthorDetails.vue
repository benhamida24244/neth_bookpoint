<script setup>
import { useAuthorStore } from '@/stores/Authors';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const authorStore = useAuthorStore();
const { authors } = storeToRefs(authorStore);
const route = useRoute();

const showEditModal = ref(false);
const editForm = ref({ name: '', description: '', img: '' });

const currentAuthor = computed(() => {
  const authorId = Number(route.params.id);
  if (!authorId || !Array.isArray(authors.value)) return null;
  return authors.value.find(author => author.id === authorId) || null;
});

function openEditModal() {
  if (currentAuthor.value) {
    editForm.value = {
      name: currentAuthor.value.name,
      description: currentAuthor.value.description,
      img: currentAuthor.value.img
    };
    showEditModal.value = true;
  }
}

function saveAuthor() {
  if (!currentAuthor.value) return;
  currentAuthor.value.name = editForm.value.name;
  currentAuthor.value.description = editForm.value.description;
  currentAuthor.value.img = editForm.value.img;
  showEditModal.value = false;
}
</script>

<template>
  <div v-if="currentAuthor" class="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 sm:p-6 lg:p-8 relative">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:flex">
      <div class="md:flex-shrink-0">
        <img class="h-full w-full object-cover md:w-64" :src="currentAuthor.img" :alt="`Portrait of ${currentAuthor.name}`">
      </div>
      <div class="p-8 flex-grow relative">
        <button
          @click="openEditModal"
          class="absolute right-6 top-6 bg-[var(--color-light)] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[var(--color-primary)] transition"
        >
          ✏️ Edit
        </button>
        <div class="uppercase tracking-wide text-sm text-[var(--color-primary)] font-semibold">{{ currentAuthor.Country }}</div>
        <h1 class="block mt-1 text-4xl leading-tight font-bold text-gray-900">{{ currentAuthor.name }}</h1>
        <a :href="`mailto:${currentAuthor.email}`" class="mt-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors block">{{ currentAuthor.email }}</a>

        <p class="mt-4 text-gray-700">{{ currentAuthor.description }}</p>

        <div class="mt-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Books Published</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ currentAuthor.nmbBook }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Total Orders</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ currentAuthor.Orders_count.toLocaleString() }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-base font-medium text-gray-600">Total Spent</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">${{ currentAuthor.SpendMuch.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 class="text-xl font-bold mb-4">Edit Author</h2>

        <label class="block mb-2 font-medium">Name</label>
        <input v-model="editForm.name" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

        <label class="block mb-2 font-medium">Description</label>
        <textarea v-model="editForm.description" rows="4" class="w-full border rounded-lg px-3 py-2 mb-4"></textarea>

        <label class="block mb-2 font-medium">Image URL</label>
        <input v-model="editForm.img" type="text" class="w-full border rounded-lg px-3 py-2 mb-4">

        <div class="flex justify-end gap-2 mt-4">
          <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
          <button @click="saveAuthor" class="px-4 py-2 bg-[var(--color-light)] text-white rounded-lg hover:bg-[var(--color-primary)]">Save</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center shadow-md">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline ml-2"> Author not found.</span>
    </div>
  </div>
</template>
