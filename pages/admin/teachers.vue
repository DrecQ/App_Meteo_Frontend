<template>
  <div class="teachers-admin-container">
    <div class="admin-header">
      <div class="header-title">
        <h1>Gestion des enseignants</h1>
        <p class="subtitle">{{ filteredTeachers.length }} enseignants trouvés</p>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="refreshData" title="Rafraîchir">
          <i class="fas fa-sync-alt"></i>
        </button>
        <button class="btn-primary" @click="openAddTeacherModal">
          <i class="fas fa-plus"></i>
          <span>Nouvel enseignant</span>
        </button>
      </div>
    </div>

    <div class="admin-toolbar">
      <div class="search-container">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un enseignant..."
          @input="handleSearch"
        >
      </div>

      <div class="filters-container">
        <div class="filter-group">
          <label>Spécialité</label>
          <select v-model="specialityFilter" class="custom-select">
            <option value="">Toutes</option>
            <option v-for="spec in specialities" :key="spec.value" :value="spec.value">
              {{ spec.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Statut</label>
          <select v-model="statusFilter" class="custom-select">
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="on_leave">En congé</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Tri par</label>
          <select v-model="sortBy" class="custom-select">
            <option value="name">Nom (A-Z)</option>
            <option value="-name">Nom (Z-A)</option>
            <option value="courses">Cours (croissant)</option>
            <option value="-courses">Cours (décroissant)</option>
            <option value="rating">Note (croissante)</option>
            <option value="-rating">Note (décroissante)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="teachers-content">
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Chargement des enseignants...</span>
      </div>

      <div v-else-if="filteredTeachers.length === 0" class="empty-state">
        <i class="fas fa-chalkboard-teacher"></i>
        <h3>Aucun enseignant trouvé</h3>
        <p>Essayez de modifier vos critères de recherche ou ajoutez un nouvel enseignant.</p>
        <button class="btn-primary" @click="openAddTeacherModal">
          <i class="fas fa-plus"></i>
          Ajouter un enseignant
        </button>
      </div>

      <div v-else class="teachers-grid">
        <div v-for="teacher in paginatedTeachers" :key="teacher.id" class="teacher-card">
          <div class="card-header">
            <div class="avatar-container">
              <img :src="teacher.avatar || '/images/default-avatar.jpg'" :alt="teacher.name" class="teacher-avatar">
              <span class="status-badge" :class="teacher.status"></span>
            </div>
            <div class="teacher-meta">
              <h3>{{ teacher.name }}</h3>
              <span class="speciality-badge">{{ formatSpeciality(teacher.speciality) }}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="teacher-info">
              <p><i class="fas fa-envelope"></i> {{ teacher.email }}</p>
              <p><i class="fas fa-phone-alt"></i> {{ teacher.phone || 'Non renseigné' }}</p>
            </div>

            <div class="teacher-stats">
              <div class="stat-item">
                <i class="fas fa-book"></i>
                <div>
                  <span class="stat-value">{{ teacher.coursesCount }}</span>
                  <span class="stat-label">cours</span>
                </div>
              </div>
              <div class="stat-item">
                <i class="fas fa-star"></i>
                <div>
                  <span class="stat-value">{{ teacher.rating }}</span>
                  <span class="stat-label">moyenne</span>
                </div>
              </div>
              <div class="stat-item">
                <i class="fas fa-calendar-alt"></i>
                <div>
                  <span class="stat-value">{{ teacher.years }} ans</span>
                  <span class="stat-label">expérience</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-icon" @click="viewTeacher(teacher.id)" title="Voir profil">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" @click="editTeacher(teacher)" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon danger" @click="confirmDelete(teacher)" title="Supprimer">
              <i class="fas fa-trash-alt"></i>
            </button>
            <button 
              class="btn-icon" 
              :class="teacher.status === 'active' ? 'warning' : 'success'" 
              @click="toggleStatus(teacher)"
              :title="teacher.status === 'active' ? 'Désactiver' : 'Activer'"
            >
              <i :class="teacher.status === 'active' ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredTeachers.length > 0" class="pagination-controls">
        <button class="btn-pagination" :disabled="currentPage === 1" @click="prevPage">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button class="btn-pagination" :disabled="currentPage === totalPages" @click="nextPage">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <TeacherModal
      v-if="showTeacherModal"
      :teacher="currentTeacher"
      :specialities="specialities"
      @save="handleSaveTeacher"
      @close="closeModal"
    />
  </div>
</template>

<script>
import TeacherModal from '../../components/admin/TeacherModal.vue';

export default {
  layout: 'admin',
  components: { TeacherModal }
}
</script>

<script setup>
import { ref, computed, watch } from 'vue';
import TeacherModal from '../../components/admin/TeacherModal.vue';

// Données réactives
const searchQuery = ref('');
const specialityFilter = ref('');
const statusFilter = ref('');
const sortBy = ref('name');
const currentPage = ref(1);
const itemsPerPage = ref(8);
const showTeacherModal = ref(false);
const currentTeacher = ref(null);
const loading = ref(false);

const specialities = [
  { value: 'math', label: 'Mathématiques' },
  { value: 'science', label: 'Sciences' },
  { value: 'language', label: 'Langues' },
  { value: 'history', label: 'Histoire-Géographie' },
  { value: 'physics', label: 'Physique' },
  { value: 'biology', label: 'Biologie' }
];

// Données de test
const teachers = ref([
  {
    id: 1,
    name: 'Pierre Martin',
    email: 'pierre.martin@example.com',
    phone: '06 12 34 56 78',
    speciality: 'math',
    status: 'active',
    avatar: '/images/teachers/teacher1.jpg',
    coursesCount: 5,
    rating: 4.8,
    years: 7,
    joinDate: '2015-09-01'
  },
  {
    id: 2,
    name: 'Sophie Dubois',
    email: 'sophie.dubois@example.com',
    phone: '06 98 76 54 32',
    speciality: 'science',
    status: 'active',
    avatar: '/images/teachers/teacher2.jpg',
    coursesCount: 3,
    rating: 4.9,
    years: 5,
    joinDate: '2017-03-15'
  }
]);

// Computed properties
const filteredTeachers = computed(() => {
  let result = [...teachers.value];
  
  // Filtrage
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(teacher => 
      teacher.name.toLowerCase().includes(query) || 
      teacher.email.toLowerCase().includes(query)
    );
  }
  
  if (specialityFilter.value) {
    result = result.filter(teacher => teacher.speciality === specialityFilter.value);
  }
  
  if (statusFilter.value) {
    result = result.filter(teacher => teacher.status === statusFilter.value);
  }
  
  // Tri
  if (sortBy.value) {
    const [field, order] = sortBy.value.startsWith('-') 
      ? [sortBy.value.slice(1), 'desc'] 
      : [sortBy.value, 'asc'];
    
    result.sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  return result;
});

const paginatedTeachers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTeachers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTeachers.value.length / itemsPerPage.value);
});

