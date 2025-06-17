<template>
  <div class="messages-page">
    <div class="page-header">
      <h1>Gestion des messages</h1>
    </div>

    <div class="filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher un message..."
        >
      </div>
      <div class="filter-group">
        <select v-model="statusFilter">
          <option value="">Tous les statuts</option>
          <option value="unread">Non lus</option>
          <option value="read">Lus</option>
          <option value="replied">Répondus</option>
        </select>
      </div>
    </div>

    <div class="messages-list">
      <div v-for="message in filteredMessages" :key="message.id" class="message-card" :class="{ unread: !message.read }">
        <div class="message-header">
          <div class="sender-info">
            <img :src="message.sender.avatar" :alt="message.sender.name" class="sender-avatar">
            <div>
              <h3>{{ message.sender.name }}</h3>
              <span class="email">{{ message.sender.email }}</span>
            </div>
          </div>
          <div class="message-meta">
            <span class="date">{{ formatDate(message.date) }}</span>
            <span class="status" :class="message.status">{{ message.status }}</span>
          </div>
        </div>
        <div class="message-content">
          <h4>{{ message.subject }}</h4>
          <p>{{ message.content }}</p>
        </div>
        <div class="message-actions">
          <button class="btn-reply" @click="replyToMessage(message)">
            <i class="fas fa-reply"></i> Répondre
          </button>
          <button class="btn-delete" @click="deleteMessage(message.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de message -->
    <div v-if="selectedMessage" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedMessage.subject }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="message-details">
          <div class="message-info">
            <p><strong>De:</strong> {{ selectedMessage.sender }}</p>
            <p><strong>Date:</strong> {{ formatDate(selectedMessage.date) }}</p>
            <p><strong>Catégorie:</strong> {{ selectedMessage.category }}</p>
          </div>
          <div class="message-content">
            {{ selectedMessage.content }}
          </div>
          <div class="message-actions">
            <button class="btn-reply" @click="replyToMessage(selectedMessage)">
              <i class="fas fa-reply"></i> Répondre
            </button>
            <button class="btn-delete" @click="deleteMessage(selectedMessage.id)">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de réponse -->
    <div v-if="showReplyModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Répondre au message</h2>
          <button class="close-btn" @click="closeReplyModal">&times;</button>
        </div>
        <form @submit.prevent="sendReply" class="reply-form">
          <div class="form-group">
            <label>Destinataire</label>
            <input type="text" v-model="replyForm.to" readonly>
          </div>
          <div class="form-group">
            <label>Sujet</label>
            <input type="text" v-model="replyForm.subject" required>
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea v-model="replyForm.content" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeReplyModal">Annuler</button>
            <button type="submit" class="btn-primary">Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'admin'
}
</script>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const statusFilter = ref('')
const selectedMessage = ref(null)
const showReplyModal = ref(false)

const replyForm = ref({
  to: '',
  subject: '',
  content: ''
})

// Données de test
const messages = ref([
  {
    id: 1,
    sender: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      avatar: '/images/users/user1.jpg'
    },
    subject: 'Question sur le cours de météorologie',
    content: 'Bonjour, j\'aimerais avoir plus d\'informations sur le cours de météorologie...',
    date: '2024-03-15T10:30:00',
    status: 'unread',
    read: false
  },
  {
    id: 2,
    sender: {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      avatar: '/images/users/user2.jpg'
    },
    subject: 'Problème technique',
    content: 'Je n\'arrive pas à accéder au contenu du cours...',
    date: '2024-03-14T15:45:00',
    status: 'replied',
    read: true
  }
])

const filteredMessages = computed(() => {
  return messages.value.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || message.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

function openMessage(message) {
  selectedMessage.value = message
  if (message.status === 'unread') {
    message.status = 'read'
  }
}

function closeModal() {
  selectedMessage.value = null
}

function replyToMessage(message) {
  replyForm.value = {
    to: message.sender.name,
    subject: `Re: ${message.subject}`,
    content: ''
  }
  showReplyModal.value = true
}

function closeReplyModal() {
  showReplyModal.value = false
  replyForm.value = {
    to: '',
    subject: '',
    content: ''
  }
}

function sendReply() {
  // Ici, vous devriez implémenter la logique d'envoi de réponse
  console.log('Réponse envoyée:', replyForm.value)
  closeReplyModal()
}

function deleteMessage(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
    messages.value = messages.value.filter(m => m.id !== id)
    if (selectedMessage.value?.id === id) {
      closeModal()
    }
  }
}
</script>

<style scoped>
.messages-page {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  min-width: 150px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
}

.message-card.unread {
  border-left: 4px solid #3498db;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sender-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sender-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.sender-info h3 {
  margin: 0;
  font-size: 1rem;
}

.email {
  color: #666;
  font-size: 0.875rem;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date {
  color: #666;
  font-size: 0.875rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.status.unread {
  background: #3498db;
  color: white;
}

.status.read {
  background: #2ecc71;
  color: white;
}

.status.replied {
  background: #f1c40f;
  color: white;
}

.message-content {
  margin: 1rem 0;
}

.message-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.message-content p {
  margin: 0;
  color: #666;
}

.message-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-reply, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-reply {
  background: #3498db;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-reply:hover, .btn-delete:hover {
  opacity: 0.9;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.message-details {
  padding: 1.5rem;
}

.message-info {
  margin-bottom: 1.5rem;
}

.message-info p {
  margin: 0.5rem 0;
  color: #666;
}

.message-content {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.message-actions {
  display: flex;
  gap: 1rem;
}

.reply-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.form-group textarea {
  height: 200px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .message-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 