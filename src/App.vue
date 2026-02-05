<script setup>
import { RouterLink, RouterView } from 'vue-router'
import axios from "axios";
import Sidebar from './components/Sidebar.vue';
import { inject, onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import MainCafe from './components/MainCafe.vue';
import HeaderView from './views/HeaderView.vue';
import FooterView from './views/FooterView.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'; // Import this!

// Reactivity Fix
const toast = useToast();
const authStore = useAuthStore();
// Use storeToRefs to keep isLoggedIn reactive
const { isLoggedIn } = storeToRefs(authStore);

const msg = ref("Something error.");
// Optional: Layout logic based on Route Meta
// const route = useRoute();
// const showSidebar = computed(() => isLoggedIn.value && route.meta.layout === 'dashboard');

const $api = inject("$api");

onMounted(() => {
  try {
    axios.interceptors.request.use((config) => {
      if (config.showToast) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: 'Data has been submitted!',
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
        // isLoading.value = false;
        // isSkeleton.value = false;
        return response;
      },
      (error) => {
        msg.value = error.message;
        const toastObj = {
          severity: "error",
          summary: "Something went wrong",
          detail: msg.value,
          life: 7000
        }

        // console.log('Log from App.vue', error);

        if (error.response?.status >= 400 && error.response?.status < 500) {
          const { message, messageKhmer,name } = error.response.data;
          if (typeof message === "string") {
            msg.value = message;
            toastObj.summary = name;
          }
        } else if (error.status === 500 || error.response?.status === 500) {
          msg.value = t('err.server');
        } else if (error.code === "ERR_NETWORK") {
          msg.value = t('err.network');
        }

        toastObj.detail = msg.value;
        toast.add(toastObj);
        return Promise.reject(error);
      }
    );
  } catch (error) {
    console.error("Error", error);
    isLoading.value = false;
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

</script>
<template>
  <MainCafe>
    <template #header>
      <HeaderView />
    </template>

    <template #body>
      <div class="body">
        <div class="flex h-screen overflow-hidden">

          <Sidebar v-if="isLoggedIn" />

          <main class="flex-1 overflow-auto">
            <div class="relative">
              <div class="text-justify">
                <router-view v-slot="{ Component }">
                  <transition name="fade" mode="out-in">
                    <component :is="Component" />
                  </transition>
                </router-view>
              </div>
            </div>
          </main>
        </div>
      </div>
    </template>

    <template #footer>
      <FooterView />
    </template>
  </MainCafe>
</template>

<style scoped>
.blur-bg {
  background-color: rgba(255, 255, 255, 0.35);
  /* Translucent white */
  backdrop-filter: blur(12px);
  /* Strong blur for frosted glass look */
}

nav a.router-link-exact-active {
  color: var(--color-text);
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
