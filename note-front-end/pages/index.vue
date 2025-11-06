<template>
    <UPageHero
        description="The last note-taking app you'll ever need. Organize your thoughts, folders, and tasks. Assign notes to your team and get more done, together."
        :links="heroLinks" :ui="{
            container: 'md:pt-18 lg:pt-20',
            title: 'max-w-3xl mx-auto'
        }">
        <template #top>
            <HeroBackground />
        </template>

        <template #title>
            Capture Your Ideas, <br>
            <span class="text-primary-500">Share Your Vision.</span>
        </template>
    </UPageHero>
</template>

<script setup lang="ts">
// 1. Import the new component we just created
import HeroBackground from '~/components/heroBackground.vue'

// 2. Tell this page to use our new 'landing' layout
definePageMeta({
    layout: 'landing',
    middleware: 'guest'
})

// 3. This defines the static links for the <UPageHero>
const heroLinks = [
    {
        label: 'Get Started',
        to: '/signup',
        size: 'lg' as const,
        icon: 'i-lucide-arrow-right'
    }
]
</script>