<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Icons from Lucide (clean, modern icons)
import { 
  Users, 
  Box, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Coffee, 
  LayoutDashboard,
  Circle
} from 'lucide-vue-next';

// State
const isCollapsed = ref(false); // Sidebar state
const expandedMenus = ref({});  // Track which sub-menus are open

const route = useRoute();
const router = useRouter();
const { emit } = getCurrentInstance();
defineEmits(['routeChange']);
// Menu Data Structure
const menuItems = [
  {
    label: 'Users',
    icon: Users,
    route: '/users',
    key: 'users'
  },
  {
    label: 'Inventory',
    icon: Box,
    key: 'inventory',
    // Sub-menus
    children: [
      { label: 'All Products', route: '/inventory/all' },
      { label: 'Stock In', route: '/inventory/in' },
      { label: 'Stock Out', route: '/inventory/out' },
    ]
  },
  {
    label: 'Settings',
    icon: Settings,
    route: '/settings',
    key: 'settings'
  }
];

// Actions
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  // If collapsing, close all submenus for a cleaner look
  if (isCollapsed.value) {
    expandedMenus.value = {};
  }
};

const handleMenuClick = (item) => {
    emit('routeChange', item);
    // console.log('dfdf', item);
    
  // If item has children (Sub-menu)
  if (item.children) {
    // If sidebar is collapsed, expand it first so user can see sub-menu
    if (isCollapsed.value) {
      isCollapsed.value = false;
      setTimeout(() => {
        expandedMenus.value[item.key] = true;
      }, 150); // slight delay for smooth transition
    } else {
      // Toggle the submenu
      expandedMenus.value[item.key] = !expandedMenus.value[item.key];
    }
  } else {
    // Standard navigation
    router.push(item.route);
  }
};

// Check if a route is active (including sub-routes)
const isActive = (item) => {
  if (item.route) return route.path === item.route;
  if (item.children) {
    return item.children.some(child => child.route === route.path);
  }
  return false;
};

// Tooltip Logic: Only show tooltip if sidebar is collapsed
const getTooltip = (label) => {
  return isCollapsed.value ? { value: label, showDelay: 200 } : null;
};
</script>

<template>
  <aside 
    class="h-screen bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shadow-xl relative"
    :class="[isCollapsed ? 'w-20' : 'w-72']"
  >
    
    <div class="h-20 flex items-center px-4 border-b border-slate-700/50 overflow-hidden whitespace-nowrap">
      <div class="flex items-center gap-3 min-w-max">
        <div class="w-10 h-10 bg-indigo-500 p-2 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Coffee :size="24" />
        </div>
        
        <div 
          class="transition-opacity duration-300 flex flex-col"
          :class="[isCollapsed ? 'opacity-0 w-0' : 'opacity-100']"
        >
          <span class="font-bold text-lg text-white tracking-wide">Cafe App</span>
          <span class="text-xs text-slate-400">Admin Console</span>
        </div>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-2 overflow-x-hidden">
      
      <div v-for="item in menuItems" :key="item.key">
        
        <div 
          @click="handleMenuClick(item)"
          v-tooltip.right="getTooltip(item.label)"
          class="group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 min-w-max relative"
          :class="[
            isActive(item) 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
              : 'hover:bg-slate-800 hover:text-white'
          ]"
        >
          <component :is="item.icon" :size="20" class="shrink-0" />

          <div 
            class="flex flex-1 items-center justify-between transition-all duration-300 overflow-hidden"
            :class="[isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100']"
          >
            <span class="font-medium text-sm">{{ item.label }}</span>
            
            <ChevronRight 
              v-if="item.children" 
              :size="16" 
              class="transition-transform duration-300"
              :class="{ 'rotate-90': expandedMenus[item.key] }"
            />
          </div>
        </div>

        <div 
          v-if="item.children"
          class="overflow-hidden transition-all duration-300 ease-in-out bg-slate-800/30 rounded-lg mt-1"
          :class="[
            !isCollapsed && expandedMenus[item.key] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          ]"
        >
          <ul class="py-2 space-y-1">
            <li v-for="child in item.children" :key="child.label">
              <router-link 
                :to="child.route"
                class="flex items-center gap-3 pl-11 pr-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors block relative"
                active-class="!text-indigo-400 font-semibold"
              >
                 <Circle :size="8" class="shrink-0" :class="[route.path === child.route ? 'fill-indigo-400' : 'fill-transparent']" />
                 <span>{{ child.label }}</span>
              </router-link>
            </li>
          </ul>
        </div>

      </div>
    </nav>

    <div class="p-4 border-t border-slate-700/50">
      <button 
        @click="toggleSidebar"
        class="w-full flex items-center justify-center h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
      >
        <component 
          :is="isCollapsed ? ChevronRight : ChevronLeft" 
          :size="20" 
        />
      </button>
    </div>

  </aside>
</template>

<style scoped>
/* Scrollbar styling for a cleaner look */
nav::-webkit-scrollbar {
  width: 4px;
}
nav::-webkit-scrollbar-track {
  background: transparent;
}
nav::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 20px;
}
</style>