<script setup>
import { RouterView } from 'vue-router'
import axios from "axios";
import Sidebar from './components/Sidebar.vue';
import { inject, onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import MainCafe from './components/MainCafe.vue';
import HeaderView from './views/HeaderView.vue';
import FooterView from './views/FooterView.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'; // Import this!

import { Loader2 } from 'lucide-vue-next'; // Import icon

// --- Loading State Setup ---
const isLoading = ref(false);
const loadingText = ref('Loading...');

// Reactivity Fix
const toast = useToast();
const authStore = useAuthStore();
// Use storeToRefs to keep isLoggedIn reactive
const { isLoggedIn } = storeToRefs(authStore);

// Optional: Layout logic based on Route Meta
// const route = useRoute();
// const showSidebar = computed(() => isLoggedIn.value && route.meta.layout === 'dashboard');

const $api = inject("$api");

onMounted(() => {
  try {
    axios.interceptors.request.use((config) => {
      isLoading.value = config.showLoading;
      if (config.showToast) {
        toast.add({
          severity: "success",
          summary: "Data has been submitted!",
          // detail: 'Data has been submitted!',
          life: 3000,
        });
      }

      // Config headers
      // config.headers['Accept-Language'] = locale.value;
      // console.log('local', locale.value);
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        isLoading.value = false;
        return response;
      },
      (error) => {
        isLoading.value = false;
        console.error('Error App', error);
        const { message } = error.response.data || {};
        toast.add({
          severity: "error",
          summary: `${message}` || `${error.response.statusText}` || 'Something wrong',
          // detail: ,
          life: 7000
        });
        return Promise.reject(error);
      }
    );
  } catch (error) {
    console.error("Error", error);
  } finally {
    isLoading.value = false;
    console.log('finally');
  }
});

const fullMenu = {
  "label": "Inventory",
  "key": "inventory",
  "children": [
    { "label": "All Products", "route": "/inventory/all" },
    { "label": "Stock In", "route": "/inventory/in" },
    { "label": "Stock Out", "route": "/inventory/out" }
  ]
};
const isCollapsedSidebar = ref(true);
</script>

<template>
  <div class="min-h-screen font-sans">
    <PriToast position="top-center" class="w-full p-2" />

    <MainCafe>
      <template #header>
        <HeaderView class="h-16 border-b bg-white relative z-50" />
      </template>

      <template #body>
        <div class="flex h-full relative">

          <Sidebar v-if="isLoggedIn" />

          <main class="flex-1 overflow-auto transition-all duration-300 relative"
            :class="[isLoggedIn ? (isCollapsedSidebar ? 'ml-24' : 'ml-80') : 'ml-0']">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
              leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0">
              <div v-if="isLoading"
                class="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-[2px] z-50">
                <Loader2 class="w-10 h-10 text-primary-600 animate-spin mb-3" />
                <span class="text-sm font-medium text-primary-700 dark:text-primary-300 animate-pulse">
                  Loading...
                </span>
              </div>
            </Transition>

            <div class="mx-auto">
              <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                  <component :is="Component" />
                </transition>
              </router-view>
            </div>
          </main>

        </div>
      </template>

      <template #footer>
        <FooterView />
      </template>
    </MainCafe>
  </div>
</template>

<style scoped>
.blur-bg {
  /* Translucent white */
  backdrop-filter: blur(12px);
  /* Strong blur for frosted glass look */
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */

@media (min-width: 360px) and (max-width: 768px) {}

/* --- Tablets (landscape) and Laptops --- */
/* (e.g., min-width of 768px) */
@media (min-width: 768px) and (max-width: 992px) {}

/* --- Laptops and Desktops --- */
/* (e.g., min-width of 992px) */
@media (min-width: 992px) and (max-width: 1200px) {}

/* --- Large Desktops --- */
/* (e.g., min-width of 1200px) */
@media (min-width: 1200px) {}
</style>
