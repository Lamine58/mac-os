<template>
  <AppWindow 
    :title="'Musique'"
    :is-open="isOpen"
    :force-focus="forceFocus"
    :initial-width="937"
    :initial-height="713"
    @close="$emit('close')"
  >
    <div class="music-content">
      <!-- Sidebar -->
      <div class="music-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-item active">
            <i class="bi bi-music-note-beamed"></i>
            <span>Bibliothèque</span>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-item">
            <i class="bi bi-compass"></i>
            <span>Parcourir</span>
          </div>
          <div class="sidebar-item">
            <i class="bi bi-radio"></i>
            <span>Radio</span>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-label">Bibliothèque</div>
          <div class="sidebar-item">
            <i class="bi bi-music-note-list"></i>
            <span>Chansons</span>
          </div>
          <div class="sidebar-item">
            <i class="bi bi-collection"></i>
            <span>Albums</span>
          </div>
          <div class="sidebar-item">
            <i class="bi bi-person"></i>
            <span>Artistes</span>
          </div>
        </div>
      </div>

      <!-- Zone principale -->
      <div class="music-main">
        <div class="music-header">
          <h1>Chansons</h1>
          <div class="header-actions">
            <button class="action-btn">
              <i class="bi bi-search"></i>
            </button>
            <button class="action-btn">
              <i class="bi bi-three-dots"></i>
            </button>
          </div>
        </div>
        
        <div class="songs-table">
          <div class="table-header">
            <div class="col-number">#</div>
            <div class="col-title">Titre</div>
            <div class="col-artist">Artiste</div>
            <div class="col-duration">
              <i class="bi bi-clock"></i>
            </div>
          </div>
          <div class="table-body">
            <div 
              v-for="(song, index) in songs" 
              :key="song.id"
              class="table-row"
              :class="{ active: currentSong?.id === song.id, playing: currentSong?.id === song.id && isPlaying }"
              @dblclick="playSong(song)"
              @click="selectSong(song)"
            >
              <div class="col-number">
                <span v-if="currentSong?.id !== song.id || !isPlaying">{{ index + 1 }}</span>
                <i v-else class="bi bi-pause-fill playing-icon"></i>
              </div>
              <div class="col-title">
                <div class="title-content">
                  <img :src="getAssetPath(`files/${song.image}`)" :alt="song.title" class="song-thumb">
                  <span>{{ song.title }}</span>
                </div>
              </div>
              <div class="col-artist">{{ song.artist }}</div>
              <div class="col-duration">{{ formatDuration(song.duration) }}</div>
            </div>
          </div>
        </div>

        <!-- Banner de la chanson en cours ou logo Apple Music -->
        <div class="banner-container">
          <img 
            v-if="currentSong" 
            class="banner" 
            :src="getAssetPath(`files/${currentSong.image}`)" 
            :alt="currentSong.title"
          >
          <div v-else class="banner-placeholder">
            <img 
              class="music-logo" 
              :src="getAssetPath('files/music-2021-05-25.webp')" 
              alt="Apple Music"
            >
            <p class="banner-message">Cliquez sur une chanson pour  <br> commencer la lecture</p>
          </div>
        </div>
      </div>

      <!-- Lecteur audio -->
      <div class="music-player">
        <div class="player-left">
          <img v-if="currentSong" :src="getAssetPath(`files/${currentSong.image}`)" :alt="currentSong.title" class="player-cover">
          <div v-else class="player-cover empty-cover">
            <i class="bi bi-music-note-beamed"></i>
          </div>
          <div class="player-info">
            <div class="player-title">{{ currentSong?.title || 'Aucune chanson sélectionnée' }}</div>
            <div class="player-artist">{{ currentSong?.artist || '' }}</div>
          </div>
        </div>
        <div class="player-center">
          <div class="player-controls-main">
            <button class="player-btn" @click="previousSong" title="Précédent" :disabled="!currentSong">
              <i class="bi bi-skip-backward-fill"></i>
            </button>
            <button class="player-btn play-btn" @click="togglePlay" title="Lecture/Pause" :disabled="!currentSong">
              <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
            </button>
            <button class="player-btn" @click="nextSong" title="Suivant" :disabled="!currentSong">
              <i class="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          <div class="player-progress">
            <span class="time-current">{{ formatTime(currentTime) }}</span>
            <div class="progress-track" @click="seekToPosition">
              <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="time-total">{{ formatTime(currentSong?.duration || 0) }}</span>
          </div>
        </div>
        <div class="player-right">
          <button class="player-btn-small" @click="toggleMute" :title="isMuted ? 'Activer le son' : 'Couper le son'">
            <i :class="isMuted ? 'bi bi-volume-mute' : 'bi bi-volume-up'"></i>
          </button>
        </div>
        <audio 
          ref="audioPlayer"
          preload="auto"
          @timeupdate="updateProgress"
          @ended="nextSong"
          @loadedmetadata="onLoadedMetadata"
          @error="onAudioError"
          @loadstart="onLoadStart"
          @canplay="onCanPlay"
          @playing="onPlaying"
          @pause="onPause"
        ></audio>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface Song {
  id: string
  title: string
  artist: string
  image: string
  audio: string
  duration: number
}

