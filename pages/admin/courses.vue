<template>
  <div class="admin-page">
    <div class="flex justify-end mb-4">
      <button class="btn-primary">
        <i class="fas fa-plus-circle mr-2"></i> Ajouter un cours
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Niveau</th>
            <th>Quiz associés</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.title }}</td>
            <td>{{ course.category || '—' }}</td>
            <td>{{ course.level || '—' }}</td>
            <td>—</td>
            <td>
              <button @click="onEditCourse(course)" class="action-btn edit">Modifier</button>
              <button @click="onDeleteCourse(course)" class="action-btn delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'admin',
});

const courses = ref([
  {
    id: 'introduction-meteo',
    title: 'Introduction à la Météorologie',
    description: 'Découvrez les bases de la météorologie. Un cours gratuit pour comprendre les phénomènes météorologiques quotidiens et apprendre à lire les prévisions météo.',
    duration: '20 minutes',
    level: 'Débutant',
    image: '/images/courses/ciel.jpg',
    instructor: 'Agence de Météo',
    lessons: 2,
    progress: 0,
    isFree: true
  },
  {
    id: 'secrets-du-ciel',
    title: 'Les Secrets du Ciel',
    description: 'Découvrez les mystères du ciel bleu et des nuages. Comprendre pourquoi le ciel est bleu et comment se forment les différents types de nuages.',
    duration: '30 minutes',
    level: 'Débutant',
    image: '/images/courses/ciel.jpg',
    instructor: 'Agence de Météo',
    lessons: 2,
    progress: 0,
    isFree: false
  },
  {
    id: 'instruments-meteo',
    title: 'Les Instruments Météo',
    description: 'Apprenez à utiliser les instruments météorologiques essentiels. Du thermomètre à l\'anémomètre, maîtrisez les outils de mesure du temps.',
    duration: '45 minutes',
    level: 'Intermédiaire',
    image: '/images/courses/instruments.jpg',
    instructor: 'Agence de Météo',
    lessons: 2,
    progress: 0,
    isFree: false
  },
  {
    id: 'saisons',
    title: 'Les Saisons',
    description: 'Explorez les caractéristiques météorologiques de chaque saison. Comprendre les changements climatiques et leurs impacts sur la nature.',
    duration: '40 minutes',
    level: 'Débutant',
    image: '/images/courses/saisons.jpg',
    instructor: 'Agence de Météo',
    lessons: 4,
    progress: 0,
    isFree: false
  },
  {
    id: 'phenomenes-meteo',
    title: 'Les Phénomènes Météo',
    description: 'Découvrez les phénomènes météorologiques fascinants. Des orages aux arc-en-ciel, explorez la magie de la météo.',
    duration: '50 minutes',
    level: 'Intermédiaire',
    image: '/images/courses/phenomenes.jpg',
    instructor: 'Agence de Météo',
    lessons: 3,
    progress: 0,
    isFree: false
  }
]);

function onEditCourse(course) {
  alert(`Édition du cours : ${course.title}`);
}

function onDeleteCourse(course) {
  if (confirm(`Voulez-vous vraiment supprimer le cours « ${course.title} » ?`)) {
    courses.value = courses.value.filter(c => c.id !== course.id);
  }
}
</script>

<style scoped>
.admin-page {
  padding: 1rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.placeholder-row td > div {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.action-btn {
  margin-right: 0.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.95em;
}

.action-btn.edit {
  background: #f1c40f;
  color: #fff;
}

.action-btn.delete {
  background: #e74c3c;
  color: #fff;
}
</style> 