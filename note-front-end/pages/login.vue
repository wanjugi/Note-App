<template>
  <UAuthForm
    :fields="fields"  :schema="schema"  title="Welcome back"
    icon="i-lucide-lock"
    @submit="onSubmit"
    color="neutral"
  >
    <template #description>
      Don't have an account? <ULink
        to="/signup"
        class="text-primary font-medium"
        color="neutral"
      >Sign up</ULink>.
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
        color="neutral"
      >Forgot password?</ULink>
    </template>

    <template #footer>
      By signing in, you agree to our <ULink
        to="/"
        class="text-primary font-medium"
        color="neutral"
      >Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import { ref } from 'vue' 
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth' 
import { useRouter } from 'vue-router'

// 1. Tell Nuxt to use our new 'auth' layout
definePageMeta({
  layout: 'auth'
})

// INITIALIZE store, router, and loading state 
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

// 2. Schema
const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

// 3. Fields
const fields = [
  { name: 'username', type: 'text' as const, label: 'Username', placeholder: 'Enter your username' },
  { name: 'password', type: 'password' as const, label: 'Password', placeholder: 'Enter your password' }
]

// 4. Define the submit handler 
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true // Start loading

  try {
    // Call the store action
    await authStore.login(event.data)
    
    // Redirect to homepage on success
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    // TODO: Show an error toast
  } finally {
    loading.value = false // Stop loading
  }
}
</script>