import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOnboardingStore = defineStore('onboarding', () => {
  // State
  const email = ref(''); // Store email between Register/Forgot -> OTP forms
  const isOtpVerified = ref(false); // Gatekeeper for the Set Password page
  const flowType = ref(''); // 'register' or 'forgot-password' (optional, if APIs differ)

  // Actions
  function startRegistration(userEmail) {
    email.value = userEmail;
    flowType.value = 'register';
    isOtpVerified.value = false;
  }

  function startForgotPassword(userEmail) {
    email.value = userEmail;
    flowType.value = 'forgot-password';
    isOtpVerified.value = false;
  }

  function verifySuccess() {
    isOtpVerified.value = true;
  }

  function reset() {
    email.value = '';
    isOtpVerified.value = false;
    flowType.value = '';
  }

  return { email, isOtpVerified, flowType, startRegistration, startForgotPassword, verifySuccess, reset };
});