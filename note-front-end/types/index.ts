// This interface defines the shape of a Folder (This is correct)
export interface Folder {
  _id: string
  name: string
  user: string
  createdAt: string
  updatedAt: string
}

// This interface defines the shape of a User FROM OUR API
export interface User {
  _id: string       
  username: string
  role: 'user' | 'moderator' | 'admin' 
}

// --- UPDATE THIS INTERFACE ---
// This interface defines the shape of a Note FROM OUR API
export interface Note {
  _id: string       
  title: string
  content: string
  author: string | User   
  folder: string | null 
  assignee: string | User | null
  createdAt: string
  updatedAt: string
}