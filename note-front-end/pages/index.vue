<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Inbox</h1>
      <NoteModalClient :folder-id="null"/>
    </div>

    <div v-if="inboxNotes.length > 0" class="space-y-4">
      
      <NuxtLink 
        v-for="note in inboxNotes" 
        :key="note.id"
        :to="`/notes/${note.id}`"
        class="block"
      >
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
                Created: {{ new Date(note.createdAt).toLocaleDateString() }}
              </span>
              <UButton 
                label="Delete" 
                color="error" 
                variant="soft" 
                @click.prevent="handleDelete(note.id)" 
              />
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
import { computed } from 'vue' 
import { useNotesStore } from '~/stores/notes'
import NoteModalClient from '~/components/NoteModal.client.vue' 

// Store Setup
const notesStore = useNotesStore()

// Computed property to filter for inbox notes
const inboxNotes = computed(() => {
  return notesStore.allNotes.filter(note => note.folderId === null)
})

// Delete Handler 
function handleDelete(id: string) {
  notesStore.deleteNote(id)
}
</script>