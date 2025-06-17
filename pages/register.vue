<template>
  <div class="register-page">
    <!-- Bannière météo décorative -->
    <div class="weather-banner">
      <div class="weather-icon sun"></div>
      <div class="weather-icon cloud"></div>
    </div>

    <div class="register-container">
      <!-- En-tête avec logo -->
      <div class="register-header">
        <div class="logo">
          <i class="fas fa-cloud-sun-rain"></i>
          <NuxtLink to="/" class="logo-link">METEO-BENIN</NuxtLink>
        </div>
        <h1>Inscription</h1>
        <p>Créez votre compte pour commencer à apprendre</p>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="register-form">
        <!-- Nom et Prénom -->
        <div class="name-fields">
          <div class="form-group">
            <label for="prenom">Prénom</label>
            <div class="input-group">
              <i class="fas fa-user input-icon"></i>
              <input
                type="text"
                id="prenom"
                v-model="form.prenom"
                placeholder="Votre prénom"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="nom">Nom</label>
            <div class="input-group">
              <i class="fas fa-user input-icon"></i>
              <input
                type="text"
                id="nom"
                v-model="form.nom"
                placeholder="Votre nom"
                required
              >
            </div>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Adresse email</label>
          <div class="input-group">
            <i class="fas fa-envelope input-icon"></i>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="votre@email.com"
              required
            >
          </div>
        </div>

        <!-- Rôle -->
        <div class="form-group">
          <label>Vous êtes :</label>
          <div class="role-options">
            <label class="role-option">
              <input 
                type="radio" 
                v-model="form.role" 
                value="learner" 
                checked
              >
              <div class="role-card">
                <i class="fas fa-graduation-cap"></i>
                <span>Apprenant</span>
                <p>Je veux apprendre la météorologie</p>
              </div>
            </label>

            <label class="role-option">
              <input 
                type="radio" 
                v-model="form.role" 
                value="farmer"
              >
              <div class="role-card">
                <i class="fas fa-tractor"></i>
                <span>Agriculteur</span>
                <p>J'ai besoin de données météo pour mon activité</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-group">
            <i class="fas fa-lock input-icon"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              placeholder="Créez un mot de passe"
              required
              minlength="8"
            >
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div class="password-strength" :class="passwordStrengthClass">
            Sécurité du mot de passe : {{ passwordStrength }}
          </div>
        </div>

        <!-- Confirmation mot de passe -->
        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <div class="input-group">
            <i class="fas fa-lock input-icon"></i>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="form.confirmPassword"
              placeholder="Confirmez votre mot de passe"
              required
            >
            <button 
              type="button" 
              class="toggle-password" 
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div v-if="form.password && form.confirmPassword && !passwordsMatch" class="error-message">
            Les mots de passe ne correspondent pas
          </div>
        </div>

        <!-- Conditions d'utilisation -->
        <div class="form-group">
          <label class="checkbox-container">
            <input 
              type="checkbox" 
              v-model="form.acceptTerms" 
              required
            >
            <span class="checkmark"></span>
            <span>
              J'accepte les <a href="/conditions" class="terms-link">conditions d'utilisation</a> et la <a href="/privacy" class="terms-link">politique de confidentialité</a>
            </span>
          </label>
        </div>

        <!-- Bouton de soumission -->
        <button 
          type="submit" 
          class="btn-submit" 
          :disabled="loading || !formValid"
        >
          <span v-if="!loading">Créer mon compte</span>
          <span v-else class="loading">
            <i class="fas fa-spinner fa-spin"></i> Création en cours...
          </span>
        </button>

        <!-- Séparateur -->
        <div class="separator">
          <span>ou</span>
        </div>

        <!-- Connexion sociale -->
        <div class="social-auth">
          <button 
            type="button" 
            class="btn-social google"
            @click="signInWithGoogle"
          >
            <i class="fab fa-google"></i>
            <span>S'inscrire avec Google</span>
          </button>
        </div>
      </form>

      <!-- Pied de page -->
      <div class="register-footer">
        <p>Déjà inscrit ? <NuxtLink to="/login">Se connecter</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
});

import { ref, computed } from 'vue';

const form = ref({
  prenom: '',
  nom: '',
  email: '',
  role: 'learner', // 'learner' ou 'farmer'
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

// Calcul de la force du mot de passe
const passwordStrength = computed(() => {
  if (!form.value.password) return 'Faible';
  if (form.value.password.length < 8) return 'Faible';
  
  const hasUpperCase = /[A-Z]/.test(form.value.password);
  const hasLowerCase = /[a-z]/.test(form.value.password);
  const hasNumbers = /\d/.test(form.value.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.value.password);
  
  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length;
  
  switch(strength) {
    case 4: return 'Très fort';
    case 3: return 'Fort';
    case 2: return 'Moyen';
    default: return 'Faible';
  }
});

const passwordStrengthClass = computed(() => {
  return {
    'weak': passwordStrength.value === 'Faible',
    'medium': passwordStrength.value === 'Moyen',
    'strong': passwordStrength.value === 'Fort',
    'very-strong': passwordStrength.value === 'Très fort'
  };
});

// Vérification de la correspondance des mots de passe
const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword;
});

