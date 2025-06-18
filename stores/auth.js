import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    setToken(token) {
      this.token = token
      if (process.client) {
        if (token) {
          localStorage.setItem('auth_token', token)
        } else {
          localStorage.removeItem('auth_token')
        }
      }
    },

    setUser(user) {
      this.user = user
      if (process.client) {
        if (user) {
          localStorage.setItem('user_data', JSON.stringify(user))
        } else {
          localStorage.removeItem('user_data')
        }
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        // Simuler une réponse d'API
        const response = {
          token: 'fake-jwt-token',
          user: {
            id: 1,
            firstName: credentials.email.split('@')[0],
            lastName: 'User',
            email: credentials.email,
            role: 'user',
            createdAt: new Date(),
            lastLogin: new Date(),
            certificates: [],
            courses: []
          }
        }

        this.setToken(response.token)
        this.setUser(response.user)
        return response
      } catch (error) {
        console.error('Erreur de connexion:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
  }
}) 