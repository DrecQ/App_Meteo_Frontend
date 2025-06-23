<template>
  <div class="community-page">
    <!-- Bannière harmonisée supprimée -->

    <div class="container">

      <!-- Formulaire de question (modale) -->
      <div class="modal" v-if="showQuestionForm">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ $t('community.newQuestion') }}</h3>
            <button @click="showQuestionForm = false" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="submitQuestion" class="question-form">
            <div class="form-group">
              <label>{{ $t('community.questionTitle') }}</label>
              <input 
                type="text" 
                v-model="newQuestion.title" 
                :placeholder="$t('community.questionTitlePlaceholder')"
                required
              >
            </div>
            <div class="form-group">
              <label>{{ $t('community.questionDetails') }}</label>
              <textarea 
                v-model="newQuestion.content" 
                :placeholder="$t('community.questionDetailsPlaceholder')"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>{{ $t('community.category') }}</label>
              <select v-model="newQuestion.category" required>
                <option value="">{{ $t('community.selectCategory') }}</option>
                <option value="meteo">{{ $t('community.categories.meteo') }}</option>
                <option value="climat">{{ $t('community.categories.climat') }}</option>
                <option value="instruments">{{ $t('community.categories.instruments') }}</option>
                <option value="agriculture">{{ $t('community.categories.agriculture') }}</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" @click="showQuestionForm = false" class="btn-cancel">
                {{ $t('common.cancel') }}
              </button>
              <button type="submit" class="btn-submit" :disabled="isSubmitting">
                {{ isSubmitting ? $t('common.submitting') : $t('community.publishQuestion') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bouton Aide déplacé dans l'angle supérieur droit -->
      <button class="btn-help floating-help" @click="showHelp = true" :title="$t('community.helpTitle')">
        <i class="fas fa-question-circle"></i> {{ $t('common.help') }}
      </button>

      <!-- Modale d'aide -->
      <div class="modal" v-if="showHelp">
        <div class="modal-content help-modal">
          <div class="modal-header">
            <h3>{{ $t('community.helpTitle') }}</h3>
            <button @click="showHelp = false" class="close-btn"><i class="fas fa-times"></i></button>
          </div>
          <div class="help-body">
            <ol>
              <li><b>{{ $t('community.help.step1.title') }}</b> {{ $t('community.help.step1.description') }}</li>
              <li><b>{{ $t('community.help.step2.title') }}</b> {{ $t('community.help.step2.description') }}</li>
              <li><b>{{ $t('community.help.step3.title') }}</b> {{ $t('community.help.step3.description') }}</li>
            </ol>
            <img :src="guideCommunaute" alt="Guide illustré" style="width:100%;max-width:300px;margin:1rem auto;display:block;">
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <main class="community-content">
        <!-- Filtres -->
        <div class="filters">
          <div class="search-bar">
            <input 
              type="text" 
              :placeholder="$t('community.searchPlaceholder')" 
              v-model="searchQuery"
              :title="$t('community.searchTitle')"
            >
            <button @click="searchQuestions" :title="$t('community.searchButton')">
              <i class="fas fa-search"></i>
            </button>
            <!-- Bouton micro pour question vocale -->
            <button class="btn-micro" :title="$t('community.voiceQuestion')">
              <i class="fas fa-microphone"></i>
            </button>
          </div>
          
          <!-- Exemples de questions -->
          <div class="question-examples">
            <span>{{ $t('community.examples') }}:</span>
            <ul>
              <li>{{ $t('community.exampleQuestions.rain') }}</li>
              <li>{{ $t('community.exampleQuestions.corn') }}</li>
              <li>{{ $t('community.exampleQuestions.drought') }}</li>
            </ul>
          </div>
          
          <div class="filter-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.value"
              :class="{ active: activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Bouton pour poser une question -->
        <div class="new-question-section">
          <button @click="showQuestionForm = true" class="btn-new-question">
            <i class="fas fa-plus"></i>
            {{ $t('community.askQuestion') }}
          </button>
        </div>

        <!-- État de chargement -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('common.loading') }}</p>
        </div>

        <!-- Liste des questions -->
        <div v-else class="questions-list">
          <div 
            v-for="question in filteredQuestions" 
            :key="question.id" 
            class="question-card vertical"
            :class="{ answered: question.answered, featured: question.featured }"
          >
            <div class="question-meta-row">
              <span class="category-badge" :class="question.category">
                {{ formatCategory(question.category) }}
              </span>
              <span class="date">{{ formatDate(question.createdAt) }}</span>
            </div>
            <h3 class="question-title">{{ question.title }}</h3>
            <div class="question-author-row">
              <img 
                :src="question.user?.avatar || '/default-avatar.svg'" 
                :alt="getUserName(question.user)"
                class="author-avatar"
                @error="handleAvatarError"
              />
              <span class="author-name">{{ getUserName(question.user) }}</span>
              <span class="author-role">{{ question.user?.role || $t('common.member') }}</span>
            </div>
            <p class="question-content">{{ question.content }}</p>
            <div class="question-actions">
              <button 
                @click="toggleLike(question.id)"
                class="like-btn"
                :class="{ liked: isLiked(question.id) }"
              >
                <i class="fas fa-heart"></i>
                <span>{{ question.likesCount || 0 }}</span>
              </button>
              <button 
                class="btn-answer"
                @click="showAnswerForm(question.id)"
              >
                <i class="fas fa-reply"></i> {{ $t('community.reply') }}
              </button>
              <span class="answers-count">
                <i class="fas fa-comment"></i> {{ question.answersCount || 0 }} {{ $t('community.answers') }}
              </span>
            </div>
            <!-- Champ de réponse juste sous la question -->
            <div class="answer-form" v-if="showAnswerForQuestion === question.id">
              <h4>{{ $t('community.yourAnswer') }}</h4>
              <textarea 
                v-model="newAnswer.content" 
                :placeholder="$t('community.answerPlaceholder')"
                rows="4"
              ></textarea>
              <div class="form-actions">
                <button @click="cancelAnswer" class="btn-cancel">
                  {{ $t('common.cancel') }}
                </button>
                <button @click="submitAnswer" class="btn-submit" :disabled="isSubmittingAnswer">
                  {{ isSubmittingAnswer ? $t('common.submitting') : $t('community.publishAnswer') }}
                </button>
              </div>
            </div>
            <!-- Réponses SOUS la question, en bloc -->
            <div v-if="question.answers && question.answers.length > 0" class="answers-section below">
              <h4>{{ $t('community.answers') }} ({{ question.answers.length }})</h4>
              <div v-for="answer in question.answers" :key="answer.id" class="answer-card small block">
                <div class="answer-author-block">
                  <img 
                    :src="answer.user?.avatar || '/default-avatar.svg'" 
                    :alt="getUserName(answer.user)"
                    class="author-avatar-small"
                    @error="handleAvatarError"
                  />
                  <div class="answer-author-info">
                    <span class="author-name">{{ getUserName(answer.user) }}</span>
                    <span class="answer-date">{{ formatDate(answer.createdAt) }}</span>
                  </div>
                </div>
                <div class="answer-content-block">
                  <p>{{ answer.content }}</p>
                </div>
                <div class="answer-actions">
                  <button 
                    @click="toggleAnswerLike(answer.id)"
                    class="like-btn small"
                    :class="{ liked: isAnswerLiked(answer.id) }"
                  >
                    <i class="fas fa-heart"></i>
                    <span>{{ answer.likes?.length || 0 }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Sidebar -->
      <!-- Section météo actuelle supprimée -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import guideCommunaute from '@/assets/images/ui/guide-communaute.svg'

// États
const showQuestionForm = ref(false)
const showAnswerForQuestion = ref(null)
const searchQuery = ref('')
const activeTab = ref('recent')
const showHelp = ref(false)
const loading = ref(false)
const isSubmitting = ref(false)
const isSubmittingAnswer = ref(false)

// Store d'authentification
const authStore = useAuthStore()

// Données
const newQuestion = ref({
  title: '',
  content: '',
  category: ''
})

const newAnswer = ref({
  content: ''
})

const questions = ref([])
const userLikes = ref(new Set())
const answerLikes = ref(new Set())

const tabs = ref([
  { value: 'recent', label: 'Récentes' },
  { value: 'unanswered', label: 'Sans réponse' },
  { value: 'popular', label: 'Populaires' },
  { value: 'featured', label: 'En vedette' }
])

// Computed
const filteredQuestions = computed(() => {
  let result = questions.value
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(q => 
      q.title.toLowerCase().includes(query) || 
      q.content.toLowerCase().includes(query)
    )
  }
  
  // Filtre par onglet
  switch(activeTab.value) {
    case 'unanswered':
      return result.filter(q => !q.answered)
    case 'popular':
      return [...result].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    case 'featured':
      return result.filter(q => q.featured)
    default:
      return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

// Fonctions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCategory(category) {
  const categories = {
    meteo: 'Météo',
    climat: 'Climat',
    instruments: 'Instruments',
    agriculture: 'Agriculture'
  }
  return categories[category] || category
}

function getUserName(user) {
  if (!user) return 'Utilisateur'
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur'
  }
  if (user.name) return user.name
  return 'Utilisateur'
}

function handleAvatarError(event) {
  event.target.src = '/default-avatar.svg'
}

function isLiked(questionId) {
  return userLikes.value.has(questionId)
}

function isAnswerLiked(answerId) {
  return answerLikes.value.has(answerId)
}

async function loadQuestions() {
  loading.value = true
  try {
    const response = await $fetch('/api/community/questions')
    if (response.success) {
      questions.value = response.questions
    }
  } catch (error) {
    console.error('Erreur lors du chargement des questions:', error)
  } finally {
    loading.value = false
  }
}

async function searchQuestions() {
  if (!searchQuery.value.trim()) {
    await loadQuestions()
    return
  }
  
  loading.value = true
  try {
    const response = await $fetch(`/api/community/questions?search=${encodeURIComponent(searchQuery.value)}`)
    if (response.success) {
      questions.value = response.questions
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
  } finally {
    loading.value = false
  }
}

async function submitQuestion() {
  if (!authStore.isAuthenticated) {
    alert('Vous devez être connecté pour poser une question')
    return
  }

  isSubmitting.value = true
  try {
    const response = await $fetch('/api/community/questions', {
      method: 'POST',
      body: {
        title: newQuestion.value.title,
        content: newQuestion.value.content,
        category: newQuestion.value.category,
        userId: authStore.user.id
      }
    })

    if (response.success) {
      // Recharger les questions
      await loadQuestions()
      showQuestionForm.value = false
      newQuestion.value = { title: '', content: '', category: '' }
    }
  } catch (error) {
    console.error('Erreur lors de la création de la question:', error)
    alert('Erreur lors de la création de la question')
  } finally {
    isSubmitting.value = false
  }
}

function showAnswerForm(questionId) {
  if (!authStore.isAuthenticated) {
    alert('Vous devez être connecté pour répondre')
    return
  }
  showAnswerForQuestion.value = questionId
  newAnswer.value = { content: '' }
}

function cancelAnswer() {
  showAnswerForQuestion.value = null
}

async function submitAnswer() {
  isSubmittingAnswer.value = true
  try {
    const response = await $fetch('/api/community/answers', {
      method: 'POST',
      body: {
        content: newAnswer.value.content,
        questionId: showAnswerForQuestion.value,
        userId: authStore.user.id
      }
    })

    if (response.success) {
      // Recharger les questions pour afficher la nouvelle réponse
      await loadQuestions()
      cancelAnswer()
    }
  } catch (error) {
    console.error('Erreur lors de la création de la réponse:', error)
    alert('Erreur lors de la création de la réponse')
  } finally {
    isSubmittingAnswer.value = false
  }
}

async function toggleLike(questionId) {
  if (!authStore.isAuthenticated) {
    alert('Vous devez être connecté pour liker')
    return
  }

  try {
    const response = await $fetch('/api/community/like', {
      method: 'POST',
      body: {
        userId: authStore.user.id,
        questionId: questionId
      }
    })

    if (response.success) {
      // Mettre à jour l'état local
      if (userLikes.value.has(questionId)) {
        userLikes.value.delete(questionId)
      } else {
        userLikes.value.add(questionId)
      }
      
      // Recharger les questions pour mettre à jour les compteurs
      await loadQuestions()
    }
  } catch (error) {
    console.error('Erreur lors du like:', error)
  }
}

async function toggleAnswerLike(answerId) {
  if (!authStore.isAuthenticated) {
    alert('Vous devez être connecté pour liker')
    return
  }

  try {
    const response = await $fetch('/api/community/like', {
      method: 'POST',
      body: {
        userId: authStore.user.id,
        answerId: answerId
      }
    })

    if (response.success) {
      // Mettre à jour l'état local
      if (answerLikes.value.has(answerId)) {
        answerLikes.value.delete(answerId)
      } else {
        answerLikes.value.add(answerId)
      }
      
      // Recharger les questions pour mettre à jour les compteurs
      await loadQuestions()
    }
  } catch (error) {
    console.error('Erreur lors du like:', error)
  }
}

// Initialisation
onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.community-page {
  margin-top: 2rem;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
  overflow-x: hidden;
}

/* Bannière harmonisée */
.page-banner {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 5rem 0 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.page-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/weather-pattern.png');
  background-size: 300px;
  opacity: 0.05;
}
.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.page-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
.page-banner p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

/* Conteneur principal */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

/* En-tête */
.community-header {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 2rem;
}

.community-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.community-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 1.5rem;
}

/* Bouton nouvelle question */
.new-question-section {
  margin-bottom: 1.5rem;
  text-align: center;
}

.btn-new-question {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn-new-question:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

/* État de chargement */
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Bouton like */
.like-btn {
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 20px;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.like-btn:hover {
  background: #f8f9fa;
  color: #e74c3c;
}

.like-btn.liked {
  color: #e74c3c;
  background: #fdf2f2;
}

.like-btn.small {
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
}

/* Avatar utilisateur */
.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e6ed;
}

.author-avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e0e6ed;
}

/* Section des réponses */
.answers-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e6ed;
}

