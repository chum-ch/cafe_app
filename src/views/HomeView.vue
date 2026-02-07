<script setup>
import { ref, computed } from 'vue';
// --- PrimeVue Imports ---
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { Search, Filter } from 'lucide-vue-next';
import CardOrder from '@/components/CardOrder.vue';

// --- Data ---
const coffees = ref([
  {
    id: 1,
    name: 'Caramel Frappuccino',
    price: 3.95,
    category: 'Blended',
    description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
    image: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true,
    rating: 4.5
  },
  {
    id: 2,
    name: 'Midnight Mocha',
    price: 4.50,
    category: 'Hot Coffee',
    description: 'Rich dark chocolate ganache swirled into a double shot of intense espresso.',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: false,
    rating: 4.2
  },
]);

// --- Search & Filter State ---
const searchQuery = ref('');
const selectedSort = ref({ name: 'Most Popular', code: 'popular' });

const sortOptions = ref([
  { name: 'Most Popular', code: 'popular' },
  { name: 'Highest Rated', code: 'rating' },
  { name: 'Price: Low to High', code: 'price_asc' },
  { name: 'Price: High to Low', code: 'price_desc' }
]);

// --- Computed Logic ---
const filteredCoffees = computed(() => {
  let result = [...coffees.value];

  // 1. Search Filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(coffee =>
      coffee.name.toLowerCase().includes(query) ||
      coffee.category.toLowerCase().includes(query)
    );
  }

  // 2. Sorting / Filtering
  if (selectedSort.value) {
    switch (selectedSort.value.code) {
      case 'popular':
        // Show popular items first, then others
        result.sort((a, b) => (a.popular === b.popular) ? 0 : a.popular ? -1 : 1);
        break;
      case 'rating':
        // Sort by rating descending
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }
  }

  return result;
});

const addToCart = (item) => console.log('item', item);

const clearFilters = () => {
  searchQuery.value = '';
  selectedSort.value = null;
};

// Check if any filter is active
const isFilterActive = computed(() => {
  return searchQuery.value.length > 0 || selectedSort.value !== null;
});
</script>

<template>
  <div class="min-h-screen">
    <div class="sticky top-0 z-50 backdrop-blur-md px-3 pt-2">
      <div class="flex gap-2">
        <div class="w-full m-0 p-0">
          <IconField iconPosition="left">
            <InputIcon class="flex items-center justify-center">
              <Search class="w-10 h-4 text-stone-400" />
            </InputIcon>
            <InputText v-model="searchQuery" placeholder="Search coffee name..." class="w-full" />
          </IconField>
        </div>

        <div class="w-6 m-0 p-0">
          <div class="w-full">
            <Select v-model="selectedSort" :options="sortOptions" optionLabel="name" placeholder="Sort By"
              class="w-full" showClear>
            </Select>
          </div>
        </div>

      </div>
    </div>

    <div class="style-glass-back mt-4">
      <div class="flex flex-wrap justify-center gap-[2rem]" v-if="filteredCoffees.length > 0">
        <CardOrder v-for="item in filteredCoffees" :key="item.id" :item="item" @add-to-cart="addToCart" />
      </div>

      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">☕</div>
        <h3 class="text-xl font-bold text-stone-600">No coffees found</h3>
        <p class="text-stone-400">Try adjusting your search or filters.</p>
      </div>
    </div>

  </div>
</template>

<style scoped></style>