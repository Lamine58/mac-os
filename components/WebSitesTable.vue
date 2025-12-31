<template>
  <div class="websites-container">
    <div v-if="filteredWebsites.length === 0 && props.searchQuery" class="no-results">
      <p class="no-results-text">Aucun résultat trouvé pour "{{ props.searchQuery }}"</p>
    </div>
    <div 
      v-for="site in filteredWebsites" 
      :key="site.name"
      class="website-card"
    >
      <div class="website-icon">
        <i class="bi bi-globe" style="font-size: 48px; color: #3498db;"></i>
      </div>
      <div class="website-info">
        <h3 class="website-name">{{ site.name }}</h3>
        <p class="website-url">{{ site.url }}</p>
        <a 
          :href="site.url" 
          target="_blank"
          class="website-link"
          title="Visiter le site"
        >
          <i class="bi bi-box-arrow-up-right"></i> Visiter le site
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  searchQuery?: string
}>()

type Website = {
  name: string
  url: string
}

const allWebsites: Website[] = [
  { name: "RSM-CI", url: "https://rsm-ci.net" },
  { name: "MySoft-C", url: "https://mysoft-c.com" },
  { name: "CCIAMA Tchad", url: "https://cciama-td.com" },
  { name: "Je Donne.ci", url: "https://jedonne.ci" },
  { name: "Liste de Mariage", url: "https://listedemariage.ci" },
  { name: "TikaHarvest", url: "https://tikaharvest.com" },
  { name: "GPE Abidjan", url: "https://gpe-abidjan.net" },
  { name: "Coriginal", url: "https://coriginal.ci" },
  { name: "SETBC", url: "https://setbc.ci" },
  { name: "Lumière du Monde", url: "https://lumieredumonde.tv" },
  { name: "Paiement PRO", url: "https://paiementpro.net" },
  { name: "Lasers Medical", url: "http://lasersmedical.fr" },
  { name: "ARSTM-FOAD", url: "https://arstm-foad.org" }
]

const filteredWebsites = computed(() => {
  if (!props.searchQuery) return allWebsites
  
  const query = props.searchQuery.toLowerCase()
  return allWebsites.filter(site => 
    site.name.toLowerCase().includes(query) ||
    site.url.toLowerCase().includes(query)
  )
})
</script>

<style scoped>
  
.websites-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.website-card {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: default;
}

.website-card:hover {
  background: var(--hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--text-color-secondary);
}

.website-icon {
  text-align: center;
  margin-bottom: 15px;
}

.website-info {
  flex: 1;
}

.website-name {
  color: var(--text-color);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.website-url {
  color: var(--text-color-secondary);
  font-size: 12px;
  margin: 0 0 15px 0;
  word-break: break-all;
  transition: color 0.3s ease;
}

.website-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
  transition: all 0.2s ease;
}

.website-link:hover {
  background: rgba(52, 152, 219, 0.3);
  transform: scale(1.05);
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
  font-size: 14px;
  transition: color 0.3s ease;
}
</style>

