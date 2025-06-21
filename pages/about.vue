<template>
  <div class="about-page">
    <!-- Bannière améliorée -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>{{ $t('about.title') }}</h1>
        <p>{{ $t('about.subtitle') }}</p>
      </div>
    </div>

    <!-- Section Notre Mission -->
    <div class="mission-section">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-text">
            <h2 class="section-title">{{ $t('about.missionTitle') }}</h2>
            <p class="mission-description">
              {{ $t('about.missionDesc') }}
            </p>
            <div class="mission-stats">
              <div class="stat-item">
                <div class="stat-value">50+</div>
                <div class="stat-label">{{ $t('about.stats.courses') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">10K+</div>
                <div class="stat-label">{{ $t('about.stats.students') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">20+</div>
                <div class="stat-label">{{ $t('about.stats.experts') }}</div>
              </div>
            </div>
          </div>
          <div class="mission-visual">
            <div class="visual-element">
              <i class="fas fa-cloud-sun"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Nos Valeurs -->
    <div class="values-section">
      <div class="container">
        <h2 class="section-title">{{ $t('about.valuesTitle') }}</h2>
        <p class="section-subtitle">{{ $t('about.valuesSubtitle') }}</p>
        <div class="values-grid">
          <div class="value-card" data-aos="fade-up">
            <div class="value-icon" style="background-color: #3498db;">
              <i class="fas fa-star"></i>
            </div>
            <h3>{{ $t('about.values.0.title') }}</h3>
            <p>{{ $t('about.values.0.desc') }}</p>
          </div>
          <div class="value-card" data-aos="fade-up" data-aos-delay="100">
            <div class="value-icon" style="background-color: #2ecc71;">
              <i class="fas fa-lightbulb"></i>
            </div>
            <h3>{{ $t('about.values.1.title') }}</h3>
            <p>{{ $t('about.values.1.desc') }}</p>
          </div>
          <div class="value-card" data-aos="fade-up" data-aos-delay="200">
            <div class="value-icon" style="background-color: #f39c12;">
              <i class="fas fa-globe-africa"></i>
            </div>
            <h3>{{ $t('about.values.2.title') }}</h3>
            <p>{{ $t('about.values.2.desc') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Notre Équipe -->
    <div class="team-section">
      <div class="container">
        <h2 class="section-title">{{ $t('about.teamTitle') }}</h2>
        <p class="section-subtitle">{{ $t('about.teamSubtitle') }}</p>
        <div class="team-grid">
          <div class="team-member" data-aos="fade-up">
            <div class="member-avatar" style="background-color: #3498db;">ML</div>
            <h3>Marie Laurent</h3>
            <p class="member-title">{{ $t('about.team.0.role') }}</p>
            <p class="member-bio">{{ $t('about.team.0.bio') }}</p>
            <div class="member-social">
              <a href="#"><i class="fab fa-linkedin"></i></a>
              <a href="#"><i class="fas fa-envelope"></i></a>
            </div>
          </div>
          <div class="team-member" data-aos="fade-up" data-aos-delay="100">
            <div class="member-avatar" style="background-color: #e74c3c;">PM</div>
            <h3>Pierre Martin</h3>
            <p class="member-title">{{ $t('about.team.1.role') }}</p>
            <p class="member-bio">{{ $t('about.team.1.bio') }}</p>
            <div class="member-social">
              <a href="#"><i class="fab fa-linkedin"></i></a>
              <a href="#"><i class="fas fa-envelope"></i></a>
            </div>
          </div>
          <div class="team-member" data-aos="fade-up" data-aos-delay="200">
            <div class="member-avatar" style="background-color: #9b59b6;">SD</div>
            <h3>Sophie Dubois</h3>
            <p class="member-title">{{ $t('about.team.2.role') }}</p>
            <p class="member-bio">{{ $t('about.team.2.bio') }}</p>
            <div class="member-social">
              <a href="#"><i class="fab fa-linkedin"></i></a>
              <a href="#"><i class="fas fa-envelope"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { onMounted } from 'vue';

onMounted(() => {
  if (process.client && typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }
});
</script>

<style scoped>
.about-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

/* Bannière */
.page-banner {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 5rem 0;
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
  font-size: 2.8rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-banner p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Sections communes */
.section-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: #3498db;
}

.section-subtitle {
  text-align: center;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Section Mission */
.mission-section {
  padding: 5rem 0;
  background: white;
}

.mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.mission-text {
  padding-right: 2rem;
}

.mission-description {
  color: #7f8c8d;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.mission-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.mission-visual {
  display: flex;
  justify-content: center;
}

.visual-element {
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2c3e50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 8rem;
  box-shadow: 0 20px 40px rgba(52, 152, 219, 0.2);
}

/* Section Valeurs */
.values-section {
  padding: 5rem 0;
  background: #f8f9fa;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.value-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
}

.value-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.value-card p {
  color: #7f8c8d;
  line-height: 1.7;
}

/* Section Équipe */
.team-section {
  padding: 5rem 0;
  background: white;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.team-member {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.member-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.team-member h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.member-title {
  color: #3498db;
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.member-bio {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.member-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.member-social a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.member-social a:hover {
  background: #3498db;
  color: white;
}

/* Responsive */
@media (max-width: 992px) {
  .mission-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .mission-text {
    padding-right: 0;
    text-align: center;
  }
  
  .mission-stats {
    max-width: 500px;
    margin: 3rem auto 0;
  }
  
  .visual-element {
    width: 250px;
    height: 250px;
    font-size: 6rem;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .page-banner {
    padding: 4rem 0;
  }
  
  .page-banner h1 {
    font-size: 2.2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .mission-stats {
    grid-template-columns: 1fr;
    max-width: 300px;
  }
  
  .value-card, .team-member {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-banner h1 {
    font-size: 2rem;
  }
  
  .page-banner p {
    font-size: 1rem;
  }
  
  .visual-element {
    width: 200px;
    height: 200px;
    font-size: 4rem;
  }
}
</style>