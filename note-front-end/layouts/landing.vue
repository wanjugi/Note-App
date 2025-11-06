<template>
  <div>
    <LandingHeader />

    <main class="relative">
      <slot></slot>
    </main>
    <AppFooter />
    </div>
</template>

<script setup lang="ts">
// We need to import the component we just made
import LandingHeader from '~/components/landingHeader.vue'
</script>