const props = defineProps<{
  forceFocus?: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { getAssetPath } = useAssetPath()

const songs = ref<Song[]>([
  {
    id: '1',
    title: 'HIMRA x PHILIPAYNE - FREESTYLE DRILL IVOIRE',
    artist: 'HIMRA x PHILIPAYNE',
    image: '0x1900-000000-80-0-0.jpg',
    audio: 'himra-1.webm',
    duration: 0
  },
  {
    id: '2',
    title: 'SINDIKA x DIDI B - RODELA',
    artist: 'SINDIKA x DIDI B',
    image: '1200x630bb.jpg',
    audio: 'sindika-1.mp4',
    duration: 0
  }
])

const currentSong = ref<Song | null>(null)
const isPlaying = ref(false)
const progress = ref(0)
const currentTime = ref(0)
const audioPlayer = ref<HTMLAudioElement | null>(null)
const isMuted = ref(false)
const savedVolume = ref(1)

const playSong = async (song: Song) => {
  if (currentSong.value?.id === song.id) {
    togglePlay()
    return
  }
  
  currentSong.value = song
  isPlaying.value = false
  
  if (!audioPlayer.value) {
    console.error('Audio player element not found')
    return
  }
  
  // Réinitialiser l'audio
  audioPlayer.value.pause()
  audioPlayer.value.currentTime = 0
  
  const audioPath = getAssetPath(`files/${song.audio}`)
  console.log('Loading audio:', audioPath)
  console.log('Audio element:', audioPlayer.value)
  
  // Vérifier que le chemin est valide
  if (!audioPath || audioPath === '') {
    console.error('Invalid audio path')
    alert('Chemin audio invalide')
    return
  }
  
  // Charger l'audio
  audioPlayer.value.src = audioPath
  audioPlayer.value.load()
  
  // Fonction pour forcer la lecture
  const forcePlay = async () => {
    if (!audioPlayer.value) return
    
    console.log('Attempting to play, readyState:', audioPlayer.value.readyState)
    console.log('Audio src:', audioPlayer.value.src)
    
    try {
      await audioPlayer.value.play()
      console.log('✅ Audio playing successfully!')
      isPlaying.value = true
    } catch (err: any) {
      console.error('❌ Play error:', err)
      console.error('Error name:', err.name)
      console.error('Error message:', err.message)
      
      // Si c'est une erreur de politique autoplay, essayer après interaction utilisateur
      if (err.name === 'NotAllowedError' || err.name === 'NotSupportedError') {
        alert('Le navigateur bloque la lecture automatique. Cliquez sur le bouton play pour démarrer.')
      } else {
        alert(`Erreur de lecture: ${err.message}`)
      }
      isPlaying.value = false
    }
  }
  
  // Essayer immédiatement
  if (audioPlayer.value.readyState >= 2) {
    console.log('Audio ready, playing immediately')
    await forcePlay()
  } else {
    console.log('Waiting for audio to load...')
    // Attendre que l'audio soit chargé
    const tryPlay = () => {
      console.log('Audio ready, attempting play')
      forcePlay()
    }
    
    // Essayer plusieurs fois avec différents événements
    audioPlayer.value.addEventListener('canplay', tryPlay, { once: true })
    audioPlayer.value.addEventListener('canplaythrough', tryPlay, { once: true })
    audioPlayer.value.addEventListener('loadeddata', tryPlay, { once: true })
    
    // Timeout de sécurité
    setTimeout(() => {
      if (!isPlaying.value && audioPlayer.value && audioPlayer.value.readyState >= 2) {
        console.log('Timeout: forcing play')
        forcePlay()
      }
    }, 2000)
  }
}

const selectSong = (song: Song) => {
  // Si on clique sur une autre chanson que celle en cours, la jouer
  if (currentSong.value?.id !== song.id) {
    playSong(song)
  } else {
    // Si c'est la même chanson, juste mettre à jour la sélection
    currentSong.value = song
  }
}

const togglePlay = async () => {
  if (!audioPlayer.value || !currentSong.value) {
    console.log('Cannot play: no audio player or no song selected')
    return
  }
  
  if (isPlaying.value) {
    console.log('Pausing audio')
    audioPlayer.value.pause()
    isPlaying.value = false
  } else {
    console.log('Attempting to play audio')
    console.log('Audio src:', audioPlayer.value.src)
    console.log('Ready state:', audioPlayer.value.readyState)
    
    // Si l'audio n'a pas de src, le charger
    if (!audioPlayer.value.src || audioPlayer.value.src === '') {
      console.log('No audio src, loading...')
      const audioPath = getAssetPath(`files/${currentSong.value.audio}`)
      audioPlayer.value.src = audioPath
      audioPlayer.value.load()
      
      // Attendre un peu puis jouer
      setTimeout(async () => {
        try {
          await audioPlayer.value?.play()
          console.log('✅ Audio playing after load')
          isPlaying.value = true
        } catch (err: any) {
          console.error('❌ Error playing after load:', err)
        }
      }, 500)
      return
    }
    
    // Essayer de jouer
    try {
      await audioPlayer.value.play()
      console.log('✅ Audio playing successfully')
      isPlaying.value = true
    } catch (err: any) {
      console.error('❌ Error playing:', err)
      console.error('Error name:', err.name)
      console.error('Error message:', err.message)
      
      // Recharger et réessayer
      const audioPath = getAssetPath(`files/${currentSong.value.audio}`)
      console.log('Reloading audio:', audioPath)
      audioPlayer.value.src = audioPath
      audioPlayer.value.load()
      
      setTimeout(async () => {
        try {
          await audioPlayer.value?.play()
          console.log('✅ Audio playing after reload')
          isPlaying.value = true
        } catch (e: any) {
          console.error('❌ Error after reload:', e)
          alert(`Impossible de lire l'audio: ${e.message || 'Erreur inconnue'}`)
        }
      }, 1000)
    }
  }
}

const nextSong = () => {
  if (currentSong.value) {
    const currentIndex = songs.value.findIndex(s => s.id === currentSong.value!.id)
    const nextIndex = (currentIndex + 1) % songs.value.length
    playSong(songs.value[nextIndex])
  }
}

const previousSong = () => {
  if (currentSong.value) {
    const currentIndex = songs.value.findIndex(s => s.id === currentSong.value!.id)
    const prevIndex = currentIndex === 0 ? songs.value.length - 1 : currentIndex - 1
    playSong(songs.value[prevIndex])
  }
}

const updateProgress = () => {
  if (audioPlayer.value) {
    const current = audioPlayer.value.currentTime
    const duration = audioPlayer.value.duration || 0
    currentTime.value = current
    if (duration > 0) {
      progress.value = (current / duration) * 100
    }
  }
}

const seekToPosition = (event: MouseEvent) => {
  if (audioPlayer.value && event.target) {
    const track = event.currentTarget as HTMLElement
    const rect = track.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    if (audioPlayer.value.duration) {
      audioPlayer.value.currentTime = percent * audioPlayer.value.duration
      progress.value = percent * 100
    }
  }
}

const onLoadedMetadata = () => {
  if (audioPlayer.value && currentSong.value) {
    currentSong.value.duration = audioPlayer.value.duration
    console.log('Audio metadata loaded, duration:', audioPlayer.value.duration)
  }
}

const onLoadStart = () => {
  console.log('Audio load started')
}

const onCanPlay = () => {
  console.log('Audio can play event fired')
  console.log('Current song:', currentSong.value)
  console.log('Is playing:', isPlaying.value)
  if (audioPlayer.value && currentSong.value && !isPlaying.value) {
    // Si une chanson est sélectionnée mais pas en cours de lecture, la jouer
    audioPlayer.value.play()
      .then(() => {
        console.log('✅ Audio started playing after canplay event')
        isPlaying.value = true
      })
      .catch(err => {
        console.error('❌ Error playing after canplay:', err)
        console.error('Error details:', err.name, err.message)
      })
  }
}

const onPlaying = () => {
  console.log('Audio is now playing')
  isPlaying.value = true
}

const onPause = () => {
  console.log('Audio paused')
  isPlaying.value = false
}

const onAudioError = (event: Event) => {
  console.error('Audio error:', event)
  const audio = event.target as HTMLAudioElement
  if (audio.error) {
    const errorMessages: { [key: number]: string } = {
      1: 'MEDIA_ERR_ABORTED - Le chargement a été interrompu',
      2: 'MEDIA_ERR_NETWORK - Erreur réseau',
      3: 'MEDIA_ERR_DECODE - Erreur de décodage',
      4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Format non supporté'
    }
    const errorMsg = errorMessages[audio.error.code] || `Erreur ${audio.error.code}`
    console.error('Audio error code:', audio.error.code, 'Message:', errorMsg)
    alert(`Erreur audio: ${errorMsg}\nFichier: ${audio.src}`)
    isPlaying.value = false
  }
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDuration = (seconds: number): string => {
  return formatTime(seconds)
}

const toggleMute = () => {
  if (!audioPlayer.value) return
  
  if (isMuted.value) {
    // Réactiver le son
    audioPlayer.value.volume = savedVolume.value
    isMuted.value = false
  } else {
    // Couper le son
    savedVolume.value = audioPlayer.value.volume
    audioPlayer.value.volume = 0
    isMuted.value = true
  }
}

// Pause quand la fenêtre se ferme
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen && audioPlayer.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  }
})

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
  }
})
</script>

