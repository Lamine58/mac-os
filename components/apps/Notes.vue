<template>
  <AppWindow 
    :title="'Notes'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    @close="$emit('close')"
  >
    <div class="notes-content">
      <div class="notes-sidebar">
        <div class="visitor-info-banner">
          <i class="bi bi-info-circle"></i>
          <span>Laissez-moi un message ! Vos notes sont sauvegardées en ligne.</span>
        </div>
        <button class="new-note-btn" @click="createNote">
          <i class="bi bi-plus-circle"></i> Nouvelle note
        </button>
        <div class="notes-list">
          <div 
            v-for="note in notes" 
            :key="note.id"
            class="note-item"
            :class="{ active: selectedNote === note.id }"
            @click="selectNote(note.id)"
          >
            <div class="note-content-wrapper">
              <div class="note-title">{{ note.title }}</div>
              <div class="note-preview">{{ note.preview }}</div>
              <div class="note-meta">
                <span class="note-author" v-if="note.author">{{ note.author }}</span>
                <span class="note-date">{{ note.date }}</span>
              </div>
            </div>
            <button 
              @click.stop="deleteNote(note.id)" 
              class="delete-note-btn"
              title="Supprimer"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="notes-editor">
        <div v-if="selectedNote" class="editor-content">
          <div class="editor-header">
            <input 
              type="text" 
              :value="currentNoteAuthor"
              @input="updateNoteAuthor"
              class="note-author-input"
              placeholder="Votre nom (optionnel)"
            >
            <div class="header-actions">
              <div class="save-status" v-if="saving">
                <i class="bi bi-arrow-repeat"></i> Sauvegarde...
              </div>
              <div class="save-status saved" v-else-if="lastSaved">
                <i class="bi bi-check-circle"></i> Sauvegardé
              </div>
              <button 
                @click="deleteNote(selectedNote)" 
                class="delete-note-header-btn"
                title="Supprimer cette note"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <input 
            type="text" 
            :value="currentNoteTitle"
            @input="updateNoteTitle"
            class="note-title-input"
            placeholder="Titre de la note"
          >
          <textarea 
            :value="currentNoteContent"
            @input="updateNoteContent"
            class="note-content-input"
            placeholder="Commencez à écrire votre message..."
          ></textarea>
        </div>
        <div v-else class="no-note">
          <i class="bi bi-sticky" style="font-size: 64px; color: var(--text-color-secondary); opacity: 0.3;"></i>
          <p>Sélectionnez une note ou créez-en une nouvelle</p>
          <p class="info-text">Vos messages sont sauvegardés en ligne et visibles par tous les visiteurs</p>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import type { Note } from '~/composables/useNotesStorage'

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { loadNotes, saveNotes, formatDate } = useNotesStorage()

const selectedNote = ref<string | null>(null)
const notes = ref<Note[]>([])
const saving = ref(false)
const lastSaved = ref(false)
let saveTimeout: NodeJS.Timeout | null = null

// Charger les notes au montage
onMounted(async () => {
  await loadNotesFromStorage()
})

// Charger les notes depuis le stockage
const loadNotesFromStorage = async () => {
  const loadedNotes = await loadNotes()
  notes.value = loadedNotes.sort((a, b) => b.timestamp - a.timestamp)
}

// Créer une nouvelle note
const createNote = () => {
  const newNote: Note = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: "Nouvelle note",
    preview: "",
    content: "",
    date: "Aujourd'hui",
    author: "",
    timestamp: Date.now()
  }
  notes.value.unshift(newNote)
  selectedNote.value = newNote.id
  debouncedSave()
}

// Sélectionner une note
const selectNote = (id: string) => {
  selectedNote.value = id
}

// Obtenir la note actuelle
const getCurrentNote = (): Note | undefined => {
  return notes.value.find(n => n.id === selectedNote.value)
}

// Sauvegarder avec debounce
const debouncedSave = () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = setTimeout(async () => {
    await saveNotesToStorage()
  }, 1000) // Sauvegarder 1 seconde après la dernière modification
}

// Sauvegarder les notes
const saveNotesToStorage = async () => {
  saving.value = true
  const success = await saveNotes(notes.value)
  saving.value = false
  if (success) {
    lastSaved.value = true
    setTimeout(() => {
      lastSaved.value = false
    }, 2000)
  }
}

