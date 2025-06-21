<template>
  <div class="weather-page">
    <!-- Bannière conservée -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>Bulletin Météo</h1>
        <p>Les prévisions météorologiques en temps réel</p>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Rechercher une ville..." 
            v-model="searchQuery"
            class="search-input"
            @keyup.enter="searchWeather"
          />
          <button class="search-btn" @click="searchWeather">
            <i class="fas fa-search"></i>
            <span style="margin-left: 0.5em;">Rechercher</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section principale météo -->
    <div class="main-content">
      <div class="container">
        <!-- Carte météo principale -->
        <div class="weather-card" v-if="currentWeather">
          <div class="weather-header">
            <div class="location-container">
              <h2>{{ currentWeather.location }}</h2>
              <p class="weather-date">{{ currentWeather.date }}</p>
            </div>
            <div class="unit-toggle">
              <button 
                @click="selectedUnit = 'metric'"
                :class="{ active: selectedUnit === 'metric' }"
              >°C</button>
              <span>|</span>
              <button 
                @click="selectedUnit = 'imperial'"
                :class="{ active: selectedUnit === 'imperial' }"
              >°F</button>
            </div>
          </div>
          
          <div class="weather-main">
            <div class="weather-icon-temp">
              <div class="weather-icon" :class="currentWeather.icon">
                <i :class="weatherIcon"></i>
              </div>
              <div class="weather-temp">
                <span class="current-temp">{{ currentWeather.temp }}°{{ tempUnit }}</span>
                <span class="weather-desc">{{ currentWeather.description }}</span>
              </div>
            </div>
            
            <div class="weather-details">
              <div class="detail-item">
                <div class="detail-value">{{ currentWeather.feels_like }}°{{ tempUnit }}</div>
                <div class="detail-label">Ressenti</div>
              </div>
              <div class="detail-item">
                <div class="detail-value">{{ currentWeather.humidity }}%</div>
                <div class="detail-label">Humidité</div>
              </div>
              <div class="detail-item">
                <div class="detail-value">{{ currentWeather.wind_speed }} {{ speedUnit }}</div>
                <div class="detail-label">Vent</div>
              </div>
              <div class="detail-item">
                <div class="detail-value">{{ currentWeather.visibility }} km</div>
                <div class="detail-label">Visibilité</div>
              </div>
            </div>
          </div>
          
          <div class="sun-times">
            <div class="sun-item">
              <i class="fas fa-sunrise"></i>
              <span>{{ currentWeather.sunrise }}</span>
            </div>
            <div class="sun-item">
              <i class="fas fa-sunset"></i>
              <span>{{ currentWeather.sunset }}</span>
            </div>
          </div>
        </div>

        <!-- Onglets de navigation -->
        <div class="forecast-tabs">
          <button 
            @click="selectedForecastType = 'hourly'"
            :class="{ active: selectedForecastType === 'hourly' }"
          >
            <i class="fas fa-clock"></i> Horaires
          </button>
          <button 
            @click="selectedForecastType = 'daily'"
            :class="{ active: selectedForecastType === 'daily' }"
          >
            <i class="fas fa-calendar-alt"></i> 7 jours
          </button>
        </div>

        <!-- Prévisions horaires -->
        <div class="forecast-container" v-if="selectedForecastType === 'hourly' && hourlyForecast.length">
          <div class="hourly-forecast">
            <div class="hourly-item" v-for="(hour, index) in hourlyForecast" :key="index">
              <p class="hour-time">{{ hour.time }}</p>
              <div class="hour-icon">
                <i :class="hour.icon"></i>
              </div>
              <p class="hour-temp">{{ hour.temp }}°</p>
              <div class="hour-precipitation" v-if="hour.precipitation > 0">
                <i class="fas fa-tint"></i>
                <span>{{ hour.precipitation }}%</span>
              </div>
              <div class="hour-precipitation" v-else></div>
            </div>
          </div>
        </div>

        <!-- Prévisions quotidiennes -->
        <div class="forecast-container" v-if="selectedForecastType === 'daily' && dailyForecast.length">
          <div class="daily-forecast">
            <div class="daily-item" v-for="(day, index) in dailyForecast" :key="index">
              <p class="day-name">{{ day.day }}</p>
              <div class="day-icon">
                <i :class="day.icon"></i>
              </div>
              <div class="day-precipitation" v-if="day.precipitation > 0">
                {{ day.precipitation }}%
              </div>
              <div class="day-precipitation" v-else></div>
              <div class="day-temps">
                <span class="day-max">{{ day.max }}°</span>
                <span class="day-min">{{ day.min }}°</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Alertes météo -->
        <div class="weather-alerts" v-if="weatherAlerts.length">
          <div class="alert-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Alertes météo</h3>
          </div>
          <div class="alert-item" v-for="(alert, index) in weatherAlerts" :key="index">
            <p class="alert-title">{{ alert.title }}</p>
            <p class="alert-desc">{{ alert.description }}</p>
            <p class="alert-period">{{ alert.period }}</p>
          </div>
        </div>

        <!-- Section infos agriculteurs -->
        <div class="agri-info-section">
          <h2>Conseils agricoles du jour</h2>
          <ul>
            <li><strong>Préparation des sols :</strong> Profitez des pluies récentes pour labourer et enrichir vos champs.</li>
            <li><strong>Semis :</strong> Les conditions sont favorables pour semer le maïs, le manioc et l'arachide.</li>
            <li><strong>Traitements phytosanitaires :</strong> Surveillez l'apparition de maladies fongiques dues à l'humidité élevée.</li>
            <li><strong>Irrigation :</strong> Limitez l'irrigation en période de fortes pluies pour éviter l'asphyxie des racines.</li>
            <li><strong>Récolte :</strong> Privilégiez la récolte tôt le matin pour conserver la fraîcheur des produits.</li>
            <li><strong>Marché :</strong> Consultez les prix locaux avant de vendre vos récoltes pour optimiser vos revenus.</li>
          </ul>
          <p class="agri-note">Ces conseils sont donnés à titre indicatif et doivent être adaptés à votre région et à vos cultures spécifiques.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Données météo
