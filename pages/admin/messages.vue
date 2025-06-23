<template>
  <div class="admin-page">
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Expéditeur</th>
            <th>Sujet</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5">Chargement...</td>
          </tr>
          <tr v-else-if="messages.length === 0">
            <td colspan="5">Aucun message trouvé.</td>
          </tr>
          <tr v-for="msg in messages" :key="msg.id">
            <td>{{ msg.user ? (msg.user.firstName + ' ' + msg.user.lastName) : '—' }}</td>
            <td>{{ msg.title }}</td>
            <td>{{ formatDate(msg.createdAt) }}</td>
            <td>
              <span :class="msg.answered ? 'text-green-600' : 'text-red-600'">
                {{ msg.answered ? 'Répondu' : 'Non répondu' }}
              </span>
            </td>
            <td>
              <div class="actions-group">
                <button @click="onEditMessage(msg)" class="action-btn edit" title="Modifier">
                  <i class="fas fa-pen"></i> Modifier
                </button>
                <button @click="onDeleteMessage(msg)" class="action-btn delete" title="Supprimer">
                  <i class="fas fa-trash"></i> Supprimer
                </button>
                <button @click="onBlockMessage(msg)" class="action-btn block" title="Bloquer">
                  <i class="fas fa-ban"></i> Bloquer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

const messages = ref([]);
const loading = ref(true);

async function fetchMessages() {
  try {
    const res = await fetch('/api/community/questions');
    const data = await res.json();
    if (data.success) {
      messages.value = data.questions;
    }
  } catch (e) {
    // Gérer l'erreur si besoin
  } finally {
    loading.value = false;
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function onEditMessage(msg) {
  alert(`Édition du message : ${msg.title}`);
}

function onDeleteMessage(msg) {
  if (confirm(`Voulez-vous vraiment supprimer le message « ${msg.title} » ?`)) {
    messages.value = messages.value.filter(m => m.id !== msg.id);
  }
}

function onBlockMessage(msg) {
  alert(`Message « ${msg.title} » bloqué (fonctionnalité à implémenter).`);
}

onMounted(fetchMessages);
</script>

<style scoped>
.admin-page {
  padding: 1rem;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.placeholder-row td > div {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.actions-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  padding: 0.25em 0.7em;
  border-radius: 1.3em;
  border: none;
  cursor: pointer;
  font-size: 0.92em;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
  transition: background 0.18s, transform 0.15s;
  outline: none;
  position: relative;
  font-weight: 500;
}

.action-btn.edit {
  background: #f1c40f;
  color: #fff;
}

.action-btn.edit:hover {
  background: #f39c12;
  transform: translateY(-2px) scale(1.08);
}

.action-btn.delete {
  background: #e74c3c;
  color: #fff;
}

.action-btn.delete:hover {
  background: #c0392b;
  transform: translateY(-2px) scale(1.08);
}

.action-btn.block {
  background: #34495e;
  color: #fff;
}

.action-btn.block:hover {
  background: #2c3e50;
  transform: translateY(-2px) scale(1.08);
}

.action-btn i {
  pointer-events: none;
  font-size: 0.95em;
}
</style> 