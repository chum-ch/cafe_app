
<script setup>
import { ref, inject } from "vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import IconMail from "../icons/IconMail.vue";
import { useRouter } from "vue-router";
import { useOnboardingStore } from '@/stores/onboarding';
import { useSession } from '../../utils/helperFun';

const $api = inject('$api');
const onboarding = useOnboardingStore();
const router = useRouter();
const isSubmitting = ref(false);

const initialValues = ref({
  email: "",
});

// Cleaned up resolver (removed brandName since it's not used here)
const resolver = zodResolver(
  z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address."),
  })
);

const onFormSubmit = async (e) => {
  isSubmitting.value = true;
  if (!e.valid) return;

  try {
    // Simulate API call
    const payload = { Email: initialValues.value.email };
    const response = await $api.user.sendEmail(payload);
    if (response.data.RootUser) useSession.set('tenant_info', { TenantId: response.data.TenantId, Email: response.data.Email });
    useSession.set('email_login', initialValues.value.email);
    
    // 2. Update Store with "Forgot Password" context
    onboarding.startForgotPassword(initialValues.value.email);
    
    // 3. Route
    router.push('/verify-otp');

  } catch (error) {
    console.error('Error Send Email', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="login-container flex items-center justify-center min-h-screen p-4">    
    <div class="form shadow-2xl rounded-2xl w-full max-w-md transition-all duration-300">
      <div class="text-center mb-7">
        <IconMail class="mx-auto mb-4" :size="80" :color="'#6F4E37'" />
        <h2 class="text-2xl md:text-3xl font-bold text-slate-800">Verify Email</h2>
        <p class="text-slate-500 text-sm px-4">
          Enter your email to receive a verification OTP code.
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
            :disabled="isSubmitting"
            fluid
            v-model="initialValues.email"
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
            label="Send OTP"
            :loading="isSubmitting"
            icon="pi pi-envelope"
            :disabled="!$form.valid"
            class="w-full font-semibold style-slide-up"
            :style="!$form.valid ? { cursor: 'not-allowed' } : ''"
          />
        </div>

        <div class="text-center w-full">
          <span 
            class="text-sm text-primary cursor-pointer hover:underline font-medium"
            @click="router.push('/login')"
          >
            ← Back to Login
          </span>
        </div>
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