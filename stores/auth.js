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
        // Authentification simple : email et mot de passe en dur pour la démo
        if (
          (credentials.email === 'demo@benin.com' && credentials.password === 'demo1234') ||
          (credentials.email === 'test@benin.com' && credentials.password === 'test1234')
        ) {
          this.token = 'fake-jwt-token'
          this.user = { email: credentials.email, name: 'Utilisateur Bénin', role: 'user' }
          localStorage.setItem('auth_token', this.token)
          localStorage.setItem('user_data', JSON.stringify(this.user))
          return { token: this.token, user: this.user }
        } else {
          throw new Error('Email ou mot de passe incorrect')
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        // Enregistrement fictif : accepte tout, pas d'appel API
        this.token = 'fake-jwt-token'
        this.user = { email: userData.email, name: userData.name, role: 'user' }
        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('user_data', JSON.stringify(this.user))
        return { token: this.token, user: this.user }
      } catch (error) {
        this.error = error.message
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