<script setup>
import { ref, computed } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  ShieldUser,
  ShieldCheck,
  Phone, Shield
} from 'lucide-vue-next';
const isSubmitting = ref(false);



// Ensure role starts as an empty string or undefined so Zod treats it as missing, not "wrong type"
const initialValues = ref({
  fullName: "",
  email: "",
  role: "",
  status: "Active",
  phoneNumber: ""
});

const resolver = zodResolver(
  z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.string().min(1, "Email is required").email("Invalid email address."),
    role: z.string().min(1, "Please select a user role."),
    status: z.string().min(1, "Status is required"),
    phoneNumber: z.string()
      .min(1, "Phone number is required.")
      .refine((val) => {
        const cleaned = val.replace(/\s/g, "");
        return /^0\d{8,9}$/.test(cleaned);
      }, "Must start with 0 and be a valid Cambodian number.")
  })
);

const onFormSubmit = async (e) => {
  if (!e.valid) return;
  isSubmitting.value = true;

  try {
    console.log("Validated Data:", e.values);
    // API Call here
  } finally {
    isSubmitting.value = false;
  }
};

const roles = ref(['Admin', 'Barista', 'Manager']);
const statuses = ref(['Active', 'On Break', 'Inactive']);
const visible = ref(false);
const searchQuery = ref(""); // New Search Ref

// Example data based on your initialValues structure
const users = ref([
  {
    fullName: "Alex Rivera",
    email: "alex@cafe.com",
    role: "Admin",
    status: "Active",
    phoneNumber: "012 345 678",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    fullName: "Alex Rivera",
    email: "alex@cafe.com",
    role: "Admin",
    status: "Active",
    phoneNumber: "012 345 678",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    fullName: "Sarah Chen",
    email: "sarah@cafe.com",
    role: "Barista",
    status: "On Break",
    phoneNumber: "099 888 777",
    avatar: "https://i.pravatar.cc/150?u=2"
  },
  {
    fullName: "Mike Ross",
    email: "mike@cafe.com",
    role: "Manager",
    status: "Inactive",
    phoneNumber: "010 555 444",
    avatar: "https://i.pravatar.cc/150?u=3"
  }
]);

// Helper to style status badges
const getStatusSeverity = (status) => {
  switch (status) {
    case 'Active': return 'success';
    case 'On Break': return 'warn';
    case 'Inactive': return 'danger';
    default: return 'info';
  }
};

// --- ADVANCED SEARCH FILTER ---
const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value;

  const query = searchQuery.value.toLowerCase();

  return users.value.filter(user => {
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.status.toLowerCase().includes(query) ||
      user.phoneNumber.toLowerCase().includes(query)
    );
  });
});


</script>

