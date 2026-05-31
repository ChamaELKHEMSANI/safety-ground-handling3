﻿/**
 * APP.JS - Point d'entrée principal de l'application
 */

window.pages = window.pages || {};

class App {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialiser l'application
     */
    async init() {
        try {
            console.log('🚀 Initialisation de l\'application...');

            // 1. Attendre que le DOM soit prêt
            await this.waitForDOM();

            // 2. Initialiser la base de données
            await this.initDatabase();

            // 3. Charger les données
            await this.loadData();

            // 4. Configurer l'UI globale
            this.setupGlobalUI();

            // 5. Charger les scenarios sauvegardes avant le premier rendu
            await this.loadScenarios();

            // 6. Initialiser le routeur
            await this.initRouter();

            // 7. Configurer les événements globaux
            this.setupGlobalEvents();

            this.isInitialized = true;
            console.log('✅ Application initialisée avec succès');

        } catch (error) {
            console.error('❌ Erreur initialisation:', error);
            appActions.showNotification('Erreur lors du démarrage de l\'application', 'error', 5000);
        }
    }

    /**
     * Attendre que le DOM soit prêt
     */
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialiser la base de données
     */
    async initDatabase() {
        try {
            await db.init();
            console.log('✅ Base de données initialisée');
        } catch (error) {
            console.error('Erreur DB:', error);
        }
    }

