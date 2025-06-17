<template>
  <div class="auth-page">
    <!-- Bannière météo animée -->
    <div class="weather-banner">
      <div class="weather-icon sun"></div>
      <div class="weather-icon cloud"></div>
    </div>

    <div class="auth-container">
      <!-- En-tête avec logo -->
      <div class="auth-header">
        <div class="logo">
          <i class="fas fa-cloud-sun-rain"></i>
          <span>EduMétéo</span>
        </div>
        <h1>Bienvenue</h1>
        <p>Connectez-vous pour accéder à votre espace</p>
      </div>

      <!-- Onglets de connexion -->
      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'credentials' }"
          @click="activeTab = 'credentials'"
        >
          <i class="fas fa-user"></i> Identifiants
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'google' }"
          @click="activeTab = 'google'"
        >
          <i class="fab fa-google"></i> Google
        </button>
      </div>

      <!-- Formulaire par identifiants -->
      <form 
        v-if="activeTab === 'credentials'" 
        @submit.prevent="handleSubmit" 
        class="auth-form"
      >
        <!-- Champ Email/Téléphone -->
        <div class="form-group">
          <label for="login">Email ou numéro de téléphone</label>
          <div class="input-group">
            <i class="fas fa-user input-icon"></i>
            <input
              type="text"
              id="login"
              v-model="form.login"
              placeholder="email@exemple.com ou +33..."
              required
              @input="detectInputType"
            >
          </div>
        </div>

        <!-- Champ Mot de passe (visible seulement si email valide ou numéro) -->
        <div class="form-group" v-if="showPasswordField">
          <label for="password">Mot de passe</label>
          <div class="input-group">
            <i class="fas fa-lock input-icon"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              placeholder="Votre mot de passe"
              required
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
        </div>

        <!-- Options -->
        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="form.rememberMe">
            <span class="checkmark"></span>
            <span>Se souvenir de moi</span>
          </label>
          <NuxtLink to="/mot-de-passe-oublie" class="forgot-password">
            Mot de passe oublié ?
          </NuxtLink>
        </div>

        <!-- Bouton de soumission -->
        <button 
          type="submit" 
          class="btn-submit" 
          :disabled="loading || !showPasswordField"
        >
          <span v-if="!loading">Se connecter</span>
          <span v-else class="loading">
            <i class="fas fa-spinner fa-spin"></i> Connexion...
          </span>
        </button>
      </form>

      <!-- Connexion Google -->
      <div v-if="activeTab === 'google'" class="social-auth">
        <div class="auth-description">
          <i class="fab fa-google social-icon"></i>
          <h3>Connexion avec Google</h3>
          <p>Utilisez votre compte Google pour vous connecter</p>
        </div>
        <button 
          type="button" 
          class="btn-google"
          @click="signInWithGoogle"
        >
          <i class="fab fa-google"></i>
          <span>Continuer avec Google</span>
        </button>
        <div class="auth-divider">
          <span>ou</span>
        </div>
        <button 
          class="btn-switch-method" 
          @click="activeTab = 'credentials'"
        >
          <i class="fas fa-user"></i> Se connecter avec mes identifiants
        </button>
      </div>

      <!-- Pied de page -->
      <div class="auth-footer">
        <p>Pas encore de compte ? <NuxtLink to="/register">Créer un compte</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('credentials'); // 'credentials' ou 'google'

const form = ref({
  login: '',
  password: '',
  rememberMe: false
});

const showPassword = ref(false);
const loading = ref(false);
const inputType = ref(null); // 'email' ou 'phone'

const showPasswordField = computed(() => {
  return inputType.value === 'email' || 
         (inputType.value === 'phone' && form.value.login.length >= 8);
});

const detectInputType = () => {
  const value = form.value.login;
  if (/^\+?[0-9\s-]+$/.test(value)) {
    inputType.value = 'phone';
  } else if (value.includes('@')) {
    inputType.value = 'email';
  } else {
    inputType.value = null;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    console.log('Tentative de connexion avec:', {
      type: inputType.value,
      ...form.value
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Logique de connexion à implémenter
  } finally {
    loading.value = false;
  }
};

const signInWithGoogle = () => {
  console.log('Connexion avec Google');
  // Implémenter la logique OAuth
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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

.auth-container {
  width: 100%;
  max-width: 480px;
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
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

.auth-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #7f8c8d;
  font-size: 1rem;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid #e0e6ed;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #7f8c8d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
  position: relative;
}

.tab-btn.active {
  color: #3498db;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3498db;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #7f8c8d;
  user-select: none;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1px solid #e0e6ed;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
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

.forgot-password {
  color: #3498db;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #2980b9;
  text-decoration: underline;
}

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

/* Connexion sociale */
.social-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1.5rem 0;
}

.auth-description {
  text-align: center;
}

.social-icon {
  font-size: 2.5rem;
  color: #4285F4;
  margin-bottom: 1rem;
}

.auth-description h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.auth-description p {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.btn-google {
  width: 100%;
  padding: 1rem;
  background: white;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #5f6368;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.btn-google:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-color: #4285F4;
  color: #4285F4;
}

.auth-divider {
  display: flex;
  align-items: center;
  width: 100%;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e6ed;
  margin: 0 1rem;
}

.btn-switch-method {
  background: none;
  border: none;
  color: #3498db;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.btn-switch-method:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* Pied de page */
.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: #7f8c8d;
  border-top: 1px solid #e0e6ed;
  padding-top: 1.5rem;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-footer a:hover {
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
  .auth-page {
    padding: 1rem;
    background: white;
  }
  
  .auth-container {
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
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
}
</style>