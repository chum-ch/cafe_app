<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import {
    Clock, Coffee, Check, GripVertical, UserCheck
} from 'lucide-vue-next';
import IconNext from '@/components/icons/IconNext.vue';
import { useAuthStore } from '@/stores/auth';
import OrderNotification from '@/components/OrderNotification.vue';
// --- Data & State ---
const $api = inject('$api');

const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
const tenantId = userInfo?.TenantId;
const userId = userInfo?.EntityItemId;
const orders = ref([]);
const draggedOrder = ref(null);
const workflowSteps = ['pending', 'brewing', 'done']; // 'prep',
const status = {
    [workflowSteps[0]]: 'PENDING',
    [workflowSteps[1]]: 'PREPARING',
    [workflowSteps[2]]: 'BREWING',
    Completed: 'COMPLETED',
    Cancelled: 'CANCELLED',
}
const CONFIG = {
    sizes: ['S', 'M', 'L'],
    sugarLevels: ['30%', '50%', '70%', '100%'],
    moods: [
        { id: 'hot', color: 'bg-orange-500', ring: 'ring-orange-100' },
        { id: 'cold', color: 'bg-blue-500', ring: 'ring-blue-100' }
    ]
};

// Define unique styles for each size when selected
const sizeStyles = {
    S: 'bg-amber-400 text-white',    // Small = Amber/Gold
    M: 'bg-orange-500 text-white', // Medium = Orange (The "Default" pop)
    L: 'bg-emerald-500 text-white' // Large = Emerald/Green
};

// --- Timer ---
// 1. Reactive variable to hold the formatted time
const liveDateTime = ref('');

// 2. Function to format the date to YYYY-MM-DDTHH:MM:SS
const formatDateTime = (date) => {
    const pad = (num) => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    // --- 12-Hour Conversion Logic ---
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert 0-23 to 1-12
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const formattedHours = pad(hours);
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Updated format: YYYY-MM-DD (HH:MM:SS AM/PM)
    return `${year}-${month}-${day} (${formattedHours}:${minutes}:${seconds} ${ampm})`;
};


// --- Transition & Logic Helpers ---
const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

// --- Unified Action Logic ---
const moveOrderToNextStep = async (order) => {
    const currentIndex = workflowSteps.indexOf(order.status);
    if (currentIndex < workflowSteps.length - 1) {
        order.status = workflowSteps[currentIndex + 1];
    } else if (order.status === 'done') {
        archiveOrder(order.id);
    }

    // Update the order status call api
    const response = await $api.order.updateOrderStatus({ Status: status[order.status] }, tenantId, userId, order.orderId);
    // console.log('Order', response.data);
};

const archiveOrder = (orderId) => {
    orders.value = orders.value.filter(o => o.id !== orderId);
};

// --- Drag & Drop Handlers ---
const isDropAllowed = (targetStatus) => {
    if (!draggedOrder.value) return false;
    const currentIndex = workflowSteps.indexOf(draggedOrder.value.status);
    const targetIndex = workflowSteps.indexOf(targetStatus);
    return targetIndex === currentIndex + 1 || (draggedOrder.value.status === 'done' && targetStatus === 'archive');
};

const onDragStart = (e, order) => {
    draggedOrder.value = order;
    e.dataTransfer.effectAllowed = 'move';
    // Standard DnD practice: add a slight delay to the opacity change so the ghost image looks correct
    setTimeout(() => {
        e.target.classList.add('opacity-40');
    }, 0);
};

// NEW: This ensures the UI resets if the user "gives up" or drops in an invalid place
const onDragEnd = (e) => {
    draggedOrder.value = null;
    e.target.classList.remove('opacity-40');
};


const onDragOver = (e, targetStatus) => {
    if (isDropAllowed(targetStatus)) {
        e.preventDefault();
    }
};

const onDrop = (e, targetStatus) => {
    // We check isDropAllowed one last time before moving
    if (draggedOrder.value && isDropAllowed(targetStatus)) {
        moveOrderToNextStep(draggedOrder.value);
    }
    // Reset the state
    draggedOrder.value = null;
};

// 1. Create a reference for the polling interval
let apiPollingInterval = null;
// 2. Define the refresh logic
const startApiPolling = () => {
    // Clear any existing polling to prevent duplicates
    if (apiPollingInterval) clearInterval(apiPollingInterval);

    apiPollingInterval = setInterval(async () => {
        console.log('Refreshing orders from API...');
        await listOrders();
    }, 8000); // 60,000ms = 1 minute
};

