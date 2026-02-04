import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Check session storage on load to persist login across refreshes
  const token = ref(sessionStorage.getItem('user_token') || null);
  const user = ref(JSON.parse(sessionStorage.getItem('user_info')) || null);

  const isLoggedIn = computed(() => !!token.value);

  function login(userData, userToken) {
    token.value = userToken;
    user.value = userData;
    sessionStorage.setItem('user_token', userToken);
    sessionStorage.setItem('user_info', JSON.stringify(userData));
  }

  function logout() {
    token.value = null;
    user.value = null;
    sessionStorage.clear();
  }

  return { token, user, isLoggedIn, login, logout };
});