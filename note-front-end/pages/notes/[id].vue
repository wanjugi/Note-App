<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <UButton label="Back to All Notes" icon="i-heroicons-arrow-left" variant="ghost" to="/" />

            <div v-if="note" class="flex space-x-2">
                <UButton v-if="!isEditing" label="Edit" icon="i-heroicons-pencil" @click="startEditing" />
                <template v-else>
                    <UButton label="Cancel" color="secondary" variant="ghost" @click="cancelEditing" />
                    <UButton label="Save" icon="i-heroicons-check" @click="saveNote" />
                </template>
            </div>
        </div>

        <div v-if="note">
            <div v-if="isEditing" class="space-y-4">
                <UFormField label="Title" name="title">
                    <UInput v-model="editableNote.title" class="w-full pb-3" />
                </UFormField>

                <UFormField label="Content" name="content">
                    <UTextarea vType="text" :rows="8" v-model="editableNote.content" class="w-full pb-3" autoresize />
                </UFormField>

            </div>

            <div v-else class="space-y-6">
                <h1 class="text-4xl font-bold">{{ note.title }}</h1>
                <p class="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {{ note.content }}
                </p>
            </div>
        </div>

        <div v-else>
            <h1 class="text-3xl font-bold">Note Not Found</h1>
            <p>...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '~/stores/notes'
import type { Note } from '~/types'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const noteId = route.params.id as string

// Find the original note
const note = notesStore.getNoteById(noteId)

// 4. Add editing state
const isEditing = ref(false)
const editableNote = reactive({
    title: '',
    content: ''
})

// 5. Add editing functions
function startEditing() {
    if (!note) return
    // Copy current note data into the editable state
    editableNote.title = note.title
    editableNote.content = note.content
    isEditing.value = true
}

function cancelEditing() {
    isEditing.value = false
    // Discard changes
    editableNote.title = ''
    editableNote.content = ''
}

function saveNote() {
    if (!note) return

    // Call the store action
    notesStore.updateNote(note.id, {
        title: editableNote.title,
        content: editableNote.content
    })

    isEditing.value = false
}

// Redirect if note not found
if (!note) {
    // You can also use router.push('/404') if you have one
    router.push('/')
}
</script>