import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (response.success) {
          this.user = response.user
          // Pour l'instant, on utilise un token fictif
          this.token = 'fake-jwt-token'
          localStorage.setItem('auth_token', this.token)
          localStorage.setItem('user_data', JSON.stringify(this.user))
          return { token: this.token, user: this.user }
        } else {
          throw new Error(response.message || 'Erreur de connexion')
        }
      } catch (error) {
        console.error('Erreur login store:', error)
        
        // Gérer les erreurs de l'API
        if (error.data?.statusMessage) {
          this.error = error.data.statusMessage
          throw new Error(error.data.statusMessage)
        } else if (error.statusMessage) {
          this.error = error.statusMessage
          throw new Error(error.statusMessage)
        } else if (error.message) {
          this.error = error.message
          throw error
        } else {
          this.error = 'Erreur de connexion'
          throw new Error('Erreur de connexion')
        }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })

        if (response.success) {
          // Ne pas connecter l'utilisateur automatiquement
          return true
        } else {
          throw new Error(response.message || 'Erreur d\'inscription')
        }
      } catch (error) {
        console.error('Erreur register store:', error)
        
        // Gérer les erreurs de l'API
        if (error.data?.statusMessage) {
          this.error = error.data.statusMessage
          throw new Error(error.data.statusMessage)
        } else if (error.statusMessage) {
          this.error = error.statusMessage
          throw new Error(error.statusMessage)
        } else if (error.message) {
          this.error = error.message
          throw error
        } else {
          this.error = 'Erreur d\'inscription'
          throw new Error('Erreur d\'inscription')
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        // Suppression des données locales
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        this.token = null
        this.user = null
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      if (token && userData) {
        this.token = token
        this.user = JSON.parse(userData)
      }
    },

    updateUserAvatar(avatarUrl) {
      if (this.user) {
        this.user.avatar = avatarUrl
        localStorage.setItem('user_data', JSON.stringify(this.user))
      }
    },

    clearError() {
      this.error = null
    }
  }
}) 