<template>
  <div class="admin-page">
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Inscrit le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5">Chargement...</td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="5">Aucun utilisateur trouvé.</td>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name || '—' }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role || '—' }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button @click="onEditUser(user)" class="action-btn edit">Modifier</button>
              <button @click="onDeleteUser(user)" class="action-btn delete">Supprimer</button>
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

const users = ref([]);
const loading = ref(true);

async function fetchUsers() {
  try {
    const res = await fetch('/api/users/list');
    const data = await res.json();
    if (data.success) {
      users.value = data.users.map(u => ({
        ...u,
        role: u.role || (u.isAdmin ? 'admin' : 'user') // fallback si le champ existe
      }));
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

async function onDeleteUser(user) {
  if (!confirm(`Voulez-vous vraiment supprimer l'utilisateur ${user.email} ?`)) return;
  try {
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
    } else {
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
  } catch (e) {
    alert("Erreur lors de la suppression de l'utilisateur.");
  }
}

async function onEditUser(user) {
  const newRole = prompt(`Nouveau rôle pour ${user.email} (admin/user) :`, user.role);
  if (!newRole || (newRole !== 'admin' && newRole !== 'user')) {
    alert('Rôle invalide.');
    return;
  }
  try {
    const res = await fetch(`/api/admin/users/${user.id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      fetchUsers();
    } else {
      alert("Erreur lors de la modification du rôle.");
    }
  } catch (e) {
    alert("Erreur lors de la modification du rôle.");
  }
}

onMounted(fetchUsers);
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

.action-btn {
  margin-right: 0.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.95em;
}
.action-btn.edit {
  background: #f1c40f;
  color: #fff;
}
.action-btn.delete {
  background: #e74c3c;
  color: #fff;
}
</style> 