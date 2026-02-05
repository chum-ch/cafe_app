<script setup>
import { useRouter } from 'vue-router';
import {
  Coffee,
  LayoutDashboard,
  BadgeDollarSign,
  Users,
  ChefHat,
  Code
} from 'lucide-vue-next';

const router = useRouter();

// --- Data: Features/Roles ---
const features = [
  {
    title: 'Admin Portal',
    desc: 'Total control over inventory, staff shifts, and business analytics.',
    icon: LayoutDashboard,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Cashier POS',
    desc: 'Fast, touch-friendly interface for processing orders and payments.',
    icon: BadgeDollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    title: 'Barista KDS',
    desc: 'Real-time Kitchen Display System to streamline order fulfillment.',
    icon: Coffee,
    color: 'text-amber-700',
    bg: 'bg-amber-50'
  },
  {
    title: 'Accountant',
    desc: 'Automated financial reporting, expense tracking, and payroll.',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  }
];

// --- Data: Dev Team ---
const team = [
  {
    name: 'Chum YOEURN',
    role: 'Tech Lead, backend engineer',
    desc: 'Building the backbone of modern cafe operations.',
    icon: Code,
    img: '/imgs/c10x15.jpg'
  },
  {
    name: 'UX Specialist',
    role: 'Frontend Lead',
    desc: 'Crafting pixel-perfect experiences for your customers.',
    icon: ChefHat,
    img: '/imgs/cafe1.png'
  }
];

// --- Navigation ---
const handleLogin = () => router.push({ name: 'login' }); // Update route name as needed
const handleRegister = () => router.push({ name: 'register' });
</script>

<template>
  <div class="img-bg min-h-screen flex flex-col font-sans text-slate-900 bg-white">
    <main class="flex-grow">
      <section class="relative my-3 overflow-hidden from-amber-50 via-white to-white">
        <div class="max-w-5xl mx-auto px-6 text-center">
          <!-- <span
            class="inline-block py-1.5 px-4 rounded-full bg-amber-100/50 text-amber-700 text-sm font-semibold mb-6 border border-amber-200">
            Version 2.0 Now Live
          </span> -->
          <h1 class="text-4xl subpixel-antialiased md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
            Brew Success with <br />
            <span class="text-3xl bg-clip-text text-amber-600 from-amber-200 to-orange-600">
              Intelligent Management
            </span>
          </h1>
          <p class="text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform for coffee shops. Seamlessly connect your admin, baristas, and accountants in one
            unified workflow.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mx-auto p-4 flex justify-center">
            <PriButton label="Log In" icon="pi pi-sign-in" @click="handleLogin"
              class="style-animate-back hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            </PriButton>

            <PriButton label="Register" icon="pi pi-user-plus" severity="warn"
              class=" style-animate-next hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            </PriButton>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4">
        <div class=" text-center">
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Platform Modules
          </h2>
          <div class="w-16 h-1 bg-amber-500 mx-auto mt-2 rounded-full"></div>
          <p class="mt-3 text-lg text-slate-900 max-w-2xl mx-auto font-medium">
            Everything you need to run your cafe smoothly, from inventory to sales.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 justify-center">
          <div 
            v-for="(item, idx) in features" 
            :key="idx"
            class="group relative p-4 rounded-[1.5rem] border border-white bg-white/80 backdrop-blur-md shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-200 transition-all duration-500"
          >
            <div 
              class="w-14 h-14 flex items-center justify-center rounded-2xl mb-3 bg-gradient-to-br from-white to-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-110"
            >
              <component :is="item.icon" stroke-width="1.5" class="w-8 h-8" :class="[item.color]" />
            </div>

            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ item.title }}</h3>
            <p class="text-slate-600 text-sm md:text-base leading-relaxed font-medium opacity-80">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </section>

      <section class="py-20 bg-slate-900 text-white mt-12 rounded-t-[40px]">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
              <h2 class="text-3xl font-bold mb-2">Built by Experts</h2>
              <p class="text-slate-400">Meet the engineering team behind the system.</p>
            </div>
            <div class="h-px bg-slate-700 flex-grow mb-2 hidden md:block"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div v-for="(dev, idx) in team" :key="idx"
              class="group flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300">

              <div class="relative w-24 h-24 shrink-0">
                <div
                  class="absolute inset-0 bg-amber-500 rounded-xl translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300">
                </div>

                <div class="relative w-full h-full rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                  <img :src="dev.img || './placeholder.svg'"
                    class="w-full h-full object-cover object-[center_10%] transition duration-500 group-hover:scale-110">
                </div>
              </div>

              <div class="text-center sm:text-left flex-1 min-w-0">
                <h4 class="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {{ dev.name }}
                </h4>

                <p class="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2 mt-1">
                  {{ dev.role }}
                </p>

                <p class="text-slate-300 text-sm italic leading-relaxed opacity-90">
                  "{{ dev.desc }}"
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>
    </main>

  </div>
</template>

<style scoped>
/* Since you are using Tailwind v4, most styles are utility classes.
  However, scoped CSS is still useful for specific animations if needed.
*/
.img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.img-bg {
  background: url('/imgs/cafe1.png') no-repeat;
  background-size: cover;

}
</style>