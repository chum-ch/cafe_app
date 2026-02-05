<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import { inject, onMounted, ref } from "vue";
import MainCafe from './components/MainCafe.vue';
import HeaderView from './views/HeaderView.vue';
import FooterView from './views/FooterView.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'; // Import this!

// Reactivity Fix
const authStore = useAuthStore();
// Use storeToRefs to keep isLoggedIn reactive
const { isLoggedIn } = storeToRefs(authStore);

// Optional: Layout logic based on Route Meta
// const route = useRoute();
// const showSidebar = computed(() => isLoggedIn.value && route.meta.layout === 'dashboard');

const $api = inject("$api");

const listUsers = async () => {
  try {
    // users.value = (await $api.user.listUsers()).data;
    // console.log("Users:", users.value);
  }
  catch (error) {
    console.error("Error list users", error);
  } finally {
    // 5. Always stop the loading state regardless of success or error
    // showSkeletonTable.value = false;
  }
};
onMounted(async () => {
  await listUsers();
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
