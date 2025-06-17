<template>
  <div v-if="modelValue" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Modifier le cours' : 'Ajouter un cours' }}</h2>
        <button class="close-button" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="title">Titre du cours</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="Entrez le titre du cours"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            required
            placeholder="Entrez la description du cours"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Catégorie</label>
            <select id="category" v-model="formData.category" required>
              <option value="">Sélectionnez une catégorie</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="level">Niveau</label>
            <select id="level" v-model="formData.level" required>
              <option value="">Sélectionnez un niveau</option>
              <option v-for="lvl in levels" :key="lvl" :value="lvl">
                {{ lvl }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="duration">Durée (en heures)</label>
          <input
            id="duration"
            v-model.number="formData.duration"
            type="number"
            min="1"
            required
          />
        </div>

        <div class="form-group">
          <label for="image">Image du cours</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
          />
          <div v-if="formData.imagePreview" class="image-preview">
            <img :src="formData.imagePreview" alt="Aperçu" />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="closeModal">
            Annuler
          </button>
          <button type="submit" class="btn-submit">
            {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  course: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit']);

const categories = [
  'Météorologie',
  'Climatologie',
  'Instruments météorologiques',
  'Prévisions météo',
  'Phénomènes météorologiques'
];

const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

const formData = ref({
  title: '',
  description: '',
  category: '',
  level: '',
  duration: 1,
  image: null,
  imagePreview: null
});

watch(() => props.course, (newCourse) => {
  if (newCourse && Object.keys(newCourse).length > 0) {
    formData.value = {
      ...newCourse,
      imagePreview: newCourse.image
    };
  }
}, { immediate: true });

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.image = file;
    formData.value.imagePreview = URL.createObjectURL(file);
  }
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};

const closeModal = () => {
  emit('update:modelValue', false);
  formData.value = {
    title: '',
    description: '',
    category: '',
    level: '',
    duration: 1,
    image: null,
    imagePreview: null
  };
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.close-button {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  font-size: 1.25rem;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #2d3748;
}

input[type="file"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px dashed #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
}

.image-preview {
  margin-top: 1rem;
  max-width: 200px;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
}

.btn-submit {
  background: #4299e1;
  color: white;
  border: none;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-submit:hover {
  background: #3182ce;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
  }
}
</style> 