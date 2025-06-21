<template>
    <section class="course-types">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">{{ $t('home.typesTitle') }}</h2>
        <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          {{ $t('home.typesSubtitle') }}
        </p>
        
        <div class="courses-grid">
          <div 
            class="course-card" 
            v-for="(course, index) in courses" 
            :key="index"
            data-aos="fade-up"
            :data-aos-delay="150 + (index * 100)"
            @mouseenter="hoverCard(index)"
            @mouseleave="hoverCard(null)"
          >
            <div class="course-image-container">
              <div 
                class="course-image" 
                :style="{ backgroundImage: `url(${course.image})` }"
                :class="{ 'image-hover': hoverIndex === index }"
              ></div>
              <div class="course-badge" :style="{ backgroundColor: course.badgeColor }">
                {{ $t(`home.types.${index}.badge`) }}
              </div>
            </div>
            <div class="course-content">
              <h3>{{ $t(`home.types.${index}.title`) }}</h3>
              <p>{{ $t(`home.types.${index}.desc`) }}</p>
              <div class="course-meta">
                <span><i :class="course.durationIcon"></i> {{ course.duration }}</span>
                <span><i :class="course.studentsIcon"></i> {{ course.students }}</span>
                <span class="difficulty" :style="{ color: course.difficultyColor }">
                  <i :class="course.difficultyIcon"></i> {{ course.difficulty }}
                </span>
              </div>
              <div class="course-progress" v-if="course.progress">
                <div 
                  class="progress-bar" 
                  :style="{ width: course.progress + '%', backgroundColor: course.badgeColor }"
                ></div>
                <span>{{ course.progress }}% {{ $t('home.types.progress') }}</span>
              </div>
              <nuxt-link 
                :to="course.link" 
                class="btn-course-action"
                :style="{ backgroundColor: course.buttonColor }"
              >
                {{ $t(`home.types.${index}.button`) }}
              </nuxt-link>
            </div>
          </div>
        </div>
        
        <div class="text-center" data-aos="fade-up" data-aos-delay="450">
          <nuxt-link to="/courses" class="btn-view-all">
            {{ $t('home.types.viewAll') }} <i class="fas fa-arrow-right"></i>
          </nuxt-link>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const hoverIndex = ref(null);

  const courses = ref([
    {
      id: 1,
      title: 'Cours Vidéo',
      description: 'Apprenez à travers des vidéos explicatives et des tutoriels détaillés.',
      image: '/images/video-course.jpg',
      buttonText: 'Découvrir',
      buttonColor: '#3498db',
      badgeText: 'Populaire',
      badgeColor: '#3498db',
      isHovered: false,
      link: '/courses'
    },
    {
      id: 2,
      title: 'Cours Interactifs',
      description: 'Participez à des sessions en direct et interagissez avec les enseignants.',
      image: '/images/interactive-course.jpg',
      buttonText: 'Découvrir',
      buttonColor: '#2ecc71',
      badgeText: 'En Direct',
      badgeColor: '#2ecc71',
      isHovered: false,
      link: '/courses'
    },
    {
      id: 3,
      title: 'Quiz et Exercices',
      description: 'Testez vos connaissances avec des quiz et des exercices pratiques.',
      image: '/images/quiz-course.jpg',
      buttonText: 'Découvrir',
      buttonColor: '#e74c3c',
      badgeText: 'Nouveau',
      badgeColor: '#e74c3c',
      isHovered: false,
      link: '/courses'
    },
    {
      id: 4,
      title: 'Ressources Pédagogiques',
      description: 'Accédez à une bibliothèque complète de ressources d\'apprentissage.',
      image: '/images/resources-course.jpg',
      buttonText: 'Découvrir',
      buttonColor: '#9b59b6',
      badgeText: 'Essentiel',
      badgeColor: '#9b59b6',
      isHovered: false,
      link: '/courses'
    }
  ]);

  const hoverCard = (index) => {
    hoverIndex.value = index;
  };

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
  .course-types {
    padding: 6rem 0;
    background: linear-gradient(to bottom, #f9f9f9 0%, #ffffff 100%);
    position: relative;
    overflow: hidden;
  }
  
  .course-types::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('~/assets/images/pattern.png');
    background-size: 300px;
    opacity: 0.03;
    z-index: 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    position: relative;
    z-index: 1;
  }
  
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
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .course-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    position: relative;
    transform: translateY(0);
  }
  
  .course-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  }
  
  .course-image-container {
    position: relative;
    height: 160px;
    overflow: hidden;
  }
  
  .course-image {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    transition: all 0.5s ease;
    filter: brightness(0.95);
  }
  
  .image-hover {
    transform: scale(1.05);
    filter: brightness(1);
  }
  
  .course-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    color: white;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
    background-color: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .course-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.2);
  }
  
  .course-content {
    padding: 1.2rem;
  }
  
  .course-content h3 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }
  
  .course-content p {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
    min-height: 50px;
  }
  
  .course-meta {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
    font-size: 0.8rem;
  }
  
  .course-meta span {
    display: flex;
    align-items: center;
    color: #95a5a6;
  }
  
  .course-meta i {
    margin-right: 0.4rem;
    font-size: 0.9rem;
  }
  
  .difficulty {
    font-weight: 600;
  }
  
  .course-progress {
    margin-bottom: 1.5rem;
  }
  
  .progress-bar {
    height: 6px;
    border-radius: 3px;
    margin-bottom: 0.5rem;
    transition: width 1s ease;
  }
  
  .course-progress span {
    font-size: 0.8rem;
    color: #7f8c8d;
  }
  
  .btn-course-action {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    text-align: center;
    width: 100%;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  
  .btn-course-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    filter: brightness(1.1);
  }
  
  .btn-view-all {
    display: inline-flex;
    align-items: center;
    padding: 0.9rem 2.5rem;
    background: linear-gradient(to right, #3498db, #2c3e50);
    color: white;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 10px 20px rgba(52, 152, 219, 0.2);
  }
  
  .btn-view-all i {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  .btn-view-all:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(52, 152, 219, 0.3);
  }
  
  .btn-view-all:hover i {
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    .course-types {
      padding: 4rem 0;
    }
    
    .section-title {
      font-size: 2.2rem;
    }
    
    .section-subtitle {
      font-size: 1rem;
      margin-bottom: 3rem;
    }
    
    .courses-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      padding: 0 1rem;
    }
    
    .course-card {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .course-card {
    animation: fadeIn 0.6s ease forwards;
    opacity: 0;
  }
  
  .course-card:nth-child(1) { animation-delay: 0.1s; }
  .course-card:nth-child(2) { animation-delay: 0.2s; }
  .course-card:nth-child(3) { animation-delay: 0.3s; }
  .course-card:nth-child(4) { animation-delay: 0.4s; }
  </style>