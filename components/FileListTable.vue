<template>
  <table class="file-list-table">
    <thead>
      <tr>
        <th style="width: 40%;">Nom</th>
        <th style="width: 20%;">Date</th>
        <th style="width: 15%;">Taille</th>
        <th style="width: 25%;">Type</th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="item in folderContents" 
        :key="item.name"
        :class="{ 'clickable-file': item.file && (item.type === 'PDF Document' || item.type === 'Document Texte' || item.type === 'Markdown File') }"
        @click="item.file && (item.type === 'PDF Document' ? openPDF(item.file, item.name) : (item.type === 'Document Texte' || item.type === 'Markdown File') ? openTextFile(item.file, item.name) : null)"
      >
        <td class="col-icon-name">
          <i :class="['bi', item.icon]" :style="{ color: item.color }"></i>
          {{ item.name }}
        </td>
        <td>{{ item.date }}</td>
        <td>{{ item.size }}</td>
        <td>{{ item.type }}</td>
      </tr>
      <tr v-if="folderContents.length === 0 && props.searchQuery">
        <td colspan="4" class="no-results-cell">
          Aucun résultat trouvé pour "{{ props.searchQuery }}"
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
type FileItem = {
  icon: string
  name: string
  color: string
  date: string
  size: string
  type: string
  file?: string
}

const props = defineProps<{
  folder: string
  searchQuery?: string
}>()

const { getAssetPath } = useAssetPath()

const folderContentsData: Record<string, FileItem[]> = {
  "Parcours": [
    { icon: "bi-file-earmark-person-fill", name: "CV - Ishola Hasrafidine Abdel-Lamine.pdf", color: "#e74c3c", date: "10 oct. 2025", size: "450 Ko", type: "PDF Document", file: getAssetPath("files/CV - Ishola Hasrafidine Abdel-Lamine.pdf") },
    { icon: "bi-file-earmark-pdf-fill", name: "Mon Portfolio App Mobile - Ishola Hasrafidine.pdf", color: "#e74c3c", date: "15 oct. 2025", size: "2,5 Mo", type: "PDF Document", file: getAssetPath("files/Mon Portfolio App Mobile - Ishola Hasrafidine.pdf") },
    { icon: "bi-file-text-fill", name: "Lettre de motivation.txt", color: "#3498db", date: "28 déc. 2024", size: "3 Ko", type: "Document Texte", file: getAssetPath("files/Lettre de motivation.txt") },
    { icon: "bi-journal-code", name: "Compétences clés.md", color: "#f1c40f", date: "28 déc. 2024", size: "8 Ko", type: "Markdown File", file: getAssetPath("files/Compétences clés.md") },
  ],
}

const folderContents = computed<FileItem[]>(() => {
  const contents = folderContentsData[props.folder] || []
  if (!props.searchQuery) return contents
  
  const query = props.searchQuery.toLowerCase()
  return contents.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query)
  )
})

const emit = defineEmits<{
  'open-pdf': [file: string, name: string]
  'open-text': [file: string, name: string]
}>()

const openPDF = (file: string, name: string) => {
  emit('open-pdf', file, name)
}

const openTextFile = (file: string, name: string) => {
  emit('open-text', file, name)
}
</script>

<style scoped>
.clickable-file {
  cursor: pointer;
}

.clickable-file:hover {
  background-color: var(--hover-bg);
  transition: background-color 0.3s ease;
}

.no-results-cell {
  text-align: center;
  padding: 40px !important;
  color: var(--text-color-secondary) !important;
  transition: color 0.3s ease;
  font-size: 14px;
}

.theme-light .no-results-cell {
  color: rgba(0, 0, 0, 0.7) !important;
}

.theme-dark .no-results-cell {
  color: rgba(255, 255, 255, 0.8) !important;
}
</style>

