<template>
  <div class="quiz-page">
    <div class="quiz-container">
      <!-- Écran de sélection du mode -->
      <div v-if="!quizStarted" class="mode-selection">
        <div class="quiz-header">
          <h1>{{ $t('quizPage.modeSelection.title') }}</h1>
          <div class="quiz-mascotte">
            <img src="/assets/images/ui/mascotte-quiz.svg" alt="Mascotte Quiz" />
          </div>
        </div>
        
        <div class="mode-options">
          <button class="mode-card ia-mode" @click="startIaQuiz">
            <div class="mode-icon">
              <i class="fas fa-robot"></i>
            </div>
            <h3>{{ $t('quizPage.modeSelection.iaMode.title') }}</h3>
            <p>{{ $t('quizPage.modeSelection.iaMode.description') }}</p>
          </button>
          
          <div class="divider">
            <span>{{ $t('quizPage.modeSelection.or') }}</span>
          </div>
          
          <button class="mode-card classic-mode" @click="startClassicQuiz">
            <div class="mode-icon">
              <i class="fas fa-book"></i>
            </div>
            <h3>{{ $t('quizPage.modeSelection.classicMode.title') }}</h3>
            <p>{{ $t('quizPage.modeSelection.classicMode.description') }}</p>
          </button>
          
          <!-- Bouton de test temporaire -->
          <div class="divider">
            <span>{{ $t('quizPage.modeSelection.debug') }}</span>
          </div>
          
          <button class="mode-card test-mode" @click="testApi">
            <div class="mode-icon">
              <i class="fas fa-bug"></i>
            </div>
            <h3>{{ $t('quizPage.modeSelection.testMode.title') }}</h3>
            <p>{{ $t('quizPage.modeSelection.testMode.description') }}</p>
          </button>
        </div>
      </div>

      <!-- Mode Quiz IA -->
      <div v-else-if="iaMode" class="ia-quiz-flow">
        <!-- Écran de chargement IA -->
        <div v-if="iaStreaming" class="ia-thinking">
          <div class="thinking-bubble">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
            <p>{{ $t('quizPage.iaThinking.preparing') }}<br><strong>{{ currentCourse?.title || $t('quizPage.iaThinking.meteorology') }}</strong></p>
          </div>
          <img src="/assets/images/ui/mascotte-quiz.svg" class="mascotte" alt="Mascotte IA">
          <div class="streaming-text">{{ iaStreamingText }}</div>
        </div>

        <!-- Question IA en cours -->
        <div v-else-if="!quizFinished && iaQuestion" class="ia-question-screen">
          <!-- En-tête du cours -->
          <div v-if="currentCourse" class="course-header-quiz">
            <h2 class="course-title-quiz">{{ currentCourse.title }}</h2>
            <p class="course-instructor">{{ currentCourse.instructor }} • {{ currentCourse.duration }}</p>
          </div>

          <div class="quiz-progress">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
            </div>
            <div class="question-counter">
              <span class="current">{{ iaHistory.length + 1 }}</span>
              <span class="separator">/</span>
              <span class="total">5</span>
            </div>
          </div>

          <div class="question-card ia-card">
            <div class="question-header">
              <h2 class="question-text">{{ iaQuestion.question }}</h2>
              <button v-if="enableAudio" @click="readQuestion" class="audio-btn" :class="{ active: isReading }">
                <i class="fas fa-volume-up"></i>
              </button>
            </div>

            <!-- QCM IA avec options -->
            <div v-if="!iaAnswered" class="ia-options qcm-options">
              <button
                v-for="(choice, idx) in iaQuestion.choices"
                :key="idx"
                @click="selectAnswer(idx)"
                class="option-btn"
                :class="{ 'selected': selectedIaAnswer === idx }"
              >
                <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
                <span class="option-text">{{ choice }}</span>
              </button>
            </div>

            <!-- Réponse utilisateur -->
            <div v-if="!iaAnswered" class="user-answer-section">
              <div class="answer-input">
              <textarea
                v-model="iaUserAnswer"
                :placeholder="$t('quizPage.question.textAnswer')"
                  rows="2"
                  class="text-input"
              ></textarea>
                <div class="voice-controls">
                <button
                  @click="startSpeechToText"
                  class="voice-btn"
                  :class="{ active: isListening }"
                >
                  <i class="fas fa-microphone"></i>
                  {{ isListening ? $t('quizPage.question.listening') : $t('quizPage.question.voiceAnswer') }}
                </button>
                <button
                    @click="submitAnswer"
                  class="submit-btn"
                    :disabled="!canSubmit"
                >
                  {{ $t('quizPage.question.validate') }}
                </button>
                </div>
              </div>
            </div>

            <!-- Feedback IA -->
            <div v-if="iaAnswered" class="ia-feedback">
              <div class="feedback-header" :class="{ correct: iaCorrect, incorrect: !iaCorrect }">
                <div class="emoji">
                  {{ iaCorrect ? '🎯' : '💡' }}
                </div>
                <h3>{{ iaCorrect ? $t('quizPage.feedback.correct') : $t('quizPage.feedback.incorrect') }}</h3>
              </div>
              <div class="feedback-content">
                <p>{{ iaFeedback }}</p>
                <button @click="nextIaQuestion" class="next-btn">
                  {{ isLastIaQuestion ? $t('quizPage.question.seeResults') : $t('quizPage.question.nextQuestion') }}
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
            
            <!-- Bouton Suivant séparé pour plus de clarté -->
            <div v-if="iaAnswered" class="next-section">
              <button @click="nextIaQuestion" class="next-btn-large">
                <i class="fas fa-arrow-right"></i>
                {{ isLastIaQuestion ? $t('quizPage.question.seeMyResults') : $t('quizPage.question.nextQuestion') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Résultats IA -->
        <div v-else-if="quizFinished" class="ia-results">
          <div class="results-header">
            <h1>{{ $t('quizPage.results.title') }}</h1>
            <div class="mascotte-celebration">
              <img src="/assets/images/ui/mascotte-quiz.svg" alt="Mascotte">
              <div class="confetti"></div>
            </div>
          </div>

          <div class="score-display" :class="scoreClass">
            <div class="score-value">{{ iaScore }}/5</div>
            <div class="score-label">{{ $t('quizPage.results.finalScore') }}</div>
          </div>

          <div class="performance-message">
            <p v-if="iaScore === 5">{{ $t('quizPage.results.performance.perfect') }}</p>
            <p v-else-if="iaScore >= 4">{{ $t('quizPage.results.performance.excellent') }}</p>
            <p v-else-if="iaScore >= 3">{{ $t('quizPage.results.performance.good') }}</p>
            <p v-else>{{ $t('quizPage.results.performance.needsImprovement') }}</p>
          </div>

          <div class="result-actions">
            <button @click="restartIaQuiz" class="action-btn primary">
              <i class="fas fa-redo"></i> {{ $t('quizPage.results.actions.restart') }}
            </button>
            <button @click="changeQuizMode" class="action-btn secondary">
              <i class="fas fa-exchange-alt"></i> {{ $t('quizPage.results.actions.changeMode') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mode Quiz Classique -->
      <div v-else class="classic-quiz-flow">
        <div v-if="loadingClassicQuiz" class="loading-classic">
          <p>Chargement du quiz...</p>
        </div>
        <div v-else-if="!classicQuizExists" class="no-quiz-found">
          <p>Désolé, il n'y a pas de quiz classique pour ce cours pour le moment.</p>
           <button @click="changeQuizMode" class="action-btn secondary">
              <i class="fas fa-arrow-left"></i> Retour
            </button>
        </div>
        <div v-else-if="!classicQuizFinished" class="classic-question-screen">
            <div class="course-header-quiz">
              <h2 class="course-title-quiz">{{ classicQuiz.title }}</h2>
            </div>
            <div class="quiz-progress">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${classicProgressPercent}%` }"></div>
              </div>
              <div class="question-counter">
                <span class="current">{{ currentClassicQuestionIndex + 1 }}</span>
                <span class="separator">/</span>
                <span class="total">{{ classicQuiz.questions.length }}</span>
              </div>
            </div>
            <div v-if="currentClassicQuestion" class="question-card classic-card">
              <h2 class="question-text">{{ currentClassicQuestion.text }}</h2>
              <div class="qcm-options">
                <button
                  v-for="(option, index) in currentClassicQuestion.options"
                  :key="index"
                  @click="selectClassicAnswer(index)"
                  class="option-btn"
                  :class="{ 
                    'selected': classicUserAnswers[currentClassicQuestionIndex] === index,
                    'answered': classicUserAnswers[currentClassicQuestionIndex] !== undefined
                  }"
                  :disabled="classicUserAnswers[currentClassicQuestionIndex] !== undefined"
                >
                  <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                  <span class="option-text">{{ option.text }}</span>
                </button>
              </div>
              <div v-if="classicUserAnswers[currentClassicQuestionIndex] !== undefined" class="next-section">
                <button @click="nextClassicQuestion" class="next-btn-large" >
                  {{ isLastClassicQuestion ? 'Voir les résultats' : 'Question Suivante' }}
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
        </div>
        <div v-else class="classic-results">
            <div class="results-header">
              <h1>Résultats du Quiz</h1>
            </div>
            <div class="score-display" :class="classicScoreClass">
              <div class="score-value">{{ classicScore }}/{{ classicQuiz.questions.length }}</div>
              <div class="score-label">Score Final</div>
            </div>

            <div class="detailed-correction">
              <h3>Correction détaillée</h3>
              <div v-for="result in classicResultsDetails" :key="result.questionId" class="correction-item" :class="{ 'correct': result.isCorrect, 'incorrect': !result.isCorrect }">
                <p class="question-text">{{ result.questionText }}</p>
                <div class="user-answer">
                  <strong>Votre réponse :</strong> 
                  <span v-if="result.userAnswerIndex !== null">{{ String.fromCharCode(65 + result.userAnswerIndex) }}. {{ result.options[result.userAnswerIndex] }}</span>
                  <span v-else><i>Pas de réponse</i></span>
                </div>
                <div v-if="!result.isCorrect" class="correct-answer">
                  <strong>Réponse correcte :</strong> {{ String.fromCharCode(65 + result.correctAnswerIndex) }}. {{ result.options[result.correctAnswerIndex] }}
                </div>
                <p class="explanation">{{ result.explanation }}</p>
              </div>
            </div>

            <div class="result-actions">
              <button @click="restartClassicQuiz" class="action-btn primary">
                <i class="fas fa-redo"></i> Recommencer
              </button>
              <button @click="changeQuizMode" class="action-btn secondary">
                <i class="fas fa-exchange-alt"></i> Changer de mode
              </button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const courseId = route.params.id
const authStore = useAuthStore()
const { t } = useI18n()

// États du quiz
const quizStarted = ref(false)
const quizFinished = ref(false)
const iaMode = ref(false)
const iaQuestion = ref(null)
const iaUserAnswer = ref('')
const selectedIaAnswer = ref(null)
const iaAnswered = ref(false)
const iaCorrect = ref(false)
const iaFeedback = ref('')
const iaScore = ref(0)
const iaHistory = ref([])
const iaStreaming = ref(false)
const iaStreamingText = ref('')
const isListening = ref(false)
const isReading = ref(false)
const enableAudio = ref(true)
const quizTopic = ref('Météorologie de base')

// États pour le quiz classique
const loadingClassicQuiz = ref(false)
const classicQuiz = ref(null)
const classicQuizExists = ref(true)
const currentClassicQuestionIndex = ref(0)
const classicUserAnswers = ref([])
const classicScore = ref(0)
const classicQuizFinished = ref(false)
const classicResultsDetails = ref(null)

// Données des cours (copiées depuis pages/course/[id].vue)
const coursesData = {
  'introduction-meteo': {
    id: 'introduction-meteo',
    title: 'Introduction à la Météorologie',
    instructor: 'Agence de Météo',
    duration: '20 minutes',
    lessons: [
      {
        id: 1,
        title: 'Les Bases de la Météorologie',
        content: `
          <h3>Qu'est-ce que la météorologie ?</h3>
          <p>La météorologie est la science qui étudie les phénomènes atmosphériques et les prévisions du temps.</p>
          
          <h4>Points clés à retenir</h4>
          <ul>
            <li>Définition de la météorologie</li>
            <li>Importance des prévisions météo</li>
            <li>Instruments de base</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Lire une Carte Météo',
        content: `
          <h3>Comprendre les symboles météo</h3>
          <p>Apprenez à décoder les symboles et les informations sur une carte météorologique.</p>
        `
      }
    ]
  },
  'secrets-du-ciel': {
    id: 'secrets-du-ciel',
    title: 'Les Secrets du Ciel',
    instructor: 'Agence de Météo',
    duration: '30 minutes',
    lessons: [
      {
        id: 1,
        title: 'Le Mystère du Ciel Bleu',
        content: `
          <h3>Pourquoi le ciel est-il bleu ?</h3>
          <p>Le ciel nous apparaît bleu à cause d'un phénomène appelé diffusion de Rayleigh. La lumière du soleil, qui est blanche, est composée de toutes les couleurs de l'arc-en-ciel.</p>
          
          <h4>Points clés à retenir</h4>
          <ul>
            <li>La lumière du soleil est blanche</li>
            <li>Les molécules de l'air diffusent la lumière</li>
            <li>La couleur bleue est plus diffusée que les autres</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Les Nuages et leurs Formes',
        content: `
          <h3>Les différents types de nuages</h3>
          <p>Les nuages sont classés selon leur forme et leur altitude. Chaque type de nuage nous donne des informations sur le temps qu'il va faire.</p>
        `
      }
    ]
  },
  'instruments-meteo': {
    id: 'instruments-meteo',
    title: 'Les Instruments Météo',
    instructor: 'Agence de Météo',
    duration: '45 minutes',
    lessons: [
      {
        id: 1,
        title: 'Le Thermomètre',
        content: `
          <h3>Comment fonctionne un thermomètre ?</h3>
          <p>Le thermomètre est l'instrument le plus connu pour mesurer la température. Découvrez son fonctionnement et son histoire.</p>
        `
      },
      {
        id: 2,
        title: 'L\'Anémomètre',
        content: `
          <h3>Mesurer la vitesse du vent</h3>
          <p>L'anémomètre est l'instrument qui nous permet de mesurer la vitesse du vent. Apprenez à l'utiliser et à interpréter ses mesures.</p>
        `
      }
    ]
  },
  'saisons': {
    id: 'saisons',
    title: 'Les Saisons',
    instructor: 'Agence de Météo',
    duration: '40 minutes',
    lessons: [
      {
        id: 1,
        title: 'Le Printemps',
        content: `
          <h3>Le réveil de la nature</h3>
          <p>Le printemps est la saison du renouveau. Découvrez les changements météorologiques qui caractérisent cette période.</p>
        `
      },
      {
        id: 2,
        title: 'L\'Été',
        content: `
          <h3>Les journées ensoleillées</h3>
          <p>L'été est la saison la plus chaude. Apprenez à comprendre les phénomènes météorologiques estivaux.</p>
        `
      },
      {
        id: 3,
        title: 'L\'Automne',
        content: `
          <h3>Les couleurs de l'automne</h3>
          <p>L'automne est la saison des changements. Découvrez les particularités météorologiques de cette période.</p>
        `
      },
      {
        id: 4,
        title: 'L\'Hiver',
        content: `
          <h3>Le froid et la neige</h3>
          <p>L'hiver est la saison la plus froide. Apprenez à comprendre les phénomènes météorologiques hivernaux.</p>
        `
      }
    ]
  },
  'phenomenes-meteo': {
    id: 'phenomenes-meteo',
    title: 'Les Phénomènes Météo',
    instructor: 'Agence de Météo',
    duration: '50 minutes',
    lessons: [
      {
        id: 1,
        title: 'Les Orages',
        content: `
          <h3>Comprendre les orages</h3>
          <p>Les orages sont des phénomènes météorologiques spectaculaires. Découvrez leur formation et leurs caractéristiques.</p>
        `
      },
      {
        id: 2,
        title: 'Les Arc-en-ciel',
        content: `
          <h3>La magie des arc-en-ciel</h3>
          <p>Les arc-en-ciel sont de magnifiques phénomènes optiques. Apprenez comment ils se forment et pourquoi nous voyons leurs couleurs.</p>
        `
      },
      {
        id: 3,
        title: 'La Neige',
        content: `
          <h3>La formation de la neige</h3>
          <p>La neige est un phénomène météorologique fascinant. Découvrez comment se forment les flocons et pourquoi chaque flocon est unique.</p>
        `
      }
    ]
  }
}

// Récupérer le cours actuel
const currentCourse = computed(() => coursesData[courseId] || null)
const courseContent = computed(() => {
  if (!currentCourse.value) return ''
  
  // Extraire le contenu de toutes les leçons
  const allContent = currentCourse.value.lessons.map(lesson => {
    // Nettoyer le HTML et extraire le texte
    const cleanContent = lesson.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return `${lesson.title}: ${cleanContent}`
  }).join('. ')
  
  return allContent
})

// Calculs
const progressPercent = computed(() => {
  if (quizFinished.value) return 100
  return (iaHistory.value.length / 5) * 100
})
const isLastIaQuestion = computed(() => {
  return iaHistory.value.length === 4 // 5 questions au total (0 à 4)
})
const canSubmit = computed(() => selectedIaAnswer.value !== null || iaUserAnswer.value.trim() !== '')
const scoreClass = computed(() => {
  if (iaScore.value === 5) return 'perfect'
  if (iaScore.value >= 4) return 'excellent'
  if (iaScore.value >= 3) return 'good'
  return 'average'
})

const currentClassicQuestion = computed(() => {
  if (classicQuiz.value && classicQuiz.value.questions) {
    return classicQuiz.value.questions[currentClassicQuestionIndex.value]
  }
  return null
})

const classicProgressPercent = computed(() => {
  if (!classicQuiz.value || !classicQuiz.value.questions.length) return 0;
  return ((currentClassicQuestionIndex.value + 1) / classicQuiz.value.questions.length) * 100;
});

const isLastClassicQuestion = computed(() => {
  if (!classicQuiz.value || !classicQuiz.value.questions) return false
  return currentClassicQuestionIndex.value === classicQuiz.value.questions.length - 1
})

const classicScoreClass = computed(() => {
  const score = classicScore.value;
  const total = classicQuiz.value?.questions.length;
  if (total === 0) return 'average';
  const percentage = (score / total) * 100;
  if (percentage >= 80) return 'good'; // Similaire à 'excellent'
  if (percentage >= 50) return 'average';
  return 'average'; // Pour les scores faibles
});

// Méthodes
function startIaQuiz() {
  quizStarted.value = true
  iaMode.value = true
  iaScore.value = 0
  iaHistory.value = []
  fetchIaQuestion()
}

async function startClassicQuiz() {
  quizStarted.value = true
  iaMode.value = false
  loadingClassicQuiz.value = true
  
  try {
    const quizData = await $fetch(`/api/courses/${courseId}/quiz`)
    if (quizData.classicQuizExists) {
      classicQuiz.value = quizData
      classicUserAnswers.value = new Array(quizData.questions.length).fill(undefined)
      classicQuizExists.value = true
    } else {
      classicQuizExists.value = false
    }
  } catch (error) {
    console.error("Erreur lors du chargement du quiz classique:", error)
    classicQuizExists.value = false // Afficher un message d'erreur
  } finally {
    loadingClassicQuiz.value = false
  }
}

const fetchIaQuestion = async () => {
  if (!authStore.isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    navigateTo('/login')
    return
  }

  // Réinitialiser l'état pour la nouvelle question
  iaAnswered.value = false
  selectedIaAnswer.value = null
  iaUserAnswer.value = ''
  iaQuestion.value = null
  
  iaStreaming.value = true
  
  // Construction du prompt pour l'IA
  const prompt = `
    Tu es un expert en météorologie spécialisé sur le Bénin. Ton mode de réponse est JSON. Génère UNIQUEMENT un objet JSON valide.
    
    RÈGLES STRICTES :
    - Le JSON doit être parfait et suivre scrupuleusement le format demandé.
    - N'inclus aucun texte, commentaire, ou explication en dehors de l'objet JSON.
    - Le format JSON doit être exactement comme suit :
      {
        "question": "Une question claire et précise sur la météorologie, spécifiquement liée au contexte du Bénin et au cours suivi.",
        "choices": ["Choix A", "Choix B", "Choix C", "Choix D"],
        "answerIndex": 0,
        "explanation": "Une brève explication (1-2 phrases) sur la bonne réponse."
      }

    CONTEXTE DU QUIZ :
    - PAYS : Bénin.
    - COURS ACTUEL : "${currentCourse.value?.title || 'Météorologie générale'}"
    - CONTENU DU COURS : "${courseContent.value || 'Concepts généraux de météorologie'}"
    - HISTORIQUE DES QUESTIONS (ne pas les répéter) : ${JSON.stringify(iaHistory.value.map(h => h.question))}
    
    INSTRUCTION :
    Crée une nouvelle question unique et pertinente basée sur le contenu du cours, en l'appliquant au contexte béninois.
  `

  try {
    const finalJson = await $fetch('/api/quiz-ia-stream', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'x-user-email': authStore.user.email
      },
      body: { 
        messages: [{ role: 'user', content: prompt }]
      }
    })

    if (finalJson.error) {
      throw new Error(finalJson.error)
    }

    iaQuestion.value = finalJson
    
  } catch (error) {
    console.error('Error fetching IA question:', error)
    iaQuestion.value = {
      question: t('quizPage.errors.iaQuestionFetchError'),
      choices: [],
      error: true
    }
  } finally {
    iaStreaming.value = false
  }
}

function selectAnswer(index) {
  console.log('selectAnswer called with index:', index);
  selectedIaAnswer.value = index;
  iaUserAnswer.value = '';
  console.log('selectedIaAnswer set to:', selectedIaAnswer.value);
  console.log('canSubmit now:', canSubmit.value);
  submitAnswer();
}

async function submitAnswer() {
  console.log('submitAnswer called');
  console.log('canSubmit:', canSubmit.value);
  console.log('selectedIaAnswer:', selectedIaAnswer.value);
  console.log('iaUserAnswer:', iaUserAnswer.value);
  
  if (!canSubmit.value) {
    console.log('Cannot submit - no answer provided');
    return;
  }
  
  iaAnswered.value = true;
  console.log('iaAnswered set to true');
  
  // Détermine la réponse de l'utilisateur
  let userResponse = '';
  if (selectedIaAnswer.value !== null) {
    userResponse = `L'utilisateur a sélectionné l'option ${String.fromCharCode(65 + selectedIaAnswer.value)}: ${iaQuestion.value.choices[selectedIaAnswer.value]}`;
    console.log('User selected option:', selectedIaAnswer.value);
  } else if (iaUserAnswer.value.trim()) {
    userResponse = `L'utilisateur a répondu par texte: "${iaUserAnswer.value}"`;
    console.log('User answered by text:', iaUserAnswer.value);
  }
  
  // Vérifie si la réponse est correcte
  let isCorrect = false;
  if (selectedIaAnswer.value !== null) {
    // Cas 1: L'utilisateur a cliqué sur une option
    isCorrect = selectedIaAnswer.value === iaQuestion.value.answerIndex;
  } else if (iaUserAnswer.value.trim()) {
    // Cas 2: L'utilisateur a répondu par texte ou voix
    const userAnswer = iaUserAnswer.value.trim().toLowerCase();
    const choicesLower = iaQuestion.value.choices.map(c => c.trim().toLowerCase());
    
    // Recherche une correspondance exacte, puis une correspondance partielle.
    let matchedChoiceIndex = choicesLower.findIndex(c => c === userAnswer);
    if (matchedChoiceIndex === -1) {
      matchedChoiceIndex = choicesLower.findIndex(c => userAnswer.includes(c));
    }
    
    if (matchedChoiceIndex !== -1) {
      isCorrect = matchedChoiceIndex === iaQuestion.value.answerIndex;
    }
  }
  iaCorrect.value = isCorrect;
  console.log('Answer correct:', iaCorrect.value);
  console.log('Expected answer:', iaQuestion.value.answerIndex);
  
  // Feedback
  if (iaCorrect.value) {
    iaFeedback.value = t('quizPage.feedback.excellent');
  } else {
    // Utilise l'explication fournie par l'IA, avec un fallback
    iaFeedback.value = iaQuestion.value.explanation || `${t('quizPage.feedback.wrongAnswer')} ${String.fromCharCode(65 + iaQuestion.value.answerIndex)}: ${iaQuestion.value.choices[iaQuestion.value.answerIndex]}.`;
  }
  
  // Met à jour le score
  if (iaCorrect.value) {
    iaScore.value++;
    console.log('Score updated:', iaScore.value);
  }
  
  // Ajoute à l'historique
  iaHistory.value.push({
    ...iaQuestion.value,
    userAnswer: userResponse,
    correct: iaCorrect.value
  });
  
  console.log('Question added to history');
  console.log('History length now:', iaHistory.value.length);
  console.log('Is last question:', isLastIaQuestion.value);
}

function nextIaQuestion() {
  console.log('=== nextIaQuestion called ===');
  console.log('iaHistory.length:', iaHistory.value.length);
  console.log('isLastIaQuestion:', isLastIaQuestion.value);
  
  if (isLastIaQuestion.value) {
    console.log('Setting quizFinished to true');
    quizFinished.value = true;
    
    // Sauvegarder les résultats du quiz
    saveQuizResults();
  } else {
    console.log('Fetching next question');
    fetchIaQuestion()
  }
}

async function saveQuizResults() {
  try {
    // Récupérer l'utilisateur connecté depuis le store
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated || !authStore.user) {
      console.log('Utilisateur non connecté, résultats non sauvegardés');
      return;
    }

    // Récupérer l'ID du cours depuis l'URL
    const courseId = route.params.id;
    
    // Sauvegarder le résultat
    const response = await $fetch('/api/quiz/save-result', {
      method: 'POST',
      body: {
        userId: authStore.user.id,
        courseId: courseId,
        score: iaScore.value,
        maxScore: 5
      }
    });

    console.log('Résultats sauvegardés:', response);

    // Afficher une notification si un certificat a été obtenu
    if (response.earnedCertificate && response.certificate) {
      const percentage = response.certificate.percentage;
      const message = `🎉 Félicitations ! Vous avez obtenu un certificat avec un score de ${percentage.toFixed(1)}% !`;
      
      // Afficher une notification ou une alerte
      setTimeout(() => {
        alert(message);
      }, 1000);
    }

  } catch (error) {
    console.error('Erreur lors de la sauvegarde des résultats:', error);
  }
}

function restartIaQuiz() {
  quizStarted.value = false;
  iaMode.value = false;
  quizFinished.value = false;
  iaScore.value = 0;
  iaHistory.value = [];
}

function changeQuizMode() {
  quizStarted.value = false;
  iaMode.value = false;
  quizFinished.value = false;
}

function startSpeechToText() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert($t('quizPage.errors.speechNotSupported'));
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onstart = () => {
    isListening.value = true;
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    iaUserAnswer.value = transcript;
    selectedIaAnswer.value = null; // Désélectionne l'option si l'utilisateur parle
    submitAnswer(); // Validation automatique après la voix
  };
  
  recognition.onend = () => {
    isListening.value = false;
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening.value = false;
  };
  
  recognition.start();
}

