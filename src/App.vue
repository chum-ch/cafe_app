<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import { inject, onMounted, ref } from "vue";
const $api = inject("$api");
const users = ref([]);
const activeLabels = ref('Dashboard');
const listUsers = async () => {
  try {
    // users.value = (await $api.user.listUsers()).data;
    // console.log("Users:", users.value);}
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
  <!-- <RouterView /> -->
  <div class="flex h-screen bg-slate-100 overflow-hidden">
    <Sidebar/>

    <main class="flex-1 overflow-auto">
      <div class="relative">
        <header class=" shadow h-16 flex items-center px-6 sticky top-0 left-0 right-0 z-10 blur-backdrop-filter backdrop-blur-sm">
          <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
        </header>
        <div class="p-6">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
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
