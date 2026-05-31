/**
 * ACTIONS.JS - Actions du store
 * Toutes les mutations possibles
 */

const appActions = {
    // PAGE & NAVIGATION
    goToPage(path) {
        appStore.setState({ currentPage: path });
    },

    // PISTES
    setPistes(pistes) {
        appStore.setState({ allPistes: pistes });
    },

    addPisteToScenario(piste) {
        const current = appStore.getValue('currentScenario') || [];
        const exists = current.find(p => p.id === piste.id);
        if (!exists) {
            appStore.setState({ currentScenario: [...current, piste] });
        }
    },

    removePisteFromScenario(pisteId) {
        const current = appStore.getValue('currentScenario') || [];
        appStore.setState({
            currentScenario: current.filter(p => p.id !== pisteId)
        });
    },

    // SCENARIOS
    saveScenario(name) {
        const scenario = {
            id: `scenario-${Date.now()}`,
            name: name,
            pistes: appStore.getValue('currentScenario') || [],
            createdAt: new Date().toISOString(),
            totalBudget: (appStore.getValue('currentScenario') || [])
                .reduce((s, p) => s + p.budget.cout_3_ans, 0),
            totalImpact: Math.round((appStore.getValue('currentScenario') || [])
                .reduce((s, p) => s + p.impact_score, 0) / Math.max(1, (appStore.getValue('currentScenario') || []).length))
        };

        const scenarios = appStore.getValue('scenarios') || [];
        appStore.setState({ scenarios: [...scenarios, scenario] });

        // Sauvegarder en DB
        db.saveScenario(scenario);
        this.showNotification(`Scénario "${name}" sauvegardé`, 'success');
    },

    loadScenario(scenarioId) {
        const scenarios = appStore.getValue('scenarios') || [];
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (scenario) {
            appStore.setState({ currentScenario: scenario.pistes });
            this.showNotification(`Scénario chargé: ${scenario.name}`, 'success');
        }
    },

    deleteScenario(scenarioId) {
        const scenarios = appStore.getValue('scenarios') || [];
        const filtered = scenarios.filter(s => s.id !== scenarioId);
        appStore.setState({ scenarios: filtered });
        db.deleteScenario(scenarioId);
        this.showNotification('Scénario supprimé', 'info');
    },

    clearScenario() {
        appStore.setState({ currentScenario: [] });
    },

    // NOTIFICATIONS
    showNotification(message, type = 'info', duration = 3000) {
        appStore.setState({
            notification: { message, type, duration },
            showNotification: true
        });

        setTimeout(() => {
            appStore.setState({ showNotification: false });
        }, duration);
    },

    // LOADING
    setLoading(loading) {
        appStore.setState({ loading });
    },

    // FILTRES
    setFilters(filters) {
        appStore.setState({ filters });
    },

    resetFilters() {
        appStore.setState({
            filters: {
                search: '',
                categories: [],
                maxBudget: 1000000
            }
        });
    },

    // UTILISATEUR
    setUser(user) {
        appStore.setState({ user });
    },

    logout() {
        appStore.setState({ user: null, currentScenario: [] });
    },

    // PRÉFÉRENCES
    setTheme(theme) {
        appStore.setState({ theme });
        localStorage.setItem('theme', theme);
    },

    setLanguage(language) {
        appStore.setState({ language });
        localStorage.setItem('language', language);
    },

    // HISTORIQUE
    undo() {
        appStore.undo();
    },

    redo() {
        appStore.redo();
    }
};

// Export global
window.appActions = appActions;
