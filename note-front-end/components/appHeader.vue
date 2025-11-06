<template>
    <header class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
        <UButton
            :icon="isSidebarOpen ? 'i-heroicons-chevron-double-left-solid' : 'i-heroicons-chevron-double-right-solid'"
            color="neutral" variant="ghost" aria-label="Toggle Sidebar" @click="isSidebarOpen = !isSidebarOpen" />

        <div class="flex items-center gap-x-2">

            <template v-if="authStore.isAuthenticated">
                <ClientOnly class="mr-4">
                    <UButton :icon="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'" color="neutral"
                        variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
                </ClientOnly>

                <UAvatar v-if="authStore.user" :alt="authStore.user.username.charAt(0).toUpperCase()" size="sm" />
                <span v-if="authStore.user"
                    class="hidden text-sm font-medium text-gray-900 dark:text-white lg:inline-flex">
                    {{ authStore.user.username }}
                </span>

                <UDivider orientation="vertical" class="mx-1 h-6" />
                <UButton label="Logout" color="neutral" variant="outline" @click="handleLogout" />
            </template>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
// --- 1. ADD THIS IMPORT ---
import { useRouter } from 'vue-router'

// INITIALIZE store and router
const authStore = useAuthStore()
const router = useRouter() // This will now work correctly

// models
const isSidebarOpen = defineModel<boolean>('isSidebarOpen')
const isDark = defineModel<boolean>('isDark')

// Logout handler
function handleLogout() {
    authStore.logout()

    // This will now redirect to your landing page
    router.push('/')
}
</script>