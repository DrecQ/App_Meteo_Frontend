<template>
  <div v-if="modelValue" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Modifier l\'enseignant' : 'Ajouter un enseignant' }}</h2>
        <button class="close-button" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="name">Nom complet</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Entrez le nom de l'enseignant"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            placeholder="Entrez l'email de l'enseignant"
          />
        </div>

        <div class="form-group">
          <label for="speciality">Spécialité</label>
          <select id="speciality" v-model="formData.speciality" required>
            <option value="">Sélectionnez une spécialité</option>
            <option v-for="spec in specialities" :key="spec" :value="spec">
              {{ spec }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="experience">Années d'expérience</label>
          <input
            id="experience"
            v-model.number="formData.experience"
            type="number"
            min="0"
            required
          />
        </div>

        <div class="form-group">
          <label for="bio">Biographie</label>
          <textarea
            id="bio"
            v-model="formData.bio"
            rows="4"
            required
            placeholder="Entrez la biographie de l'enseignant"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="avatar">Photo de profil</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            @change="handleAvatarUpload"
          />
          <div v-if="formData.avatarPreview" class="avatar-preview">
            <img :src="formData.avatarPreview" alt="Aperçu" />
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
  teacher: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit']);

const specialities = [
  'Météorologie générale',
  'Climatologie',
  'Instruments météorologiques',
  'Prévisions météo',
  'Phénomènes météorologiques',
  'Océanographie',
  'Hydrologie'
];

const formData = ref({
  name: '',
  email: '',
  speciality: '',
  experience: 0,
  bio: '',
  avatar: null,
  avatarPreview: null
});

watch(() => props.teacher, (newTeacher) => {
  if (newTeacher && Object.keys(newTeacher).length > 0) {
    formData.value = {
      ...newTeacher,
      avatarPreview: newTeacher.avatar
    };
  }
}, { immediate: true });

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.avatar = file;
    formData.value.avatarPreview = URL.createObjectURL(file);
  }
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};

const closeModal = () => {
  emit('update:modelValue', false);
  formData.value = {
    name: '',
    email: '',
    speciality: '',
    experience: 0,
    bio: '',
    avatar: null,
    avatarPreview: null
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

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
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

.avatar-preview {
  margin-top: 1rem;
  max-width: 150px;
}

.avatar-preview img {
  width: 100%;
  height: auto;
  border-radius: 50%;
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
  .modal-content {
    width: 95%;
  }
}
</style> 