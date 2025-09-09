<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="w-full bg-black text-white font-BonaRegular px-4 py-10 sm:px-10 lg:px-32">
    <!-- العنوان -->
    <h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-6 text-center">
      {{ t('delivery.title') || 'We’re Always Happy to Serve You!' }}
    </h1>

    <!-- الفقرة الأولى -->
    <p class="text-base sm:text-lg leading-relaxed mb-6 text-center">
      {{ t('delivery.welcome') || 'We welcome your orders with love and are always ready to serve you!' }}
    </p>

    <!-- وقت التوصيل -->
    <div class="bg-[var(--color-primary)] text-black rounded-lg p-4 mb-6">
      <p class="text-base sm:text-lg" v-html="t('delivery.deliveryTime') || ''">
      </p>
    </div>

    <!-- خيارات الشحن -->
    <div class="space-y-4 mb-6">
      <h2 class="text-xl text-[var(--color-primary)] font-semibold mb-2">{{ t('delivery.optionsTitle') || 'Delivery Options' }}</h2>

      <ul class="list-disc list-inside space-y-2">
        <li v-html="t('delivery.homeDelivery') || ''">
        </li>
        <li v-html="t('delivery.lockerPickup') || ''">
        </li>
        <li v-html="t('delivery.freeDelivery') || ''">
        </li>
      </ul>
    </div>

    <!-- زر واتساب -->
    <div class="text-center mb-6">
      <a
        href="https://wa.me/your-whatsapp-number"
        target="_blank"
        class="inline-block bg-[var(--color-primary)] text-black px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:bg-[var(--color-primary)] transition"
      >
        {{ t('delivery.whatsapp') || 'Contact Us on WhatsApp' }}
      </a>
    </div>

    <!-- تنويه -->
    <div class="text-sm text-gray-400 text-center italic">
      <p>{{ t('delivery.note') || 'Please note: Orders cannot be canceled after payment is completed.' }}</p>
    </div>
  </div>
</template>
