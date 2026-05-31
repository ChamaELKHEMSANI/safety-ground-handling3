/**
 * STORE.JS - Gestion d'état globale (pattern Redux-like)
 */

class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
    }

    /**
     * Obtenir l'état complet
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Mettre à  jour une partie de l'état
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    /**
     * S'abonner aux changements d'état
     */
    subscribe(listener) {
        this.listeners.push(listener);
        
        // Retourner fonction de désabonnement
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notifier les abonnés
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    /**
     * Obtenir une partie spécifique de l'état
     */
    getValue(path) {
        return Utils.getNestedValue(this.state, path);
    }
}

const AUTH_STORAGE_KEY = 'cdgAuthSession';
const SESSION_DURATION_MS = 60 * 60 * 1000;

function clearPersistedAuth() {
    try {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        // Ignore storage errors
    }
}

function readPersistedAuth() {
    try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.isAuthenticated || !parsed.user || !parsed.sessionExpiresAt) {
            clearPersistedAuth();
            return null;
        }

        const expiresAt = Date.parse(parsed.sessionExpiresAt);
        if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) {
            clearPersistedAuth();
            return null;
        }

        return parsed;
    } catch (error) {
        clearPersistedAuth();
        return null;
    }
}

function persistAuth(state) {
    try {
        if (!state.isAuthenticated || !state.user) {
            clearPersistedAuth();
            return;
        }

        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            sessionStartedAt: state.sessionStartedAt,
            sessionExpiresAt: state.sessionExpiresAt
        }));
    } catch (error) {
        // Ignore storage errors
    }
}

const persistedAuth = readPersistedAuth();

/**
 * Store global de l'application
 */
const appStore = new Store({
    // Utilisateur / Session
    isAuthenticated: Boolean(persistedAuth?.isAuthenticated),
    user: persistedAuth?.user || null,
    sessionStartedAt: persistedAuth?.sessionStartedAt || null,
    sessionExpiresAt: persistedAuth?.sessionExpiresAt || null,

    // Données
    allPistes: [],
    scenarios: [],
    users: [],
    
    // Ã‰tat actuel
    currentPage: 'home',
    currentScenario: [],
    currentScenarioId: null,
    selectedPistes: [],
    currentScenarioPlanning: null,
    currentScenarioConstraints: null,
    diagnostic: null,
    simulatorPreset: null,
    
    // Filtres
    filters: {
        search: '',
        category: [],
        priority: [],
        tags: [],
        budgetRange: { min: 0, max: Infinity }
    },

    // Parametres
    settings: {
        theme: 'light',
        language: 'fr',
        viewMode: 'grid',
        itemsPerPage: 12
    },

    // UI
    showNotification: false,
    notification: {
        type: 'info',
        message: '',
        duration: 3000
    },

    loading: false,
    error: null,

    // Configuration
    config: {
        totalPistes: 61,
        baselineAccidents: 24,
        targetAccidents: 0
    }
});

/**
 * Actions pour modifier l'état
 */
