// store/folders.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Folder } from '~/types'

export const useFoldersStore = defineStore('folders', () => {
  
  // 1. STATE
  // two mock folders for testing
  const folders = ref<Folder[]>([
    {
      id: 'f1',
      name: 'Work Tasks'
    },
    {
      id: 'f2',
      name: 'Personal'
    }
  ])

  // 2. GETTERS
  const allFolders = computed(() => folders.value)

  // 3. ACTIONS
  function getFolderById(id: string) {
    return folders.value.find(folder => folder.id === id)
  }

  // 4. RETURN
  return {
    folders,
    allFolders,
    getFolderById
  }
})