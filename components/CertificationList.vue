<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">Certifications Disponibles</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CertificationCard
        v-for="certification in certifications"
        :key="certification.title"
        :certification="certification"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CertificationCard from './CertificationCard.vue';

const certifications = [
  {
    title: 'Développement Web Frontend',
    description: 'Maîtrisez les technologies web modernes comme HTML, CSS, JavaScript et les frameworks populaires.',
    level: 'Débutant'
  },
  {
    title: 'Développement Backend',
    description: 'Apprenez à créer des API robustes et des applications serveur avec Node.js et Express.',
    level: 'Intermédiaire'
  },
  {
    title: 'Full Stack Development',
    description: 'Devenez un développeur full stack en maîtrisant à la fois le frontend et le backend.',
    level: 'Avancé'
  }
];
</script> 