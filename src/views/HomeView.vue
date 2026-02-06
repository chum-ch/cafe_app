<script setup>
import { ref, computed } from 'vue';
import CardOrder from '@/components/CardOrder.vue';

// --- PrimeVue Imports ---
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { Search, Filter } from 'lucide-vue-next';

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
  {
    id: 3,
    name: 'Vanilla Oat Latte',
    price: 5.25,
    category: 'Plant Based',
    description: 'Creamy oat milk and Madagascar vanilla bean extract for a smooth treat.',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true,
    rating: 4.8
  },
  {
    id: 4,
    name: 'Caramel Frappuccino',
    price: 3.95,
    category: 'Blended',
    description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400&auto=format&fit=crop',
    popular: true,
    rating: 4.0
  },
  {
    id: 5,
    name: 'Espresso Con Panna',
    price: 3.25,
    category: 'Classic',
    description: 'A heavy-hitting double shot of espresso topped with a mountain of cold whipped cream.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop',
    popular: false,
    rating: 3.8
  },
  {
    id: 6,
    name: 'Toffee Nut Iced Latte',
    price: 5.85,
    category: 'Seasonal',
    description: 'Buttery toffee and toasted nuts blended with chilled espresso and whole milk.',
    image: 'https://images.unsplash.com/photo-1553909489-ec2175ef3f52?q=80&w=400&auto=format&fit=crop',
    popular: true,
    rating: 4.9
  },
  {
    id: 7,
    name: 'Turkish Hazelnut',
    price: 3.50,
    category: 'Traditional',
    description: 'Finely ground beans simmered with cardamom and toasted hazelnut.',
    image: 'https://images.pexels.com/photos/849646/pexels-photo-849646.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: false,
    rating: 4.1
  },
  {
    id: 8,
    name: 'Rose Water Macchiato',
    price: 4.95,
    category: 'Floral',
    description: 'Espresso marked with foam and a delicate spritz of rose water.',
    image: 'https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: false,
    rating: 3.5
  },
  {
    id: 9,
    name: 'Toffee Nut Iced Latte',
    price: 5.85,
    category: 'Seasonal',
    description: 'Buttery toffee and toasted nuts blended with chilled espresso.',
    image: 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true,
    rating: 4.9
  }
]);

// --- Search & Filter State ---
const searchQuery = ref('');
const selectedSort = ref(null);

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
    <div class="sticky top-0 z-50 backdrop-blur-md pb-2 pt-1">
      <div class="flex gap-1">
        <div class="w-full">
          <IconField iconPosition="left">
            <InputIcon class="flex items-center justify-center">
              <Search class="w-10 h-4 text-stone-400" />
            </InputIcon>
            <InputText v-model="searchQuery" placeholder="Search coffee name..." class="w-full" />
          </IconField>
        </div>

        <div class="w-6">
          <div class="w-full">
            <Select v-model="selectedSort" :options="sortOptions" optionLabel="name" placeholder="Sort By" showClear
              class="w-full !rounded-xl border-stone-200">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <Filter class="" />
                  <span class="text-stone-400 font-medium">
                    {{ slotProps.value.name }}
                  </span>
                </div>
                <span v-else class="text-stone-400 font-medium">
                  {{ slotProps.placeholder }}
                </span>
              </template>
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