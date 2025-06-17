<template>
  <div class="courses-page">
    <!-- Bannière améliorée -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>Cours</h1>
        <p>Trouvez le cours parfait pour développer vos compétences en météorologie</p>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Rechercher un cours, un sujet, un mot-clé..." 
            v-model="searchQuery"
            class="search-input"
          />
          <button class="search-btn" @click="searchCourses">
            <i class="fas fa-search"></i> Rechercher
          </button>
        </div>
      </div>
    </div>

    <!-- Section principale -->
    <div class="main-content">
      <div class="container">
        <!-- Filtres -->
        <div class="filters-section">
          <div class="filter-group">
            <label>Catégorie :</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">Toutes</option>
              <option value="meteo">Météorologie</option>
              <option value="climat">Climatologie</option>
              <option value="previsions">Prévisions</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Niveau :</label>
            <select v-model="selectedLevel" class="filter-select">
              <option value="">Tous</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Durée :</label>
            <select v-model="selectedDuration" class="filter-select">
              <option value="">Toutes</option>
              <option value="courte">Moins de 2h</option>
              <option value="moyenne">2-5h</option>
              <option value="longue">Plus de 5h</option>
            </select>
          </div>
        </div>

        <!-- Résultats -->
        <div class="results-info">
          <p>{{ filteredCourses.length }} cours disponibles</p>
          <select v-model="sortOption" class="sort-select">
            <option value="popular">Plus populaires</option>
            <option value="recent">Plus récents</option>
            <option value="duration">Durée</option>
          </select>
        </div>

        <!-- Grille de cours -->
        <div class="courses-grid">
          <div 
            v-for="course in filteredCourses" 
            :key="course.id" 
            class="course-card"
            @click="viewCourse(course.id)"
          >
            <div class="course-badge" :class="course.level">
              {{ course.levelLabel }}
            </div>
            <div class="course-image" :style="{ backgroundImage: `url(${course.image})` }">
              <div class="category-tag">{{ course.category }}</div>
            </div>
            <div class="course-content">
              <div class="course-header">
                <h3>{{ course.title }}</h3>
                <div class="course-rating">
                  <i class="fas fa-star"></i>
                  {{ course.rating }}
                </div>
              </div>
              <p class="course-description">{{ course.description }}</p>
              
              <div class="course-meta">
                <span><i class="fas fa-clock"></i> {{ course.duration }}</span>
                <span><i class="fas fa-users"></i> {{ course.students }}</span>
              </div>
              
              <NuxtLink :to="`/course/${course.id}`" class="btn-enroll">
                Commencer
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Données des cours
const courses = ref([
  {
    id: 1,
    title: "Introduction à la Météorologie",
    description: "Maîtrisez les concepts fondamentaux de la météorologie moderne",
    category: "Météorologie",
    level: "debutant",
    levelLabel: "Débutant",
    duration: "4h 30min",
    students: "245 étudiants",
    rating: 4.8,
    image: "/images/course-meteo.jpg"
  },
  {
    id: 2,
    title: "Climatologie Avancée",
    description: "Analyse des systèmes climatiques et modélisation",
    category: "Climatologie",
    level: "avance",
    levelLabel: "Avancé",
    duration: "8h 15min",
    students: "87 étudiants",
    rating: 4.9,
    image: "/images/course-climat.jpg"
  },
  {
    id: 3,
    title: "Prévisions Météorologiques",
    description: "Techniques modernes de prévision du temps et outils d'analyse",
    category: "Prévisions",
    level: "intermediaire",
    levelLabel: "Intermédiaire",
    duration: "6h",
    students: "156 étudiants",
    rating: 4.7,
    image: "/images/course-previsions.jpg"
  }
]);

// Filtres
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedLevel = ref('');
const selectedDuration = ref('');
const sortOption = ref('popular');

// Cours filtrés
const filteredCourses = computed(() => {
  let result = [...courses.value];

  // Filtre par catégorie
  if (selectedCategory.value) {
    result = result.filter(course => course.category === selectedCategory.value);
  }

  // Filtre par niveau
  if (selectedLevel.value) {
    result = result.filter(course => course.level === selectedLevel.value);
  }

  // Filtre par durée
  if (selectedDuration.value) {
    const [min, max] = selectedDuration.value.split('-').map(Number);
    result = result.filter(course => {
      const duration = parseInt(course.duration);
      return duration >= min && duration <= max;
    });
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  }

  // Tri
  if (sortOption.value === 'popular') {
    result.sort((a, b) => b.students - a.students);
  } else if (sortOption.value === 'recent') {
    result.sort((a, b) => b.id - a.id);
  } else if (sortOption.value === 'duration') {
    // Simplification pour l'exemple
    result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
  }

  return result;
});

function searchCourses() {
  // Logique de recherche
}

function viewCourse(id) {
  router.push(`/course/${id}`);
}

const resetFilters = () => {
  selectedCategory.value = '';
  selectedLevel.value = '';
  selectedDuration.value = '';
  searchQuery.value = '';
  sortOption.value = 'popular';
};
</script>

<style scoped>
.courses-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

/* Bannière */
.page-banner {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 4rem 0 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/weather-pattern.png');
  background-size: 300px;
  opacity: 0.05;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-banner p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

/* Barre de recherche améliorée */
.search-bar {
  display: flex;
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #95a5a6;
}

.search-btn {
  padding: 1rem 1.8rem;
  background: #2980b9;
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-btn:hover {
  background: #1a5276;
}

/* Contenu principal */
.main-content {
  padding: 3rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Filtres */
.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.filter-group label {
  font-weight: 500;
  color: #34495e;
}

.filter-select {
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
  min-width: 180px;
}

/* Résultats */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-info p {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

/* Grille de cours */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.12);
}

.course-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.course-badge.debutant {
  background: #2ecc71;
  color: white;
}

.course-badge.intermediaire {
  background: #f39c12;
  color: white;
}

.course-badge.avance {
  background: #e74c3c;
  color: white;
}

.course-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.category-tag {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(52, 152, 219, 0.9);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.course-content {
  padding: 1.5rem;
}

.course-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.course-header h3 {
  font-size: 1.3rem;
  margin: 0;
  color: #2c3e50;
  flex: 1;
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #f39c12;
  font-weight: 600;
}

.course-description {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  font-size: 0.95rem;
}

.course-meta {
  display: flex;
  gap: 1.5rem;
  color: #95a5a6;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.course-meta span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-enroll {
  width: 100%;
  padding: 0.8rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
  text-align: center;
}

.btn-enroll:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .page-banner {
    padding: 3rem 0 2rem;
  }

  .page-banner h1 {
    font-size: 2rem;
  }
  
  .search-bar {
    flex-direction: column;
    background: transparent;
    box-shadow: none;
    gap: 1rem;
  }
  
  .search-input {
    border-radius: 30px;
    padding: 0.9rem 1.5rem;
  }
  
  .search-btn {
    width: 100%;
    justify-content: center;
    border-radius: 30px;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-banner h1 {
    font-size: 1.8rem;
  }
  
  .page-banner p {
    font-size: 1rem;
  }
  
  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>