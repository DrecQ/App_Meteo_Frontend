<template>
  <aside class="user-sidebar" :class="{ 'open': isSidebarOpen }">
    <div class="sidebar-header">
      <div class="user-avatar">
        <img 
          :src="authStore.user?.avatar || '/default-avatar.svg'" 
          :alt="userName"
          @error="handleAvatarError"
        />
      </div>
      <span class="sidebar-title">{{ userName }}</span>
    </div>
    <nav class="sidebar-nav">
      <button @click="handleHomeClick" class="sidebar-link home-link">
        <i class="fas fa-home"></i> Retour à l'accueil
      </button>
      <div class="sidebar-divider"></div>
      <NuxtLink to="/user" class="sidebar-link" exact-active-class="active" @click="closeSidebar">
        <i class="fas fa-tachometer-alt"></i> Tableau de bord
      </NuxtLink>
      <NuxtLink to="/user/courses" class="sidebar-link" active-class="active" @click="closeSidebar">
        <i class="fas fa-book"></i> Mes cours
      </NuxtLink>
      <NuxtLink to="/user/certificates" class="sidebar-link" active-class="active" @click="closeSidebar">
        <i class="fas fa-certificate"></i> Certificats
      </NuxtLink>
      <NuxtLink to="/user/community-chat" class="sidebar-link" active-class="active" @click="closeSidebar">
        <i class="fas fa-comments"></i> Chat communautaire
      </NuxtLink>
      <NuxtLink to="/user/profile" class="sidebar-link" active-class="active" @click="closeSidebar">
        <i class="fas fa-user"></i> Profil
      </NuxtLink>
      <button @click="handleLogout" class="sidebar-link logout">
        <i class="fas fa-sign-out-alt"></i> Déconnexion
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'home-click', 'logout'])

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => {
  const fullName = authStore.user?.name || 'Utilisateur'
  // Extraire seulement le prénom (premier mot)
  const firstName = fullName.split(' ')[0]
  return firstName
})

const closeSidebar = () => {
  emit('close')
}

const handleHomeClick = () => {
  emit('home-click')
}

const handleLogout = () => {
  emit('logout')
}

const handleAvatarError = (event) => {
  // En cas d'erreur de chargement de l'avatar, utiliser l'avatar par défaut
  event.target.src = '/default-avatar.svg'
}
</script>

<style scoped>
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
  margin-bottom: 1.5rem;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.8rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 0;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  padding: 0.7rem;
  border: none;
  cursor: pointer;
  margin-bottom: 0;
  font-size: 0.9rem;
}

.sidebar-link.logout:hover {
  background: #c0392b;
}

/* Ajouter une marge basse au bouton profil pour éviter qu'il soit collé au bouton déconnexion */
.sidebar-link[href*="profile"] {
  margin-bottom: 6rem;
}

@media (max-width: 1024px) {
  .user-sidebar {
    transform: translateX(-100%);
  }

  .user-sidebar.open {
    transform: translateX(0);
  }

  body.sidebar-open .user-sidebar {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .user-sidebar {
    width: 100%;
    max-width: 280px;
  }
}
</style> 