<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw;background: black;">
    <i id="apple-icon" :class="['bi bi-apple', { 'fade-in': isVisible, 'fade-out': isFadingOut }]"></i>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})

const isVisible = ref(false)
const isFadingOut = ref(false)

onMounted(() => {
  const FADE_IN_DURATION = 1500
  const DISPLAY_DURATION = 1500
  const FADE_OUT_DURATION = 1000
  const REDIRECTION_DELAY = FADE_IN_DURATION + DISPLAY_DURATION + FADE_OUT_DURATION

  setTimeout(() => {
    isVisible.value = true
  }, 100)

  setTimeout(() => {
    isVisible.value = false
    isFadingOut.value = true
  }, FADE_IN_DURATION + DISPLAY_DURATION)

  setTimeout(() => {
    navigateTo('/locked')
  }, REDIRECTION_DELAY)
})
</script>

<style>
body {
  background-color: black !important;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  transition: opacity 1s ease-in-out;
  opacity: 1;
}

#apple-icon {
  font-size: 60px;
  color: white;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.fade-in {
  opacity: 1 !important;
}

.fade-out {
  opacity: 0 !important;
}
</style>

