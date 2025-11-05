<template>
    <UAuthForm :fields="fields" :schema="schema" title="Create an account" icon="i-lucide-user-plus" @submit="onSubmit"
        color="neutral" :loading="loading">
        <template #description>
            Already have an account? <ULink to="/login" class="text-primary font-medium">Sign in</ULink>.
        </template>

        <template #footer>
            By signing up, you agree to our <ULink to="/" class="text-primary font-medium">Terms of Service</ULink>.
        </template>
    </UAuthForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

// Tell Nuxt to use our 'auth' layout
definePageMeta({
    layout: 'auth'
})

// INITIALIZE store, router, and loading state
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const toast = useToast() // 

// Schema 
const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Must be at least 8 characters')
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

type Schema = z.output<typeof schema>

const fields = [
    { name: 'username', type: 'text' as const, label: 'Username', placeholder: 'Enter your username' },
    { name: 'password', type: 'password' as const, label: 'Password', placeholder: 'Enter your password' },
    { name: 'confirmPassword', type: 'password' as const, label: 'Confirm Password', placeholder: 'Confirm your password' }
]

// Define the submit handler 
async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true

    try {
        // Call the store action
        await authStore.signup({
            username: event.data.username,
            password: event.data.password
        })

        // Redirect to homepage on success
        router.push('/')

    } catch (error: any) { 
        console.error('Signup failed:', error)

        // Show an error toast
        toast.add({
            title: 'Signup Failed',
            // This will show our backend error, e.g., "Username already exists."
            description: error.data?.message || 'An unexpected error occurred.',
            icon: 'i-heroicons-exclamation-circle',
            color: 'error',
            duration: 5000
        })

    } finally {
        loading.value = false // Stop loading
    }
}
</script>