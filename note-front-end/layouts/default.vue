<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 transition-all duration-500 ease-in-out">

    <aside class="shrink-0 border-r border-gray-200 dark:border-gray-800 transition-all duration-500 ease-in-out"
      :class="isSidebarOpen ? 'w-64' : 'w-20'">
      <div class="p-4 h-full">
        <ULink to="/" class="flex items-center gap-2 mb-4" active-class="text-neutral-900 dark:text-neutral-100 font-semibold"
         inactive-class="text-gray-500 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-neutral-100">
          <UIcon name="i-heroicons-pencil-square-solid" class="w-8 h-8" />

          <span v-if="isSidebarOpen" class="text-xl font-bold">
            NoteApp
          </span>
        </ULink>

        <h3 v-if="isSidebarOpen" class="text-base font-semibold uppercase text-gray-500 mb-2">
          Folders
        </h3>

        <div class="space-y-1">
          <ULink to="/" active-class="bg-gray-100 dark:bg-gray-800 text-neutral-900 dark:text-neutral-100 font-semibold"
            inactive-class="hover:bg-gray-50 dark:hover:bg-gray-900" class="flex items-center p-3 text-base rounded-md"
            :class="!isSidebarOpen && 'justify-center'">
            <UIcon name="i-heroicons-inbox-solid" class="w-5 h-5" :class="isSidebarOpen && 'mr-2'" />
            <span v-if="isSidebarOpen">Inbox</span>
          </ULink>

          <ULink v-for="folder in folderStore.allFolders" :key="folder.id" :to="`/folders/${folder.id}`"
            active-class="bg-gray-100 dark:bg-gray-800 text-neutral-900 dark:text-neutral-100 font-semibold"
            inactive-class="hover:bg-gray-50 dark:hover:bg-gray-900" class="flex items-center p-3 text-base rounded-md"
            :class="!isSidebarOpen && 'justify-center'">
            <UIcon name="i-heroicons-folder" class="w-5 h-5" :class="isSidebarOpen && 'mr-2'" />
            <span v-if="isSidebarOpen">{{ folder.name }}</span>
          </ULink>
        </div>
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
import { ref, computed } from 'vue'
import { useFoldersStore } from '~/stores/folders'

const folderStore = useFoldersStore()
// Sidebar state
const isSidebarOpen = ref(true)

// Color mode script
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>