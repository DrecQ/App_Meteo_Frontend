<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-2xl font-bold">{{ isEditing ? 'Modifier le Quiz' : 'Ajouter un Quiz' }}</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Titre du Quiz</label>
            <input id="title" v-model="form.title" type="text" placeholder="Ex: Quiz d'introduction" required>
          </div>
          
          <div class="form-group">
            <label for="type">Type de Quiz</label>
            <select id="type" v-model="form.type" required>
              <option value="CLASSIC">Classique</option>
              <option value="IA">IA (Généré par IA)</option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="$emit('close')">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le Quiz') }}
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
  quiz: { type: Object, default: null },
  courseId: { type: String, required: true }
});

const emit = defineEmits(['close', 'saved']);

const isEditing = computed(() => !!props.quiz);
const isSaving = ref(false);
const error = ref(null);

const form = ref({
  title: '',
  type: 'CLASSIC',
});

watch(() => props.quiz, (newQuiz) => {
  if (newQuiz) {
    form.value.title = newQuiz.title;
    form.value.type = newQuiz.type;
  } else {
    form.value.title = '';
    form.value.type = 'CLASSIC';
  }
}, { immediate: true });


const submitForm = async () => {
  isSaving.value = true;
  error.value = null;

  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const endpoint = isEditing.value ? `/api/admin/quizzes/${props.quiz.id}` : '/api/admin/quizzes/create';
    
    const body = {
      ...form.value,
      courseId: props.courseId
    }

    await $fetch(endpoint, { method, body });

    emit('saved');
  } catch (err) {
    console.error("Erreur lors de la sauvegarde du quiz", err);
    error.value = err.data?.message || 'Une erreur est survenue.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; width: 90%; max-width: 500px; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: #9ca3af; }
.modal-body { padding: 1.5rem; }
.form-group { margin-bottom: 1.25rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
input, select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.75rem; }
.btn-secondary { background-color: #e5e7eb; color: #374151; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; }
.btn-primary { background-color: #10b981; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; }
.btn-primary:disabled { background-color: #6ee7b7; cursor: not-allowed; }
.error-message { color: #ef4444; margin-top: 1rem; text-align: center; }
</style> 