const currentWeather = ref({
  location: "Cotonou, Bénin",
  date: "Lundi 15 mai 2023",
  temp: 30,
  feels_like: 33,
  description: "Partiellement nuageux",
  icon: "cloud",
  wind_speed: 15,
  humidity: 80,
  visibility: 8,
  pressure: 1010,
  sunrise: "06:45",
  sunset: "19:10"
});

const hourlyForecast = ref([
  { time: "15h", temp: 30, icon: "fas fa-cloud", precipitation: 10 },
  { time: "16h", temp: 31, icon: "fas fa-cloud-sun", precipitation: 20 },
  { time: "17h", temp: 31, icon: "fas fa-cloud-showers-heavy", precipitation: 40 },
  { time: "18h", temp: 29, icon: "fas fa-cloud-rain", precipitation: 60 },
  { time: "19h", temp: 28, icon: "fas fa-cloud", precipitation: 30 },
  { time: "20h", temp: 27, icon: "fas fa-cloud-moon", precipitation: 10 },
  { time: "21h", temp: 27, icon: "fas fa-cloud-moon", precipitation: 0 },
  { time: "22h", temp: 26, icon: "fas fa-cloud-moon", precipitation: 0 },
]);

const dailyForecast = ref([
  { day: "Aujourd'hui", max: 32, min: 26, icon: "fas fa-cloud", precipitation: 20 },
  { day: "Mar", max: 31, min: 25, icon: "fas fa-cloud-sun", precipitation: 30 },
  { day: "Mer", max: 30, min: 25, icon: "fas fa-cloud-showers-heavy", precipitation: 60 },
  { day: "Jeu", max: 29, min: 24, icon: "fas fa-cloud-rain", precipitation: 70 },
  { day: "Ven", max: 30, min: 25, icon: "fas fa-cloud-sun", precipitation: 40 },
  { day: "Sam", max: 31, min: 26, icon: "fas fa-sun", precipitation: 10 },
  { day: "Dim", max: 32, min: 27, icon: "fas fa-sun", precipitation: 0 },
]);

const weatherAlerts = ref([
  { 
    title: "Vigilance orange orages", 
    description: "Risque d'orages violents accompagnés de fortes pluies et de grêle", 
    period: "Valable de 18h à 23h" 
  }
]);

// Filtres
const searchQuery = ref('');
const selectedForecastType = ref('hourly');
const selectedUnit = ref('metric');

// Unités calculées
const tempUnit = computed(() => selectedUnit.value === 'metric' ? 'C' : 'F');
const speedUnit = computed(() => selectedUnit.value === 'metric' ? 'km/h' : 'mph');

// Icône météo calculée
const weatherIcon = computed(() => {
  const icons = {
    sun: 'fas fa-sun',
    cloud: 'fas fa-cloud',
    rain: 'fas fa-cloud-rain',
    thunder: 'fas fa-bolt',
    snow: 'fas fa-snowflake'
  };
  return icons[currentWeather.value.icon] || 'fas fa-question';
});

// Fonctions
function searchWeather() {
  if (searchQuery.value.trim()) {
    currentWeather.value.location = searchQuery.value;
    // Simulation de données météo aléatoires
    currentWeather.value.temp = Math.round(Math.random() * 15 + 10);
    currentWeather.value.icon = ['sun', 'cloud', 'rain'][Math.floor(Math.random() * 3)];
    currentWeather.value.description = ['Ensoleillé', 'Nuageux', 'Pluvieux'][Math.floor(Math.random() * 3)];
  }
}
</script>

