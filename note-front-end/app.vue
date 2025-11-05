<template>
  <div>
    <UApp>
      <NuxtLoadingIndicator />
      <UNotifications />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(() => {
  authStore.initAuth()
})

watch(
  () => authStore.isAuthenticated,
  (isNowAuthenticated) => {
    if (isNowAuthenticated) {
      // --- FIX: Call the correct function ---
      userStore.fetchUserList()
    }
  },
  { immediate: true }
)
</script>