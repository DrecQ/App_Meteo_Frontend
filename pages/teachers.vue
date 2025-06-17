<template>
  <div class="teachers-page">
    <!-- Bannière améliorée -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>Nos Enseignants</h1>
        <p>Découvrez nos experts en météorologie et climatologie</p>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Rechercher un enseignant..." 
            v-model="searchQuery"
            class="search-input"
          />
          <button class="search-btn" @click="searchTeachers">
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
            <label>Spécialité :</label>
            <select v-model="selectedSpecialty" class="filter-select">
              <option value="">Toutes</option>
              <option value="meteo">Météorologie</option>
              <option value="climat">Climatologie</option>
              <option value="previsions">Prévisions</option>
              <option value="ocean">Océanographie</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Expérience :</label>
            <select v-model="selectedExperience" class="filter-select">
              <option value="">Tous</option>
              <option value="junior">Junior (1-5 ans)</option>
              <option value="senior">Senior (5-15 ans)</option>
              <option value="expert">Expert (15+ ans)</option>
            </select>
          </div>
        </div>

        <!-- Résultats -->
        <div class="results-info">
          <p>{{ filteredTeachers.length }} enseignants disponibles</p>
        </div>

        <!-- Grille d'enseignants -->
        <div class="teachers-grid">
          <div 
            v-for="teacher in filteredTeachers" 
            :key="teacher.id" 
            class="teacher-card"
            @click="viewProfile(teacher.id)"
          >
            <div class="teacher-image" :style="{ backgroundColor: stringToColor(teacher.name) }">
              <div class="teacher-initial">{{ getInitials(teacher.name) }}</div>
              <div class="teacher-badge" :class="teacher.experience">
                {{ teacher.experienceLabel }}
              </div>
            </div>
            <div class="teacher-content">
              <div class="teacher-header">
                <h3>{{ teacher.name }}</h3>
                <div class="teacher-rating">
                  <i class="fas fa-star"></i>
                  {{ teacher.rating }}
                </div>
              </div>
              <p class="teacher-title">{{ teacher.title }}</p>
              <p class="teacher-description">{{ teacher.description }}</p>
              
              <div class="teacher-expertise">
                <span v-for="(tag, index) in teacher.tags" :key="index">{{ tag }}</span>
              </div>
              
              <button class="btn-view-profile" @click.stop="viewProfile(teacher.id)">
                Voir le profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Données des enseignants
const teachers = ref([
  {
    id: 1,
    name: "Dr. Jean Dupont",
    title: "Météorologue Senior",
    description: "Spécialiste en prévisions météorologiques avec plus de 15 ans d'expérience",
    specialty: "previsions",
    experience: "expert",
    experienceLabel: "Expert",
    rating: 4.9,
    tags: ["Prévisions", "Climatologie", "Modélisation"],
    courses: 12
  },
  {
    id: 2,
    name: "Prof. Marie Leclerc",
    title: "Climatologue",
    description: "Chercheuse en changements climatiques et phénomènes extrêmes",
    specialty: "climat",
    experience: "senior",
    experienceLabel: "Senior",
    rating: 4.8,
    tags: ["Climatologie", "Analyse", "Recherche"],
    courses: 8
  },
  {
    id: 3,
    name: "Dr. Ahmed Khan",
    title: "Océanographe Météorologue",
    description: "Expert en interactions océan-atmosphère et cyclones tropicaux",
    specialty: "ocean",
    experience: "expert",
    experienceLabel: "Expert",
    rating: 4.7,
    tags: ["Océanographie", "Cyclones", "Tempêtes"],
    courses: 5
  },
  {
    id: 4,
    name: "Dr. Sophie Martin",
    title: "Météorologue Opérationnelle",
    description: "Spécialiste en prévisions immédiates et alertes météo",
    specialty: "meteo",
    experience: "senior",
    experienceLabel: "Senior",
    rating: 4.6,
    tags: ["Prévisions", "Alertes", "Radar"],
    courses: 7
  },
  {
    id: 5,
    name: "Dr. Thomas Weiss",
    title: "Chercheur en Physique Atmosphérique",
    description: "Expert en modélisation numérique et processus atmosphériques",
    specialty: "meteo",
    experience: "expert",
    experienceLabel: "Expert",
    rating: 4.9,
    tags: ["Modélisation", "Physique", "Simulation"],
    courses: 10
  },
  {
    id: 6,
    name: "Dr. Fatoumata Diallo",
    title: "Spécialiste en Climat Tropical",
    description: "Analyse des systèmes climatiques en zones tropicales",
    specialty: "climat",
    experience: "junior",
    experienceLabel: "Junior",
    rating: 4.5,
    tags: ["Tropical", "Mousson", "Sécheresse"],
    courses: 3
  }
]);

// Filtres
const searchQuery = ref('');
const selectedSpecialty = ref('');
const selectedExperience = ref('');

// Enseignants filtrés
const filteredTeachers = computed(() => {
  let result = [...teachers.value];
  
  // Filtre par recherche
  if (searchQuery.value) {
    result = result.filter(teacher => 
      teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      teacher.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      teacher.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Filtre par spécialité
  if (selectedSpecialty.value) {
    result = result.filter(teacher => 
      teacher.specialty === selectedSpecialty.value
    );
  }
  
  // Filtre par expérience
  if (selectedExperience.value) {
    result = result.filter(teacher => teacher.experience === selectedExperience.value);
  }
  
  return result;
});

// Fonctions utilitaires
function getInitials(name) {
  return name.split(' ').map(part => part[0]).join('');
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 50%)`;
}

function searchTeachers() {
  // Logique de recherche
}

function viewProfile(id) {
  // Navigation vers le profil
  console.log('Voir profil:', id);
}
</script>

<style scoped>
.teachers-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

/* Bannière */
.page-banner {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 5rem 0 4rem;
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

/* Barre de recherche */
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

/* Grille d'enseignants */
.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.teacher-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.teacher-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.12);
}

.teacher-image {
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacher-initial {
  font-size: 4rem;
  color: white;
  font-weight: bold;
  opacity: 0.8;
}

.teacher-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.teacher-badge.junior {
  background: #2ecc71;
  color: white;
}

.teacher-badge.senior {
  background: #f39c12;
  color: white;
}

.teacher-badge.expert {
  background: #e74c3c;
  color: white;
}

.teacher-content {
  padding: 1.5rem;
}

.teacher-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.teacher-header h3 {
  font-size: 1.3rem;
  margin: 0;
  color: #2c3e50;
  flex: 1;
}

.teacher-rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #f39c12;
  font-weight: 600;
}

.teacher-title {
  color: #3498db;
  font-weight: 500;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
}

.teacher-description {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
}

.teacher-expertise {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.teacher-expertise span {
  background: #f1f5f9;
  color: #2c3e50;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.btn-view-profile {
  width: 100%;
  padding: 0.8rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view-profile:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
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
  
  .teachers-grid {
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
  
  .teacher-image {
    height: 180px;
  }
  
  .teacher-initial {
    font-size: 3rem;
  }
}
</style>