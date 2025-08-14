import { defineStore } from "pinia";

// Static data for categories. In a real application, this would come from an API.
const staticCategories = [
  {
    id: 1,
    name: 'Mystery & Thriller',
    icon: 'pi-search',
    description: 'Exploring suspense and thrillers.',
    status: 'active',
    orders: 43,
    nmBook: 12,
    createdAt: '2025-07-10T12:00:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 2,
    name: 'Science Fiction',
    icon: 'pi-globe',
    description: 'Futuristic and scientific imagination.',
    status: 'active',
    orders: 58,
    nmBook: 25,
    createdAt: '2025-07-09T11:30:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 3,
    name: 'Fantasy',
    icon: 'pi-sparkles',
    description: 'Magical and mythical worlds.',
    status: 'active',
    orders: 75,
    nmBook: 33,
    createdAt: '2025-07-08T15:10:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 4,
    name: 'Romance',
    icon: 'pi-heart-fill',
    description: 'Love and emotional stories.',
    status: 'active',
    orders: 92,
    nmBook: 40,
    createdAt: '2025-07-07T09:05:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 5,
    name: 'History',
    icon: 'pi-book',
    description: 'Historical events and biographies.',
    status: 'inactive',
    orders: 21,
    nmBook: 18,
    createdAt: '2025-07-06T18:45:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 6,
    name: 'Kids',
    icon: 'pi-prime',
    description: 'Fun stories for children.',
    status: 'active',
    orders: 110,
    nmBook: 50,
    createdAt: '2025-07-05T10:20:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 7,
    name: 'Biography',
    icon: 'pi-user',
    description: 'Life stories of influential people.',
    status: 'active',
    orders: 35,
    nmBook: 15,
    createdAt: '2025-07-04T13:00:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 8,
    name: 'Cooking',
    icon: 'pi-apple',
    description: 'Recipes and culinary arts.',
    status: 'active',
    orders: 48,
    nmBook: 22,
    createdAt: '2025-07-03T16:50:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 9,
    name: 'Self-Help',
    icon: 'pi-sun',
    description: 'Guides for personal development.',
    status: 'inactive',
    orders: 65,
    nmBook: 28,
    createdAt: '2025-07-02T11:15:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
  {
    id: 10,
    name: 'Comics & Graphic Novels',
    icon: 'pi-palette',
    description: 'Visual storytelling.',
    status: 'active',
    orders: 88,
    nmBook: 45,
    createdAt: '2025-07-01T20:00:00Z',
    color: 'bg-[var(--color-primary)]',
    url: '#',
  },
];

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    isLoading: false,
    isOpenEdit: false,
    // Array to hold the categories data, initially empty
    categories: [],
    statistics: [
      {
        id: 1,
        name: 'Total Orders',
        icon: 'fas fa-layer-group',
        value: 21,
        color: 'bg-blue-500',
        ariaLabel: '21 total orders',
      },
      {
        id: 2,
        name: 'Total Books',
        icon: 'fas fa-book',
        value: 234,
        color: 'bg-green-500',
        ariaLabel: '234 total books',
      },
      {
        id: 3,
        name: 'Total Profit',
        icon: 'fas fa-dollar-sign',
        value: 2343,
        color: 'bg-[var(--color-light)]',
        ariaLabel: '$2,343 total profit',
        prefix: '$',
      },
    ]
  }),

  getters: {
    /**
     * Getter to return all categories.
     * @param {object} state - The store state.
     * @returns {Array} - The array of categories.
     */
    allCategories: (state) => {
      console.log('categories from getter', state.categories);
      return state.categories;
    },

    getCurrentCategory: (state) => (currentId) => {
      return state.categories.find((cat) => cat.id === currentId) || {
        name: 'Unknown Category',
        description: 'No description available.',
      }
    },

    getCurrentCategoryIndex: (state) => (currentId) => {
      return state.categories.findIndex((cat) => cat.id === currentId)
    },

    formattedStatistics: (state) => {
      return state.statistics.map((stat) => ({
        ...stat,
        displayValue: stat.prefix
          ? `${stat.prefix}${stat.value.toLocaleString()}`
          : stat.value.toLocaleString(),
      }))
    },
    getNew: (state) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return state.categories.filter(category => {
    const createdDate = new Date(category.createdAt);
    return createdDate >= threeMonthsAgo;
  });
}

  },


  actions: {
    /**
     * Action to fetch categories from a simulated API.
     */
    async fetchCategories() {
      this.isLoading = true;
      // Simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real application, you would fetch data from an API here.
      this.categories = staticCategories;
      this.isLoading = false;
    },

    handleEdit() {
      this.isOpenEdit = !this.isOpenEdit
    },

    handleImageError(event) {
      event.target.src = '/placeholder-book.jpg'
    },

    editName(currentId) {
      const currentCategory = this.getCurrentCategory(currentId)
      const currentCategoryIndex = this.getCurrentCategoryIndex(currentId)

      const newName = prompt('Enter new category name:', currentCategory.name)
      if (newName && currentCategoryIndex !== -1) {
        this.categories[currentCategoryIndex].name = newName
      }
    },

    editDescription(currentId) {
      const currentCategory = this.getCurrentCategory(currentId)
      const currentCategoryIndex = this.getCurrentCategoryIndex(currentId)

      const newDescription = prompt('Enter new category description:', currentCategory.description)
      if (newDescription && currentCategoryIndex !== -1) {
        this.categories[currentCategoryIndex].description = newDescription
      }
    },

    editImage(currentId) {
      const currentCategory = this.getCurrentCategory(currentId)
      const currentCategoryIndex = this.getCurrentCategoryIndex(currentId)

      const newImage = prompt('Enter new category image URL:', currentCategory.icon || '')
      if (newImage && currentCategoryIndex !== -1) {
        this.categories[currentCategoryIndex].icon = newImage
      }
    },

    unpublish(currentId) {
      const currentCategoryIndex = this.getCurrentCategoryIndex(currentId)

      if (currentCategoryIndex !== -1) {
        this.categories[currentCategoryIndex].status = 'inactive'
        alert('Category unpublished.')
      }
    },
    addCategory(category) {
      const newCategory = {
        id: this.categories.length + 1,
        status: 'active',
        createdAt: new Date().toISOString(),
        ...category
      };
      this.categories.push(newCategory);
    },
    updateCategory(updatedCategory) {
      const index = this.categories.findIndex(category => category.id === updatedCategory.id);
      if (index !== -1) {
        this.categories[index] = updatedCategory;
      }
    }
  }
})
