<template>
  <div class="user-dashboard-layout">
    <!-- Menu hamburger pour mobile -->
    <button class="hamburger-menu" @click="toggleSidebar" :class="{ 'active': isSidebarOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay pour fermer la sidebar sur mobile -->
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>

    <UserSidebar
      :is-sidebar-open="isSidebarOpen"
      @close="closeSidebar"
      @home-click="handleHomeClick"
      @logout="handleLogout"
    />

    <div class="user-dashboard-content">
      <div class="dashboard-header">
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div class="dashboard-content">
        <div class="profile-container">
          <div class="profile-content">
            <div class="profile-card">
              <div class="profile-avatar">
                <img :src="user.avatar || '/default-avatar.svg'" alt="Avatar" />
                <button class="change-avatar-btn" @click="triggerAvatarUpload">
                  <i class="fas fa-camera"></i>
                </button>
                <input
                  type="file"
                  ref="avatarInput"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
                />
              </div>

              <form @submit.prevent="updateProfile" class="profile-form">
                <div class="form-group">
                  <label for="name">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    v-model="formData.name"
                    required
                  />
                  <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    required
                  />
                  <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                  <label for="domaineActivite">Domaine d'activité</label>
                  <select
                    id="domaineActivite"
                    v-model="formData.domaineActivite"
                    required
                  >
                    <option value="">Sélectionnez votre domaine</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Aviation">Aviation</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Environnement">Environnement</option>
                    <option value="Météorologie">Météorologie</option>
                    <option value="Maritime">Maritime</option>
                    <option value="Médias">Médias</option>
                    <option value="Recherche">Recherche</option>
                    <option value="Transport">Transport</option>
                    <option value="Tourisme">Tourisme</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <span v-if="errors.domaineActivite" class="error-message">{{ errors.domaineActivite }}</span>
                </div>

                <div class="form-group">
                  <label for="phone">Téléphone (optionnel)</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                  />
                  <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                </div>

                <div class="form-group">
                  <label for="address">Adresse (optionnel)</label>
                  <textarea
                    id="address"
                    v-model="formData.address"
                    rows="3"
                  ></textarea>
                  <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
                </div>

                <button type="submit" class="btn-primary" :disabled="isSubmitting">
                  <i class="fas fa-save"></i>
                  {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                </button>
              </form>
            </div>

            <div class="profile-sidebar">
              <div class="sidebar-section">
                <h3>Informations du compte</h3>
                <div class="account-info">
                  <p>
                    <i class="fas fa-calendar"></i>
                    Membre depuis : {{ formatDate(user.createdAt) }}
                  </p>
                  <p>
                    <i class="fas fa-certificate"></i>
                    Certificats : {{ user.certificates?.length || 0 }}
                  </p>
                  <p>
                    <i class="fas fa-clock"></i>
                    Dernière connexion : {{ formatDate(user.lastLogin) }}
                  </p>
                  <p>
                    <i class="fas fa-book"></i>
                    Cours suivis : {{ user.courses?.length || 0 }}
                  </p>
                  <p>
                    <i class="fas fa-trophy"></i>
                    Progression : {{ calculateProgress() }}%
                  </p>
                </div>
              </div>

              <div class="sidebar-section">
                <h3>Sécurité</h3>
                <button @click="showPasswordModal = true" class="btn-secondary">
                  <i class="fas fa-key"></i> Changer le mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de changement de mot de passe -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Changer le mot de passe</h3>
          <button class="close-btn" @click="showPasswordModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="changePassword" class="password-form">
            <div class="form-group">
              <label for="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                required
              />
            </div>
            <div class="form-group">
              <label for="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                required
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                required
              />
            </div>
            <button type="submit" class="btn-primary">
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="notifications">
      <div
        v-if="notification.show"
        :class="['notification', notification.type]"
        @click="notification.show = false"
      >
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import UserSidebar from '~/components/UserSidebar.vue'

definePageMeta({
  layout: 'user',
  middleware: ['user']
})

const authStore = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(false)

// Vérifier si l'utilisateur est connecté
if (!authStore.isAuthenticated) {
  navigateTo('/login')
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  if (isSidebarOpen.value) {
    document.body.classList.add('sidebar-open')
    document.body.style.overflow = 'hidden'
  } else {
    document.body.classList.remove('sidebar-open')
    document.body.style.overflow = ''
  }
}

const closeSidebar = () => {
  isSidebarOpen.value = false
  document.body.classList.remove('sidebar-open')
  document.body.style.overflow = ''
}

const handleHomeClick = () => {
  closeSidebar()
  router.push('/')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Nettoyer les classes lors du démontage du composant
onUnmounted(() => {
  document.body.classList.remove('sidebar-open')
  document.body.style.overflow = ''
})

// État initial avec les vraies données utilisateur
const user = ref({
  name: '',
  email: '',
  domaineActivite: '',
  phone: '',
  address: '',
  avatar: null,
  createdAt: new Date(),
  lastLogin: new Date(),
  certificates: [],
  courses: []
})

// Formulaire principal
const formData = reactive({
  name: '',
  email: '',
  domaineActivite: '',
  phone: '',
  address: ''
})

// Formulaire de mot de passe
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// États
const isSubmitting = ref(false)
const isChangingPassword = ref(false)
const showPasswordModal = ref(false)
const avatarInput = ref(null)

// Erreurs
const errors = reactive({
  name: '',
  email: '',
  domaineActivite: '',
  phone: '',
  address: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Notification system
const notification = reactive({
  show: false,
  message: '',
  type: 'success',
  timeout: null
});

const showNotification = (message, type = 'success') => {
  if (notification.timeout) {
    clearTimeout(notification.timeout);
  }
  
  notification.message = message;
  notification.type = type;
  notification.show = true;
  
  notification.timeout = setTimeout(() => {
    notification.show = false;
  }, 3000);
};

// Chargement initial des données
onMounted(async () => {
  try {
    // Vérifier l'authentification
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return
    }

    // Charger les vraies données utilisateur
    const userData = authStore.user
    if (userData) {
      user.value = {
        name: userData.name || '',
        email: userData.email || '',
        domaineActivite: userData.domaineActivite || '',
        phone: userData.phone || '',
        address: userData.address || '',
        avatar: userData.avatar || null,
        createdAt: userData.createdAt || new Date(),
        lastLogin: userData.lastLogin || new Date(),
        certificates: userData.certificates || [],
        courses: userData.courses || []
      }
      
      Object.assign(formData, {
        name: user.value.name,
        email: user.value.email,
        domaineActivite: user.value.domaineActivite,
        phone: user.value.phone,
        address: user.value.address
      })
    }
  } catch (error) {
    showNotification('Erreur lors du chargement du profil', 'error')
  }
})

// Méthodes
const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.domaineActivite = ''
  errors.phone = ''
  errors.address = ''

  if (!formData.name.trim()) {
    errors.name = 'Le nom complet est requis'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Format d\'email invalide'
    isValid = false
  }

  if (!formData.domaineActivite) {
    errors.domaineActivite = 'Le domaine d\'activité est requis'
    isValid = false
  }

  if (formData.phone && !/^[0-9+\s-]{10,}$/.test(formData.phone)) {
    errors.phone = 'Format de téléphone invalide'
    isValid = false
  }

  return isValid
}

const validatePasswordForm = () => {
  let isValid = true
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Le mot de passe actuel est requis'
    isValid = false
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'Le nouveau mot de passe est requis'
    isValid = false
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    isValid = false
  }

  return isValid
}

const calculateProgress = () => {
  if (!user.value.courses?.length) return 0;
  
  const totalLessons = user.value.courses.reduce((total, course) => {
    return total + (course.lessons?.length || 0);
  }, 0);
  
  const completedLessons = user.value.courses.reduce((total, course) => {
    return total + (course.completedLessons?.length || 0);
  }, 0);
  
  return totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
};

const updateProfile = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    // Appel API pour mettre à jour le profil
    const response = await $fetch('/api/user/profile', {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'x-user-email': authStore.user.email
      }
    })
    
    // Mettre à jour les données locales
    Object.assign(user.value, response.user)
    
    // Mettre à jour le store d'authentification
    const updatedUser = {
      ...authStore.user,
      name: response.user.name,
      email: response.user.email,
      domaineActivite: response.user.domaineActivite,
      phone: response.user.phone,
      address: response.user.address
    }
    authStore.user = updatedUser
    
    showNotification(response.message || 'Profil mis à jour avec succès')
  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    const errorMessage = error.data?.statusMessage || 'Erreur lors de la mise à jour du profil'
    showNotification(errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const changePassword = async () => {
  if (!validatePasswordForm()) return

  isChangingPassword.value = true
  try {
    // Appel API pour changer le mot de passe
    const response = await $fetch('/api/user/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      },
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'x-user-email': authStore.user.email
      }
    })
    
    showNotification(response.message || 'Mot de passe modifié avec succès')
    showPasswordModal.value = false
    
    // Réinitialiser le formulaire
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  } catch (error) {
    console.error('Erreur changement mot de passe:', error)
    const errorMessage = error.data?.statusMessage || 'Erreur lors de la modification du mot de passe'
    showNotification(errorMessage, 'error')
  } finally {
    isChangingPassword.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    name: user.value.name,
    email: user.value.email,
    domaineActivite: user.value.domaineActivite,
    phone: user.value.phone,
    address: user.value.address
  })
}

