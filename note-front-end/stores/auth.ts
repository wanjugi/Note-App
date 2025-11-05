import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '~/types'

// 1. DEFINE OUR DATA TYPES

// This interface MUST match the successful login response from our backend.
interface LoginResponse {
  token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  // 2. STATE 
  // We'll initialize the state directly from localStorage.
 // 2. --- STATE ---
  // We will ALWAYS initialize as null.
  // This ensures the server and client render the same initial page.
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  // 3. GETTERS 
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Helper to get the API URL from nuxt.config.ts
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  // 4. --- ACTIONS ---

  // This action will be called ONCE when the app mounts.
  function initAuth() {
    // This check is still good, just in case
    if (import.meta.client) { 
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('authUser')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  /**
   * Login Action.
   * This calls our Express API.
   */
  async function login(credentials: { username: string, password: string }) {
    try {
      // 1. Call the REAL API using Nuxt's $fetch
      const response = await $fetch<LoginResponse>(
        `${apiBaseUrl}/auth/login`,
        {
          method: 'POST',
          body: credentials
        }
      )

      // 2. Update the state in Pinia
      token.value = response.token
      user.value = response.user

      // 3. Save to localStorage for persistence
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('authUser', JSON.stringify(response.user))

    } catch (error) {
      console.error('Login failed:', error)
      // Clear any bad/old state if login fails
      logout()
      // Re-throw the error so the login.vue page can catch it
      throw error
    }
  }

  /**
   * Signup Action.
   */
  async function signup(credentials: { username: string, password: string }) {
    try {
      // 1. Call the signup API
      await $fetch(
        `${apiBaseUrl}/auth/signup`,
        {
          method: 'POST',
          body: credentials
        }
      )

      // 2. --- GOOD UX ---
      // After a successful signup, let's log the user in immediately.
      // This will run the 'login' function above.
      await login(credentials)

    } catch (error) {
      console.error('Signup failed:', error)
      logout() // Clear any state
      throw error // Re-throw for the form
    }
  }

  /**
   * Logout Action
   */
  function logout() {
    // 1. Clear the state in Pinia
    user.value = null
    token.value = null

    // 2. Clear from localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  // 5. --- RETURN ---
  return {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout,
    initAuth
  }
})