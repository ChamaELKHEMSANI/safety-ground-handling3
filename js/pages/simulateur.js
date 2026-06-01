/**
 * PAGES/SIMULATEUR.JS - Page d'aide à la sélection de pistes
 * L'utilisateur définit des contraintes et obtient une combinaison optimale
 */

pages.Simulateur = {
    // Contraintes utilisateur
    constraints: {
        budget: {
            enabled: false,
            value: 1000000, // 1M€ par défaut
            max: 5000000     // 5M€ max
        },
        dimensions: {
            enabled: false,
            culture: 20,
            technique: 20,
            humain: 20,
            organisationnel: 20,
            economique: 20
        },
        duree: {
            enabled: false,
            value: 12,       // 12 mois par défaut
            max: 60          // 60 mois max
        },
        nombrePistes: {
            enabled: true,
            value: 5,
            max: 20
        },
        equipes: {
            enabled: true,
            value: 1,
            max: 5
        },
        reductionAccidents: {
            enabled: false,
            value: 20,       // 20% par défaut
            max: 100
        }
    },

    // Résultats de simulation
    results: {
        selectedPistes: [],
        totalBudget: 0,
        totalImpact: 0,
        averageDuree: 0,
        planning: null,
        totalReduction: 0,
        dimensionScores: {
            culture: 0,
            technique: 0,
            humain: 0,
            organisationnel: 0,
            economique: 0
        },
        paretoFront: [] // Front de Pareto pour les visualisations
    },

    activeTab: 'contraintes', // contraintes, resultats, comparaison
    optimizationMode: 'weighted', // weighted, pareto, budget_first
    radarChartInstance: null,
    paretoChartInstance: null,
    diagnosticSource: null,

    async render() {
        const state = appStore ? appStore.getState() : {};
        if (state.simulatorPreset) {
            this.applyDiagnosticPreset(state.simulatorPreset);
        }
        const allPistes = state.allPistes || [];

        return `
            <div class="simulateur-wrapper">
                <!-- Header avec titre et description -->
                <header class="simulateur-header">
                    <div class="header-content">
                        <h1>
                            <span class="material-symbols-outlined">auto_awesome</span>
                            Simulateur de sélection de pistes
                        </h1>
                        <p class="header-description">
                            Définissez vos contraintes budgétaires, temporelles et stratégiques pour obtenir 
                            une combinaison optimale de pistes de sécurité.
                        </p>
                    </div>
                    <div class="header-actions">
                        <button class="btn-reset" onclick="pages.Simulateur.resetConstraints()">
                            <span class="material-symbols-outlined">refresh</span>
                            Réinitialiser
                        </button>
                        <button class="btn-simulate" onclick="pages.Simulateur.runSimulation()">
                            <span class="material-symbols-outlined">play_arrow</span>
                            Lancer la simulation
                        </button>
                    </div>
                </header>

                <!-- Navigation par onglets -->
                <div class="simulateur-tabs">
                    <button class="tab-btn ${this.activeTab === 'contraintes' ? 'active' : ''}" onclick="pages.Simulateur.setActiveTab('contraintes')">
                        <span class="material-symbols-outlined">tune</span>
                        Contraintes
                    </button>
                    <button class="tab-btn ${this.activeTab === 'resultats' ? 'active' : ''}" onclick="pages.Simulateur.setActiveTab('resultats')">
                        <span class="material-symbols-outlined">format_list_bulleted</span>
                        Résultats
                    </button>
                    <button class="tab-btn ${this.activeTab === 'comparaison' ? 'active' : ''}" onclick="pages.Simulateur.setActiveTab('comparaison')">
                        <span class="material-symbols-outlined">compare_arrows</span>
                        Comparaison
                    </button>
                </div>

                <!-- Contenu principal -->
                <main class="simulateur-main">
                    ${this.activeTab === 'contraintes' ? this.renderConstraintsTab(allPistes) : ''}
                    ${this.activeTab === 'resultats' ? this.renderResultsTab() : ''}
                    ${this.activeTab === 'comparaison' ? this.renderComparaisonTab() : ''}
                </main>
            </div>
        `;
    },

    renderConstraintsTab(allPistes) {
        // Statistiques globales pour aider l'utilisateur
        const stats = this.calculateStats(allPistes);
        
        return `
            <div class="constraints-container">
                <!-- Section Budget -->
                <div class="constraint-card">
                    <div class="constraint-header">
                        <div class="constraint-title">
                            <span class="material-symbols-outlined">payments</span>
                            <h3>Contrainte budgétaire</h3>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-budget" ${this.constraints.budget.enabled ? 'checked' : ''} onchange="pages.Simulateur.toggleConstraint('budget')">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="constraint-content ${!this.constraints.budget.enabled ? 'disabled' : ''}">
                        <p class="constraint-info">
                            Budget total disponible pour l'ensemble des pistes sélectionnées.
                            <span class="stats-hint">Budget total disponible: ${this.formatCurrency(stats.totalBudget)}</span>
                        </p>
                        
                        <div class="slider-container">
                            <label>Budget maximum (€)</label>
                            <input type="range" 
                                id="budget-slider" 
                                min="0" 
                                max="${this.constraints.budget.max}" 
                                step="100000" 
                                value="${this.constraints.budget.value}"
                                ${!this.constraints.budget.enabled ? 'disabled' : ''}
                                oninput="pages.Simulateur.updateConstraint('budget', 'value', this.value)">
                            <div class="slider-values">
                                <span>0 €</span>
                                <span id="budget-value-display">${this.formatCurrency(this.constraints.budget.value)}</span>
                                <span>${this.formatCurrency(this.constraints.budget.max)}</span>
                            </div>
                        </div>
                        
                        <div class="quick-presets">
                            <button class="preset-btn" onclick="pages.Simulateur.setBudgetPreset(500000)">500k€</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setBudgetPreset(1000000)">1M€</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setBudgetPreset(2000000)">2M€</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setBudgetPreset(5000000)">5M€</button>
                        </div>
                    </div>
                </div>

                <!-- Section Dimensions Balancing -->
                <div class="constraint-card">
                    <div class="constraint-header">
                        <div class="constraint-title">
                            <span class="material-symbols-outlined">donut_large</span>
                            <h3>Dimensions Balancing</h3>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-dimensions" ${this.constraints.dimensions.enabled ? 'checked' : ''} onchange="pages.Simulateur.toggleConstraint('dimensions')">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="constraint-content ${!this.constraints.dimensions.enabled ? 'disabled' : ''}">
                        <p class="constraint-info">
                            Répartissez l'importance relative des différentes dimensions (total = 100%)
                        </p>
                        
                        <div class="dimensions-grid">
                            <div class="dimension-item">
                                <label>CULTURE</label>
                                <div class="dimension-control">
                                    <input type="range" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.culture}" 
                                        id="dim-culture"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        oninput="pages.Simulateur.updateDimension('culture', this.value)">
                                    <input type="number" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.culture}" 
                                        class="dimension-input"
                                        data-dim="culture"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        onchange="pages.Simulateur.updateDimension('culture', this.value)">
                                    <span>%</span>
                                </div>
                            </div>
                            
                            <div class="dimension-item">
                                <label>TECHNIQUE</label>
                                <div class="dimension-control">
                                    <input type="range" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.technique}" 
                                        id="dim-technique"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        oninput="pages.Simulateur.updateDimension('technique', this.value)">
                                    <input type="number" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.technique}" 
                                        class="dimension-input"
                                        data-dim="technique"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        onchange="pages.Simulateur.updateDimension('technique', this.value)">
                                    <span>%</span>
                                </div>
                            </div>
                            
                            <div class="dimension-item">
                                <label>HUMAIN</label>
                                <div class="dimension-control">
                                    <input type="range" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.humain}" 
                                        id="dim-humain"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        oninput="pages.Simulateur.updateDimension('humain', this.value)">
                                    <input type="number" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.humain}" 
                                        class="dimension-input"
                                        data-dim="humain"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        onchange="pages.Simulateur.updateDimension('humain', this.value)">
                                    <span>%</span>
                                </div>
                            </div>
                            
                            <div class="dimension-item">
                                <label>ORGANISATIONNEL</label>
                                <div class="dimension-control">
                                    <input type="range" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.organisationnel}" 
                                        id="dim-organisationnel"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        oninput="pages.Simulateur.updateDimension('organisationnel', this.value)">
                                    <input type="number" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.organisationnel}" 
                                        class="dimension-input"
                                        data-dim="organisationnel"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        onchange="pages.Simulateur.updateDimension('organisationnel', this.value)">
                                    <span>%</span>
                                </div>
                            </div>
                            
                            <div class="dimension-item">
                                <label>ÉCONOMIQUE</label>
                                <div class="dimension-control">
                                    <input type="range" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.economique}" 
                                        id="dim-economique"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        oninput="pages.Simulateur.updateDimension('economique', this.value)">
                                    <input type="number" min="0" max="100" step="5" 
                                        value="${this.constraints.dimensions.economique}" 
                                        class="dimension-input"
                                        data-dim="economique"
                                        ${!this.constraints.dimensions.enabled ? 'disabled' : ''}
                                        onchange="pages.Simulateur.updateDimension('economique', this.value)">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dimension-total">
                            <span>Total: </span>
                            <span id="dimension-total" class="${this.calculateDimensionsTotal() !== 100 ? 'warning' : ''}">
                                ${this.calculateDimensionsTotal()}%
                            </span>
                            ${this.calculateDimensionsTotal() !== 100 ? 
                                '<span class="total-hint">Le total doit être égal à 100%</span>' : ''}
                        </div>
                    </div>
                </div>

                <!-- Section Durée -->
                <div class="constraint-card">
                    <div class="constraint-header">
                        <div class="constraint-title">
                            <span class="material-symbols-outlined">schedule</span>
                            <h3>Durée de déploiement</h3>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-duree" ${this.constraints.duree.enabled ? 'checked' : ''} onchange="pages.Simulateur.toggleConstraint('duree')">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="constraint-content ${!this.constraints.duree.enabled ? 'disabled' : ''}">
                        <p class="constraint-info">
                            Durée maximale de déploiement pour l'ensemble des pistes.
                            <span class="stats-hint">Durée moyenne des pistes: ${stats.avgDuree} mois</span>
                        </p>
                        
                        <div class="slider-container">
                            <label>Durée maximum (mois)</label>
                            <input type="range" 
                                id="duree-slider" 
                                min="0" 
                                max="${this.constraints.duree.max}" 
                                step="1" 
                                value="${this.constraints.duree.value}"
                                ${!this.constraints.duree.enabled ? 'disabled' : ''}
                                oninput="pages.Simulateur.updateConstraint('duree', 'value', this.value)">
                            <div class="slider-values">
                                <span>0 mois</span>
                                <span id="duree-value-display">${this.constraints.duree.value} mois</span>
                                <span>${this.constraints.duree.max} mois</span>
                            </div>
                        </div>
                        
                        <div class="quick-presets">
                            <button class="preset-btn" onclick="pages.Simulateur.setDureePreset(6)">6 mois</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setDureePreset(12)">1 an</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setDureePreset(24)">2 ans</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setDureePreset(36)">3 ans</button>
                        </div>
                    </div>
                </div>

                <!-- Section Nombre maximum de pistes -->
                <div class="constraint-card">
                    <div class="constraint-header">
                        <div class="constraint-title">
                            <span class="material-symbols-outlined">format_list_numbered</span>
                            <h3>Nombre maximum de pistes</h3>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-nombre-pistes" ${this.constraints.nombrePistes.enabled ? 'checked' : ''} onchange="pages.Simulateur.toggleConstraint('nombrePistes')">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="constraint-content ${!this.constraints.nombrePistes.enabled ? 'disabled' : ''}">
                        <p class="constraint-info">
                            Nombre maximal de pistes retenues dans une solution proposée.
                        </p>

                        <div class="slider-container">
                            <label>Nombre maximum de pistes</label>
                            <input type="range"
                                id="nombre-pistes-slider"
                                min="1"
                                max="${this.constraints.nombrePistes.max}"
                                step="1"
                                value="${this.constraints.nombrePistes.value}"
                                ${!this.constraints.nombrePistes.enabled ? 'disabled' : ''}
                                oninput="pages.Simulateur.updateConstraint('nombrePistes', 'value', this.value)">
                            <div class="slider-values">
                                <span>1 piste</span>
                                <span id="nombre-pistes-value-display">${this.constraints.nombrePistes.value} pistes</span>
                                <span>${this.constraints.nombrePistes.max} pistes</span>
                            </div>
                        </div>

                        <div class="quick-presets">
                            <button class="preset-btn" onclick="pages.Simulateur.setNombrePistesPreset(3)">3 pistes</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setNombrePistesPreset(5)">5 pistes</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setNombrePistesPreset(10)">10 pistes</button>
                        </div>
                    </div>
                </div>

                <!-- Section Equipes disponibles -->
                <div class="constraint-card">
                    <div class="constraint-header">
                        <div class="constraint-title">
                            <span class="material-symbols-outlined">groups</span>
                            <h3>Nombre d'équipes mobilisables</h3>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-equipes" ${this.constraints.equipes.enabled ? 'checked' : ''} onchange="pages.Simulateur.toggleConstraint('equipes')">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="constraint-content ${!this.constraints.equipes.enabled ? 'disabled' : ''}">
                        <p class="constraint-info">
                            Les pistes sont planifiées en parallèle entre équipes, sans dépendances identifiées entre les actions.
                        </p>

                        <div class="slider-container">
                            <label>Équipes disponibles</label>
                            <input type="range"
                                id="equipes-slider"
                                min="1"
                                max="${this.constraints.equipes.max}"
                                step="1"
                                value="${this.constraints.equipes.value}"
                                ${!this.constraints.equipes.enabled ? 'disabled' : ''}
                                oninput="pages.Simulateur.updateConstraint('equipes', 'value', this.value)">
                            <div class="slider-values">
                                <span>1 équipe</span>
                                <span id="equipes-value-display">${this.formatTeams(this.constraints.equipes.value)}</span>
                                <span>${this.formatTeams(this.constraints.equipes.max)}</span>
                            </div>
                        </div>

                        <div class="quick-presets">
                            <button class="preset-btn" onclick="pages.Simulateur.setEquipesPreset(1)">1 équipe</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setEquipesPreset(2)">2 équipes</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setEquipesPreset(3)">3 équipes</button>
                            <button class="preset-btn" onclick="pages.Simulateur.setEquipesPreset(5)">5 équipes</button>
                        </div>
                    </div>
                </div>

                <!-- Section Réduction d'accidents -->
                <div class="constraint-card">
                    <div class="constraint-header">
                        <div class="constraint-title">
                            <span class="material-symbols-outlined">trending_down</span>
                            <h3>Réduction d'accidents</h3>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-reduction" ${this.constraints.reductionAccidents.enabled ? 'checked' : ''} onchange="pages.Simulateur.toggleConstraint('reductionAccidents')">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="constraint-content ${!this.constraints.reductionAccidents.enabled ? 'disabled' : ''}">
                        <p class="constraint-info">
                            Pourcentage minimum de réduction d'accidents souhaité.
                        </p>
                        
                        <div class="slider-container">
                            <label>Réduction minimum (%)</label>
                            <input type="range" 
                                id="reduction-slider" 
                                min="0" 
                                max="100" 
                                step="1" 
                                value="${this.constraints.reductionAccidents.value}"
                                ${!this.constraints.reductionAccidents.enabled ? 'disabled' : ''}
                                oninput="pages.Simulateur.updateConstraint('reductionAccidents', 'value', this.value)">
                            <div class="slider-values">
                                <span>0%</span>
                                <span id="reduction-value-display">${this.constraints.reductionAccidents.value}%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mode d'optimisation -->
                <div class="constraint-card">
                    <div class="constraint-header">
                        <div class="constraint-title">
                            <span class="material-symbols-outlined">tune</span>
                            <h3>Mode d'optimisation</h3>
                        </div>
                    </div>
                    
                    <div class="constraint-content">
                        <div class="optimization-modes">
                            <label class="radio-option">
                                <input type="radio" name="optimization-mode" value="weighted" ${this.optimizationMode === 'weighted' ? 'checked' : ''} onchange="pages.Simulateur.setOptimizationMode('weighted')">
                                <div>
                                    <strong>Pondéré</strong>
                                    <small>Optimise selon un score pondéré combinant toutes les contraintes</small>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="optimization-mode" value="pareto" ${this.optimizationMode === 'pareto' ? 'checked' : ''} onchange="pages.Simulateur.setOptimizationMode('pareto')">
                                <div>
                                    <strong>Pareto</strong>
                                    <small>Trouve le front de Pareto (meilleurs compromis)</small>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="optimization-mode" value="budget_first" ${this.optimizationMode === 'budget_first' ? 'checked' : ''} onchange="pages.Simulateur.setOptimizationMode('budget_first')">
                                <div>
                                    <strong>Budget d'abord</strong>
                                    <small>Maximise l'impact dans la limite du budget</small>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Résumé des contraintes -->
                <div class="constraint-summary">
                    <h4>Résumé des contraintes</h4>
                    <div class="summary-items">
                        <div class="summary-item ${!this.constraints.budget.enabled ? 'inactive' : ''}">
                            <span class="summary-label">Budget:</span>
                            <span class="summary-value">${this.constraints.budget.enabled ? this.formatCurrency(this.constraints.budget.value) : 'Non contraint'}</span>
                        </div>
                        <div class="summary-item ${!this.constraints.dimensions.enabled ? 'inactive' : ''}">
                            <span class="summary-label">Dimensions:</span>
                            <span class="summary-value">${this.constraints.dimensions.enabled ? 'Activées' : 'Non contraintes'}</span>
                        </div>
                        <div class="summary-item ${!this.constraints.duree.enabled ? 'inactive' : ''}">
                            <span class="summary-label">Durée max:</span>
                            <span class="summary-value">${this.constraints.duree.enabled ? this.constraints.duree.value + ' mois' : 'Non contrainte'}</span>
                        </div>
                        <div class="summary-item ${!this.constraints.nombrePistes.enabled ? 'inactive' : ''}">
                            <span class="summary-label">Nombre max:</span>
                            <span class="summary-value">${this.constraints.nombrePistes.enabled ? this.constraints.nombrePistes.value + ' pistes' : 'Non contraint'}</span>
                        </div>
                        <div class="summary-item ${!this.constraints.equipes.enabled ? 'inactive' : ''}">
                            <span class="summary-label">Équipes:</span>
                            <span class="summary-value">${this.constraints.equipes.enabled ? this.formatTeams(this.constraints.equipes.value) : 'Séquentiel'}</span>
                        </div>
                        <div class="summary-item ${!this.constraints.reductionAccidents.enabled ? 'inactive' : ''}">
                            <span class="summary-label">Réduction min:</span>
                            <span class="summary-value">${this.constraints.reductionAccidents.enabled ? this.constraints.reductionAccidents.value + '%' : 'Non contrainte'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderResultsTab() {
        if (!this.results.selectedPistes || this.results.selectedPistes.length === 0) {
            return `
                <div class="no-results">
                    <span class="material-symbols-outlined">info</span>
                    <h3>Aucune simulation effectuée</h3>
                    <p>Définissez vos contraintes dans l'onglet "Contraintes" puis lancez une simulation.</p>
                    <button class="btn-primary" onclick="pages.Simulateur.setActiveTab('contraintes')">
                        Aller aux contraintes
                    </button>
                </div>
            `;
        }

        const planning = this.results.planning || this.calculatePlanning(this.results.selectedPistes);
        return `
            <div class="results-container">
                ${this.diagnosticSource ? `
                    <div class="diagnostic-source-banner">
                        <span class="material-symbols-outlined">verified</span>
                        <div>
                            <strong>Recommandation ${Utils.escapeHtml(this.diagnosticSource.name)}</strong>
                            <p>Préparée pour ${Utils.escapeHtml(this.diagnosticSource.prospectName || 'votre organisation')} à partir du diagnostic.</p>
                        </div>
                    </div>
                ` : ''}
                <!-- KPIs principaux -->
                <div class="results-kpi">
                    <div class="kpi-card">
                        <span class="material-symbols-outlined">payments</span>
                        <div class="kpi-content">
                            <span class="kpi-label">Budget total</span>
                            <span class="kpi-value">${this.formatCurrency(this.results.totalBudget)}</span>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <span class="material-symbols-outlined">analytics</span>
                        <div class="kpi-content">
                            <span class="kpi-label">Impact moyen</span>
                            <span class="kpi-value">${Math.round(this.results.totalImpact / this.results.selectedPistes.length)}/100</span>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <span class="material-symbols-outlined">schedule</span>
                        <div class="kpi-content">
                            <span class="kpi-label">Durée totale planifiée</span>
                            <span class="kpi-value">${planning.totalDuration} mois</span>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <span class="material-symbols-outlined">trending_down</span>
                        <div class="kpi-content">
                            <span class="kpi-label">Réduction accidents</span>
                            <span class="kpi-value">${Math.round(this.results.totalReduction)}%</span>
                        </div>
                    </div>

                    <div class="kpi-card">
                        <span class="material-symbols-outlined">groups</span>
                        <div class="kpi-content">
                            <span class="kpi-label">Capacité mobilisée</span>
                            <span class="kpi-value">${this.formatTeams(planning.teamCount)}</span>
                        </div>
                    </div>

                    <div class="kpi-card">
                        <span class="material-symbols-outlined">fast_forward</span>
                        <div class="kpi-content">
                            <span class="kpi-label">Gain vs séquentiel</span>
                            <span class="kpi-value">${planning.savedMonths} mois</span>
                        </div>
                    </div>
                </div>

                ${this.renderPlanningTimeline(planning)}

                <!-- Radar des dimensions -->
                <div class="results-dimensions">
                    <h3>Distribution dimensionnelle</h3>
                    <div class="radar-container">
                        <canvas id="dimensions-radar" width="400" height="400"></canvas>
                    </div>
                    <div class="dimension-legend">
                        ${Object.entries(this.results.dimensionScores).map(([key, value]) => `
                            <div class="legend-item">
                                <span class="legend-color" style="background-color: ${this.getDimensionColor(key)}"></span>
                                <span class="legend-label">${key.toUpperCase()}</span>
                                <span class="legend-value">${Math.round(value)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Liste des pistes sélectionnées -->
                <div class="selected-pistes">
                    <h3>Pistes sélectionnées (${this.results.selectedPistes.length})</h3>
                    <div class="pistes-list">
                        ${this.results.selectedPistes.map((piste, index) => `
                            <div class="piste-result-card">
                                <div class="piste-rank">#${index + 1}</div>
                                <div class="piste-info">
                                    <div class="piste-header">
                                        <span class="piste-id">${piste.numero}</span>
                                        <span class="priority-badge priority-${this.getPriorityClass(piste.priorite)}">${Utils.getPriorityLabel(piste.priorite)}</span>
                                    </div>
                                    <h4 class="piste-title">${Utils.escapeHtml(piste.titre)}</h4>
                                    <div class="piste-metrics">
                                        <div class="metric">
                                            <span class="material-symbols-outlined">payments</span>
                                            <span>${this.formatCurrency(piste.budget?.cout_3_ans || 0)}</span>
                                        </div>
                                        <div class="metric">
                                            <span class="material-symbols-outlined">analytics</span>
                                            <span>Impact: ${piste.impact_score || 0}/100</span>
                                        </div>
                                        <div class="metric">
                                            <span class="material-symbols-outlined">schedule</span>
                                            <span>${piste.delai_mois || '?'} mois</span>
                                        </div>
                                    </div>
                                    <div class="piste-dimensions">
                                        ${piste.dimensions ? this.renderDimensionMiniBars(piste.dimensions) : ''}
                                    </div>
                                </div>
                                <div class="piste-actions">
                                    <button class="btn-icon" onclick="pages.Simulateur.viewPisteDetails('${piste.numero}')" title="Voir détails">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                    <button class="btn-icon" onclick="pages.Simulateur.removeFromSelection('${piste.numero}')" title="Retirer">
                                        <span class="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Actions sur les résultats -->
                <div class="results-actions">
                    <button class="btn-secondary" onclick="pages.Simulateur.exportResults()">
                        <span class="material-symbols-outlined">download</span>
                        Exporter
                    </button>
                    <button class="btn-secondary" onclick="pages.Simulateur.addToScenario()">
                        <span class="material-symbols-outlined">add_circle</span>
                        Ajouter au scénario
                    </button>
                    <button class="btn-primary" onclick="pages.Simulateur.runSimulation()">
                        <span class="material-symbols-outlined">refresh</span>
                        Recalculer
                    </button>
                </div>
            </div>
        `;
    },


    getTimelinePriorityStyle(piste) {
        const priority = String(piste?.priorite || '').toLowerCase();
        if (priority === 'p1' || priority.includes('critical')) return { bg: '#dc2626', soft: 'rgba(220, 38, 38, 0.16)', text: '#991b1b', label: 'P1', name: 'Critique' };
        if (priority === 'p2' || priority.includes('high')) return { bg: '#f97316', soft: 'rgba(249, 115, 22, 0.16)', text: '#c2410c', label: 'P2', name: 'Haute' };
        if (priority === 'p3' || priority.includes('medium')) return { bg: '#ca8a04', soft: 'rgba(202, 138, 4, 0.16)', text: '#854d0e', label: 'P3', name: 'Moyenne' };
        if (priority === 'p4' || priority.includes('low')) return { bg: '#2563eb', soft: 'rgba(37, 99, 235, 0.16)', text: '#1d4ed8', label: 'P4', name: 'Basse' };
        if (priority.includes('quick')) return { bg: '#059669', soft: 'rgba(5, 150, 105, 0.16)', text: '#065f46', label: 'QW', name: 'Quick Win' };
        if (priority.includes('strat')) return { bg: '#d97706', soft: 'rgba(217, 119, 6, 0.16)', text: '#92400e', label: 'S', name: 'Strategique' };
        if (priority.includes('compl')) return { bg: '#2563eb', soft: 'rgba(37, 99, 235, 0.16)', text: '#1d4ed8', label: 'C', name: 'Complementaire' };
        if (priority.includes('long')) return { bg: '#7c3aed', soft: 'rgba(124, 58, 237, 0.16)', text: '#6d28d9', label: 'LT', name: 'Long Terme' };
        return { bg: '#64748b', soft: 'rgba(100, 116, 139, 0.16)', text: '#475569', label: 'NA', name: 'Non definie' };
    },

    renderTimelineTaskTooltip(piste, task) {
        const safe = value => Utils.escapeHtml(value ?? '');
        const score = piste?.rating ?? piste?.impact_score ?? '-';
        const priority = this.getTimelinePriorityStyle(piste).name;
        const category = piste?.categorie || piste?.famille || 'Non definie';
        const impact = piste?.niveau_impact ?? piste?.impact_score ?? '-';
        const faisabilite = piste?.niveau_faisabilite ?? '-';
        const relations = Array.isArray(piste?.relations) ? piste.relations.length : 0;

        return `
            <span class="timeline-tooltip-card" role="tooltip">
                <strong>${safe(piste?.numero || '')} - ${safe(piste?.titre || 'Sans titre')}</strong>
                <em>${safe(piste?.slogan || '')}</em>
                <span><b>Score</b><i>${safe(score)}</i></span>
                <span><b>Priorite</b><i>${safe(priority)}</i></span>
                <span><b>Categorie</b><i>${safe(category)}</i></span>
                <span><b>Duree</b><i>${safe(task.duration)} mois</i></span>
                <span><b>Planning</b><i>M${safe(task.start)} - M${safe(task.end)}</i></span>
                <span><b>Faisabilite</b><i>${safe(faisabilite)}</i></span>
                <span><b>Impact</b><i>${safe(impact)}</i></span>
                <span><b>Relations</b><i>${relations}</i></span>
            </span>
        `;
    },
    renderPlanningTimeline(planning) {
        const horizon = Math.max(1, planning.totalDuration);
        const durationWarning = this.constraints.duree.enabled && planning.totalDuration > this.constraints.duree.value
            ? `<p class="timeline-warning">Le planning dépasse l'objectif de ${this.constraints.duree.value} mois. Augmentez la capacité ou réduisez le plan.</p>`
            : '';

        return `
            <section class="planning-timeline">
                <div class="timeline-header">
                    <div>
                        <h3>Calendrier de déploiement</h3>
                        <p>Planning parallélisé avec prise en compte des prérequis et dépendances fortes.</p>
                    </div>
                    <div class="timeline-summary">
                        <strong>${planning.sequentialDuration} mois</strong>
                        <span>Séquentiel</span>
                        <strong>${planning.totalDuration} mois</strong>
                        <span>Avec ${this.formatTeams(planning.teamCount)}</span>
                    </div>
                </div>
                ${durationWarning}
                <div class="timeline-scale" aria-hidden="true">
                    <span>0</span>
                    <span>${Math.round(horizon / 2)} mois</span>
                    <span>${horizon} mois</span>
                </div>
                <div class="timeline-teams">
                    ${planning.teams.map(team => `
                        <div class="timeline-team">
                            <strong class="team-name">Équipe ${team.id}</strong>
                            <div class="team-track">
                                ${team.tasks.map(task => {
                                    const style = this.getTimelinePriorityStyle(task.piste);
                                    return `
                                    <div class="timeline-task timeline-task-priority"
                                        style="left: ${(task.start / horizon) * 100}%; width: ${(task.duration / horizon) * 100}%; background: ${style.bg}; border-left-color: ${style.text};">
                                        <span>${Utils.escapeHtml(task.piste.numero || '')}</span>
                                        <small>${task.duration} mois</small>
                                        ${this.renderTimelineTaskTooltip(task.piste, task)}
                                    </div>
                                `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    },

    renderComparaisonTab() {
        if (!this.results.paretoFront || this.results.paretoFront.length === 0) {
            return `
                <div class="no-results">
                    <span class="material-symbols-outlined">info</span>
                    <h3>Mode Pareto non activé</h3>
                    <p>Sélectionnez le mode d'optimisation "Pareto" pour voir les comparaisons.</p>
                </div>
            `;
        }

        return `
            <div class="comparaison-container">
                <h3>Front de Pareto - Meilleurs compromis</h3>
                <p class="comparaison-description">
                    Ces solutions représentent les meilleurs compromis entre budget et impact.
                    Aucune solution n'est meilleure à la fois sur les deux critères.
                </p>

                <div class="pareto-chart-container">
                    <canvas id="pareto-chart" width="800" height="400"></canvas>
                </div>

                <div class="pareto-solutions">
                    ${this.results.paretoFront.map((solution, index) => `
                        <div class="solution-card" onclick="pages.Simulateur.loadSolution(${index})">
                            <div class="solution-header">
                                <span class="solution-name">Solution ${String.fromCharCode(65 + index)}</span>
                                <span class="solution-badge">${solution.pistes.length} pistes</span>
                            </div>
                            <div class="solution-metrics">
                                <div class="solution-metric">
                                    <span class="metric-label">Budget:</span>
                                    <span class="metric-value">${this.formatCurrency(solution.budget)}</span>
                                </div>
                                <div class="solution-metric">
                                    <span class="metric-label">Impact:</span>
                                    <span class="metric-value">${Math.round(solution.impact)}/100</span>
                                </div>
                                <div class="solution-metric">
                                    <span class="metric-label">Efficacité:</span>
                                    <span class="metric-value">${(solution.impact / (solution.budget / 1000000)).toFixed(1)} pts/M€</span>
                                </div>
                            </div>
                            <button class="btn-select-solution" onclick="event.stopPropagation(); pages.Simulateur.selectSolution(${index})">
                                Choisir cette solution
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderDimensionMiniBars(dimensions) {
        const total = (dimensions.culture || 0) + (dimensions.technique || 0) + 
                     (dimensions.humain || 0) + (dimensions.organisationnel || 0) + 
                     (dimensions.economique || 0);
        
        return `
            <div class="mini-bars">
                <div class="mini-bar" style="width: ${(dimensions.culture || 0) / total * 100}%; background-color: #FF6B35;" title="Culture: ${dimensions.culture || 0}%"></div>
                <div class="mini-bar" style="width: ${(dimensions.technique || 0) / total * 100}%; background-color: #003D82;" title="Technique: ${dimensions.technique || 0}%"></div>
                <div class="mini-bar" style="width: ${(dimensions.humain || 0) / total * 100}%; background-color: #10B981;" title="Humain: ${dimensions.humain || 0}%"></div>
                <div class="mini-bar" style="width: ${(dimensions.organisationnel || 0) / total * 100}%; background-color: #F59E0B;" title="Organisationnel: ${dimensions.organisationnel || 0}%"></div>
                <div class="mini-bar" style="width: ${(dimensions.economique || 0) / total * 100}%; background-color: #8B5CF6;" title="Économique: ${dimensions.economique || 0}%"></div>
            </div>
        `;
    },

    calculateStats(pistes) {
        const totalBudget = pistes.reduce((sum, p) => sum + (p.budget?.cout_3_ans || 0), 0);
        const avgDuree = Math.round(pistes.reduce((sum, p) => sum + (p.delai_mois || 0), 0) / pistes.length) || 0;
        const avgImpact = Math.round(pistes.reduce((sum, p) => sum + (p.impact_score || 0), 0) / pistes.length) || 0;
        
        return { totalBudget, avgDuree, avgImpact };
    },

    toggleConstraint(constraint) {
        this.constraints[constraint].enabled = !this.constraints[constraint].enabled;
        this.rerender();
    },

    updateConstraint(constraint, field, value) {
        const parsedValue = constraint === 'nombrePistes' || constraint === 'equipes'
            ? Math.max(1, Math.round(Number(value) || 1))
            : parseFloat(value);
        this.constraints[constraint][field] = parsedValue;
        
        // Mettre à jour l'affichage
        if (constraint === 'budget') {
            document.getElementById('budget-value-display').textContent = this.formatCurrency(value);
        } else if (constraint === 'duree') {
            document.getElementById('duree-value-display').textContent = value + ' mois';
        } else if (constraint === 'nombrePistes') {
            document.getElementById('nombre-pistes-value-display').textContent = parsedValue + ' pistes';
        } else if (constraint === 'equipes') {
            document.getElementById('equipes-value-display').textContent = this.formatTeams(parsedValue);
        } else if (constraint === 'reductionAccidents') {
            document.getElementById('reduction-value-display').textContent = value + '%';
        }
    },

    updateDimension(dimension, value) {
        const dims = this.constraints.dimensions;
        const requestedValue = Number.parseInt(value, 10);
        const currentValue = Number(dims[dimension] || 0);
        const normalizedValue = Number.isNaN(requestedValue) ? currentValue : requestedValue;
        const finalValue = Math.max(0, Math.min(100, normalizedValue));

        dims[dimension] = finalValue;
        this.normalizeDimensionsTo100(dimension);
        this.syncDimensionControls(dimension, dims[dimension]);
        this.updateDimensionTotalUI();
    },

    calculateDimensionsTotal() {
        const dims = this.constraints.dimensions;
        return dims.culture + dims.technique + dims.humain + dims.organisationnel + dims.economique;
    },

    syncDimensionControls(dimension, value) {
        const slider = document.getElementById(`dim-${dimension}`);
        if (slider) slider.value = value;

        const input = document.querySelector(`.dimension-input[data-dim="${dimension}"]`);
        if (input) input.value = value;
    },

    normalizeDimensionsTo100(changedDimension) {
        const dims = this.constraints.dimensions;
        const keys = ['culture', 'technique', 'humain', 'organisationnel', 'economique'];
        const otherKeys = keys.filter(key => key !== changedDimension);
        const changedValue = Number(dims[changedDimension] || 0);
        const targetOtherSum = Math.max(0, 100 - changedValue);

        const currentOtherValues = otherKeys.map(key => Number(dims[key] || 0));
        const currentOtherSum = currentOtherValues.reduce((sum, v) => sum + v, 0);

        let normalizedOthers;
        if (currentOtherSum === 0) {
            // Répartition homogène si toutes les autres dimensions sont à 0
            const base = Math.floor(targetOtherSum / otherKeys.length);
            let remainder = targetOtherSum - (base * otherKeys.length);
            normalizedOthers = otherKeys.map(() => {
                const add = remainder > 0 ? 1 : 0;
                remainder = Math.max(0, remainder - 1);
                return base + add;
            });
        } else {
            // Conserver les proportions relatives
            const raw = currentOtherValues.map(v => (v / currentOtherSum) * targetOtherSum);
            normalizedOthers = raw.map(v => Math.floor(v));
            let remainder = targetOtherSum - normalizedOthers.reduce((sum, v) => sum + v, 0);

            const order = raw
                .map((v, idx) => ({ idx, frac: v - Math.floor(v) }))
                .sort((a, b) => b.frac - a.frac);

            for (let i = 0; i < order.length && remainder > 0; i += 1) {
                normalizedOthers[order[i].idx] += 1;
                remainder -= 1;
            }
        }

        otherKeys.forEach((key, idx) => {
            dims[key] = Math.max(0, Math.min(100, normalizedOthers[idx]));
            this.syncDimensionControls(key, dims[key]);
        });
    },

    updateDimensionTotalUI() {
        const total = this.calculateDimensionsTotal();
        const totalElement = document.getElementById('dimension-total');
        if (totalElement) {
            totalElement.textContent = `${total}%`;
            totalElement.className = total !== 100 ? 'warning' : '';
        }

        const hint = document.querySelector('.dimension-total .total-hint');
        if (total !== 100) {
            if (!hint) {
                const totalWrapper = document.querySelector('.dimension-total');
                if (totalWrapper) {
                    const hintEl = document.createElement('span');
                    hintEl.className = 'total-hint';
                    hintEl.textContent = 'Le total doit être égal à 100%';
                    totalWrapper.appendChild(hintEl);
                }
            }
        } else if (hint) {
            hint.remove();
        }
    },

    setBudgetPreset(value) {
        this.constraints.budget.value = value;
        if (!this.constraints.budget.enabled) {
            this.constraints.budget.enabled = true;
            document.getElementById('toggle-budget').checked = true;
        }
        
        const slider = document.getElementById('budget-slider');
        if (slider) {
            slider.value = value;
            slider.disabled = false;
        }
        
        document.getElementById('budget-value-display').textContent = this.formatCurrency(value);
    },

    setDureePreset(value) {
        this.constraints.duree.value = value;
        if (!this.constraints.duree.enabled) {
            this.constraints.duree.enabled = true;
            document.getElementById('toggle-duree').checked = true;
        }
        
        const slider = document.getElementById('duree-slider');
        if (slider) {
            slider.value = value;
            slider.disabled = false;
        }
        
        document.getElementById('duree-value-display').textContent = value + ' mois';
    },

    setNombrePistesPreset(value) {
        this.constraints.nombrePistes.value = value;
        if (!this.constraints.nombrePistes.enabled) {
            this.constraints.nombrePistes.enabled = true;
            document.getElementById('toggle-nombre-pistes').checked = true;
        }

        const slider = document.getElementById('nombre-pistes-slider');
        if (slider) {
            slider.value = value;
            slider.disabled = false;
        }

        document.getElementById('nombre-pistes-value-display').textContent = value + ' pistes';
    },

    setEquipesPreset(value) {
        this.constraints.equipes.value = value;
        if (!this.constraints.equipes.enabled) {
            this.constraints.equipes.enabled = true;
            document.getElementById('toggle-equipes').checked = true;
        }

        const slider = document.getElementById('equipes-slider');
        if (slider) {
            slider.value = value;
            slider.disabled = false;
        }

        document.getElementById('equipes-value-display').textContent = this.formatTeams(value);
    },

    getMaximumPistes(fallback = Number.POSITIVE_INFINITY) {
        if (!this.constraints.nombrePistes.enabled) return fallback;
        return Math.max(1, Math.round(Number(this.constraints.nombrePistes.value) || 1));
    },

    getTeamCount() {
        if (!this.constraints.equipes.enabled) return 1;
        return Math.max(1, Math.round(Number(this.constraints.equipes.value) || 1));
    },

    normalizePisteRef(value) {
        const raw = String(value || '').trim().toUpperCase();
        const match = raw.match(/\d+/);
        return match ? `P${match[0]}` : raw;
    },

    getPisteRef(piste) {
        return this.normalizePisteRef(piste?.numero || piste?.id);
    },

    getRelationTargetRef(relation) {
        return this.normalizePisteRef(relation?.target || relation?.piste_liee);
    },

    buildDependencyMap(pistes) {
        const refs = new Set((pistes || []).map(piste => this.getPisteRef(piste)).filter(Boolean));
        const dependencies = {};

        refs.forEach(ref => {
            dependencies[ref] = new Set();
        });

        (pistes || []).forEach(source => {
            const sourceRef = this.getPisteRef(source);
            if (!sourceRef || !dependencies[sourceRef]) return;

            (source.relations || []).forEach(relation => {
                const targetRef = this.getRelationTargetRef(relation);
                if (!targetRef || !refs.has(targetRef)) return;

                if (relation.type === 'prerequisite') {
                    dependencies[targetRef].add(sourceRef);
                } else if (relation.type === 'requires') {
                    dependencies[sourceRef].add(targetRef);
                }
            });
        });

        return Object.fromEntries(
            Object.entries(dependencies).map(([ref, deps]) => [ref, [...deps]])
        );
    },

    getRelationBonus(piste) {
        return (piste.relations || []).reduce((bonus, relation) => {
            if (relation.type === 'synergy') return bonus + 5;
            if (relation.type === 'feeds_data') return bonus + 3;
            if (relation.type === 'process_flow') return bonus + 2;
            return bonus;
        }, 0);
    },

    selectRespectingDependencies(scoredPistes, scoreKey, options = {}) {
        const maximumPistes = this.getMaximumPistes(options.fallbackMax || 10);
        const dependencyMap = this.buildDependencyMap(scoredPistes);
        const remaining = [...scoredPistes];
        const selected = [];
        const selectedRefs = new Set();
        let budgetUsed = 0;

        while (selected.length < maximumPistes && remaining.length > 0) {
            const feasible = remaining.filter(piste => {
                const cost = piste.budget?.cout_3_ans || 0;
                const fitsBudget = !this.constraints.budget.enabled || budgetUsed + cost <= this.constraints.budget.value;
                const fitsDuration = !this.constraints.duree.enabled || (piste.delai_mois || 0) <= this.constraints.duree.value;
                const fitsReduction = !this.constraints.reductionAccidents.enabled ||
                    (piste.impact_score || 0) >= this.constraints.reductionAccidents.value;

                return fitsBudget && fitsDuration && fitsReduction;
            });
            const candidates = feasible
                .filter(piste => {
                    const ref = this.getPisteRef(piste);
                    const deps = dependencyMap[ref] || [];
                    return deps.every(dep => selectedRefs.has(dep));
                })
                .sort((a, b) => {
                    const scoreDiff = (b[scoreKey] || 0) - (a[scoreKey] || 0);
                    if (scoreDiff !== 0) return scoreDiff;
                    return (a.delai_mois || 0) - (b.delai_mois || 0);
                });

            if (candidates.length === 0 && feasible.length === 0) break;

            const next = candidates[0] || feasible.sort((a, b) => {
                const scoreDiff = (b[scoreKey] || 0) - (a[scoreKey] || 0);
                if (scoreDiff !== 0) return scoreDiff;
                return (a.delai_mois || 0) - (b.delai_mois || 0);
            })[0];
            selected.push(next);
            selectedRefs.add(this.getPisteRef(next));
            budgetUsed += next.budget?.cout_3_ans || 0;
            remaining.splice(remaining.findIndex(piste => this.getPisteRef(piste) === this.getPisteRef(next)), 1);
        }

        return selected;
    },

    formatTeams(count) {
        const value = Math.max(1, Math.round(Number(count) || 1));
        return `${value} équipe${value > 1 ? 's' : ''}`;
    },

    setOptimizationMode(mode) {
        this.optimizationMode = mode;
    },

    applyDiagnosticPreset(preset) {
        const profile = preset.profile || {};
        this.constraints = {
            ...this.constraints,
            budget: { ...this.constraints.budget, enabled: true, value: Number(profile.budget || 1000000) },
            duree: { ...this.constraints.duree, enabled: true, value: Number(profile.horizon || 12) },
            nombrePistes: { ...this.constraints.nombrePistes, enabled: true, value: Number(profile.maximumPistes || 5) },
            equipes: { ...this.constraints.equipes, enabled: true, value: Number(profile.equipes || 1) }
        };
        this.results.selectedPistes = Array.isArray(preset.pistes) ? preset.pistes : [];
        this.results.paretoFront = [];
        this.calculateAggregatedMetrics();
        if (preset.planning && Array.isArray(preset.planning.teams)) {
            this.results.planning = preset.planning;
        }
        this.diagnosticSource = {
            name: preset.name || 'personnalisée',
            prospectName: profile.prospectName || ''
        };
        this.activeTab = 'resultats';
        this.optimizationMode = 'weighted';
        appStore.setState({ simulatorPreset: null });
    },

    setActiveTab(tab) {
        this.activeTab = tab;
        this.rerender();
        
        // Initialiser les graphiques si nécessaire
        if (tab === 'resultats' && this.results.selectedPistes.length > 0) {
            setTimeout(() => this.initRadarChart(), 100);
        } else if (tab === 'comparaison' && this.results.paretoFront.length > 0) {
            setTimeout(() => this.initParetoChart(), 100);
        }
    },

    runSimulation() {
        const state = appStore ? appStore.getState() : {};
        const allPistes = state.allPistes || [];
        
        // Vérifier que les contraintes sont valides
        if (this.constraints.dimensions.enabled && this.calculateDimensionsTotal() !== 100) {
            alert('Les dimensions doivent totaliser 100%');
            return;
        }
        
        // Exécuter l'optimisation selon le mode choisi
        switch(this.optimizationMode) {
            case 'weighted':
                this.runWeightedOptimization(allPistes);
                break;
            case 'pareto':
                this.runParetoOptimization(allPistes);
                break;
            case 'budget_first':
                this.runBudgetFirstOptimization(allPistes);
                break;
        }
        
        // Basculer vers l'onglet résultats
        this.activeTab = 'resultats';
        this.rerender();
        
        // Initialiser le graphique radar après le rendu
        setTimeout(() => this.initRadarChart(), 100);
    },

    runWeightedOptimization(allPistes) {
        // Calculer un score pondéré pour chaque piste
        const scoredPistes = allPistes.map(piste => {
            let score = 0;
            let weights = 0;
            
            // Score d'impact (toujours pris en compte)
            score += (piste.impact_score || 0) * 2;
            weights += 2;
            
            // Contrainte budget
            if (this.constraints.budget.enabled) {
                const budgetScore = Math.max(0, 1 - (piste.budget?.cout_3_ans || 0) / this.constraints.budget.value);
                score += budgetScore * 100;
                weights += 1;
            }
            
            // Contrainte dimensions
            if (this.constraints.dimensions.enabled && piste.dimensions) {
                const dimScore = this.calculateDimensionSimilarity(piste.dimensions);
                score += dimScore * 50;
                weights += 1;
            }
            
            // Contrainte durée
            if (this.constraints.duree.enabled) {
                const dureeScore = Math.max(0, 1 - (piste.delai_mois || 0) / this.constraints.duree.value);
                score += dureeScore * 50;
                weights += 1;
            }
            
            // Contrainte réduction accidents
            if (this.constraints.reductionAccidents.enabled) {
                const reduction = (piste.impact_score || 0) / 100; // Approximation
                if (reduction * 100 >= this.constraints.reductionAccidents.value) {
                    score += 100;
                }
                weights += 1;
            }
            
            return {
                ...piste,
                _score: (score / weights) + this.getRelationBonus(piste)
            };
        });
        
        // Trier par score et sélectionner les meilleures
        this.results.selectedPistes = this.selectRespectingDependencies(scoredPistes, '_score', { fallbackMax: 10 });
        
        // Calculer les métriques agrégées
        this.calculateAggregatedMetrics();
    },

    runParetoOptimization(allPistes) {
        // Algorithme simple pour trouver le front de Pareto
        // On considère budget vs impact
        const solutions = [];
        
        // Générer des combinaisons (simplifié - dans un vrai système on utiliserait un algo plus sophistiqué)
        const sortedByEfficiency = [...allPistes].sort((a, b) => {
            const effA = (a.impact_score || 0) / (a.budget?.cout_3_ans || 1);
            const effB = (b.impact_score || 0) / (b.budget?.cout_3_ans || 1);
            return effB - effA;
        });
        
        // Construire le front de Pareto
        let currentBudget = 0;
        let currentImpact = 0;
        const selected = [];
        const maximumPistes = this.getMaximumPistes();
        
        for (const piste of sortedByEfficiency) {
            if (selected.length >= maximumPistes) break;

            const budget = piste.budget?.cout_3_ans || 0;
            
            if (this.constraints.budget.enabled && currentBudget + budget > this.constraints.budget.value) {
                continue;
            }
            
            if (this.constraints.duree.enabled && (piste.delai_mois || 0) > this.constraints.duree.value) {
                continue;
            }
            
            selected.push(piste);
            currentBudget += budget;
            currentImpact += piste.impact_score || 0;
            
            solutions.push({
                pistes: [...selected],
                budget: currentBudget,
                impact: currentImpact / selected.length
            });
        }
        
        this.results.paretoFront = solutions;
        
        // Par défaut, sélectionner la dernière solution (celle avec le plus d'impact)
        if (solutions.length > 0) {
            this.results.selectedPistes = solutions[solutions.length - 1].pistes;
            this.calculateAggregatedMetrics();
        }
    },

    runBudgetFirstOptimization(allPistes) {
        if (!this.constraints.budget.enabled) {
            alert('Le mode "Budget d\'abord" necessite une contrainte budgetaire');
            return;
        }

        const withEfficiency = allPistes.map(piste => ({
            ...piste,
            _efficiency: ((piste.impact_score || 0) + this.getRelationBonus(piste)) / (piste.budget?.cout_3_ans || 1)
        }));

        this.results.selectedPistes = this.selectRespectingDependencies(withEfficiency, '_efficiency');
        this.calculateAggregatedMetrics();
    },

    calculateDimensionSimilarity(pisteDims) {
        if (!pisteDims) return 0;
        
        const target = this.constraints.dimensions;
        const total = this.calculateDimensionsTotal();
        
        // Normaliser les dimensions de la piste
        const pisteTotal = (pisteDims.culture || 0) + (pisteDims.technique || 0) + 
                          (pisteDims.humain || 0) + (pisteDims.organisationnel || 0) + 
                          (pisteDims.economique || 0);
        
        if (pisteTotal === 0) return 0;
        
        // Calculer la similarité (1 - distance normalisée)
        let distance = 0;
        distance += Math.abs((pisteDims.culture || 0) / pisteTotal * 100 - target.culture);
        distance += Math.abs((pisteDims.technique || 0) / pisteTotal * 100 - target.technique);
        distance += Math.abs((pisteDims.humain || 0) / pisteTotal * 100 - target.humain);
        distance += Math.abs((pisteDims.organisationnel || 0) / pisteTotal * 100 - target.organisationnel);
        distance += Math.abs((pisteDims.economique || 0) / pisteTotal * 100 - target.economique);
        
        // Distance maximale possible: 500 (5 dimensions * 100)
        return Math.max(0, 1 - distance / 500);
    },

    calculateAggregatedMetrics() {
        const pistes = this.results.selectedPistes;
        
        if (!pistes || pistes.length === 0) {
            this.results.totalBudget = 0;
            this.results.totalImpact = 0;
            this.results.averageDuree = 0;
            this.results.planning = null;
            this.results.totalReduction = 0;
            this.results.dimensionScores = {
                culture: 0, technique: 0, humain: 0, organisationnel: 0, economique: 0
            };
            return;
        }
        
        // Budget total
        this.results.totalBudget = pistes.reduce((sum, p) => sum + (p.budget?.cout_3_ans || 0), 0);
        
        // Impact moyen
        this.results.totalImpact = pistes.reduce((sum, p) => sum + (p.impact_score || 0), 0);
        
        // Durée moyenne
        const totalDuree = pistes.reduce((sum, p) => sum + (p.delai_mois || 0), 0);
        this.results.averageDuree = totalDuree / pistes.length;
        this.results.planning = this.calculatePlanning(pistes);
        
        // Réduction totale (approximation - on prend le max)
        this.results.totalReduction = Math.max(...pistes.map(p => p.impact_score || 0)) / 100 * 100;
        
        // Scores dimensionnels pondérés
        const dims = { culture: 0, technique: 0, humain: 0, organisationnel: 0, economique: 0 };
        let totalWeight = 0;
        
        pistes.forEach(p => {
            if (p.dimensions) {
                const weight = p.impact_score || 1;
                totalWeight += weight;
                
                dims.culture += (p.dimensions.culture || 0) * weight;
                dims.technique += (p.dimensions.technique || 0) * weight;
                dims.humain += (p.dimensions.humain || 0) * weight;
                dims.organisationnel += (p.dimensions.organisationnel || 0) * weight;
                dims.economique += (p.dimensions.economique || 0) * weight;
            }
        });
        
        if (totalWeight > 0) {
            Object.keys(dims).forEach(key => {
                dims[key] = dims[key] / totalWeight;
            });
        }
        
        this.results.dimensionScores = dims;
    },

    calculatePlanning(pistes, teamCount = this.getTeamCount()) {
        const normalizedTeamCount = Math.max(1, Math.round(Number(teamCount) || 1));
        const teams = Array.from({ length: normalizedTeamCount }, (_, index) => ({
            id: index + 1,
            availableAt: 0,
            tasks: []
        }));
        const dependencyMap = this.buildDependencyMap(pistes || []);
        const tasks = [...(pistes || [])].map(piste => ({
            piste,
            ref: this.getPisteRef(piste),
            duration: Math.max(1, Math.round(Number(piste.delai_mois) || 1))
        }));
        const unscheduled = [...tasks];
        const completedAt = {};

        while (unscheduled.length > 0) {
            const readyTasks = unscheduled
                .filter(task => (dependencyMap[task.ref] || []).every(dep => completedAt[dep] !== undefined))
                .sort((left, right) => {
                    const leftScore = left.piste._score || left.piste.impact_score || 0;
                    const rightScore = right.piste._score || right.piste.impact_score || 0;
                    if (rightScore !== leftScore) return rightScore - leftScore;
                    return right.duration - left.duration;
                });
            const task = readyTasks[0] || unscheduled[0];
            const earliestStart = Math.max(0, ...(dependencyMap[task.ref] || []).map(dep => completedAt[dep] || 0));
            const team = teams.reduce((best, candidate) => {
                const bestStart = Math.max(best.availableAt, earliestStart);
                const candidateStart = Math.max(candidate.availableAt, earliestStart);
                return candidateStart < bestStart ? candidate : best;
            }, teams[0]);
            const start = Math.max(team.availableAt, earliestStart);
            const scheduledTask = {
                piste: task.piste,
                duration: task.duration,
                start,
                end: start + task.duration
            };
            team.tasks.push(scheduledTask);
            team.availableAt = scheduledTask.end;
            completedAt[task.ref] = scheduledTask.end;
            unscheduled.splice(unscheduled.findIndex(candidate => candidate.ref === task.ref), 1);
        }

        const sequentialDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
        const totalDuration = teams.reduce((longest, team) => Math.max(longest, team.availableAt), 0);
        const savedMonths = Math.max(0, sequentialDuration - totalDuration);

        return {
            teamCount: normalizedTeamCount,
            teams,
            sequentialDuration,
            totalDuration,
            savedMonths,
            savingPercentage: sequentialDuration > 0 ? Math.round((savedMonths / sequentialDuration) * 100) : 0
        };
    },

    initRadarChart() {
        const canvas = document.getElementById('dimensions-radar');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        const dims = this.results.dimensionScores;
        
        if (this.radarChartInstance) {
            this.radarChartInstance.destroy();
        }
        this.radarChartInstance = new window.Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['CULTURE', 'TECHNIQUE', 'HUMAIN', 'ORGANISATIONNEL', 'ÉCONOMIQUE'],
                datasets: [{
                    label: 'Distribution',
                    data: [
                        dims.culture || 0,
                        dims.technique || 0,
                        dims.humain || 0,
                        dims.organisationnel || 0,
                        dims.economique || 0
                    ],
                    backgroundColor: 'rgba(255, 107, 53, 0.2)',
                    borderColor: '#FF6B35',
                    borderWidth: 2,
                    pointBackgroundColor: '#FF6B35',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#FF6B35'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            callback: value => value + '%'
                        }
                    }
                }
            }
        });
    },

    initParetoChart() {
        const canvas = document.getElementById('pareto-chart');
        if (!canvas || !window.Chart || this.results.paretoFront.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        const front = this.results.paretoFront;
        
        if (this.paretoChartInstance) {
            this.paretoChartInstance.destroy();
        }
        this.paretoChartInstance = new window.Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Front de Pareto',
                    data: front.map(s => ({
                        x: s.budget / 1000000, // en millions
                        y: s.impact
                    })),
                    backgroundColor: '#FF6B35',
                    pointRadius: 8,
                    pointHoverRadius: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Budget (M€)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Impact moyen (/100)'
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const point = context.raw;
                                return `Budget: ${point.x.toFixed(1)}M€, Impact: ${point.y.toFixed(1)}/100`;
                            }
                        }
                    }
                }
            }
        });
    },

    selectSolution(index) {
        if (index >= 0 && index < this.results.paretoFront.length) {
            this.results.selectedPistes = this.results.paretoFront[index].pistes;
            this.calculateAggregatedMetrics();
            this.activeTab = 'resultats';
            this.rerender();
            
            setTimeout(() => this.initRadarChart(), 100);
        }
    },

    loadSolution(index) {
        this.selectSolution(index);
    },

    viewPisteDetails(pisteId) {
        if (window.router) {
            window.router.navigate(`/piste-detail/${pisteId}`);
        }
    },

    removeFromSelection(pisteId) {
        this.results.selectedPistes = this.results.selectedPistes.filter(p => p.numero !== pisteId);
        this.calculateAggregatedMetrics();
        this.rerender();
        
        setTimeout(() => this.initRadarChart(), 100);
    },

    addToScenario() {
        if (this.results.selectedPistes.length === 0) {
            alert('Aucune piste sélectionnée');
            return;
        }
        
        // Ajouter chaque piste au scénario
        this.results.selectedPistes.forEach(piste => {
            if (window.appActions) {
                window.appActions.addPisteToScenario(piste);
            }
        });
        appStore?.setState?.({
            currentScenarioPlanning: this.results.planning,
            currentScenarioConstraints: this.constraints
        });
        
        if (window.Notifications) {
            Notifications.success(`${this.results.selectedPistes.length} pistes ajoutées au scénario`);
        } else {
            alert(`${this.results.selectedPistes.length} pistes ajoutées au scénario`);
        }
    },

    exportResults() {
        // Créer un objet de résultats à exporter
        const exportData = {
            date: new Date().toISOString(),
            constraints: this.constraints,
            results: {
                selectedPistes: this.results.selectedPistes.map(p => ({
                    numero: p.numero,
                    titre: p.titre,
                    budget: p.budget?.cout_3_ans,
                    impact: p.impact_score,
                    duree: p.delai_mois
                })),
                totalBudget: this.results.totalBudget,
                averageImpact: this.results.totalImpact / this.results.selectedPistes.length,
                averageDuree: this.results.averageDuree,
                planning: this.results.planning
            }
        };
        
        // Télécharger en JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulation_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    resetConstraints() {
        this.constraints = {
            budget: { enabled: false, value: 1000000, max: 5000000 },
            dimensions: { enabled: false, culture: 20, technique: 20, humain: 20, organisationnel: 20, economique: 20 },
            duree: { enabled: false, value: 12, max: 60 },
            nombrePistes: { enabled: true, value: 5, max: 20 },
            equipes: { enabled: true, value: 1, max: 5 },
            reductionAccidents: { enabled: false, value: 20, max: 100 }
        };
        
        this.results = {
            selectedPistes: [],
            totalBudget: 0,
            totalImpact: 0,
            averageDuree: 0,
            planning: null,
            totalReduction: 0,
            dimensionScores: { culture: 0, technique: 0, humain: 0, organisationnel: 0, economique: 0 },
            paretoFront: []
        };
        this.diagnosticSource = null;
        
        this.rerender();
    },

    formatCurrency(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + ' M€';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + ' k€';
        }
        return amount + ' €';
    },

    getPriorityClass(priority) {
        const map = { 'P1': 'critical', 'P2': 'high', 'P3': 'medium', 'P4': 'low' };
        return map[priority] || 'medium';
    },

    getDimensionColor(dimension) {
        const colors = {
            culture: '#FF6B35',
            technique: '#003D82',
            humain: '#10B981',
            organisationnel: '#F59E0B',
            economique: '#8B5CF6'
        };
        return colors[dimension] || '#64748B';
    },

    rerender() {
        this.render().then(html => {
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = html;
                this.setupEventListeners();
            }
        });
    },

    setupEventListeners() {
        console.log('Setup event listeners - Simulateur');
    }
};

// Exporter pour usage global
window.pages = window.pages || {};
window.pages.Simulateur = pages.Simulateur;
