<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-2xl font-bold">{{ isEditing ? 'Modifier la Question' : 'Ajouter une Question' }}</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="text">Texte de la question</label>
            <textarea id="text" v-model="form.text" rows="3" required></textarea>
          </div>

          <hr class="my-6">

          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Options de réponse</h3>
            <button type="button" @click="addOption" class="add-option-btn">
              <i class="fas fa-plus mr-1"></i> Ajouter une option
            </button>
          </div>

          <div v-for="(option, index) in form.options" :key="index" class="option-group">
            <input type="text" v-model="option.text" placeholder="Texte de l'option" required class="flex-grow">
            <label class="correct-checkbox-label">
              <input type="radio" :name="'correct-option'" :value="index" v-model="correctOptionIndex">
              <span>Correcte</span>
            </label>
            <button type="button" @click="removeOption(index)" class="remove-option-btn" title="Supprimer l'option">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          
          <hr class="my-6">

          <div class="form-group">
            <label for="explanation">Explication (optionnel)</label>
            <textarea id="explanation" v-model="form.explanation" rows="2" placeholder="Expliquez pourquoi la réponse est correcte..."></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="$emit('close')">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
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
  question: { type: Object, default: null },
  quizId: { type: String, required: true }
});
const emit = defineEmits(['close', 'saved']);

const isEditing = computed(() => !!props.question);
const isSaving = ref(false);
const error = ref(null);

const form = ref({
  text: '',
  options: [],
  explanation: ''
});
const correctOptionIndex = ref(null);

const addOption = () => {
  form.value.options.push({ text: '', isCorrect: false });
};

const removeOption = (index) => {
  if (correctOptionIndex.value === index) {
    correctOptionIndex.value = null;
  } else if (correctOptionIndex.value > index) {
    correctOptionIndex.value--;
  }
  form.value.options.splice(index, 1);
};

watch(() => props.question, (newQuestion) => {
  if (newQuestion) {
    form.value.text = newQuestion.text;
    form.value.options = JSON.parse(JSON.stringify(newQuestion.options || []));
    form.value.explanation = newQuestion.explanation || '';
    correctOptionIndex.value = form.value.options.findIndex(o => o.isCorrect);
  } else {
    form.value.text = '';
    form.value.options = [{ text: '', isCorrect: false }, { text: '', isCorrect: false }];
    form.value.explanation = '';
    correctOptionIndex.value = null;
  }
}, { immediate: true, deep: true });


const submitForm = async () => {
    if (correctOptionIndex.value === null) {
        error.value = "Veuillez sélectionner une réponse correcte.";
        return;
    }
    isSaving.value = true;
    error.value = null;

    const finalOptions = form.value.options.map((opt, index) => ({
        text: opt.text,
        isCorrect: index === correctOptionIndex.value
    }));

    try {
        const method = isEditing.value ? 'PUT' : 'POST';
        const endpoint = isEditing.value 
            ? `/api/admin/questions/${props.question.id}` 
            : '/api/admin/questions/create';
        
        const body = {
            quizId: props.quizId,
            text: form.value.text,
            options: finalOptions,
            explanation: form.value.explanation
        };

        await $fetch(endpoint, { method, body });
        emit('saved');

    } catch (err) {
        console.error("Erreur lors de la sauvegarde de la question", err);
        error.value = err.data?.message || 'Une erreur est survenue.';
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
/* Des styles complets pour une modale fonctionnelle et esthétique */
.modal-overlay { z-index: 1000; position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; border-radius: 12px; width: 90%; max-width: 700px; max-height: 90vh; display: flex; flex-direction: column; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
.close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: #9ca3af; }
.modal-body { padding: 1.5rem; overflow-y: auto; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
input[type="text"], textarea { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; }
.add-option-btn { background-color: #f3f4f6; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.9rem; }
.option-group { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.correct-checkbox-label { display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
.remove-option-btn { background: #fee2e2; color: #ef4444; border: none; border-radius: 50%; width: 32px; height: 32px; flex-shrink: 0; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.75rem; }
.btn-secondary { background-color: #e5e7eb; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; border: none; }
.btn-primary { background-color: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; border: none; }
.btn-primary:disabled { background-color: #93c5fd; }
.error-message { color: #ef4444; margin-top: 1rem; }
</style> 