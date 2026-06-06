/**
 * PAGES/DOCUMENTATION.JS - Page de documentation du système
 * Guide d'utilisation, architecture et références techniques
 */

pages.Documentation = {
    activeSection: 'guide',
    activeSubsection: 'introduction',

    async render() {
        return `
            <div class="doc-wrapper">
                <!-- En-tête -->
                <header class="doc-header">
                    <div class="header-content">
                        <h1>
                            <span class="material-symbols-outlined">menu_book</span>
                            Documentation
                        </h1>
                        <p class="header-subtitle">Guide d'utilisation, architecture et références du système Safety Simulator</p>
                    </div>
                    <div class="header-search">
                        <span class="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Rechercher dans la documentation..." id="doc-search" onkeyup="pages.Documentation.searchDocs(this.value)">
                    </div>
                </header>

                <div class="doc-container">
                    <!-- Sidebar navigation -->
                    <aside class="doc-sidebar">
                        <nav class="doc-nav">
                            <div class="nav-section">
                                <h3 class="nav-section-title" onclick="pages.Documentation.toggleSection('guide')">
                                    <span class="material-symbols-outlined">chevron_right</span>
                                    Guide d'utilisation
                                </h3>
                                <div class="nav-section-content ${this.activeSection === 'guide' ? 'active' : ''}">
                                    <a href="#guide-introduction" class="nav-link ${this.activeSubsection === 'introduction' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('guide', 'introduction')">
                                        <span class="material-symbols-outlined">info</span>
                                        Introduction
                                    </a>
                                    <a href="#guide-explorer" class="nav-link ${this.activeSubsection === 'explorer' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('guide', 'explorer')">
                                        <span class="material-symbols-outlined">explore</span>
                                        Explorer les pistes
                                    </a>
                                    <a href="#guide-simulateur" class="nav-link ${this.activeSubsection === 'simulateur' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('guide', 'simulateur')">
                                        <span class="material-symbols-outlined">auto_awesome</span>
                                        Simulateur
                                    </a>
                                    <a href="#guide-comparaison" class="nav-link ${this.activeSubsection === 'comparaison' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('guide', 'comparaison')">
                                        <span class="material-symbols-outlined">compare_arrows</span>
                                        Comparaison
                                    </a>
                                    <a href="#guide-edition" class="nav-link ${this.activeSubsection === 'edition' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('guide', 'edition')">
                                        <span class="material-symbols-outlined">edit</span>
                                        Édition des pistes
                                    </a>
                                    <a href="#guide-decide" class="nav-link ${this.activeSubsection === 'decide' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('guide', 'decide')">
                                        <span class="material-symbols-outlined">check_circle</span>
                                        Décision & Export
                                    </a>
                                </div>
                            </div>

                            <div class="nav-section">
                                <h3 class="nav-section-title" onclick="pages.Documentation.toggleSection('architecture')">
                                    <span class="material-symbols-outlined">chevron_right</span>
                                    Architecture technique
                                </h3>
                                <div class="nav-section-content ${this.activeSection === 'architecture' ? 'active' : ''}">
                                    <a href="#architecture-vue-ensemble" class="nav-link ${this.activeSubsection === 'vue-ensemble' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('architecture', 'vue-ensemble')">
                                        <span class="material-symbols-outlined">account_tree</span>
                                        Vue d'ensemble
                                    </a>
                                    <a href="#architecture-donnees" class="nav-link ${this.activeSubsection === 'donnees' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('architecture', 'donnees')">
                                        <span class="material-symbols-outlined">database</span>
                                        Structure des données
                                    </a>
                                    <a href="#architecture-composants" class="nav-link ${this.activeSubsection === 'composants' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('architecture', 'composants')">
                                        <span class="material-symbols-outlined">widgets</span>
                                        Composants
                                    </a>
                                    <a href="#architecture-api" class="nav-link ${this.activeSubsection === 'api' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('architecture', 'api')">
                                        <span class="material-symbols-outlined">api</span>
                                        API & Store
                                    </a>
                                </div>
                            </div>

                            <div class="nav-section">
                                <h3 class="nav-section-title" onclick="pages.Documentation.toggleSection('methodologie')">
                                    <span class="material-symbols-outlined">chevron_right</span>
                                    Méthodologie
                                </h3>
                                <div class="nav-section-content ${this.activeSection === 'methodologie' ? 'active' : ''}">
                                    <a href="#methodologie-dimensions" class="nav-link ${this.activeSubsection === 'dimensions' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('methodologie', 'dimensions')">
                                        <span class="material-symbols-outlined">donut_large</span>
                                        Dimensions Balancing
                                    </a>
                                    <a href="#methodologie-impact" class="nav-link ${this.activeSubsection === 'impact' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('methodologie', 'impact')">
                                        <span class="material-symbols-outlined">analytics</span>
                                        Calcul d'impact
                                    </a>
                                    <a href="#methodologie-priorites" class="nav-link ${this.activeSubsection === 'priorites' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('methodologie', 'priorites')">
                                        <span class="material-symbols-outlined">priority_high</span>
                                        Priorisation
                                    </a>
                                    <a href="#methodologie-optimisation" class="nav-link ${this.activeSubsection === 'optimisation' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('methodologie', 'optimisation')">
                                        <span class="material-symbols-outlined">tune</span>
                                        Optimisation multicritères
                                    </a>
                                </div>
                            </div>

                            <div class="nav-section">
                                <h3 class="nav-section-title" onclick="pages.Documentation.toggleSection('references')">
                                    <span class="material-symbols-outlined">chevron_right</span>
                                    Références
                                </h3>
                                <div class="nav-section-content ${this.activeSection === 'references' ? 'active' : ''}">
                                    <a href="#references-glossaire" class="nav-link ${this.activeSubsection === 'glossaire' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('references', 'glossaire')">
                                        <span class="material-symbols-outlined">dictionary</span>
                                        Glossaire
                                    </a>
                                    <a href="#references-sources" class="nav-link ${this.activeSubsection === 'sources' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('references', 'sources')">
                                        <span class="material-symbols-outlined">library_books</span>
                                        Sources des données
                                    </a>
                                    <a href="#references-faq" class="nav-link ${this.activeSubsection === 'faq' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('references', 'faq')">
                                        <span class="material-symbols-outlined">help</span>
                                        FAQ
                                    </a>
                                    <a href="#references-contact" class="nav-link ${this.activeSubsection === 'contact' ? 'active' : ''}" onclick="pages.Documentation.navigateTo('references', 'contact')">
                                        <span class="material-symbols-outlined">contact_support</span>
                                        Contact support
                                    </a>
                                </div>
                            </div>
                        </nav>
                    </aside>

                    <!-- Contenu principal -->
                    <main class="doc-content">
                        ${this.renderSectionContent()}
                    </main>
                </div>
            </div>
        `;
    },

    renderSectionContent() {
        switch(this.activeSection) {
            case 'guide':
                return this.renderGuideSection();
            case 'architecture':
                return this.renderArchitectureSection();
            case 'methodologie':
                return this.renderMethodologieSection();
            case 'references':
                return this.renderReferencesSection();
            default:
                return this.renderGuideSection();
        }
    },

    renderGuideSection() {
        switch(this.activeSubsection) {
            case 'introduction':
                return this.renderIntroduction();
            case 'explorer':
                return this.renderExplorerGuide();
            case 'simulateur':
                return this.renderSimulateurGuide();
            case 'comparaison':
                return this.renderComparaisonGuide();
            case 'edition':
                return this.renderEditionGuide();
            case 'decide':
                return this.renderDecideGuide();
            default:
                return this.renderIntroduction();
        }
    },

    renderIntroduction() {
        return `
            <div class="doc-section">
                <h2>Introduction</h2>
                <p class="doc-intro">
                    Bienvenue dans la documentation du système Safety Management System. 
                    Cette plateforme a été conçue pour aider les décideurs à optimiser la sécurité 
                    aéroportuaire en sélectionnant les meilleures pistes d'amélioration.
                </p>

                <div class="info-card">
                    <div class="info-icon">
                        <span class="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div class="info-content">
                        <h3>Objectif du système</h3>
                        <p>Permettre une prise de décision éclairée basée sur des données objectives et des simulations multicritères pour réduire les accidents d'engins de piste.</p>
                    </div>
                </div>

                <h3>Concepts clés</h3>
                <div class="concepts-grid">
                    <div class="concept-card">
                        <span class="concept-icon"></span>
                        <h4>Pistes</h4>
                        <p>Actions d'amélioration potentielles, chacune avec son budget, son impact et ses caractéristiques</p>
                    </div>
                    <div class="concept-card">
                        <span class="concept-icon"></span>
                        <h4>Dimensions</h4>
                        <p>5 axes d'analyse (Culture, Technique, Humain, Organisationnel, Économique)</p>
                    </div>
                    <div class="concept-card">
                        <span class="concept-icon"></span>
                        <h4>Scénarios</h4>
                        <p>Combinaisons de pistes sauvegardées pour comparaison</p>
                    </div>
                    <div class="concept-card">
                        <span class="concept-icon"></span>
                        <h4>Optimisation</h4>
                        <p>Algorithmes pour trouver les meilleures combinaisons sous contraintes</p>
                    </div>
                </div>

                <div class="quick-start">
                    <h3>Démarrage rapide</h3>
                    <ol class="steps-list">
                        <li>
                            <span class="step-number">1</span>
                            <div class="step-content">
                                <strong>Explorez les pistes</strong>
                                <p>Consultez l'inventaire complet des 61 pistes d'amélioration avec leurs caractéristiques</p>
                            </div>
                        </li>
                        <li>
                            <span class="step-number">2</span>
                            <div class="step-content">
                                <strong>Lancez une simulation</strong>
                                <p>Définissez vos contraintes et obtenez des combinaisons optimales</p>
                            </div>
                        </li>
                        <li>
                            <span class="step-number">3</span>
                            <div class="step-content">
                                <strong>Comparez les scénarios</strong>
                                <p>Analysez plusieurs stratégies côte à côte</p>
                            </div>
                        </li>
                        <li>
                            <span class="step-number">4</span>
                            <div class="step-content">
                                <strong>Décidez et exportez</strong>
                                <p>Validez votre plan d'action et générez des rapports professionnels</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        `;
    },

    renderExplorerGuide() {
        return `
            <div class="doc-section">
                <h2>Explorer les pistes</h2>
                
                <div class="feature-screenshot">
                    <div class="screenshot-placeholder">
                        <img src="assets/pistes.png" alt="Aperçu de la page Explorer">
                        <p>Aperçu de la page Explorer</p>
                    </div>
                </div>

                <h3>Fonctionnalités</h3>
                <ul class="feature-list">
                    <li>
                        <span class="material-symbols-outlined">filter_alt</span>
                        <strong>Filtres avancés :</strong> Par catégorie, priorité, budget, notation
                    </li>
                    <li>
                        <span class="material-symbols-outlined">search</span>
                        <strong>Recherche :</strong> Par ID ou titre de piste
                    </li>
                    <li>
                        <span class="material-symbols-outlined">star</span>
                        <strong>Notation :</strong> Système d'évaluation à 5 étoiles
                    </li>
                    <li>
                        <span class="material-symbols-outlined">view_module</span>
                        <strong>Affichage :</strong> Vue grille ou liste au choix
                    </li>
                </ul>

                <h3>Utilisation</h3>
                <div class="usage-step">
                    <h4>1. Filtrer les pistes</h4>
                    <p>Utilisez le panneau latéral gauche pour affiner votre sélection :</p>
                    <ul>
                        <li><strong>Catégories :</strong> Humain, Technique, Organisationnel, etc.</li>
                        <li><strong>Priorités :</strong> CRITICAL, HIGH, MEDIUM, LOW</li>
                        <li><strong>Notation :</strong> Filtrez par note minimum</li>
                        <li><strong>Budget :</strong> Ajustez le curseur pour définir un budget maximum</li>
                    </ul>
                </div>

                <div class="usage-step">
                    <h4>2. Trier les résultats</h4>
                    <p>Cliquez sur "Trier par Impact" pour organiser les pistes du plus au moins impactant.</p>
                </div>

                <div class="usage-step">
                    <h4>3. Accéder aux détails</h4>
                    <p>Sur chaque carte, vous pouvez :</p>
                    <ul>
                        <li>Cliquer sur "Détails" pour voir la fiche complète de la piste</li>
                        <li>Cliquer sur "Édition" pour modifier les caractéristiques</li>
                        <li>Noter la piste avec les étoiles</li>
                    </ul>
                </div>

                <div class="tip-box">
                    <span class="material-symbols-outlined">tips_and_updates</span>
                    <div>
                        <h4>Conseil d'utilisation</h4>
                        <p>Utilisez la notation pour marquer les pistes qui vous semblent prioritaires. La note est sauvegardée localement et persiste entre les sessions.</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderSimulateurGuide() {
        return `
            <div class="doc-section">
                <h2>Simulateur de sélection</h2>
                
                <div class="feature-screenshot">
                    <div class="screenshot-placeholder">
                        <img src="assets/screenshot.png" alt="Aperçu du Simulateur">
                        <p>Aperçu du Simulateur</p>
                    </div>
                </div>

                <h3>Principe</h3>
                <p>Le simulateur vous permet de définir des contraintes et d'obtenir automatiquement une combinaison optimale de pistes.</p>

                <h3>Types de contraintes</h3>
                <div class="constraints-grid">
                    <div class="constraint-card">
                        <span class="material-symbols-outlined">payments</span>
                        <h4>Budget</h4>
                        <p>Définissez un budget maximum pour l'ensemble des pistes</p>
                    </div>
                    <div class="constraint-card">
                        <span class="material-symbols-outlined">donut_large</span>
                        <h4>Dimensions</h4>
                        <p>Répartissez l'importance relative des 5 dimensions</p>
                    </div>
                    <div class="constraint-card">
                        <span class="material-symbols-outlined">schedule</span>
                        <h4>Durée</h4>
                        <p>Limitez la durée de déploiement maximale</p>
                    </div>
                    <div class="constraint-card">
                        <span class="material-symbols-outlined">trending_down</span>
                        <h4>Réduction d'accidents</h4>
                        <p>Fixez un pourcentage minimum de réduction</p>
                    </div>
                </div>

                <h3>Modes d'optimisation</h3>
                <div class="optimization-modes">
                    <div class="mode-card">
                        <h4>Pondéré</h4>
                        <p>Combine toutes les contraintes en un score unique pour sélectionner les meilleures pistes.</p>
                    </div>
                    <div class="mode-card">
                        <h4>Pareto</h4>
                        <p>Génère un front de Pareto pour visualiser les meilleurs compromis entre budget et impact.</p>
                    </div>
                    <div class="mode-card">
                        <h4>Budget d'abord</h4>
                        <p>Maximise l'impact total dans la limite du budget défini.</p>
                    </div>
                </div>

                <h3>Interprétation des résultats</h3>
                <p>Après simulation, vous obtenez :</p>
                <ul>
                    <li>Les KPIs agrégés (budget total, impact moyen, durée moyenne)</li>
                    <li>Un radar des dimensions pour visualiser l'équilibre</li>
                    <li>La liste détaillée des pistes sélectionnées</li>
                    <li>Des options pour exporter ou ajouter au scénario</li>
                </ul>
            </div>
        `;
    },

    renderComparaisonGuide() {
        return `
            <div class="doc-section">
                <h2>Comparaison de scénarios</h2>
                
                <div class="feature-screenshot">
                    <div class="screenshot-placeholder">
                        <img src="assets/comparateur.png" alt="Aperçu du Comparateur">
                        <p>Aperçu de la page Comparaison</p>
                    </div>
                </div>

                <h3>Présentation</h3>
                <p>La page de comparaison vous permet d'analyser plusieurs scénarios côte à côte pour faciliter la prise de décision.</p>

                <h3>Fonctionnalités</h3>
                <ul class="feature-list">
                    <li>
                        <span class="material-symbols-outlined">check_box</span>
                        <strong>Sélection multiple :</strong> Cochez les scénarios à comparer
                    </li>
                    <li>
                        <span class="material-symbols-outlined">donut_large</span>
                        <strong>Radars comparatifs :</strong> Visualisez les dimensions de chaque scénario
                    </li>
                    <li>
                        <span class="material-symbols-outlined">analytics</span>
                        <strong>Scoring :</strong> Tableau comparatif des métriques clés
                    </li>
                    <li>
                        <span class="material-symbols-outlined">picture_as_pdf</span>
                        <strong>Export :</strong> Générez un PDF de la comparaison
                    </li>
                </ul>

                <h3>Utilisation</h3>
                <ol class="steps-list">
                    <li>Sélectionnez les scénarios à comparer dans le panneau supérieur</li>
                    <li>Observez les radars de dimensions pour chaque scénario</li>
                    <li>Consultez le tableau de scoring pour identifier les meilleures performances</li>
                    <li>Explorez la liste des pistes incluses dans chaque scénario</li>
                    <li>Exportez la comparaison en PDF pour partager vos analyses</li>
                </ol>

                <div class="tip-box">
                    <span class="material-symbols-outlined">tips_and_updates</span>
                    <div>
                        <h4>Conseil</h4>
                        <p>Le scénario en cours est mis en évidence par une bordure bleue. Vous pouvez dupliquer un scénario pour créer des variantes.</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderEditionGuide() {
        return `
            <div class="doc-section">
                <h2>Édition des pistes</h2>
                
                <div class="feature-screenshot">
                    <div class="screenshot-placeholder">
                        <img src="assets/edition-pistes.png" alt="Édition des pistes">
                        <p>Aperçu de l'éditeur</p>
                    </div>
                </div>

                <h3>Onglets disponibles</h3>
                <div class="tabs-overview">
                    <div class="tab-overview">
                        <h4>📋 Général</h4>
                        <p>Informations de base : titre, description, catégorie, priorité, budget</p>
                    </div>
                    <div class="tab-overview">
                        <h4>📊 Dimensions</h4>
                        <p>Réglage des 5 dimensions Balancing avec sliders interactifs</p>
                    </div>
                    <div class="tab-overview">
                        <h4>🔧 Dispositif</h4>
                        <p>Détails opérationnels, problématique, périmètre, approches</p>
                    </div>
                    <div class="tab-overview">
                        <h4>📅 Phases</h4>
                        <p>Planification des phases de déploiement</p>
                    </div>
                    <div class="tab-overview">
                        <h4>📈 Indicateurs</h4>
                        <p>Définition des indicateurs de suivi</p>
                    </div>
                    <div class="tab-overview">
                        <h4>✅ Avantages</h4>
                        <p>Liste des avantages par bénéficiaire</p>
                    </div>
                    <div class="tab-overview">
                        <h4>⚠️ Risques</h4>
                        <p>Identification et mitigation des risques</p>
                    </div>
                    <div class="tab-overview">
                        <h4>📚 Justificatifs</h4>
                        <p>Sources et documents justificatifs</p>
                    </div>
                </div>

                <h3>Saisie des données</h3>
                <p>Chaque modification est automatiquement sauvegardée dans le store. Utilisez le bouton "Enregistrer" pour confirmer les changements.</p>

                <div class="warning-box">
                    <span class="material-symbols-outlined">warning</span>
                    <div>
                        <h4>Attention</h4>
                        <p>Les modifications sont persistantes. Utilisez le bouton "Annuler" pour revenir à l'état précédent avant enregistrement.</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderDecideGuide() {
        return `
            <div class="doc-section">
                <h2>Décision et export</h2>
                
                <div class="feature-screenshot">
                    <div class="screenshot-placeholder">
                        <img src="assets/decision-export.png" alt="Décision et export">
                        <p>Aperçu de la page Décision</p>
                    </div>
                </div>

                <h3>Page de validation finale</h3>
                <p>Cette page présente le plan d'action final avec tous les détails nécessaires à la validation.</p>

                <h3>Sections</h3>
                <ul class="feature-list">
                    <li>
                        <span class="material-symbols-outlined">flight_takeoff</span>
                        <strong>Sélecteur de simulation :</strong> Choisissez parmi tous les scénarios sauvegardés
                    </li>
                    <li>
                        <span class="material-symbols-outlined">analytics</span>
                        <strong>Statistiques clés :</strong> Budget total, impact moyen, accidents évités
                    </li>
                    <li>
                        <span class="material-symbols-outlined">donut_large</span>
                        <strong>Distribution dimensionnelle :</strong> Visualisation des 5 dimensions
                    </li>
                    <li>
                        <span class="material-symbols-outlined">list_alt</span>
                        <strong>Tableau détaillé :</strong> Liste des pistes avec détails expansibles
                    </li>
                    <li>
                        <span class="material-symbols-outlined">description</span>
                        <strong>Résumé exécutif :</strong> Synthèse pour la direction
                    </li>
                </ul>

                <h3>Exports disponibles</h3>
                <div class="exports-grid">
                    <div class="export-card">
                        <span class="material-symbols-outlined">picture_as_pdf</span>
                        <h4>PDF</h4>
                        <p>Document professionnel formaté pour impression et présentation</p>
                    </div>
                    <div class="export-card">
                        <span class="material-symbols-outlined">data_usage</span>
                        <h4>JSON</h4>
                        <p>Données brutes pour analyse externe ou intégration</p>
                    </div>
                </div>

                <div class="tip-box">
                    <span class="material-symbols-outlined">print</span>
                    <div>
                        <h4>Impression</h4>
                        <p>Utilisez le bouton "Imprimer" pour obtenir une version papier optimisée avec espace pour signature.</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderArchitectureSection() {
        switch(this.activeSubsection) {
            case 'vue-ensemble':
                return this.renderArchitectureOverview();
            case 'donnees':
                return this.renderDataStructure();
            case 'composants':
                return this.renderComponents();
            case 'api':
                return this.renderAPI();
            default:
                return this.renderArchitectureOverview();
        }
    },

    renderArchitectureOverview() {
        return `
            <div class="doc-section">
                <h2>Architecture du système</h2>
                
                <div class="architecture-diagram">
                    <div class="diagram-placeholder">
                        <span class="material-symbols-outlined">account_tree</span>
                        <p>Diagramme d'architecture</p>
                    </div>
                </div>

                <h3>Structure générale</h3>
                <p>L'application est construite comme une Single Page Application (SPA) avec une architecture modulaire.</p>

                <div class="architecture-layers">
                    <div class="layer">
                        <h4>🎨 Présentation</h4>
                        <p>Pages et composants UI (dossier /pages)</p>
                    </div>
                    <div class="layer">
                        <h4>⚙️ Logique métier</h4>
                        <p>Store, actions, algorithmes d'optimisation</p>
                    </div>
                    <div class="layer">
                        <h4>💾 Données</h4>
                        <p>Base de données locale (IndexedDB), cache, localStorage</p>
                    </div>
                </div>

                <h3>Flux de données</h3>
                <ol>
                    <li>L'utilisateur interagit avec les pages</li>
                    <li>Les actions modifient le store central (appStore)</li>
                    <li>Les composants se mettent à jour automatiquement</li>
                    <li>Les données sont persistées dans IndexedDB</li>
                </ol>
            </div>
        `;
    },

    renderDataStructure() {
        return `
            <div class="doc-section">
                <h2>Structure des données</h2>

                <h3>Objet Piste</h3>
                <pre class="code-block">
{
  "numero": "P001",                    // Identifiant unique
  "titre": "Titre court",               // Titre de la piste
  "titre_long": "Description longue",    // Titre détaillé
  "description": "...",                  // Description courte
  "description_longue": "...",           // Description détaillée
  "categorie": "Technique",              // Catégorie principale
  "famille": "Prévention",               // Famille d'action
  "priorite": "P1",                      // Code interne, affiché CRITICAL
  "tags": ["tag1", "tag2"],              // Tags pour filtrage
  
  "budget": {                             // Détail budgétaire
    "cout_2026": 100000,
    "cout_2027": 150000,
    "cout_2028": 120000,
    "cout_3_ans": 370000,
    "cout_recurrent_annuel": 50000
  },
  
  "impact_score": 85,                     // Score d'impact (0-100)
  "impact_accidents_evites": 5,            // Accidents évités/an
  "impact_economies": 200000,              // Économies annuelles
  "delai_mois": 12,                        // Délai de déploiement
  "roi_mois": 24,                          // Délai de retour sur investissement
  
  "dimensions": {                          // Dimensions Balancing
    "culture": 20,
    "technique": 30,
    "humain": 25,
    "organisationnel": 15,
    "economique": 10
  }
}
                </pre>

                <h3>Store principal</h3>
                <pre class="code-block">
{
  "allPistes": [...],                     // Toutes les pistes
  "currentScenario": [...],                // Scénario en cours
  "scenarios": [...],                      // Scénarios sauvegardés
  "user": {                                 // Utilisateur courant
    "name": "...",
    "role": "..."
  }
}
                </pre>
            </div>
        `;
    },

    renderComponents() {
        return `
            <div class="doc-section">
                <h2>Composants principaux</h2>

                <h3>Pages</h3>
                <table class="components-table">
                    <thead>
                        <tr>
                            <th>Page</th>
                            <th>Fichier</th>
                            <th>Fonction</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Accueil</td><td>home.js</td><td>Présentation générale</td></tr>
                        <tr><td>Explorer</td><td>explore.js</td><td>Recherche et filtrage</td></tr>
                        <tr><td>Simulateur</td><td>simulateur.js</td><td>Optimisation multicritères</td></tr>
                        <tr><td>Comparaison</td><td>compare.js</td><td>Analyse comparative</td></tr>
                        <tr><td>Édition</td><td>edition.js</td><td>Modification des pistes</td></tr>
                        <tr><td>Détail</td><td>piste-detail.js</td><td>Fiche détaillée</td></tr>
                        <tr><td>Décision</td><td>decide.js</td><td>Validation et export</td></tr>
                        <tr><td>Problématique</td><td>problematique.js</td><td>Contexte du projet</td></tr>
                        <tr><td>Administration</td><td>admin.js</td><td>Gestion système</td></tr>
                    </tbody>
                </table>

                <h3>Services</h3>
                <ul>
                    <li><strong>store.js</strong> - Gestion d'état central</li>
                    <li><strong>router.js</strong> - Navigation</li>
                    <li><strong>utils.js</strong> - Fonctions utilitaires</li>
                    <li><strong>notifications.js</strong> - Système de notifications</li>
                </ul>
            </div>
        `;
    },

    renderAPI() {
        return `
            <div class="doc-section">
                <h2>API et Store</h2>

                <h3>Store (appStore)</h3>
                <pre class="code-block">
// Obtenir l'état
const state = appStore.getState();

// Souscrire aux changements
appStore.subscribe((state) => {
    console.log('Store mis à jour', state);
});
                </pre>

                <h3>Actions (appActions)</h3>
                <pre class="code-block">
// Charger les pistes
await appActions.loadPistes();

// Mettre à jour une piste
appActions.updatePiste(piste);

// Ajouter au scénario
appActions.addPisteToScenario(piste);

// Sauvegarder un scénario
appActions.saveScenario(name);
                </pre>

                <h3>Base de données (db)</h3>
                <pre class="code-block">
// Charger les données
const pistes = await db.loadPistes();
const scenarios = await db.loadScenarios();

// Sauvegarder
await db.savePistes(pistes);
await db.saveScenarios(scenarios);

// Exporter/Importer
await db.export();
await db.import(data);
                </pre>

                <h3>Router</h3>
                <pre class="code-block">
// Naviguer
router.navigate('/explorer');

// Écouter les changements
router.on('navigate', (path) => {
    console.log('Navigation vers', path);
});
                </pre>
            </div>
        `;
    },

    renderMethodologieSection() {
        switch(this.activeSubsection) {
            case 'dimensions':
                return this.renderDimensionsMethod();
            case 'impact':
                return this.renderImpactMethod();
            case 'priorites':
                return this.renderPrioritesMethod();
            case 'optimisation':
                return this.renderOptimisationMethod();
            default:
                return this.renderDimensionsMethod();
        }
    },

    renderDimensionsMethod() {
        return `
            <div class="doc-section">
                <h2>Dimensions Balancing</h2>

                <div class="methodology-intro">
                    <p>Les 5 dimensions représentent les différents aspects de chaque piste d'amélioration. Leur équilibre permet d'évaluer la couverture globale d'un scénario.</p>
                </div>

                <h3>Les 5 dimensions</h3>
                <div class="dimensions-detail">
                    <div class="dimension-detail" style="border-left-color: #FF6B35;">
                        <h4>Culture</h4>
                        <p>Impact sur la culture sécurité, les valeurs et les comportements collectifs</p>
                    </div>
                    <div class="dimension-detail" style="border-left-color: #003D82;">
                        <h4>Technique</h4>
                        <p>Solutions technologiques, équipements, automatisation</p>
                    </div>
                    <div class="dimension-detail" style="border-left-color: #10B981;">
                        <h4>Humain</h4>
                        <p>Formation, compétences, facteurs humains</p>
                    </div>
                    <div class="dimension-detail" style="border-left-color: #F59E0B;">
                        <h4>Organisationnel</h4>
                        <p>Processus, procédures, management</p>
                    </div>
                    <div class="dimension-detail" style="border-left-color: #8B5CF6;">
                        <h4>Économique</h4>
                        <p>ROI, économies, impact financier</p>
                    </div>
                </div>

                <h3>Calcul de l'équilibre</h3>
                <p>Pour un ensemble de pistes, les dimensions sont agrégées avec une pondération par l'impact :</p>
                <pre class="code-block">
score_dimension = Σ(piste.dimension × piste.impact) / Σ(piste.impact)
                </pre>

                <h3>Visualisation radar</h3>
                <p>Le radar permet de voir instantanément si un scénario est équilibré ou orienté vers certaines dimensions.</p>
            </div>
        `;
    },

    renderImpactMethod() {
        return `
            <div class="doc-section">
                <h2>Calcul d'impact</h2>

                <h3>Score d'impact (0-100)</h3>
                <p>Le score d'impact est calculé à partir de plusieurs facteurs :</p>
                <ul>
                    <li>Nombre d'accidents évités estimé</li>
                    <li>Gravité des accidents ciblés</li>
                    <li>Étendue de la population concernée</li>
                    <li>Efficacité prouvée de mesures similaires</li>
                </ul>

                <h3>Réduction d'accidents</h3>
                <p>Pour un scénario complet, la réduction totale est estimée par :</p>
                <pre class="code-block">
réduction = 1 - ∏(1 - réduction_individuelle_i)
                </pre>
                <p>Cette formule évite la sur-estimation due aux doublons potentiels.</p>

                <h3>Délai de retour sur investissement</h3>
                <p>Le délai de retour est calculé en comparant les économies générées aux coûts d'investissement :</p>
                <pre class="code-block">
Délai de retour (mois) = investissement / économies_annuelles × 12
                </pre>
            </div>
        `;
    },

    renderPrioritesMethod() {
        return `
            <div class="doc-section">
                <h2>Priorisation</h2>

                <h3>Niveaux de priorité</h3>
                <div class="priority-matrix">
                    <div class="priority-level priority-critical">
                        <h4>CRITICAL</h4>
                        <p>Impact élevé, mise en œuvre rapide, ROI court</p>
                    </div>
                    <div class="priority-level priority-high">
                        <h4>HIGH</h4>
                        <p>Impact important, nécessaire pour les objectifs long terme</p>
                    </div>
                    <div class="priority-level priority-medium">
                        <h4>MEDIUM</h4>
                        <p>Complémentaire aux actions prioritaires</p>
                    </div>
                    <div class="priority-level priority-low">
                        <h4>LOW</h4>
                        <p>À considérer après les actions plus urgentes</p>
                    </div>
                </div>

                <h3>Matrice impact / effort</h3>
                <p>La priorité est déterminée en croisant l'impact potentiel et l'effort nécessaire :</p>
                <ul>
                    <li><strong>Impact fort + Effort faible</strong> → CRITICAL</li>
                    <li><strong>Impact fort + Effort fort</strong> → HIGH</li>
                    <li><strong>Impact faible + Effort faible</strong> → MEDIUM</li>
                    <li><strong>Impact faible + Effort fort</strong> → LOW</li>
                </ul>
            </div>
        `;
    },

    renderOptimisationMethod() {
        return `
            <div class="doc-section">
                <h2>Optimisation multicritères</h2>

                <h3>Algorithmes utilisés</h3>

                <h4>1. Optimisation pondérée</h4>
                <p>Chaque piste reçoit un score calculé à partir des contraintes :</p>
                <pre class="code-block">
score = α × impact + β × (1 - budget/budget_max) + γ × similarité_dimensions + ...
                </pre>

                <h4>2. Front de Pareto</h4>
                <p>Identification des solutions non-dominées où aucun critère ne peut être amélioré sans détériorer l'autre.</p>
                <div class="pareto-explanation">
                    <p>Une solution A domine une solution B si :</p>
                    <ul>
                        <li>A est au moins aussi bonne que B sur tous les critères</li>
                        <li>A est strictement meilleure que B sur au moins un critère</li>
                    </ul>
                </div>

                <h4>3. Algorithme glouton (budget first)</h4>
                <p>Sélection séquentielle des pistes par ratio impact/coût décroissant jusqu'à épuisement du budget.</p>

                <h3>Complexité</h3>
                <p>Pour N pistes, le nombre de combinaisons possibles est 2^N. Les algorithmes utilisés permettent d'approcher l'optimum en temps polynomial.</p>
            </div>
        `;
    },

    renderReferencesSection() {
        switch(this.activeSubsection) {
            case 'glossaire':
                return this.renderGlossaire();
            case 'sources':
                return this.renderSources();
            case 'faq':
                return this.renderFAQ();
            case 'contact':
                return this.renderContact();
            default:
                return this.renderGlossaire();
        }
    },

    renderGlossaire() {
        return `
            <div class="doc-section">
                <h2>Glossaire</h2>

                <dl class="glossary">
                    <dt>Piste</dt>
                    <dd>Action d'amélioration potentielle, caractérisée par son coût, son impact et ses dimensions.</dd>

                    <dt>Scénario</dt>
                    <dd>Ensemble de pistes sélectionnées, sauvegardé pour analyse et comparaison.</dd>

                    <dt>Dimensions Balancing</dt>
                    <dd>Méthode d'évaluation selon 5 axes : Culture, Technique, Humain, Organisationnel, Économique.</dd>

                    <dt>Impact Score</dt>
                    <dd>Note de 0 à 100 évaluant l'efficacité potentielle d'une piste.</dd>

                    <dt>Délai de retour sur investissement</dt>
                    <dd>Délai de retour sur investissement exprimé en mois.</dd>

                    <dt>Front de Pareto</dt>
                    <dd>Ensemble des solutions optimales où aucun critère ne peut être amélioré sans dégrader un autre.</dd>

                    <dt>Quick Win</dt>
                    <dd>Piste de priorité CRITICAL offrant un impact rapide pour un effort modéré.</dd>

                    <dt>Ground Handling</dt>
                    <dd>Services d'assistance en escale (piste, bagages, etc.).</dd>
                </dl>
            </div>
        `;
    },

    renderSources() {
        return `
            <div class="doc-section">
                <h2>Sources des données</h2>

                <h3>Données internes</h3>
                <ul>
                    <li>Rapports d'incidents CDG 2022-2025</li>
                    <li>Statistiques CSCA (Comité Social et Consultatif Aéroportuaire)</li>
                    <li>Données Gendarmerie des Transports Aériens</li>
                </ul>

                <h3>Références externes</h3>
                <ul>
                    <li>Eurocontrol - Safety Data Reports</li>
                    <li>IATA - Ground Operations Safety</li>
                    <li>DGAC - Statistiques sécurité aéroportuaire</li>
                </ul>

                <h3>Benchmark</h3>
                <ul>
                    <li>Aéroports de Francfort (FRA), Londres Heathrow (LHR)</li>
                    <li>Rapports INRS - Prévention dans le BTP</li>
                    <li>Études de la Prévention Routière</li>
                </ul>

                <div class="note-box">
                    <p>Les données sont mises à jour trimestriellement. Dernière mise à jour : Mai 2026</p>
                </div>
            </div>
        `;
    },

    renderFAQ() {
        return `
            <div class="doc-section">
                <h2>Foire aux questions</h2>

                <div class="faq-item">
                    <h4>Comment sont calculés les scores d'impact ?</h4>
                    <p>Les scores sont basés sur une analyse multicritères incluant les données historiques, les études disponibles et l'expertise des opérationnels. Ils sont calibrés pour permettre une comparaison relative entre pistes.</p>
                </div>

                <div class="faq-item">
                    <h4>Puis-je exporter mes scénarios ?</h4>
                    <p>Oui, depuis la page "Décision", vous pouvez exporter en PDF (format rapport) ou en JSON (données brutes).</p>
                </div>

                <div class="faq-item">
                    <h4>Comment sont gérées les dépendances entre pistes ?</h4>
                    <p>Le système actuel ne gère pas automatiquement les dépendances. Il est recommandé de les examiner manuellement dans la phase de validation finale.</p>
                </div>

                <div class="faq-item">
                    <h4>Les données sont-elles persistantes ?</h4>
                    <p>Oui, toutes les données sont stockées localement dans IndexedDB. Elles persistent entre les sessions.</p>
                </div>

                <div class="faq-item">
                    <h4>Puis-je importer mes propres données ?</h4>
                    <p>Oui, via la page d'administration, vous pouvez importer des fichiers JSON au format attendu.</p>
                </div>

                <div class="faq-item">
                    <h4>Comment est gérée la sécurité ?</h4>
                    <p>L'application fonctionne en local. Les données ne sont pas transmises à un serveur externe. Pour un déploiement en réseau, des mesures supplémentaires seraient nécessaires.</p>
                </div>
            </div>
        `;
    },

    renderContact() {
        return `
            <div class="doc-section">
                <h2>Contact support</h2>

                <div class="contact-grid">
                    <div class="contact-card">
                        <span class="material-symbols-outlined">mail</span>
                        <h3>Email</h3>
                        <p><a href="mailto:support@cdg2026.fr">support@cdg2026.fr</a></p>
                        <p class="contact-note">Réponse sous 24h ouvrées</p>
                    </div>

                    <div class="contact-card">
                        <span class="material-symbols-outlined">phone</span>
                        <h3>Téléphone</h3>
                        <p>+33 1 48 62 22 22</p>
                        <p class="contact-note">Lun-Ven, 9h-17h</p>
                    </div>

                    <div class="contact-card">
                        <span class="material-symbols-outlined">forum</span>
                        <h3>Chat</h3>
                        <p><a href="#" onclick="alert('Formulaire des ticket à implémenter')">Support en ligne</a></p>
                    </div>

                    <div class="contact-card">
                        <span class="material-symbols-outlined">bug_report</span>
                        <h3>Signaler un bug</h3>
                        <p><a href="#" onclick="alert('Formulaire de bug à implémenter')">Ouvrir un ticket</a></p>
                    </div>
                </div>

                <div class="team-section">
                    <h3>Équipe projet</h3>
                    <div class="team-grid">
                        <div class="team-member">
                            <div class="member-avatar">MR</div>
                            <h4>Michel RAGOT</h4>
                            <p>Responsable projet</p>
                        </div>
                        <div class="team-member">
                            <div class="member-avatar">CD</div>
                            <h4>Claude DEORESTIS</h4>
                            <p>Expert sécurité</p>
                        </div>
                        <div class="team-member">
                            <div class="member-avatar">CEL</div>
                            <h4>Chama EL KHEMSANI</h4>
                            <p>Développement</p>
                        </div>
                        <div class="team-member">
                            <div class="member-avatar">NL</div>
                            <h4>Nicolas LAMBALLE</h4>
                            <p>Contact ENAC</p>
                        </div>
                    </div>
                </div>

                <div class="address-section">
                    <h3>Adresse</h3>
                    <p>
                        CSAE - Comité Social Aéroportuaire<br>
                        Aéroport Charles de Gaulle<br>
                        95700 Roissy-en-France
                    </p>
                </div>
            </div>
        `;
    },

    toggleSection(section) {
        this.activeSection = section;
        this.activeSubsection = 'introduction';
        this.rerender();
    },

    navigateTo(section, subsection) {
        this.activeSection = section;
        this.activeSubsection = subsection;
        window.history.replaceState(
            window.history.state,
            '',
            `${window.location.pathname}#${section}-${subsection}`
        );
        this.rerender();
    },

    applyHashNavigation(hash) {
        const anchor = String(hash || '').replace(/^#/, '');
        const parts = anchor.split('-');
        if (parts.length < 2) return;

        const section = parts.shift();
        const subsection = parts.join('-');
        const validSections = ['guide', 'architecture', 'methodologie', 'references'];

        if (!validSections.includes(section) || !subsection) return;

        this.activeSection = section;
        this.activeSubsection = subsection;
    },

    searchDocs(query) {
        console.log('Recherche:', query);
        // Implémentation à venir
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
window.pages.Documentation = pages.Documentation;
