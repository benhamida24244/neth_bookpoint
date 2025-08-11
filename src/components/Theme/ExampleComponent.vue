<!-- ExampleComponent.vue -->
<template>
  <div class="p-4 border rounded-lg space-y-4">
    <h3 class="text-lg font-medium">Component Preview</h3>

    <!-- Example Button -->
    <button
      class="px-4 py-2 text-white rounded-lg transition-all duration-200 bg-[var(--color-primary)] hover:opacity-90 active:scale-95"
    >
      Primary Button
    </button>

    <!-- Example Card -->
    <div class="p-4 border-2 rounded-lg border-[var(--color-primary)]">
      <h4 class="text-md font-semibold">Card Title</h4>
      <p class="text-gray-600">This card's border uses the primary color.</p>
    </div>

    <!-- Accessibility Notes -->
    <div class="text-sm text-gray-500 space-y-2">
      <h4 class="font-semibold">Accessibility Guidance:</h4>
      <ul class="list-disc list-inside">
        <li>
          <strong>Contrast:</strong> Ensure text on a primary color background has sufficient contrast. For these colors, white text (or a very light gray) is generally safe. Use a contrast checker tool if you're unsure.
        </li>
        <li>
          <strong>Hover & Active States:</strong> Provide clear visual feedback for interactive elements. The example button uses `hover:opacity-90` and `active:scale-95` for this purpose. Avoid relying on color alone to convey state.
        </li>
        <li>
          <strong>Fallback:</strong> The `bg-[var(--color-primary)]` syntax relies on a CSS variable. The fallback defined in `main.css` is crucial for when the variable isn't set.
        </li>
      </ul>
    </div>

    <!-- Tailwind & SSR Notes -->
     <div class="text-sm text-gray-500 space-y-2">
      <h4 class="font-semibold">Developer Notes:</h4>
      <ul class="list-disc list-inside">
        <li>
          <strong>Tailwind JIT:</strong> This works because Tailwind's Just-In-Time (JIT) compiler sees the `bg-[var(--color-primary)]` class and generates the corresponding CSS. No special `tailwind.config.js` safelisting is needed for this approach.
        </li>
        <li>
          <strong>SSR Caveat:</strong> On the server-side (SSR), `localStorage` is not available. The initial color will always be the default from the store. The correct color will be applied on the client-side once the app hydrates. This might cause a brief flicker of the default color on first load for users with a non-default theme.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// This component is purely presentational and doesn't require any script logic.
</script>