// Validation globale du formulaire
const formValid = computed(() => {
  return (
    form.value.prenom &&
    form.value.nom &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    passwordsMatch.value &&
    form.value.acceptTerms
  );
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    console.log('Inscription avec:', form.value);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Logique d'inscription à implémenter
  } finally {
    loading.value = false;
  }
};

const signInWithGoogle = () => {
  console.log('Inscription avec Google');
  // Implémenter la logique OAuth
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.weather-banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  z-index: 0;
}

.weather-icon {
  position: absolute;
}

.weather-icon.sun {
  top: 20%;
  right: 15%;
  width: 100px;
  height: 100px;
  background: #f9d71c;
  border-radius: 50%;
  box-shadow: 0 0 50px #f9d71c;
  opacity: 0.1;
  animation: pulse 4s infinite alternate;
}

.weather-icon.cloud {
  top: 30%;
  left: 10%;
  width: 150px;
  height: 60px;
  background: white;
  border-radius: 50px;
  opacity: 0.1;
  animation: moveCloud 20s linear infinite;
}

.register-container {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.register-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.logo i {
  color: #3498db;
}

.register-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #7f8c8d;
  font-size: 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.name-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 500;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #7f8c8d;
  font-size: 1rem;
}

.input-group input {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.5rem;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #3498db;
}

/* Options de rôle */
.role-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
}

.role-option {
  position: relative;
}

.role-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.role-card {
  padding: 1rem;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.role-card i {
  font-size: 1.5rem;
  color: #3498db;
}

.role-card span {
  font-weight: 500;
  color: #2c3e50;
}

.role-card p {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
}

.role-option input[type="radio"]:checked + .role-card {
  border-color: #3498db;
  background-color: #f0f7ff;
  box-shadow: 0 0 0 1px #3498db;
}

/* Force du mot de passe */
.password-strength {
  font-size: 0.8rem;
  margin-top: 0.3rem;
  padding: 0.3rem 0;
  border-radius: 4px;
  text-align: center;
}

.password-strength.weak {
  color: #e74c3c;
  background-color: #fde8e8;
}

.password-strength.medium {
  color: #f39c12;
  background-color: #fef3e8;
}

.password-strength.strong {
  color: #2ecc71;
  background-color: #e8faf0;
}

.password-strength.very-strong {
  color: #27ae60;
  background-color: #e1f7ea;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

/* Checkbox conditions */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 0.9rem;
  user-select: none;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 1px solid #e0e6ed;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-top: 0.2rem;
}

.checkbox-container input:checked + .checkmark {
  background: #3498db;
  border-color: #3498db;
}

.checkbox-container input:checked + .checkmark::after {
  content: '\f00c';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: white;
  font-size: 0.7rem;
}

.terms-link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.2s;
}

.terms-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* Bouton de soumission */
.btn-submit {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.btn-submit:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Séparateur */
.separator {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 1rem 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e6ed;
}

/* Connexion sociale */
.social-auth {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn-social {
  width: 100%;
  padding: 0.9rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  border: 1px solid #e0e6ed;
  background: white;
  color: #2c3e50;
}

.btn-social:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.btn-social.google:hover {
  border-color: #db4437;
  color: #db4437;
}

/* Pied de page */
.register-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: #7f8c8d;
  border-top: 1px solid #e0e6ed;
  padding-top: 1.5rem;
}

.register-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.register-footer a:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.1; }
  100% { transform: scale(1.05); opacity: 0.15; }
}

@keyframes moveCloud {
  0% { transform: translateX(-50px); }
  100% { transform: translateX(calc(100vw + 50px)); }
}

/* Responsive */
@media (max-width: 640px) {
  .register-page {
    padding: 1rem;
    background: white;
  }
  
  .register-container {
    padding: 1.5rem;
    box-shadow: none;
  }
  
  .weather-banner {
    height: 120px;
  }
  
  .weather-icon.sun {
    width: 60px;
    height: 60px;
  }
  
  .weather-icon.cloud {
    width: 100px;
    height: 40px;
  }
  
  .logo {
    font-size: 1.5rem;
  }
  
  .register-header h1 {
    font-size: 1.5rem;
  }
  
  .name-fields {
    grid-template-columns: 1fr;
  }
  
  .role-options {
    grid-template-columns: 1fr;
  }
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo-link:hover {
  color: #3498db;
}
</style>