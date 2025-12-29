<template>
  <div 
    ref="elementRef"
    :id="id"
    class="desktop-icon folder-icon"
    :style="iconStyle"
    @click="handleClick"
    @mousedown="handleMouseDown"
  >
    <img src="/images/folder.png" alt="Folder Icon" class="icon-img">
    {{ name }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  name: string
}>()

const emit = defineEmits<{
  click: []
}>()

const isDragging = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)
const elementRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })

const iconStyle = computed(() => {
  const style: Record<string, string> = {
    cursor: isDragging.value ? 'grabbing' : 'grab',
    zIndex: isDragging.value ? '1000' : '100'
  }
  
  // Seulement appliquer left/top si on drag
  if (isDragging.value && position.value.x > 0 && position.value.y > 0) {
    style.left = `${position.value.x}px`
    style.top = `${position.value.y}px`
  }
  
  return style
})

const handleClick = (e: MouseEvent) => {
  if (!isDragging.value) {
    emit('click')
  }
}

const handleMouseDown = (e: MouseEvent) => {
  if (!elementRef.value) return
  
  isDragging.value = true
  const rect = elementRef.value.getBoundingClientRect()
  offsetX.value = e.clientX - rect.left
  offsetY.value = e.clientY - rect.top
  
  e.preventDefault()
}

onMounted(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !elementRef.value) return
    const newX = e.clientX - offsetX.value
    const newY = e.clientY - offsetY.value
    position.value = { x: newX, y: newY }
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })
})
</script>

