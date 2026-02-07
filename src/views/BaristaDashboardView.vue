<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
    Clock, Coffee, Check, GripVertical, UserCheck
} from 'lucide-vue-next';
import IconNext from '@/components/icons/IconNext.vue';

// --- Data & State ---
const orders = ref([]);
const orderIdCounter = ref(100);
const draggedOrder = ref(null);
const workflowSteps = ['pending', 'prep', 'brewing', 'done'];

// --- Timer ---
let timerInterval = null;
onMounted(() => {
    timerInterval = setInterval(() => {
        orders.value.forEach(o => { if (o.status !== 'done') o.elapsedSeconds++; });
    }, 1000);
});
onUnmounted(() => clearInterval(timerInterval));

// --- Transition & Logic Helpers ---
const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

// --- Unified Action Logic ---
const moveOrderToNextStep = (order) => {
    const currentIndex = workflowSteps.indexOf(order.status);
    if (currentIndex < workflowSteps.length - 1) {
        order.status = workflowSteps[currentIndex + 1];
    } else if (order.status === 'done') {
        archiveOrder(order.id);
    }
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

// --- Simulation ---
const simulateOrder = () => {
    orders.value.push({
        id: orderIdCounter.value++,
        customer: ['Alex', 'Jordan', 'Taylor', 'Casey'][Math.floor(Math.random() * 4)],
        items: [{ name: 'Oat Latte', size: 'M' }],
        status: 'pending',
        elapsedSeconds: 0
    });
};
</script>

<template>
    <div class="min-h-screen p-6 select-none font-sans overflow-x-hidden">

        <div class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div class="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-200">
                        <Coffee class="text-white w-6 h-6" />
                    </div>
                    Barista Workflow
                </h1>
                <p class="text-slate-500 font-medium mt-1">
                    Real-time order management • Click or Drag to advance
                </p>
            </div>

            <div class="flex items-center gap-4">
                <div
                    class="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">System Live</span>
                </div>
                <PriButton @click="simulateOrder" label="New Ticket" icon="pi pi-plus" severity="warn" class="" />
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
                                <span class="text-[10px] font-black text-amber-500 ">#{{ order.id }}</span>
                                <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors"
                                    :class="order.elapsedSeconds > 180 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'">
                                    <Clock class="w-3 h-3" /> {{ formatTime(order.elapsedSeconds) }}
                                </div>
                            </div>

                            <h3 class="font-bold text-slate-800 leading-tight">{{ order.customer }}</h3>
                            <p class="text-xs text-slate-500 mt-1 mb-4 flex items-center gap-1">
                                <span class="font-bold text-slate-400">{{ order.items[0].size }}</span>
                                {{ order.items[0].name }}
                            </p>

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
                                        <IconNext/>
                                    </div>
                                    <Check v-else/>
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