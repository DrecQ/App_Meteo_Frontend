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
        <NuxtLink to="/user" class="sidebar-link" exact-active-class="active" @click="closeSidebar">
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
        <NuxtLink to="/logout" class="sidebar-link logout" @click="closeSidebar">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </NuxtLink>
      </nav>
    </aside>

    <div class="user-dashboard-content">
      <div class="dashboard-header">
        <h1>Mon Profil</h1>
      </div>

      <div class="dashboard-content">
        <div class="profile-grid">
          <!-- Informations personnelles -->
          <div class="profile-card">
            <div class="card-header">
              <h2>Informations personnelles</h2>
              <button class="edit-btn" @click="editPersonalInfo">
                <i class="fas fa-edit"></i> Modifier
              </button>
            </div>
            <div class="card-body">
              <div class="profile-info">
                <div class="info-group">
                  <label>Nom complet</label>
                  <p>{{ user.fullName }}</p>
                </div>
                <div class="info-group">
                  <label>Email</label>
                  <p>{{ user.email }}</p>
                </div>
                <div class="info-group">
                  <label>Téléphone</label>
                  <p>{{ user.phone }}</p>
                </div>
                <div class="info-group">
                  <label>Date d'inscription</label>
                  <p>{{ user.joinDate }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Paramètres de sécurité -->
          <div class="profile-card">
            <div class="card-header">
              <h2>Paramètres de sécurité</h2>
            </div>
            <div class="card-body">
              <div class="security-actions">
                <button class="action-btn" @click="changePassword">
                  <i class="fas fa-key"></i>
                  Changer le mot de passe
                </button>
                <button class="action-btn" @click="enable2FA">
                  <i class="fas fa-shield-alt"></i>
                  Activer l'authentification à deux facteurs
                </button>
                <button class="action-btn" @click="manageDevices">
                  <i class="fas fa-laptop"></i>
                  Gérer les appareils connectés
                </button>
              </div>
            </div>
          </div>

          <!-- Préférences -->
          <div class="profile-card">
            <div class="card-header">
              <h2>Préférences</h2>
            </div>
            <div class="card-body">
              <div class="preferences">
                <div class="preference-item">
                  <label class="switch">
                    <input type="checkbox" v-model="preferences.emailNotifications">
                    <span class="slider"></span>
                  </label>
                  <div class="preference-info">
                    <h3>Notifications par email</h3>
                    <p>Recevoir des notifications par email</p>
                  </div>
                </div>
                <div class="preference-item">
                  <label class="switch">
                    <input type="checkbox" v-model="preferences.smsNotifications">
                    <span class="slider"></span>
                  </label>
                  <div class="preference-info">
                    <h3>Notifications SMS</h3>
                    <p>Recevoir des notifications par SMS</p>
                  </div>
                </div>
                <div class="preference-item">
                  <label class="switch">
                    <input type="checkbox" v-model="preferences.darkMode">
                    <span class="slider"></span>
                  </label>
                  <div class="preference-info">
                    <h3>Mode sombre</h3>
                    <p>Activer le thème sombre</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="profile-card">
            <div class="card-header">
              <h2>Statistiques</h2>
            </div>
            <div class="card-body">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-book"></i>
                  </div>
                  <div class="stat-info">
                    <h3>{{ stats.coursesCompleted }}</h3>
                    <p>Cours terminés</p>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-certificate"></i>
                  </div>
                  <div class="stat-info">
                    <h3>{{ stats.certificates }}</h3>
                    <p>Certificats obtenus</p>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="stat-info">
                    <h3>{{ stats.hoursLearned }}</h3>
                    <p>Heures d'apprentissage</p>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-trophy"></i>
                  </div>
                  <div class="stat-info">
                    <h3>{{ stats.achievements }}</h3>
                    <p>Réalisations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'user'
});

const isSidebarOpen = ref(false);
const preferences = ref({
  emailNotifications: true,
  smsNotifications: false,
  darkMode: false
});

const user = ref({
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+229 90 00 00 00',
  joinDate: '15 Mars 2024'
});

const stats = ref({
  coursesCompleted: 12,
  certificates: 5,
  hoursLearned: 48,
  achievements: 8
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  document.body.style.overflow = isSidebarOpen.value ? 'hidden' : '';
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  document.body.style.overflow = '';
};

const editPersonalInfo = () => {
  console.log('Modifier les informations personnelles');
};

const changePassword = () => {
  console.log('Changer le mot de passe');
};

const enable2FA = () => {
  console.log('Activer 2FA');
};

const manageDevices = () => {
  console.log('Gérer les appareils');
};
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
  margin: 0;
}

/* Grille du profil */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.profile-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card-body {
  padding: 1.5rem;
}

/* Informations personnelles */
.profile-info {
  display: grid;
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-group label {
  color: #6c757d;
  font-size: 0.9rem;
}

.info-group p {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

/* Paramètres de sécurité */
.security-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  color: #2c3e50;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #f8f9fc;
  border-color: #4e73df;
  color: #4e73df;
}

/* Préférences */
.preferences {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e9ecef;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4e73df;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.preference-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: #2c3e50;
}

.preference-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fc;
  border-radius: 8px;
  transition: transform 0.3s;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #4e73df;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
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

  .profile-grid {
    grid-template-columns: 1fr;
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
    transition: transform 0.3s ease;
    width: 280px;
  }

  .user-sidebar.open {
    transform: translateX(0);
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

  .dashboard-header h1 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
  }

  .stats-grid {
    grid-template-columns: 1fr;
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

  .card-header {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .stat-item {
    padding: 0.8rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

/* Optimisation des performances */
@media (prefers-reduced-motion: reduce) {
  .user-sidebar,
  .hamburger-menu,
  .stat-item {
    transition: none;
  }
}
</style> 