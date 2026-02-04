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
    name: 'System Architect',
    role: 'Owner & Lead Dev',
    desc: 'Building the backbone of modern cafe operations.',
    icon: Code,
    img: ''
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
  <div class="img-bg min-h-screen flex flex-col font-sans text-slate-800 bg-white">
    <main class="flex-grow">
      <section class="relative pt-20 pb-24 overflow-hidden from-amber-50 via-white to-white">
        <div class="max-w-5xl mx-auto px-6 text-center">
          <span
            class="style-elegant-rise inline-block py-1.5 px-4 rounded-full bg-amber-100/50 text-amber-700 text-sm font-semibold mb-6 border border-amber-200">
            Version 2.0 Now Live
          </span>
          <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 text-balance">
            Brew Success with <br />
            <span class="bg-clip-text text-amber-600 from-amber-200 to-orange-600">
              Intelligent Management
            </span>
          </h1>
          <p class="text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform for coffee shops. Seamlessly connect your admin, baristas, and accountants in one
            unified workflow.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mx-auto p-4 flex justify-center">
            <PriButton label="Log In" icon="pi pi-sign-in"
              class="style-animate-back hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            </PriButton>

            <PriButton label="Register" icon="pi pi-user-plus" severity="warn"
              class=" style-animate-next hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            </PriButton>
          </div>
        </div>
      </section>

      <section class="">
        <div class="mb-4 text-center">
          <h2 class="text-3xl font-bold text-slate-900">Platform Modules</h2>
          <p class="mt-2">Everything you need to run your cafe.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto p-4 flex justify-center">

          <div v-for="(item, idx) in features" :key="idx"
            class="p-6 rounded-3xl border border-white/40 bg-white/50 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-amber-200/50 transition-all duration-500 hover:-translate-y-2 cursor-default">
            <div class="rounded-xl mb-4">
              <component :is="item.icon" stroke-width="2" :class="[item.color]" />
            </div>

            <h3 class="text-lg font-bold text-slate-900 mb-2">{{ item.title }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed">{{ item.desc }}</p>
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="(dev, idx) in team" :key="idx"
              class="flex items-start gap-5 p-3 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <div class="rounded-lg text-amber-400">
                <div class="img">
                  <img :src="dev.img || './placehoder-img.svg'" alt="" class="rounded">
                </div>
              </div>
              <div>
                <h4 class="text-xl font-bold text-white">{{ dev.name }}</h4>
                <p class="text-xs font-semibold tracking-wider text-amber-500 uppercase mb-2">{{ dev.role }}</p>
                <p class="text-slate-400 text-sm italic">"{{ dev.desc }}"</p>
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
}

.img-bg {
  background: url('/imgs/cafe1.png') no-repeat;
  background-size: cover;

}
</style>