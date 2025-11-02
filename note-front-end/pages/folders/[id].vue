<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">{{ folderName }}</h1>
            <NoteModalClient :folder-id="folderId" />
        </div>

        <div v-if="filteredNotes.length > 0" class="space-y-4">
            <NuxtLink v-for="note in filteredNotes" :key="note.id" :to="`/notes/${note.id}`" class="block">
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
                            <UButton label="Delete" color="error" variant="soft"
                                @click.prevent="handleDelete(note.id)" />
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNotesStore } from '~/stores/notes'
import { useFoldersStore } from '~/stores/folders'
import NoteModalClient from '~/components/NoteModal.client.vue'

// Get stores
const notesStore = useNotesStore()
const foldersStore = useFoldersStore()

// Get route to find the folder ID
const route = useRoute()
const folderId = route.params.id as string

// 4. Find the folder name
const folder = foldersStore.getFolderById(folderId)
const folderName = folder ? folder.name : 'Folder'

// 5. Create a filtered list of notes
const filteredNotes = computed(() => {
    return notesStore.allNotes.filter(note => note.folderId === folderId)
})

// Delete handler is the same
function handleDelete(id: string) {
    notesStore.deleteNote(id)
}
</script>