<template>
    <header class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
        <UButton
            :icon="isSidebarOpen ? 'i-heroicons-chevron-double-left-solid' : 'i-heroicons-chevron-double-right-solid'"
            color="neutral" variant="ghost" aria-label="Toggle Sidebar" @click="isSidebarOpen = !isSidebarOpen" />

        <div class="flex items-center gap-x-2">
            <UButton :icon="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'" color="neutral" variant="ghost"
                aria-label="Theme" @click="isDark = !isDark" />

            <template v-if="!authStore.isAuthenticated">
                <UButton label="Sign in" color="neutral" variant="outline" to="/login" class="hidden lg:inline-flex" />
                <UButton label="Sign up" color="neutral" trailing-icon="i-lucide-arrow-right"
                    class="hidden lg:inline-flex" to="/signup" />
            </template>
            <template v-else>
                <UButton label="Logout" color="neutral" variant="outline" @click="handleLogout" />
            </template>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// INITIALIZE store and router
const authStore = useAuthStore()
const router = useRouter()

// models
const isSidebarOpen = defineModel<boolean>('isSidebarOpen')
const isDark = defineModel<boolean>('isDark')

// Logout handler
function handleLogout() {
  authStore.logout()
  // Redirect to login page after logout
  router.push('/login')
}
</script>