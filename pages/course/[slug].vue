<template>
  <div class="course-container">
    <div class="course-header">
      <h1 class="course-title">{{ course.title }}</h1>
      <p class="course-description">{{ course.description }}</p>
      <div v-if="course.videoUrl" class="video-container">
        <iframe 
          width="560" 
          height="315" 
          :src="course.videoUrl" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      </div>
      <div class="course-meta">
        <span class="duration">⏱️ {{ course.duration }}</span>
        <span class="level">📊 {{ course.level }}</span>
      </div>
    </div>

    <div class="course-content">
      <div v-for="(section, index) in course.sections" :key="index" class="section">
        <div class="section-header">
          <WeatherIcon :type="section.icon" size="large" />
          <h2>{{ section.title }}</h2>
        </div>
        
        <div class="section-content">
          <p>{{ section.description }}</p>
          
          <div v-if="section.funFact" class="fun-fact">
            <span class="fun-fact-icon">{{ section.funFactIcon }}</span>
            <p>{{ section.funFact }}</p>
          </div>

          <div v-if="section.features" class="features-grid">
            <div v-for="(feature, fIndex) in section.features" :key="fIndex" class="feature-card">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <span class="feature-icon">{{ feature.icon }}</span>
            </div>
          </div>

          <div v-if="section.activities" class="activities">
            <h3>Activités Pratiques</h3>
            <div v-for="(activity, aIndex) in section.activities" :key="aIndex" class="activity-card">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.description }}</p>
              <div class="activity-steps">
                <div v-for="(step, sIndex) in activity.steps" :key="sIndex" class="step">
                  <span class="step-number">{{ sIndex + 1 }}</span>
                  <p>{{ step }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="course-footer">
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>Progression : {{ progress }}%</p>
      </div>

      <div class="quiz-section">
        <div class="quiz-card">
          <h2>Testez vos connaissances</h2>
          <p>Passez le quiz pour vérifier votre compréhension du cours</p>
          <NuxtLink :to="`/course/quiz/${route.params.slug}`" class="quiz-button">
            Commencer le Quiz
            <span class="quiz-icon">📝</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import WeatherIcon from '~/components/WeatherIcon.vue'

const route = useRoute()
const progress = ref(25)

// Données des cours
const coursesData = {
  'secrets-du-ciel': {
    title: "Les Secrets du Ciel",
    description: "Un voyage interactif pour comprendre les phénomènes météorologiques quotidiens",
    duration: "30 minutes",
    level: "Niveau débutant",
    videoUrl: "https://www.youtube.com/embed/5YpcgS3pv0I",
    sections: [
      {
        title: "Le Mystère du Ciel Bleu",
        icon: "sun",
        description: "Saviez-vous que le ciel n'est pas vraiment bleu ? C'est une illusion créée par la façon dont la lumière du soleil interagit avec notre atmosphère !",
        funFact: "Le saviez-vous ? Si la Terre n'avait pas d'atmosphère, le ciel serait noir comme dans l'espace !",
        funFactIcon: "💡",
        features: [
          {
            title: "Aube",
            description: "Rose et orange",
            icon: "🌅"
          },
          {
            title: "Midi",
            description: "Bleu vif",
            icon: "☀️"
          },
          {
            title: "Crépuscule",
            description: "Orange et rouge",
            icon: "🌇"
          }
        ],
        activities: [
          {
            title: "Observer le Ciel",
            description: "Une activité simple pour comprendre les couleurs du ciel",
            steps: [
              "Regardez le ciel à différents moments de la journée",
              "Notez les couleurs que vous observez",
              "Comparez vos observations avec les explications du cours"
            ]
          }
        ]
      },
      {
        title: "La Formation des Nuages",
        icon: "cloud",
        description: "Les nuages sont comme des artistes dans le ciel. Ils peuvent prendre toutes les formes que votre imagination peut créer !",
        features: [
          {
            title: "Nuages Floconneux",
            description: "Comme des boules de coton dans le ciel",
            icon: "☁️"
          },
          {
            title: "Nuages Rayés",
            description: "Comme des vagues dans le ciel",
            icon: "⛅"
          },
          {
            title: "Nuages Orageux",
            description: "Comme des montagnes dans le ciel",
            icon: "⛈️"
          }
        ],
        activities: [
          {
            title: "Identifier les Nuages",
            description: "Apprenez à reconnaître les différents types de nuages",
            steps: [
              "Observez les nuages dans le ciel",
              "Essayez de les identifier selon leur forme",
              "Prenez des photos et créez votre propre collection"
            ]
          }
        ]
      }
    ]
  },
  'instruments-meteo': {
    title: "Les Instruments Météo",
    description: "Découvrez les outils qui nous aident à comprendre le temps qu'il fait",
    duration: "45 minutes",
    level: "Niveau intermédiaire",
    sections: [
      {
        title: "Le Thermomètre",
        icon: "thermometer",
        description: "Le thermomètre est comme un petit détective qui nous dit exactement combien il fait chaud ou froid !",
        funFact: "Le premier thermomètre a été inventé par Galilée en 1592 !",
        funFactIcon: "🌡️",
        features: [
          {
            title: "Matin",
            description: "Plus frais",
            icon: "🌅"
          },
          {
            title: "Après-midi",
            description: "Plus chaud",
            icon: "☀️"
          },
          {
            title: "Soir",
            description: "Plus frais",
            icon: "🌙"
          }
        ],
        activities: [
          {
            title: "Mesurer la Température",
            description: "Apprenez à utiliser un thermomètre",
            steps: [
              "Placez le thermomètre à l'ombre",
              "Attendez quelques minutes",
              "Notez la température à différents moments de la journée"
            ]
          }
        ]
      }
    ]
  }
}

// Récupérer le cours correspondant au slug
const course = computed(() => {
  return coursesData[route.params.slug] || {
    title: "Cours non trouvé",
    description: "Le cours que vous recherchez n'existe pas.",
    sections: []
  }
})
</script>

<style scoped>
.course-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.course-header {
  text-align: center;
  margin-bottom: 3rem;
}

.course-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.course-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.video-container {
  margin: 2rem 0;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  background: #000;
  border-radius: 8px;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.course-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #666;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #3498db;
  font-size: 1.8rem;
  margin: 0;
}

.section-content {
  color: #666;
  line-height: 1.6;
}

.fun-fact {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.fun-fact-icon {
  font-size: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 1.5rem;
  display: block;
  margin-top: 1rem;
}

.activities {
  margin-top: 2rem;
}

.activity-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.activity-steps {
  margin-top: 1rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.step-number {
  background: #3498db;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.course-footer {
  margin-top: 3rem;
}

.progress-section {
  text-align: center;
  margin-bottom: 2rem;
}

.progress-bar {
  background: #e9ecef;
  height: 8px;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress {
  background: linear-gradient(90deg, #3498db, #2ecc71);
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.quiz-section {
  text-align: center;
}

.quiz-card {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quiz-card h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.quiz-card p {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.quiz-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #3498db;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.quiz-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.quiz-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .course-container {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .course-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .quiz-card {
    padding: 1.5rem;
  }

  .quiz-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 