// middleware/admin.ts
// This middleware will protect our admin routes

export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Get the auth store
  const { isAuthenticated, user } = useAuthStore()

  // 2. Check if the user is logged in AND is an admin
  if (isAuthenticated && user?.role === 'admin') {
    // They are an admin! Allow them to proceed.
    return
  }

  // 3. If they are not an admin, send them to the homepage.
  return navigateTo('/')
})