<template>
  <div class="">

    <PriInputText v-model="searchQuery" type="text" placeholder="Search users..." class="" />

    <div class="p-4">
      <PriButton label="Add New User" icon="pi pi-user-plus" @click="visible = true" rounded raised />
      <PriDialog v-model:visible="visible" modal :draggable="false" dismissableMask class="mx-3 sm:mx-0 w-full max-w-lg"
        :pt="{
          root: { class: 'rounded-[2rem] border-none shadow-2xl overflow-hidden' },
          header: { class: 'hidden' } // We use our own header
        }">
        <div class="user-form p-2">
          <div class="flex justify-end -mb-4 p-2">
            <PriButton icon="pi pi-times" severity="secondary" variant="text" rounded @click="visible = false" />
          </div>

          <div class="flex flex-col items-center text-center my-5">
            <div class="relative flex items-center justify-center w-16 h-16 mb-3">
              <div
                class="absolute inset-0 border-2 border-primary-100 dark:border-primary-900/50 rounded-[1.25rem] animate-custom-pulse">
              </div>

              <div
                class="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
                <ShieldCheck :size="28" class="text-indigo-500" />
              </div>
            </div>

            <h2 class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
              Create New User
            </h2>
            <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">
              Fill in the details to register a new member.
            </p>
          </div>

          <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit"
            :validateOnValueUpdate="true" :validateOnBlur="true" class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <PriInputGroup class="custom-input-group">
                <PriInputGroupAddon>
                  <User :size="18" />
                </PriInputGroupAddon>
                <PriInputText name="fullName" placeholder="Full name*" fluid class="" />
              </PriInputGroup>
              <transition name="slide-up">
                <PriMessage v-if="$form.fullName?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.fullName.error.message }}
                </PriMessage>
              </transition>
            </div>

            <div class="flex flex-col gap-1">
              <PriInputGroup class="custom-input-group">
                <PriInputGroupAddon>
                  <Mail :size="18" />
                </PriInputGroupAddon>
                <PriInputText name="email" placeholder="Email Address*" fluid />
              </PriInputGroup>
              <transition name="slide-up">
                <PriMessage v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.email.error.message }}
                </PriMessage>
              </transition>
            </div>

            <div class="flex flex-col gap-1">
              <PriInputGroup class="custom-input-group">
                <PriInputGroupAddon>
                  <img src="https://flagcdn.com/w40/kh.png" width="18" alt="KH" class="rounded-sm" />
                </PriInputGroupAddon>
                <PriInputMask name="phoneNumber" mask="999 999 999?9" placeholder="012 345 678" fluid />
              </PriInputGroup>
              <transition name="slide-up">
                <PriMessage v-if="$form.phoneNumber?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.phoneNumber.error.message }}
                </PriMessage>
              </transition>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-col gap-1 flex-1">
                <PriSelect name="role" :options="roles" placeholder="Select Role*" fluid class="rounded-xl" />
                <transition name="slide-up">
                  <PriMessage v-if="$form.role?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.role.error.message }}
                  </PriMessage>
                </transition>
              </div>

              <div class="flex flex-col gap-1 flex-1">
                <PriSelect name="status" :options="statuses" placeholder="Status" fluid class="rounded-xl" />
              </div>
            </div>

            <PriButton type="submit" label="Create Account" :loading="isSubmitting"
              :disabled="!$form.valid || isSubmitting" class="" />
          </Form>
        </div>
      </PriDialog>
    </div>

    <div class="view-user">
      <div v-if="filteredUsers.length > 0" class="flex justify-center align-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <transition-group name="list">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-surface-50/50">
            <div v-for="user in filteredUsers" :key="user.email"
              class=" user-card shadow-md relative bg-white dark:bg-surface-900 p-5 rounded-[1.75rem] transition-all duration-300 hover:translate-y-[-4px]">
              <div class="flex justify-between items-start">
                <div
                  class="flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
                  <Shield :size="14" />
                  <span class="text-xs font-bold uppercase tracking-wider">{{ user.role }}</span>
                </div>
                <PriButton icon="pi pi-ellipsis-v" variant="text" severity="secondary" rounded size="small" />
              </div>

              <div class="flex flex-col items-center text-center ">
                <div class="relative mb-3">
                  <img :src="user.avatar" class="w-20 h-20 rounded-2xl object-cover shadow-md" alt="Avatar" />
                  <div
                    class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-surface-900"
                    :class="{
                      'bg-green-500': user.status === 'Active',
                      'bg-yellow-500': user.status === 'On Break',
                      'bg-red-500': user.status === 'Inactive'
                    }"></div>
                </div>
                <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0">{{ user.fullName }}</h3>
                <PriTag :value="user.status" :severity="getStatusSeverity(user.status)" rounded
                  class="mt-2 text-[10px]" />
              </div>

              <div class="space-y-3 bg-surface-50 dark:bg-surface-800/50 p-4 rounded-2xl">
                <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-400">
                  <Mail :size="16" class="text-primary-500" />
                  <span class="truncate">{{ user.email }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-400">
                  <Phone :size="16" class="text-primary-500" />
                  <span>{{ user.phoneNumber }}</span>
                </div>
              </div>

              <div class="flex gap-2 mt-4">
                <PriButton label="Edit" icon="pi pi-pencil" fluid outlined rounded size="small" class="flex-1" />
                <PriButton icon="pi pi-trash" severity="danger" outlined rounded size="small" />
              </div>
            </div>
          </div>

        </transition-group>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div
          class="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-3xl flex items-center justify-center mb-4 text-surface-400">
          <Search :size="40" />
        </div>
        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">No results found</h3>
        <p class="text-surface-500">We couldn't find any users matching "{{ searchQuery }}"</p>
        <PriButton label="Clear Search" variant="text" @click="searchQuery = ''" class="mt-4" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. Animation for the Icon Ring */
@keyframes custom-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.15);
    opacity: 0.3;
  }
}

.animate-custom-pulse {
  animation: custom-pulse 3s ease-in-out infinite;
}

/* 2. Transition for Messages */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
<style scoped></style>