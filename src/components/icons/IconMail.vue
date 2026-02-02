<template>
  <div 
    v-bind="$attrs"
    class="relative inline-flex items-center justify-center overflow-visible"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mail-icon"
    >
      <rect 
        x="2" y="4" width="20" height="16" rx="2" 
        class="envelope-body"
      />
      
      <path 
        d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" 
        class="envelope-flap"
      />
    </svg>

    <div 
      class="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse-slow"
      :style="{ backgroundColor: color }"
    />
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 48
  },
  color: {
    type: String,
    default: '#6F4E37'
  },
  strokeWidth: {
    type: [Number, String],
    default: 1.5
  }
});
</script>

<style scoped>
.mail-icon {
  display: block;
  /* Hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
  /* The main floating loop */
  animation: float-loop 4s ease-in-out infinite;
}

.envelope-body {
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: draw 1.2s ease-out forwards;
}

.envelope-flap {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 1s ease-out 0.8s forwards;
}

/* Keyframes for drawing the SVG lines */
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* Keyframes for the constant floating effect */
@keyframes float-loop {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-8%) rotate(1deg);
  }
  66% {
    transform: translateY(2%) rotate(-1deg);
  }
}

</style>