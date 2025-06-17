<template>
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Questions Fréquentes</h2>
          <p class="section-subtitle">Trouvez rapidement des réponses à vos questions</p>
          
          <!-- Barre de progression -->
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            <span class="progress-text">{{ answeredCount }} / {{ faqItems.length }} questions explorées</span>
          </div>
        </div>
  
        <div class="faq-grid">
          <div 
            v-for="(item, index) in faqItems" 
            :key="index" 
            class="faq-item" 
            :class="{ 'is-open': item.isOpen, 'answered': item.isOpen }"
            @click="toggleFaq(index)"
          >
            <div class="faq-question" :aria-expanded="item.isOpen">
              <div class="question-content">
                <div class="question-number">0{{ index + 1 }}</div>
                <h3 class="question-text">{{ item.question }}</h3>
                <div class="status-indicator" :class="{ 'visible': item.isOpen }">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="icon-wrapper">
                <div class="icon-circle">
                  <svg class="icon" viewBox="0 0 24 24" :class="{ 'rotate-180': item.isOpen }">
                    <path d="M19 9l-7 7-7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="faq-answer" :class="{ 'open': item.isOpen }" :aria-hidden="!item.isOpen">
              <div class="answer-content">
                <p>{{ item.answer }}</p>
                <button v-if="item.link" class="learn-more-btn">
                  En savoir plus
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    sectionTitle: {
      type: String,
      default: "Questions Fréquentes"
    },
    sectionDescription: {
      type: String,
      default: "Trouvez des réponses rapides à vos interrogations"
    },
    items: {
      type: Array,
      default: () => [
        {
          question: "Comment accéder aux cours ?",
          answer: "Après inscription, vous recevez un accès immédiat à votre espace membre avec toutes les ressources disponibles.",
          link: true
        },
        {
          question: "Puis-je suivre les cours sur mobile ?",
          answer: "Oui, notre plateforme est entièrement responsive et s'adapte à tous les appareils.",
          link: false
        },
        {
          question: "Y a-t-il un certificat à la fin ?",
          answer: "Tous nos parcours complets délivrent un certificat de réussite après validation des acquis.",
          link: true
        },
        {
          question: "Quel est le rythme recommandé ?",
          answer: "Nous recommandons 2-3 cours par semaine pour une progression optimale, à votre rythme.",
          link: false
        },
        {
          question: "Comment annuler mon abonnement ?",
          answer: "Vous pouvez gérer votre abonnement à tout moment dans la section 'Mon compte'.",
          link: true
        }
      ]
    }
  });
  
  const faqItems = ref(props.items.map(item => ({ ...item, isOpen: false })));
  
  const answeredCount = computed(() => {
    return faqItems.value.filter(item => item.isOpen).length;
  });
  
  const progress = computed(() => {
    return (answeredCount.value / faqItems.value.length) * 100;
  });
  
  const toggleFaq = (index) => {
    faqItems.value = faqItems.value.map((item, i) => ({
      ...item,
      isOpen: i === index ? !item.isOpen : item.isOpen
    }));
  };
  </script>
  
  <style scoped>
  .faq-section {
    padding: 5rem 0;
    background: linear-gradient(to bottom, #f8f9ff 0%, #ffffff 100%);
    position: relative;
    overflow: hidden;
  }
  
  .container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 2.5rem;
    color: #1a1a2e;
    margin-bottom: 1rem;
    font-weight: 700;
    position: relative;
    display: inline-block;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #4e6bff, #6bcb77);
    border-radius: 2px;
  }
  
  .section-subtitle {
    font-size: 1.2rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  /* Barre de progression */
  .progress-container {
    width: 100%;
    max-width: 500px;
    margin: 2rem auto 0;
    background: #f0f2ff;
    border-radius: 50px;
    height: 8px;
    position: relative;
    overflow: hidden;
  }
  
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(to right, #4e6bff, #6bcb77);
    border-radius: 50px;
    transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  }
  
  .progress-text {
    display: block;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  /* Grille FAQ */
  .faq-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .faq-item {
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    border: 1px solid rgba(0, 0, 0, 0.03);
    overflow: hidden;
    cursor: pointer;
    position: relative;
  }
  
  .faq-item.is-open {
    box-shadow: 0 10px 30px rgba(78, 107, 255, 0.1);
    border-color: rgba(78, 107, 255, 0.2);
  }
  
  .faq-item.answered {
    border-left: 4px solid #6bcb77;
  }
  
  .faq-question {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s ease;
    position: relative;
  }
  
  .question-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
  }
  
  .question-number {
    font-size: 1.2rem;
    font-weight: 700;
    color: rgba(78, 107, 255, 0.3);
    min-width: 30px;
    transition: color 0.3s ease;
  }
  
  .faq-item.is-open .question-number {
    color: #6bcb77;
  }
  
  .question-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0;
    transition: color 0.3s ease;
    flex: 1;
  }
  
  .status-indicator {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6bcb77;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .status-indicator.visible {
    opacity: 1;
  }
  
  .faq-item:hover .question-text {
    color: #4e6bff;
  }
  
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(78, 107, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .faq-item:hover .icon-circle {
    background-color: rgba(78, 107, 255, 0.2);
  }
  
  .faq-item.is-open .icon-circle {
    background-color: #4e6bff;
  }
  
  .icon {
    width: 16px;
    height: 16px;
    color: #4e6bff;
    transition: all 0.3s ease;
  }
  
  .faq-item.is-open .icon {
    color: white;
    transform: rotate(180deg);
  }
  
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }
  
  .faq-answer.open {
    max-height: 500px;
  }
  
  .answer-content {
    padding: 0 1.5rem 1.5rem 5rem;
  }
  
  .answer-content p {
    color: #6b7280;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  
  .learn-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #4e6bff;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;
    transition: all 0.3s ease;
  }
  
  .learn-more-btn:hover {
    gap: 0.8rem;
    text-decoration: underline;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .faq-section {
      padding: 3rem 1rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .question-content {
      gap: 1rem;
    }
    
    .answer-content {
      padding: 0 1.5rem 1.5rem 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .section-title {
      font-size: 1.8rem;
    }
    
    .section-subtitle {
      font-size: 1rem;
    }
    
    .faq-question {
      padding: 1.25rem;
    }
    
    .question-number {
      font-size: 1rem;
      min-width: 25px;
    }
    
    .question-text {
      font-size: 1rem;
    }
    
    .progress-text {
      font-size: 0.8rem;
    }
  }
  </style>