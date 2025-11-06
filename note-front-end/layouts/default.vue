<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 transition-all duration-500 ease-in-out">

    <aside class="shrink-0 border-r border-gray-200 dark:border-gray-800 transition-all duration-500 ease-in-out"
      :class="isSidebarOpen ? 'w-64' : 'w-20'">
      <div class="p-4 h-full flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <ULink to="/" class="flex items-center gap-2 mb-4"
            active-class="text-neutral-900 dark:text-neutral-100 font-semibold"
            inactive-class="text-gray-500 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-neutral-100">
            <UIcon name="i-heroicons-pencil-square-solid" class="w-10 h-10" />

            <span v-if="isSidebarOpen" class="text-3xl font-bold">
              NoteApp
            </span>
          </ULink>

          <h3 v-if="isSidebarOpen" class="text-base font-semibold uppercase text-gray-500 mb-2">
            Folders
          </h3>

          <div v-if="isSidebarOpen" class="my-2">
            <FolderModalClient />
          </div>

          <div class="space-y-1">
            <ULink to="/"
              active-class="bg-gray-100 dark:bg-gray-800 text-neutral-900 dark:text-neutral-100 font-semibold"
              inactive-class="hover:bg-gray-50 dark:hover:bg-gray-900"
              class="flex items-center p-3 text-base rounded-md" :class="!isSidebarOpen && 'justify-center'">
              <UIcon name="i-heroicons-inbox-solid" class="w-5 h-5" :class="isSidebarOpen && 'mr-2'" />
              <span v-if="isSidebarOpen">Personal</span>
            </ULink>

            <button type="button" class="flex w-full items-center p-3 text-base rounded-md" :class="[
              !isSidebarOpen && 'justify-center',
              route.path === '/assigned'
                ? 'bg-gray-100 dark:bg-gray-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400'
            ]" @click="handleAssignedClick">
              <UIcon name="i-heroicons-inbox-arrow-down" class="w-5 h-5" :class="isSidebarOpen && 'mr-2'" />
              <span v-if="isSidebarOpen">Inbox</span>
            </button>

            <div v-for="folder in folderStore.allFolders" :key="folder._id"
              class="group flex items-center justify-between p-3 text-base rounded-md"
              :class="!isSidebarOpen && 'justify-center'">
              <ULink :to="`/folders/${folder._id}`" active-class="text-neutral-900 dark:text-neutral-100 font-semibold"
                inactive-class="hover:text-neutral-900 dark:hover:text-neutral-100" class="flex flex-1 items-center">
                <UIcon name="i-heroicons-folder" class="w-5 h-5" :class="isSidebarOpen && 'mr-2'" />
                <span v-if="isSidebarOpen">{{ folder.name }}</span>
              </ULink>

              <UButton v-if="isSidebarOpen" icon="i-heroicons-trash-20-solid" color="error" variant="ghost" size="xs"
                class="opacity-0 group-hover:opacity-100" @click="handleDeleteFolder(folder._id, folder.name)" />
            </div>
            <!-- === NEW ADMIN-ONLY LINK === -->
            <ULink v-if="authStore.user && authStore.user.role === 'admin'" to="/admin"
              active-class="bg-gray-100 dark:bg-gray-800" class="flex items-center p-3 text-base rounded-md">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 mr-2" />
              <span v-if="isSidebarOpen">Admin Panel</span>
            </ULink>
          </div>
        </div>

        <AppFooter class="mt-4" />

      </div>
    </aside>

    <main class="flex-1 overflow-y-auto">
      <AppHeader v-model:isSidebarOpen="isSidebarOpen" v-model:isDark="isDark" />

      <section class="p-6">
        <slot></slot>
      </section>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// 1. Import router and route
import { useRouter, useRoute } from 'vue-router'
import { useFoldersStore } from '~/stores/folders'
import { useAuthStore } from '~/stores/auth'
import FolderModalClient from '~/components/FolderModal.client.vue'

definePageMeta({
  middleware: 'auth'
})

const folderStore = useFoldersStore()
const authStore = useAuthStore()
// 2. Initialize router and route
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Sidebar state
const isSidebarOpen = ref(true)

// (Your watch function is perfect and stays the same)
watch(
  () => authStore.isAuthenticated,
  (isNowAuthenticated) => {
    if (isNowAuthenticated) {
      folderStore.fetchFolders()
    } else {
      folderStore.clearFolders()
    }
  },
  { immediate: true }
)

// (Your colorMode computed is perfect and stays the same)
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

// --- 3. THIS FUNCTION IS UPDATED ---
async function handleDeleteFolder(folderId: string, folderName: string) {
  // 1. Show confirmation
  if (confirm(`Are you sure you want to delete the folder "${folderName}"? \n\nAll notes inside it will be moved to your Inbox.`)) {

    // 2. Call the store action and WAIT for it to finish
    await folderStore.deleteFolder(folderId)

    // 3. Check if we are *currently* on the page we just deleted
    // We check if the route name is the folder page and the ID matches
    if (route.name === 'folders-id' && route.params.id === folderId) {

      // 4. If so, navigate to the Inbox (homepage)
      router.push('/')
    }
    // (If we're not on that page, it does nothing,
    // which is also correct)
  }
}

function handleAssignedClick() {
  if (authStore.isAuthenticated) {
    // If logged in, go to the page
    router.push('/assigned')
  } else {
    // If logged out, show the toast
    toast.add({
      title: 'Authentication Required',
      description: 'Please sign in to view your assigned notes.',
      icon: 'i-heroicons-lock-closed',
      color: 'warning',
      duration: 8000
    })
  }
}
</script>