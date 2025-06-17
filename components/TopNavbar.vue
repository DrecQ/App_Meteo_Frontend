<template>
  <div v-if="!isLoginPage && !isRegisterPage" class="top-navbar" :class="{ 'hidden': isScrolled }">
    <div class="container">
      <div class="nav-right">
        <div class="logo-mobile">
          <Logo />
        </div>
        <div class="nav-actions">
          <div class="language-switcher">
            <button class="language-btn" @click="toggleLanguageDropdown" :class="{ 'active': isLanguageDropdownOpen }">
              {{ currentLanguageName }}
              <i class="fas" :class="isLanguageDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </button>
            <div class="language-dropdown" v-show="isLanguageDropdownOpen">
              <button v-for="lang in languages" 
                      :key="lang.code" 
                      @click="changeLanguage(lang.code)"
                      :class="{ active: currentLang === lang.code }">
                {{ lang.name }}
              </button>
            </div>
          </div>
          <div class="auth-buttons" v-if="!isLoggedIn">
            <NuxtLink to="/login" class="btn-login">Connexion</NuxtLink>
          </div>
          <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }" :aria-label="isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'">
            <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Logo from './Logo.vue';

const route = useRoute();
const authStore = useAuthStore();
const currentLang = ref('fr');
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const isLanguageDropdownOpen = ref(false);

const isLoggedIn = computed(() => {
  return authStore.isAuthenticated;
});

const currentLanguageName = computed(() => {
  const lang = languages.find(l => l.code === currentLang.value);
  return lang ? lang.name : 'Français';
});

const isLoginPage = computed(() => {
  return route.path === '/login';
});

const isRegisterPage = computed(() => {
  return route.path === '/register';
});

// Surveiller les changements de route
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
  emit('toggle-menu', false);
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Fermer le dropdown si on clique en dehors
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event) => {
  const languageSwitcher = document.querySelector('.language-switcher');
  if (languageSwitcher && !languageSwitcher.contains(event.target)) {
    isLanguageDropdownOpen.value = false;
  }
};

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'fon', name: 'Fon' }
];

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value;
};

const changeLanguage = (lang) => {
  currentLang.value = lang;
  emit('language-changed', lang);
  isLanguageDropdownOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  emit('toggle-menu', isMobileMenuOpen.value);
};

const emit = defineEmits(['toggle-menu', 'language-changed']);
</script>

<style scoped>
.top-navbar {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.top-navbar.hidden {
  transform: translateY(-100%);
}

.container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-mobile {
  display: none;
}

.logo-mobile a {
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  transition: opacity 0.3s;
}

.logo-mobile a:hover {
  opacity: 0.9;
}

.language-switcher {
  position: relative;
}

.language-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.language-btn i {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.language-btn:hover,
.language-btn.active {
  background: rgba(255,255,255,0.2);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 150px;
  overflow: hidden;
  z-index: 100;
}

.language-dropdown button {
  width: 100%;
  padding: 0.8rem 1rem;
  text-align: left;
  border: none;
  background: none;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-dropdown button:hover {
  background: rgba(52, 152, 219, 0.1);
}

.language-dropdown button.active {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  font-weight: 500;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.btn-login {
  padding: 0.5rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  background: transparent;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .top-navbar {
    padding: 0.5rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .nav-right {
    justify-content: space-between;
  }

  .logo-mobile {
    display: block;
  }

  .nav-actions {
    gap: 1rem;
  }

  .language-switcher {
    display: none;
  }

  .auth-buttons {
    display: flex;
  }

  .btn-login {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .mobile-menu-btn:hover,
  .mobile-menu-btn.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: white;
  }
}
</style>