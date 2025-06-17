<template>
  <div class="weather-icon" :class="size">
    <svg v-if="type === 'sun'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>

    <svg v-else-if="type === 'cloud'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/>
    </svg>

    <svg v-else-if="type === 'rain'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/>
      <path d="M8 18v3M12 18v3M16 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>

    <svg v-else-if="type === 'storm'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/>
      <path d="M13 12l-4 6h4l-2 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <svg v-else-if="type === 'fog'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/>
      <path d="M4 16h16M4 20h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>

    <svg v-else-if="type === 'snow'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/>
      <circle cx="8" cy="18" r="1" fill="currentColor"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
      <circle cx="16" cy="18" r="1" fill="currentColor"/>
    </svg>

    <svg v-else-if="type === 'wind'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H8m10.59 11.41A2 2 0 1 0 21 18h-3m-4.73-2.73A2 2 0 1 1 13 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>

    <svg v-else-if="type === 'partly-cloudy'" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <path d="M20 12a8 8 0 1 0-16 0 8 8 0 0 0 16 0z" stroke="currentColor" stroke-width="2"/>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['sun', 'cloud', 'rain', 'storm', 'fog', 'snow', 'wind', 'partly-cloudy'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})
</script>

<style scoped>
.weather-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
}

.weather-icon.small {
  width: 24px;
  height: 24px;
}

.weather-icon.medium {
  width: 48px;
  height: 48px;
}

.weather-icon.large {
  width: 96px;
  height: 96px;
}
</style> 