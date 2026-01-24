<script setup>

import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from "vue";
// Runs before the component is mounted to the DOM
onBeforeMount(() => {
  console.log('onBeforeMount: The component is about to be mounted.');
});

// Runs after the component is mounted to the DOM
onMounted(() => {
  console.log('onMounted: The component is now in the DOM.');
});

// Runs before the component's DOM is updated
onBeforeUpdate(() => {
  console.log('onBeforeUpdate: The component is about to re-render.');
});

// Runs after the component's DOM has been updated
onUpdated(() => {
  console.log('onUpdated: The component has been updated.');
});

// Runs before the component is unmounted from the DOM
onBeforeUnmount(() => {
  console.log('onBeforeUnmount: The component is about to be unmounted.');
});

// Runs after the component has been unmounted from the DOM
onUnmounted(() => {
  console.log('onUnmounted: The component has been unmounted.');
});

</script>

<template>
  <div class="my-default">
    <h1>My Default</h1>
  </div>
</template>

<style scoped>
</style>
