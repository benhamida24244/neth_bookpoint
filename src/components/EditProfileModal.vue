<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerAuthStore } from '@/stores/customerAuth';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['close']);
const { t } = useI18n();

const customerAuthStore = useCustomerAuthStore();
const { user } = storeToRefs(customerAuthStore);

const formData = ref({
  name: '',
  address: '',
  phone_number: '',
  country: ''
});

onMounted(() => {
  if (user.value) {
    formData.value.name = user.value.name;
    formData.value.address = user.value.address;
    formData.value.phone_number = user.value.phone_number;
    formData.value.country = user.value.country;
  }
});

const handleSubmit = async () => {
  const success = await customerAuthStore.updateProfile(formData.value);
  if (success) {
    emits('close');
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ t('editProfile.title') }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ t('editProfile.name') }}</label>
          <input type="text" id="name" v-model="formData.name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="phone_number" class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.phone') }}</label>
          <input type="text" id="phone_number" v-model="formData.phone_number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="country" class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.country') }}</label>
          <input type="text" id="country" v-model="formData.country" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="mb-6">
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">{{ t('editProfile.address') }}</label>
          <textarea id="address" v-model="formData.address" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div class="flex justify-end gap-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">{{ t('editProfile.cancel') }}</button>
          <button type="submit" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)]">{{ t('editProfile.save') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
