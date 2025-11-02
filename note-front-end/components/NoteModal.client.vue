<template>
    <div>
        <UModal v-model:open="open" title="New Note" description="Add a new note to your folder" :ui="{
            content: 'sm:max-w-3xl',
            body: 'py-5',
            title: 'text-2xl font-semibold',
            description: 'text-base text-gray-500 dark:text-gray-400'
        }">

            <UButton label="New Note" icon="i-heroicons-plus" color="neutral"/>

            <template #body>
                <UForm :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormField label="Title" name="title">
                        <UInput v-model="state.title" placeholder="My new note title" class="w-full pb-3" color="neutral" />
                    </UFormField>

                    <UFormField label="Content" name="content">
                        <UTextarea vType="text" :rows="8" v-model="state.content" placeholder="Start writing..."
                            class="w-full pb-3" color="neutral" />
                    </UFormField>

                    <div class="flex justify-end gap-2">
                        <UButton label="Cancel" color="secondary" variant="ghost" @click="open = false" />
                        <UButton label="Save Note" type="submit" color="neutral" />
                    </div>
                </UForm>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNotesStore } from '~/stores/notes'


const open = ref(false)
const notesStore = useNotesStore()

// state OBJECT
const state = reactive({
    title: '',
    content: ''
})
// Props
const props = defineProps({
  folderId: {
    type: String as () => string | null,
    default: null // Defaults to (Inbox)
  }
})

// Submit Handler
async function onSubmit() {
    // Call the store action
    notesStore.addNote({
        title: state.title, // Get title from state
        content: state.content || '',
        folderId: props.folderId // Use folderId prop
    })

    // Reset the state
    state.title = ''
    state.content = ''

    // Close the modal
    open.value = false
}
</script>