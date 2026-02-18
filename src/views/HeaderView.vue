<script setup>
import IconCafe from '@/components/icons/IconCafe.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'; // Import this!
import { useRouter } from "vue-router";
import { LogOut } from 'lucide-vue-next'; // Adding Bell too for consistency
const authStore = useAuthStore();
const router = useRouter();
// Use storeToRefs to keep isLoggedIn reactive
const { isLoggedIn } = storeToRefs(authStore);
const goToLogin = () => {
  router.push('/login');
  // Clean up onboarding store
  authStore.logout();
};
</script>

<template>
  <div class="sticky top-0 z-50 w-full shadow-sm bg-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">

      <div class="flex items-center gap-2.5 cursor-pointer group">
        <div class="p-2 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-xl shadow-lg">
          <IconCafe />
        </div>
        <span class="text-2xl font-bold tracking-tight text-slate-900">
          Niset<span class="text-amber-600"> Cafe Solutions</span>
        </span>
      </div>

      <div class="flex items-center gap-4" v-if="isLoggedIn">
        <div class="relative cursor-pointer transition-transform duration-200 p-2" v-tooltip.bottom="'Notifications'">
          <i class="pi pi-bell text-amber-500 mt-2" style="font-size: 1.6rem"></i>
          <PriTag value="30" severity="danger" rounded
            class="text-pink font-bold absolute -top-[-1px] -right-3 !text-[10px] !px-1.5 !min-w-[1.5rem] !h-[1.5rem] border-2 border-white shadow-md" />
        </div>

        <button @click="goToLogin" v-tooltip.bottom="'Log out'" class="cursor-pointer relative group p-1 rounded-xl flex items-center justify-center 
         bg-white/50 backdrop-blur-sm border border-slate-200 
         text-red-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 
         transition-all duration-300 ease-out 
         hover:shadow-lg hover:shadow-red-500/10 active:scale-95">
          <LogOut class="w-8 h-8 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <div
            class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-inset ring-red-500/20">
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
