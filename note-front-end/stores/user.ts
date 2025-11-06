// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import type { User } from '~/types'

export const useUserStore = defineStore('users', () => {
  // 1. STATE
  const userList = ref<User[]>([])      // For the "Assign" dropdown
  const adminUserList = ref<User[]>([]) // For your future admin panel

  // 2. GETTERS
  const allUsersForDropdown = computed(() => userList.value)
  const allUsersForAdmin = computed(() => adminUserList.value)

  // 3. HELPERS
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const getHeaders = () => {
    return { 'Authorization': `Bearer ${authStore.token}` }
  }
  const apiBaseUrl = config.public.apiBaseUrl

  // 4. ACTIONS

  /**
   * [PUBLIC] Fetches the simple user list for the "Assign" dropdown.
   * Calls GET /api/users/list
   */
  async function fetchUserList() {
    if (userList.value.length > 0 || !authStore.token) return
    try {
      const response = await $fetch<User[]>(
        `${apiBaseUrl}/users/list`, // <-- Calls the new, public route
        { headers: getHeaders() }
      )
      userList.value = response
    } catch (error) {
      console.error('Failed to fetch user list:', error)
    }
  }

  /**
   * [ADMIN] Fetches the full user list for the admin panel.
   */
  async function fetchAdminUserList() {
    if (!authStore.token || authStore.user?.role !== 'admin') return
    try {
      const response = await $fetch<User[]>(
        `${apiBaseUrl}/users/admin`,
        { headers: getHeaders() }
      )
      adminUserList.value = response
    } catch (error) {
      console.error('Failed to fetch admin user list:', error)
    }
  }

  /**
   * [ADMIN] Updates a user's role.
   */
  async function updateUserRole(userId: string, newRole: string) {
    if (!authStore.token || authStore.user?.role !== 'admin') return
    try {
      const updatedUser = await $fetch<User>(
        `${apiBaseUrl}/users/admin/${userId}/role`,
        {
          method: 'PUT',
          headers: getHeaders(),
          body: { role: newRole }
        }
      )
      const index = adminUserList.value.findIndex(u => u._id === userId)
      if (index !== -1) {
        adminUserList.value[index] = updatedUser
      }
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  /**
   * [ADMIN] Deletes a user.
   * Calls DELETE /api/users/admin/:id
   */
  async function deleteUser(userId: string) {
    // Only admins can run this
    if (!authStore.token || authStore.user?.role !== 'admin') {
      return
    }

    try {
      // 1. Call the new "DELETE" endpoint
      await $fetch(
        `${apiBaseUrl}/users/admin/${userId}`,
        {
          method: 'DELETE',
          headers: getHeaders()
        }
      )

      // 2. On success, remove the user from the local admin list
      // This will make the UI update instantly
      adminUserList.value = adminUserList.value.filter(u => u._id !== userId)

    } catch (error) {
      console.error('Failed to delete user:', error)
      // We'll show a toast from the page
      throw error // Re-throw the error so the page can catch it
    }
  }

  // 5. RETURN
  return {
    userList,
    adminUserList,
    allUsersForDropdown,
    allUsersForAdmin,
    fetchUserList,       
    fetchAdminUserList,
    updateUserRole,
    deleteUser
  }
})