.answers-section h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.answer-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid #3498db;
}

.answer-content p {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.answer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.answer-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-name {
  font-weight: 500;
  color: #2c3e50;
}

.answer-date {
  color: #7f8c8d;
  font-size: 0.8rem;
}

/* Bouton micro */
.btn-micro {
  padding: 0 1.2rem;
  background: #4caf50;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-micro:hover {
  background: #45a049;
}

/* Responsive pour les nouveaux éléments */
@media (max-width: 768px) {
  .btn-new-question {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
  
  .answer-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .like-btn {
    align-self: flex-end;
  }
}

@media (max-width: 576px) {
  .new-question-section {
    margin-bottom: 1rem;
  }
  
  .btn-new-question {
    width: 100%;
    justify-content: center;
  }
  
  .answer-card {
    padding: 0.8rem;
  }
  
  .author-avatar {
    width: 32px;
    height: 32px;
  }
  
  .author-avatar-small {
    width: 20px;
    height: 20px;
  }
}

/* Modale */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #7f8c8d;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e74c3c;
}

.question-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background: #f1f5f9;
  color: #2c3e50;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #e0e6ed;
}

.btn-submit {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #2980b9;
}

/* Contenu principal */
.community-content {
  width: 100%;
  max-width: 700px;
}

/* Filtres */
.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.search-bar {
  display: flex;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e6ed;
}

