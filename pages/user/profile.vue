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
                <img :src="user.avatar || '/default-avatar.png'" alt="Avatar" />
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
                  <label for="firstName">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    v-model="formData.firstName"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="lastName">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    v-model="formData.lastName"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="phone">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                  />
                </div>

                <div class="form-group">
                  <label for="address">Adresse</label>
                  <textarea
                    id="address"
                    v-model="formData.address"
                    rows="3"
                  ></textarea>
                </div>

                <button type="submit" class="btn-primary">
                  <i class="fas fa-save"></i>
                  Enregistrer les modifications
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

// État initial
const user = ref({
  firstName: '',
  lastName: '',
  email: '',
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
  firstName: '',
  lastName: '',
  email: '',
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
  firstName: '',
  lastName: '',
  email: '',
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

    // Simuler le chargement des données utilisateur
    // À remplacer par votre appel API réel
    const userData = authStore.currentUser
    if (userData) {
      user.value = {
        ...userData,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        avatar: userData.avatar || null,
        createdAt: userData.createdAt || new Date(),
        lastLogin: userData.lastLogin || new Date(),
        certificates: userData.certificates || [],
        courses: userData.courses || []
      }
      
      Object.assign(formData, {
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        email: user.value.email,
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
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.phone = ''
  errors.address = ''

  if (!formData.firstName.trim()) {
    errors.firstName = 'Le prénom est requis'
    isValid = false
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Le nom est requis'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Format d\'email invalide'
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
    // Simuler l'appel API
    // À remplacer par votre appel API réel
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mettre à jour les données locales
    Object.assign(user.value, formData)
    
    // Mettre à jour le store d'authentification
    const updatedUser = {
      ...authStore.currentUser,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    }
    authStore.setUser(updatedUser)
    
    showNotification('Profil mis à jour avec succès')
  } catch (error) {
    showNotification('Erreur lors de la mise à jour du profil', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const changePassword = async () => {
  if (!validatePasswordForm()) return

  isChangingPassword.value = true
  try {
    // Simuler l'appel API
    // À remplacer par votre appel API réel
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showNotification('Mot de passe modifié avec succès')
    showPasswordModal.value = false
  } catch (error) {
    showNotification('Erreur lors de la modification du mot de passe', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
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

  try {
    // Simuler l'upload
    // À remplacer par votre logique d'upload réelle
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const reader = new FileReader()
    reader.onload = (e) => {
      user.value.avatar = e.target.result
      
      // Mettre à jour l'avatar dans le store
      const updatedUser = {
        ...authStore.currentUser,
        avatar: e.target.result
      }
      authStore.setUser(updatedUser)
    }
    reader.readAsDataURL(file)
    
    showNotification('Photo de profil mise à jour')
  } catch (error) {
    showNotification('Erreur lors de la mise à jour de la photo de profil', 'error')
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
  padding: 2rem;
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
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #4a90e2;
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #4a90e2;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: #357abd;
  transform: scale(1.1);
}

.hidden {
  display: none;
}

.profile-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.cancel-btn:hover {
  background: #edf2f7;
}

.save-btn {
  background: #4a90e2;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-btn:hover {
  background: #357abd;
}

.save-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

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
  margin-bottom: 1.5rem;
}

.sidebar-section h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.account-info p {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4a5568;
  font-size: 0.95rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.account-info p:last-child {
  margin-bottom: 0;
}

.account-info p:hover {
  background: #edf2f7;
  transform: translateX(4px);
}

.account-info i {
  color: #4e73df;
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: #4e73df;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #224abe;
  transform: translateY(-2px);
}

.btn-secondary i {
  font-size: 1rem;
}

.change-password-btn {
  width: 100%;
  padding: 0.75rem;
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-password-btn:hover {
  background: #edf2f7;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f7fafc;
  color: #4a5568;
}

.modal-body {
  padding: 1.5rem;
}

.password-form {
  display: grid;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    order: -1;
  }
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
}

@media (max-width: 768px) {
  .user-sidebar {
    width: 100%;
    max-width: 280px;
  }

  .hamburger-menu {
    top: 0.5rem;
    left: 0.5rem;
  }
}

.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.notification {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification.success {
  background-color: #48bb78;
}

.notification.error {
  background-color: #e53e3e;
}

.notification::before {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.notification.success::before {
  content: '\f00c';
}

.notification.error::before {
  content: '\f00d';
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification.hide {
  animation: slideOut 0.3s ease-out forwards;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: #4e73df;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  box-shadow: 0 4px 6px rgba(78, 115, 223, 0.2);
}

.btn-primary:hover {
  background: #224abe;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(78, 115, 223, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(78, 115, 223, 0.2);
}

.btn-primary i {
  font-size: 1.1rem;
}
</style> 