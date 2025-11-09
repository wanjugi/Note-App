<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Inbox</h1>
        </div>

        <div v-if="assignedNotes.length > 0" class="space-y-4">

            <NuxtLink v-for="note in assignedNotes" :key="note._id" :to="`/notes/${note._id}`" class="block">
                <UCard
                    class="border border-transparent hover:border-primary-300 dark:hover:border-primary-400 transition-colors">
                    <template #header>
                        <h2 class="font-semibold text-lg">{{ note.title }}</h2>
                    </template>

                    <p class="text-gray-700 dark:text-gray-300 truncate">
                        {{ note.content }}
                    </p>

                    <template #footer>
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">

                            <div class="flex flex-col gap-0.5">
                                <span class="text-sm text-gray-700 dark:text-gray-300">
                                    <template v-if="typeof note.author === 'object' && note.author !== null">
                                        From: <span class="font-semibold">{{ note.author.username }}</span>
                                    </template>
                                    <template v-else-if="typeof note.assignee === 'object' && note.assignee !== null">
                                        To: <span class="font-semibold">{{ note.assignee.username }}</span>
                                    </template>
                                    <template v-else>
                                        Personal Note
                                    </template>
                                </span>

                                <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                                    {{ new Date(note.createdAt).toLocaleString() }}
                                </span>
                            </div>

                            <UButton label="Delete" color="error" variant="ghost" size="xs" icon="i-heroicons-trash"
                                @click.prevent="handleDelete(note._id)" />
                        </div>
                    </template>
                </UCard>
            </NuxtLink>
        </div>

        <div v-else>
            <p class="text-gray-500 dark:text-gray-400">
                No notes have been assigned to you.
            </p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useNotesStore } from '~/stores/notes'
import { useAuthStore } from '~/stores/auth'

// Store Setup
const notesStore = useNotesStore()
const authStore = useAuthStore()

const assignedNotes = computed(() => notesStore.currentNotes)

// (Your watch block is perfect and stays the same)
watch(
    () => authStore.isAuthenticated,
    (isNowAuthenticated) => {
        if (isNowAuthenticated) {
            notesStore.fetchAssignedNotes()
        } else {
            notesStore.clearNotes()
        }
    },
    { immediate: true }
)

// --- ADD THIS NEW FUNCTION ---
// This calls the *exact same* action your Inbox page uses
function handleDelete(id: string) {
    // We'll add a confirmation dialog to be safe
    if (confirm('Are you sure you want to delete this note?')) {
        notesStore.deleteNote(id)
    }
}
</script>