.search-bar input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-bar button {
  padding: 0 1.2rem;
  background: #f1f5f9;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  transition: background 0.3s;
}

.search-bar button:hover {
  background: #e0e6ed;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.filter-tabs button {
  background: #f1f5f9;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #2c3e50;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.filter-tabs button.active {
  background: #3498db;
  color: white;
}

.filter-tabs button:hover:not(.active) {
  background: #e0e6ed;
}

/* Liste des questions */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-card.vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.07);
  border: 1px solid #e0e6ed;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 16px;
  position: relative;
}

.question-meta-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.question-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #1a3557;
}

.question-author-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}

.question-author-row .author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #e0e6ed;
}

.question-author-row .author-name {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.question-author-row .author-role {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.question-content {
  font-size: 1.08rem;
  color: #34495e;
  margin-bottom: 1.2rem;
  line-height: 1.6;
}

.question-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 0.5rem;
}

.answers-count {
  font-size: 0.95rem;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.answers-section.below {
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid #e0e6ed;
  width: 100%;
}

.answer-card.small.block {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: #f7fafd;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  margin-bottom: 0.8rem;
  border-left: 3px solid #3498db;
  font-size: 0.97rem;
  opacity: 0.98;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.04);
}

.answer-author-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
  min-width: 60px;
}

