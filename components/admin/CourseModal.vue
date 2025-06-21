<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-2xl font-bold">{{ isEditing ? 'Modifier le cours' : 'Ajouter un nouveau cours' }}</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Titre du cours</label>
            <input id="title" v-model="form.title" type="text" placeholder="Ex: Introduction à la météo" required>
          </div>
          
          <div class="form-group">
            <label for="slug">Slug (URL)</label>
            <input id="slug" v-model="form.slug" type="text" placeholder="Ex: introduction-meteo" required>
            <p class="form-hint">Sera généré depuis le titre si laissé vide.</p>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="form.description" rows="4" placeholder="Décrivez brièvement le cours..."></textarea>
          </div>
          
          <div class="form-group">
            <label for="teacher">Enseignant</label>
            <select id="teacher" v-model="form.teacherId" required>
              <option :value="null" disabled>Sélectionnez un enseignant</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="imageUrl">URL de l'image de couverture</label>
            <input id="imageUrl" v-model="form.imageUrl" type="text" placeholder="https://exemple.com/image.jpg">
          </div>

          <div class="form-group-inline">
            <input type="checkbox" id="published" v-model="form.published" class="mr-2">
            <label for="published">Publier le cours</label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="$emit('close')">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le cours') }}
            </button>
          </div>
          
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps({
  course: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);

const isEditing = computed(() => !!props.course);
const isSaving = ref(false);
const error = ref(null);

const form = ref({
  title: '',
  slug: '',
  description: '',
  teacherId: null,
  imageUrl: '',
  published: false,
});

const teachers = ref([]);

// Charger les enseignants (utilisateurs avec rôle 'expert' ou 'admin')
onMounted(async () => {
  try {
    // Note: l'API /api/admin/teachers/list n'existe pas encore. On la créera.
    // Pour l'instant, on simule ou on utilise l'api users/list et on filtre.
    const allUsers = await $fetch('/api/admin/users/list');
    teachers.value = allUsers.filter(u => u.role === 'expert' || u.role === 'admin');
    
    if (props.course) {
      form.value = { ...props.course };
    } else {
        // Valeurs par défaut pour un nouveau cours
        form.value.teacherId = teachers.value.length > 0 ? teachers.value[0].id : null;
    }
  } catch (err) {
    console.error("Erreur lors du chargement des enseignants", err);
    error.value = "Impossible de charger la liste des enseignants.";
  }
});

// Générer le slug à partir du titre
watch(() => form.value.title, (newTitle) => {
  if (!isEditing.value) { // Seulement pour les nouveaux cours
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

const submitForm = async () => {
  isSaving.value = true;
  error.value = null;

  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const endpoint = isEditing.value ? `/api/admin/courses/${props.course.id}` : '/api/admin/courses/create';
    
    await $fetch(endpoint, {
      method,
      body: form.value
    });

    emit('saved');
  } catch (err) {
    console.error("Erreur lors de la sauvegarde du cours", err);
    error.value = err.data?.message || 'Une erreur est survenue.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; width: 90%; max-width: 600px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: flex; flex-direction: column; max-height: 90vh; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: #9ca3af; }
.modal-body { padding: 1.5rem; overflow-y: auto; }
.form-group { margin-bottom: 1.25rem; }
.form-group-inline { display: flex; align-items: center; margin-bottom: 1.25rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
input[type="text"], input[type="email"], textarea, select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; transition: border-color 0.2s; }
input:focus, textarea:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); }
.form-hint { font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.75rem; }
.btn-secondary { background-color: #e5e7eb; color: #374151; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; transition: background-color 0.2s; border: none; }
.btn-secondary:hover { background-color: #d1d5db; }
.btn-primary { background-color: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; transition: background-color 0.2s; border: none; }
.btn-primary:hover { background-color: #2563eb; }
.btn-primary:disabled { background-color: #93c5fd; cursor: not-allowed; }
.error-message { color: #ef4444; margin-top: 1rem; text-align: center; }
</style> 