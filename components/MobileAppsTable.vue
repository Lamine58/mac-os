<template>
  <div class="mobile-apps-container">
    <div v-if="filteredApps.length === 0 && props.searchQuery" class="no-results">
      <p class="no-results-text">Aucun résultat trouvé pour "{{ props.searchQuery }}"</p>
    </div>
    <div 
      v-for="app in filteredApps" 
      :key="app.nom"
      class="mobile-app-card"
    >
      <div class="app-icon">
        <i class="bi bi-phone" style="font-size: 48px; color: #66b2ff;"></i>
      </div>
      <div class="app-info">
        <h3 class="app-name">{{ app.nom }}</h3>
        <p class="app-description">{{ app.description }}</p>
        <div class="app-links">
          <a 
            v-if="app.play_store" 
            :href="app.play_store" 
            target="_blank"
            class="app-link play-store"
            title="Google Play Store"
          >
            <i class="bi bi-google-play"></i> Play Store
          </a>
          <a 
            v-if="app.app_store" 
            :href="app.app_store" 
            target="_blank"
            class="app-link app-store"
            title="App Store"
          >
            <i class="bi bi-apple"></i> App Store
          </a>
          <span v-if="!app.play_store && !app.app_store" class="app-link disabled">
            En développement
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  searchQuery?: string
}>()

type MobileApp = {
  nom: string
  description: string
  play_store: string | null
  app_store: string | null
}

const allMobileApps: MobileApp[] = [
  {
    nom: "MUSCOP-CI",
    description: "Application pour les membres du corps préfectoral (actualités, assurance maladie, projets).",
    play_store: "https://play.google.com/store/apps/details?id=com.icdigitaltrans.muscopci",
    app_store: "https://apps.apple.com/us/app/muscop-ci/id6451344800"
  },
  {
    nom: "SISRAH",
    description: "Collecte de données pour les agents de terrain du Ministère des Ressources Animales et Halieutiques.",
    play_store: "https://play.google.com/store/apps/details?id=com.sisrah.sisrah",
    app_store: null
  },
  {
    nom: "BABYLEARN",
    description: "Application éducative ludique pour apprendre à lire, écrire et compter.",
    play_store: "https://play.google.com/store/apps/details?id=com.cdw.babylearn",
    app_store: "https://apps.apple.com/us/app/babylearn-app/id6754986579"
  },
  {
    nom: "SANTE+",
    description: "Consultation des prix des médicaments, pharmacies de garde et médecins à proximité.",
    play_store: "https://play.google.com/store/apps/details?id=com.cdw.sante",
    app_store: "https://apps.apple.com/us/app/sant%C3%A9/id6743252600"
  },
  {
    nom: "BIOSAVE",
    description: "Tutoriels pour la création d'engrais et insecticides biologiques.",
    play_store: "https://play.google.com/store/apps/details?id=com.biosave.cdw",
    app_store: null
  },
  {
    nom: "TRUST WORLD",
    description: "Plateforme sécurisée de mise en relation entre acheteurs et vendeurs.",
    play_store: "https://play.google.com/store/apps/details?id=com.trustworld.cdw",
    app_store: null
  },
  {
    nom: "DIAG MEDICAL+",
    description: "Centralisation des données de santé et localisation de centres médicaux.",
    play_store: "https://play.google.com/store/apps/details?id=app.anepam.diagmedics",
    app_store: null
  },
  {
    nom: "APP ST RAPHAËL",
    description: "Suivi de l'actualité et répertoire des membres de la Mutuelle Saint Raphaël.",
    play_store: "https://play.google.com/store/apps/details?id=com.icdigitaltrans.st_raphael",
    app_store: null
  },
  {
    nom: "KARITÉ 2.0 STORE",
    description: "E-commerce de beurre de karité avec suivi de provenance via QR code.",
    play_store: "https://play.google.com/store/apps/details?id=com.icdigitaltrans.st_raphael",
    app_store: null
  },
  {
    nom: "LOGISTIQUE MEDICAL CI",
    description: "Gestion de factures pro forma et suivi de l'activité commerciale.",
    play_store: null,
    app_store: null
  }
]

const filteredApps = computed(() => {
  if (!props.searchQuery) return allMobileApps
  
  const query = props.searchQuery.toLowerCase()
  return allMobileApps.filter(app => 
    app.nom.toLowerCase().includes(query) ||
    app.description.toLowerCase().includes(query)
  )
})
</script>

<style scoped>
.mobile-apps-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.mobile-app-card {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: default;
}

.mobile-app-card:hover {
  background: var(--hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--text-color-secondary);
}

.app-icon {
  text-align: center;
  margin-bottom: 15px;
}

.app-info {
  flex: 1;
}

.app-name {
  color: var(--text-color);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  transition: color 0.3s ease;
}

.app-description {
  color: var(--text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 15px 0;
  transition: color 0.3s ease;
}

.app-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.app-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.app-link.play-store {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.app-link.play-store:hover {
  background: rgba(76, 175, 80, 0.3);
  transform: scale(1.05);
}

.app-link.app-store {
  background: rgba(0, 122, 255, 0.2);
  color: #007aff;
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.app-link.app-store:hover {
  background: rgba(0, 122, 255, 0.3);
  transform: scale(1.05);
}

.app-link.disabled {
  background: var(--hover-bg);
  color: var(--text-color-secondary);
  border: 1px solid var(--border-color);
  cursor: not-allowed;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
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

