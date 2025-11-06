// middleware/guest.ts
// This "guest" guard protects public-only pages (like login, landing).

export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Get the auth store
  const { isAuthenticated } = useAuthStore()

  // 2. Check if the user is authenticated
  if (isAuthenticated) {
    // If they are, redirect them to the main app page ('/app')
    return navigateTo('/app')
  }

  // 3. If they are NOT authenticated, allow them to proceed
  // (they are a "guest" and should see the landing/login page)
  return
})