<template>
  <div class="home-page">
    <!-- Le bulletin est maintenant passé en prop -->
    <HeroSection :bulletin="bulletin" />

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

/* Le style du bulletin est retiré d'ici */

/* Animation de fond pour le thème météo */
@keyframes weatherAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>