import { API_CONFIG } from '~/config/api'

class AuthService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.headers = API_CONFIG.headers
  }

  // Méthode pour gérer les erreurs
  handleError(error) {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui est en dehors de la plage 2xx
      throw new Error(error.response.data.message || 'Une erreur est survenue')
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      throw new Error('Aucune réponse du serveur')
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error('Erreur de configuration de la requête')
    }
  }

  // Méthode pour ajouter le token aux headers
  getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
      ...this.headers,
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      return data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Connexion
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      this.handleError(error)
    }
  }

  // Déconnexion
  async logout() {
    try {
      const response = await fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })
      
      // Supprimer le token et les données utilisateur
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      return true
    } catch (error) {
      this.handleError(error)
    }
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  }

  // Obtenir les données de l'utilisateur
  getUserData() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }
}

export default new AuthService() 