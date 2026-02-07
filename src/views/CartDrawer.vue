<script setup>
import { computed } from 'vue';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-vue-next';

const props = defineProps({
    isOpen: Boolean,
    items: {
        type: Array,
        default: () => [
            {
                id: 1,
                name: 'Caramel Frappuccino',
                price: 3.95,
                category: 'Blended',
                description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
                image: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=400',
                popular: true,
                rating: 4.5
            }
        ]
    }
});

const emit = defineEmits(['close', 'update-quantity', 'remove-item', 'checkout']);

// --- HELPER: Safe Number Conversion ---
// This prevents the NaN error by ensuring we always have a valid number
const toNum = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
};

// --- REACTIVE CALCULATIONS ---
const subtotal = computed(() => {
    return props.items.reduce((acc, item) => {
        return acc + (toNum(item.price) * toNum(item.quantity));
    }, 0);
});

const deliveryFee = 2.00;

const total = computed(() => {
    return subtotal.value + deliveryFee;
});

// --- FORMATTING ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(toNum(value));
};

// --- METHODS ---
const handleIncrement = (item) => {
    console.log('incrementing');
    emit('update-quantity', { id: item.id, amount: 1 });
};

const handleDecrement = (item) => {
    // Logic: Only decrement if > 1. If 1, the user must use the Trash icon or we can logic to remove.
    if (toNum(item.quantity) > 1) {
        emit('update-quantity', { id: item.id, amount: -1 });
    }
};
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen" @click="emit('close')" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"></div>
    </Transition>

    <Transition name="slide">
        <div v-if="isOpen"
            class="fixed right-0 top-0 h-full w-full max-w-md bg-stone-50 shadow-2xl z-[101] flex flex-col">

            <div class="p-3 bg-white border-b border-stone-200 flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <div class="flex justify-center bg-orange-500 p-2 rounded-2xl shadow-lg shadow-orange-200">
                        <ShoppingBag class="text-white w-10" />
                    </div>
                    <div>
                        <h3 class="text-xl font-bold font-black text-stone-900 leading-none">My Cart</h3>
                        <p class="text-sm text-stone-500 font-bold mt-1">{{ items.length }} Items</p>
                    </div>
                </div>
                <button @click="emit('close')"
                    class="cursor-pointer flex justify-center items-center p-2 hover:bg-stone-100 rounded-full transition-all active:scale-90">
                    <X class="w-8 h-8 text-stone-400" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-center">
                    <div class="bg-stone-100 w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4">☕
                    </div>
                    <h3 class="text-xl font-black text-stone-800">Your cart is empty</h3>
                    <p class="text-stone-500 mt-2">Add some delicious coffee to start!</p>
                </div>

                <TransitionGroup name="list">
                    <div v-for="item in items" :key="item.id"
                        class="bg-white p-4 rounded-[2rem] border border-stone-100 shadow-sm flex gap-4 items-center mb-4 transition-all hover:shadow-md">

                        <img :src="item.image" class="w-24 h-24 rounded-[1.5rem] object-cover flex-shrink-0" />

                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h4 class="font-black text-stone-800 text-lg leading-tight">{{ item.name }}</h4>
                                    <p class="text-orange-600 font-bold text-sm">{{ formatCurrency(item.price) }}</p>
                                </div>
                                <button @click="emit('remove-item', item.id)"
                                    class="cursor-pointer p-2 text-stone-300 text-red-400 hover:text-red-500 transition-colors">
                                    <Trash2 class="" />
                                </button>
                            </div>

                            <div class="flex justify-between items-center mt-4">
                                <div
                                    class="flex justify-center items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                                    <button @click="handleDecrement(item)" :disabled="toNum(item.quantity) <= 1"
                                        class=" cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg bg-orange-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-200 transition-all duration-300">
                                        <Minus class="w-7 h-7 text-orange-400" />
                                    </button>

                                    <span class="font-black text-lg text-amber-600 font-bold min-w-[45px] text-center">
                                        {{ toNum(item.quantity) }}
                                    </span>

                                    <button @click="handleIncrement(item)"
                                        class="cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg bg-orange-200 shadow-sm hover:bg-orange-300 transition-all duration-300">
                                        <Plus class="w-7 h-7 text-orange-600" />
                                    </button>
                                </div>

                                <div class="text-right">
                                    <p class="text-[10px] text-stone-400 uppercase font-black">Subtotal</p>
                                    <span class="font-black text-stone-900 text-lg">
                                        {{ formatCurrency(toNum(item.price) * toNum(item.quantity)) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>

            <div class="p-3 bg-white border-t-2 border-stone-100 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <div class="space-y-4 my-2">
                    <div class="flex justify-between items-center">
                        <span class="text-stone-500 font-bold">Items Total</span>
                        <span class="text-stone-900 font-black text-lg">{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-stone-500 font-bold">Delivery Fee</span>
                        <span class="text-stone-900 font-black text-lg">{{ formatCurrency(deliveryFee) }}</span>
                    </div>

                    <div class="pt-4 border-t-2 border-dashed border-stone-200 flex justify-between items-center">
                        <span class="text-xl font-black text-stone-900 uppercase tracking-tighter">Total Amount</span>
                        <span class="text-3xl font-black text-orange-600 tracking-tighter">
                            {{ formatCurrency(total) }}
                        </span>
                    </div>
                </div>

                <PriButton @click="emit('checkout')" :disabled="items.length === 0" class="w-full p-3">
                    <span>Complete Order</span>
                </PriButton>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* Improved Sidebar Transitions */
.slide-enter-active {
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-leave-active {
    transition: transform 0.4s cubic-bezier(0.64, 0, 0.78, 0);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.4s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.list-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d6d3d1;
    border-radius: 10px;
}
</style>