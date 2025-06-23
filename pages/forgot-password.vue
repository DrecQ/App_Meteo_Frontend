<template>
  <div class="forgot-password-page">
    <div class="form-container">
      <h1>Mot de passe oublié</h1>
      <p>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required placeholder="Votre email" />
        </div>
        <button class="btn-primary" type="submit" :disabled="loading">
          <span v-if="!loading">Envoyer le lien</span>
          <span v-else><i class="fas fa-spinner fa-spin"></i> Envoi...</span>
        </button>
      </form>
      <div v-if="success" class="success-message">
        <i class="fas fa-check-circle"></i>
        Un email de réinitialisation a été envoyé si l'adresse existe dans notre base.
      </div>
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
      </div>
      <NuxtLink to="/login" class="back-link">Retour à la connexion</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref('');
const router = useRouter();

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    // Appel à l'API (simulation)
    await new Promise(resolve => setTimeout(resolve, 1200));
    // Ici tu pourrais faire : await $fetch('/api/auth/forgot-password', { method: 'POST', body: { email: email.value } })
    success.value = true;
  } catch (e) {
    error.value = "Une erreur est survenue. Veuillez réessayer.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.form-container {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  max-width: 400px;
  width: 100%;
  text-align: center;
}
.form-container h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.form-container p {
  color: #6c757d;
  margin-bottom: 2rem;
}
.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}
.btn-primary {
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-bottom: 1rem;
}
.btn-primary:hover {
  background-color: #2980b9;
}
.success-message {
  color: #198754;
  background: #d1e7dd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  justify-content: center;
}
.error-message {
  color: #dc3545;
  background: #f8d7da;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  justify-content: center;
}
.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #3498db;
  text-decoration: underline;
  font-size: 0.95rem;
}
.back-link:hover {
  color: #217dbb;
}
</style> 