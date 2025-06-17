<template>
  <div class="course-container">
    <div class="course-header">
      <h1>Introduction à la Météorologie</h1>
      <div class="course-meta">
        <span><i class="fas fa-clock"></i> 1h 30min</span>
        <span><i class="fas fa-book"></i> 5 leçons</span>
        <span><i class="fas fa-user"></i> Dr. Jean Dupont</span>
      </div>
    </div>

    <div class="lessons-container">
      <!-- Leçon 1 -->
      <div class="lesson-card">
        <div class="lesson-header">
          <h2>1. Les bases de l'atmosphère</h2>
          <span class="duration"><i class="fas fa-clock"></i> 20 min</span>
        </div>
        <div class="lesson-content">
          <img src="/images/courses/atmosphere.jpg" alt="Structure de l'atmosphère" class="lesson-image">
          <div class="lesson-text">
            <h3>Comprendre notre atmosphère</h3>
            <p>L'atmosphère terrestre est une couche de gaz qui entoure notre planète. Elle est composée de plusieurs couches distinctes, chacune ayant ses propres caractéristiques :</p>
            <ul>
              <li><strong>Troposphère</strong> : La couche la plus proche de la surface, où se produisent la plupart des phénomènes météorologiques</li>
              <li><strong>Stratosphère</strong> : Contient la couche d'ozone qui nous protège des rayons UV</li>
              <li><strong>Mésosphère</strong> : La couche la plus froide de l'atmosphère</li>
              <li><strong>Thermosphère</strong> : La couche la plus chaude, où se produisent les aurores boréales</li>
            </ul>
            <div class="key-points">
              <h4>Points clés à retenir :</h4>
              <ul>
                <li>La composition de l'atmosphère (78% azote, 21% oxygène)</li>
                <li>Le rôle de chaque couche atmosphérique</li>
                <li>L'importance de l'atmosphère pour la vie sur Terre</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Leçon 2 -->
      <div class="lesson-card">
        <div class="lesson-header">
          <h2>2. Les instruments météorologiques</h2>
          <span class="duration"><i class="fas fa-clock"></i> 15 min</span>
        </div>
        <div class="lesson-content">
          <img src="/images/courses/instruments.jpg" alt="Instruments météorologiques" class="lesson-image">
          <div class="lesson-text">
            <h3>Les outils de mesure du temps</h3>
            <p>Les météorologues utilisent différents instruments pour mesurer les conditions atmosphériques :</p>
            <div class="instruments-grid">
              <div class="instrument">
                <h4><i class="fas fa-temperature-high"></i> Thermomètre</h4>
                <p>Mesure la température de l'air</p>
              </div>
              <div class="instrument">
                <h4><i class="fas fa-wind"></i> Anémomètre</h4>
                <p>Mesure la vitesse du vent</p>
              </div>
              <div class="instrument">
                <h4><i class="fas fa-tint"></i> Pluviomètre</h4>
                <p>Mesure les précipitations</p>
              </div>
              <div class="instrument">
                <h4><i class="fas fa-compress-arrows-alt"></i> Baromètre</h4>
                <p>Mesure la pression atmosphérique</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leçon 3 -->
      <div class="lesson-card">
        <div class="lesson-header">
          <h2>3. Les nuages et leurs types</h2>
          <span class="duration"><i class="fas fa-clock"></i> 20 min</span>
        </div>
        <div class="lesson-content">
          <img src="/images/courses/nuages.jpg" alt="Types de nuages" class="lesson-image">
          <div class="lesson-text">
            <h3>Classification des nuages</h3>
            <p>Les nuages sont classés selon leur forme et leur altitude :</p>
            <div class="cloud-types">
              <div class="cloud-type">
                <h4>Nuages bas</h4>
                <ul>
                  <li>Stratus : couche grise uniforme</li>
                  <li>Cumulus : nuages blancs et cotonneux</li>
                  <li>Stratocumulus : couche de nuages gris</li>
                </ul>
              </div>
              <div class="cloud-type">
                <h4>Nuages moyens</h4>
                <ul>
                  <li>Altocumulus : petits nuages blancs en groupes</li>
                  <li>Altostratus : voile gris uniforme</li>
                </ul>
              </div>
              <div class="cloud-type">
                <h4>Nuages hauts</h4>
                <ul>
                  <li>Cirrus : filaments blancs fins</li>
                  <li>Cirrocumulus : petits nuages blancs en groupes</li>
                  <li>Cirrostratus : voile transparent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leçon 4 -->
      <div class="lesson-card">
        <div class="lesson-header">
          <h2>4. Les précipitations</h2>
          <span class="duration"><i class="fas fa-clock"></i> 15 min</span>
        </div>
        <div class="lesson-content">
          <img src="/images/courses/precipitations.jpg" alt="Types de précipitations" class="lesson-image">
          <div class="lesson-text">
            <h3>Les différentes formes de précipitations</h3>
            <p>Les précipitations peuvent prendre plusieurs formes selon les conditions atmosphériques :</p>
            <div class="precipitation-types">
              <div class="precipitation-type">
                <h4>Pluie</h4>
                <p>Gouttes d'eau liquide</p>
              </div>
              <div class="precipitation-type">
                <h4>Neige</h4>
                <p>Cristaux de glace</p>
              </div>
              <div class="precipitation-type">
                <h4>Grêle</h4>
                <p>Boules de glace</p>
              </div>
              <div class="precipitation-type">
                <h4>Bruine</h4>
                <p>Très fines gouttelettes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leçon 5 -->
      <div class="lesson-card">
        <div class="lesson-header">
          <h2>5. Comprendre les prévisions météo</h2>
          <span class="duration"><i class="fas fa-clock"></i> 20 min</span>
        </div>
        <div class="lesson-content">
          <img src="/images/courses/previsions.jpg" alt="Prévisions météorologiques" class="lesson-image">
          <div class="lesson-text">
            <h3>Comment lire les prévisions météo</h3>
            <p>Les prévisions météorologiques sont basées sur plusieurs éléments :</p>
            <div class="forecast-elements">
              <div class="forecast-element">
                <h4>Symboles météo</h4>
                <p>Comprendre les différents symboles utilisés</p>
              </div>
              <div class="forecast-element">
                <h4>Températures</h4>
                <p>Minimales et maximales</p>
              </div>
              <div class="forecast-element">
                <h4>Vent</h4>
                <p>Direction et force</p>
              </div>
              <div class="forecast-element">
                <h4>Précipitations</h4>
                <p>Probabilité et quantité</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

.course-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.course-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #666;
}

.course-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lessons-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.lesson-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.lesson-header {
  background: #f8f9fa;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.lesson-header h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.duration {
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lesson-content {
  padding: 1.5rem;
}

.lesson-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.lesson-text h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.lesson-text p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.lesson-text ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.lesson-text li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.lesson-text li::before {
  content: "•";
  color: #4CAF50;
  position: absolute;
  left: 0;
}

.key-points {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.key-points h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.instruments-grid,
.cloud-types,
.precipitation-types,
.forecast-elements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.instrument,
.cloud-type,
.precipitation-type,
.forecast-element {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.instrument h4,
.cloud-type h4,
.precipitation-type h4,
.forecast-element h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.instrument p,
.cloud-type p,
.precipitation-type p,
.forecast-element p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .course-container {
    padding: 1rem;
  }

  .course-header h1 {
    font-size: 2rem;
  }

  .course-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .lesson-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .lesson-image {
    height: 200px;
  }
}
</style> 