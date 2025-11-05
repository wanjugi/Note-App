<template>
  <div>
    <UModal 
      v-model:open="isOpen" 
      title="New Folder" 
      description="Create a new folder to organize your notes"
      :ui="{
        content: 'sm:max-w-md',
        body: 'py-5',
        title: 'text-2xl font-semibold',
        description: 'text-base text-gray-500 dark:text-gray-400'
      }"
    >
      
      <UButton 
        label="New Folder" 
        icon="i-heroicons-plus" 
        color="neutral"
        @click.prevent="handleClick"
      />

      <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
          
          <UFormField label="Folder Name" name="name">
            <UInput 
              v-model="state.name" 
              placeholder="e.g., 'Work Projects'" 
              class="w-full pb-3" 
              color="neutral" 
            />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton label="Cancel" color="secondary" variant="ghost" @click="isOpen = false" />
            <UButton 
              label="Create Folder" 
              type="submit" 
              :loading="isLoading" 
              color="neutral" 
            />
          </div>

        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod' 
import { useFoldersStore } from '~/stores/folders'
import { useAuthStore } from '~/stores/auth'
import type { FormSubmitEvent } from '@nuxt/ui'

const foldersStore = useFoldersStore()
// INITIALIZE AUTH AND TOAST ---
const authStore = useAuthStore()
const toast = useToast()
// ------------------------------------

const isOpen = ref(false)
const isLoading = ref(false)

const schema = z.object({
  name: z.string().min(1, 'Folder name is required')
})

type Schema = z.output<typeof schema>

const state = reactive({
  name: ''
})

function handleClick() {
  if (authStore.isAuthenticated) {
    // If logged in, open the modal as normal
    isOpen.value = true
  } else {
    // If logged out, show the toast notification
    toast.add({
      title: 'Authentication Required',
      description: 'Please sign in to create a new folder.',
      icon: 'i-heroicons-lock-closed',
      color: 'warning',
      duration: 10000 
    })
  }
}

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    await foldersStore.addFolder({ name: event.data.name })
    isOpen.value = false
    state.name = ''
  } catch (error) {
    console.error('Failed to create folder:', error)
  } finally {
    isLoading.value = false
  }
}
</script>