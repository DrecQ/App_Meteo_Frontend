<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  bulletin: {
    type: Object,
    default: null
  }
});

const isMobile = ref(false);
const rainContainer = ref(null);

onMounted(() => {
  createRain();
});

const createRain = () => {
  if (!rainContainer.value) return;
  
  // Créer plusieurs gouttes de pluie
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement('div');
    drop.classList.add('raindrop');
    
    // Position aléatoire
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.top = `${Math.random() * 100}%`;
    
    // Animation delay aléatoire
    drop.style.animationDelay = `${Math.random()}s`;
    
    // Taille aléatoire
    const size = Math.random() * 3 + 1;
    drop.style.width = `${size}px`;
    drop.style.height = `${size * 10}px`;
    
    rainContainer.value.appendChild(drop);
  }
};
</script>

<template>
  <header class="hero-section">
    <div class="hero-overlay"></div>
    <!-- Animation météo -->
    <div class="weather-animation">
      <div class="sun"></div>
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      <div class="rain-container" ref="rainContainer"></div>
    </div>
    <div class="hero-content">
      <h1 class="hero-title">{{ $t('home.heroTitle1') }}</h1>
      <p class="hero-subtitle">{{ $t('home.heroSubtitle') }}</p>
      <div class="cta-buttons">
        <nuxt-link to="/courses" class="btn-primary">{{ $t('home.exploreCourses') }}</nuxt-link>
        <nuxt-link to="/register" class="btn-secondary">{{ $t('home.startNow') }}</nuxt-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-section {
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
}

.weather-animation {
  position: absolute;
  width: 100%;
  height: 100%;
}

.sun {
  position: absolute;
  top: 20%;
  right: 15%;
  width: 100px;
  height: 100px;
  background: #f9d71c;
  border-radius: 50%;
  box-shadow: 0 0 50px #f9d71c;
  animation: pulse 4s infinite alternate;
}

.cloud1 {
  top: 30%;
  left: 10%;
  animation: moveCloud 20s linear infinite;
}

.cloud2 {
  top: 25%;
  left: 50%;
  animation: moveCloud 25s linear infinite reverse;
}

.cloud {
  position: absolute;
  width: 150px;
  height: 60px;
  background: white;
  border-radius: 50px;
  opacity: 0.9;
}

.cloud:before, .cloud:after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud:before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 20px;
}

.cloud:after {
  width: 30px;
  height: 30px;
  top: -15px;
  right: 20px;
}

.rain {
  position: absolute;
  width: 2px;
  height: 10px;
  background: #a0c4e4;
  animation: rainFall 1s linear infinite;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
  color: #2c3e50;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background: linear-gradient(135deg, #3498db, #2c3e50, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-shadow: 0 2px 15px rgba(0,0,0,0.1);
  letter-spacing: -0.5px;
}

.hero-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  border-radius: 2px;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: #7f8c8d;
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.6;
  font-weight: 400;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fadeInUp 1s ease 0.6s forwards;
  opacity: 0;
}

.btn-primary, .btn-secondary {
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-secondary {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.btn-secondary:hover {
  background: rgba(52, 152, 219, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

@keyframes moveCloud {
  0% { transform: translateX(-200px); }
  100% { transform: translateX(calc(100vw + 200px)); }
}

@keyframes rainFall {
  0% { transform: translateY(0) translateX(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translateY(100px) translateX(10px); opacity: 0; }
}

@keyframes fadeInUp {
  0% { 
    opacity: 0;
    transform: translateY(20px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
}

.raindrop {
  position: absolute;
  background: #a0c4e4;
  animation: rainFall 1s linear infinite;
}

@keyframes rainFall {
  0% { transform: translateY(-100px) translateX(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translateY(100vh) translateX(10px); opacity: 0; }
}

.weather-bulletin {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-weight: 500;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  max-width: 650px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: left;
}

.weather-bulletin i {
  font-size: 1.8rem;
  opacity: 0.9;
}

.bulletin-title {
  font-weight: 700;
  display: block;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.bulletin-content {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}
</style>