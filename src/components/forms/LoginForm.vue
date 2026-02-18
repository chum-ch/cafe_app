<script setup>
import { ref, inject } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import IconCafe from "../icons/IconCafe.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth';

const objRole = {
  Admin: "ADMIN",
  Barista: "BARISTA",
  Cashier: "CASHIER",
  StockControl: "STOCK_CONTROL",
  Accountant: "ACCOUNTANT",
  Supplier: "SUPPLIER",
  Manager: "MANAGER",
}
const $api = inject('$api');
const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);
const initialValues = ref(
  {
    email: "",
    password: "",
  }
);

const goRegisterForm = () => router.push('/register')
const goEmailForm = () => router.push('/email')
const resolver = zodResolver(
  z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
);


const onFormSubmit = async (e) => {
  if (!e.valid) return;
  isSubmitting.value = true; // Fixed: was isSubmitting.ref

  try {
    const body = { 
      Email: initialValues.value.email,
      Password: initialValues.value.password
    }
    const response = await $api.user.login(body);
    // 2. Update the Store (Save token and user info)
    authStore.login(response.data, 'Bearer xxxx');
    
    // 3. Route to Home
    const { Role } = response.data;
    switch (Role) {
      case objRole.Admin:
        router.push('/users');
        break;
      case objRole.Barista:
        router.push('/barista');
        break;
    
      default:
        router.push('/home');
        break;
    }

  } catch (error) {
    console.error('Error Login', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<template>
  <div class="login-container flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">    
    <div class="form shadow-2xl rounded-xl w-full max-w-[450px] transition-all duration-300">
      
      <div class="text-center mb-6">
        <IconCafe class="mx-auto mb-2" :size="80" :color="'var(--bg-cafe-2)'" />
        <h2 class="text-2xl md:text-3xl font-bold text-slate-800"></h2>
        <p class="text-slate-500 text-sm">Please enter your credentials</p>
      </div>

      <Form 
        v-slot="$form" 
        :initialValues="initialValues" 
        :resolver="resolver" 
        :validateOnValueUpdate="true"
        :validateOnBlur="true" 
        @submit="onFormSubmit" 
        class="flex flex-col gap-4 w-full"
      >
        <div class="w-full">
          <PriInputText 
            name="email" 
            type="text" 
            placeholder="Email*" 
            v-model="initialValues.email"
            fluid
            :class="{ 'p-invalid': $form?.email?.invalid }" 
            :disabled="isSubmitting"
          />
          <PriMessage v-if="$form?.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error.message }}
          </PriMessage>
        </div>

        <div class="w-full">
          <PriPassword 
            name="password" 
            placeholder="Password*" 
            v-model="initialValues.password" 
            toggleMask
            :feedback="false" 
            fluid 
            :class="{ 'p-invalid': $form?.password?.invalid }" 
            :disabled="isSubmitting"
          />
          <template v-if="$form?.password?.invalid">
            <PriMessage v-for="(error, index) of $form.password.errors" :key="index" severity="error" size="small"
              variant="simple">{{ error.message }}</PriMessage>
          </template>
          
          <div class="flex justify-end mt-2">
            <span 
              class="text-primary cursor-pointer hover:underline text-sm font-medium"
              @click="goEmailForm"
            >
              Forgot password?
            </span>
          </div>
        </div>

        <div class="w-full pt-2">
          <PriButton 
            type="submit" 
            severity="primary" 
            label="Login" 
            :loading="isSubmitting"
            :disabled="!$form.valid || isSubmitting"
            class="w-full style-slide-up"
            :icon="!isSubmitting ? 'pi pi-sign-in' : 'pi pi-spinner pi-spin'"
            :style="!$form.valid ? { cursor: 'not-allowed' } : ''"
          />
        </div>

        <div class="text-center w-full mt-2">
          <p class="text-sm text-slate-600">
            Don't have an account?
            <span class="text-primary cursor-pointer hover:underline font-bold" @click="goRegisterForm"> Register</span>
          </p>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.form {
  /* Using a semi-transparent background overlay so text is readable over the image */
  background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), 
              url('/imgs/bg3.png') no-repeat center center;
  background-size: cover;
  padding: 1.5rem; /* Smaller padding for mobile */
}

@media (min-width: 640px) {
  .form {
    padding: 2.5rem; /* Larger padding for desktop */
  }
}
</style>