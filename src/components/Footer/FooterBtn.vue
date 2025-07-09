<script setup>
import LogoFooter from '@/assets/HomeIcon/Footer/LogoFooter.png'

const quickLinks = [
  { name: 'Home', href: '#' },
  { name: 'About Us', href: '#' },
  { name: 'Books', href: '#' },
  { name: 'Contact', href: '#' },
];

const branches = ['Galle', 'Kurunegala', 'Kandy', 'Colombo'];

</script>

<template>
  <footer class="bg-black border-t border-yellow-700 font-BonaRegular text-gray-300">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- About Section -->
        <div class="col-span-1 lg:col-span-1">
          <img :src="LogoFooter" alt="Neth BookPoint Logo" class="h-20 mb-4">
          <p class="text-sm">
            Visit our branches and register for our online platform to enjoy maximum benefits!
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul>
            <li v-for="link in quickLinks" :key="link.name" class="mb-2">
              <a :href="link.href" class="hover:text-white transition-colors duration-300">{{ link.name }}</a>
            </li>
          </ul>
        </div>

        <!-- Branches -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">Our Branches</h3>
          <ul>
            <li v-for="branch in branches" :key="branch" class="mb-2">
              {{ branch }}
            </li>
          </ul>
        </div>

        <!-- Social Media -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div class="flex space-x-4">
            <a href="#" aria-label="LinkedIn" class="text-gray-400 hover:text-white transition-colors duration-300">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" class="text-gray-400 hover:text-white transition-colors duration-300">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.581-.666 2.477 0 1.61.82 3.027 2.053 3.848-.764-.024-1.482-.234-2.11-.583v.06c0 2.256 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.307 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.063 1.328 4.526 2.104 7.14 2.104 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.604 .91-.658 1.7-1.477 2.323-2.41z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
        <p>&copy; 2025 | Neth BookPoint. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>
