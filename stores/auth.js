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
        this.error = error.message || 'Erreur de connexion'
        throw error
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
          this.user = response.user
          // Pour l'instant, on utilise un token fictif
          this.token = 'fake-jwt-token'
          localStorage.setItem('auth_token', this.token)
          localStorage.setItem('user_data', JSON.stringify(this.user))
          return { token: this.token, user: this.user }
        } else {
          throw new Error(response.message || 'Erreur d\'inscription')
        }
      } catch (error) {
        this.error = error.message || 'Erreur d\'inscription'
        throw error
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
    }
  }
}) 