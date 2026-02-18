<script setup>
import { ref, computed, onMounted, inject } from 'vue';
// --- PrimeVue Imports ---
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { Search, Filter } from 'lucide-vue-next';
import CardOrder from '@/components/CardOrder.vue';
import CartDrawer from './CartDrawer.vue';
import { ShoppingCart } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

// --- Data ---
const coffees = ref([
  // {
  //   id: 1,
  //   mood: 'hot',
  //   size: 'M',
  //   sugar: '30%',
  //   quantity: 1000,
  //   name: 'Caramel Frappuccino',
  //   price: 3.95,
  //   category: 'Blended',
  //   description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
  //   image: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   popular: true,
  //   rating: 4.5
  // },
  // {
  //   id: 2,
  //   name: 'Midnight Mocha',
  //   price: 4.50,
  //   category: 'Hot Coffee',
  //   description: 'Rich dark chocolate ganache swirled into a double shot of intense espresso.',
  //   image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   popular: false,
  //   rating: 4.2
  // },
]);

const imgDefault = 'https://placehold.co/400x400.png';
// --- Search & Filter State ---
const $api = inject('$api');
const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
const tenantId = userInfo?.TenantId;
const userId = userInfo?.EntityItemId;

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

// const addToCart = (item) => console.log('item', item);

const isCartOpen = ref(false);
const cartItems = ref([]);

// 1. Add to Cart Logic
const addToCart = (product) => {
  // Reassign ID to prevent duplicate items ID = id+size+mood+sugar

  product.id = `${product.id}-${product.mood}-${product.sugar}`;
  const quantity = 1;
  const index = cartItems.value.findIndex(item => item.id === product.id);
  if (index !== -1) {
    cartItems.value[index].quantity += quantity;
  } else {
    cartItems.value.push({ ...product, quantity });
  }
  isCartOpen.value = true; // Auto-open cart when item added
  // console.log('Create', index);
  // console.log('Items', cartItems.value);
};

const updateQuantity = ({ id, amount }) => {
  // console.log('Update ',{ id, amount });
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    // Modify existing item quantity
    item.quantity = Number(item.quantity) + amount;

    // Safety: don't let it go below 1
    if (item.quantity < 1) item.quantity = 1;
  }
};

// 3. Delete Item
const removeItem = (id) => {
  // Using filter creates a new array reference, which Vue definitely tracks
  cartItems.value = cartItems.value.filter(item => item.id !== id);
};
// 4. already checkout reset the cart
const checkout = (items) => {
  cartItems.value = [];
};


const listMenuItem = async () => {
  try {
    const response = await $api.order.listMenu(tenantId, userId);
    const restrcuturedCoffees = response.data.map(m => {
      return {
        id: m.EntityItemId,
        name: m.Name,
        price: m.Price,
        mood: m.Mood,
        sugar: m.Sugar,
        quantity: 0,
        image: m.Image || imgDefault,
        // category: 'Blended',
        // description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
        // size: 'M',
        // popular: true,
        // rating: 4.5
      }
    })
    coffees.value = restrcuturedCoffees;
    // console.log('Restructured', restrcuturedCoffees);
  } catch (error) {
    console.error('Error from list order', error);
  }
}

onMounted(async () => {
  await listMenuItem();
});

</script>

<template>
  <div class="min-h-screen">
    <div class="sticky top-0 z-10 backdrop-blur-md pt-2">
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


    <PriButton @click="isCartOpen = true"
      class=" text-white fixed bottom-[12rem] right-4 p-2 shadow-lg shadow-purple-200/50 hover:shadow-purple-200/100 active:scale-95 transition-all duration-300">
      <ShoppingCart class="" />
      <span class="font-bold ">{{ cartItems.length }}</span>
    </PriButton>

    <CartDrawer :is-open="isCartOpen" :items="cartItems" @close="isCartOpen = false" @update-quantity="updateQuantity"
      @remove-item="removeItem" @checkout="checkout" />
  </div>
</template>

<style scoped></style>