const triggerAvatarUpload = () => {
  avatarInput.value.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showNotification('Veuillez sélectionner une image valide', 'error')
    return
  }

  // Vérifier la taille du fichier (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    showNotification('Le fichier est trop volumineux (max 5MB)', 'error')
    return
  }

  try {
    // Créer FormData pour l'upload
    const formData = new FormData()
    formData.append('avatar', file)
    
    // Upload vers l'API
    const response = await $fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'x-user-email': authStore.user.email
      }
    })
    
    // Mettre à jour l'avatar localement
    user.value.avatar = response.avatar
    
    // Mettre à jour l'avatar dans le store
    const updatedUser = {
      ...authStore.user,
      avatar: response.avatar
    }
    authStore.user = updatedUser
    
    showNotification('Photo de profil mise à jour avec succès')
  } catch (error) {
    console.error('Erreur upload avatar:', error)
    const errorMessage = error.data?.statusMessage || 'Erreur lors de la mise à jour de la photo de profil'
    showNotification(errorMessage, 'error')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.user-dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fc;
}

/* Styles du contenu principal */
.user-dashboard-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
}

.dashboard-header p {
  color: #7f8c8d;
  margin: 0;
}

/* Styles du profil */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.profile-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.profile-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e3f2fd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-avatar:hover img {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1976d2;
  color: white;
  border: 3px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.change-avatar-btn:hover {
  background: #1565c0;
  transform: scale(1.1);
}

.change-avatar-btn i {
  font-size: 0.9rem;
}

.hidden {
  display: none;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4e73df;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.btn-primary {
  background: #4e73df;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #224abe;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Sidebar du profil */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.sidebar-section h3 {
  color: #2c3e50;
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.account-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.account-info i {
  color: #4e73df;
  width: 16px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e6ed;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #7f8c8d;
}

.modal-body {
  padding: 1.5rem;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Notifications */
.notifications {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1001;
}

.notification {
  background: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.3s;
  min-width: 300px;
}

.notification:hover {
  transform: translateX(-5px);
}

.notification.success {
  border-left: 4px solid #28a745;
  color: #155724;
}

.notification.error {
  border-left: 4px solid #dc3545;
  color: #721c24;
}

/* Menu hamburger */
.hamburger-menu {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #4e73df;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.hamburger-menu span {
  display: block;
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Overlay pour la sidebar mobile */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Media queries */
@media (max-width: 1024px) {
  .hamburger-menu {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }

  .user-dashboard-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem;
  }

  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .user-dashboard-content {
    padding: 0.8rem;
  }

  .dashboard-header h1 {
    font-size: 1.4rem;
  }

  .profile-avatar img {
    width: 100px;
    height: 100px;
  }

  .notifications {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }

  .notification {
    min-width: auto;
  }
}
</style> 