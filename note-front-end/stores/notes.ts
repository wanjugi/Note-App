import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import type { Note } from '~/types'

// Define the store
export const useNotesStore = defineStore('notes', () => {

  // 1. STATE 
  const notes = ref<Note[]>([])
  const selectedNote = ref<Note | null>(null)

  // 2. GETTERS 
  const currentNotes = computed(() => notes.value)
  const currentSelectedNote = computed(() => selectedNote.value)

  // Helper to get auth token and API URL
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const getHeaders = () => {
    return { 'Authorization': `Bearer ${authStore.token}` }
  }
  const apiBaseUrl = config.public.apiBaseUrl

  // 3. ACTIONS

  async function fetchInboxNotes() {
    if (!authStore.token) return
    try {
      const response = await $fetch<Note[]>(`${apiBaseUrl}/notes`, {
        method: 'GET',
        headers: getHeaders()
      })
      notes.value = response
    } catch (error) {
      console.error('Failed to fetch inbox notes:', error)
      notes.value = []
    }
  }

  async function fetchNotesByFolder(folderId: string) {
    if (!authStore.token) return
    try {
      const response = await $fetch<Note[]>(`${apiBaseUrl}/notes/folder/${folderId}`, {
        method: 'GET',
        headers: getHeaders()
      })
      notes.value = response
    } catch (error) {
      console.error('Failed to fetch folder notes:', error)
      notes.value = []
    }
  }

  /**
   * Fetches all notes that have been ASSIGNED to the user.
   */
  async function fetchAssignedNotes() {
    if (!authStore.token) return
    try {
      // Calls our new "GET /api/notes/assigned" endpoint

      const response = await $fetch<Note[]>(`${apiBaseUrl}/notes/assigned`, {
        method: 'GET',
        headers: getHeaders()
      })
      // Save these notes to the same 'notes' ref
      notes.value = response
      console.log('Assigned notes fetched successfully!')
    } catch (error) {
      console.error('Failed to fetch assigned notes:', error)
      notes.value = []
    }
  }

  function clearNotes() {
    notes.value = []
  }

  // Creates a new note by calling the POST API.
  // Now accepts 'assigneeId'
  async function addNote(newNoteData: { title: string, content: string, folderId: string | null, assigneeId: string | null }) {
    if (!authStore.token) return
    try {
      const createdNote = await $fetch<Note>(`${apiBaseUrl}/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: newNoteData // The body now includes the assigneeId
      })
      // Add the new note to the *start* of the list
      notes.value.unshift(createdNote)
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }


  async function deleteNote(noteId: string) {
  
    if (!authStore.token) return
    try {
      await $fetch(`${apiBaseUrl}/notes/${noteId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      notes.value = notes.value.filter(note => note._id !== noteId)
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  // --- UPDATE THIS ACTION ---
  // Updates a note by calling the PUT API.
  async function updateNote(noteId: string, updates: { title: string, content: string, folderId: string | null, assigneeId: string | null }) {
    if (!authStore.token) return

    try {
      const updatedNote = await $fetch<Note>(`${apiBaseUrl}/notes/${noteId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: updates // The body now includes the assigneeId
      })

  
      const listIndex = notes.value.findIndex(note => note._id === noteId)
      if (listIndex !== -1) {
        notes.value[listIndex] = updatedNote
      }
      if (selectedNote.value && selectedNote.value._id === noteId) {
        selectedNote.value = updatedNote
      }
      return updatedNote
    } catch (error) {
      console.error('Failed to update note:', error)
      return undefined
    }
  }

  
  async function fetchNoteById(noteId: string) {
  
    if (!authStore.token) return
    try {
      const note = await $fetch<Note>(`${apiBaseUrl}/notes/${noteId}`, {
        headers: getHeaders()
      })
      selectedNote.value = note
    } catch (error) {
      console.error('Failed to fetch note:', error)
      selectedNote.value = null
    }
  }

  // 4. RETURN
  return {
    notes,
    currentNotes,
    fetchInboxNotes,
    fetchNotesByFolder,
    fetchAssignedNotes,
    clearNotes,
    addNote,
    deleteNote,
    updateNote,
    selectedNote,
    currentSelectedNote,
    fetchNoteById,
  }
})