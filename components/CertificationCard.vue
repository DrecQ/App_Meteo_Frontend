<template>
  <div class="certificate-card">
    <div class="certificate-header">
      <div class="certificate-progress">
        <div class="progress-circle">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="circle"
              :stroke-dasharray="`${progressPercentage}, 100`"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="progress-text">
            {{ progressPercentage }}%
          </div>
        </div>
      </div>
      <i class="fas fa-certificate certificate-icon"></i>
    </div>
    <div class="certificate-info">
      <h3>{{ certificate.title }}</h3>
      <p>{{ certificate.description }}</p>
      <div class="certificate-meta">
        <span><i class="fas fa-calendar"></i> Obtenu le {{ certificate.issueDate }}</span>
        <span><i class="fas fa-clock"></i> Expire le {{ certificate.expiryDate }}</span>
      </div>
    </div>
    <div class="certificate-actions">
      <button 
        v-if="!certificate.obtained"
        class="obtain-btn" 
        @click.stop="openModal"
      >
        <i class="fas fa-award"></i> Obtenir
      </button>
      <button 
        v-if="certificate.obtained"
        class="view-btn" 
        @click="viewCertificate"
      >
        <i class="fas fa-eye"></i> Voir
      </button>
      <button 
        v-if="certificate.obtained"
        class="download-btn" 
        @click="handleDownload"
        :disabled="!areAllConditionsMet"
      >
        <i class="fas fa-download"></i> Télécharger
      </button>
    </div>

    <!-- Modal des conditions d'obtention -->
    <Teleport to="body">
      <div v-if="showConditions" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Conditions d'obtention</h3>
            <button class="close-btn" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="conditions-list">
              <div 
                v-for="(condition, index) in certificate.conditions" 
                :key="index" 
                class="condition-item"
                :class="{ 'condition-met': condition.met }"
              >
                <i :class="condition.met ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                <span>{{ condition.text }}</span>
                <div v-if="condition.met" class="condition-status">
                  <i class="fas fa-check"></i> Validé
                </div>
              </div>
            </div>
            <div class="progress-section" v-if="!areAllConditionsMet">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${(metConditionsCount / certificate.conditions.length) * 100}%` }"
                ></div>
              </div>
              <span class="progress-text">
                {{ metConditionsCount }} sur {{ certificate.conditions.length }} conditions validées
              </span>
            </div>
            <div class="modal-actions">
              <button class="cancel-btn" @click="closeModal">Annuler</button>
              <button 
                class="confirm-btn" 
                @click="handleObtain"
                :disabled="!areAllConditionsMet"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

interface Condition {
  text: string;
  met: boolean;
}

interface Certificate {
  id: number;
  title: string;
  description: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  obtained: boolean;
  conditions: Condition[];
}

const props = defineProps<{
  certificate: Certificate;
}>();

const emit = defineEmits<{
  (e: 'obtain', certificate: Certificate): void;
  (e: 'view', certificate: Certificate): void;
  (e: 'download', certificate: Certificate): void;
}>();

const showConditions = ref(false);

const areAllConditionsMet = computed(() => {
  return props.certificate.conditions.every(condition => condition.met);
});

const metConditionsCount = computed(() => {
  return props.certificate.conditions.filter(condition => condition.met).length;
});

const progressPercentage = computed(() => {
  return Math.round((metConditionsCount.value / props.certificate.conditions.length) * 100);
});

const openModal = () => {
  showConditions.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  showConditions.value = false;
  document.body.style.overflow = '';
};

const handleObtain = () => {
  if (areAllConditionsMet.value) {
    closeModal();
    emit('obtain', props.certificate);
  }
};

const handleDownload = () => {
  if (areAllConditionsMet.value) {
    emit('download', props.certificate);
  }
};

const viewCertificate = () => {
  emit('view', props.certificate);
};

// Nettoyer le style du body lors du démontage du composant
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.certificate-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.certificate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.certificate-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.certificate-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.progress-circle {
  width: 80px;
  height: 80px;
  position: relative;
}

.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

.circle-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke: #4a90e2;
  stroke-width: 3;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.certificate-icon {
  font-size: 3rem;
  color: #4a90e2;
  margin-top: 2rem;
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.3));
}

.certificate-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.certificate-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.certificate-info p {
  color: #718096;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.certificate-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #718096;
  align-items: center;
}

.certificate-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.certificate-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.certificate-actions button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.obtain-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
}

.obtain-btn:hover {
  background-color: #357abd;
  transform: translateY(-2px);
}

.view-btn {
  background-color: #f7fafc;
  color: #4a90e2;
  border: 1px solid #4a90e2;
}

.view-btn:hover {
  background-color: #ebf8ff;
  transform: translateY(-2px);
}

.download-btn {
  background-color: #48bb78;
  color: white;
  border: none;
}

.download-btn:hover {
  background-color: #38a169;
  transform: translateY(-2px);
}

.download-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.download-btn:disabled:hover {
  background-color: #cbd5e0;
  transform: none;
}

/* Styles pour la modal */
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #4a5568;
  background-color: #f7fafc;
}

.modal-body {
  padding: 1.5rem;
}

.conditions-list {
  margin-bottom: 1.5rem;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #4a5568;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: #f7fafc;
  position: relative;
}

.condition-item.condition-met {
  background-color: #f0fff4;
}

.condition-item i {
  color: #48bb78;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.condition-item.condition-met i {
  color: #38a169;
}

.condition-status {
  margin-left: auto;
  font-size: 0.875rem;
  color: #38a169;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.progress-section {
  margin: 1.5rem 0;
  padding: 1.25rem;
  background-color: #f7fafc;
  border-radius: 8px;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background-color: #48bb78;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #4a5568;
  text-align: center;
  display: block;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.cancel-btn {
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.cancel-btn:hover {
  background-color: #edf2f7;
}

.confirm-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
}

.confirm-btn:hover {
  background-color: #357abd;
}

.confirm-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

.confirm-btn:disabled:hover {
  background-color: #cbd5e0;
}
</style> 