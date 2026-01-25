<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: () => 24,
  },
});
</script>
<template>
<svg xmlns="http://www.w3.org/2000/svg" :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" stroke="#6F4E37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>
</svg>
</template>
