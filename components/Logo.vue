<template>
  <div class="logo">
    <div class="logo-icon">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Cercle extérieur -->
        <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2"/>
        <!-- Rayons du soleil -->
        <path d="M20 2v4M20 34v4M2 20h4M34 20h4M6.5 6.5l2.8 2.8M30.7 30.7l2.8 2.8M6.5 33.5l2.8-2.8M30.7 9.3l2.8-2.8" stroke="currentColor" stroke-width="2"/>
        <!-- Nuage -->
        <path d="M12 24c0-3.3 2.7-6 6-6 0.5 0 1 0.1 1.5 0.2C20.8 15.6 24.2 12 28 12c4.4 0 8 3.6 8 8 0 0.3 0 0.6-0.1 0.9C37.3 22.3 40 25.3 40 29c0 4.4-3.6 8-8 8H20c-4.4 0-8-3.6-8-8z" fill="currentColor"/>
      </svg>
    </div>
    <div class="logo-text">
      <span class="text-primary">METEO</span>
      <span class="text-secondary">-BENIN</span>
    </div>
  </div>
</template>

<script setup>
// Pas besoin de logique pour le moment
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-icon {
  color: #3498db;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.text-primary {
  color: #3498db;
}

.text-secondary {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 1.3rem;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
  }
}
</style> 