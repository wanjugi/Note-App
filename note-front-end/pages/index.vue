<template>
  <div class="relative">

    <div 
      class="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary-500/30 to-transparent blur-3xl" 
      aria-hidden="true" 
    ></div>

    <UPageHero
      description="The last note-taking app you'll ever need. Organize your thoughts, folders, and tasks. Assign notes to your team and get more done, together."
      :links="heroLinks"
      :ui="{
        container: 'md:pt-18 lg:pt-20',
        title: 'max-w-3xl mx-auto'
      }"
    >
      <template #title>
        Capture Your Ideas, <br>
        <span class="text-primary-500">Share Your Vision.</span>
      </template>
    </UPageHero>

    </div>
</template>

<script setup lang="ts">
// 1. Tell this page to use our new 'landing' layout
definePageMeta({
  layout: 'landing',
  middleware: 'guest'
})

// 2. This defines the static links for the <UPageHero>
// (The "Sign in/up" buttons are in the header)
const heroLinks = [
  {
    label: 'Get Started',
    to: '/signup',
    size: 'lg'as const,
    icon: 'i-lucide-arrow-right'
  }
]
</script>