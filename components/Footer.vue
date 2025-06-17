<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Section Newsletter améliorée -->
      <div class="newsletter-section">
        <h3 class="newsletter-title">Restez informé</h3>
        <p class="newsletter-text">Abonnez-vous pour recevoir nos actualités et offres</p>
        <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Votre email" 
            required
            class="newsletter-input"
          >
          <button type="submit" class="btn-subscribe">
            <i class="fas fa-paper-plane"></i> S'inscrire
          </button>
        </form>
      </div>

      <!-- Grille réorganisée -->
      <div class="footer-grid">
        <div class="footer-column">
          <h4 class="column-title">Navigation</h4>
          <ul class="footer-links">
            <li><nuxt-link to="/">Accueil</nuxt-link></li>
            <li><nuxt-link to="/courses">Cours</nuxt-link></li>
            <li><nuxt-link to="/pricing">Tarifs</nuxt-link></li>
            <li><nuxt-link to="/contact">Contact</nuxt-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-title">Ressources</h4>
          <ul class="footer-links">
            <li><nuxt-link to="/blog">Blog</nuxt-link></li>
            <li><nuxt-link to="/faq">FAQ</nuxt-link></li>
            <li><nuxt-link to="/guides">Guides</nuxt-link></li>
            <li><nuxt-link to="/webinars">Webinaires</nuxt-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-title">Légal</h4>
          <ul class="footer-links">
            <li><nuxt-link to="/privacy">Confidentialité</nuxt-link></li>
            <li><nuxt-link to="/terms">Conditions</nuxt-link></li>
            <li><nuxt-link to="/cookies">Cookies</nuxt-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-title">Contact</h4>
          <div class="contact-info">
            <p><i class="fas fa-envelope"></i> contact@meteo-benin.com</p>
            <p><i class="fas fa-phone"></i> +33 1 23 45 67 89</p>
          </div>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright simplifié -->
    <div class="footer-bottom">
      <p class="copyright">&copy; {{ new Date().getFullYear() }} EduMétéo - Tous droits réservés</p>
      <div class="trust-icons">
        <i class="fas fa-shield-alt" title="Sécurité des données"></i>
        <i class="fas fa-lock" title="Paiements sécurisés"></i>
      </div>
    </div>
  </footer>
</template>

<script setup>
const email = ref('');

const subscribeNewsletter = () => {
  console.log('Email submitted:', email.value);
  email.value = '';
  // Ajouter ici l'appel API pour l'inscription
};
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 3rem 0 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Newsletter Section */
.newsletter-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
}

.newsletter-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: 600;
}

.newsletter-text {
  color: #bdc3c7;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 5px;
  background: rgba(255,255,255,0.9);
  font-size: 1rem;
}

.btn-subscribe {
  padding: 0 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-subscribe:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* Footer Grid */
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-column {
  padding: 0 1rem;
}

.column-title {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.column-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: #3498db;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.7rem;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: white;
  text-decoration: underline;
}

.contact-info {
  margin-bottom: 1.5rem;
  color: #bdc3c7;
  font-size: 0.95rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
}

.social-links a:hover {
  background: #3498db;
  transform: translateY(-2px);
}

/* Footer Bottom */
.footer-bottom {
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.copyright {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
}

.trust-icons {
  display: flex;
  gap: 1.5rem;
  color: #bdc3c7;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 0;
  }
  
  .newsletter-section {
    padding: 1.5rem;
  }
  
  .newsletter-form {
    flex-direction: column;
    padding: 0 1rem;
  }
  
  .newsletter-input {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .btn-subscribe {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1rem;
  }
  
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .column-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .column-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>