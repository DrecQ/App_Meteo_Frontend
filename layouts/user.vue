<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Nettoyer les classes lors du montage et démontage du composant
onMounted(() => {
  // Si on n'est pas dans la section utilisateur, nettoyer les classes
  if (!route.path.startsWith('/user')) {
    document.body.classList.remove('sidebar-open')
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  // Nettoyer les classes lors du démontage
  document.body.classList.remove('sidebar-open')
  document.body.style.overflow = ''
})
</script> 