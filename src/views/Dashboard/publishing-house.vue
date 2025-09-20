<script setup>
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useI18n } from 'vue-i18n';
import AddPublisherModal from '@/components/Dashboard/Modals/AddPublisherModal.vue';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import LoaderWithText from '@/components/LoaderWithText.vue';

const { t } = useI18n();
const router = useRouter();
const publisherModal = ref(null);
const searchQuery = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');
const isDeleteDialogOpen = ref(false);
const publisherToDelete = ref(null);

const publishingHousesStore = usePublishingHouseStore();
const isLoading = computed(() => publishingHousesStore.isLoading);

onMounted(async () => {
  await publishingHousesStore.fetchPublishers();
});

const publishingHouses = computed(() => publishingHousesStore.publishingHouses);

const filteredPublishingHouses = computed(() => {
  let filtered = publishingHouses.value.filter(house =>
    house.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  return filtered.sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    }
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();
    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
});

const totalOrders = computed(() => filteredPublishingHouses.value.reduce((sum, house) => sum + (house.orders || 0), 0));
const totalBooks = computed(() => filteredPublishingHouses.value.reduce((sum, house) => sum + (house.nmBook || 0), 0));

const sortFields = [
  { key: 'name', label: t('dashboard.publishingHouses.name') },
  { key: 'orders', label: t('dashboard.publishingHouses.orders') },
  { key: 'status', label: t('dashboard.publishingHouses.status') },
  { key: 'nmBook', label: t('dashboard.publishingHouses.books') }
];

const clearFilters = () => {
  searchQuery.value = '';
  sortBy.value = 'name';
  sortOrder.value = 'asc';
};

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
};

const getSortIcon = (field) => {
  if (sortBy.value !== field) return '↕️';
  return sortOrder.value === 'asc' ? '↑' : '↓';
};

