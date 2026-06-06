/**
 * PAGES/MODE_EMPLOI.JS - Page de mode d'emploi simplifié
 * Guide pas à pas pour les utilisateurs
 */

pages.ModeEmploi = {
    activeStep: 1,
    totalSteps: 6,

    async render() {
        return `
            <div class="mode-emploi-wrapper">
                <!-- En-tête -->
                <header class="mode-emploi-header">
                    <div class="header-content">
                        <h1>
                            <span class="material-symbols-outlined">school</span>
                            Mode d'emploi
                        </h1>
                        <p class="header-subtitle">Guide pas à pas pour utiliser le simulateur de sécurité</p>
                    </div>
                </header>

                <!-- Barre de progression -->
                <div class="progress-container">
                    <div class="progress-steps">
                        ${[1, 2, 3, 4, 5, 6].map(step => `
                            <div class="progress-step ${step === this.activeStep ? 'active' : ''} ${step < this.activeStep ? 'completed' : ''}" onclick="pages.ModeEmploi.goToStep(${step})">
                                <div class="step-indicator">
                                    ${step < this.activeStep ? '<span class="material-symbols-outlined">check</span>' : step}
                                </div>
                                <span class="step-label">${this.getStepLabel(step)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Contenu principal -->
                <main class="mode-emploi-main">
                    ${this.renderCurrentStep()}
                </main>

                <!-- Navigation entre étapes -->
                <div class="step-navigation">
                    <button class="nav-btn prev" onclick="pages.ModeEmploi.prevStep()" ${this.activeStep === 1 ? 'disabled' : ''}>
                        <span class="material-symbols-outlined">arrow_back</span>
                        Étape précédente
                    </button>
                    
                    <div class="step-dots">
                        ${[1, 2, 3, 4, 5, 6].map(step => `
                            <span class="dot ${step === this.activeStep ? 'active' : ''}" onclick="pages.ModeEmploi.goToStep(${step})"></span>
                        `).join('')}
                    </div>
                    
                    <button class="nav-btn next" onclick="pages.ModeEmploi.nextStep()" ${this.activeStep === 6 ? 'disabled' : ''}>
                        Étape suivante
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

                <!-- Actions rapides -->
                <div class="quick-actions">
                    <h3>Actions rapides</h3>
                    <div class="actions-grid">
                        <a href="#/explorer" class="action-card">
                            <span class="material-symbols-outlined">explore</span>
                            <span>Explorer les pistes</span>
                        </a>
                        <a href="#/simulateur" class="action-card">
                            <span class="material-symbols-outlined">auto_awesome</span>
                            <span>Lancer une simulation</span>
                        </a>
                        <a href="#/problematique" class="action-card">
                            <span class="material-symbols-outlined">info</span>
                            <span>Comprendre le contexte</span>
                        </a>
                        <a href="#/documentation" class="action-card">
                            <span class="material-symbols-outlined">menu_book</span>
                            <span>Documentation complète</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    getStepLabel(step) {
        const labels = {
            1: 'Découvrir',
            2: 'Explorer',
            3: 'Simuler',
            4: 'Comparer',
            5: 'Décider',
            6: 'Exporter'
        };
        return labels[step] || `Étape ${step}`;
    },

    renderCurrentStep() {
        switch(this.activeStep) {
            case 1:
                return this.renderStep1();
            case 2:
                return this.renderStep2();
            case 3:
                return this.renderStep3();
            case 4:
                return this.renderStep4();
            case 5:
                return this.renderStep5();
            case 6:
                return this.renderStep6();
            default:
                return this.renderStep1();
        }
    },

    renderStep1() {
        return `
            <div class="step-content">
                <div class="step-header">
                    <span class="step-badge">Étape 1/6</span>
                    <h2>Découvrir le contexte</h2>
                </div>

                <div class="step-body">
                    <div class="step-description">
                        <p class="step-intro">
                            Avant de commencer, prenez quelques minutes pour comprendre le contexte 
                            et les enjeux du projet de sécurité en piste.
                        </p>

                        <div class="info-box">
                            <span class="material-symbols-outlined">info</span>
                            <div>
                                <h4>Pourquoi c'est important ?</h4>
                                <p>Comprendre la situation actuelle vous aidera à mieux évaluer la pertinence des différentes pistes d'amélioration.</p>
                            </div>
                        </div>

                        <h3>Ce que vous allez apprendre</h3>
                        <ul class="check-list">
                            <li>
                                <span class="material-symbols-outlined">check_circle</span>
                                L'augmentation critique des accidents (+100% en 2024-2025)
                            </li>
                            <li>
                                <span class="material-symbols-outlined">check_circle</span>
                                Les causes principales : renouvellement des effectifs, nouveaux comportements
                            </li>
                            <li>
                                <span class="material-symbols-outlined">check_circle</span>
                                Les objectifs du projet : zéro accident corporel d'ici 2028
                            </li>
                        </ul>
                    </div>

                    <div class="step-visual">
                        <div class="visual-card">
                            <span class="material-symbols-outlined">warning</span>
                            <h4>Urgence sécuritaire</h4>
                            <p>+100% d'accidents corporels</p>
                        </div>
                        <div class="visual-card">
                            <span class="material-symbols-outlined">groups</span>
                            <h4>Renouvellement</h4>
                            <p>40% d'embauches récentes</p>
                        </div>
                        <div class="visual-card">
                            <span class="material-symbols-outlined">flag</span>
                            <h4>Objectif</h4>
                            <p>Zéro accident en 2028</p>
                        </div>
                    </div>
                </div>

                <div class="step-action">
                    <a href="#/problematique" class="btn-primary">
                        Voir la problématique détaillée
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>

                <div class="tip-box">
                    <span class="material-symbols-outlined">lightbulb</span>
                    <p>La page "Problématique" contient toutes les informations détaillées sur le contexte et les enjeux.</p>
                </div>
            </div>
        `;
    },

    renderStep2() {
        return `
            <div class="step-content">
                <div class="step-header">
                    <span class="step-badge">Étape 2/6</span>
                    <h2>Explorer les pistes</h2>
                </div>

                <div class="step-body">
                    <div class="step-description">
                        <p class="step-intro">
                            Consultez l'inventaire complet des 61 pistes d'amélioration. Utilisez les filtres 
                            pour trouver rapidement celles qui vous intéressent.
                        </p>

                        <h3>Comment faire ?</h3>
                        
                        <div class="instruction-step">
                            <div class="instruction-number">1</div>
                            <div class="instruction-text">
                                <strong>Filtrez par catégorie</strong>
                                <p>Dans le panneau de gauche, cochez les catégories qui vous intéressent : Humain, Technique, Organisationnel...</p>
                            </div>
                        </div>

                        <div class="instruction-step">
                            <div class="instruction-number">2</div>
                            <div class="instruction-text">
                                <strong>Filtrez par priorité</strong>
                                <p>Sélectionnez les niveaux de priorité (CRITICAL à LOW) pour voir les actions critiques en premier.</p>
                            </div>
                        </div>

                        <div class="instruction-step">
                            <div class="instruction-number">3</div>
                            <div class="instruction-text">
                                <strong>Utilisez la recherche</strong>
                                <p>Tapez un mot-clé ou un ID de piste dans la barre de recherche.</p>
                            </div>
                        </div>

                        <div class="instruction-step">
                            <div class="instruction-number">4</div>
                            <div class="instruction-text">
                                <strong>Ajustez le budget</strong>
                                <p>Utilisez le curseur pour définir un budget maximum et voir les pistes abordables.</p>
                            </div>
                        </div>
                    </div>

                    <div class="step-visual">
                        <div class="demo-card">
                            <div class="demo-header">
                                <span class="demo-badge">CRITICAL</span>
                                <span class="demo-category">Technique</span>
                            </div>
                            <h4>Éthylotests connectés</h4>
                            <div class="demo-meta">
                                <span>Budget: 285k€</span>
                                <span>Impact: 85/100</span>
                            </div>
                        </div>
                        
                        <div class="demo-card">
                            <div class="demo-header">
                                <span class="demo-badge">HIGH</span>
                                <span class="demo-category">Humain</span>
                            </div>
                            <h4>Formation VR</h4>
                            <div class="demo-meta">
                                <span>Budget: 150k€</span>
                                <span>Impact: 78/100</span>
                            </div>
                        </div>

                        <div class="filter-preview">
                            <span class="material-symbols-outlined">filter_alt</span>
                            <span>Filtres actifs: Technique, CRITICAL, Budget < 500k€</span>
                        </div>
                    </div>
                </div>

                <div class="step-action">
                    <a href="#/explorer" class="btn-primary">
                        Aller dans Explorer
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>

                <div class="tip-box">
                    <span class="material-symbols-outlined">star</span>
                    <p>Vous pouvez noter les pistes avec les étoiles pour marquer vos préférées. Les notes sont sauvegardées automatiquement.</p>
                </div>
            </div>
        `;
    },

    renderStep3() {
        return `
            <div class="step-content">
                <div class="step-header">
                    <span class="step-badge">Étape 3/6</span>
                    <h2>Lancer une simulation</h2>
                </div>

                <div class="step-body">
                    <div class="step-description">
                        <p class="step-intro">
                            Le simulateur vous aide à trouver la meilleure combinaison de pistes selon vos contraintes.
                        </p>

                        <h3>Définissez vos contraintes</h3>

                        <div class="constraint-demo">
                            <div class="constraint-item">
                                <span class="material-symbols-outlined">payments</span>
                                <div class="constraint-detail">
                                    <strong>Budget maximum</strong>
                                    <div class="slider-preview">
                                        <div class="slider-track">
                                            <div class="slider-fill" style="width: 60%"></div>
                                        </div>
                                        <span>1,2 M€</span>
                                    </div>
                                </div>
                            </div>

                            <div class="constraint-item">
                                <span class="material-symbols-outlined">donut_large</span>
                                <div class="constraint-detail">
                                    <strong>Dimensions</strong>
                                    <div class="dimensions-mini">
                                        <span class="dim-dot" style="background: #FF6B35"></span> Culture 20%
                                        <span class="dim-dot" style="background: #003D82"></span> Tech 30%
                                    </div>
                                </div>
                            </div>

                            <div class="constraint-item">
                                <span class="material-symbols-outlined">schedule</span>
                                <div class="constraint-detail">
                                    <strong>Durée maximum</strong>
                                    <span>24 mois</span>
                                </div>
                            </div>
                        </div>

                        <h3>Choisissez un mode d'optimisation</h3>
                        
                        <div class="mode-selector-preview">
                            <div class="mode-option active">
                                <strong>Pondéré</strong>
                                <small>Combine toutes les contraintes</small>
                            </div>
                            <div class="mode-option">
                                <strong>Pareto</strong>
                                <small>Meilleurs compromis</small>
                            </div>
                            <div class="mode-option">
                                <strong>Budget d'abord</strong>
                                <small>Maximise l'impact</small>
                            </div>
                        </div>
                    </div>

                    <div class="step-visual">
                        <div class="result-preview">
                            <h4>Résultat simulation</h4>
                            <div class="result-stats">
                                <div>Budget: 1,05 M€</div>
                                <div>Impact: 82/100</div>
                                <div>Pistes: 5 sélectionnées</div>
                            </div>
                            <div class="result-list">
                                <div>P001 - Éthylotests connectés</div>
                                <div>P023 - Formation VR</div>
                                <div>P045 - Rotation des zones</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-action">
                    <a href="#/simulateur" class="btn-primary">
                        Lancer une simulation
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>

                <div class="tip-box">
                    <span class="material-symbols-outlined">tips_and_updates</span>
                    <p>Essayez différents modes d'optimisation pour voir des résultats complémentaires. Le mode Pareto est idéal pour explorer les compromis.</p>
                </div>
            </div>
        `;
    },

    renderStep4() {
        return `
            <div class="step-content">
                <div class="step-header">
                    <span class="step-badge">Étape 4/6</span>
                    <h2>Comparer les scénarios</h2>
                </div>

                <div class="step-body">
                    <div class="step-description">
                        <p class="step-intro">
                            Comparez plusieurs scénarios côte à côte pour identifier la meilleure stratégie.
                        </p>

                        <h3>Visualisation comparative</h3>

                        <div class="comparison-preview">
                            <div class="scenario-preview">
                                <h4>Scénario A - Quick Wins</h4>
                                <div class="radar-mini">
                                    <div class="radar-line" style="transform: rotate(0deg) scale(0.8)"></div>
                                    <div class="radar-line" style="transform: rotate(72deg) scale(0.6)"></div>
                                    <div class="radar-line" style="transform: rotate(144deg) scale(0.9)"></div>
                                    <div class="radar-line" style="transform: rotate(216deg) scale(0.7)"></div>
                                    <div class="radar-line" style="transform: rotate(288deg) scale(0.5)"></div>
                                </div>
                                <div class="scenario-stats">
                                    <span>Budget: 850k€</span>
                                    <span>Impact: 78/100</span>
                                </div>
                            </div>

                            <div class="scenario-preview">
                                <h4>Scénario B - Équilibré</h4>
                                <div class="radar-mini">
                                    <div class="radar-line" style="transform: rotate(0deg) scale(0.7)"></div>
                                    <div class="radar-line" style="transform: rotate(72deg) scale(0.8)"></div>
                                    <div class="radar-line" style="transform: rotate(144deg) scale(0.7)"></div>
                                    <div class="radar-line" style="transform: rotate(216deg) scale(0.8)"></div>
                                    <div class="radar-line" style="transform: rotate(288deg) scale(0.6)"></div>
                                </div>
                                <div class="scenario-stats">
                                    <span>Budget: 1,2M€</span>
                                    <span>Impact: 85/100</span>
                                </div>
                            </div>
                        </div>

                        <h3>Tableau de scoring</h3>
                        <table class="mini-table">
                            <tr>
                                <th>Métrique</th>
                                <th>Scénario A</th>
                                <th>Scénario B</th>
                            </tr>
                            <tr>
                                <td>Budget total</td>
                                <td>850k€</td>
                                <td class="best">1,2M€</td>
                            </tr>
                            <tr>
                                <td>Impact moyen</td>
                                <td>78</td>
                                <td class="best">85</td>
                            </tr>
                            <tr>
                                <td>Accidents évités</td>
                                <td>12/an</td>
                                <td class="best">18/an</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="step-action">
                    <a href="#/compare" class="btn-primary">
                        Aller dans Comparaison
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>

                <div class="tip-box">
                    <span class="material-symbols-outlined">visibility</span>
                    <p>Les radars vous montrent l'équilibre entre les 5 dimensions. Un radar équilibré indique une couverture complète.</p>
                </div>
            </div>
        `;
    },

    renderStep5() {
        return `
            <div class="step-content">
                <div class="step-header">
                    <span class="step-badge">Étape 5/6</span>
                    <h2>Prendre une décision</h2>
                </div>

                <div class="step-body">
                    <div class="step-description">
                        <p class="step-intro">
                            La page de décision présente votre plan d'action final avec tous les détails nécessaires à la validation.
                        </p>

                        <h3>Ce que vous trouverez</h3>

                        <div class="decision-features">
                            <div class="feature-preview">
                                <span class="material-symbols-outlined">payments</span>
                                <div>
                                    <strong>Résumé financier</strong>
                                    <p>Budget total, répartition Capex/Opex</p>
                                </div>
                            </div>

                            <div class="feature-preview">
                                <span class="material-symbols-outlined">analytics</span>
                                <div>
                                    <strong>Indicateurs d'impact</strong>
                                    <p>Accidents évités, économies, ROI</p>
                                </div>
                            </div>

                            <div class="feature-preview">
                                <span class="material-symbols-outlined">donut_large</span>
                                <div>
                                    <strong>Dimensions</strong>
                                    <p>Distribution sur les 5 axes</p>
                                </div>
                            </div>

                            <div class="feature-preview">
                                <span class="material-symbols-outlined">list_alt</span>
                                <div>
                                    <strong>Détail des pistes</strong>
                                    <p>Liste complète avec métriques</p>
                                </div>
                            </div>
                        </div>

                        <div class="validation-note-preview">
                            <h4>Note de validation</h4>
                            <p>Ce plan inclut une marge de contingence de 10% et a été validé par l'équipe sécurité.</p>
                            <div class="signature-line">
                                <span>Validé par : _________________</span>
                                <span>Date : _________________</span>
                            </div>
                        </div>
                    </div>

                    <div class="step-visual">
                        <div class="kpi-preview">
                            <div class="kpi-item">
                                <span class="kpi-label">Budget total</span>
                                <span class="kpi-value">1,45 M€</span>
                            </div>
                            <div class="kpi-item">
                                <span class="kpi-label">Impact moyen</span>
                                <span class="kpi-value">82/100</span>
                            </div>
                            <div class="kpi-item">
                                <span class="kpi-label">Accidents évités</span>
                                <span class="kpi-value">24/an</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="step-action">
                    <a href="#/decide" class="btn-primary">
                        Aller dans Décision
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>

                <div class="tip-box">
                    <span class="material-symbols-outlined">check_circle</span>
                    <p>Vérifiez bien tous les détails avant de passer à l'export. Vous pouvez encore ajuster votre sélection.</p>
                </div>
            </div>
        `;
    },

    renderStep6() {
        return `
            <div class="step-content">
                <div class="step-header">
                    <span class="step-badge">Étape 6/6</span>
                    <h2>Exporter et partager</h2>
                </div>

                <div class="step-body">
                    <div class="step-description">
                        <p class="step-intro">
                            Exportez votre plan d'action au format de votre choix pour le partager avec les parties prenantes.
                        </p>

                        <h3>Formats disponibles</h3>

                        <div class="export-options">
                            <div class="export-card">
                                <span class="material-symbols-outlined">picture_as_pdf</span>
                                <h4>PDF</h4>
                                <p>Document professionnel formaté, idéal pour impression et présentation</p>
                                <ul>
                                    <li>✓ Mise en page optimisée</li>
                                    <li>✓ Tableaux et graphiques</li>
                                    <li>✓ Espace pour signature</li>
                                </ul>
                            </div>

                            <div class="export-card">
                                <span class="material-symbols-outlined">data_usage</span>
                                <h4>JSON</h4>
                                <p>Données brutes pour analyse externe ou intégration</p>
                                <ul>
                                    <li>✓ Format structuré</li>
                                    <li>✓ Compatible avec d'autres outils</li>
                                    <li>✓ Données complètes</li>
                                </ul>
                            </div>
                        </div>

                        <h3>Exemple de PDF généré</h3>
                        <div class="pdf-preview">
                            <div class="pdf-header">
                                <span>Safety Simulator - Plan d'action sécurité</span>
                                <span>24/02/2026</span>
                            </div>
                            <div class="pdf-content">
                                <div class="pdf-section">
                                    <strong>Résumé exécutif</strong>
                                    <p>Plan d'action comprenant 8 pistes pour un budget total de 1,45 M€...</p>
                                </div>
                                <div class="pdf-section">
                                    <strong>Pistes sélectionnées</strong>
                                    <div>P001 - Éthylotests connectés</div>
                                    <div>P023 - Formation VR</div>
                                    <div>P045 - Rotation des zones</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step-visual">
                        <div class="export-icons">
                            <span class="material-symbols-outlined">file_download</span>
                            <span class="material-symbols-outlined">print</span>
                            <span class="material-symbols-outlined">share</span>
                        </div>
                        <p class="export-note">Les exports sont conformes aux standards de reporting CSCA</p>
                    </div>
                </div>

                <div class="step-action">
                    <a href="#/decide" class="btn-primary">
                        Exporter mon plan
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>

                <div class="success-box">
                    <span class="material-symbols-outlined">celebration</span>
                    <div>
                        <h4>Félicitations !</h4>
                        <p>Vous savez maintenant utiliser toutes les fonctionnalités du simulateur Safety Simulator.</p>
                    </div>
                </div>
            </div>
        `;
    },

    goToStep(step) {
        this.activeStep = step;
        this.rerender();
    },

    nextStep() {
        if (this.activeStep < this.totalSteps) {
            this.activeStep++;
            this.rerender();
        }
    },

    prevStep() {
        if (this.activeStep > 1) {
            this.activeStep--;
            this.rerender();
        }
    },

    rerender() {
        this.render().then(html => {
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = html;
            }
        });
    }
};

window.pages = window.pages || {};
window.pages.ModeEmploi = pages.ModeEmploi;
