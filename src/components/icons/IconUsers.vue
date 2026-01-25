<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 24
  },
  color: {
    type: String,
    default: '#FFF'
  },
  strokeWidth: {
    type: Number,
    default: 1.5 // Senior tip: 1.5 is the "sweet spot" for modern UI
  },
  secondaryColor: {
    type: String,
    default: null
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
    :stroke-width="strokeWidth" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    class="icon-users transition-transform duration-300"
  >
    <path 
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" 
      :stroke="secondaryColor || color" 
      :class="{ 'opacity-60': secondaryColor }"
    />
    <path d="M16 3.128a4 4 0 0 1 0 7.744" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    
    <circle cx="9" cy="7" r="4" class="focus-head" />
  </svg>
</template>

<style scoped>
/* Senior Tip: Add a subtle hover effect directly in the icon component */
.icon-users:hover {
  transform: translateY(-1px);
}

.icon-users,.focus-head {
  stroke-dasharray: 50;
  animation: draw 1.5s ease-out infinite;
}

@keyframes draw {
  from { stroke-dashoffset: 50; }
  to { stroke-dashoffset: 0; }
}
</style>