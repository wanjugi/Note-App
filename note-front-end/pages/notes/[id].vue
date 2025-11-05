<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <UButton label="Back" icon="i-heroicons-arrow-left" variant="ghost" @click="goBack" />

            <div v-if="note" class="flex space-x-2">
                <UButton v-if="!isEditing" label="Edit" icon="i-heroicons-pencil" @click="startEditing" />
                <template v-else>
                    <UButton label="Cancel" color="secondary" variant="ghost" @click="cancelEditing" />
                    <UButton label="Save" icon="i-heroicons-check" @click="saveNote" />
                </template>
            </div>
        </div>

        <div v-if="pending">
            <p>Loading note...</p>
        </div>

        <div v-else-if="note">
            <div v-if="isEditing" class="space-y-4">
                <UFormField label="Title" name="title">
                    <UInput v-model="editableNote.title" class="w-full pb-3" />
                </UFormField>

                <UFormField label="Content" name="content">
                    <UTextarea :rows="8" v-model="editableNote.content" class="w-full pb-3" autoresize />
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
            <p>This note may have been deleted or you don't have permission to see it.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue' // 'computed' is not needed here
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '~/stores/notes'
import { useAuthStore } from '~/stores/auth' // <-- 1. Import Auth Store
import type { Note } from '~/types'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const authStore = useAuthStore() // <-- 2. Initialize Auth Store
const noteId = route.params.id as string

// (Your useAsyncData block is perfect and stays the same)
const { data: note, pending } = await useAsyncData(
    `note-${noteId}`,
    async () => {
        await notesStore.fetchNoteById(noteId)
        return notesStore.currentSelectedNote
    }
)

const isEditing = ref(false)
const editableNote = reactive({
    title: '',
    content: ''
})

// (startEditing and cancelEditing are perfect and stay the same)
function startEditing() {
    if (!note.value) return
    editableNote.title = note.value.title
    editableNote.content = note.value.content
    isEditing.value = true
}

function cancelEditing() {
    isEditing.value = false
}

// --- FIX 3: 'saveNote' function updated ---
async function saveNote() {
    if (!note.value) return

    // Call the store action
    const updatedNote = await notesStore.updateNote(note.value._id, {
        title: editableNote.title,
        content: editableNote.content,
        folderId: note.value.folder,
        // We must pass the assigneeId to match the store's action
        assigneeId: note.value.assignee
    })

    // (Your sync and closing logic is perfect)
    if (updatedNote) {
        note.value = updatedNote
    }
    isEditing.value = false
}

// --- FIX 4: 'goBack' function logic is updated ---
function goBack() {
    if (!note.value || !authStore.user) {
        router.push('/') // Default fallback
        return
    }

    // Check if the current user is the author
    const isAuthor = note.value.author === authStore.user._id

    if (isAuthor) {
        // If you are the author, use the original folder/inbox logic
        if (note.value.folder) {
            router.push(`/folders/${note.value.folder}`)
        } else {
            router.push('/') // Go to Inbox
        }
    } else {
        // If you are not the author, you must be the assignee.
        // Go to the "Assigned to Me" page.
        router.push('/assigned')
    }
}
</script>