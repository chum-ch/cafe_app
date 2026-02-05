<script setup>
import { ref, computed } from 'vue';
import { Flame, Snowflake, ShoppingBag, Plus, Droplets, ShoppingCart } from 'lucide-vue-next';

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      name: 'Caramel Frappuccino',
      price: 3.95,
      description: 'Velvety caramel syrup blended with premium coffee and chilled milk.',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=400&auto=format&fit=crop'
    })
  }
});

const emit = defineEmits(['add-to-cart']);

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
  S: 'bg-amber-400 text-white ring-4 ring-amber-100',    // Small = Amber/Gold
  M: 'bg-orange-500 text-white ring-4 ring-orange-100', // Medium = Orange (The "Default" pop)
  L: 'bg-emerald-500 text-white ring-4 ring-emerald-100' // Large = Emerald/Green
};

// State
const selectedSize = ref('M');
const selectedMood = ref('cold');
const selectedSugar = ref('50%');

const handleAddToCart = () => {
  const item = {
    ...props.item,
    size: selectedSize.value,
    mood: selectedMood.value,
    sugar: selectedSugar.value
  }
  console.log('item', item);
  emit('add-to-cart', item);
};
</script>

<template>
  <div class="">
    <div class="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl border border-stone-100">
      <div class="relative mt-3 flex flex-col items-center">
        <div class="relative group">
          <div
            class="absolute inset-0 bg-stone-200 rounded-full scale-95 blur-xl opacity-50 group-hover:scale-110 transition-transform duration-500">
          </div>
          <img :src="item.image"
            class="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-8 border-white shadow-lg"
            :alt="item.name" />
          <div
            class="absolute top-2 right-2 bg-stone-900 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg text-sm">
            ${{ item.price.toFixed(2) }}
          </div>
        </div>

        <h2 class="mt-4 text-2xl sm:text-3xl font-black text-stone-800 tracking-tight text-center">
          {{ item.name }}
        </h2>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-2 flext wrap justify-center gap-6">
          <div class="space-y-3">
            <label class="block text-[10px] font-black uppercase tracking-widest  text-center mb-3">Mood</label>
            <div class=" flex justify-center gap-3">
              <button v-for="mood in CONFIG.moods" :key="mood.id" @click="selectedMood = mood.id" :class="[
                selectedMood === mood.id ? `${mood.color} text-white ring-4 ${mood.ring} scale-110` : 'bg-stone-50 text-stone-400 hover:bg-stone-100',
                'w-12 p-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm active:scale-90'
              ]">
                <component :is="mood.icon" size="20"
                  :class="{ 'animate-pulse': selectedMood === 'hot' && mood.id === 'hot', 'animate-spin-slow': selectedMood === 'cold' && mood.id === 'cold' }" />
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <label class="block text-[10px] font-black uppercase tracking-widest  text-center mb-3">Size</label>
            <div class="flex justify-center gap-3">
              <button v-for="size in CONFIG.sizes" :key="size" @click="selectedSize = size"
                class="p-2 rounded-full font-black transition-all duration-300 shadow-sm flex items-center justify-center"
                :class="[
                  // Active vs Inactive State
                  selectedSize === size
                    ? sizeStyles[size]
                    : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                ]">
                {{ size }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-4 my-3">
          <div class="flex items-center justify-center gap-2">
            <Droplets size="14" class="text-stone-300" />
            <span class="text-[10px] font-black uppercase tracking-widest mb-2">Sugar Level</span>
          </div>
          <div class="flex p-1 bg-stone-50 rounded-2xl border border-stone-100">
            <button v-for="level in CONFIG.sugarLevels" :key="level" @click="selectedSugar = level"
              :class="selectedSugar === level ? 'bg-white text-stone-900 shadow scale-[1.02]' : 'text-stone-400'"
              class="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200">
              {{ level }}
            </button>
          </div>
        </div>

        <PriButton @click="handleAddToCart"
          
          class="group mt-4 relative w-full bg-stone-900 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-stone-800 active:scale-[0.98] shadow-xl shadow-stone-200">
          <div class="relative z-10 flex items-center justify-center gap-4 text-white">
            <!-- <ShoppingBag size="20" class="text-amber-400" /> -->
            <span class="text-lg font-bold ">Add to Order</span>
            <div class="w-[1px] h-4 bg-white/30"></div>
            <ShoppingCart class="text-amber-400" />
          </div>
        </PriButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
</style>