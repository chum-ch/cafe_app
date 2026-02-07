<script setup>
defineProps({
  size: { type: [Number, String], default: 28 },
  color: { type: String, default: '#FFF' },
  strokeWidth: { type: Number, default: 2 }
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
    class="friendly-next-icon"
  >
    <circle cx="12" cy="12" r="10" class="outer-ring" />
    
    <g class="arrow-group">
      <path d="m12 8 4 4-4 4" />
      <path d="M8 12h8" />
    </g>
  </svg>
</template>

<style scoped>
.friendly-next-icon {
  overflow: visible;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.outer-ring {
  transform-origin: center;
  opacity: 0.6;
}

.arrow-group {
  /* Infinite elastic 'nudge' to the RIGHT */
  animation: arrow-nudge-right 1s ease-in-out infinite;
}

/* --- Friendly Keyframes --- */

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Adjusted to move right */
@keyframes arrow-nudge-right {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); } 
}

/* --- Interaction Style --- */

.friendly-next-icon:hover .arrow-group {
  animation: arrow-snap-right 0.6s ease-in-out infinite;
}

/* Adjusted to move right */
@keyframes arrow-snap-right {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}
</style>