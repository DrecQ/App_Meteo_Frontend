<template>
  <div class="admin-content">
    <div class="admin-header">
      <h1>Gestion des cours</h1>
      <button class="btn-primary" @click="showAddCourseModal = true">
        <i class="fas fa-plus"></i> Ajouter un cours
      </button>
    </div>

    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un cours..."
        />
      </div>
      <div class="filter-group">
        <select v-model="categoryFilter">
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <select v-model="levelFilter">
          <option value="">Tous les niveaux</option>
          <option v-for="lvl in levels" :key="lvl" :value="lvl">
            {{ lvl }}
          </option>
        </select>
      </div>
    </div>

    <div class="courses-grid">
      <div v-for="course in filteredCourses" :key="course.id" class="course-card">
        <div class="course-image">
          <img :src="course.image" :alt="course.title" />
          <div class="course-level">{{ course.level }}</div>
        </div>
        <div class="course-content">
          <h3>{{ course.title }}</h3>
          <p class="course-description">{{ course.description }}</p>
          <div class="course-meta">
            <span class="course-category">{{ course.category }}</span>
            <span class="course-duration">{{ course.duration }}h</span>
          </div>
          <div class="course-stats">
            <span><i class="fas fa-users"></i> {{ course.students }}</span>
            <span><i class="fas fa-star"></i> {{ course.rating }}</span>
          </div>
          <div class="course-actions">
            <button class="btn-edit" @click="editCourse(course)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" @click="deleteCourse(course.id)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <CourseModal
      v-model="showAddCourseModal"
      :course="selectedCourse"
      :is-editing="!!selectedCourse"
      @submit="handleCourseSubmit"
    />
  </div>
</template>

<script>
export default {
  layout: 'admin'
}
</script>

<script setup>
import { ref, computed } from 'vue';
import CourseModal from '../../components/admin/CourseModal.vue';

const searchQuery = ref('');
const categoryFilter = ref('');
const levelFilter = ref('');
const showAddCourseModal = ref(false);
const selectedCourse = ref(null);

const categories = [
  'Météorologie',
  'Climatologie',
  'Instruments météorologiques',
  'Prévisions météo',
  'Phénomènes météorologiques'
];

const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

const courses = ref([
  {
    id: 1,
    title: 'Introduction à la météorologie',
    description: 'Les bases de la météorologie et des phénomènes atmosphériques',
    category: 'Météorologie',
    level: 'Débutant',
    duration: 20,
    students: 45,
    rating: 4.5,
    image: '/images/course1.jpg'
  },
  {
    id: 2,
    title: 'Climatologie avancée',
    description: 'Étude approfondie des climats et de leurs variations',
    category: 'Climatologie',
    level: 'Avancé',
    duration: 30,
    students: 28,
    rating: 4.8,
    image: '/images/course2.jpg'
  }
]);

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = !categoryFilter.value || course.category === categoryFilter.value;
    const matchesLevel = !levelFilter.value || course.level === levelFilter.value;
    return matchesSearch && matchesCategory && matchesLevel;
  });
});

const editCourse = (course) => {
  selectedCourse.value = { ...course };
  showAddCourseModal.value = true;
};

const deleteCourse = (courseId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
    courses.value = courses.value.filter(course => course.id !== courseId);
  }
};

const handleCourseSubmit = (courseData) => {
  if (selectedCourse.value) {
    // Mise à jour d'un cours existant
    const index = courses.value.findIndex(c => c.id === selectedCourse.value.id);
    if (index !== -1) {
      courses.value[index] = { ...selectedCourse.value, ...courseData };
    }
  } else {
    // Ajout d'un nouveau cours
    const newCourse = {
      id: courses.value.length + 1,
      ...courseData,
      students: 0,
      rating: 0
    };
    courses.value.push(newCourse);
  }
  showAddCourseModal.value = false;
  selectedCourse.value = null;
};
</script>

<style scoped>
.admin-content {
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-header h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-width: 150px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  position: relative;
  height: 200px;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-level {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.course-content {
  padding: 1.5rem;
}

.course-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.course-description {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.course-category,
.course-duration {
  background: #f7fafc;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #4a5568;
}

.course-stats {
  display: flex;
  justify-content: space-between;
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.course-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-edit {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-delete {
  background: #fed7d7;
  color: #e53e3e;
}

.btn-edit:hover {
  background: #cbd5e0;
}

.btn-delete:hover {
  background: #feb2b2;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filters {
    flex-direction: column;
  }

  .filter-group {
    flex-direction: column;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>