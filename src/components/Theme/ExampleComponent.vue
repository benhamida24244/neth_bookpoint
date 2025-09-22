<!-- ExampleComponent.vue -->
<template>
  <div class="p-4 border rounded-lg space-y-4">
    <h3 class="text-lg font-medium">{{ t('themeExample.preview') }}</h3>

    <!-- Example Button -->
    <button
      class="px-4 py-2 text-white rounded-lg transition-all duration-200 bg-[var(--color-primary)] hover:opacity-90 active:scale-95"
    >
      {{ t('themeExample.primaryButton') }}
    </button>

    <!-- Example Card -->
    <div class="p-4 border-2 rounded-lg border-[var(--color-primary)]">
      <h4 class="text-md font-semibold">{{ t('themeExample.cardTitle') }}</h4>
      <p class="text-gray-600">{{ t('themeExample.cardDescription') }}</p>
    </div>

    <!-- Accessibility Notes -->
    <div class="text-sm text-gray-500 space-y-2">
      <h4 class="font-semibold">{{ t('themeExample.accessibilityGuidance') }}</h4>
      <ul class="list-disc list-inside">
        <li>
          <strong>{{ t('themeExample.contrast') }}:</strong> {{ t('themeExample.contrastText') }}
        </li>
        <li>
          <strong>{{ t('themeExample.hoverActiveStates') }}:</strong> {{ t('themeExample.hoverActiveStatesText') }}
        </li>
        <li>
          <strong>{{ t('themeExample.fallback') }}:</strong> {{ t('themeExample.fallbackText') }}
        </li>
      </ul>
    </div>

    <!-- Tailwind & SSR Notes -->
     <div class="text-sm text-gray-500 space-y-2">
      <h4 class="font-semibold">{{ t('themeExample.developerNotes') }}</h4>
      <ul class="list-disc list-inside">
        <li>
          <strong>{{ t('themeExample.tailwindJit') }}:</strong> {{ t('themeExample.tailwindJitText') }}
        </li>
        <li>
          <strong>{{ t('themeExample.ssrCaveat') }}:</strong> {{ t('themeExample.ssrCaveatText') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// This component is purely presentational and doesn't require any script logic.
</script>
