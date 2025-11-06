// middleware/auth.ts
// This "auth" guard protects private pages.

export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Get the auth store
  const { isAuthenticated } = useAuthStore()

  // 2. Check if the user is authenticated
  if (isAuthenticated) {
    // If they are, allow them to proceed
    return
  }

  // 3. If they are NOT authenticated, redirect them to the landing page.
  return navigateTo('/')
})