const listOrders = async () => {
    try {
        const response = await $api.order.listOrders(tenantId, userId);
        // Restructure the data to match the UI
        // Excluded the "Completed" and "Cancelled" orders
        const ord = response.data.filter(o => o.Status !== 'COMPLETED' && o.Status !== 'CANCELLED').map(o => {
            return {
                orderId: o.EntityItemId,
                id: 0,
                // customer: '',
                name: o.Name,
                // size: o.Size,
                sugar: o.Sugar,
                mood: o.Mood.toLowerCase(),
                status: o.Status.toLowerCase(),
                orderDate: o.OrderDate || o.CreatedAt,
                quantity: o.Quantity,
                orderCode: o.OrderCode,
            };
        });
        orders.value = ord;
        // console.log('Response', ord);
    } catch (error) {
        console.error('Error List Orders', error);
    } finally {
        // console.log('finally');
    }
};

let timerInterval = null;
// 3. Function to update the ref
const updateClock = () => {
    liveDateTime.value = formatDateTime(new Date());
};

// // 2. NEW: Handle notification action
// const handleNewOrderReceived = (notificationData) => {
//     // Option A: Just refresh the whole list
//     listOrders();
//     // Option B: If you want to highlight the specific order, you would do that here
// };
// NEW: Function to handle the real-time event
const onNewOrderDetected = () => {
    // Refresh the list immediately
    listOrders(); 
    
    // Optional: Add logic to briefly highlight the new order in the UI
};

onMounted(() => {
    // Initial fetch
    listOrders();

    // Start the 1min API polling
    startApiPolling();

    // Start the 1s UI clock
    updateClock();
    timerInterval = setInterval(updateClock, 1000); // Updates every second

});

onUnmounted(() => {
    // Clean up BOTH intervals
    if (timerInterval) clearInterval(timerInterval);
    if (apiPollingInterval) clearInterval(apiPollingInterval);
});

</script>

