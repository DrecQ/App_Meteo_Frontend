<template>
    <section class="why-choose-us">
      <div class="container">
        <!-- Titre et sous-titre avec les mêmes styles que CourseTypes -->
        <h2 class="section-title">{{ $t('home.whyTitle') }}</h2>
        <p class="section-subtitle">{{ $t('home.whySubtitle') }}</p>
        
        <!-- Grille de raisons - structure similaire à courses-grid -->
        <div class="reasons-grid">
          <div class="reason-card" v-for="(reason, index) in reasons" :key="index">
            <!-- Conteneur d'icône avec fond coloré -->
            <div class="reason-icon" :style="{ backgroundColor: reason.color }">
              <i :class="reason.icon"></i>
            </div>
            
            <!-- Contenu texte - même structure que course-content -->
            <div class="reason-content">
              <h3 class="reason-title">{{ $t(`home.why.reasons.${index}.title`) }}</h3>
              <p class="reason-description">{{ $t(`home.why.reasons.${index}.desc`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const reasons = [
    { icon: 'fas fa-graduation-cap', color: '#3498db' },
    { icon: 'fas fa-chalkboard-teacher', color: '#e74c3c' },
    { icon: 'fas fa-laptop-code', color: '#2ecc71' },
    { icon: 'fas fa-clock', color: '#f39c12' }
  ];
  </script>
  
  <style scoped>
  /* Styles de base identiques à CourseTypes */
  .why-choose-us {
    padding: 5rem 0;
    background: #f9f9f9;
    font-family: 'Arial', sans-serif; /* Police de secours */
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  /* Titres avec les mêmes styles que CourseTypes */
  .section-title {
    text-align: center;
    font-size: 2.8rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    font-weight: 700;
    background: linear-gradient(to right, #3498db, #2c3e50);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #3498db, #2c3e50);
    border-radius: 3px;
  }
  
  .section-subtitle {
    text-align: center;
    color: #7f8c8d;
    max-width: 700px;
    margin: 0 auto 4rem;
    font-size: 1.2rem;
    line-height: 1.7;
  }
  
  /* Grille similaire à courses-grid */
  .reasons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .reason-card {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    text-align: center;
  }
  
  .reason-card:hover {
    transform: translateY(-10px);
  }
  
  /* Icône avec styles garantissant la visibilité */
  .reason-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
  }
  
  /* Contenu texte - styles explicites */
  .reason-content {
    margin-top: 1.5rem;
  }
  
  .reason-title {
    color: #2c3e50;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  .reason-description {
    color: #7f8c8d;
    line-height: 1.6;
    margin: 0;
  }
  
  /* Responsive identique à CourseTypes */
  @media (max-width: 768px) {
    .why-choose-us {
      padding: 3rem 0;
    }
    
    .section-title {
      font-size: 2.2rem;
    }
    
    .section-subtitle {
      font-size: 1rem;
      margin-bottom: 3rem;
    }
    
    .reasons-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      padding: 0 1rem;
    }
    
    .reason-card {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }
  }
  </style>