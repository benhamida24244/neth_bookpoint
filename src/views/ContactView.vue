<template>
  <div class="min-h-screen bg-black text-white px-4 py-10 font-BonaRegular">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-3xl font-bold text-yellow-600 mb-6">Contact Us</h1>
      <p class="mb-8">We're happy to hear from you! Fill the form below or reach us via WhatsApp.</p>

      <form class="space-y-4">
        <input type="text" placeholder="Your Name" class="w-full px-4 py-2 rounded bg-white text-black" />
        <input type="email" placeholder="Your Email" class="w-full px-4 py-2 rounded bg-white text-black" />
        <textarea placeholder="Your Message" rows="5" class="w-full px-4 py-2 rounded bg-white text-black"></textarea>
        <button type="submit" class="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded text-black font-semibold transition">
          Send Message
        </button>
      </form>

      <p class="mt-6 text-sm text-gray-400">
        Or message us directly via
        <a href="https://wa.me/966XXXXXXXXX" target="_blank" class="underline text-yellow-600">WhatsApp</a>
      </p>
    </div>
  </div>
</template>
