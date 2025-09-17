<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// التوجيه إلى صفحة الدفع مع رسالة الإلغاء
router.push({
  path: '/payment-success',
  query: { 
    canceled: true,
    message: t('paymentSuccess.canceled')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-xl font-bold mb-4">تم إلغاء الدفع</h1>
      <p class="text-gray-600">تم إلغاء عملية الدفع الخاصة بك. يمكنك المحاولة مرة أخرى أو العودة إلى المتجر.</p>
    </div>
  </div>
</template>
