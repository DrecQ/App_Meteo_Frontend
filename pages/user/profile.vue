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

    <aside class="user-sidebar" :class="{ 'open': isSidebarOpen }">
      <div class="sidebar-header">
        <i class="fas fa-user-circle sidebar-logo"></i>
        <span class="sidebar-title">Espace Membre</span>
      </div>
      <nav class="sidebar-nav">
        <button @click="handleHomeClick" class="sidebar-link home-link">
          <i class="fas fa-home"></i> Retour à l'accueil
        </button>
        <div class="sidebar-divider"></div>
        <NuxtLink to="/user" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-tachometer-alt"></i> Tableau de bord
        </NuxtLink>
        <NuxtLink to="/user/courses" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-book"></i> Mes cours
        </NuxtLink>
        <NuxtLink to="/user/certificates" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-certificate"></i> Certificats
        </NuxtLink>
        <NuxtLink to="/user/profile" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-user"></i> Profil
        </NuxtLink>
        <button @click="handleLogout" class="sidebar-link logout">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </button>
      </nav>
    </aside>

    <div class="user-dashboard-content">
      <div class="dashboard-header">
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div class="dashboard-content">
        <div class="profile-container">
          <div class="profile-header">
            <h1>Mon Profil</h1>
            <p>Gérez vos informations personnelles</p>
          </div>

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
                    :class="{ 'error': errors.firstName }"
                  />
                  <span class="error-message" v-if="errors.firstName">{{ errors.firstName }}</span>
                </div>

                <div class="form-group">
                  <label for="lastName">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    v-model="formData.lastName"
                    :class="{ 'error': errors.lastName }"
                  />
                  <span class="error-message" v-if="errors.lastName">{{ errors.lastName }}</span>
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    :class="{ 'error': errors.email }"
                  />
                  <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                  <label for="phone">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                    :class="{ 'error': errors.phone }"
                  />
                  <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
                </div>

                <div class="form-group">
                  <label for="address">Adresse</label>
                  <textarea
                    id="address"
                    v-model="formData.address"
                    rows="3"
                    :class="{ 'error': errors.address }"
                  ></textarea>
                  <span class="error-message" v-if="errors.address">{{ errors.address }}</span>
                </div>

                <div class="form-actions">
                  <button type="button" class="cancel-btn" @click="resetForm">Annuler</button>
                  <button type="submit" class="save-btn" :disabled="isSubmitting">
                    <i class="fas fa-save"></i>
                    {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>

            <div class="profile-sidebar">
              <div class="info-card">
                <h3>Informations de compte</h3>
                <div class="info-item">
                  <i class="fas fa-user"></i>
                  <span>Membre depuis {{ formatDate(user.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-certificate"></i>
                  <span>{{ user.certificates?.length || 0 }} certificats obtenus</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-clock"></i>
                  <span>Dernière connexion : {{ formatDate(user.lastLogin) }}</span>
                </div>
              </div>

              <div class="security-card">
                <h3>Sécurité</h3>
                <button class="change-password-btn" @click="showChangePasswordModal = true">
                  <i class="fas fa-lock"></i>
                  Changer le mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de changement de mot de passe -->
    <Teleport to="body">
      <div v-if="showChangePasswordModal" class="modal-overlay" @click.self="closePasswordModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Changer le mot de passe</h3>
            <button class="close-btn" @click="closePasswordModal">
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
                  :class="{ 'error': passwordErrors.currentPassword }"
                />
                <span class="error-message" v-if="passwordErrors.currentPassword">
                  {{ passwordErrors.currentPassword }}
                </span>
              </div>

              <div class="form-group">
                <label for="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  :class="{ 'error': passwordErrors.newPassword }"
                />
                <span class="error-message" v-if="passwordErrors.newPassword">
                  {{ passwordErrors.newPassword }}
                </span>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  :class="{ 'error': passwordErrors.confirmPassword }"
                />
                <span class="error-message" v-if="passwordErrors.confirmPassword">
                  {{ passwordErrors.confirmPassword }}
                </span>
              </div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="closePasswordModal">
                  Annuler
                </button>
                <button type="submit" class="save-btn" :disabled="isChangingPassword">
                  {{ isChangingPassword ? 'Modification...' : 'Modifier' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="notifications">
      <div v-if="notification.show" 
           :class="['notification', notification.type]" 
           @click="notification.show = false">
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

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
  certificates: []
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
const showChangePasswordModal = ref(false)
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
        certificates: userData.certificates || []
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

const updateProfile = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    // Simuler l'appel API
    // À remplacer par votre appel API réel
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    Object.assign(user.value, formData)
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
    closePasswordModal()
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
    }
    reader.readAsDataURL(file)
    
    showNotification('Photo de profil mise à jour')
  } catch (error) {
    showNotification('Erreur lors de la mise à jour de la photo de profil', 'error')
  }
}

const closePasswordModal = () => {
  showChangePasswordModal.value = false
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
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

/* Styles de la sidebar */
.user-sidebar {
  width: 250px;
  background: linear-gradient(135deg, #4e73df 60%, #224abe 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem 0 1rem;
  box-shadow: 2px 0 8px rgba(0,0,0,0.07);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.sidebar-logo {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-link {
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.home-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffe082;
}

.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 1rem;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}

.sidebar-link:hover,
.sidebar-link.active {
  background: rgba(255,255,255,0.15);
  color: #ffe082;
  transform: translateX(4px);
}

.sidebar-link.logout {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: #e74c3c;
  color: #fff;
  justify-content: center;
  border-radius: 6px;
  padding: 1rem;
  border: none;
  cursor: pointer;
}

.sidebar-link.logout:hover {
  background: #c0392b;
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

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.profile-header p {
  color: #718096;
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

.info-card,
.security-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.info-card h3,
.security-card h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item i {
  color: #4a90e2;
  font-size: 1.25rem;
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

/* Styles pour le menu mobile */
.hamburger-menu {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger-menu span {
  display: block;
  width: 25px;
  height: 3px;
  background: #2c3e50;
  margin: 5px 0;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

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

@media (max-width: 768px) {
  .user-sidebar {
    transform: translateX(-100%);
  }

  .user-sidebar.open {
    transform: translateX(0);
  }

  .hamburger-menu {
    display: block;
  }

  .sidebar-overlay {
    display: block;
  }

  .user-dashboard-content {
    margin-left: 0;
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
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
</style> 