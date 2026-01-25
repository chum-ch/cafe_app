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
    class="inventory-box-animated"
  >
    <path 
      class="box-shell"
      d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
    />
    
    <g class="box-lid">
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </g>

    <circle cx="12" cy="8" r="0.5" class="box-particle" fill="currentColor" />
  </svg>
</template>

<style scoped>
.inventory-box-animated {
  overflow: visible;
  /* Overall floating movement */
  animation: box-float 5s ease-in-out infinite;
}

.box-shell {
  opacity: 0.7;
  /* Infinite dash flow around the perimeter */
  stroke-dasharray: 15 35;
  animation: border-flow 6s linear infinite;
}

.box-lid {
  transform-origin: center;
  /* Lid breathes up and down slightly */
  animation: lid-peek 3s ease-in-out infinite;
  stroke-width: calc(var(--stroke-width) + 0.2);
}

.box-particle {
  opacity: 0;
  animation: particle-rise 4s ease-in-out infinite;
}

/* --- Infinite Keyframes --- */

@keyframes box-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(2deg); }
}

@keyframes border-flow {
  from { stroke-dashoffset: 50; }
  to { stroke-dashoffset: 0; }
}

@keyframes lid-peek {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05) translateY(-1px); opacity: 1; }
}

@keyframes particle-rise {
  0% { transform: translateY(5px); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-15px); opacity: 0; }
}

/* --- Hover: "The Reveal" --- */
.inventory-box-animated:hover .box-lid {
  animation-duration: 0.8s;
  stroke: #eab308; /* Turns gold/amber like a fresh shipment */
}

.inventory-box-animated:hover .box-shell {
  opacity: 1;
  stroke-width: 2.5;
}
</style>