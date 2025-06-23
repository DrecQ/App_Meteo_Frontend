<template>
  <div class="admin-page">
    <div class="bulletin-form-container">
      <h3 class="form-title">Envoyer un nouveau bulletin</h3>
      <form @submit.prevent="sendBulletin">
        <div class="form-group">
          <label for="subject">Sujet</label>
          <input type="text" id="subject" v-model="subject" placeholder="Sujet de votre bulletin" />
        </div>
        <div class="form-group">
          <label for="content">Contenu</label>
          <textarea id="content" v-model="content" rows="10" placeholder="Rédigez votre message ici..."></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            <i class="fas fa-paper-plane mr-2"></i> Envoyer le bulletin
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'admin',
});

const subject = ref('');
const content = ref('');

const sendBulletin = async () => {
  if (!subject.value || !content.value) {
    alert('Veuillez remplir le sujet et le contenu.');
    return;
  }
  try {
    const res = await fetch('/api/bulletin/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: subject.value, content: content.value })
    });
    const data = await res.json();
    if (data.success) {
      alert('Bulletin envoyé avec succès !');
      subject.value = '';
      content.value = '';
    } else {
      alert("Erreur lors de l'envoi du bulletin.");
    }
  } catch (e) {
    alert("Erreur lors de l'envoi du bulletin.");
  }
};
</script>

<style scoped>
.admin-page {
  padding: 1rem;
}

.bulletin-form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-actions {
  text-align: right;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #2980b9;
}
</style> 