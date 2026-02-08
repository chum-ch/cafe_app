<script setup>
import { computed } from 'vue';
import { X, Plus, Minus, Trash2, ShoppingCart, Flame, Snowflake } from 'lucide-vue-next';

const props = defineProps({
    isOpen: Boolean,
    items: {
        type: Array,
        default: () => []
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

const deliveryFee = 0;

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
    // console.log('incrementing');
    emit('update-quantity', { id: item.id, amount: 1 });
};

const handleDecrement = (item) => {
    // Logic: Only decrement if > 1. If 1, the user must use the Trash icon or we can logic to remove.
    if (toNum(item.quantity) > 1) {
        emit('update-quantity', { id: item.id, amount: -1 });
    }
};

// Configuration Arrays
const CONFIG = {
    sizes: ['S', 'M', 'L'],
    sugarLevels: ['30%', '50%', '70%', '100%'],
    moods: [
        { id: 'hot', icon: Flame, color: 'bg-orange-500', ring: 'ring-orange-100' },
        { id: 'cold', icon: Snowflake, color: 'bg-blue-500', ring: 'ring-blue-100' }
    ]
};

// Define unique styles for each size when selected
const sizeStyles = {
    S: 'bg-amber-400 text-white',    // Small = Amber/Gold
    M: 'bg-orange-500 text-white', // Medium = Orange (The "Default" pop)
    L: 'bg-emerald-500 text-white' // Large = Emerald/Green
};
const totalItemsCount = computed(() => {
    // Use Number() or parseFloat() to prevent "NaN" if data is messy
    return props.items.reduce((total, item) => {
        return total + (Number(item.quantity) || 0);
    }, 0);
});

const pluralize = (count, word) => {
    if (count <= 1) return word;

    // Check if word ends in 'y' (and is preceded by a consonant)
    // Example: 'Category' -> 'Categories', 'Quantity' -> 'Quantities'
    // Note: Words like 'Day' or 'Boy' (vowel + y) just get an 's'
    const isConsonantY = /[^aeiou]y$/i.test(word);

    if (isConsonantY) {
        return word.slice(0, -1) + 'ies';
    }

    // Standard pluralization
    return `${word}s`;
};

/**
 * Expands a cart array so that items with quantity > 1 
 * become multiple individual objects in the list.
 */
const expandCartItems = (items) => {
    // Exit early if there are no items
    if (!items.length) return [];

    return items.flatMap(item => {
        // Create an array with length equal to the quantity
        // and fill it with clones of the item
        return Array.from({ length: item.quantity }, (_, index) => ({
            ...item,
            // We set quantity to 1 for each individual expanded item
            quantity: 1,
            // Optional: Give each a unique 'instanceId' for the printer/UI keys
            instanceId: `${item.id}-unit-${index + 1}`
        }));
    });
};

const checkout = async (items) => {
    // 1. Expand the cart items
    const expandedItems = expandCartItems(items);
    console.log('expandedItems', expandedItems);

    // 2. Call the checkout API
    // const response = await $api.user.checkout(expandedItems);
    // console.log('response', response);
    // 3. Emit the checkout event
    emit('checkout', expandedItems);
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
                        <ShoppingCart class="text-white w-10" />
                    </div>
                    <div>
                        <h3 class="text-xl font-bold font-black text-stone-900 leading-none">My Cart</h3>
                        <div class="flex gap-2 items-center">
                            <p class="text-sm"> <span class="text-orange-600 font-black font-bold">{{ items.length
                            }}</span> {{ pluralize(items.length, 'Item') }}</p>
                            <p class="text-sm text-stone-500"> <span class="text-orange-600 font-black font-bold">{{
                                totalItemsCount }}</span> {{ pluralize(totalItemsCount, 'Quantity') }}</p>

                        </div>
                    </div>
                </div>
                <button @click="emit('close')"
                    class="cursor-pointer flex justify-center items-center p-2 hover:bg-stone-100 rounded-full transition-all active:scale-90">
                    <X class="w-8 h-8 text-stone-400" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-center">
                    <div class="bg-stone-100 w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4">☕
                    </div>
                    <h3 class="text-xl font-black text-stone-800">Your cart is empty</h3>
                    <p class="text-stone-500 mt-2">Add some delicious coffee to start!</p>
                </div>

                <TransitionGroup name="list">
                    <div v-for="item in items" :key="item.name"
                        class="bg-white p-4 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center mb-4 transition-all hover:shadow-md relative overflow-hidden">

                        <div class="relative shrink-0">
                            <img :src="item.image" class="w-28 h-28 rounded-[1.5rem] object-cover shadow-inner" />
                            <div
                                class="absolute -bottom-2 -right-2 px-3 py-1 rounded-full ring-4 ring-white shadow-md"
                                :class="sizeStyles[item.size] || 'bg-orange-500'"
                                >
                                <p class="text-white font-black text-sm tabular-nums">
                                    {{ formatCurrency(item.price) }}
                                </p>
                            </div>
                        </div>

                        <div class="flex-1 w-full">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-black text-stone-800 text-xl leading-none tracking-tight">
                                        {{ item.name }}
                                    </h4>

                                    <div class="flex flex-wrap gap-2 mt-3">
                                        <div v-if="item.mood"
                                            class="flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
                                            :class="CONFIG.moods.find(m => m.id === item.mood)?.color || 'bg-stone-400'">
                                            {{ item.mood }}
                                        </div>

                                        <div v-if="item.size"
                                            class="flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm"
                                            :class="sizeStyles[item.size] || 'bg-stone-100 text-stone-500 border-stone-200'">
                                            {{ item.size }}
                                        </div>

                                        <div v-if="item.sugar"
                                            class="flex items-center px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-500 text-[10px] font-black shadow-sm uppercase">
                                            {{ item.sugar }}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    class="p-2 text-red-400 hover:text-red-500 transition-colors">
                                    <Trash2 :size="20" @click="emit('remove-item', item.id)" class="cursor-pointer" />
                                </button>
                            </div>

                            <div class="flex justify-between items-end mt-5">
                                <div
                                    class="flex items-center bg-stone-100 rounded-2xl p-2 gap-1 border border-stone-200">
                                    <button @click="handleDecrement(item)" :disabled="toNum(item.quantity) <= 1"
                                        class="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 hover:text-indigo-500 transition-all active:scale-90">
                                        <Minus class="w-5 h-5" />
                                    </button>

                                    <span class="font-black text-center text-xl text-stone-800 text-center p-1">
                                        {{ toNum(item.quantity) }}
                                    </span>

                                    <button @click="handleIncrement(item)"
                                        class="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-400 text-white shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-all active:scale-90">
                                        <Plus class="w-5 h-5" />
                                    </button>
                                </div>

                                <div class="text-right">
                                    <p class="text-[14px] text-stone-400 uppercase font-black">Subtotal</p>
                                    <span class="font-black text-orange-600 text-xl">
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
                        <span class="text-xl font-black text-stone-900 tracking-tighter">Total Amount</span>
                        <span class="text-3xl font-black text-orange-600 tracking-tighter">
                            {{ formatCurrency(total) }}
                        </span>
                    </div>
                </div>
                <PriButton @click="checkout(items)" :disabled="items.length === 0" class="w-full p-3">
                    <span>To Preparation</span>
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