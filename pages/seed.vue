<template>
  <div>
    <h1>Seeding Database...</h1>
    <p v-if="loading">Veuillez patienter...</p>
    <div v-if="error">
      <h2>Erreur:</h2>
      <pre>{{ error }}</pre>
    </div>
    <div v-if="data">
      <h2>Succès !</h2>
      <p>Le cours a été ajouté à la base de données.</p>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const error = ref(null)
const data = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/api/seed-course', { method: 'POST' })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText)
    }
    data.value = await response.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script> 