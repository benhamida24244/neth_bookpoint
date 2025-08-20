<script setup>
import { ref, computed } from 'vue';
import { useClientsStore } from '@/stores/Clients';

const clientStore = useClientsStore();
const showModal = ref(false);

const clientForm = ref({
  name: '',
  email: '',
  phone: '',
  Country: ''
});

const clientToEdit = ref(null);

const isEditMode = computed(() => !!clientToEdit.value);

const openModal = (client = null) => {
  if (client) {
    clientToEdit.value = client;
    clientForm.value = { ...client };
  } else {
    clientToEdit.value = null;
    resetForm();
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  clientToEdit.value = null;
  resetForm();
};

const resetForm = () => {
  clientForm.value = {
    name: '',
    email: '',
    phone: '',
    Country: ''
  };
};

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      await clientStore.updateClient(clientToEdit.value.id, clientForm.value);
    } else {
      await clientStore.addClient(clientForm.value);
    }
    closeModal();
  } catch (error) {
    console.error("Failed to submit form:", error);
  }
};

defineExpose({
  openModal
});
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit Client' : 'Add New Client' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block mb-1 font-medium text-sm">Name</label>
            <input id="name" v-model="clientForm.name" type="text" class="w-full border rounded-lg px-3 py-2" required>
          </div>

          <div>
            <label for="email" class="block mb-1 font-medium text-sm">Email</label>
            <input id="email" v-model="clientForm.email" type="email" class="w-full border rounded-lg px-3 py-2" required>
          </div>

          <div>
            <label for="phone" class="block mb-1 font-medium text-sm">Phone</label>
            <input id="phone" v-model="clientForm.phone" type="text" class="w-full border rounded-lg px-3 py-2">
          </div>

          <div>
            <label for="country" class="block mb-1 font-medium text-sm">Country</label>
            <input id="country" v-model="clientForm.Country" type="text" class="w-full border rounded-lg px-3 py-2">
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)]">
            {{ isEditMode ? 'Save Changes' : 'Add Client' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
