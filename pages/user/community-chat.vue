<template>
  <div class="community-page">
    <!-- Bannière harmonisée supprimée -->

    <div class="container">

      <!-- Formulaire de question (modale) -->
      <div class="modal" v-if="showQuestionForm">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Poser une nouvelle question</h3>
            <button @click="showQuestionForm = false" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="submitQuestion" class="question-form">
            <div class="form-group">
              <label>Titre de la question</label>
              <input 
                type="text" 
                v-model="newQuestion.title" 
                placeholder="Ex: Comment prévoir les orages en saison sèche ?"
                required
              >
            </div>
            <div class="form-group">
              <label>Détails de la question</label>
              <textarea 
                v-model="newQuestion.content" 
                placeholder="Décrivez votre question en détails..."
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>Catégorie</label>
              <select v-model="newQuestion.category" required>
                <option value="">Choisir une catégorie</option>
                <option value="meteo">Météorologie</option>
                <option value="climat">Climatologie</option>
                <option value="instruments">Instruments météo</option>
                <option value="agriculture">Agriculture</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" @click="showQuestionForm = false" class="btn-cancel">
                Annuler
              </button>
              <button type="submit" class="btn-submit">
                Publier la question
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bouton Aide déplacé dans l'angle supérieur droit -->
      <button class="btn-help floating-help" @click="showHelp = true" title="Besoin d'aide ? Cliquez ici pour un guide illustré"><i class="fas fa-question-circle"></i> Aide</button>

      <!-- Modale d'aide -->
      <div class="modal" v-if="showHelp">
        <div class="modal-content help-modal">
          <div class="modal-header">
            <h3>Comment utiliser l'espace communautaire ?</h3>
            <button @click="showHelp = false" class="close-btn"><i class="fas fa-times"></i></button>
          </div>
          <div class="help-body">
            <ol>
              <li><b>1. Cherche une question :</b> Utilise la barre de recherche ou parcours les exemples ci-dessous.</li>
              <li><b>2. Pose ta question :</b> Clique sur le micro <i class='fas fa-microphone'></i> pour parler ou écris ta question.</li>
              <li><b>3. Lis les réponses :</b> Clique sur une question pour voir les réponses des autres membres.</li>
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
              placeholder="Rechercher des questions..." 
              v-model="searchQuery"
              title="Tape ici ta question ou un mot-clé"
            >
            <button @click="searchQuestions" title="Lancer la recherche">
              <i class="fas fa-search"></i>
            </button>
            <!-- Bouton micro pour question vocale -->
            <button class="btn-micro" title="Enregistrer une question à l'oral">
              <i class="fas fa-microphone"></i>
            </button>
          </div>
          
          <!-- Exemples de questions -->
          <div class="question-examples">
            <span>Exemples :</span>
            <ul>
              <li>Comment savoir s'il va pleuvoir demain ?</li>
              <li>Quels conseils pour semer le maïs cette saison ?</li>
              <li>Comment protéger mes cultures de la sécheresse ?</li>
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

        <!-- Liste des questions -->
        <div class="questions-list">
          <div 
            v-for="question in filteredQuestions" 
            :key="question.id" 
            class="question-card"
            :class="{ answered: question.answered, featured: question.featured }"
          >
            <div class="question-main">
              <div class="question-meta">
                <span class="category-badge" :class="question.category">
                  {{ formatCategory(question.category) }}
                </span>
                <span class="date">{{ formatDate(question.date) }}</span>
              </div>
              
              <h3 class="question-title">{{ question.title }}</h3>
              <p class="question-content">{{ question.content }}</p>
              
              <div class="question-author">
                <i class="fas fa-user-circle fa-2x" style="color: #b0bec5;"></i>
                <div class="author-info">
                  <span class="name">{{ question.author.name }}</span>
                  <span class="role">{{ question.author.role }}</span>
                </div>
              </div>
            </div>
            
            <div class="question-stats">
              <div class="stat">
                <i class="fas fa-comment"></i>
                <span>{{ question.answers }} réponses</span>
              </div>
              <div class="stat">
                <i class="fas fa-heart"></i>
                <span>{{ question.likes }} votes</span>
              </div>
              <button 
                class="btn-answer"
                @click="showAnswerForm(question.id)"
              >
                <i class="fas fa-reply"></i> Répondre
              </button>
            </div>
          </div>
        </div>

        <!-- Formulaire de réponse -->
        <div class="answer-form" v-if="showAnswerForQuestion">
          <h4>Votre réponse</h4>
          <textarea 
            v-model="newAnswer.content" 
            placeholder="Écrivez votre réponse détaillée ici..."
            rows="4"
          ></textarea>
          <div class="form-actions">
            <button @click="cancelAnswer" class="btn-cancel">
              Annuler
            </button>
            <button @click="submitAnswer" class="btn-submit">
              Publier la réponse
            </button>
          </div>
        </div>
      </main>

      <!-- Sidebar -->
      <!-- Section météo actuelle supprimée -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import guideCommunaute from '@/assets/images/ui/guide-communaute.svg'

// États
const showQuestionForm = ref(false)
const showAnswerForQuestion = ref(null)
const searchQuery = ref('')
const activeTab = ref('recent')
const weatherIcon = ref('fas fa-sun')
const showHelp = ref(false)
const selectedLang = ref('fr')

// Données
const newQuestion = ref({
  title: '',
  content: '',
  category: ''
})

const newAnswer = ref({
  content: ''
})

