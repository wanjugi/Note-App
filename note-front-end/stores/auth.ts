// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '~/types'

// This interface MUST match the successful login response from our backend.
interface LoginResponse {
  token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  // 1. --- STATE ---
  // We replace localStorage with useCookie.
  // useCookie is a ref that is synced on both server and client.
  const token = useCookie<string | null>('authToken', { default: () => null, sameSite: 'lax' })
  const user = useCookie<User | null>('authUser', { default: () => null, sameSite: 'lax' })

  // 2. --- GETTERS ---
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Helper to get the API URL
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  // 3. --- ACTIONS ---

  // --- 'initAuth' IS NO LONGER NEEDED ---
  // The useCookie composable handles this for us automatically.
  // We can delete the function.

  /**
   * Login Action.
   */
  async function login(credentials: { username: string, password: string }) {
    try {
      const response = await $fetch<LoginResponse>(
        `${apiBaseUrl}/auth/login`,
        {
          method: 'POST',
          body: credentials
        }
      )

      // Update the cookie refs
      token.value = response.token
      user.value = response.user

    } catch (error) {
      console.error('Login failed:', error)
      logout() // Clear cookies on fail
      throw error
    }
  }

  /**
   * Signup Action.
   */
  async function signup(credentials: { username: string, password: string }) {
    try {
      await $fetch(
        `${apiBaseUrl}/auth/signup`,
        {
          method: 'POST',
          body: credentials
        }
      )
      // Log the user in immediately
      await login(credentials)

    } catch (error) {
      console.error('Signup failed:', error)
      logout() // Clear cookies on fail
      throw error
    }
  }

  /**
   * Logout Action
   */
  function logout() {
    // Clear the cookie refs
    token.value = null
    user.value = null
  }

  // 4. --- RETURN ---
  return {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout
    // We don't need to return initAuth anymore
  }
})