import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios'; // Import axios if you use it globally, or remove if using inject

// Constants for storage keys to avoid typos
const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_info';

export const useAuthStore = defineStore('auth', () => {
  
  // --- State ---
  
  // 1. Safe Initialization: Handle cases where storage might be null or corrupted
  const token = ref(sessionStorage.getItem(TOKEN_KEY) || null);
  
  const user = ref(null);
  try {
    const storedUser = sessionStorage.getItem(USER_KEY);
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Error parsing user data from storage", e);
    // If corrupted, clear it to prevent issues
    sessionStorage.removeItem(USER_KEY);
  }

  // --- Getters ---
  
  const isLoggedIn = computed(() => !!token.value);
  
  // Helper to get user name safely without checking "if user && user.name" everywhere
  const userName = computed(() => user.value?.name || 'Guest');

  // --- Actions ---

  function login(userData, userToken) {
    token.value = userToken;
    user.value = userData;

    // Save to storage
    sessionStorage.setItem(TOKEN_KEY, userToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));

    // IMPORTANT: Set default header for future API calls
    // If you use a global axios instance, set it here:
    // axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  }

  function logout() {
    token.value = null;
    user.value = null;
    
    // Clear storage
    sessionStorage.clear(); // Or removeItem if you want to keep other session data
    
    // Clear API header
    // delete axios.defaults.headers.common['Authorization'];
    
    // Optional: Refresh page to clear any in-memory states in other components
    // window.location.reload(); 
  }

  function updateUser(newUserData) {
    // Useful if the user updates their profile (name/avatar) while logged in
    user.value = { ...user.value, ...newUserData };
    sessionStorage.setItem(USER_KEY, JSON.stringify(user.value));
  }

  return { 
    token, 
    user, 
    isLoggedIn, 
    userName,
    login, 
    logout,
    updateUser 
  };
});