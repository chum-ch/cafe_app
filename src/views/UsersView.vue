<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  ShieldCheck,
  Phone,
  Shield,
  Coffee,       // For Barista
  Banknote,     // For Cashier
  Package,      // For StockControl
  Calculator,   // For Accountant
  Truck,        // For Supplier
  Briefcase     // For Manager
} from 'lucide-vue-next';
import { useAuthStore } from "@/stores/auth";
const objRole = {
  Admin: "ADMIN",
  Barista: "BARISTA",
  Cashier: "CASHIER",
  StockControl: "STOCK_CONTROL",
  Accountant: "ACCOUNTANT",
  Supplier: "SUPPLIER",
  Manager: "MANAGER",
}
const roleIcons = {
  [objRole.Admin]: ShieldCheck,
  [objRole.Barista]: Coffee,
  [objRole.Cashier]: Banknote,
  [objRole.StockControl]: Package,
  [objRole.Accountant]: Calculator,
  [objRole.Supplier]: Truck,
  [objRole.Manager]: Briefcase,
};
const objUserStatus = {
  Active: "ACTIVE",
  Pending: "PENDING",
  Inactive: "INACTIVE",
}
const objGender = {
  Male: "MALE",
  Female: "FEMALE",
}
const authStore = useAuthStore();
const userInfo = authStore.getUserSessionStorage();
const $api = inject('$api');
const roles = ref(Object.keys(objRole));
const statuses = ref(Object.keys(objUserStatus));
const isSubmitting = ref(false);
const searchQuery = ref(""); // New Search Ref
const visible = ref(false);
const showDialogDelete = ref(false);

const tenantId = userInfo?.TenantId;
const emailLogin = userInfo?.Email;
const roleLogin = userInfo?.Role;
// Ensure role starts as an empty string or undefined so Zod treats it as missing, not "wrong type"
const initialValues = ref({
  fullName: "",
  email: "",
  role: "",
  status: Object.keys(objUserStatus)[0],
  phoneNumber: "",
  gender: objGender.Male,
});

// Example data based on your initialValues structure
const users = ref([
  // {
  //   fullName: "Alex Rivera",
  //   email: "alex@cafe.com",
  //   role: "Admin",
  //   status: "Active",
  //   phoneNumber: "012 345 678",
  //   avatar: "https://i.pravatar.cc/150?u=1"
  // },
]);

const resolver = zodResolver(
  z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.string().min(1, "Email is required").email("Invalid email address."),
    role: z.string().min(1, "Please select a user role."),
    status: z.string().min(1, "Status is required"),
    gender: z.string().min(1, "Gender is required"),
    phoneNumber: z.string()
      .min(1, "Phone number is required.")
    // .refine((val) => {
    //   const cleaned = val.replace(/\s/g, "");
    //   return /^0\d{8,9}$/.test(cleaned);
    // }, "Must start with 0 and be a valid Cambodian number.")
  })
);

// Reverse the object keys and values
const reverseObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  );
};

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

const listUsers = async () => {
  try {
    const response = await $api.user.listUsers(tenantId);
    // Exclude the current user
    const exludedUser = response.data.filter(user => user.Email !== emailLogin);
    // Retstrunct the user list
    users.value = exludedUser.map(user => {
      return {
        id: user.EntityItemId,
        fullName: user.FullName,
        email: user.Email,
        role: reverseObject(objRole)[user.Role],
        status: (reverseObject(objUserStatus)[user.Status]),
        gender: user.Gender,
        phoneNumber: user.Phone?.Number ? `0${user.Phone.Number}` : '',
        countryCode: user.Phone?.CountryCode,
        avatar: user.Avatar,
      };
    });
    // console.log('Users', users.value);
    // users.value = response.data;
  } catch (error) {
    console.error('Error List Users', error);
  }
};
const resetDefault = () => {
  initialValues.value = {
    fullName: "",
    email: "",
    role: "",
    status: Object.keys(objUserStatus)[0],
    phoneNumber: "",
    gender: objGender.Male,
  };
};
const handleCreateUser = async () => {
  visible.value = true;
  resetDefault();
};
const handleDeleteUser = async (id) => {
  try {
    const response = await $api.user.deleteUser(id, tenantId);
    console.log('Response', response);
    listUsers();
  } catch (error) {
    console.error('Error Delete User', error);
  } finally {
    showDialogDelete.value = false;
  }
};
const handleEditUser = (user) => {
  visible.value = true;
  initialValues.value = user;
};

