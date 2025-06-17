<template>
  <nav class="main-navbar" :class="{ 
    'mobile-open': isMobileMenuOpen, 
    'scrolled': isScrolled,
    'auth-page': isLoginPage || isRegisterPage 
  }">
    <div class="container">
      <div class="logo">
        <nuxt-link to="/">METEO-BENIN</nuxt-link>
      </div>
      <div class="nav-links">
        <NuxtLink to="/" class="nav-link">Accueil</NuxtLink>
        <NuxtLink to="/courses" class="nav-link">Cours</NuxtLink>
        <NuxtLink to="/teachers" class="nav-link">Enseignants</NuxtLink>
        <NuxtLink to="/about" class="nav-link">À propos</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
      </div>
    </div>

    <!-- Menu mobile -->
    <div class="mobile-menu" :class="{ 'open': isMobileMenuOpen }">
      <div class="mobile-nav-links">
        <NuxtLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Accueil</NuxtLink>
        <NuxtLink to="/courses" class="mobile-nav-link" @click="closeMobileMenu">Cours</NuxtLink>
        <NuxtLink to="/teachers" class="mobile-nav-link" @click="closeMobileMenu">Enseignants</NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">À propos</NuxtLink>
        <NuxtLink to="/contact" class="mobile-nav-link" @click="closeMobileMenu">Contact</NuxtLink>
      </div>
      <div class="mobile-language-switcher">
        <button class="mobile-language-btn" @click="toggleLanguageDropdown">
          <i class="fas fa-globe"></i>
          <span>{{ currentLanguageName }}</span>
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="mobile-language-dropdown" v-if="isLanguageDropdownOpen">
          <button v-for="lang in languages" 
                  :key="lang.code" 
                  @click="changeLanguage(lang.code)"
                  :class="{ active: currentLang === lang.code }">
            {{ lang.name }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { locale } = useI18n();
const isScrolled = ref(false);
const isLanguageDropdownOpen = ref(false);
const currentLang = ref(locale.value);

const props = defineProps({
  isMobileMenuOpen: {
    type: Boolean,
    default: false
  }
});

const isLoginPage = computed(() => {
  return route.path === '/login';
});

const isRegisterPage = computed(() => {
  return route.path === '/register';
});

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'fon', name: 'Fon' }
];

const currentLanguageName = computed(() => {
  return languages.find(lang => lang.code === currentLang.value)?.name || 'Français';
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// Surveiller les changements de route
watch(() => route.path, () => {
  closeMobileMenu();
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const emit = defineEmits(['close-menu', 'language-changed']);

const closeMobileMenu = () => {
  emit('close-menu');
};

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value;
};

const changeLanguage = (lang) => {
  currentLang.value = lang;
  locale.value = lang;
  isLanguageDropdownOpen.value = false;
  emit('language-changed', lang);
};
</script>

<style scoped>
.main-navbar {
  background: white;
  padding: 1.2rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 3rem;
  left: 0;
  right: 0;
  z-index: 40;
  width: 100%;
  transition: all 0.3s ease;
}

.main-navbar.auth-page {
  top: 0;
}

.main-navbar.scrolled {
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin-right: 3rem;
  position: relative;
  z-index: 40;
}

.logo a {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  transition: color 0.3s;
}

.logo a:hover {
  color: #3498db;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #3498db;
}

.nav-link.router-link-active {
  color: #3498db;
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3498db;
  transform: scaleX(1);
  transition: transform 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3498db;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.language-switcher {
  position: relative;
  margin-right: 1.5rem;
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

@media (max-width: 768px) {
  .main-navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 40;
    padding-top: 4rem;
  }

  .main-navbar.mobile-open {
    transform: translateX(0);
  }

  .container {
    flex-direction: column;
    padding: 2rem;
    height: auto;
    overflow-y: auto;
    max-width: 100%;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
  }

  .logo {
    display: none;
  }

  .nav-links {
    display: none;
  }

  .nav-content {
    flex-direction: column;
    padding: 1rem;
  }

  .nav-center {
    flex-direction: column;
    width: 100%;
    margin: 1rem 0;
  }

  .nav-right {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .language-switcher {
    width: 100%;
    margin-right: 0;
  }

  .language-btn {
    width: 100%;
    justify-content: space-between;
  }

  .language-dropdown {
    width: 100%;
  }

  .auth-buttons {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-login,
  .btn-register {
    width: 100%;
    text-align: center;
  }
}

/* Styles pour le menu mobile */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  padding: 0;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 100;
  overflow-y: auto;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  padding: 2rem 0;
  position: relative;
  top: 2rem;
}

.mobile-nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 1rem 1.5rem;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.mobile-language-switcher {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 2rem;
}

.mobile-language-btn {
  width: 100%;
  padding: 1rem;
  background: rgba(248, 249, 250, 0.6);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: #2c3e50;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-language-btn:hover {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.mobile-language-dropdown {
  margin-top: 0.8rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow: hidden;
  width: 100%;
}

.mobile-language-dropdown button {
  width: 100%;
  padding: 1rem;
  text-align: center;
  border: none;
  background: none;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-language-dropdown button:last-child {
  border-bottom: none;
}

.mobile-language-dropdown button:hover,
.mobile-language-dropdown button.active {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>