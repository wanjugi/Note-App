// store/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// We can define a simple User type right here
// Later, this will match our backend's User model
interface User {
  id: string
  username: string
  role: 'admin' | 'moderator' | 'user'
}

export const useAuthStore = defineStore('auth', () => {
  // 1. STATE
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  // 2. GETTERS
  // An 'isAuthenticated' getter that other parts of the app can check
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // 3. ACTIONS

  /**
   * MOCK Login Action.
   * In a real app, this would call our Express API.
   */
  async function login(credentials: { username: string, password: string }) {
    // --- MOCK API CALL (simulating a 0.5s delay) ---
    await new Promise(resolve => setTimeout(resolve, 500))

    // --- MOCK SUCCESSFUL RESPONSE ---
    // In a real app, the token and user data would come from the server
    token.value = 'mock-jwt-token-12345'
    user.value = {
      id: 'u1',
      username: credentials.username,
      role: 'user' // Default to 'user' for this mock
    }
  }

  /**
   * MOCK Signup Action.
   */
  async function signup(credentials: { username: string, password: string }) {
    // --- MOCK API CALL ---
    await new Promise(resolve => setTimeout(resolve, 500))

    // MOCK SUCCESSFUL RESPONSE 
    token.value = 'mock-jwt-token-67890'
    user.value = {
      id: 'u2',
      username: credentials.username,
      role: 'user'
    }
  }
  
  // Logout

  function logout() {
    user.value = null
    token.value = null
  }

  // 4. RETURN
  return {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout
  }
})