function readQuestion() {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(iaQuestion.value.question);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    
    utterance.onstart = () => {
      isReading.value = true;
    };
    
    utterance.onend = () => {
      isReading.value = false;
    };
    
    speechSynthesis.speak(utterance);
  }
}

async function testApi() {
  console.log('=== Testing API Configuration ===');
  
  try {
    // Test de l'endpoint de test d'environnement
    const testResponse = await fetch('/api/env-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    console.log('Test response status:', testResponse.status);
    console.log('Test response ok:', testResponse.ok);
    
    const testResult = await testResponse.json();
    console.log('ENV Test result:', testResult);
    
    if (testResult.success) {
      let message = '🔍 Test des variables d\'environnement:\n\n';
      message += `NUXT_OPENROUTER_API_KEY: ${testResult.envVars.NUXT_OPENROUTER_API_KEY}\n`;
      message += `OPENROUTER_API_KEY: ${testResult.envVars.OPENROUTER_API_KEY}\n`;
      message += `Runtime Config: ${testResult.envVars.runtimeConfigKey}\n\n`;
      
      if (testResult.apiKeyLength > 0) {
        message += `✅ Clé API détectée !\nLongueur: ${testResult.apiKeyLength}\nDébut: ${testResult.apiKeyStart}`;
      } else {
        message += '❌ Aucune clé API détectée';
      }
      
      alert(message);
    } else {
      alert(`❌ Erreur de test: ${testResult.error}`);
    }
    
  } catch (error) {
    console.error('Test API error:', error);
    alert(`❌ Erreur de test: ${error.message}\n\nVérifiez que le serveur fonctionne.`);
  }
}

function selectClassicAnswer(index) {
  if (classicUserAnswers.value[currentClassicQuestionIndex.value] === undefined) {
    // Utilisation de splice pour garantir la réactivité de Vue
    classicUserAnswers.value.splice(currentClassicQuestionIndex.value, 1, index);
  }
}

async function nextClassicQuestion() {
  if (isLastClassicQuestion.value) {
    await submitClassicQuiz();
    classicQuizFinished.value = true
  } else {
    currentClassicQuestionIndex.value++
  }
}

async function submitClassicQuiz() {
  try {
    const answersPayload = classicQuiz.value.questions.map((q, index) => ({
      questionId: q.id,
      answerIndex: classicUserAnswers.value[index],
    }));

    const resultData = await $fetch('/api/quiz/submit-classic', {
      method: 'POST',
      body: {
        quizId: classicQuiz.value.id,
        answers: answersPayload,
      }
    });

    classicScore.value = resultData.score;
    classicResultsDetails.value = resultData.results;

  } catch (error) {
    console.error("Erreur lors de la soumission du quiz:", error);
    // Gérer l'erreur, par exemple afficher un message à l'utilisateur
  }
}

function restartClassicQuiz() {
  classicQuizFinished.value = false
  currentClassicQuestionIndex.value = 0
  if(classicQuiz.value) {
    classicUserAnswers.value = new Array(classicQuiz.value.questions.length).fill(undefined)
  }
  classicScore.value = 0
  classicResultsDetails.value = null
}

// Initialisation
onMounted(() => {
  // Initialisation si nécessaire
})
</script>

<style scoped>
/* Variables de couleurs */
:root {
  --primary: #1976d2;
  --primary-light: #e3f2fd;
  --primary-dark: #1565c0;
  --success: #43a047;
  --success-light: #e8f5e9;
  --error: #e53935;
  --error-light: #ffebee;
  --warning: #fb8c00;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
  --bg-gradient: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

/* Styles de base */
.quiz-page {
  min-height: 100vh;
  background: var(--bg-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.quiz-container {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.15);
  padding: 3rem;
  max-width: 520px;
  width: 100%;
  position: relative;
  overflow: hidden;
}
@media (min-width: 900px) {
  .quiz-container {
    max-width: 1100px;
    padding: 2.5rem 3rem;
  }
}

/* Sélection du mode */
.mode-selection {
  text-align: center;
}

.quiz-header h1 {
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.quiz-mascotte {
  margin: 0 auto 1.5rem;
  width: 100px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
@media (min-width: 900px) {
  .mode-options {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 2rem;
    width: 100%;
  }
  .mode-card {
    min-width: 0;
    max-width: none;
    flex: 1 1 0%;
    width: 100%;
  }
}

.mode-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.mode-card.ia-mode {
  border-color: var(--primary);
}

.mode-card.ia-mode:hover {
  background: var(--primary-light);
}

.mode-card.classic-mode {
  border-color: #a5d6a7;
}

.mode-card.classic-mode:hover {
  background: #f1f8e9;
}

.mode-card.test-mode {
  border-color: #ff9800;
}

.mode-card.test-mode:hover {
  background: #fff3e0;
}

.mode-icon {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

.mode-card h3 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.mode-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.divider {
  position: relative;
  margin: 1rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.divider::before, .divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #e2e8f0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

/* IA Thinking Screen */
.ia-thinking {
  text-align: center;
  padding: 2rem 0;
}

.thinking-bubble {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  width: 80%;
  margin: 0 auto 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.thinking-bubble::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 15px 15px 0;
  border-style: solid;
  border-color: white transparent transparent;
}

.typing-indicator {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 1rem;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

.mascotte {
  width: 120px;
  margin-top: 1.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.streaming-text {
  font-family: monospace;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  text-align: left;
  max-height: 120px;
  overflow-y: auto;
  font-size: 0.9rem;
}

/* IA Question Screen */
.ia-question-screen {
  max-width: 800px;
  margin: 0 auto;
}

.course-header-quiz {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 12px;
  border: 1px solid #e1f5fe;
}

.course-title-quiz {
  font-size: 1.4rem;
  color: var(--primary);
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.course-instructor {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

.quiz-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.progress-track {
  flex: 1;
  height: 8px;
  background: #edf2f7;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #2196f3);
  transition: width 0.4s ease;
}

.question-counter {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--primary);
}

.question-counter .current {
  font-size: 1.2rem;
}

.question-counter .separator {
  margin: 0 4px;
  opacity: 0.6;
}

.question-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.ia-card {
  border: 2px solid var(--primary-light);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.question-text {
  font-size: 1.25rem;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
  flex: 1;
}

.audio-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 1.2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.audio-btn:hover {
  background: var(--primary-light);
}

.audio-btn.active {
  color: white;
  background: var(--primary);
  animation: pulse 1.5s infinite;
}

/* Options de réponse */
.ia-options {
  margin-top: 1.5rem;
}

.qcm-options {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: 1fr;
}
@media (min-width: 900px) {
  .qcm-options {
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
  }
}

.option-btn {
  display: flex;
  align-items: center;
  padding: 1rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--primary);
  background: var(--primary-light);
}

.option-btn.selected {
  border-color: var(--primary);
  background: var(--primary-light);
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.9;
}

.option-letter {
  font-weight: bold;
  color: var(--primary);
  width: 24px;
  height: 24px;
  background: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
}

/* Réponse utilisateur */
.user-answer-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.answer-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.text-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  resize: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.text-input:focus {
  outline: none;
  border-color: var(--primary);
}

.voice-controls {
  display: flex;
  gap: 0.8rem;
}

.voice-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background: white;
  border: 2px solid #4caf50;
  border-radius: 8px;
  color: #4caf50;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.voice-btn:hover {
  background: #e8f5e9;
}

.voice-btn.active {
  background: #4caf50;
  color: white;
  animation: pulse 1.5s infinite;
}

.submit-btn {
  padding: 0.8rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: var(--primary-dark);
}

.submit-btn:disabled {
  background: #90caf9;
  cursor: not-allowed;
}

/* Feedback IA */
.ia-feedback {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
}

.feedback-header.correct {
  background: #e8f5e9;
  color: #2e7d32;
}

.feedback-header.incorrect {
  background: #fff3e0;
  color: #e65100;
}

.emoji {
  font-size: 1.5rem;
}

.feedback-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.feedback-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.next-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.next-btn:hover {
  background: var(--primary-dark);
}

/* Résultats IA */
.ia-results {
  text-align: center;
  padding: 1rem;
}

.results-header h1 {
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

.mascotte-celebration {
  position: relative;
  width: 140px;
  margin: 0 auto 1.5rem;
}

.confetti {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path fill="%23FFD700" d="M5,0 L6,3 L9,3 L6.5,5 L7.5,8 L5,6 L2.5,8 L3.5,5 L1,3 L4,3 Z"/></svg>');
  background-size: 15px 15px;
  opacity: 0;
  animation: confetti-fall 3s ease-out forwards;
}

@keyframes confetti-fall {
  0% { opacity: 0; transform: translateY(-20px); }
  20% { opacity: 1; }
  100% { opacity: 1; transform: translateY(20px); }
}

.score-display {
  margin: 2rem auto;
  position: relative;
}

.score-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.score-display.perfect .score-value {
  color: #4caf50;
}

.score-display.excellent .score-value {
  color: #2196f3;
}

.score-display.good .score-value {
  color: #ff9800;
}

.score-display.average .score-value {
  color: #f44336;
}

.score-label {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.performance-message {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-weight: 500;
}

.result-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-btn {
  flex: 1;
  padding: 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: var(--primary);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.action-btn.secondary:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 600px) {
  .quiz-container {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .mode-card {
    padding: 1.2rem;
  }
  
  .question-text {
    font-size: 1.1rem;
  }
  
  .option-btn {
    padding: 0.8rem;
  }
  
  .score-value {
    font-size: 2.8rem;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .voice-controls {
    flex-direction: column;
  }
}

/* Section Suivant */
.next-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.next-btn-large {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  padding: 1.2rem 1.8rem;
  background: linear-gradient(90deg, #1976d2 60%, #43a047 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-btn-large:hover {
  background: linear-gradient(90deg, #1565c0 60%, #388e3c 100%);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 10px 32px rgba(25, 118, 210, 0.25);
}

.next-btn-large:active {
  transform: translateY(0) scale(0.98);
}

.question-image-container {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  display: block;
}

.classic-results .results-header {
  text-align: center;
  margin-bottom: 2rem;
}

.classic-results .score-display {
  width: 180px;
  height: 180px;
  margin: 0 auto 2rem auto;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(145deg, #4caf50, #81c784);
}

.classic-results .score-display.average {
  background: linear-gradient(145deg, #fb8c00, #ffb74d);
}
.classic-results .score-display.good {
  background: linear-gradient(145deg, #2196f3, #64b5f6);
}

.classic-results .score-value {
  font-size: 3rem;
  font-weight: 700;
}

.classic-results .score-label {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.9;
}

.detailed-correction {
  margin-top: 3rem;
}

.detailed-correction h3 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.correction-item {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 5px solid;
  transition: all 0.3s ease;
}

.correction-item.correct {
  border-color: var(--success);
}

.correction-item.incorrect {
  border-color: var(--error);
}

.correction-item .question-text {
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.correction-item .user-answer,
.correction-item .correct-answer {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
}

.correction-item .user-answer::before,
.correction-item .correct-answer::before {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 1.2rem;
}

.correction-item.correct .user-answer::before {
  content: '\f058'; /* fa-check-circle */
  color: var(--success);
}

.correction-item.incorrect .user-answer::before {
  content: '\f057'; /* fa-times-circle */
  color: var(--error);
}

.correction-item .correct-answer::before {
    content: '\f058'; /* fa-check-circle */
    color: var(--success);
}

.explanation {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  font-style: italic;
  color: var(--text-secondary);
  border: 1px solid #e2e8f0;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}
</style>  