<style scoped>
.music-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-window-content);
  transition: background-color 0.3s ease;
}

/* Sidebar */
.music-sidebar {
  width: 220px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  padding: 20px 0;
  overflow-y: auto;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.sidebar-section {
  margin-bottom: 20px;
  padding: 0 10px;
}

.sidebar-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text-color-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, color 0.3s ease;
}

.sidebar-item:hover {
  background: var(--hover-bg);
}

.sidebar-item.active {
  background: rgba(0, 122, 255, 0.2);
  color: #007AFF;
}

.sidebar-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Zone principale */
.music-main {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-window-content);
  transition: background-color 0.3s ease;
}

.music-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.music-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  transition: color 0.3s ease;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: var(--text-color-secondary);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s, color 0.3s ease;
}

.action-btn:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

/* Table des chansons */
.songs-table {
  padding: 0 30px 20px;
}

.table-header {
  display: grid;
  grid-template-columns: 40px 1fr 200px 80px;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: border-color 0.3s ease, color 0.3s ease;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 40px 1fr 200px 80px;
  gap: 16px;
  padding: 8px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  align-items: center;
  padding-right: 10px;
}

.table-row:hover {
  background: var(--hover-bg);
}

.table-row.active {
  background: rgba(0, 122, 255, 0.15);
  padding-right: 10px;
}

