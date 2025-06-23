<template>
  <div class="home-page">
    <!-- Bulletin météo dynamique -->
    <div v-if="bulletin" class="weather-bulletin">
      <i class="fas fa-bullhorn"></i>
      <span class="bulletin-title">{{ bulletin.title }}&nbsp;:</span>
      <span class="bulletin-content">{{ bulletin.content }}</span>
    </div>
    <!-- Header avec animation -->
    <HeroSection />

    <!-- Raisons de choisir la plateforme -->
    <WhyChooseUs />

    <!-- Types de cours -->
    <CourseTypes />

    <!-- Statistiques -->
    <StatsSection />

    <!-- FAQ -->
    <FAQ />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const bulletin = ref(null);
let intervalId = null;

async function fetchBulletin() {
  try {
    const res = await fetch('/api/bulletin/latest');
    const data = await res.json();
    if (data.success && data.bulletin) {
      bulletin.value = data.bulletin;
    }
  } catch (e) {}
}

onMounted(() => {
  fetchBulletin();
  intervalId = setInterval(fetchBulletin, 30000); // 30 secondes
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Bulletin météo */
.weather-bulletin {
  display: flex;
  align-items: center;
  gap: 0.7em;
  background: linear-gradient(90deg, #f9d423 0%, #ff4e50 100%);
  color: #2c3e50;
  font-weight: 500;
  font-size: 1.08em;
  padding: 1em 1.5em;
  border-radius: 8px;
  margin: 1.5em auto 1.5em auto;
  max-width: 700px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.weather-bulletin i {
  color: #e67e22;
  font-size: 1.3em;
}
.bulletin-title {
  font-weight: bold;
  margin-right: 0.5em;
}
.bulletin-content {
  font-style: italic;
}

/* Animation de fond pour le thème météo */
@keyframes weatherAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>