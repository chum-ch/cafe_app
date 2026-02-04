<script setup>
import IconCafe from '@/components/icons/IconCafe.vue';
import { Coffee, LogIn, UserPlus } from 'lucide-vue-next';

</script>

<template>
  <div class="sticky top-0 z-50 w-full backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

      <div class="style-animate-back flex items-center gap-2.5 cursor-pointer group">
        <div class="p-2 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-xl shadow-lg">
          <IconCafe />
        </div>
        <span class="text-2xl font-bold tracking-tight text-white">
          Cafe<span class="text-amber-600">Master</span>
        </span>
      </div>

      <div class="flex items-center gap-3">
        <PriButton label="Log out" icon="pi pi-sign-out" severity="warn"
          class=" style-animate-next hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        </PriButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
