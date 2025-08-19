<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/api.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  try {
    // استدعاء API
    const response = await login({
      email: email.value,
      password: password.value,
    })
    // إذا api.login بيرجع axios response → response.data
    const data = response.data
    // ممكن يكون token باسم ثاني
    const token = data.token || data.access_token

    // إذا الـ user موجود أو الدور مباشر
    const user = data.user || { role: data.role }
    if (!user || user.role !== 'admin') {
      errorMessage.value = 'You are not authorized to access the dashboard.'
      return
    }

    // خزن التوكن والدور
    localStorage.setItem('token', token)
    localStorage.setItem('role', user.role)

    // روح للـ Dashboard
    router.push('/dashboard')
  } catch (error) {
    // تحقق إذا فيه رد من السيرفر
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Invalid email or password.'
    } else {
      errorMessage.value = 'Something went wrong. Please try again later.'
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 font-sans relative">
      <!-- العنوان -->
      <h2 class="text-2xl font-bold text-center text-[var(--color-primary)]">Admin Login</h2>
      <p class="text-center text-gray-500 text-sm mb-6">Please sign in with your admin account</p>

      <!-- رسالة خطأ -->
      <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg">
        {{ errorMessage }}
      </div>

      <!-- النموذج -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          required
          placeholder="Admin Email"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
        />

        <input
          v-model="password"
          type="password"
          required
          placeholder="Password"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
        />

        <button
          type="submit"
          class="w-full py-3 rounded-lg font-semibold text-white bg-[var(--color-primary)] hover:opacity-90 transition"
        >
          Login
        </button>
      </form>

      <!-- رابط العودة للموقع -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Back to
        <a href="/" class="text-[var(--color-primary)] font-semibold hover:underline"> Home </a>
      </p>
    </div>
  </div>
</template>
