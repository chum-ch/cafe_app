<script setup>
import IconCafe from '@/components/icons/IconCafe.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'; // Import this!
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
// Use storeToRefs to keep isLoggedIn reactive
const { isLoggedIn } = storeToRefs(authStore);
const  goToLogin = () => {
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
          Cafe<span class="text-amber-600">Master</span>
        </span>
      </div>

      <div class="flex items-center gap-3" v-if="isLoggedIn">
        <PriButton label="Log out" icon="pi pi-sign-out" severity="warn"
          @click="goToLogin"
          class="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        </PriButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
