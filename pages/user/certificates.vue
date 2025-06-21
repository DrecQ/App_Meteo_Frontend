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
        <h1>Mes Certificats</h1>
        <div class="header-actions">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Rechercher un certificat...">
          </div>
          <div class="filter-dropdown">
            <select v-model="selectedFilter">
              <option value="all">Tous les certificats</option>
              <option value="valid">Valides</option>
              <option value="expiring">Expirant bientôt</option>
              <option value="expired">Expirés</option>
            </select>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <!-- État de chargement -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Chargement de vos certificats...</p>
        </div>

        <!-- État vide -->
        <div v-else-if="filteredCertificates.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-certificate"></i>
          </div>
          <h3>Aucun certificat trouvé</h3>
          <p v-if="searchQuery || selectedFilter !== 'all'">
            Aucun certificat ne correspond à votre recherche.
          </p>
          <p v-else>
            Vous n'avez pas encore obtenu de certificats. Commencez par suivre et compléter des cours !
          </p>
          <NuxtLink to="/user/courses" class="btn-primary">
            <i class="fas fa-book"></i>
            Voir mes cours
          </NuxtLink>
        </div>

        <!-- Liste des certificats -->
        <div v-else class="certificates-grid">
          <div
            v-for="certificate in filteredCertificates"
            :key="certificate.id"
            class="certificate-card"
            :class="certificate.status"
          >
            <div class="certificate-header">
              <div class="certificate-icon">
                <i class="fas fa-certificate"></i>
              </div>
              <div class="certificate-status" :class="certificate.status">
                {{ getStatusText(certificate.status) }}
              </div>
            </div>

            <div class="certificate-content">
              <h3 class="certificate-title">{{ certificate.title }}</h3>
              <p class="certificate-description">{{ certificate.description }}</p>
              
              <div class="certificate-details">
                <div class="detail-item">
                  <i class="fas fa-book"></i>
                  <span>{{ certificate.courseTitle }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-user"></i>
                  <span>{{ certificate.instructor }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-calendar"></i>
                  <span>Obtenu le {{ certificate.issueDate }}</span>
                </div>
                <div v-if="certificate.expiryDate" class="detail-item">
                  <i class="fas fa-clock"></i>
                  <span>Expire le {{ certificate.expiryDate }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-star"></i>
                  <span>Score: {{ certificate.score }}/{{ certificate.maxScore }}</span>
                </div>
              </div>
            </div>

            <div class="certificate-actions">
              <button @click="viewCertificate(certificate)" class="btn-secondary">
                <i class="fas fa-eye"></i>
                Voir
              </button>
              <button @click="downloadCertificate(certificate)" class="btn-primary">
                <i class="fas fa-download"></i>
                Télécharger
              </button>
            </div>
          </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import UserSidebar from '~/components/UserSidebar.vue';

definePageMeta({
  layout: 'user',
  middleware: ['user']
});

const authStore = useAuthStore();
const router = useRouter();
const isSidebarOpen = ref(false);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const certificates = ref([]);

// Vérifier si l'utilisateur est connecté
if (!authStore.isAuthenticated) {
  navigateTo('/login');
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  if (isSidebarOpen.value) {
    document.body.classList.add('sidebar-open');
    document.body.style.overflow = 'hidden';
  } else {
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = '';
  }
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  document.body.classList.remove('sidebar-open');
  document.body.style.overflow = '';
};

const handleHomeClick = () => {
  closeSidebar();
  router.push('/');
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// Notification system
const notification = ref({
  show: false,
  message: '',
  type: 'success',
  timeout: null
});

const showNotification = (message, type = 'success') => {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
  }
  
  notification.value.message = message;
  notification.value.type = type;
  notification.value.show = true;
  
  notification.value.timeout = setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

// Charger les certificats
const loadCertificates = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/user/certificates', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'x-user-email': authStore.user.email
      }
    });
    
    certificates.value = response.certificates;
  } catch (error) {
    console.error('Erreur lors du chargement des certificats:', error);
    showNotification('Erreur lors du chargement des certificats', 'error');
  } finally {
    loading.value = false;
  }
};

const filteredCertificates = computed(() => {
  return certificates.value.filter(certificate => {
    const matchesSearch = certificate.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         certificate.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         certificate.courseTitle.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesFilter = selectedFilter.value === 'all' || certificate.status === selectedFilter.value;
    return matchesSearch && matchesFilter;
  });
});

const getStatusText = (status) => {
  const statusMap = {
    'valid': 'Valide',
    'expiring': 'Expire bientôt',
    'expired': 'Expiré'
  };
  return statusMap[status] || status;
};

const viewCertificate = (certificate) => {
  // TODO: Implémenter la vue détaillée du certificat
  console.log('Voir le certificat:', certificate);
  showNotification('Fonctionnalité en cours de développement');
};

const downloadCertificate = (certificate) => {
  // TODO: Implémenter le téléchargement du certificat
  console.log('Télécharger le certificat:', certificate);
  showNotification('Fonctionnalité en cours de développement');
};

// Charger les données au montage
onMounted(() => {
  loadCertificates();
});

// Nettoyer les classes lors du démontage du composant
onUnmounted(() => {
  document.body.classList.remove('sidebar-open');
  document.body.style.overflow = '';
});
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
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
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
}

.sidebar-link.logout:hover {
  background: #c0392b;
  color: #fff;
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
  margin: 0 0 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  outline: none;
  border-color: #4e73df;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
}

.filter-dropdown select {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-dropdown select:focus {
  outline: none;
  border-color: #4e73df;
}

/* États de chargement et vide */
.loading-state {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e6ed;
  border-top: 4px solid #4e73df;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Grille des certificats */
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.certificate-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid transparent;
}

.certificate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.certificate-card.valid {
  border-color: #28a745;
}

.certificate-card.expiring {
  border-color: #ffc107;
}

.certificate-card.expired {
  border-color: #dc3545;
  opacity: 0.7;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e6ed;
}

.certificate-icon {
  font-size: 1.5rem;
  color: #4e73df;
}

.certificate-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.certificate-status.valid {
  background: #d4edda;
  color: #155724;
}

.certificate-status.expiring {
  background: #fff3cd;
  color: #856404;
}

.certificate-status.expired {
  background: #f8d7da;
  color: #721c24;
}

.certificate-content {
  padding: 1.5rem;
}

.certificate-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.certificate-description {
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.certificate-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #5a6c7d;
}

.detail-item i {
  width: 16px;
  color: #4e73df;
}

.certificate-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e6ed;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: #4e73df;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #224abe;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #4e73df;
  border: 1px solid #4e73df;
}

.btn-secondary:hover {
  background: #4e73df;
  color: white;
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

  .certificates-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    max-width: none;
  }

  .certificate-card {
    margin: 0 0.5rem;
  }

  .certificate-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .user-dashboard-content {
    padding: 0.8rem;
  }

  .dashboard-header h1 {
    font-size: 1.4rem;
  }

  .certificate-content {
    padding: 1rem;
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