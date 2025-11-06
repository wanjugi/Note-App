<template>
    <div>
        <h1 class="text-3xl font-bold mb-6">Admin Panel: Manage Users</h1>

        <div v-if="userStore.allUsersForAdmin.length > 0" class="flex flex-col gap-4">
            <UCard v-for="user in userStore.allUsersForAdmin" :key="user._id">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <UAvatar :alt="user.username.charAt(0).toUpperCase()" size="md" />
                        <div>
                            <p class="font-semibold">{{ user.username }}</p>
                            <p class="text-sm text-gray-500">{{ user._id }}</p>
                        </div>
                    </div>

                    <div class="w-48">
                        <select :value="user.role" :disabled="user._id === authStore.user?._id"
                            @change="handleRoleChange(user._id, ($event.target as HTMLSelectElement).value)"
                            class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6">
                            <option v-for="role in roleOptions" :key="role" :value="role">
                                {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                            </option>
                        </select>
                    </div>
                </div>
            </UCard>
        </div>
        <div v-else>
            <p>Loading users...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/user' // Or your 'user' path
import { useAuthStore } from '~/stores/auth'

// 1. THIS IS THE "LOCK"
// This line tells Nuxt to run our new 'admin' middleware
// before rendering this page.
definePageMeta({
    middleware: ['auth', 'admin']
})

// 2. Initialize stores
const userStore = useUserStore()
const authStore = useAuthStore()
const toast = useToast()

// 3. Define the options for the dropdown
const roleOptions = ['user', 'moderator', 'admin']

// 4. Fetch the admin user list when the page loads
onMounted(() => {
    // We call the *admin* function here
    userStore.fetchAdminUserList()
})

// 5. This is the function that calls our store action
async function handleRoleChange(userId: string, newRole: string) {
    if (confirm(`Are you sure you want to change this user's role to "${newRole}"?`)) {
        await userStore.updateUserRole(userId, newRole)
        toast.add({
            title: 'Role Updated',
            description: `User role has been set to ${newRole}.`,
            color: 'success'
        })
    } else {
        // If they click "Cancel", we need to refresh the list
        // to reset the dropdown to its original value (this is a small UX fix)
        await userStore.fetchAdminUserList()
    }
}
</script>