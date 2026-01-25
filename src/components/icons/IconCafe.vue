<script setup>
defineProps({
  size: {
    type: Number,
    default: 24,
  },
  color: {
    type: String,
    default: "#FFF" // Coffee Brown
  }
});
</script>

<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    :stroke="color" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  >
    <path d="M10 2v2" class="steam steam-1"/>
    <path d="M14 2v2" class="steam steam-2"/>
    <path d="M6 2v2"  class="steam steam-3"/>
    
    <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>
  </svg>
</template>

<style scoped>
/* Internal SVG animation for the steam */
.steam {
  opacity: 0;
  transform-origin: bottom center;
}

.steam-1 { animation: rise 2s infinite ease-out 0s; }
.steam-2 { animation: rise 2s infinite ease-out 0.5s; }
.steam-3 { animation: rise 2s infinite ease-out 1s; }

@keyframes rise {
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
  100% { opacity: 0; transform: translateY(-6px); }
}
</style>