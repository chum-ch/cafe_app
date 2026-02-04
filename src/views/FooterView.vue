<script setup>
import { Coffee, Mail, Phone, Heart } from 'lucide-vue-next';

</script>

<template>
  <div class="bg-slate-950 text-slate-400 py-2 border-t border-slate-900">
    <div class="max-w-7xl mx-auto px-3 flex flex-col md:flex-row justify-between items-center gap-4">

      <div class="text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-2 mb-2 text-white font-bold text-lg">
          <IconCafe :color="'#d97706'" />
          CafeMaster
        </div>
        <p class="text-sm">
          &copy; {{ new Date().getFullYear() }} Cafe Management Systems. All rights reserved.
        </p>
      </div>

      <div class="flex gap-3 text-sm">
        <a href="mailto:yoeurnchum@gmail.com" class="flex items-center gap-2 hover:text-white transition-colors">
          <Mail class="w-4 h-4" />
          <span>Support</span>
        </a>
        <a href="tel:0968785411" class="flex items-center gap-2 hover:text-white transition-colors">
          <Phone class="w-4 h-4" />
          <span>Hotline</span>
        </a>
      </div>

      <div class="text-xs bg-slate-900 py-2 px-4 rounded-full flex items-center gap-2 border border-slate-800">
        <Heart class="text-red-500 fill-red-500 animate-pulse" />
        <span>Thank you for visiting!</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
