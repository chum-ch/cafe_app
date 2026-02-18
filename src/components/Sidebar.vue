<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SquareMenu,
  Circle,
  Coffee,       // For Barista
} from 'lucide-vue-next';
import IconCafe from './icons/IconCafe.vue';
import IconSettings from './icons/IconSettings.vue';
import IconUsers from './icons/IconUsers.vue';
import IconBox from './icons/IconBox.vue';
import { useAuthStore } from '@/stores/auth';

const isCollapsed = ref(true);
const expandedMenus = ref({});

const route = useRoute();
const router = useRouter();
const { emit } = getCurrentInstance();
const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
defineEmits(['routeChange']);

const menuItems = [
  { label: 'Users', icon: IconUsers, route: '/users', key: 'users' },
  { label: 'Menu', icon: SquareMenu, route: '/menu', key: 'menu' },
  { label: 'Barista', icon: Coffee, route: '/barista', key: 'barista' },
  {
    label: 'Inventory',
    icon: IconBox,
    key: 'inventory',
    children: [
      { label: 'All Products', route: '/inventory/all' },
      { label: 'Stock In', route: '/inventory/in' },
      { label: 'Stock Out', route: '/inventory/out' },
    ]
  },
  { label: 'Settings', icon: IconSettings, route: '/settings', key: 'settings' }
];

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  if (isCollapsed.value) expandedMenus.value = {};
};

const handleMenuClick = (item) => {
  emit('routeChange', item);

  if (item.children) {
    // If it's a dropdown, we MUST expand sidebar to see the children
    if (isCollapsed.value) {
      isCollapsed.value = false;
      setTimeout(() => { expandedMenus.value[item.key] = true; }, 150);
    } else {
      expandedMenus.value[item.key] = !expandedMenus.value[item.key];
    }
  } else {
    // Standard navigation: Navigate and then AUTO-COLLAPSE
    router.push(item.route);
    isCollapsed.value = true; // <--- This keeps it tidy
    expandedMenus.value = {};
  }
};

const isActive = (item) => {
  if (item.route) return route.path === item.route;
  if (item.children) return item.children.some(child => child.route === route.path);
  return false;
};

const getTooltip = (label) => isCollapsed.value ? { value: label, showDelay: 200 } : null;
</script>

<template>
  <Transition name="fade">
    <div v-if="!isCollapsed" @click="isCollapsed = true"
      class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 transition-all"></div>
  </Transition>

  <aside class="z-40 my-2 radius bg-slate-900 transition-all duration-300 shadow-xl mr-2"
   :class="[
    isCollapsed
      ? 'relative w-20'
      : 'fixed w-72 h-[calc(95vh-100px)] top-15 left-0'
  ]">
    <div class="h-20 flex items-center px-3 border-b border-slate-700/50 overflow-hidden whitespace-nowrap">
      <div class="flex items-center gap-3 min-w-max cursor-pointer" @click="router.push('/home'); isCollapsed = true;">
        <div
          class="w-10 h-10 bg-indigo-500 p-2 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <IconCafe :size="24" :color="'#fff'" />
        </div>
        <div class="transition-all duration-300 flex flex-col"
          :class="[isCollapsed ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0']">
          <span class="font-bold text-lg text-white">Cafe App</span>
        
          <span class="text-xs text-slate-400">{{ userInfo?.FullName }}</span>
          <span class="text-xs text-slate-400"> {{ userInfo?.Role }}</span>
        </div>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 space-y-2">
      <div v-for="item in menuItems" :key="item.key" class="text-slate-400">
        <div @click="handleMenuClick(item)" v-tooltip.right="getTooltip(item.label)"
          class="group mt-2 flex justify-center items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
          :class="[isActive(item) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'hover:bg-slate-800 hover:text-white']">
          <component :is="item.icon" :size="20" class="shrink-0 ml-3" />
          <div class="flex flex-1 items-center justify-between overflow-hidden transition-opacity duration-300"
            :class="[isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto']">
            <span class="font-medium text-sm whitespace-nowrap">{{ item.label }}</span>
            <ChevronRight v-if="item.children" :size="14" class="transition-transform"
              :class="{ 'rotate-45': expandedMenus[item.key] }" />
          </div>
        </div>

        <transition name="expand">
          <div v-if="item.children && !isCollapsed && expandedMenus[item.key]"
            class="mt-1 ml-4 space-y-1 border-l border-slate-700/50 pl-4">
            <router-link v-for="child in item.children" :key="child.label" :to="child.route" @click="isCollapsed = true"
              class="flex items-center gap-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              active-class="text-indigo-400 font-bold">
              <Circle :size="6" :class="[route.path === child.route ? 'fill-indigo-400' : 'fill-transparent']" />
              {{ child.label }}
            </router-link>
          </div>
        </transition>
      </div>
    </nav>

    <button @click="toggleSidebar"
      class="absolute -right-3 top-15 p-2 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-400 transition-all z-50">
      <component :is="isCollapsed ? ChevronsRight : ChevronsLeft" :size="14" />
    </button>
  </aside>
</template>

<style scoped>

.radius {
  border-radius: 0 1rem 1rem 0;
}
/* Fade effect for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Submenu expand animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}

nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-thumb {
  /* background: #334155; */
  border-radius: 10px;
}
</style>