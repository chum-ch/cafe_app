import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOnboardingStore = defineStore('onboarding', () => {
  // Step 1: register, Step 2: email (OTP), Step 3: set-password
  const stepReached = ref(Number(sessionStorage.getItem('reg_step')) || 1);
  const email = ref(sessionStorage.getItem('reg_email') || '');
  const tempToken = ref(sessionStorage.getItem('reg_temp_token') || '');

  function setRegistrationData(nextStep, userEmail = '', token = '') {
    stepReached.value = nextStep;
    if (userEmail) email.value = userEmail;
    if (token) tempToken.value = token;

    sessionStorage.setItem('reg_step', nextStep);
    sessionStorage.setItem('reg_email', email.value);
    sessionStorage.setItem('reg_temp_token', tempToken.value);
  }

  function completeOnboarding() {
    stepReached.value = 1;
    email.value = '';
    tempToken.value = '';
    sessionStorage.removeItem('reg_step');
    sessionStorage.removeItem('reg_email');
    sessionStorage.removeItem('reg_temp_token');
  }

  return { stepReached, email, tempToken, setRegistrationData, completeOnboarding };
});