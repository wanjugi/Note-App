import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import type { Folder } from '~/types'

export const useFoldersStore = defineStore('folders', () => {

  // STATE: Start with an empty array
  const folders = ref<Folder[]>([])

  // GETTERS
  const allFolders = computed(() => folders.value)

  // --- HELPER FUNCTIONS ---
  // We add these helpers just like in your notesStore
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const getHeaders = () => {
    return { 'Authorization': `Bearer ${authStore.token}` }
  }
  const apiBaseUrl = config.public.apiBaseUrl

  // ACTIONS
  function getFolderById(id: string) {
    // We now find by '_id'
    return folders.value.find(folder => folder._id === id)
  }

  // Fetches folders from our API
  async function fetchFolders() {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    if (!authStore.token) {
      console.log('Not authenticated, skipping folder fetch.')
      return
    }

    try {
      const response = await $fetch<Folder[]>(
        `${config.public.apiBaseUrl}/folders`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        }
      )

      folders.value = response
      console.log('Folders fetched successfully!')

    } catch (error) {
      console.error('Failed to fetch folders:', error)
      folders.value = []
    }
  }

  async function addFolder(newFolderData: { name: string }) {
    if (!authStore.token) return
    try {
      // 1. Call the API to create the folder
      const createdFolder = await $fetch<Folder>(
        `${apiBaseUrl}/folders`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: newFolderData
        }
      )

      //  Add the new folder to the BOTTOM of the list
      folders.value.push(createdFolder)

    } catch (error) {
      console.error('Failed to add folder:', error)
    }
  }

  async function deleteFolder(folderId: string) {
    if (!authStore.token) return
    try {
      // Call the DELETE API endpoint
      await $fetch(`${apiBaseUrl}/folders/${folderId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      // On success, remove the folder from the local list
      folders.value = folders.value.filter(folder => folder._id !== folderId)
    } catch (error) {
      console.error('Failed to delete folder:', error)
      // We could add a toast here later
    }
  }

  // Clears folders when a user logs out
  function clearFolders() {
    folders.value = []
  }

  // RETURN
  return {
    folders,
    allFolders,
    getFolderById,
    fetchFolders,
    clearFolders,
    addFolder,
    deleteFolder
  }
})