    /**
     * Charger les données (XML pistes)
     */
    async loadData() {
        try {
            appActions.setLoading(true);

            // Essayer de charger dataset complet depuis le cache
            let data = await db.getCachedData('projectData');

            if (!data || !Array.isArray(data.pistes)) {
                // Charger depuis XML
                console.log('📥 Chargement des pistes depuis XML...');
                data = await XMLParser.parsePistes('data/pistes.xml');

                // Sauvegarder en cache (1 jour)
                await db.cacheData('projectData', data, 86400000);
                await db.cacheData('pistes', data.pistes || [], 86400000);
            } else {
                // Migration cache: les anciennes versions n'incluaient pas toutes les données utilisées par Explorer.
                const hasMissingRatings = data.pistes.some((piste) => typeof piste?.rating !== 'number');
                const hasMissingEditionXmlSections = data.pistes.some((piste) =>
                    !piste?.dispositif_elements ||
                    (piste.phase && !Array.isArray(piste.phases)) ||
                    (Object.keys(piste.dispositif_elements || {}).length === 0)
                );
                const hasMissingJustificatifXmlFields = data.pistes.some((piste) =>
                    Array.isArray(piste?.justificatifs) &&
                    piste.justificatifs.some((justificatif) =>
                        justificatif &&
                        !Object.prototype.hasOwnProperty.call(justificatif, 'title') &&
                        !Object.prototype.hasOwnProperty.call(justificatif, 'links')
                    )
                );
                const normalizePisteReference = (value) => {
                    const reference = String(value || '').trim();
                    return /^\d+$/.test(reference) ? `P${reference}` : reference.toUpperCase();
                };
                const pisteNumbers = new Set(data.pistes.map((piste) => normalizePisteReference(piste.numero)));
                const hasUnresolvedRelations = data.pistes.some((piste) =>
                    Array.isArray(piste?.relations) &&
                    piste.relations.some((relation) => {
                        const target = relation?.piste_liee || relation?.target;
                        return !relation?.piste_liee ||
                            normalizePisteReference(target) !== String(relation.piste_liee).toUpperCase() ||
                            !pisteNumbers.has(normalizePisteReference(target));
                    })
                );
                if (hasMissingRatings || hasUnresolvedRelations || hasMissingEditionXmlSections || hasMissingJustificatifXmlFields) {
                    console.log('♻️ Cache obsolète détecté, rechargement XML...');
                    data = await XMLParser.parsePistes('data/pistes.xml');
                    await db.cacheData('projectData', data, 86400000);
                    await db.cacheData('pistes', data.pistes || [], 86400000);
                }
            }

            const pistes = Array.isArray(data.pistes) ? data.pistes : [];
            const scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];
            const users = Array.isArray(data.utilisateurs) ? data.utilisateurs : [];

            // Mettre à jour le store
            appActions.setPistes(pistes);
            appStore.setState({
                scenarios,
                users,
                config: {
                    ...appStore.getValue('config'),
                    ...(data.config || {})
                }
            });

            const missingRefs = data?.integrity?.missingScenarioPisteRefs || [];
            if (missingRefs.length > 0) {
                console.warn(`⚠️ ${missingRefs.length} références de pistes introuvables dans les scénarios XML`, missingRefs);
            }

            console.log(`✅ ${pistes.length} pistes chargées`);
            console.log(`✅ ${scenarios.length} scénarios XML chargés`);
            console.log(`✅ ${users.length} utilisateurs XML chargés`);

            appActions.setLoading(false);

        } catch (error) {
            console.error('Erreur chargement données:', error);
            appActions.showNotification('Impossible de charger les données', 'error');
            appActions.setLoading(false);
        }
    }

    /**
     * Configurer l'UI globale
     */
    setupGlobalUI() {
        // Rendre header
        const header = document.getElementById('app-header');
        if (header && window.Header) {
            header.innerHTML = Header.render();
            if (Header.setupEventListeners) Header.setupEventListeners();
        }

        // Rendre footer
        const footer = document.getElementById('app-footer');
        if (footer && window.Footer) {
            footer.innerHTML = Footer.render();
        }

        // Sauvegarder l'état du store
        appStore.subscribe((state) => {
            // Chaque changement d'état peut déclencher des mises à jour
            console.debug('État mis à jour:', state);
        });
    }

    /**
     * Initialiser le routeur
     */
    async initRouter() {
        const chartDependency = ['https://cdn.jsdelivr.net/npm/chart.js'];
        const pageStyle = name => [`css/pages/${name}.css`];

        router.registerLazy('/', 'Home', 'js/pages/home.js', { styles: pageStyle('home') });
        router.registerLazy('/explorer', 'Explore', 'js/pages/explore.js', { styles: pageStyle('explore'), dependencies: chartDependency });
        router.registerLazy('/diagnostic', 'Diagnostic', 'js/pages/diagnostic.js', { styles: pageStyle('diagnostic') });
        router.registerLazy('/simuler', 'Simulate', 'js/pages/simulate.js', { styles: pageStyle('simulate') });
        router.registerLazy('/simulateur', 'Simulateur', 'js/pages/simulateur.js', { styles: pageStyle('simulateur'), dependencies: chartDependency });
        router.registerLazy('/edition', 'Edition', 'js/pages/edition.js', { styles: pageStyle('edition') });
        router.registerLazy('/piste-detail', 'PisteDetail', 'js/pages/piste-detail.js', { styles: pageStyle('piste-detail'), dependencies: chartDependency });
        router.registerLazy('/scenario-detail', 'ScenarioDetail', 'js/pages/scenario-detail.js', { styles: pageStyle('scenario-detail'), dependencies: chartDependency });
        router.registerLazy('/comparer', 'Compare', 'js/pages/compare.js', { styles: pageStyle('compare'), dependencies: chartDependency });
        router.registerLazy('/decider', 'Decide', 'js/pages/decide.js', { styles: pageStyle('decide') });
        router.registerLazy('/admin', 'Admin', 'js/pages/admin.js', { styles: pageStyle('admin') });
        router.registerLazy('/connexion', 'Connexion', 'js/pages/connexion.js', { styles: pageStyle('connexion') });
        router.registerLazy('/problematique', 'Problematique', 'js/pages/problematique.js', { styles: pageStyle('problematique') });
        router.registerLazy('/modeemploie', 'ModeEmploi', 'js/pages/modeemploi.js', { styles: pageStyle('modeemploi') });
        router.registerLazy('/modeemploi', 'ModeEmploi', 'js/pages/modeemploi.js', { styles: pageStyle('modeemploi') });
        router.registerLazy('/support', 'Support', 'js/pages/support.js', { styles: pageStyle('support') });
        router.registerLazy('/apropos', 'Apropos', 'js/pages/apropos.js', { styles: pageStyle('apropos') });
        router.registerLazy('/documentation', 'Documentation', 'js/pages/documentation.js', { styles: pageStyle('documentation') });

        // Initialiser le routeur
        await router.init();
        console.log('✅ Routeur initialisé');
    }

    /**
     * Configurer les événements globaux
     */
    setupGlobalEvents() {
        // Notifications toast
        appStore.subscribe((state) => {
            if (state.showNotification) {
                this.showToast(state.notification);
            }
        });

        // Navigation responsive (mobile)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('modal-container');
                if (modal && modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            }
        });

        // Nettoyage caches expirés au démarrage
        db.cleanExpiredCache();

        console.log('✅ Événements globaux configurés');
    }

    /**
     * Charger les scénarios sauvegardés
     */
    async loadScenarios() {
        try {
            const xmlScenarios = appStore.getValue('scenarios') || [];
            const dbScenarios = await db.loadScenarios();
            const allPistes = appStore.getValue('allPistes') || [];
            const mergedScenarios = this.mergeScenarios(xmlScenarios, dbScenarios, allPistes);
            appStore.setState({ scenarios: mergedScenarios });
            console.log(`✅ ${mergedScenarios.length} scénarios chargés`);
        } catch (error) {
            console.error('Erreur chargement scénarios:', error);
        }
    }

    mergeScenarios(xmlScenarios, dbScenarios, allPistes) {
        const pisteMap = new Map();
        allPistes.forEach((p) => {
            if (p?.numero) pisteMap.set(String(p.numero), p);
            if (p?.id) pisteMap.set(String(p.id), p);
        });

        const scenarioMap = new Map();
        [...xmlScenarios, ...dbScenarios].forEach((scenario) => {
            const normalized = this.normalizeScenario(scenario, pisteMap);
            if (!normalized) return;
            scenarioMap.set(String(normalized.id), normalized);
        });

        return Array.from(scenarioMap.values());
    }

    normalizeScenario(scenario, pisteMap) {
        if (!scenario || !scenario.id) return null;
        const rawPistes = Array.isArray(scenario.pistes) ? scenario.pistes : [];
        const pistes = rawPistes
            .map((entry) => {
                if (!entry) return null;
                if (typeof entry === 'string') return pisteMap.get(entry) || null;
                if (entry.numero && pisteMap.has(String(entry.numero))) return pisteMap.get(String(entry.numero));
                if (entry.id && pisteMap.has(String(entry.id))) return pisteMap.get(String(entry.id));
                return null;
            })
            .filter(Boolean);

        return {
            ...scenario,
            pistes
        };
    }

    /**
     * Afficher notification toast
     */
    showToast(notification) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toastId = Utils.generateUID();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast toast-${notification.type}`;
        toast.textContent = notification.message;
        toast.style.cssText = `
            padding: 16px 20px;
            background: ${this.getToastColor(notification.type)};
            color: white;
            border-radius: 8px;
            margin-bottom: 10px;
            animation: slideUp 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, notification.duration || 3000);
    }

    /**
     * Obtenir couleur toast
     */
    getToastColor(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        return colors[type] || colors.info;
    }
}

// Créer instance et initialiser au chargement
const app = new App();

// Initialiser dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export global
window.App = App;
window.app = app;
