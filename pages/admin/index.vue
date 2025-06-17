<template>
    <div class="admin-layout">
      <!-- Sidebar maintenue via le layout admin -->
      <div class="admin-content">
        <div class="admin-header">
          <h1>Tableau de bord</h1>
          <div class="admin-actions">
            <button class="btn-refresh" @click="refreshData">
              <i class="fas fa-sync-alt"></i> Actualiser
            </button>
          </div>
        </div>
  
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <h3>Utilisateurs</h3>
              <p>{{ stats.users.toLocaleString() }}</p>
              <span :class="['stat-trend', stats.usersTrend >= 0 ? 'positive' : 'negative']">
                <i :class="stats.usersTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(stats.usersTrend) }}%
              </span>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon courses">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-info">
              <h3>Cours</h3>
              <p>{{ stats.courses }}</p>
              <span :class="['stat-trend', stats.coursesTrend >= 0 ? 'positive' : 'negative']">
                <i :class="stats.coursesTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(stats.coursesTrend) }}%
              </span>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon teachers">
              <i class="fas fa-chalkboard-teacher"></i>
            </div>
            <div class="stat-info">
              <h3>Enseignants</h3>
              <p>{{ stats.teachers }}</p>
              <span :class="['stat-trend', stats.teachersTrend >= 0 ? 'positive' : 'negative']">
                <i :class="stats.teachersTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(stats.teachersTrend) }}%
              </span>
            </div>
          </div>
  
          <div class="stat-card">
            <div class="stat-icon messages">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="stat-info">
              <h3>Messages</h3>
              <p>{{ stats.messages }}</p>
              <span :class="['stat-trend', stats.messagesTrend >= 0 ? 'positive' : 'negative']">
                <i :class="stats.messagesTrend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(stats.messagesTrend) }}%
              </span>
            </div>
          </div>
        </div>
  
        <div class="dashboard-content">
          <div class="recent-activities">
            <div class="section-header">
              <h2>Activités récentes</h2>
              <button class="btn-view-all">Voir tout</button>
            </div>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div :class="['activity-icon', activity.type]">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-details">
                  <p class="activity-text">{{ activity.text }}</p>
                  <div class="activity-meta">
                    <span class="activity-time">{{ activity.time }}</span>
                    <span class="activity-badge" :class="activity.status">{{ activity.statusLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="quick-actions-section">
            <h2>Actions rapides</h2>
            <div class="quick-actions-grid">
              <NuxtLink to="/admin/courses" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-plus"></i>
                </div>
                <span>Ajouter un cours</span>
              </NuxtLink>
              <NuxtLink to="/admin/users" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-user-plus"></i>
                </div>
                <span>Ajouter un utilisateur</span>
              </NuxtLink>
              <NuxtLink to="/admin/teachers" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <span>Ajouter un enseignant</span>
              </NuxtLink>
              <NuxtLink to="/admin/messages" class="action-card">
                <div class="action-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <span>Voir les messages</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
    layout: 'admin'
  });
  
  const stats = ref({
    users: 1250,
    usersTrend: 12,
    courses: 45,
    coursesTrend: 5,
    teachers: 12,
    teachersTrend: 3,
    messages: 28,
    messagesTrend: -2
  });
  
  const recentActivities = ref([
    {
      id: 1,
      icon: 'fas fa-user-plus',
      text: 'Nouvelle inscription : Jean Dupont',
      time: 'Il y a 5 minutes',
      type: 'user',
      status: 'success',
      statusLabel: 'Nouveau'
    },
    {
      id: 2,
      icon: 'fas fa-book',
      text: 'Nouveau cours ajouté : Météorologie avancée',
      time: 'Il y a 1 heure',
      type: 'course',
      status: 'info',
      statusLabel: 'Terminé'
    },
    {
      id: 3,
      icon: 'fas fa-envelope',
      text: 'Nouveau message de Marie Martin',
      time: 'Il y a 2 heures',
      type: 'message',
      status: 'warning',
      statusLabel: 'En attente'
    },
    {
      id: 4,
      icon: 'fas fa-chalkboard-teacher',
      text: 'Nouvel enseignant : Pierre Durand',
      time: 'Il y a 3 heures',
      type: 'teacher',
      status: 'success',
      statusLabel: 'Complet'
    }
  ]);
  
  const refreshData = () => {
    // Simulation de rafraîchissement des données
    stats.value = {
      users: stats.value.users + Math.floor(Math.random() * 10),
      usersTrend: Math.floor(Math.random() * 20) - 5,
      courses: stats.value.courses + Math.floor(Math.random() * 3),
      coursesTrend: Math.floor(Math.random() * 15) - 3,
      teachers: stats.value.teachers + Math.floor(Math.random() * 2),
      teachersTrend: Math.floor(Math.random() * 10) - 2,
      messages: stats.value.messages + Math.floor(Math.random() * 5),
      messagesTrend: Math.floor(Math.random() * 15) - 5
    };
  };
  </script>
  
  <style scoped>
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }
  
  .admin-content {
    flex: 1;
    padding: 2rem;
    background-color: #f5f7fa;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .admin-header h1 {
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .btn-refresh {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.3s;
  }
  
  .btn-refresh:hover {
    background-color: #2980b9;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 1.5rem;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
  }
  
  .stat-icon.users {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }
  
  .stat-icon.courses {
    background-color: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
  }
  
  .stat-icon.teachers {
    background-color: rgba(155, 89, 182, 0.1);
    color: #9b59b6;
  }
  
  .stat-icon.messages {
    background-color: rgba(241, 196, 15, 0.1);
    color: #f1c40f;
  }
  
  .stat-info h3 {
    color: #7f8c8d;
    margin: 0 0 0.3rem 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .stat-info p {
    color: #2c3e50;
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
  }
  
  .stat-trend {
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.3rem;
  }
  
  .stat-trend.positive {
    color: #2ecc71;
  }
  
  .stat-trend.negative {
    color: #e74c3c;
  }
  
  .dashboard-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 1200px) {
    .dashboard-content {
      grid-template-columns: 1fr;
    }
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .section-header h2 {
    color: #2c3e50;
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
  }
  
  .btn-view-all {
    background: none;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0.3rem 0.5rem;
  }
  
  .recent-activities {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .activity-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    transition: background-color 0.3s;
  }
  
  .activity-item:hover {
    background-color: #f8f9fa;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
  
  .activity-icon.user {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }
  
  .activity-icon.course {
    background-color: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
  }
  
  .activity-icon.message {
    background-color: rgba(241, 196, 15, 0.1);
    color: #f1c40f;
  }
  
  .activity-icon.teacher {
    background-color: rgba(155, 89, 182, 0.1);
    color: #9b59b6;
  }
  
  .activity-details {
    flex: 1;
  }
  
  .activity-text {
    color: #2c3e50;
    margin: 0 0 0.3rem 0;
    font-size: 0.95rem;
  }
  
  .activity-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.8rem;
  }
  
  .activity-time {
    color: #7f8c8d;
  }
  
  .activity-badge {
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
  }
  
  .activity-badge.success {
    background-color: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
  }
  
  .activity-badge.info {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }
  
  .activity-badge.warning {
    background-color: rgba(241, 196, 15, 0.1);
    color: #f1c40f;
  }
  
  .quick-actions-section {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .quick-actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 1.5rem 1rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    text-decoration: none;
    color: #2c3e50;
    transition: transform 0.3s, background-color 0.3s;
  }
  
  .action-card:hover {
    background-color: #e9ecef;
    transform: translateY(-3px);
  }
  
  .action-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
  }
  
  .action-card span {
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .admin-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .quick-actions-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>