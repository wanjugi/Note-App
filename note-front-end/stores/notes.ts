import { defineStore } from 'pinia'
import { ref, computed } from 'vue' 
import type { Note } from '~/types' 

// Define the store
export const useNotesStore = defineStore('notes', () => {
  
  // 1. STATE
  const notes = ref<Note[]>([
    {
      id: '1',
      title: 'Welcome to your notes!',
      content: 'This is a sample note. You can edit it or delete it.',
      createdAt: new Date().toISOString(),
      folderId: null
    },
    {
      id: '2',
      title: 'Meeting Agenda',
      content: '1. Project update. 2. Budget review.',
      createdAt: new Date().toISOString(),
      folderId: null
    }
  ])

  // 2. GETTERS
  const allNotes = computed(() => notes.value)

  const getNoteById = (id: string) => {
    return notes.value.find(note => note.id === id)
  }

  // 3. ACTIONS
  function addNote(newNote: Omit<Note, 'id' | 'createdAt'>) {
    const note: Note = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      ...newNote
    }
    // We use .value to access the ref's content
    notes.value.unshift(note) 
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter(note => note.id !== id)
  }

  function updateNote(id: string, updates: { title: string, content: string }) {
    const note = getNoteById(id)
    if (note) {
      note.title = updates.title
      note.content = updates.content
      // you'd also update a 'modifiedAt' timestamp
    }
  }

  // 4. RETURN
  return {
    notes,
    allNotes,
    getNoteById,
    addNote,
    deleteNote,
    updateNote
  }
})