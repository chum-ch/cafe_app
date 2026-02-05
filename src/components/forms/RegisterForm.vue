<script setup>
import { ref, reactive, inject } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import IconCafe from "../icons/IconCafe.vue";
import { useRouter } from "vue-router";
import { useOnboardingStore } from '@/stores/onboarding';

const $api = inject('$api');
const router = useRouter();
const onboarding = useOnboardingStore();
const form = ref({ email: '', password: '' });

const handleRegister = async () => {
  try {
    // 1. Call API
    await $api.auth.register(form.value);
    
    // 2. Update Store (Crucial for Router Guard)
    onboarding.startRegistration(form.value.email);
    
    // 3. Route to Next Step
    router.push({ name: 'verify-otp' });
  } catch (error) {
    console.error(error);
  }
};


const toast = useToast();
const isSubmitting = ref(false);

const initialValues = reactive({
  brandName: "",
  email: "",
});

const goToLogin = () => router.push('/login');
const resolver = zodResolver(
  z.object({
    brandName: z.string().min(1, "Brand name is required."),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address."),
  })
);

const onFormSubmit = async (e) => {
  if (!e.valid) return;

  isSubmitting.value = true; // Fixed: was isSubmitting.ref

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Welcome back, ${e.values.email}!`, // Fixed: variable name
      life: 3000,
    });

  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Login Failed",
      detail: "Invalid credentials. Please try again.",
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="register-container flex items-center justify-center min-h-screen p-4 bg-slate-50">
    <PriToast />
    
    <div class="form shadow-2xl rounded-xl w-full max-w-[450px] transition-all duration-300">
      <div class="text-center mb-6">
        <IconCafe class="mx-auto mb-3" :size="80" :color="'#6F4E37'" />
        <h2 class="text-2xl md:text-3xl font-bold text-slate-800">Create an account</h2>
        <p class="text-slate-500 text-sm px-4">Start your brewing journey with us</p>
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
        <div class="flex flex-col gap-1">
          <PriInputText 
            name="brandName" 
            type="text" 
            placeholder="Brand name*" 
            fluid
            :class="{ 'p-invalid': $form?.brandName?.invalid }" 
          />
          <PriMessage v-if="$form?.brandName?.invalid" severity="error" size="small" variant="simple">
            {{ $form.brandName.error.message }}
          </PriMessage>
        </div>

        <div class="flex flex-col gap-1">
          <PriInputText 
            name="email" 
            type="text" 
            placeholder="Email*" 
            fluid
            :class="{ 'p-invalid': $form?.email?.invalid }" 
          />
          <PriMessage v-if="$form?.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error.message }}
          </PriMessage>
        </div>

        <div class="mt-2">
          <PriButton 
            type="submit" 
            severity="primary" 
            label="Register" 
            :loading="isSubmitting" 
            icon="pi pi-user-plus"
            :disabled="!$form.valid"
            :style="!$form.valid ? { cursor: 'not-allowed' } : ''"
            class="style-slide-up w-full text-lg font-semibold shadow-md transition-transform active:scale-95" 
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-slate-600">
            Already have an account?
            <span 
              class="text-primary cursor-pointer hover:underline font-bold ml-1" 
              @click="goToLogin"
            >
              Login
            </span>
          </p>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.form {
  /* Using a white overlay (0.92 opacity) to ensure inputs are readable over the background image */
  background: linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), 
              url('/imgs/bg3.png') no-repeat center center;
  background-size: cover;
  padding: 1.5rem; /* Compact padding for mobile */
}

/* On screens larger than small (640px), increase padding for a spacious feel */
@media (min-width: 640px) {
  .form {
    padding: 3rem 2.5rem;
  }
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
  background-color: #fffafb !important;
}

/* Smooth transition for the submit button */
.p-button {
  transition: all 0.2s ease;
}
</style>