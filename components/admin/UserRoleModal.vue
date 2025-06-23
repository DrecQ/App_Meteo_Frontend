<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-2xl font-bold">Modifier le Rôle</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body" v-if="user">
        <p class="mb-4">
          Modifier le rôle pour <strong class="text-blue-600">{{ user.name }}</strong> ({{ user.email }}).
        </p>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="role">Rôle</label>
            <select id="role" v-model="selectedRole" required>
              <option value="USER">Utilisateur</option>
              <option value="EXPERT">Expert</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="$emit('close')">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Enregistrement...' : 'Mettre à jour' }}
            </button>
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  user: { type: Object, required: true },
});
const emit = defineEmits(['close', 'saved']);

const selectedRole = ref('USER');
const isSaving = ref(false);
const error = ref(null);

watch(() => props.user, (newUser) => {
  if (newUser) {
    selectedRole.value = newUser.role;
  }
}, { immediate: true });

const submitForm = async () => {
  isSaving.value = true;
  error.value = null;
  try {
    await $fetch(`/api/admin/users/${props.user.id}/role`, {
      method: 'PUT',
      body: { role: selectedRole.value.toUpperCase() }
    });
    emit('saved');
  } catch (err) {
    console.error("Erreur lors de la mise à jour du rôle", err);
    error.value = err.data?.statusMessage || err.data?.message || 'Une erreur est survenue.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.modal-overlay { z-index: 1000; position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; border-radius: 12px; width: 90%; max-width: 500px; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
.close-btn { background: none; border: none; font-size: 2rem; color: #9ca3af; }
.modal-body { padding: 1.5rem; }
.form-group { margin-bottom: 1.25rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.75rem; }
.btn-secondary { background-color: #e5e7eb; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; border: none; }
.btn-primary { background-color: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; border: none; }
.error-message { color: #ef4444; margin-top: 1rem; }
</style> 