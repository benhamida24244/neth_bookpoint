<template>
  <div>
    <p>{{ t('googleCallback.loggingIn') }}</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useCustomerAuthStore()

onMounted(() => {
  const token = route.query.token

  if (token) {
    authStore.token = token
    authStore.isAuthenticated = true
    localStorage.setItem('customer_token', token)
    localStorage.setItem('role', 'customer')

    router.push('/') // رجعه للصفحة الرئيسية
  } else {
    router.push('/login')
  }
})
</script>