// Computed pour le titre
const currentNoteTitle = computed({
  get: () => {
    const note = getCurrentNote()
    return note?.title || ''
  },
  set: (value: string) => {
    const note = getCurrentNote()
    if (note) {
      note.title = value
      debouncedSave()
    }
  }
})

// Computed pour le contenu
const currentNoteContent = computed({
  get: () => {
    const note = getCurrentNote()
    return note?.content || ''
  },
  set: (value: string) => {
    const note = getCurrentNote()
    if (note) {
      note.content = value
      note.preview = value.substring(0, 50) + (value.length > 50 ? '...' : '')
      note.date = formatDate(note.timestamp)
      debouncedSave()
    }
  }
})

// Computed pour l'auteur
const currentNoteAuthor = computed({
  get: () => {
    const note = getCurrentNote()
    return note?.author || ''
  },
  set: (value: string) => {
    const note = getCurrentNote()
    if (note) {
      note.author = value
      debouncedSave()
    }
  }
})

// Handlers
const updateNoteTitle = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentNoteTitle.value = target.value
}

const updateNoteContent = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  currentNoteContent.value = target.value
}

const updateNoteAuthor = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentNoteAuthor.value = target.value
}

// Supprimer une note
const deleteNote = async (noteId: string) => {
  const index = notes.value.findIndex(n => n.id === noteId)
  if (index !== -1) {
    notes.value.splice(index, 1)
    
    // Si la note supprimée était sélectionnée, désélectionner
    if (selectedNote.value === noteId) {
      selectedNote.value = null
    }
    
    // Sauvegarder après suppression
    await saveNotesToStorage()
  }
}

// Recharger les notes quand la fenêtre s'ouvre
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await loadNotesFromStorage()
  }
})
</script>

<style scoped>
.notes-content {
  display: flex;
  height: 100%;
}

.notes-sidebar {
  width: 250px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.visitor-info-banner {
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  color: #ffffff;
  padding: 12px 15px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.visitor-info-banner i {
  font-size: 16px;
  flex-shrink: 0;
}

.new-note-btn {
  margin: 15px;
  padding: 10px;
  background: #007aff;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 200;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.new-note-btn:hover {
  background: #0051d5;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
}

.note-item {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  position: relative;
}

.note-item:hover {
  background: var(--hover-bg);
}

.note-item.active {
  background: rgba(0, 122, 255, 0.1);
}

.note-content-wrapper {
  flex: 1;
  min-width: 0;
}

.note-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 5px;
}

.note-preview {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.note-author {
  color: rgba(0, 122, 255, 0.8);
  font-weight: 500;
}

.note-date {
  color: var(--text-color-secondary);
}

.notes-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-window-content);
}

.editor-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: var(--bg-window-toolbar);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.note-author-input {
  flex: 1;
  padding: 8px 12px;
  background: var(--bg-window-content);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 12px;
  outline: none;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.note-author-input:focus {
  border-color: var(--accent-color);
  background: var(--bg-window-content);
}

.note-author-input::placeholder {
  color: var(--text-color-secondary);
  opacity: 0.7;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.save-status {
  font-size: 11px;
  color: var(--text-color-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
}

.save-status i {
  font-size: 12px;
  animation: spin 1s linear infinite;
}

.save-status.saved {
  color: #27c93f;
}

.save-status.saved i {
  animation: none;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.note-title-input {
  padding: 15px 20px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 20px;
  font-weight: 500;
  outline: none;
}

.note-content-input {
  flex: 1;
  padding: 20px;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 14px;
  font-family: inherit;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.no-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color-secondary);
  text-align: center;
  padding: 40px;
}

.info-text {
  margin-top: 20px;
  font-size: 13px;
  color: rgba(0, 122, 255, 0.8);
  max-width: 300px;
}

.delete-note-btn {
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 6px 8px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s, border-color 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.note-item:hover .delete-note-btn {
  opacity: 1;
}

.delete-note-btn:hover {
  background: var(--hover-bg);
  border-color: var(--accent-color);
  color: var(--text-color);
}

.delete-note-header-btn {
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-note-header-btn:hover {
  background: var(--hover-bg);
  border-color: var(--accent-color);
  color: var(--text-color);
}
</style>

