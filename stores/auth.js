import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    // Simuler une base de données d'utilisateurs
    registeredUsers: []
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    setUser(user) {
      this.user = user
    },

    setToken(token) {
      this.token = token
      // Vérifier si localStorage est disponible (côté client uniquement)
      if (process.client) {
        if (token) {
          localStorage.setItem('auth_token', token)
        } else {
          localStorage.removeItem('auth_token')
        }
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Vérifier si l'utilisateur est inscrit
        const user = this.registeredUsers.find(u => u.email === credentials.email)
        
        if (!user) {
          this.error = "Cet email n'est pas inscrit. Veuillez d'abord créer un compte."
          return false
        }

        // Vérifier le mot de passe (dans un vrai système, il faudrait le hasher)
        if (user.password !== credentials.password) {
          this.error = "Mot de passe incorrect"
          return false
        }
        
        // Connexion réussie
        this.setUser({
          email: user.email,
          name: user.name
        })
        this.setToken('test-token')
        
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Vérifier si l'email est déjà utilisé
        if (this.registeredUsers.some(u => u.email === userData.email)) {
          this.error = "Cet email est déjà utilisé"
          return false
        }
        
        // Ajouter le nouvel utilisateur
        const newUser = {
          email: userData.email,
          name: userData.name,
          password: userData.password // Dans un vrai système, il faudrait hasher le mot de passe
        }
        this.registeredUsers.push(newUser)
        
        // Connexion automatique après inscription
        this.setUser({
          email: newUser.email,
          name: newUser.name
        })
        this.setToken('test-token')
        
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
    },

    // Vérifier si l'utilisateur est déjà connecté au chargement de l'application
    checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          this.token = token
          // Dans un vrai système, il faudrait récupérer les données utilisateur depuis l'API
          const userData = localStorage.getItem('user_data')
          if (userData) {
            this.user = JSON.parse(userData)
          }
        }
      }
    }
  }
}) 