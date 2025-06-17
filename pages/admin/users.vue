<template>
  <div class="users-page">
    <div class="page-header">
      <h1>Gestion des utilisateurs</h1>
      <button class="btn-primary" @click="showAddUserModal = true">
        <i class="fas fa-plus"></i> Ajouter un utilisateur
      </button>
    </div>

    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher un utilisateur..."
        >
      </div>
      <div class="filter-group">
        <select v-model="roleFilter">
          <option value="">Tous les rôles</option>
          <option value="student">Étudiant</option>
          <option value="teacher">Enseignant</option>
          <option value="admin">Administrateur</option>
        </select>
        <select v-model="statusFilter">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>
    </div>

    <div class="users-grid">
      <div v-for="user in filteredUsers" :key="user.id" class="user-card">
        <div class="user-header">
          <img :src="user.avatar" :alt="user.name" class="user-avatar">
          <div class="user-info">
            <h3>{{ user.name }}</h3>
            <span class="role" :class="user.role">{{ user.role }}</span>
          </div>
        </div>
        <div class="user-details">
          <p><i class="fas fa-envelope"></i> {{ user.email }}</p>
          <p><i class="fas fa-calendar"></i> Inscrit le {{ formatDate(user.registrationDate) }}</p>
          <p><i class="fas fa-book"></i> {{ user.coursesCount }} cours suivis</p>
        </div>
        <div class="user-actions">
          <button class="btn-edit" @click="editUser(user)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete" @click="deleteUser(user.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showAddUserModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingUser ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveUser" class="user-form">
          <div class="form-group">
            <label>Nom</label>
            <input type="text" v-model="userForm.name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="userForm.email" required>
          </div>
          <div class="form-group">
            <label>Rôle</label>
            <select v-model="userForm.role" required>
              <option value="student">Étudiant</option>
              <option value="teacher">Enseignant</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div class="form-group">
            <label>Statut</label>
            <select v-model="userForm.status" required>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div class="form-group">
            <label>Photo de profil</label>
            <input type="file" @change="handleAvatarUpload" accept="image/*">
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">Annuler</button>
            <button type="submit" class="btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'admin'
}
</script>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const showAddUserModal = ref(false)
const editingUser = ref(null)

const userForm = ref({
  name: '',
  email: '',
  role: 'student',
  status: 'active',
  avatar: ''
})

// Données de test
const users = ref([
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'student',
    status: 'active',
    avatar: '/images/users/user1.jpg',
    registrationDate: '2024-01-15T10:30:00',
    coursesCount: 3
  },
  {
    id: 2,
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    role: 'teacher',
    status: 'active',
    avatar: '/images/users/user2.jpg',
    registrationDate: '2024-02-01T14:45:00',
    coursesCount: 5
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value
    return matchesSearch && matchesRole && matchesStatus
  })
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium'
  }).format(date)
}

function editUser(user) {
  editingUser.value = user
  userForm.value = { ...user }
  showAddUserModal.value = true
}

function deleteUser(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    users.value = users.value.filter(u => u.id !== id)
  }
}

function saveUser() {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    users.value[index] = { ...editingUser.value, ...userForm.value }
  } else {
    const newUser = {
      id: users.value.length + 1,
      ...userForm.value,
      registrationDate: new Date().toISOString(),
      coursesCount: 0
    }
    users.value.push(newUser)
  }
  closeModal()
}

function closeModal() {
  showAddUserModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    role: 'student',
    status: 'active',
    avatar: ''
  }
}

function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // Ici, vous devriez implémenter la logique de téléchargement
    // Pour l'instant, nous utilisons juste le nom du fichier
    userForm.value.avatar = URL.createObjectURL(file)
  }
}
</script>

<style scoped>
.users-page {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  min-width: 150px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h3 {
  margin: 0;
  font-size: 1.1rem;
}

.role {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.role.student {
  background: #3498db;
  color: white;
}

.role.teacher {
  background: #2ecc71;
  color: white;
}

.role.admin {
  background: #e74c3c;
  color: white;
}

.user-details {
  margin: 1rem 0;
}

.user-details p {
  margin: 0.5rem 0;
  color: #666;
}

.user-details i {
  width: 20px;
  color: #3498db;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-edit:hover, .btn-delete:hover {
  opacity: 0.9;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.user-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .filter-group select {
    width: 100%;
  }
}
</style> 