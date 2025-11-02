// This interface defines the shape of a Note
export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  folderId: string | null // null means it's in "Inbox"
}
// This interface defines the shape of a Folder
export interface Folder {
  id: string
  name: string
}