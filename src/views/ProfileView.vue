<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/Auth';
import { useOrdersStore } from '@/stores/Orders';

const authStore = useAuthStore();
const { user: currentUser, loading: authLoading } = storeToRefs(authStore);

const ordersStore = useOrdersStore();
const { orders, loading: ordersLoading, error: ordersError } = storeToRefs(ordersStore);

onMounted(() => {
    ordersStore.fetchOrders();
});
import { storeToRefs } from 'pinia'
import { useCustomerAuthStore } from '@/stores/customerAuth' // Corrected import
import { useCartStore } from '@/stores/Cart'
import { useOrdersStore } from '@/stores/Orders'
import { computed, onMounted, ref } from 'vue' // Imported onMounted and ref
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import EditProfileModal from '@/components/EditProfileModal.vue';

// Pinia stores
const authStore = useCustomerAuthStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const { t } = useI18n()
const router = useRouter()

// Reactive state
const { currentUser } = storeToRefs(authStore)
const { cart } = storeToRefs(cartStore)
const { orders: userOrders, loading: ordersLoading, error: ordersError } = storeToRefs(ordersStore) // Use orders directly

const showEditModal = ref(false);

// Fetch data on component mount
onMounted(() => {
  // authStore.fetchProfile(); // This should be called on auto-login, not every time profile is viewed
  ordersStore.fetchOrders();
})

const handleLogout = async () => {
  await authStore.logout();
  router.push('/'); // Redirect to home page after logout
};

// حساب إجمالي السعر
const totalPrice = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
)

const formatOrderDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    return amount.toFixed(2);
}

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-BonaRegular">
    <div class="container mx-auto p-6 max-w-7xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] bg-clip-text text-transparent mb-2">
          {{ $t('profile.title') }}
        </h1>
        <p class="text-gray-600 text-lg">{{ $t('profile.subtitle') }}</p>
      </div>

      <div v-if="authLoading">{{ $t('profile.loadingProfile') }}</div>
      <div v-else-if="currentUser" class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Loading State -->
      <div v-if="!currentUser && authStore.isLoading" class="text-center py-20">
        <p>Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="authStore.error" class="text-center py-20 text-red-500">
        <p>Failed to load profile: {{ authStore.error }}</p>
      </div>

      <div v-else-if="currentUser" class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- User Profile Card -->
        <div class="xl:col-span-1">
          <div class="relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center gap-6 mb-6">
              <div class="relative">
                <img
                  :src="currentUser.avatar_url || 'https://randomuser.me/api/portraits/men/75.jpg'"
                  alt="User Avatar"
                  class="w-20 h-20 rounded-full shadow-lg border-4 border-white object-cover"
                />
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-1">{{ $t('profile.myProfile') }}</h2>
                <p class="text-green-600 text-sm font-medium">{{ $t('profile.activeAccount') }}</p>
              </div>
            </div>
            <button @click="showEditModal = true" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"></path></svg>
            </button>

            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 hover:bg-blue-50/80 transition-colors">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">{{ $t('profile.name') }}</p>
                  <p class="font-semibold text-gray-800">{{ currentUser.name }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 hover:bg-blue-50/80 transition-colors">
                <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">{{ $t('profile.email') }}</p>
                  <p class="font-semibold text-gray-800">{{ currentUser.email }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 hover:bg-blue-50/80 transition-colors">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">{{ t('profile.address') }}</p>
                  <p class="font-semibold text-gray-800">{{ currentUser.address || 'Not set' }}</p>
                </div>
              </div>
            </div>

            <button @click="handleLogout" class="w-full mt-6 bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
              {{ t('profile.logout') }}
            </button>

          </div>
        </div>

        <!-- Right Side - Orders -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Order History -->
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/50 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">{{ $t('profile.orderHistory') }}</h2>
                  <p class="text-emerald-100">{{ $t('profile.totalOrdersText', { count: orders.length }) }}</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div v-if="ordersLoading" class="text-center">{{ $t('profile.loadingOrders') }}</div>
              <div v-else-if="ordersError" class="text-center text-red-500">{{ ordersError }}</div>
              <div v-else-if="orders.length > 0" class="space-y-6">
                <div v-for="order in orders" :key="order.id"
              <div v-if="ordersLoading" class="text-center py-12">
                <p>Loading orders...</p>
              </div>
              <div v-else-if="ordersError" class="text-center py-12 text-red-500">
                <p>{{ ordersError }}</p>
              </div>
              <div v-else-if="userOrders.length > 0" class="space-y-6">
                <div v-for="order in userOrders" :key="order.id"
                     class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span class="text-blue-600 font-bold text-sm">#{{ order.id }}</span>
                        </div>
                        <div>
                          <p class="font-semibold text-gray-800">{{ $t('profile.orderId', { id: order.id }) }}</p>
                          <p class="text-sm text-gray-600">{{ new Date(order.created_at).toLocaleDateString() }}</p>
                          <p class="font-semibold text-gray-800">{{ t('profile.order') }} #{{ order.id }}</p>
                          <p class="text-sm text-gray-600">{{ formatOrderDate(order.created_at) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                          {{ order.status }}
                        </span>
                        <div class="text-right">
                          <p class="text-sm text-gray-500">{{ $t('profile.total') }}</p>
                          <p class="text-xl font-bold text-gray-800">${{ parseFloat(order.total_price).toFixed(2) }}</p>
                          <p class="text-sm text-gray-500">{{ t('profile.total') }}</p>
                          <p class="text-xl font-bold text-gray-800">${{ formatCurrency(order.total) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div v-for="item in order.items" :key="item.id"
                           class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div class="aspect-square rounded-md overflow-hidden mb-3 bg-white">
                          <img :src="item.book.cover_image_url" :alt="item.book.title"
                          <img :src="item.book.cover_image_url" :alt="item.book.title"
                               class="w-full h-full object-cover" />
                        </div>
                        <div class="space-y-1">
                          <p class="font-semibold text-sm text-gray-800 line-clamp-2">{{ item.book.title }}</p>
                          <p class="font-semibold text-sm text-gray-800 line-clamp-2">{{ item.book.title }}</p>
                          <div class="flex justify-between text-xs text-gray-600">
                            <span>{{ $t('profile.quantityText', { quantity: item.quantity }) }}</span>
                            <span class="font-medium">${{ parseFloat(item.price).toFixed(2) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ $t('profile.noOrdersFound') }}</h3>
                <p class="text-gray-500">{{ $t('profile.noOrdersYet') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
          {{ $t('profile.loginToView') }}
      </div>
      <div v-else class="text-center py-20">
        <p>Please log in to see your profile.</p>
      </div>
    </div>
    <EditProfileModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>
