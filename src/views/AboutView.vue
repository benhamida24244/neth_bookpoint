<script setup>
import About from '@/assets/AboutIcon/About.png'
</script>

<template>
  <div class="w-full bg-black text-white font-BonaRegular">
    <!-- صورة العنوان -->
    <div class="flex justify-center py-6">
      <img :src="About" alt="About Us" />
    </div>

    <!-- About Us -->
    <div class="px-6 py-4">
      <h2 class="text-3xl font-bold text-yellow-600 mb-3 border-b border-yellow-600 inline-block pb-1">About Us</h2>
      <p class="text-lg leading-relaxed text-gray-200">
        Welcome to <span class="text-yellow-600 font-semibold">Neth BookPoint</span>, your trusted source for a diverse range of books catering to
        every reader's taste. Established with the mission to foster a love for reading in our
        community, we pride ourselves on providing excellent service and a wide selection of books.
        Our journey began in 2021, and since then, we have grown to become a beloved destination for
        book lovers. Below, you'll find information about our four branches, their locations, and
        contact numbers.
      </p>
    </div>

    <!-- Branches -->
    <div class="px-6 py-4 mt-6">
      <h2 class="text-3xl font-bold text-yellow-600 mb-6 border-b border-yellow-600 inline-block pb-1">Our Branches</h2>
      <div class="grid gap-6 md:grid-cols-3">
        <div class=" bg-opacity-10 p-4 rounded-lg border border-yellow-600">
          <h3 class="text-yellow-500 font-semibold text-lg mb-2">Kurunegala Branch</h3>
          <p>
            Main Street, City Center<br />
            Contact: 123-456-7890<br />
            Hours: Mon–Sat, 9AM–7PM; Sun, 10AM–5PM<br />
            🎓 Student Discounts, 🧠 Workshops, 📖 Study spaces
          </p>
        </div>
        <div class=" bg-opacity-10 p-4 rounded-lg border border-yellow-600">
          <h3 class="text-yellow-500 font-semibold text-lg mb-2">Kandy Branch</h3>
          <p>
            Main Street, City Center<br />
            Contact: 123-456-7890<br />
            Hours: Mon–Sat, 9AM–7PM; Sun, 10AM–5PM<br />
            🎓 Student Discounts, 🧠 Workshops, 📖 Study spaces
          </p>
        </div>
        <div class=" bg-opacity-10 p-4 rounded-lg border border-yellow-600">
          <h3 class="text-yellow-500 font-semibold text-lg mb-2">Colombo Branch</h3>
          <p>
            Main Street, City Center<br />
            Contact: 123-456-7890<br />
            Hours: Mon–Sat, 9AM–7PM; Sun, 10AM–5PM<br />
            🎓 Student Discounts, 🧠 Workshops, 📖 Study spaces
          </p>
        </div>
      </div>
    </div>

    <!-- Our Commitment -->
    <div class="px-6 py-8 mt-6 text-center">
      <h2 class="text-3xl font-bold text-yellow-600 mb-3 border-b border-yellow-600 inline-block pb-1">Our Commitment</h2>
      <p class="text-lg text-left leading-relaxed text-gray-200">
        At <span class="text-yellow-600 font-semibold">Neth BookPoint</span>, we are committed to providing a welcoming and inspiring environment for
        all book enthusiasts. Our branches are staffed with knowledgeable and friendly team
        members ready to assist you in finding the perfect book. Whether you're looking for the
        latest bestseller, a rare find, or a cozy place to read, we're your destination.
        We believe in the power of reading to transform lives and build community. Join us at one of
        our branches or explore our offerings online. We're here to support your reading journey and
        make your book shopping experience enjoyable and fulfilling.
      </p>
    </div>
  </div>
</template>
