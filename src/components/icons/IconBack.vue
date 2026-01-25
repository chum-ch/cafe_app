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
    class="friendly-back-icon"
  >
    <circle cx="12" cy="12" r="10" class="outer-ring" />
    
    <g class="arrow-group">
      <path d="m12 8-4 4 4 4" />
      <path d="M16 12H8" />
    </g>
  </svg>
</template>

<style scoped>
.friendly-back-icon {
  overflow: visible;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.outer-ring {
  transform-origin: center;
  stroke-dasharray: 40 22.8; /* Creates a broken, friendly line */
  animation: ring-rotate .5s linear infinite;
  opacity: 0.6;
}

.arrow-group {
  /* Infinite elastic 'nudge' to the left */
  animation: arrow-nudge 1s ease-in-out infinite;
}

/* --- Friendly Keyframes --- */

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes arrow-nudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-3px); } /* Friendly nudge back */
}

/* --- Interaction Style --- */
.friendly-back-icon:hover {
  transform: scale(1.15);
}

.friendly-back-icon:hover .arrow-group {
  animation: arrow-snap 0.6s ease-in-out infinite;
}

.friendly-back-icon:hover .outer-ring {
  opacity: 1;
  stroke-dasharray: 10 5;
  animation-duration: 2s;
}

@keyframes arrow-snap {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-5px); }
}
</style>