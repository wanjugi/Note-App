<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">{{ folderName }}</h1>
      <NoteModalClient :folder-id="folderId" />
    </div>

    <div v-if="folderNotes.length > 0" class="space-y-4">
      <NuxtLink v-for="note in folderNotes" :key="note._id" :to="`/notes/${note._id}`" class="block">
        <UCard
          class="border border-transparent hover:border-primary-300 dark:hover:border-primary-400 transition-colors">
          <template #header>
            <h2 class="font-semibold text-lg">{{ note.title }}</h2>
          </template>

          <p class="text-gray-700 dark:text-gray-300 truncate">
            {{ note.content }}
          </p>

          <template #footer>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                Created: {{ new Date(note.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
                }}
              </span>
              <UButton label="Delete" color="error" variant="soft" @click.prevent="handleDelete(note._id)" />
            </div>
          </template>
        </UCard>
      </NuxtLink>
    </div>
    <div v-else>
      <p class="text-gray-500 dark:text-gray-400">
        You don't have any notes in this folder yet.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNotesStore } from '~/stores/notes'
import { useFoldersStore } from '~/stores/folders'
import { useAuthStore } from '~/stores/auth'
import NoteModalClient from '~/components/NoteModal.client.vue'

// Get stores
const notesStore = useNotesStore()
const foldersStore = useFoldersStore()
const authStore = useAuthStore()

// Get route to find the folder ID
const route = useRoute()
const folderId = route.params.id as string

// --- DATA FETCHING ---
// fetch the notes for this specific folder.
watch(
  () => authStore.isAuthenticated,
  (isNowAuthenticated) => {
    if (isNowAuthenticated) {
      // Call the action to get notes FOR THIS FOLDER
      notesStore.fetchNotesByFolder(folderId)
    } else {
      // If user logs out, clear the notes
      notesStore.clearNotes()
    }
  },
  { immediate: true }
)

// DATA DISPLAY 
// This computed prop now just points to the store's current data,
// which our 'watch' block is responsible for fetching.
const folderNotes = computed(() => notesStore.currentNotes)

// Find the folder name
// This is computed, so it will update when the foldersStore loads.
const folderName = computed(() => {
  const folder = foldersStore.getFolderById(folderId)
  return folder ? folder.name : 'Folder' // Show 'Folder' while loading
})

// --- ACTIONS ---
// This now calls the API-aware deleteNote
function handleDelete(id: string) {
  notesStore.deleteNote(id)
}
</script>