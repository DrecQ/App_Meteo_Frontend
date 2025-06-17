<template>
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item" v-for="(stat, index) in stats" :key="index">
          <div class="stat-value" :data-target="stat.value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      stats: [
        { value: 10000, label: 'Étudiants inscrits' },
        { value: 500, label: 'Cours disponibles' },
        { value: 200, label: 'Enseignants experts' },
        { value: 99, label: 'Taux de satisfaction' }
      ]
    }
  },
  mounted() {
    this.animateStats();
  },
  methods: {
    animateStats() {
      const statValues = document.querySelectorAll('.stat-value');
      
      statValues.forEach(statValue => {
        const target = +statValue.getAttribute('data-target');
        const suffix = statValue.textContent.includes('%') ? '%' : '+';
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            clearInterval(timer);
            current = target;
          }
          statValue.textContent = Math.floor(current) + suffix;
        }, 20);
      });
    }
  }
}
</script>

<style scoped>
.stats-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stat-item {
  padding: 2rem;
}

.stat-value {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.2rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>