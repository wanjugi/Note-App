<template>
    <div class="relative">

        <div class="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgb(var(--color-primary-500)/0.3),transparent)] blur-3xl"
            aria-hidden="true" />

        <LandingHeader />

        <main>
            <slot></slot>
        </main>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
// We need to import the component we just made
import LandingHeader from '~/components/landingHeader.vue'
// We also need to import your footer
import AppFooter from '~/components/appFooter.vue'
</script>