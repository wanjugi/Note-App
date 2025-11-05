<template>
    <div>
        <UModal v-model:open="open" title="New Note" description="Add a new note to your folder" :ui="{
            content: 'sm:max-w-3xl',
            body: 'py-5',
            title: 'text-2xl font-semibold',
            description: 'text-base text-gray-500 dark:text-gray-400'
        }">
            <UButton label="New Note" icon="i-heroicons-plus" color="neutral" size="lg" @click.prevent="handleClick" />

            <template #body>
                <UForm v-if="open" :state="state" class="space-y-4" @submit="onSubmit">

                    <UFormField label="Title" name="title">
                        <UInput v-model="state.title" placeholder="My new note title" class="w-full pb-3"
                            color="neutral" />
                    </UFormField>

                    <UFormField label="Content" name="content">
                        <UTextarea vType="text" :rows="8" v-model="state.content" placeholder="Start writing..."
                            class="w-full pb-3" color="neutral" />
                    </UFormField>

                    <UFormField label="Assign to User" name="assignee">
                        <select v-model="state.assigneeId"
                            class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6">
                            <option v-for="option in optionsForDropdown" :key="option.value || 'null'"
                                :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
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
// 1. We NO LONGER need 'computed'
import { ref, reactive } from 'vue'
import { useNotesStore } from '~/stores/notes'
import { useAuthStore } from '~/stores/auth'
// Make sure this import path is correct for you
import { useUserStore } from '~/stores/user'

const open = ref(false)
const notesStore = useNotesStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const toast = useToast()

const state = reactive({
    title: '',
    content: '',
    assigneeId: null as string | null
})

const props = defineProps({
    folderId: {
        type: String as () => string | null,
        default: null
    }
})

// 2. THIS REPLACES YOUR 'computed' PROP
// It's a simple 'ref' that we will build manually.
const optionsForDropdown = ref<Array<{ label: string, value: string | null }>>([])

// 3. YOUR HANDLECLICK IS UPDATED
async function handleClick() {
    console.log('handleClick is RUNNING!');
    if (authStore.isAuthenticated) {

        // 1. Fetch the users
        await userStore.fetchUserList()
        console.log('Users from store:', userStore.allUsersForDropdown);

        // 2. Manually build the options list
        const usersList = userStore.allUsersForDropdown.map(user => ({
            label: user.username,
            value: user._id
        }));

        // 3. Set our 'ref' with the complete, formatted list
        optionsForDropdown.value = [
            { label: 'None (Personal Note)', value: null },
            ...usersList
        ];

        // 4. NOW we open the modal
        open.value = true

    } else {
        // ... (toast logic)
        toast.add({
            title: 'Authentication Required',
            description: 'Please sign in to add a new note.',
            icon: 'i-heroicons-lock-closed',
            color: 'warning',
            duration: 8000
        })
    }
}

// 4. YOUR ONSUBMIT IS UPDATED
async function onSubmit() {
    await notesStore.addNote({
        title: state.title,
        content: state.content || '',
        folderId: props.folderId,
        assigneeId: state.assigneeId
    })

    // Close the modal
    open.value = false

    // Reset the state *after* it's closed
    state.title = ''
    state.content = ''
    state.assigneeId = null
}
</script>