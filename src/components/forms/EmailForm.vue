
<script setup>
import { ref, reactive } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import IconMail from "../icons/IconMail.vue";
import { useRouter } from "vue-router";
import { useOnboardingStore } from '@/stores/onboarding';

const $api = inject('$api');
const onboarding = useOnboardingStore();
const email = ref('');
const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);

const initialValues = reactive({
  email: "",
});

// Cleaned up resolver (removed brandName since it's not used here)
const resolver = zodResolver(
  z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address."),
  })
);

const onFormSubmit = async (e) => {
  if (!e.valid) return;

  isSubmitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.add({
      severity: "success",
      summary: "Email Sent",
      detail: "Check your inbox for the reset link.",
      life: 3000,
    });

    // Navigate after short delay
    setTimeout(() => router.push('/set-password'), 1000);

  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something went wrong. Please try again.",
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleSendEmail = async () => {
  try {
    // 1. Call API /v1/user/send-email
    await $api.user.sendEmail(email.value);
    
    // 2. Update Store with "Forgot Password" context
    onboarding.startForgotPassword(email.value);
    
    // 3. Route
    router.push({ name: 'verify-otp' });
  } catch (error) { /* handle error */ }
}
</script>

<template>
  <div class="login-container flex items-center justify-center min-h-screen p-4 bg-slate-50">
    <PriToast />
    
    <div class="form shadow-2xl rounded-2xl w-full max-w-md transition-all duration-300">
      <div class="text-center mb-7">
        <IconMail class="mx-auto mb-4" :size="80" :color="'#6F4E37'" />
        <h2 class="text-2xl md:text-3xl font-bold text-slate-800">Verify Email</h2>
        <p class="text-slate-500 text-sm px-4">
          Enter your email to receive a verification link
        </p>
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
            placeholder="Email Address*" 
            fluid
            :class="{ 'p-invalid': $form?.email?.invalid }" 
          />
          <PriMessage v-if="$form?.email?.invalid" severity="error" size="small" variant="simple" class="mt-1">
            {{ $form.email.error.message }}
          </PriMessage>
        </div>

        <div class="w-full mt-2">
          <PriButton 
            type="submit" 
            severity="primary" 
            label="Send Link" 
            :loading="isSubmitting"
            icon="pi pi-envelope"
            :disabled="!$form.valid"
            class="w-full font-semibold style-slide-up"
            :style="!$form.valid ? { cursor: 'not-allowed' } : ''"
          />
        </div>

        <!-- <div class="text-center w-full">
          <span 
            class="text-sm text-primary cursor-pointer hover:underline font-medium"
            @click="router.back()"
          >
            ← Back to Login
          </span>
        </div> -->
      </Form>
    </div>
  </div>
</template>

<style scoped>
.form {
  /* Dynamic padding: 1.5rem on mobile, 2.5rem on desktop */
  padding: 1.5rem;
  background: linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), 
              url('/imgs/bg3.png') no-repeat center center;
  background-size: cover;
}

@media (min-width: 640px) {
  .form {
    padding: 2.5rem;
  }
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}
</style>