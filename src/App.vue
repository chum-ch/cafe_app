<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { inject, onMounted, ref } from "vue";
const $api = inject("$api");
const users = ref([]);
const listUsers = async () => {
  try {
    users.value = (await $api.user.listUsers()).data;
    console.log("Users:", users.value);}
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
</script>

<template>
  <RouterView />
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
