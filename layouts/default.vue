<template>
  <div class="app-container">
    <!-- Double navbar -->
    <header>
      <TopNavbar @toggle-menu="toggleMobileMenu" />
      <MainNavbar :is-mobile-menu-open="isMobileMenuOpen" @close-menu="closeMobileMenu" />
    </header>

    <!-- Contenu spécifique à chaque page -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = (value) => {
  isMobileMenuOpen.value = value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style>
/* Styles de base */
.app-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: 7rem; /* Hauteur de TopNavbar (3rem) + MainNavbar (4rem) */
}

/* Ajustements pour le menu mobile */
@media (max-width: 768px) {
  header {
    position: relative;
    z-index: 100;
  }
}
</style>