const appActions = {
    login(user) {
        const now = Date.now();
        const sessionState = {
            isAuthenticated: true,
            user,
            sessionStartedAt: new Date(now).toISOString(),
            sessionExpiresAt: new Date(now + SESSION_DURATION_MS).toISOString()
        };

        appStore.setState(sessionState);
        persistAuth({ ...appStore.getState(), ...sessionState });
    },

    logout() {
        const clearedState = {
            isAuthenticated: false,
            user: null,
            sessionStartedAt: null,
            sessionExpiresAt: null,
            currentScenario: [],
            currentScenarioId: null
        };

        appStore.setState(clearedState);
        persistAuth({ ...appStore.getState(), ...clearedState });
    },

    isSessionExpired() {
        const expiresAt = appStore.getValue('sessionExpiresAt');
        if (!expiresAt) return true;
        const expiry = Date.parse(expiresAt);
        if (Number.isNaN(expiry)) return true;
        return Date.now() >= expiry;
    },

    /**
     * Charger les pistes
     */
    setPistes(pistes) {
        appStore.setState({ allPistes: pistes });
    },

    /**
     * Persist the complete working piste set used by the editor.
     */
    setAllPistes(pistes) {
        const nextPistes = Array.isArray(pistes) ? pistes : [];
        appStore.setState({ allPistes: nextPistes });
        this.persistPistes(nextPistes);
    },

    updatePiste(updatedPiste) {
        if (!updatedPiste) return;
        const pistes = appStore.getValue('allPistes') || [];
        const pisteId = String(updatedPiste.numero || updatedPiste.id || '');
        const updatedPistes = pistes.map(piste => {
            const currentId = String(piste.numero || piste.id || '');
            return currentId === pisteId ? { ...updatedPiste } : piste;
        });
        this.setAllPistes(updatedPistes);
    },

    persistPistes(pistes) {
        if (typeof db === 'undefined' || !db) return;
        const state = appStore.getState();
        const projectData = {
            pistes,
            scenarios: state.scenarios || [],
            utilisateurs: state.users || [],
            config: state.config || {}
        };

        if (typeof db.savePistes === 'function') {
            db.savePistes(pistes).catch(error => {
                console.error('Erreur sauvegarde pistes en DB:', error);
            });
        }
        if (typeof db.cacheData === 'function') {
            db.cacheData('projectData', projectData, 86400000).catch(error => {
                console.error('Erreur cache pistes:', error);
            });
        }
    },

    /**
     * Mettre Ã  jour scenario courant
     */
    setCurrentScenario(scenario) {
        appStore.setState({ currentScenario: scenario });
    },

    /**
     * Ajouter une piste au scenario
     */
    addPisteToScenario(piste) {
        const current = appStore.getValue('currentScenario');
        if (!current.find(p => p.id === piste.id)) {
            appStore.setState({ 
                currentScenario: [...current, piste]
            });
        }
    },

    /**
     * Retirer une piste du scenario
     */
    removePisteFromScenario(pisteId) {
        const current = appStore.getValue('currentScenario');
        appStore.setState({
            currentScenario: current.filter(p => p.id !== pisteId)
        });
    },

    /**
     * Vider le scenario
     */
    clearScenario(resetSelection = false) {
        appStore.setState({
            currentScenario: [],
            ...(resetSelection ? { currentScenarioId: null } : {})
        });
    },

    /**
     * Mettre Ã  jour les filtres
     */
    setFilters(filters) {
        appStore.setState({
            filters: { ...appStore.getValue('filters'), ...filters }
        });
    },

    /**
     * Recherche
     */
    setSearch(query) {
        appStore.setState({
            filters: { ...appStore.getValue('filters'), search: query }
        });
    },

    /**
     * Aller Ã  une page
     */
    goToPage(page) {
        appStore.setState({ currentPage: page });
    },

    /**
     * Afficher notification
     */
    showNotification(message, type = 'info', duration = 3000) {
        appStore.setState({
            showNotification: true,
            notification: { message, type, duration }
        });
        
        setTimeout(() => {
            appStore.setState({ showNotification: false });
        }, duration);
    },

    /**
     * Afficher loading
     */
    setLoading(loading) {
        appStore.setState({ loading });
    },

    /**
     * Définir erreur
     */
    setError(error) {
        appStore.setState({ error });
    },

    /**
     * Sauvegarder scénario
     */
    saveScenario(name, scenarioId = null) {
        const current = appStore.getValue('currentScenario');
        const scenarios = appStore.getValue('scenarios') || [];
        const existingScenario = scenarioId
            ? scenarios.find(candidate => candidate.id === scenarioId)
            : null;
        const scenario = {
            id: existingScenario?.id || Utils.generateUID(),
            name,
            pistes: current,
            createdAt: existingScenario?.createdAt || new Date().toISOString(),
            totalBudget: current.reduce((sum, p) => sum + (p.budget?.cout_3_ans || 0), 0),
            totalImpact: current.length > 0
                ? current.reduce((sum, p) => sum + p.impact_score, 0) / current.length
                : 0,
            planning: appStore.getValue('currentScenarioPlanning') || null,
            constraints: appStore.getValue('currentScenarioConstraints') || null
        };

        appStore.setState({
            scenarios: existingScenario
                ? scenarios.map(candidate => candidate.id === scenario.id ? scenario : candidate)
                : [...scenarios, scenario],
            currentScenarioId: scenario.id
        });

        // Persistance locale IndexedDB (pour survivre au refresh)
        if (typeof db !== 'undefined' && db && typeof db.saveScenario === 'function') {
            db.saveScenario(scenario).catch((error) => {
                console.error('Erreur sauvegarde scenario en DB:', error);
            });
        }

        this.showNotification(`Scénario "${name}" ${existingScenario ? 'mis à jour' : 'sauvegardé'}`, 'success');
        return scenario;
    },

    addScenario(scenario) {
        if (!scenario || !scenario.id) return null;
        const scenarios = appStore.getValue('scenarios') || [];
        appStore.setState({ scenarios: [...scenarios, scenario] });
        if (typeof db !== 'undefined' && db && typeof db.saveScenario === 'function') {
            db.saveScenario(scenario).catch(error => {
                console.error('Erreur sauvegarde scenario en DB:', error);
            });
        }
        return scenario;
    },

    /**
     * Charger scénario
     */
    loadScenario(scenarioId) {
        const scenarios = appStore.getValue('scenarios');
        const scenario = scenarios.find(s => s.id === scenarioId);
        
        if (scenario) {
            appStore.setState({
                currentScenario: scenario.pistes,
                currentScenarioId: scenario.id,
                currentScenarioPlanning: scenario.planning || null,
                currentScenarioConstraints: scenario.constraints || null
            });
            this.showNotification(`Scénario "${scenario.name}" chargé`, 'success');
        }
    },

    /**
     * Supprimer scénario
     */
    deleteScenario(scenarioId) {
        const scenarios = appStore.getValue('scenarios');
        const deletingCurrentScenario = appStore.getValue('currentScenarioId') === scenarioId;
        appStore.setState({
            scenarios: scenarios.filter(s => s.id !== scenarioId),
            ...(deletingCurrentScenario ? { currentScenarioId: null } : {})
        });

        // Supprimer aussi en IndexedDB
        if (typeof db !== 'undefined' && db && typeof db.delete === 'function') {
            db.delete('scenarios', scenarioId).catch((error) => {
                console.error('Erreur suppression scenario en DB:', error);
            });
        }

        this.showNotification('Scénario supprimé', 'info');
    }
};

// Export pour utilisation globale
window.appStore = appStore;
window.appActions = appActions;
