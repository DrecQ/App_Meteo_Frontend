<template>
  <div class="contact-page">
    <!-- Bannière améliorée -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>{{ $t('contact.title') }}</h1>
        <p>{{ $t('contact.subtitle') }}</p>
      </div>
    </div>

    <!-- Section Contact -->
    <div class="main-content">
      <div class="container">
        <div class="contact-grid">
          <!-- Informations de contact -->
          <div class="contact-info" data-aos="fade-right">
            <h2 class="section-title">{{ $t('contact.infoTitle') }}</h2>
            
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="info-content">
                <h3>{{ $t('contact.addressTitle') }}</h3>
                <p>{{ $t('contact.address') }}</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-content">
                <h3>{{ $t('contact.emailTitle') }}</h3>
                <p>{{ $t('contact.email') }}</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div class="info-content">
                <h3>{{ $t('contact.phoneTitle') }}</h3>
                <p>{{ $t('contact.phone') }}</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="info-content">
                <h3>{{ $t('contact.hoursTitle') }}</h3>
                <p>{{ $t('contact.hours') }}</p>
              </div>
            </div>
            
            <div class="social-links">
              <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
              <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            </div>
          </div>

          <!-- Formulaire de contact -->
          <div class="contact-form" data-aos="fade-left">
            <h2 class="section-title">{{ $t('contact.formTitle') }}</h2>
            <form @submit.prevent="submitForm" class="form-container">
              <div class="form-group">
                <label for="name">{{ $t('contact.form.nameLabel') }}</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name" 
                  :placeholder="$t('contact.form.namePlaceholder')" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="email">{{ $t('contact.form.emailLabel') }}</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  :placeholder="$t('contact.form.emailPlaceholder')" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="subject">{{ $t('contact.form.subjectLabel') }}</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject" 
                  :placeholder="$t('contact.form.subjectPlaceholder')" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="message">{{ $t('contact.form.messageLabel') }}</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  rows="5" 
                  :placeholder="$t('contact.form.messagePlaceholder')" 
                  required
                ></textarea>
              </div>
              
              <button type="submit" class="btn-submit">
                <i class="fas fa-paper-plane"></i> {{ $t('contact.form.send') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitForm = () => {
  console.log('Formulaire soumis:', form.value);
  // Réinitialiser le formulaire après soumission
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  // Ici vous ajouteriez l'appel API pour envoyer le formulaire
};
</script>

<style scoped>
.contact-page {
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
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-banner p {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Contenu principal */
.main-content {
  padding: 5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Grille de contact */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
}

/* Section Informations */
.contact-info {
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: #3498db;
}

.info-card {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.info-icon {
  width: 50px;
  height: 50px;
  background: #f1f9fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.info-content h3 {
  color: #2c3e50;
  margin-bottom: 0.3rem;
  font-size: 1.1rem;
}

.info-content p {
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 0.95rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.social-link:hover {
  background: #3498db;
  color: white;
  transform: translateY(-3px);
}

/* Section Formulaire */
.contact-form {
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 1rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.btn-submit {
  padding: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(41, 128, 185, 0.3);
}

/* Responsive */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-info {
    order: -1;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 3rem 0;
  }
  
  .page-banner h1 {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .contact-info,
  .contact-form {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-banner {
    padding: 3rem 0;
  }
  
  .page-banner h1 {
    font-size: 1.8rem;
  }
  
  .info-card {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-submit {
    width: 100%;
  }
}
</style>