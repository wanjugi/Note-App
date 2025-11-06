<template>
  <header class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
    <ULink to="/" class="flex items-center gap-2" active-class="text-neutral-900 dark:text-neutral-100 font-semibold"
      inactive-class="text-gray-500 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-neutral-100">
      <UIcon name="i-heroicons-pencil-square-solid" class="w-10 h-10" />
      <span class="text-3xl font-bold">
        NoteApp
      </span>
    </ULink>

    <div class="flex items-center gap-x-2">
      <ClientOnly class="mr-2">
        <UButton 
          :icon="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'" 
          color="neutral"
          variant="ghost" 
          aria-label="Theme" 
          @click="isDark = !isDark" 
        />
      </ClientOnly>

      <UButton label="Sign in" color="neutral" variant="outline" to="/login" class="hidden lg:inline-flex" />
      <UButton 
        label="Sign up" 
        color="neutral" 
        trailing-icon="i-lucide-arrow-right"
        class="hidden lg:inline-flex" 
        to="/signup" 
      />
    </div>
  </header>
</template>

<script setup lang="ts">
// Simple color mode logic for this header
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>