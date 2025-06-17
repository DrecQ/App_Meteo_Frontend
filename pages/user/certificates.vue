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
        <NuxtLink to="/logout" class="sidebar-link logout" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </NuxtLink>
      </nav>
    </aside>

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
              <option value="recent">Récents</option>
              <option value="expiring">Expirant bientôt</option>
            </select>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="certificates-grid">
          <div v-for="certificate in filteredCertificates" :key="certificate.id" class="certificate-card">
            <div class="certificate-header">
              <i class="fas fa-certificate certificate-icon"></i>
              <div class="certificate-status" :class="certificate.status">
                {{ getStatusText(certificate.status) }}
              </div>
            </div>
            <div class="certificate-info">
              <h3>{{ certificate.title }}</h3>
              <p>{{ certificate.description }}</p>
              <div class="certificate-meta">
                <span><i class="fas fa-calendar"></i> Obtenu le {{ certificate.issueDate }}</span>
                <span><i class="fas fa-clock"></i> Expire le {{ certificate.expiryDate }}</span>
              </div>
            </div>
            <div class="certificate-actions">
              <button class="view-btn" @click="viewCertificate(certificate)">
                <i class="fas fa-eye"></i> Voir
              </button>
              <button class="download-btn" @click="downloadCertificate(certificate)">
                <i class="fas fa-download"></i> Télécharger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'user',
  middleware: ['user']
});

const authStore = useAuthStore();
const router = useRouter();
const isSidebarOpen = ref(false);
const searchQuery = ref('');
const selectedFilter = ref('all');

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

const certificates = ref([
  {
    id: 1,
    title: 'Certificat en Météorologie de Base',
    description: 'Maîtrise des concepts fondamentaux de la météorologie',
    issueDate: '15/03/2024',
    expiryDate: '15/03/2027',
    status: 'valid'
  },
  {
    id: 2,
    title: 'Expert en Prévisions Météorologiques',
    description: 'Compétences avancées en prévisions météorologiques',
    issueDate: '01/02/2024',
    expiryDate: '01/02/2026',
    status: 'valid'
  },
  {
    id: 3,
    title: 'Spécialiste en Climatologie',
    description: 'Expertise en analyse climatique et études environnementales',
    issueDate: '10/01/2023',
    expiryDate: '10/01/2025',
    status: 'expiring'
  },
  {
    id: 4,
    title: 'Technicien en Instruments Météorologiques',
    description: 'Maîtrise des outils et instruments de mesure météorologique',
    issueDate: '20/12/2022',
    expiryDate: '20/12/2024',
    status: 'expired'
  }
]);

const filteredCertificates = computed(() => {
  return certificates.value.filter(certificate => {
    const matchesSearch = certificate.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         certificate.description.toLowerCase().includes(searchQuery.value.toLowerCase());
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
  console.log('Voir le certificat:', certificate);
};

const downloadCertificate = (certificate) => {
  console.log('Télécharger le certificat:', certificate);
};

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.search-bar input:focus {
  outline: none;
  border-color: #4e73df;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
}

.filter-dropdown select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

/* Grille des certificats */
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.certificate-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.certificate-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.certificate-header {
  padding: 1.2rem;
  background: #f8f9fc;
  border-bottom: 1px solid #e9ecef;
  position: relative;
}

.certificate-icon {
  font-size: 1.8rem;
  color: #4e73df;
  margin-bottom: 0.5rem;
}

.certificate-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.certificate-status.valid {
  background: #e8f5e9;
  color: #2e7d32;
}

.certificate-status.expiring {
  background: #fff3e0;
  color: #ef6c00;
}

.certificate-status.expired {
  background: #ffebee;
  color: #c62828;
}

.certificate-info {
  padding: 1.2rem;
}

.certificate-info h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.certificate-info p {
  margin: 0 0 1rem;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.certificate-meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #6c757d;
  font-size: 0.85rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e9ecef;
}

.certificate-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.certificate-actions {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 0.8rem;
}

.view-btn,
.download-btn {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.view-btn {
  background: #4e73df;
  color: white;
}

.view-btn:hover {
  background: #224abe;
}

.download-btn {
  background: #f8f9fc;
  color: #4e73df;
  border: 1px solid #4e73df;
}

.download-btn:hover {
  background: #4e73df;
  color: white;
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
@media (max-width: 1200px) {
  .user-dashboard-content {
    padding: 1.5rem;
  }

  .certificates-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .hamburger-menu {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }

  .user-sidebar {
    transform: translateX(-100%);
  }

  .user-sidebar.open {
    transform: translateX(0);
  }

  body.sidebar-open .user-sidebar {
    transform: translateX(0);
  }

  .user-dashboard-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .search-bar {
    width: 100%;
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

  .dashboard-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .dashboard-header h1 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
  }

  .certificates-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .user-dashboard-content {
    padding: 0.8rem;
  }

  .dashboard-header h1 {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }

  .certificate-info {
    padding: 1rem;
  }

  .certificate-header {
    padding: 1rem;
  }

  .certificate-icon {
    font-size: 2rem;
  }
}

/* Optimisation des performances */
@media (prefers-reduced-motion: reduce) {
  .user-sidebar,
  .hamburger-menu,
  .certificate-card {
    transition: none;
  }
}
</style> 