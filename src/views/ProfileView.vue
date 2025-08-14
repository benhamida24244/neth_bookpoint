<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/Users'
import { useCartStore } from '@/stores/Cart'
import { useOrdersStore } from '@/stores/Orders'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Pinia stores
const userStore = useUserStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const { t } = useI18n()

// Reactive state
const { user: currentUser } = storeToRefs(userStore)
const { cart } = storeToRefs(cartStore)
const { orders } = storeToRefs(ordersStore)

const userOrders = computed(() =>
  orders.value.filter(order => order.customer.email === currentUser.value.email)
)

// حساب إجمالي السعر
const totalPrice = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-BonaRegular">
    <div class="container mx-auto p-6 max-w-7xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] bg-clip-text text-transparent mb-2">
          {{ t('profile.title') }}
        </h1>
        <p class="text-gray-600 text-lg">{{ t('profile.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- User Profile Card -->
        <div class="xl:col-span-1">
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center gap-6 mb-6">
              <div class="relative">
                <img
                  :src="currentUser.avatar || 'https://randomuser.me/api/portraits/men/75.jpg'"
                  alt="User Avatar"
                  class="w-20 h-20 rounded-full shadow-lg border-4 border-white object-cover"
                />
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-1">{{ t('profile.myProfile') }}</h2>
                <p class="text-green-600 text-sm font-medium">{{ t('profile.activeAccount') }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 hover:bg-blue-50/80 transition-colors">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">{{ t('profile.name') }}</p>
                  <p class="font-semibold text-gray-800">{{ currentUser.name }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 hover:bg-blue-50/80 transition-colors">
                <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500 font-medium">{{ t('profile.email') }}</p>
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
                  <p class="font-semibold text-gray-800">{{ currentUser.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Cart and Orders -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Shopping Cart -->
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/50 overflow-hidden">
            <div class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] p-6 text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 11-4 0v-5m4 0V8a2 2 0 00-2-2H9a2 2 0 00-2 2v5"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold">{{ t('profile.shoppingCart') }}</h2>
                    <p class="text-blue-100">{{ t('profile.itemsInCart', { count: cart.length }) }}</p>
                  </div>
                </div>
                <div v-if="cart.length > 0" class="text-right">
                  <p class="text-blue-100 text-sm">{{ t('profile.total') }}</p>
                  <p class="text-2xl font-bold">${{ totalPrice.toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div v-if="cart.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="item in cart" :key="item.id"
                     class="group bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                  <div class="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <img :src="item.cover" :alt="item.name"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div class="space-y-2">
                    <h3 class="font-semibold text-gray-800 line-clamp-2">{{ item.name }}</h3>
                    <div class="flex justify-between items-center text-sm text-gray-600">
                      <span>{{ t('profile.quantity') }}: {{ item.quantity }}</span>
                      <span class="font-medium">${{ item.price }}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-lg font-bold text-blue-600">
                        ${{ (item.price * item.quantity).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 11-4 0v-5m4 0V8a2 2 0 00-2-2H9a2 2 0 00-2 2v5"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ t('profile.emptyCart') }}</h3>
                <p class="text-gray-500">{{ t('profile.emptyCartSuggestion') }}</p>
              </div>
            </div>
          </div>

          <!-- Order History -->
          <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/50 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">{{ t('profile.orderHistory') }}</h2>
                  <p class="text-emerald-100">{{ t('profile.totalOrders', { count: userOrders.length }) }}</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div v-if="userOrders.length > 0" class="space-y-6">
                <div v-for="order in userOrders" :key="order.id"
                     class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">

                  <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span class="text-blue-600 font-bold text-sm">#{{ order.id }}</span>
                        </div>
                        <div>
                          <p class="font-semibold text-gray-800">{{ t('profile.order') }} #{{ order.id }}</p>
                          <p class="text-sm text-gray-600">{{ order.date }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                          {{ order.status }}
                        </span>
                        <div class="text-right">
                          <p class="text-sm text-gray-500">{{ t('profile.total') }}</p>
                          <p class="text-xl font-bold text-gray-800">${{ order.totals.total.toFixed(2) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div v-for="item in order.items" :key="item.id"
                           class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div class="aspect-square rounded-md overflow-hidden mb-3 bg-white">
                          <img :src="item.cover" :alt="item.name"
                               class="w-full h-full object-cover" />
                        </div>
                        <div class="space-y-1">
                          <p class="font-semibold text-sm text-gray-800 line-clamp-2">{{ item.name }}</p>
                          <div class="flex justify-between text-xs text-gray-600">
                            <span>{{ t('profile.quantity') }}: {{ item.quantity }}</span>
                            <span class="font-medium">${{ item.price }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ t('profile.noOrders') }}</h3>
                <p class="text-gray-500">{{ t('profile.noOrdersSuggestion') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