const exportData = () => {
  const data = filteredPublishingHouses.value.map(house => ({
    'ID': house.id,
    'Name': house.name,
    'Orders': house.orders,
    'Status': formatStatus(house.status),
    'Books': house.nmBook
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PublishingHouses');
  XLSX.writeFile(wb, 'publishing_houses.xlsx');
};

const triggerImport = () => document.getElementById('import-input').click();

const openEditModal = (publisher) => publisherModal.value.openModal(publisher);

const openDeleteDialog = (publisher) => {
  publisherToDelete.value = publisher;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (publisherToDelete.value) {
    await publishingHousesStore.deletePublisher(publisherToDelete.value.id);
    isDeleteDialogOpen.value = false;
    publisherToDelete.value = null;
  }
};

const settingStore = useSettingsStore();
const formatStatus = (status) => status === 1 ? t('dashboard.publishingHouses.active') : t('dashboard.publishingHouses.draft');
const getStatusClass = (status) => status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
const formatNumber = (number) => new Intl.NumberFormat(settingStore.language).format(number);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

</script>

<template>
  <div class="p-4 md:p-8 min-h-screen bg-gray-50">
    <AddPublisherModal ref="publisherModal" />

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="isDeleteDialogOpen = false">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold text-gray-900 ltr:text-left rtl:text-right">{{ t('dashboard.publishingHouses.confirmDeletion') }}</h3>
        <p class="mt-2 text-sm text-gray-600 ltr:text-left rtl:text-right">
          {{ t('dashboard.publishingHouses.deleteConfirmation', { name: publisherToDelete?.name }) }}
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="isDeleteDialogOpen = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">{{ t('dashboard.publishingHouses.cancel') }}</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{{ t('dashboard.publishingHouses.delete') }}</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <LoaderWithText :loading="isLoading" :message="t('phouseDetails.loading')" />
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8 font-BonaRegular ltr:text-left rtl:text-right">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ t('dashboard.sidebar.publishingHouses') }}</h1>
      </div>

      <!-- Filters and Actions -->
      <div class="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="relative">
            <i class="fas fa-search absolute top-1/2 -translate-y-1/2 text-gray-400 ltr:left-3 rtl:right-3"></i>
            <input v-model="searchQuery" :placeholder="t('dashboard.publishingHouses.searchPlaceholder')" type="text" class="w-full ltr:pl-10 rtl:pr-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-light)]"/>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 justify-start md:justify-end">
            <button @click="publisherModal.openModal()" class="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-hover)] transition-colors duration-200 whitespace-nowrap">
              {{ t('dashboard.publishingHouses.addPublisher') }}
            </button>
            <button @click="exportData" class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600">
              {{ t('dashboard.publishingHouses.export') }}
            </button>
            <input type="file" id="import-input" @change="importData" accept=".xlsx, .xls" class="hidden" />
            <button @click="triggerImport" class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600">
              {{ t('dashboard.publishingHouses.import') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-building text-xl text-blue-500"></i><div class="ltr:text-left rtl:text-right"><p class="text-sm text-gray-500">{{ t('dashboard.publishingHouses.totalPublishers') }}</p><p class="text-lg font-bold text-gray-800">{{ filteredPublishingHouses.length }}</p></div></div>
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-shopping-cart text-xl text-green-500"></i><div class="ltr:text-left rtl:text-right"><p class="text-sm text-gray-500">{{ t('dashboard.publishingHouses.totalOrders') }}</p><p class="text-lg font-bold text-gray-800">{{ formatNumber(totalOrders) }}</p></div></div>
        <div class="p-4 bg-white rounded-xl shadow-sm border flex items-center gap-4"><i class="fas fa-book text-xl text-purple-500"></i><div class="ltr:text-left rtl:text-right"><p class="text-sm text-gray-500">{{ t('dashboard.publishingHouses.totalBooks') }}</p><p class="text-lg font-bold text-gray-800">{{ formatNumber(totalBooks) }}</p></div></div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr class="ltr:text-left rtl:text-right">
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"><span class="flex items-center gap-2 cursor-pointer" @click="handleSort('name')">{{ t('dashboard.clientInfo.fullName') }} {{ getSortIcon('name') }}</span></th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"><span class="flex items-center gap-2 cursor-pointer" @click="handleSort('orders')">{{ t('dashboard.sidebar.orders') }} {{ getSortIcon('orders') }}</span></th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"><span class="flex items-center gap-2 cursor-pointer" @click="handleSort('nmBook')">{{ t('dashboard.publishingHouses.books') }} {{ getSortIcon('nmBook') }}</span></th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.publishingHouses.status') }}</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.publishingHouses.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="house in filteredPublishingHouses" :key="house.id" class="hover:bg-gray-50 ltr:text-left rtl:text-right">
              <td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-3"><img class="h-10 w-10 rounded-md object-cover" :src="`${apiBaseUrl}${house.img}`" :alt="house.name"/><span class="font-medium text-gray-900">{{ house.name }}</span></div></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatNumber(house.orders) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatNumber(house.nmBook) }}</td>
              <td class="px-6 py-4 whitespace-nowrap"><span :class="getStatusClass(house.status)" class="px-3 py-1 rounded-full text-xs font-medium">{{ formatStatus(house.status) }}</span></td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"><div class="flex items-center justify-center gap-4"><router-link :to="`/dashboard/publishing-house/${house.id}`" class="text-gray-500 hover:text-[var(--color-primary)]"><i class="far fa-eye"></i></router-link><button @click="openEditModal(house)" class="text-gray-500 hover:text-indigo-600"><i class="fas fa-pen"></i></button><button @click="openDeleteDialog(house)" class="text-gray-500 hover:text-red-600"><i class="fas fa-trash"></i></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile/Tablet Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:hidden">
        <div v-for="house in filteredPublishingHouses" :key="house.id" class="bg-white rounded-xl shadow-sm border overflow-hidden ltr:text-left rtl:text-right">
          <div class="p-4 flex items-center gap-4">
            <img class="h-16 w-16 rounded-md object-cover shadow-md" :src="`${apiBaseUrl}${house.img}`" :alt="house.name"/>
            <div>
              <h3 class="font-bold text-lg text-gray-800">{{ house.name }}</h3>
              <span :class="getStatusClass(house.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ formatStatus(house.status) }}</span>
            </div>
          </div>
          <div class="px-4 pb-4 space-y-2 text-sm">
            <div class="flex justify-between items-center border-t pt-2"><span class="text-gray-500">{{ t('dashboard.sidebar.orders') }}</span><span class="font-semibold text-gray-700">{{ formatNumber(house.orders) }}</span></div>
            <div class="flex justify-between items-center"><span class="text-gray-500">{{ t('dashboard.publishingHouses.books') }}</span><span class="font-semibold text-gray-700">{{ formatNumber(house.nmBook) }}</span></div>
          </div>
          <div class="bg-gray-50 p-3 flex justify-end gap-3">
            <router-link :to="`/dashboard/publishing-house/${house.id}`" class="text-gray-500 hover:text-[var(--color-primary)] p-2 rounded-full hover:bg-gray-100"><i class="far fa-eye"></i></router-link>
            <button @click="openEditModal(house)" class="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"><i class="fas fa-pen"></i></button>
            <button @click="openDeleteDialog(house)" class="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredPublishingHouses.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border mt-6">
        <i class="fas fa-building-user text-gray-400 text-4xl mx-auto"></i>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('dashboard.publishingHouses.noPublishersFound') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.publishingHouses.tryAdjustingSearch') }}</p>
        <button @click="clearFilters" class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)] transition-colors">
          {{ t('dashboard.publishingHouses.clearAllFilters') }}
        </button>
      </div>
    </div>
  </div>
</template>
