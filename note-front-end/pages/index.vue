<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Personal</h1>

      <NoteModalClient :folder-id="null" />
    </div>

    <div v-if="inboxNotes.length > 0" class="space-y-4">

      <NuxtLink v-for="note in inboxNotes" :key="note._id" :to="`/notes/${note._id}`" class="block">
        <UCard class="hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
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
        Your inbox is empty.
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useNotesStore } from '~/stores/notes'
import { useAuthStore } from '~/stores/auth'
import NoteModalClient from '~/components/NoteModal.client.vue'

// Store Setup
const notesStore = useNotesStore()
const authStore = useAuthStore()

// This computed prop points to the store's data
const inboxNotes = computed(() => notesStore.currentNotes)

// 5. This watch fetches data as soon as the user is logged in.
watch(
  () => authStore.isAuthenticated,
  (isNowAuthenticated) => {
    if (isNowAuthenticated) {
      // Call the action to get 'Inbox' notes (where folder is null)
      notesStore.fetchInboxNotes()
    } else {
      // If user logs out, clear the notes
      notesStore.clearNotes()
    }
  },
  { immediate: true } // This runs the check on page load
)

// Delete Handler 
function handleDelete(id: string) {
  notesStore.deleteNote(id)
}
</script>