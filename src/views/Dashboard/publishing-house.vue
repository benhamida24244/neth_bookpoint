<script setup>
import { usePublishingHouseStore } from '@/stores/PublishingHouses';
import { ref, computed, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useI18n } from 'vue-i18n';
import AddPublisherModal from '@/components/Dashboard/Modals/AddPublisherModal.vue';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';

const { t } = useI18n();
const router = useRouter();
const publisherModal = ref(null);
const searchQuery = ref('');
const sortBy = ref('name');
const sortOrder = ref('asc');
const isDeleteDialogOpen = ref(false);
const publisherToDelete = ref(null);

const publishingHousesStore = usePublishingHouseStore();

onMounted(async () => {
  await publishingHousesStore.fetchPublishers();
});

const publishingHouses = computed(() => publishingHousesStore.publishingHouses);

// الخصائص المحسوبة للفلترة والترتيب
const filteredPublishingHouses = computed(() => {
  let filtered = publishingHouses.value.filter(house =>
    house.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  // ترتيب النتائج المفلترة
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

// الخصائص المحسوبة للإحصائيات (تم التأكد من صحة أسماء الحقول)
const totalOrders = computed(() =>
  filteredPublishingHouses.value.reduce((sum, house) => sum + (house.orders || 0), 0)
);

const totalBooks = computed(() =>
  filteredPublishingHouses.value.reduce((sum, house) => sum + (house.nmBook || 0), 0)
);

// خيارات حقول الترتيب
const sortFields = [
  { key: 'name', label: t('dashboard.publishingHouses.name') },
  { key: 'orders', label: t('dashboard.publishingHouses.orders') },
  { key: 'status', label: t('dashboard.publishingHouses.status') },
  { key: 'nmBook', label: t('dashboard.publishingHouses.books') }
];

// الدوال
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

const importData = async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      for (const publisher of json) {
        const formData = new FormData();
        formData.append('name', publisher.name);
        if (publisher.Description) {
            formData.append('description', publisher.Description);
        }
        if (publisher.img) {
          try {
            const response = await fetch(publisher.img);
            const blob = await response.blob();
            const fileName = publisher.name.replace(/\s+/g, "_") + ".jpg";
            const fileImg = new File([blob], fileName, { type: blob.type });
            formData.append('img', fileImg);
          }
           catch {
            console.warn(`⚠️ فشل تحميل صورة للكاتب ${publisher.name}:`, err);
           } 
        }
        if (publisher.Registration_date) {
            formData.append('Registration_date', publisher.Registration_date);
        }
        await publishingHousesStore.addPublisher(formData);
      }
      alert(t('dashboard.publishingHouses.importSuccess'));
      event.target.value = '';
    } catch (error) {
      console.error('Error during data import:', error);
      alert(t('dashboard.publishingHouses.importFailed'));
    }
  };
  reader.readAsArrayBuffer(file);
};

const triggerImport = () => {
  document.getElementById('import-input').click();
};

// دوال إجراءات CRUD
const openEditModal = (publisher) => {
  // افترض أن المكون Modal يقبل `publisher` كـ prop للتعديل
  publisherModal.value.openModal(publisher);
};

const openDeleteDialog = (publisher) => {
  publisherToDelete.value = publisher;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (publisherToDelete.value) {
    await publishingHousesStore.deletePublisher(publisherToDelete.value.id);
    isDeleteDialogOpen.value = false;
    publisherToDelete.value = null;
    // يمكنك إضافة إشعار نجاح هنا
  }
};

// إعدادات تنسيق الأرقام والعملات
const settingStore = useSettingsStore();
const formatStatus = (status) => {
 if(status === 1)
 {
  return t('dashboard.publishingHouses.active')
 }
 else
 return t('dashboard.publishingHouses.draft')
};

const formatNumber = (number) => {
  return new Intl.NumberFormat(settingStore.language).format(number);
};
</script>

