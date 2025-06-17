import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    setUser(user) {
      this.user = user
      this.isAuthenticated = !!user
    },

    setToken(token) {
      this.token = token
      if (process.client) {
        if (token) {
          localStorage.setItem('token', token)
        } else {
          localStorage.removeItem('token')
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      if (process.client) {
        localStorage.removeItem('token')
      }
    },

    async checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            // Ici, vous pouvez ajouter une vérification du token avec votre API
            this.token = token
            this.isAuthenticated = true
            // Vous pouvez aussi récupérer les informations de l'utilisateur
          } catch (error) {
            this.logout()
          }
        }
      }
    }
  }
}) 