.answer-author-block .author-avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e0e6ed;
  margin-bottom: 0.2rem;
}

.answer-author-info {
  text-align: center;
}

.answer-author-info .author-name {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 500;
}

.answer-author-info .answer-date {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.answer-content-block {
  flex: 1;
  padding-top: 0.1rem;
}

.answer-content-block p {
  font-size: 0.98em;
  color: #2c3e50;
  margin-bottom: 0.2rem;
}

.answer-actions {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  margin-top: 0.2rem;
}

@media (max-width: 768px) {
  .question-card.vertical {
    padding: 1.2rem 0.7rem;
  }
  .answer-card.small.block {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.7rem 0.5rem;
  }
  .answer-author-block {
    flex-direction: row;
    align-items: center;
    margin-right: 0.7rem;
    min-width: 0;
    margin-bottom: 0.3rem;
  }
  .answer-author-info {
    text-align: left;
    margin-left: 0.5rem;
  }
}

/* Sidebar */
.community-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.sidebar-widget {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.sidebar-widget h3 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

/* Widget Météo */
.current-weather {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon {
  font-size: 2.5rem;
  color: #f39c12;
}

.weather-info p {
  margin: 0;
}

.weather-info .temp {
  font-size: 1.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.weather-info .condition {
  color: #7f8c8d;
}

.weather-info .location {
  font-size: 0.85rem;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.1; }
  100% { transform: scale(1.05); opacity: 0.15; }
}

@keyframes moveCloud {
  0% { transform: translateX(-50px); }
  100% { transform: translateX(calc(100vw + 50px)); }
}

/* Responsive */
@media (max-width: 992px) {
  .container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .community-header h1 {
    font-size: 2rem;
  }
  
  .question-card {
    flex-direction: column;
  }
  
  .question-stats {
    flex-direction: row;
    align-items: center;
    margin-top: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 1.5rem 1rem;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
  }
  
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

.floating-help {
  position: fixed;
  top: 4rem;
  right: 2rem;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(52,152,219,0.15);
}

@media (max-width: 600px) {
  .floating-help {
    top: 1rem;
    right: 1rem;
  }
}

.answers-section.below {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e6ed;
  width: 100%;
}
.answer-card.small {
  background: #f4f6fa;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  margin-bottom: 0.7rem;
  border-left: 3px solid #3498db;
  font-size: 0.92rem;
  opacity: 0.95;
}
.answer-card.small .answer-content p {
  font-size: 0.98em;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.answer-card.small .answer-meta {
  font-size: 0.85em;
}
@media (max-width: 768px) {
  .answers-section.below {
    padding-left: 0;
    padding-right: 0;
  }
  .answer-card.small {
    padding: 0.5rem 0.7rem;
  }
}
</style>