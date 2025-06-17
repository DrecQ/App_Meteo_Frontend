<template>
  <div class="home-page">
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
// Les composants sont importés automatiquement par Nuxt
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Animation de fond pour le thème météo */
@keyframes weatherAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>