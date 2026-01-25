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
    class="organic-settings"
  >
    <path 
      class="gear-outline"
      d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
    />
    
    <circle cx="12" cy="12" r="3" class="breathing-core" />
  </svg>
</template>

<style scoped>
.organic-settings {
  overflow: visible;
  /* Gentle sway like it's hanging on a sign */
  animation: sway 6s ease-in-out infinite;
}

.gear-outline {
  transform-origin: center;
  /* Infinite rotation with a 'heartbeat' rhythm */
  animation: 
    rotate-organic 15s linear infinite,
    liquid-draw 4s ease-in-out infinite alternate;
  
  stroke-dasharray: 40 20; /* Creates segments */
  opacity: 0.8;
}

.breathing-core {
  transform-origin: center;
  animation: core-steam 3s ease-in-out infinite;
  /* Fills the center with a translucent coffee glow */
  fill: v-bind(color);
  fill-opacity: 0.1;
}

/* --- Keyframes for Liquid Effect --- */

@keyframes rotate-organic {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes liquid-draw {
  0% { stroke-dashoffset: 0; stroke-width: var(--stroke-width); }
  50% { stroke-dashoffset: 60; stroke-width: calc(var(--stroke-width) + 0.5); }
  100% { stroke-dashoffset: 120; stroke-width: var(--stroke-width); }
}

@keyframes core-steam {
  0%, 100% { transform: scale(.6); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
}

@keyframes sway {
  0%, 100% { transform: rotate(-2deg) translateX(0); }
  50% { transform: rotate(2deg) translateX(1px); }
}

/* Hover Interaction: The "Turbo" brew mode */
.organic-settings:hover .gear-outline {
  animation-duration: 4s, 1s; /* Speed up rotation and draw */
  stroke-width: 2.5;
  opacity: 1;
}

.organic-settings:hover .breathing-core {
  fill-opacity: 0.4;
  animation-duration: 1s;
}
</style>