<template>
    <div class="min-h-screen select-none font-sans overflow-x-hidden">
        <OrderNotification @new-order-received="onNewOrderDetected" />
        <div class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 class="text-3xl font-black">

                    Barista Workflow
                </h1>
                <p class="text-slate-500 font-medium mt-1">
                    Real-time order management • Click or Drag to advance
                </p>
            </div>

            <div class="flex items-center gap-4">
                <div
                    class="sm:flex items-center gap-2.5 px-3 py-1.5 bg-indigo-500 dark:bg-gray-800 rounded-full border border-surface-200 dark:border-surface-700 shadow-inner text-surface-900 dark:text-white">
                    <div class="relative flex h-2.5 w-2.5">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </div>
                    <span class="text-xs font-bold uppercase tracking-widest text-surface-600 dark:text-surface-300">
                        {{ liveDateTime }}
                    </span>
                </div>

                <div class=""></div>
            </div>
        </div>

        <div
            class="justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-auto lg:h-[70vh]">

            <div v-for="step in workflowSteps" :key="step"
                class="w-17rem p-4 rounded-[2rem] transition-all duration-300 border-2 relative" :class="[
                    /* 1. Base Column Colors */
                    step === 'pending' ? 'bg-slate-100/80' :
                        step === 'prep' ? 'bg-blue-50/80' :
                            step === 'brewing' ? 'bg-amber-50/80' : 'bg-emerald-50/80',

                    /* 2. Highlight Logic: ONLY if it is the valid next step */
                    draggedOrder && isDropAllowed(step)
                        ? 'border-dashed border-emerald-400 bg-emerald-100/40 scale-[1.05] shadow-xl'
                        : 'border-transparent',

                    /* 3. Fade Logic: If dragging something else, dim the non-targets */
                    draggedOrder && !isDropAllowed(step) && draggedOrder.status !== step
                        ? 'opacity-20 grayscale pointer-events-none'
                        : 'opacity-100'
                ]" @dragover="onDragOver($event, step)" @drop="onDrop($event, step)">

                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center">
                        <h2 class="font-black uppercase tracking-[0.15em]"
                            :class="step === 'pending' ? 'text-slate-400' : step === 'prep' ? 'text-blue-500' : step === 'brewing' ? 'text-amber-600' : 'text-emerald-600'">
                            {{ step }}
                        </h2>
                    </div>
                    <div
                        class="px-2 py-0.5 rounded-full bg-white text-[10px] font-black shadow-sm text-slate-500 border border-slate-100">
                        {{orders.filter(o => o.status === step).length}}
                    </div>
                </div>
                <div class="overflow-y-auto h-[400px] pr-1 custom-scrollbar">
                    <transition-group name="order-list" tag="div" class="flex flex-col gap-4 mt-3">
                        <div v-for="order in orders.filter(o => o.status === step)" :key="order.id" draggable="true"
                            @dragstart="onDragStart($event, order)" @dragend="onDragEnd"
                            class="group relative bg-white p-4 rounded-2xl shadow-sm border-slate-100 transition-all duration-300 cursor-grab active:cursor-grabbing overflow-hidden">
                            <div class="flex justify-between items-start mb-3">
                                <div class="items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors"
                                    :class="order.elapsedSeconds > 180 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'">
                                <h3 class="font-black text-amber-500 text-center font-bold text-[13px]">Order ID: {{ order.orderCode }}</h3>
                                     {{ formatDateTime(new Date(order.orderDate)) }}
                                </div>
                            </div>

                            <h3 class="font-bold text-slate-800 leading-tight text-center">{{ order.name }}</h3>
                            <div class="my-3">

                                <div class="order-details text-black">
                                    <label for="">Mood</label>
                                    <span v-if="order.mood"
                                        class="text-center px-3 py-1 rounded-full text-[10px] font-black uppercase  text-white shadow-sm"
                                        :class="CONFIG.moods.find(m => m.id === order.mood)?.color || 'bg-stone-400'">
                                        {{ order.mood }}
                                    </span>
                                </div>
                                <!-- <div class="order-details text-black">
                                    <label for="">Size</label>
                                    <span v-if="order.size"
                                        class="flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm"
                                        :class="sizeStyles[order.size] || 'bg-stone-100 text-stone-500 border-stone-200'">
                                        {{ order.size }}
                                    </span>
                                </div> -->
                                <div class="order-details text-black">
                                    <label for="">Sugar</label>
                                    <span v-if="order.sugar"
                                        class="flex items-center px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-500 text-[10px] font-black shadow-sm uppercase">
                                        {{ order.sugar }}
                                    </span>
                                </div>
                                <div class="order-details text-black">
                                    <label for="">{{ order.quantity > 1 ? 'Quantities' : 'Quantity' }}</label>
                                    <span v-if="order.quantity"
                                        class="flex items-center px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-500 text-[10px] font-black shadow-sm uppercase">
                                        {{ order.quantity }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex justify-center">
                                <button @click="moveOrderToNextStep(order)"
                                    class=" cursor-pointer p-1 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95"
                                    :class="[
                                        step === 'pending' ? 'bg-slate-900 text-white hover:bg-blue-600' :
                                            step === 'prep' ? 'bg-blue-600 text-white hover:bg-amber-600' :
                                                step === 'brewing' ? 'bg-amber-500 text-white hover:bg-emerald-600' :
                                                    'bg-emerald-600 text-white hover:bg-slate-900'
                                    ]">
                                    <div class="flex" v-if="step !== 'done'">
                                        <span class="m-2">Next</span>
                                        <IconNext />
                                    </div>
                                    <Check v-else />
                                </button>

                            </div>

                            <div
                                class="absolute top-1/2 -right-1 -translate-y-1/2 translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <GripVertical class="text-slate-200" size="18" />
                            </div>

                            <div class="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300"
                                :style="{ width: step === 'done' ? '100%' : '0%' }"></div>
                        </div>
                    </transition-group>
                </div>
            </div>
        </div>

        <div @dragover="onDragOver($event, 'archive')" @drop="onDrop($event, 'archive')"
            class="fixed bottom-8 left-1/2 -translate-x-1/2 px-12 py-8 rounded-[2.5rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center gap-2 z-50 backdrop-blur-xl"
            :class="[
                draggedOrder && draggedOrder.status === 'done'
                    ? 'translate-y-0 opacity-100 bg-emerald-600/90 border-white text-white shadow-[0_20px_50px_rgba(16,185,129,0.4)] scale-110'
                    : 'translate-y-64 opacity-0 pointer-events-none'
            ]">
            <div class="p-3 bg-white/20 rounded-full animate-bounce">
                <UserCheck class="w-8 h-8" />
            </div>
            <span class="font-black uppercase tracking-[0.2em] text-xs">Customer Picked Up</span>
            <p class="text-[10px] font-medium opacity-70">Drop here to complete order</p>
        </div>

    </div>
</template>
<style scoped>
/* MAGIC ANIMATION: This handles the smooth sliding between columns */
.order-details {
    display: flex;
    justify-content: space-between;
    margin: .4rem 0;
}

.order-list-move {
    transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
}

.order-list-enter-active,
.order-list-leave-active {
    transition: all 0.4s ease;
}

.order-list-enter-from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
}

.order-list-leave-to {
    opacity: 0;
    transform: scale(0.5) translateX(100px);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>