// Méthodes
const formatSpeciality = (spec) => {
  const found = specialities.find(s => s.value === spec);
  return found ? found.label : spec;
};

const openAddTeacherModal = () => {
  currentTeacher.value = null;
  showTeacherModal.value = true;
};

const editTeacher = (teacher) => {
  currentTeacher.value = { ...teacher };
  showTeacherModal.value = true;
};

const viewTeacher = (id) => {
  // Navigation vers la page de profil de l'enseignant
  navigateTo(`/admin/teachers/${id}`);
};

const confirmDelete = (teacher) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${teacher.name} ?`)) {
    deleteTeacher(teacher.id);
  }
};

const deleteTeacher = (id) => {
  teachers.value = teachers.value.filter(teacher => teacher.id !== id);
};

const toggleStatus = (teacher) => {
  teacher.status = teacher.status === 'active' ? 'inactive' : 'active';
};

const handleSaveTeacher = (teacherData) => {
  if (teacherData.id) {
    // Modification
    const index = teachers.value.findIndex(t => t.id === teacherData.id);
    teachers.value[index] = teacherData;
  } else {
    // Ajout
    const newId = Math.max(...teachers.value.map(t => t.id)) + 1;
    teachers.value.unshift({
      ...teacherData,
      id: newId,
      coursesCount: 0,
      rating: 0,
      years: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    });
  }
  closeModal();
};

const closeModal = () => {
  showTeacherModal.value = false;
  currentTeacher.value = null;
};

const refreshData = async () => {
  loading.value = true;
  // Simuler un chargement asynchrone
  await new Promise(resolve => setTimeout(resolve, 800));
  loading.value = false;
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const handleSearch = () => {
  currentPage.value = 1;
};

// Watchers
watch([specialityFilter, statusFilter, sortBy], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.teachers-admin-container {
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-title h1 {
  font-size: 1.8rem;
  color: #2d3748;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  color: #718096;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-refresh {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-refresh:hover {
  background: #edf2f7;
  transform: rotate(90deg);
}

.btn-primary {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #3182ce;
}

.admin-toolbar {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-container i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-container input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.3s ease;
}

.search-container input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.filters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
}

.custom-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.custom-select:focus {
  outline: none;
  border-color: #4299e1;
}

.teachers-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #718096;
}

.loading-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #4299e1;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #718096;
}

.empty-state i {
  font-size: 3rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.teacher-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.teacher-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-container {
  position: relative;
  margin-right: 1rem;
}

.teacher-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-badge.active {
  background: #48bb78;
}

.status-badge.inactive {
  background: #e53e3e;
}

.status-badge.on_leave {
  background: #ed8936;
}

.teacher-meta {
  flex: 1;
}

.teacher-meta h3 {
  font-size: 1.125rem;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
}

.speciality-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #4299e1;
  color: white;
}

.card-body {
  padding: 1.25rem;
}

.teacher-info {
  margin-bottom: 1.25rem;
}

.teacher-info p {
  margin: 0.5rem 0;
  color: #718096;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.teacher-info i {
  width: 16px;
  color: #a0aec0;
}

.teacher-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: #f8fafc;
}

.stat-item i {
  font-size: 1rem;
  color: #a0aec0;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
}

.card-footer {
  display: flex;
  border-top: 1px solid #edf2f7;
  padding: 0.75rem;
  justify-content: space-around;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #a0aec0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #edf2f7;
  color: #4299e1;
}

.btn-icon.danger:hover {
  background: #fff5f5;
  color: #f56565;
}

.btn-icon.success:hover {
  background: #f0fff4;
  color: #48bb78;
}

.btn-icon.warning:hover {
  background: #fffaf0;
  color: #ed8936;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  color: #718096;
  font-size: 0.875rem;
}

.btn-pagination {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-pagination:not(:disabled):hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .filters-container {
    grid-template-columns: 1fr;
  }
  
  .teachers-grid {
    grid-template-columns: 1fr;
  }
}
</style>