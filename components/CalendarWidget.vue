<template>
  <div class="widget calendar-widget folder-icon" style="background: #fff;color: black;">
    <div class="calendar-header">
      <div class="month-year" style="color: #f75555;">{{ currentMonth }}</div>
    </div>
    <div class="calendar-grid">
      <span class="day-label">L</span>
      <span class="day-label">M</span>
      <span class="day-label">M</span>
      <span class="day-label">J</span>
      <span class="day-label">V</span>
      <span class="day-label">S</span>
      <span class="day-label">D</span>
      <span 
        v-for="day in calendarDays" 
        :key="day.value"
        class="day"
        :class="{ 'current-day': day.isToday }"
      >
        {{ day.value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const now = new Date()
const currentMonth = computed(() => {
  return now.toLocaleString('fr-FR', { month: 'long' }).toUpperCase()
})

const calendarDays = computed(() => {
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay()
  
  const days: Array<{ value: number; isToday: boolean }> = []
  
  // Ajouter les jours vides au début
  for (let i = 1; i < startingDayOfWeek; i++) {
    days.push({ value: 0, isToday: false })
  }
  
  // Ajouter les jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === now.getDate()
    days.push({ value: day, isToday })
  }
  
  return days
})
</script>


