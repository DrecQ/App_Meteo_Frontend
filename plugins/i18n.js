import { createI18n } from 'vue-i18n'

const messages = {
  fr: {
    nav: {
      home: 'Accueil',
      weather: 'Météo',
      education: 'Éducation',
      about: 'À propos',
      login: 'Connexion',
      register: 'Inscription'
    },
    courses: {
      title: 'Cours',
      search: 'Rechercher un cours, un sujet, un mot-clé...',
      category: 'Catégorie',
      level: 'Niveau',
      duration: 'Durée',
      all: 'Toutes',
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      short: 'Moins de 2h',
      medium: '2-5h',
      long: 'Plus de 5h',
      sort: {
        popular: 'Plus populaires',
        recent: 'Plus récents',
        duration: 'Durée'
      },
      start: 'Commencer'
    }
  },
  en: {
    nav: {
      home: 'Home',
      weather: 'Weather',
      education: 'Education',
      about: 'About',
      login: 'Login',
      register: 'Register'
    },
    courses: {
      title: 'Courses',
      search: 'Search for a course, topic, keyword...',
      category: 'Category',
      level: 'Level',
      duration: 'Duration',
      all: 'All',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      short: 'Less than 2h',
      medium: '2-5h',
      long: 'More than 5h',
      sort: {
        popular: 'Most popular',
        recent: 'Most recent',
        duration: 'Duration'
      },
      start: 'Start'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      weather: 'الطقس',
      education: 'التعليم',
      about: 'حول',
      login: 'تسجيل الدخول',
      register: 'تسجيل'
    },
    courses: {
      title: 'الدورات',
      search: 'ابحث عن دورة، موضوع، كلمة مفتاحية...',
      category: 'الفئة',
      level: 'المستوى',
      duration: 'المدة',
      all: 'الكل',
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
      short: 'أقل من ساعتين',
      medium: '2-5 ساعات',
      long: 'أكثر من 5 ساعات',
      sort: {
        popular: 'الأكثر شعبية',
        recent: 'الأحدث',
        duration: 'المدة'
      },
      start: 'ابدأ'
    }
  }
}

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'fr',
    messages
  })

  vueApp.use(i18n)
}) 