<template>
  <div class="auth-page">
    <!-- Bannière météo décorative -->
    <div class="weather-banner">
      <div class="weather-icon sun"></div>
      <div class="weather-icon cloud"></div>
    </div>

    <div class="auth-container">
      <div class="auth-header">
        <div class="logo">
          <i class="fas fa-cloud-sun-rain"></i>
          <NuxtLink to="/" class="logo-link">METEO-BENIN</NuxtLink>
        </div>
        <h1>Inscription</h1>
        <p>Créez votre compte pour accéder à tous les cours</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
          </div>

          <div class="form-group">
          <label for="name">Nom complet</label>
            <div class="input-group">
              <i class="fas fa-user input-icon"></i>
              <input
                type="text"
              id="name"
              v-model="form.name"
              placeholder="Votre nom complet"
                required
              >
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-group">
            <i class="fas fa-envelope input-icon"></i>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="Votre email"
              required
            >
          </div>
        </div>

        <div class="form-group">
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
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div class="password-strength" :class="passwordStrengthClass">
            Force du mot de passe : {{ passwordStrength }}
          </div>
        </div>

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
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="form.acceptTerms" required>
            <span class="checkmark"></span>
            <span>J'accepte les <a href="/terms" target="_blank">conditions d'utilisation</a> et la <a href="/privacy" target="_blank">politique de confidentialité</a></span>
          </label>
        </div>

        <button 
          type="submit" 
          class="btn-submit" 
          :disabled="loading || !formValid"
        >
          <span v-if="!loading">Créer mon compte</span>
          <span v-else class="loading">
            <i class="fas fa-spinner fa-spin"></i> Création du compte...
          </span>
        </button>

        <div class="auth-divider">
          <span>ou</span>
        </div>

          <button 
            type="button" 
          class="btn-google"
            @click="signInWithGoogle"
          >
            <i class="fab fa-google"></i>
            <span>S'inscrire avec Google</span>
          </button>
      </form>

      <div class="auth-footer">
        <p>Déjà inscrit ? <NuxtLink to="/login">Se connecter</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

// Calcul de la force du mot de passe
const passwordStrength = computed(() => {
  if (!form.value.password) return 'Faible'
  if (form.value.password.length < 8) return 'Faible'
  
  const hasUpperCase = /[A-Z]/.test(form.value.password)
  const hasLowerCase = /[a-z]/.test(form.value.password)
  const hasNumbers = /\d/.test(form.value.password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.value.password)
  
  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length
  
  switch(strength) {
    case 4: return 'Très fort'
    case 3: return 'Fort'
    case 2: return 'Moyen'
    default: return 'Faible'
  }
})

const passwordStrengthClass = computed(() => {
  return {
    'weak': passwordStrength.value === 'Faible',
    'medium': passwordStrength.value === 'Moyen',
    'strong': passwordStrength.value === 'Fort',
    'very-strong': passwordStrength.value === 'Très fort'
  }
})

// Vérification de la correspondance des mots de passe
const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword
})

// Validation globale du formulaire
const formValid = computed(() => {
  return (
    form.value.name &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    passwordsMatch.value &&
    form.value.acceptTerms
  )
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const success = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    
    if (success) {
      router.push('/')
    }
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = () => {
  // Implémenter l'inscription avec Google
  console.log('Inscription avec Google')
}
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
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
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
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.logo i {
  color: #3498db;
}

.auth-header h1 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #7f8c8d;
}

.auth-form {
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
  font-size: 0.9rem;
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
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e6ed;
  border-radius: 0.5rem;
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
}

.password-strength {
  font-size: 0.8rem;
  padding: 0.25rem 0;
}

.password-strength.weak {
  color: #e74c3c;
}

.password-strength.medium {
  color: #f39c12;
}

.password-strength.strong {
  color: #2ecc71;
}

.password-strength.very-strong {
  color: #27ae60;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.checkbox-container a {
  color: #3498db;
  text-decoration: none;
}

.btn-submit {
  background-color: #3498db;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #7f8c8d;
  margin: 1rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e6ed;
}

.auth-divider span {
  padding: 0 1rem;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #e0e6ed;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #2c3e50;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-google:hover {
  background-color: #f8f9fa;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  color: #7f8c8d;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

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
}
</style>