const stats = ref({
  questions: 124,
  answers: 543,
  members: 89
})

const tabs = ref([
  { value: 'recent', label: 'Récentes' },
  { value: 'unanswered', label: 'Sans réponse' },
  { value: 'popular', label: 'Populaires' },
  { value: 'featured', label: 'En vedette' }
])

const questions = ref([
  {
    id: 1,
    title: "Comment prévoir les orages en saison sèche ?",
    content: "Je cherche à comprendre les indicateurs météorologiques qui pourraient aider à prévoir les orages même pendant la saison sèche au Bénin.",
    category: "meteo",
    date: "2023-05-15T14:30:00",
    answered: true,
    featured: true,
    answers: 8,
    likes: 15,
    author: {
      id: 1,
      name: "Kofi Mensah",
      avatar: "/avatars/1.jpg",
      role: "Étudiant en météo"
    }
  },
  {
    id: 2,
    title: "Quels instruments pour mesurer l'humidité avec précision ?",
    content: "Quels sont les instruments les plus précis pour mesurer l'humidité relative dans un contexte de recherche climatique ?",
    category: "instruments",
    date: "2023-05-12T09:15:00",
    answered: false,
    featured: false,
    answers: 3,
    likes: 7,
    author: {
      id: 2,
      name: "Amina Diallo",
      avatar: "/avatars/2.jpg",
      role: "Chercheuse"
    }
  },
  {
    id: 3,
    title: "Impact du changement climatique sur les précipitations au Bénin",
    content: "Quelles sont les dernières études sur l'évolution des régimes de précipitations au Bénin ces 20 dernières années ?",
    category: "climat",
    date: "2023-05-10T16:45:00",
    answered: true,
    featured: true,
    answers: 12,
    likes: 24,
    author: {
      id: 3,
      name: "Dr. Jean Adékambi",
      avatar: "/avatars/3.jpg",
      role: "Climatologue"
    }
  },
  {
    id: 4,
    title: "Meilleures pratiques agricoles en période de sécheresse",
    content: "Quelles techniques agricoles recommanderiez-vous pour faire face aux longues périodes de sécheresse ?",
    category: "agriculture",
    date: "2023-05-08T11:20:00",
    answered: true,
    featured: false,
    answers: 5,
    likes: 9,
    author: {
      id: 4,
      name: "Fatou N'Diaye",
      avatar: "/avatars/4.jpg",
      role: "Agronome"
    }
  }
])

const activeMembers = ref([
  {
    id: 1,
    name: "Dr. Jean Adékambi",
    avatar: "/avatars/3.jpg",
    answers: 42,
    role: "Climatologue"
  },
  {
    id: 2,
    name: "Amina Diallo",
    avatar: "/avatars/2.jpg",
    answers: 28,
    role: "Chercheuse"
  },
  {
    id: 3,
    name: "Samuel Gbêto",
    avatar: "/avatars/5.jpg",
    answers: 19,
    role: "Météorologue"
  }
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
      return [...result].sort((a, b) => b.likes - a.likes)
    case 'featured':
      return result.filter(q => q.featured)
    default:
      return [...result].sort((a, b) => new Date(b.date) - new Date(a.date))
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

function searchQuestions() {
  // Logique de recherche
}

function submitQuestion() {
  const newQ = {
    id: questions.value.length + 1,
    title: newQuestion.value.title,
    content: newQuestion.value.content,
    category: newQuestion.value.category,
    date: new Date().toISOString(),
    answered: false,
    featured: false,
    answers: 0,
    likes: 0,
    author: {
      id: 10,
      name: "Moi",
      avatar: "/avatars/default.jpg",
      role: "Membre"
    }
  }
  
  questions.value.unshift(newQ)
  stats.value.questions++
  showQuestionForm.value = false
  newQuestion.value = { title: '', content: '', category: '' }
}

function showAnswerForm(questionId) {
  showAnswerForQuestion.value = questionId
  newAnswer.value = { content: '' }
}

function cancelAnswer() {
  showAnswerForQuestion.value = null
}

function submitAnswer() {
  const question = questions.value.find(q => q.id === showAnswerForQuestion.value)
  if (question) {
    question.answers++
    question.answered = true
    stats.value.answers++
  }
  cancelAnswer()
}
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

.btn-new-question {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);
}

.btn-new-question:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(52, 152, 219, 0.4);
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
  z-index: 100;
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

.question-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.question-card.answered {
  border-left: 4px solid #2ecc71;
}

.question-card.featured {
  border-left: 4px solid #f39c12;
}

.question-main {
  flex: 1;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.category-badge.meteo {
  background: #e1f0fa;
  color: #2980b9;
}

.category-badge.climat {
  background: #e1f7eb;
  color: #27ae60;
}

.category-badge.instruments {
  background: #f5eef8;
  color: #8e44ad;
}

.category-badge.agriculture {
  background: #fef5e7;
  color: #e67e22;
}

.question-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.question-content {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.question-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.question-author i {
  font-size: 2rem;
  color: #b0bec5;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info .name {
  font-weight: 500;
  color: #2c3e50;
}

.author-info .role {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.question-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 120px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.stat i {
  color: #3498db;
}

.btn-answer {
  background: #f1f5f9;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-answer:hover {
  background: #3498db;
  color: white;
}

.btn-answer i {
  color: inherit;
}

/* Formulaire de réponse */
.answer-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.answer-form h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.answer-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  min-height: 100px;
}

.answer-form textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
</style>