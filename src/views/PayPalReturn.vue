<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

onMounted(() => {
  // الحصول على المعلمات من عنوان URL
  const token = route.query.token
  const paymentToken = route.query.payment_token

  // التحقق من وجود المعلمات
  if (token && paymentToken) {
    // التوجيه إلى صفحة الدفع الناجحة
    router.push({
      path: '/paypal/success',
      query: { token, payment_token: paymentToken }
    })
  } else {
    // إذا لم تكن المعلمات موجودة، جلب رابط الإرجاع من التخزين المؤقت
    const returnUrl = sessionStorage.getItem('paypal_return_url') || '/paypal/success'
    // التوجيه إلى صفحة الدفع الناجحة بدون معلمات
    router.push(returnUrl)
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-xl font-bold mb-4">جاري معالجة الدف...</h1>
      <p class="text-gray-600">يرجى الانتظار بينما نقوم بمعالجة طلبك</p>
    </div>
  </div>
</template>