.table-row.playing {
  color: #007AFF;
}

.col-number {
  text-align: center;
  font-size: 14px;
  color: var(--text-color-secondary);
  transition: color 0.3s ease;
}

.table-row.active .col-number {
  color: #007AFF;
}

.playing-icon {
  font-size: 16px;
}

.col-title {
  min-width: 0;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.song-thumb {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.col-title span {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.table-row.playing .col-title span {
  color: #007AFF;
  font-weight: 500;
}

.col-artist {
  font-size: 14px;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.col-duration {
  font-size: 14px;
  color: var(--text-color-secondary);
  text-align: right;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}

.table-header .col-duration {
  text-align: center;
}

/* Lecteur audio */
.music-player {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: var(--bg-sidebar);
  border-top: 1px solid var(--border-color);
  gap: 20px;
  min-height: 80px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.player-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 250px;
}

.player-cover {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.player-info {
  min-width: 0;
}

.player-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.player-artist {
  font-size: 11px;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.player-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 600px;
}

.player-controls-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s, color 0.3s ease;
}

.player-btn:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

.player-btn.play-btn {
  width: 44px;
  height: 44px;
  font-size: 24px;
  background: var(--text-color);
  color: var(--bg-window-content);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.player-btn.play-btn:hover {
  background: var(--text-color-secondary);
  opacity: 0.9;
}

.player-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.player-btn:disabled:hover {
  background: transparent;
}

.empty-cover {
  background: var(--hover-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  opacity: 0.3;
  font-size: 24px;
  transition: color 0.3s ease, background-color 0.3s ease;
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.time-current,
.time-total {
  font-size: 11px;
  color: var(--text-color-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 35px;
  transition: color 0.3s ease;
}

.time-current {
  text-align: right;
}

.progress-track {
  flex: 1;
  height: 4px;
  background: var(--hover-bg);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;
}

.progress-fill {
  height: 100%;
  background: var(--text-color);
  border-radius: 2px;
  transition: width 0.1s, background-color 0.3s ease;
}

.player-right {
  display: flex;
  align-items: center;
  min-width: 100px;
  justify-content: flex-end;
}

.player-btn-small {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s, color 0.3s ease;
}

.player-btn-small:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

audio {
  display: none;
}

/* Banner */
.banner-container {
  position: absolute;
  top: 100px;
  left: 57%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.banner {
  width: 250px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.banner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.music-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  opacity: 0.6;
}

.banner-message {
  color: var(--text-color-secondary);
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  transition: color 0.3s ease;
}
</style>
