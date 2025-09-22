<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCategoriesStore } from '@/stores/Categories';
import LoaderWithText from '@/components/LoaderWithText.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const categoriesStore = useCategoriesStore();

const categoryId = parseInt(route.params.id);
// ✅ **Added icon and status properties**
const categoryData = ref({
  name: '',
  description: '',
  icon: '',
  status: '', // Default to an empty string or a sensible default like 'active'
});

// Fetch the category data when the component mounts
onMounted(async () => {
  await categoriesStore.fetchCategory(categoryId);
});

// Watch for the store's category property to be populated
watch(() => categoriesStore.category, (newCategory) => {
  if (newCategory) {
    categoryData.value.name = newCategory.name;
    categoryData.value.description = newCategory.description;
    // ✅ **Populate icon and status from the store**
    categoryData.value.icon = newCategory.icon;
    categoryData.value.status = newCategory.status;
  }
});

const handleUpdateCategory = async () => {
  try {
    // The entire categoryData object (including icon and status) will be sent
    await categoriesStore.updateCategory(categoryId, categoryData.value);
    alert(t('dashboard.editCategory.successMessage'));
    router.push('/dashboard/categories');
  } catch (error) {
    console.error('Failed to update category:', error);
    alert(t('dashboard.editCategory.errorMessage'));
  }
};

const cancelEdit = () => {
  router.push('/dashboard/categories');
};
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <header class="font-BonaRegular mb-8">
      <h1 class="font-bold text-3xl text-gray-800">{{ t('dashboard.editCategory.title') }}</h1>
      <p class="text-gray-500 text-base">{{ t('dashboard.editCategory.subtitle') }}</p>
    </header>

    <div v-if="categoriesStore.isLoading" class="text-center">
      <LoaderWithText :message="t('dashboard.editCategory.loading')" />
    </div>

    <div v-else-if="categoriesStore.error" class="text-center text-red-500">
      <p>{{ categoriesStore.error }}</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      <form @submit.prevent="handleUpdateCategory">
        <div class="space-y-6">
          <div>
            <label for="category-name" class="block text-sm font-medium text-gray-700">
              {{ t('dashboard.editCategory.labels.name') }}
            </label>
            <input
              v-model="categoryData.name"
              type="text"
              id="category-name"
              class="mt-2 p-3 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              required
            />
          </div>
          <div>
            <label for="category-description" class="block text-sm font-medium text-gray-700">
              {{ t('dashboard.editCategory.labels.description') }}
            </label>
            <textarea
              v-model="categoryData.description"
              id="category-description"
              rows="5"
              class="mt-2 p-3 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label for="category-icon" class="block text-sm font-medium text-gray-700">
              {{ t('dashboard.editCategory.labels.icon') }}
            </label>
            <input
              v-model="categoryData.icon"
              type="text"
              id="category-icon"
              :placeholder="t('dashboard.editCategory.labels.iconPlaceholder')"
              class="mt-2 p-3 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            />
          </div>

          <div>
            <label for="category-status" class="block text-sm font-medium text-gray-700">
              {{ t('dashboard.editCategory.labels.status') }}
            </label>
            <select
              v-model="categoryData.status"
              id="category-status"
              class="mt-2 p-3 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              required
            >
              <option disabled value="">{{ t('dashboard.editCategory.selectDefault') }}</option>
              <option value="1">{{ t('dashboard.editCategory.statusActive') }}</option>
              <option value="0">{{ t('dashboard.editCategory.statusInactive') }}</option>
            </select>
          </div>
          </div>
        <div class="pt-8 flex justify-end gap-4">
          <button
            type="button"
            @click="cancelEdit"
            class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {{ t('dashboard.editCategory.cancel') }}
          </button>
          <button
            type="submit"
            class="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] border border-transparent rounded-lg shadow-sm hover:bg-[var(--color-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            :disabled="categoriesStore.isLoading"
          >
            {{ categoriesStore.isLoading ? t('dashboard.editCategory.loading') : t('dashboard.editCategory.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