<style scoped>
.weather-page {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2c3e50;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Bannière */
.page-banner {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 4rem 0 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/weather-pattern.png');
  background-size: 300px;
  opacity: 0.05;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-banner p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

/* Barre de recherche harmonisée */
.search-bar {
  display: flex;
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #95a5a6;
}

.search-btn {
  padding: 1rem 1.8rem;
  background: #2980b9;
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-btn:hover {
  background: #1a5276;
}

/* Contenu principal */
.main-content {
  padding: 2rem 0 4rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Carte météo principale */
.weather-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.weather-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  z-index: -1;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.location-container h2 {
  font-size: 1.8rem;
  margin: 0;
  color: #1e293b;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.weather-date {
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 0.3rem;
  font-weight: 400;
}

.unit-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 0.25rem;
}

.unit-toggle button {
  border: none;
  background: none;
  padding: 0.35rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 15px;
  transition: all 0.2s;
  font-weight: 500;
}

.unit-toggle button.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.unit-toggle span {
  color: #cbd5e1;
  font-size: 0.9rem;
}

.weather-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.weather-icon-temp {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.weather-icon {
  font-size: 3.5rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
}

.weather-icon.sun {
  color: #f59e0b;
}

.weather-icon.cloud {
  color: #94a3b8;
}

.weather-icon.rain {
  color: #60a5fa;
}

.weather-temp {
  text-align: left;
}

.current-temp {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1;
  color: #1e293b;
  display: block;
  letter-spacing: -1px;
}

.weather-desc {
  font-size: 1.2rem;
  color: #64748b;
  text-transform: capitalize;
  margin-top: 0.5rem;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.detail-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.detail-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.detail-label {
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sun-times {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.sun-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

.sun-item i {
  color: #f59e0b;
}

/* Onglets de navigation */
.forecast-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
}

.forecast-tabs button {
  flex: 1;
  border: none;
  background: none;
  padding: 0.75rem;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 500;
}

.forecast-tabs button.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.forecast-tabs button i {
  font-size: 0.9rem;
}

/* Prévisions */
.forecast-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 2rem;
}

.hourly-forecast {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.5rem 0;
  scrollbar-width: thin;
}

.hourly-item {
  min-width: 70px;
  text-align: center;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hour-time {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.hour-icon {
  font-size: 1.25rem;
  color: #3b82f6;
}

.hour-temp {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.hour-precipitation {
  font-size: 0.7rem;
  color: #60a5fa;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  height: 1rem;
}

.daily-forecast {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.daily-item {
  padding: 1rem;
  text-align: center;
  border-radius: 12px;
  transition: all 0.2s;
}

.daily-item:hover {
  background: #f8fafc;
}

.day-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.day-icon {
  font-size: 1.5rem;
  color: #3b82f6;
  margin: 0.5rem 0;
}

.day-precipitation {
  font-size: 0.75rem;
  color: #60a5fa;
  height: 1.25rem;
  margin-bottom: 0.5rem;
}

.day-temps {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.day-max {
  font-weight: 600;
  color: #1e293b;
}

.day-min {
  color: #94a3b8;
}

/* Alertes météo */
.weather-alerts {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border-left: 4px solid #ef4444;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.alert-header h3 {
  font-size: 1.2rem;
  color: #ef4444;
  margin: 0;
}

.alert-header i {
  color: #ef4444;
  font-size: 1.2rem;
}

.alert-item {
  padding: 1rem 0;
  border-bottom: 1px solid #fee2e2;
}

.alert-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.alert-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.alert-desc {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.alert-period {
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 500;
}

/* Section infos agriculteurs */
.agri-info-section {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  margin: 2.5rem 0 0 0;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.06);
}
.agri-info-section h2 {
  color: #2563eb;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}
.agri-info-section ul {
  list-style: disc inside;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1rem;
}
.agri-info-section li {
  margin-bottom: 0.5rem;
}
.agri-note {
  font-size: 0.95rem;
  color: #64748b;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .page-banner {
    padding: 3rem 0 2rem;
  }
  
  .page-banner h1 {
    font-size: 2rem;
  }
  
  .search-bar {
    flex-direction: column;
    background: transparent;
    box-shadow: none;
    gap: 1rem;
  }
  
  .search-input {
    border-radius: 30px;
    padding: 0.9rem 1.5rem;
  }
  
  .search-btn {
    width: 100%;
    justify-content: center;
    border-radius: 30px;
  }
  
  .weather-card {
    padding: 1.5rem;
  }
  
  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .current-temp {
    font-size: 3rem;
  }
  
  .location-container h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-banner {
    padding: 2.5rem 0 1.5rem;
  }
  
  .page-banner h1 {
    font-size: 1.8rem;
  }
  
  .page-banner p {
    font-size: 1rem;
  }
  
  .search-bar {
    max-width: 90%;
  }
  
  .weather-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .unit-toggle {
    align-self: flex-end;
  }
  
  .weather-icon-temp {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .weather-temp {
    text-align: center;
  }
  
  .daily-forecast {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>