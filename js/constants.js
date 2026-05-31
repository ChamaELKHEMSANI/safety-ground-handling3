/**
 * CONSTANTS.JS - Constantes globales
 */

const Constants = {
    // Application
    APP_NAME: 'Simulateur Sécurité',
    APP_VERSION: '1.0.0',
    API_URL: '/data/pistes.xml',
    
    // Timing
    CACHE_TTL: 86400000, // 24 heures
    API_TIMEOUT: 5000,
    DEBOUNCE_DELAY: 300,
    
    // Storage
    STORAGE_KEYS: {
        PISTES: 'pistes',
        SCENARIOS: 'scenarios',
        USER: 'user',
        THEME: 'theme',
        LANGUAGE: 'language'
    },
    
    // Catégories
    CATEGORIES: [
        'Humain',
        'Technique',
        'Organisationnel',
        'Economique',
        'Processus'
    ],
    
    // Niveaux d'impact
    IMPACT_LEVELS: {
        LOW: 33,
        MEDIUM: 66,
        HIGH: 100
    },
    
    // Statuts
    STATUS: {
        PENDING: 'pending',
        ACTIVE: 'active',
        COMPLETED: 'completed',
        ARCHIVED: 'archived'
    },
    
    // Thèmes
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },
    
    // Langues
    LANGUAGES: {
        FR: 'fr',
        EN: 'en'
    },
    
    // Routes
    ROUTES: {
        HOME: '/',
        EXPLORE: '/explorer',
        SIMULATE: '/simuler',
        COMPARE: '/comparer',
        DECIDE: '/decider',
        PISTE: '/piste-detail',
        ADMIN: '/admin'
    },
    
    // Messages
    MESSAGES: {
        LOADING: 'Chargement...',
        ERROR: 'Une erreur est survenue',
        SUCCESS: 'Opération réussie',
        CONFIRM: 'Êtes-vous sûr?'
    }
};

window.Constants = Constants;
