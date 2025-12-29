<template>
  <AppWindow 
    :title="'Notes'"
    :is-open="isOpen"
    @close="$emit('close')"
  >
    <div class="notes-content">
      <div class="notes-sidebar">
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
            <div class="note-title">{{ note.title }}</div>
            <div class="note-preview">{{ note.preview }}</div>
            <div class="note-date">{{ note.date }}</div>
          </div>
        </div>
      </div>
      <div class="notes-editor">
        <div v-if="selectedNote" class="editor-content">
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
            placeholder="Commencez à écrire..."
          ></textarea>
        </div>
        <div v-else class="no-note">
          <i class="bi bi-sticky" style="font-size: 64px; color: rgba(255, 255, 255, 0.3);"></i>
          <p>Sélectionnez une note ou créez-en une nouvelle</p>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const selectedNote = ref<number | null>(null)
let noteIdCounter = 1

const notes = ref([
  { 
    id: 1, 
    title: "Idées de projets", 
    preview: "Quelques idées pour de nouveaux projets...",
    content: "Quelques idées pour de nouveaux projets:\n\n- Application de gestion de tâches\n- Plateforme e-learning\n- Système de réservation en ligne",
    date: "Aujourd'hui"
  },
  { 
    id: 2, 
    title: "Notes de réunion", 
    preview: "Points discutés lors de la réunion...",
    content: "Points discutés:\n\n1. Nouveau design\n2. Optimisation des performances\n3. Tests utilisateurs",
    date: "Hier"
  }
])

const createNote = () => {
  const newNote = {
    id: noteIdCounter++,
    title: "Nouvelle note",
    preview: "",
    content: "",
    date: "Aujourd'hui"
  }
  notes.value.unshift(newNote)
  selectedNote.value = newNote.id
}

const selectNote = (id: number) => {
  selectedNote.value = id
}

const getCurrentNote = () => {
  return notes.value.find(n => n.id === selectedNote.value)
}

const currentNoteTitle = computed({
  get: () => {
    const note = getCurrentNote()
    return note?.title || ''
  },
  set: (value: string) => {
    const note = getCurrentNote()
    if (note) {
      note.title = value
    }
  }
})

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
    }
  }
})

const updateNoteTitle = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentNoteTitle.value = target.value
}

const updateNoteContent = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  currentNoteContent.value = target.value
}
</script>

<style scoped>
.notes-content {
  display: flex;
  height: 100%;
}

.notes-sidebar {
  width: 250px;
  background: #252525;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.new-note-btn {
  margin: 15px;
  padding: 10px;
  background: #007aff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
}

.note-item {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.note-item.active {
  background: rgba(0, 122, 255, 0.1);
}

.note-title {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 5px;
}

.note-preview {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.notes-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.editor-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.note-title-input {
  padding: 15px 20px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #333;
  color: white;
  font-size: 20px;
  font-weight: 500;
  outline: none;
}

.note-content-input {
  flex: 1;
  padding: 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
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
  color: rgba(255, 255, 255, 0.5);
}
</style>