const onFormSubmit = async (e) => {
  if (!e.valid) return;
  isSubmitting.value = true;

  try {
    const { values } = e;
    // API Call here
    const ph = values.phoneNumber.substring(1);
    const final = ph.replace(/\D/g, '');

    const payload = {
      TenantId: tenantId,
      FullName: values.fullName,
      Email: values.email,
      Role: objRole[values.role],
      Status: objUserStatus[values.status],
      Phone: {
        Number: final,
        CountryCode: '+855'
      },
      Gender: values.gender,
    };
    // console.log("Validated Data:", payload, initialValues.value.id);
    if (initialValues.value.id) {
      await $api.user.updateUserById(payload, tenantId, initialValues.value.id);
    } else {
      await $api.user.createUser(payload, tenantId);
    }
  } finally {
    visible.value = false;
    isSubmitting.value = false;
    resetDefault();
    listUsers();
  }
};


onMounted(() => {
  listUsers();
});
</script>

<template>
  <div class="">
    <PriInputGroup class="custom-input-group">
      <PriInputGroupAddon>
        <PriButton icon="pi pi-search" severity="secondary" variant="text" />
      </PriInputGroupAddon>
      <PriInputText v-model="searchQuery" type="text" placeholder="Search users..." class="" icon="pi pi-search" />
    </PriInputGroup>

    <div class="p-4">
      <PriButton label="Add New User" icon="pi pi-user-plus" @click="handleCreateUser" class="" raised />
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
              {{ initialValues.id ? 'Edit User' : 'Create New User' }}
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
                <PriInputText name="fullName" placeholder="Full name*" fluid class=""
                  v-model="initialValues.fullName" />
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
                <PriInputText name="email" placeholder="Email Address*" fluid v-model="initialValues.email" />
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
                <PriInputMask name="phoneNumber" mask="999 999 999?9" placeholder="012 345 678" fluid
                  v-model="initialValues.phoneNumber" />
              </PriInputGroup>
              <transition name="slide-up">
                <PriMessage v-if="$form.phoneNumber?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.phoneNumber.error.message }}
                </PriMessage>
              </transition>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex flex-col gap-1 flex-1">
                <PriSelect name="role" :options="roles" placeholder="Select Role*" fluid class="rounded-xl"
                  v-model="initialValues.role" />
                <transition name="slide-up">
                  <PriMessage v-if="$form.role?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.role.error.message }}
                  </PriMessage>
                </transition>
              </div>

              <div class="flex flex-col gap-1 flex-1">
                <PriSelect name="status" :options="statuses" placeholder="Status" fluid class="rounded-xl"
                  v-model="initialValues.status" />
              </div>
            </div>

            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <PriRadioButton v-model="initialValues.gender" inputId="ingredient1" name="gender"
                  :value="objGender.Male" />
                <label for="ingredient1">Male</label>
              </div>
              <div class="flex items-center gap-2">
                <PriRadioButton v-model="initialValues.gender" inputId="ingredient2" name="gender"
                  :value="objGender.Female" />
                <label for="ingredient2">Female</label>
              </div>
            </div>

            <PriButton type="submit" :label="initialValues.id ? 'Update User' : 'Create Account'"
              :loading="isSubmitting" :disabled="!$form.valid || isSubmitting" class="" />
          </Form>
        </div>
      </PriDialog>
    </div>

    <div class="view-user">
      <div v-if="filteredUsers.length > 0"
        class="flex justify-center align-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <transition-group name="list">
          <div v-for="user in filteredUsers" :key="user.email"
            class=" user-card shadow-md relative bg-white dark:bg-surface-900 p-5 rounded-[1.75rem] transition-all duration-300 hover:translate-y-[-4px]">
            <div class="flex justify-between items-start">
              <div
                class="flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
                <component :is="roleIcons[user.role.toUpperCase()] || Shield" :size="14" />
                <span class="text-xs font-bold uppercase tracking-wider">{{ user.role }}</span>
              </div>
              <PriButton icon="pi pi-ellipsis-v" variant="text" severity="secondary" rounded size="small" />
            </div>

            <div class="flex flex-col items-center text-center ">
              <div class="relative mb-3">
                <img :src="user.avatar || 'https://placehold.net/avatar-4.png'"
                  class="w-20 h-20 object-cover  rounded-full border-4 border-indigo-500 dark:border-surface-900"
                  alt="Avatar" />
                <div
                  class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-surface-900"
                  :class="{
                    'bg-green-500': user.status === reverseObject(objUserStatus)[objUserStatus.Active],
                    'bg-yellow-500': user.status === reverseObject(objUserStatus)[objUserStatus.Pending],
                    'bg-red-500': user.status === reverseObject(objUserStatus)[objUserStatus.Inactive]
                  }"></div>
              </div>
                <h3 class="text-lg font-bold text-black ">{{ user.fullName }}</h3>
                <PriTag :value="user.status" :severity="getStatusSeverity(user.status)" rounded size="small"
                  class="mt-2 text-[12px] font-bold" />
            </div>

            <div class="space-y-3 bg-surface-50 dark:bg-surface-800/50 p-4 rounded-2xl">
              <div class="flex items-center gap-3 text-sm text-black dark:text-surface-500">
                <Mail :size="16" class="text-primary-500" />
                <span class="truncate ">{{ user.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-black dark:text-surface-500">
                <Phone :size="16" class="text-primary-500" />
                <span>{{ user.phoneNumber }}</span>
              </div>
            </div>

            <div class="flex gap-2 mt-4"
              v-if="roleLogin === objRole.Manager || (roleLogin === objRole.Admin && user.role.toUpperCase() !== objRole.Manager)">
              <PriButton @click="handleEditUser(user)" label="Edit" icon="pi pi-pencil" fluid outlined rounded
                size="small" class="flex-1 text-indigo-500" />
              <PriButton @click="showDialogDelete = true" icon="pi pi-trash" class="text-red-500 bordr-red-500"
                severity="danger" outlined rounded size="small" />

              <PriDialog v-model:visible="showDialogDelete" modal :draggable="false" dismissableMask
                class="mx-3 sm:mx-0 w-full max-w-lg">
                <template #header>
                  <div class="flex items-center gap-3">
                    <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 tracking-tight">
                      Confirm Deletion
                    </h2>
                  </div>
                </template>

                <div class="p-2">
                  <p class="text-surface-600 dark:text-surface-300">
                    Are you sure you want to delete user
                    <strong class="font-bold text-indigo-500 dark:text-surface-0">{{ user.email }}</strong>? <br>
                    This action
                    <strong class="text-red-600 dark:text-red-400">cannot be undone</strong>.
                  </p>
                </div>

                <template #footer>
                  <div class="flex justify-end gap-2 pt-4">
                    <PriButton label="Delete User" icon="pi pi-trash" severity="danger" rounded
                      @click="handleDeleteUser(user.id)" />
                  </div>
                </template>
              </PriDialog>
            </div>
          </div>

        </transition-group>
      </div>
      <div v-else class="flex flex-col items-center justify-center ">

        <div class="flex items-center justify-center w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800">
          <i :class="[
            'text-surface-400 dark:text-surface-500 text-4xl',
            searchQuery ? 'pi pi-search' : 'pi pi-box'
          ]"></i>
        </div>

        <h4 class="text-md font-bold text-surface-900 dark:text-surface-0 tracking-tight">
          {{ searchQuery ? 'No Results Found' : 'No Data Available' }}
        </h4>
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