<template>
  <div class="w-full sm:px-8 lg:px-16 mt-8">
    <AddPublisherModal ref="publisherModal" />

    <div v-if="isDeleteDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900">{{ t('dashboard.publishingHouses.confirmDeletion') }}</h3>
        <p class="mt-2 text-sm text-gray-600">
          {{ t('dashboard.publishingHouses.deleteConfirmation', { name: publisherToDelete?.name }) }}
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="isDeleteDialogOpen = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            {{ t('dashboard.publishingHouses.cancel') }}
          </button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            {{ t('dashboard.publishingHouses.delete') }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <div class="flex-1 w-full lg:w-auto">
        <input
          v-model="searchQuery"
          :placeholder="t('dashboard.sidebar.publishingHouses')"
          type="text"
          class="px-4 py-2 w-full bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div class="flex gap-3 w-full lg:w-auto">
        <button @click="publisherModal.openModal()" class="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex-1 lg:flex-none whitespace-nowrap">
          {{ t('dashboard.publishingHouses.addPublisher') }}
        </button>
        <button @click="exportData" class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex-1 lg:flex-none">
          {{ t('dashboard.publishingHouses.export') }}
        </button>
        <input type="file" id="import-input" @change="importData" accept=".xlsx, .xls" style="display: none" />
        <button @click="triggerImport" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-opacity flex-1 lg:flex-none">
          {{ t('dashboard.publishingHouses.import') }}
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-600 mr-2">{{ t('dashboard.publishingHouses.sortBy') }}:</span>
            <button
            v-for="field in sortFields"
            :key="field.key"
            @click="handleSort(field.key)"
            :class="[
                'px-3 py-1 text-xs rounded-full border transition-colors',
                sortBy === field.key
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            ]"
            >
            {{ field.label }} {{ getSortIcon(field.key) }}
            </button>
        </div>
        <button @click="clearFilters" class="text-sm text-blue-600 hover:underline">
            {{ t('dashboard.publishingHouses.clearFilters') }}
        </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div class="flex items-center bg-yellow-50 p-4 rounded-lg">
        <div class="flex flex-col">
          <p class="text-sm font-medium text-gray-600">{{ t('dashboard.publishingHouses.totalPublishers') }}</p>
          <span class="text-2xl font-bold text-[var(--color-primary)]">{{ filteredPublishingHouses.length }}</span>
        </div>
      </div>
      <div class="flex items-center bg-green-50 p-4 rounded-lg">
        <div class="flex flex-col">
          <p class="text-sm font-medium text-gray-600">{{ t('dashboard.publishingHouses.totalOrders') }}</p>
          <span class="text-2xl font-bold text-green-600">{{ formatNumber(totalOrders) }}</span>
        </div>
      </div>
      <div class="flex items-center bg-blue-50 p-4 rounded-lg">
        <div class="flex flex-col">
          <p class="text-sm font-medium text-gray-600">{{ t('dashboard.publishingHouses.totalBooks') }}</p>
          <span class="text-2xl font-bold text-blue-600">{{ formatNumber(totalBooks) }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-8">
      <div class="lg:hidden">
        <div v-for="house in filteredPublishingHouses" :key="house.id" class="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-semibold text-gray-900 text-lg">{{ house.name }}</h3>
            <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">#{{ house.id }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div><span class="font-medium">{{ t('dashboard.publishingHouses.orders') }}:</span> {{ formatNumber(house.orders) }}</div>
            <div><span class="font-medium">{{ t('dashboard.publishingHouses.status') }}:</span> <span :class="(formatStatus(house.status) ==='Active')? 'bg-green-400 p-1 rounded-2xl':'bg-red-400 p-1 rounded-2xl'">{{ formatStatus(house.status) }}</span></div>
            <div><span class="font-medium">{{ t('dashboard.publishingHouses.books') }}:</span> {{ formatNumber(house.nmBook) }}</div>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t">
            <button @click="router.push(`/dashboard/publishing-house/${house.id}`)" class="action-btn text-indigo-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              {{ t('dashboard.publishingHouses.view') }}
            </button>
            <button @click="openEditModal(house)" class="action-btn text-blue-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              {{ t('dashboard.publishingHouses.edit') }}
            </button>
            <button @click="openDeleteDialog(house)" class="action-btn text-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              {{ t('dashboard.publishingHouses.delete') }}
            </button>
          </div>
        </div>
      </div>

      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th @click="handleSort('name')" class="table-header">
                {{ t('dashboard.clientInfo.fullName') }} {{ getSortIcon('name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th @click="handleSort('orders')" class="table-header">
                {{ t('dashboard.sidebar.orders') }} {{ getSortIcon('orders') }}
              </th>
              <th @click="handleSort('status')" class="table-header">
                {{ t('dashboard.publishingHouses.status') }} {{ getSortIcon('status') }}
              </th>
              <th @click="handleSort('nmBook')" class="table-header">
                {{ t('dashboard.publishingHouses.books') }} {{ getSortIcon('nmBook') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('dashboard.publishingHouses.actions') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="house in filteredPublishingHouses" :key="house.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ house.name }}</div>
                <div class="text-sm text-gray-500">Founded {{ house.foundedYear }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">#{{ house.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ formatNumber(house.orders) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500"><span :class="(formatStatus(house.status) ==='Active')? 'bg-green-400':'bg-red-400'" class="text-white text-sm p-1 px-2 rounded-2xl">{{ formatStatus(house.status) }}</span></td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ formatNumber(house.nmBook) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-4">
                  <RouterLink :to="`/dashboard/publishing-house/${house.id}`" class="text-indigo-600 hover:text-indigo-800 transition-colors">{{ t('dashboard.publishingHouses.view') }}</RouterLink>
                  <button @click="openEditModal(house)" class="text-blue-600 hover:text-blue-800 transition-colors">{{ t('dashboard.publishingHouses.edit') }}</button>
                  <button @click="openDeleteDialog(house)" class="text-red-600 hover:text-red-800 transition-colors">{{ t('dashboard.publishingHouses.delete') }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredPublishingHouses.length === 0" class="text-center py-16">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('dashboard.publishingHouses.noPublishersFound') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('dashboard.publishingHouses.tryAdjustingSearch') }}</p>
        <button
          @click="clearFilters"
          class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          {{ t('dashboard.publishingHouses.clearAllFilters') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
