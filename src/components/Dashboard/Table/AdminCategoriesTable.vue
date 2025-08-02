<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const sortedCategories = computed(() =>
  props.categories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N.Books</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(category, index) in sortedCategories"
            :key="category.id"
            class="hover:bg-gray-50 transition-colors duration-200"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[getStatusClass(category.status), 'px-3 py-1 rounded-full text-xs font-medium']">
                {{ category.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.orders }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.nmBook }}</td>


            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ new Date(category.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <RouterLink
                :to="`/dashboard/categories/${category.id}`"
                class="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm font-medium"
              >
                <i class="far fa-eye"></i> View
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="categories.length === 0" class="p-12 text-center">
      <div class="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="fas fa-folder-open text-gray-400 text-3xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
      <p class="text-gray-500">Try adding new categories to populate this dashboard.</p>
    </div>
  </div>
</template>
