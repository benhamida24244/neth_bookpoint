<script setup>
import { XCircle } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <XCircle class="w-16 h-16 text-red-500 mx-auto" />
        <h1 class="text-3xl font-bold text-gray-800 mt-4">Payment Cancelled</h1>
        <p class="text-gray-600 mt-2">Your payment process was cancelled. You have not been charged.</p>
        <div class="mt-8">
            <RouterLink
            to="/checkout"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
            Back to Checkout
            </RouterLink>
        </div>
    </div>
  </div>
</template>
