/**
 * PAGES/EXPLORE.JS - Page exploration des pistes (Design professionnel - CORRIGÉ)
 */

pages.Explore = {
    currentPage: 1,
    itemsPerPage: 6,
    viewMode: 'grid',
    sortDirection: 'desc',
    filteredPistes: [],
    allPistes: [],
    selectedPriorities: [],
    trackRatings: {},
    minRatingFilter: 0,
    activeMatrix: null,
    diagramTab: 'scores',
    diagramCharts: {},
    diagramFilters: { category: '', priority: '' },
    relationFilter: 'all',
    relationSearch: '',
    relationBidirectionalOnly: false,
    decisionFilters: { priority: '', category: '', search: '' },
    decisionSort: { column: 'global', direction: 'desc' },

    isAdminUser() {
        const state = window.appStore?.getState?.() || {};
        return Boolean(
            state.isAuthenticated &&
            state.user &&
            String(state.user.role || '').toLowerCase() === 'admin'
        );
    },

    async render() {
        const state = appStore.getState();
        const pistes = Utils.escapeDeep(state.allPistes || []);
        this.loadRatings();
        this.allPistes = JSON.parse(JSON.stringify(pistes)); // Copie profonde
        this.filteredPistes = JSON.parse(JSON.stringify(pistes));
        this.applySorting();
        this.currentPage = 1;
        this.selectedPriorities = [];

        const categoryOptions = [...new Set(
            pistes
                .map(p => (p.categorie || '').trim())
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

        const categoryCounts = categoryOptions.reduce((acc, category) => {
            acc[category] = pistes.filter(p => this.normalizeCategory(p.categorie) === this.normalizeCategory(category)).length;
            return acc;
        }, {});
        const priorityLevels = [
            { code: 'P1', label: this.getPriorityLabel('P1'), color: 'red' },
            { code: 'P2', label: this.getPriorityLabel('P2'), color: 'orange' },
            { code: 'P3', label: this.getPriorityLabel('P3'), color: 'yellow' },
            { code: 'P4', label: this.getPriorityLabel('P4'), color: 'blue' }
        ];

        return `
            <div class="explore-wrapper">
                <aside class="explore-sidebar">
                    <div class="sidebar-header">
                        <h2>Filtres</h2>
                        <button class="reset-btn" id="reset-filters">Réinitialiser</button>
                    </div>

                    <!-- Catégories -->
                    <div class="filter-section">
                        <h3 class="filter-title">
                            <span class="material-symbols-outlined">category</span>
                            Catégories
                        </h3>
                        <div class="filter-options">
                            ${categoryOptions.map(category => `
                                <label class="filter-checkbox">
                                    <input type="checkbox" value="${category}" class="category-filter" checked>
                                    <span>${this.formatCategoryLabel(category)}</span>
                                    <span class="count">${categoryCounts[category]}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Niveau de Priorité -->
                    <div class="filter-section">
                        <h3 class="filter-title">
                            <span class="material-symbols-outlined">priority_high</span>
                            Niveau de Priorité
                        </h3>
                        <div class="priority-grid">
                            ${priorityLevels.map(p => `
                                <button class="priority-btn priority-${p.color}" data-priority="${p.code}" aria-label="Priorité ${p.label}" title="Priorité ${p.label}">
                                    ${p.label}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Notation -->
                    <div class="filter-section">
                        <h3 class="filter-title">
                            <span class="material-symbols-outlined">stars</span>
                            Notation
                        </h3>
                        <div class="rating-filter-range">
                            <input type="range" id="rating-range" min="0" max="5" step="1" value="${this.minRatingFilter}" class="rating-slider">
                            <div class="rating-filter-labels">
                                <span>Aucune</span>
                                <span id="rating-value">${this.getMinRatingLabel(this.minRatingFilter)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Budget -->
                    <div class="filter-section">
                        <h3 class="filter-title">
                            <span class="material-symbols-outlined">payments</span>
                            Budget (€)
                        </h3>
                        <input type="range" id="budget-range" min="0" max="3000000" value="3000000" class="budget-slider">
                        <div class="budget-labels">
                            <span>0 €</span>
                            <span id="budget-value">3M+ €</span>
                        </div>
                    </div>


                </aside>

                <main class="explore-main">
                    <!-- Barre de Recherche -->
                    <div class="search-bar">
                        <div class="explore-query-tools">
                            <label class="results-shortcut">
                                <span class="material-symbols-outlined">list</span>
                                <select id="filtered-pistes-shortcut" aria-label="Accéder à une piste résultat">
                                    ${this.renderFilteredPistesShortcutOptions()}
                                </select>
                            </label>
                            <div class="search-input-wrapper">
                                <span class="material-symbols-outlined">search</span>
                                <input type="text" id="search-input" placeholder="Chercher par ID ou titre..." class="search-input">
                            </div>
                        </div>
                        <button class="sort-btn" id="sort-impact-btn">
                            <span class="material-symbols-outlined">sort</span>
                            Trier par Impact (${this.sortDirection === 'desc' ? 'décroissant' : 'croissant'})
                        </button>
                        <div class="explore-actions">
                            <button class="matrix-open-btn" type="button" data-explore-matrix="decision">
                                <span class="material-symbols-outlined">table_chart</span>
                                Matrice de décision
                            </button>
                            <button class="matrix-open-btn relations" type="button" data-explore-matrix="relations">
                                <span class="material-symbols-outlined">account_tree</span>
                                Matrice des relations
                            </button>
                            <button class="matrix-open-btn diagrams" type="button" data-explore-matrix="diagrams">
                                <span class="material-symbols-outlined">monitoring</span>
                                Diagrammes des pistes
                            </button>

                            ${this.isAdminUser() ? `
                                <button class="create-btn" id="create-track-btn" onclick="pages.Explore.createTrack()">
                                    <span class="material-symbols-outlined">add_circle</span>
                                    Nouvelle piste
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- En-tête -->
                    <div class="explore-header">
                        <div>
                            <h2>Pistes d'Amélioration Sécurité</h2>
                            <p id="result-count">Affichage de ${pistes.length} résultats selon vos filtres</p>
                        </div>
                        <div class="view-toggle">
                            <button class="view-btn ${this.viewMode === 'grid' ? 'active' : ''}" data-view="grid">
                                <span class="material-symbols-outlined">grid_view</span>
                            </button>
                            <button class="view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list">
                                <span class="material-symbols-outlined">list</span>
                            </button>
                        </div>
                    </div>

                    <!-- Grille/Liste -->
                    <div class="piste-container ${this.viewMode === 'list' ? 'list-mode' : ''}" id="piste-container">
                        ${this.renderPistes(this.filteredPistes.slice(0, this.itemsPerPage))}
                    </div>

                    <!-- Pagination -->
                    <div class="pagination" id="pagination">
                        ${this.renderPagination(this.filteredPistes.length)}
                    </div>
                </main>
            </div>
            ${this.renderDecisionMatrixModal(categoryOptions)}
            ${this.renderRelationsMatrixModal()}
            ${this.renderDiagramsModal(categoryOptions)}
        `;
    },

    renderPistes(pistes) {
        if (!pistes || pistes.length === 0) {
            return '<div class="no-results"><p>Aucune piste trouvée</p></div>';
        }
        
        return pistes.map((p, idx) => {
            const pisteNum = p.numero || `P${idx}`;
            const rating = this.getTrackRating(p);
            return `
                <div class="piste-card" data-piste-id="${pisteNum}">
                    <div class="card-header">
                        <div class="card-badges">
                            <span class="track-id-badge">${this.escapeValue(pisteNum)}</span>
                            <span class="category-badge">${p.categorie || 'N/A'}</span>
                        </div>
                    </div>
                    <h3 class="card-title">${p.titre || 'Sans titre'}</h3>
                    ${p.slogan ? `<p class="card-slogan">${this.escapeValue(p.slogan)}</p>` : ''}
                    <p class="card-description">${p.description || ''}</p>
                    <div class="card-footer">
                        <div class="card-info">
                            <div class="info-item priority-info">
                                <span class="priority-dot priority-${this.getPriorityColor(p.priorite)}"></span>
                                <span>${this.getPriorityLabel(p.priorite)}</span>
                            </div>
                            <div class="info-item rating-display" aria-label="Notation ${rating} sur 5">
                                ${[1, 2, 3, 4, 5].map(score => `
                                    <span class="material-symbols-outlined rating-star ${score <= rating ? 'active' : ''}">star</span>
                                `).join('')}
                            </div>
                            <div class="info-item budget">
                                <span class="material-symbols-outlined">payments</span>
                                <span>${Utils.formatCurrency(p.budget?.cout_3_ans || 0)}</span>
                            </div>
                        </div>
                        <div class="card-actions">
                            ${this.isAdminUser() ? `<button class="edit-btn" onclick="event.stopPropagation(); pages.Explore.goToEdition('${pisteNum}')">Édition</button>` : ''}
                            <button class="details-btn" onclick="event.stopPropagation(); pages.Explore.goToDetail('${pisteNum}')">Détails</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderPagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        if (totalPages <= 1) return '';

        let html = '<div class="pagination-controls">';
        html += '<button class="pagination-prev" id="prev-btn">‹</button>';

        const visiblePages = this.getVisiblePaginationPages(totalPages);
        let previousPage = 0;

        visiblePages.forEach(page => {
            if (previousPage && page - previousPage > 1) {
                html += '<span class="pagination-dots">...</span>';
            }

            html += `<button class="pagination-num ${page === this.currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
            previousPage = page;
        });

        html += '<button class="pagination-next" id="next-btn">›</button>';
        html += '</div>';
        return html;
    },

    renderFilteredPistesShortcutOptions() {
        return `
            <option value="">${this.filteredPistes.length} piste${this.filteredPistes.length > 1 ? 's' : ''} - accéder à...</option>
            ${this.filteredPistes.map(piste => `
                <option value="${this.escapeValue(piste.numero || '')}">${this.escapeValue(piste.numero || '')} - ${this.escapeValue(piste.titre || 'Sans titre')}</option>
            `).join('')}
        `;
    },

    updateFilteredPistesShortcut() {
        const select = document.getElementById('filtered-pistes-shortcut');
        if (select) select.innerHTML = this.renderFilteredPistesShortcutOptions();
    },

    getVisiblePaginationPages(totalPages) {
        const currentPage = Math.min(Math.max(this.currentPage, 1), totalPages);

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const pages = new Set([1, totalPages]);
        const windowStart = Math.max(2, currentPage - 2);
        const windowEnd = Math.min(totalPages - 1, currentPage + 2);

        for (let page = windowStart; page <= windowEnd; page++) {
            pages.add(page);
        }

        return Array.from(pages).sort((a, b) => a - b);
    },

    getPriorityColor(priority) {
        const colors = { 'P1': 'red', 'P2': 'orange', 'P3': 'yellow', 'P4': 'blue' };
        return colors[priority] || 'slate';
    },

    getPriorityLabel(priority) {
        if (Utils.getPriorityLabel) return Utils.getPriorityLabel(priority);
        const labels = { P1: 'CRITICAL', P2: 'HIGH', P3: 'MEDIUM', P4: 'LOW' };
        return labels[priority] || labels.P3;
    },

    normalizeCategory(value) {
        return (value || '').toString().trim().toLowerCase();
    },

    formatCategoryLabel(value) {
        const text = (value || '').toString().trim();
        if (!text) return 'N/A';
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    escapeValue(value) {
        // `allPistes` is escaped once on render before it is copied into this page state.
        return String(value ?? '');
    },

    renderDecisionMatrixModal(categoryOptions = []) {
        return `
            <div class="matrix-modal" id="decision-matrix-modal" role="dialog" aria-modal="true" aria-labelledby="decision-matrix-title">
                <section class="matrix-dialog">
                    <header class="matrix-modal-header">
                        <div>
                            <h2 id="decision-matrix-title">Matrice de décision multi-critères</h2>
                            <p>Classez les pistes par coût, délai, impact et faisabilité.</p>
                        </div>
                        <button class="matrix-close-btn" type="button" data-matrix-close aria-label="Fermer">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </header>
                    <div class="matrix-toolbar decision-toolbar">
                        <label class="matrix-search">
                            <span class="material-symbols-outlined">search</span>
                            <input id="decision-matrix-search" type="search" placeholder="Rechercher une piste">
                        </label>
                        <select id="decision-matrix-priority" aria-label="Filtrer par priorité">
                            <option value="">Toutes les priorités</option>
                            ${['P1', 'P2', 'P3', 'P4'].map(priority => `<option value="${priority}">${this.getPriorityLabel(priority)}</option>`).join('')}
                        </select>
                        <select id="decision-matrix-category" aria-label="Filtrer par catégorie">
                            <option value="">Toutes les catégories</option>
                            ${categoryOptions.map(category => `<option value="${category}">${this.formatCategoryLabel(category)}</option>`).join('')}
                        </select>
                        <div class="matrix-toolbar-stats" id="decision-toolbar-stats">
                            ${this.renderDecisionToolbarStats()}
                        </div>
                    </div>
                    <div class="matrix-modal-body" id="decision-matrix-results">
                        ${this.renderDecisionMatrixResults()}
                    </div>
                    <footer class="matrix-note">
                        Score global : coût 25 %, délai 15 %, impact 25 %, faisabilité 15 %, acceptabilité 10 %, notation 10 %.
                    </footer>
                </section>
            </div>
        `;
    },

    getDecisionScore(piste) {
        const costs = this.allPistes.map(item => Number(item.budget?.cout_3_ans || 0));
        const delays = this.allPistes.map(item => Number(item.delai_mois || 0));
        const maxCost = Math.max(...costs, 1);
        const maxDelay = Math.max(...delays, 1);
        const costScore = 1 - (Number(piste.budget?.cout_3_ans || 0) / maxCost);
        const delayScore = 1 - (Number(piste.delai_mois || 0) / maxDelay);
        const impact = Number(piste.niveau_impact || Math.round(Number(piste.impact_score || 0) / 20)) / 5;
        const feasibility = Number(piste.niveau_faisabilite || 0) / 5;
        const acceptability = Number(piste.niveau_acceptabilite || 0) / 5;
        const rating = this.getTrackRating(piste) / 5;

        return Math.round(100 * (
            costScore * 0.25 +
            delayScore * 0.15 +
            impact * 0.25 +
            feasibility * 0.15 +
            acceptability * 0.10 +
            rating * 0.10
        ));
    },

    getDecisionPistes() {
        const search = this.decisionFilters.search.toLowerCase();
        const filtered = this.allPistes.filter(piste => {
            if (this.decisionFilters.priority && piste.priorite !== this.decisionFilters.priority) return false;
            if (this.decisionFilters.category && piste.categorie !== this.decisionFilters.category) return false;
            return !search || String(piste.numero || '').toLowerCase().includes(search) ||
                String(piste.titre || '').toLowerCase().includes(search);
        });
        const direction = this.decisionSort.direction === 'asc' ? 1 : -1;
        const values = {
            titre: piste => String(piste.titre || ''),
            priorite: piste => String(piste.priorite || ''),
            cout: piste => Number(piste.budget?.cout_3_ans || 0),
            delai: piste => Number(piste.delai_mois || 0),
            impact: piste => Number(piste.niveau_impact || piste.impact_score || 0),
            faisabilite: piste => Number(piste.niveau_faisabilite || 0),
            acceptabilite: piste => Number(piste.niveau_acceptabilite || 0),
            notation: piste => this.getTrackRating(piste),
            global: piste => this.getDecisionScore(piste)
        };
        const getter = values[this.decisionSort.column] || values.global;
        return filtered.sort((a, b) => {
            const valueA = getter(a);
            const valueB = getter(b);
            if (typeof valueA === 'string') return valueA.localeCompare(valueB, 'fr') * direction;
            return (valueA - valueB) * direction;
        });
    },

    getGlobalScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'medium';
        return 'low';
    },

    renderMatrixGauge(value, maximum, color) {
        const percent = Math.max(0, Math.min(100, (Number(value || 0) / Math.max(1, maximum)) * 100));
        return `<span class="matrix-gauge"><span style="width:${percent}%;background:${color};"></span></span>`;
    },

    renderDecisionToolbarStats() {
        const pistes = this.getDecisionPistes();
        if (pistes.length === 0) {
            return '<span><strong>0</strong> Pistes affichées</span>';
        }
        const average = Math.round(pistes.reduce((total, piste) => total + this.getDecisionScore(piste), 0) / pistes.length);
        return `
            <span><strong>${pistes.length}</strong> Pistes affichées</span>
            <span><strong>${average}/100</strong> Score moyen</span>
            <span><strong>${this.escapeValue(pistes[0].numero || '')}</strong> Meilleur score</span>
        `;
    },

    renderDecisionMatrixResults() {
        const pistes = this.getDecisionPistes();
        if (pistes.length === 0) {
            return '<div class="matrix-empty">Aucune piste ne correspond aux critères.</div>';
        }
        const sortHeader = (column, label) => {
            const marker = this.decisionSort.column === column
                ? (this.decisionSort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward')
                : 'unfold_more';
            return `<button type="button" data-decision-sort="${column}">${label}<span class="material-symbols-outlined">${marker}</span></button>`;
        };
        return `
            <div class="matrix-table-shell">
                <table class="decision-matrix">
                    <thead><tr>
                        <th>${sortHeader('titre', 'Piste / titre')}</th>
                        <th>${sortHeader('priorite', 'Priorité')}</th>
                        <th>${sortHeader('cout', 'Budget 3 ans')}</th>
                        <th>${sortHeader('delai', 'Délai')}</th>
                        <th>${sortHeader('impact', 'Impact')}</th>
                        <th>${sortHeader('faisabilite', 'Faisabilité')}</th>
                        <th>${sortHeader('acceptabilite', 'Acceptabilité')}</th>
                        <th>${sortHeader('notation', 'Notation')}</th>
                        <th>${sortHeader('global', 'Score global')}</th>
                    </tr></thead>
                    <tbody>
                        ${pistes.map(piste => {
                            const score = this.getDecisionScore(piste);
                            const impact = Number(piste.niveau_impact || Math.round(Number(piste.impact_score || 0) / 20));
                            const feasibility = Number(piste.niveau_faisabilite || 0);
                            const acceptability = Number(piste.niveau_acceptabilite || 0);
                            const rating = this.getTrackRating(piste);
                            const budget = Number(piste.budget?.cout_3_ans || 0);
                            const maxBudget = Math.max(...this.allPistes.map(item => Number(item.budget?.cout_3_ans || 0)), 1);
                            const delay = Number(piste.delai_mois || 0);
                            const maxDelay = Math.max(...this.allPistes.map(item => Number(item.delai_mois || 0)), 1);
                            return `
                                <tr>
                                    <td class="matrix-title"><strong>${this.escapeValue(piste.numero || '')}</strong>${this.escapeValue(piste.titre || '')}</td>
                                    <td><span class="matrix-priority priority-${this.getPriorityColor(piste.priorite)}">${this.getPriorityLabel(piste.priorite)}</span></td>
                                    <td class="matrix-score-cell">${Utils.formatCurrency(budget)}${this.renderMatrixGauge(budget, maxBudget, '#2563eb')}</td>
                                    <td class="matrix-score-cell">${delay} mois${this.renderMatrixGauge(delay, maxDelay, '#d97706')}</td>
                                    <td class="matrix-score-cell">${impact}/5${this.renderMatrixGauge(impact, 5, '#059669')}</td>
                                    <td class="matrix-score-cell">${feasibility}/5${this.renderMatrixGauge(feasibility, 5, '#7c3aed')}</td>
                                    <td class="matrix-score-cell">${acceptability}/5${this.renderMatrixGauge(acceptability, 5, '#f59e0b')}</td>
                                    <td class="matrix-score-cell">${rating}/5${this.renderMatrixGauge(rating, 5, '#003D82')}</td>
                                    <td><span class="global-score ${this.getGlobalScoreClass(score)}">${score}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderRelationsMatrixModal() {
        return `
            <div class="matrix-modal" id="relations-matrix-modal" role="dialog" aria-modal="true" aria-labelledby="relations-matrix-title">
                <section class="matrix-dialog matrix-dialog-wide">
                    <header class="matrix-modal-header">
                        <div>
                            <h2 id="relations-matrix-title">Matrice des relations entre pistes</h2>
                            <p>Repérez les prérequis, synergies, dépendances et conflits.</p>
                        </div>
                        <button class="matrix-close-btn" type="button" data-matrix-close aria-label="Fermer">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </header>
                    <div class="matrix-toolbar relations-toolbar">
                        <label class="matrix-search">
                            <span class="material-symbols-outlined">search</span>
                            <input id="relations-matrix-search" type="search" placeholder="Rechercher une piste">
                        </label>
                        <select id="relations-matrix-type" aria-label="Filtrer par relation">
                            <option value="all">Toutes les relations</option>
                            <option value="prerequisite">Prérequis</option>
                            <option value="requires">Requiert</option>
                            <option value="synergy">Synergie</option>
                            <option value="feeds_data">Alimente les données</option>
                            <option value="process_flow">Flux processus</option>
                            <option value="conflict">Conflit</option>
                            <option value="neutral">Neutre</option>
                        </select>
                        <label class="matrix-checkbox">
                            <input id="relations-bidirectional" type="checkbox">
                            Relations bidirectionnelles uniquement
                        </label>
                        <div class="matrix-toolbar-stats relations-toolbar-stats" id="relations-toolbar-stats">
                            ${this.renderRelationsToolbarStats()}
                        </div>
                    </div>
                    <div class="matrix-modal-body" id="relations-matrix-results">
                        ${this.renderRelationsMatrixResults()}
                    </div>
                </section>
            </div>
        `;
    },

    renderDiagramsModal(categoryOptions = []) {
        const tabs = [
            { id: 'scores', icon: 'show_chart', label: 'Scores' },
            { id: 'histogram', icon: 'bar_chart', label: 'Histogramme' },
            { id: 'bubble', icon: 'bubble_chart', label: 'Coût / Délai / Impact' },
            { id: 'triangle', icon: 'change_history', label: "Triangle d'Or" }
        ];
        return `
            <div class="matrix-modal" id="diagrams-matrix-modal" role="dialog" aria-modal="true" aria-labelledby="diagrams-matrix-title">
                <section class="matrix-dialog diagram-dialog">
                    <header class="matrix-modal-header">
                        <div>
                            <h2 id="diagrams-matrix-title">Diagrammes des pistes</h2>
                            <p>Visualisez les scores et les arbitrages coût, délai et impact des pistes filtrées.</p>
                        </div>
                        <button class="matrix-close-btn" type="button" data-matrix-close aria-label="Fermer">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </header>
                    <div class="matrix-toolbar diagram-toolbar">
                        <select id="diagrams-category" aria-label="Filtrer les diagrammes par catégorie">
                            <option value="">Toutes les catégories</option>
                            ${categoryOptions.map(category => `<option value="${category}">${this.formatCategoryLabel(category)}</option>`).join('')}
                        </select>
                        <select id="diagrams-priority" aria-label="Filtrer les diagrammes par priorité">
                            <option value="">Toutes les priorités</option>
                            ${['P1', 'P2', 'P3', 'P4'].map(priority => `<option value="${priority}">${this.getPriorityLabel(priority)}</option>`).join('')}
                        </select>
                        <button class="diagram-reset-btn" type="button" id="diagrams-reset">
                            <span class="material-symbols-outlined">restart_alt</span>
                            Réinitialiser
                        </button>
                    </div>
                    <nav class="diagram-tabs" aria-label="Types de diagrammes">
                        ${tabs.map(tab => `
                            <button class="diagram-tab ${tab.id === this.diagramTab ? 'active' : ''}" type="button" data-diagram-tab="${tab.id}">
                                <span class="material-symbols-outlined">${tab.icon}</span>
                                ${tab.label}
                            </button>
                        `).join('')}
                    </nav>
                    <div class="diagram-body">
                        ${tabs.map(tab => `
                            <section class="diagram-panel ${tab.id === this.diagramTab ? 'active' : ''}" data-diagram-panel="${tab.id}">
                                <canvas id="explore-diagram-${tab.id}" aria-label="${tab.label} des pistes"></canvas>
                            </section>
                        `).join('')}
                        <div class="diagram-legend" id="diagram-legend"></div>
                    </div>
                </section>
            </div>
        `;
    },

    getDiagramPriorityColor(priority) {
        const colors = {
            P1: '#059669',
            P2: '#d97706',
            P3: '#2563eb',
            P4: '#7c3aed'
        };
        return colors[priority] || '#94a3b8';
    },

    getDiagramPistes() {
        return this.allPistes.filter(piste => (
            (!this.diagramFilters.category || piste.categorie === this.diagramFilters.category) &&
            (!this.diagramFilters.priority || piste.priorite === this.diagramFilters.priority)
        ));
    },

    getDiagramScore(piste) {
        return this.getTrackRating(piste) || Math.min(5, Math.max(0, Math.round(Number(piste.impact_score || 0) / 20)));
    },

    getTrianglePoints(pistes) {
        const maxCost = Math.max(...pistes.map(piste => Number(piste.budget?.cout_3_ans || 0)), 1);
        const maxDelay = Math.max(...pistes.map(piste => Number(piste.delai_mois || 0)), 1);
        const points = pistes.map(piste => {
            const cost = 1 - (Number(piste.budget?.cout_3_ans || 0) / maxCost);
            const delay = 1 - (Number(piste.delai_mois || 0) / maxDelay);
            const impact = Number(piste.niveau_impact || Math.round(Number(piste.impact_score || 0) / 20)) / 5;
            const total = cost + delay + impact || 1;
            const costPart = cost / total;
            const delayPart = delay / total;
            const impactPart = impact / total;
            const balance = Math.max(0, 100 - ((Math.abs(costPart - 1 / 3) + Math.abs(delayPart - 1 / 3) + Math.abs(impactPart - 1 / 3)) * 100));
            return {
                x: delayPart + (impactPart * 0.5),
                y: impactPart * 0.866,
                piste,
                costPart,
                delayPart,
                impactPart,
                balance: Math.round(balance),
                relevance: this.getDecisionScore(piste)
            };
        });
        const groups = new Map();
        points.forEach(point => {
            const key = `${Math.round(point.x * 24)}-${Math.round(point.y * 24)}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(point);
        });
        groups.forEach(group => {
            group.forEach((point, index) => {
                if (group.length === 1) {
                    point.plotX = point.x;
                    point.plotY = point.y;
                    return;
                }
                const angle = (Math.PI * 2 * index) / group.length;
                const radius = Math.min(0.018 + (Math.floor(index / 6) * 0.008), 0.04);
                point.plotX = Math.min(0.96, Math.max(0.04, point.x + (Math.cos(angle) * radius)));
                point.plotY = Math.min(0.84, Math.max(0.04, point.y + (Math.sin(angle) * radius)));
            });
        });
        return points;
    },

    drawTriangleGuide(ctx, chartArea) {
        if (!chartArea) return;
        const { left, right, top, bottom, width, height } = chartArea;
        const padding = Math.min(width, height) * 0.08;
        const topX = left + width / 2;
        const topY = top + padding;
        const leftX = left + padding;
        const leftY = bottom - padding;
        const rightX = right - padding;
        const rightY = bottom - padding;
        const centerX = (topX + leftX + rightX) / 3;
        const centerY = (topY + leftY + rightY) / 3;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(topX, topY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(240, 242, 247, 0.42)';
        ctx.fill();
        ctx.strokeStyle = '#cfd6e6';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((leftX + topX) / 2, (leftY + topY) / 2);
        ctx.lineTo((topX + rightX) / 2, (topY + rightY) / 2);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(34, 197, 94, 0.16)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(leftX, leftY);
        ctx.lineTo((leftX + topX) / 2, (leftY + topY) / 2);
        ctx.lineTo(centerX, centerY);
        ctx.lineTo((leftX + rightX) / 2, (leftY + rightY) / 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo((topX + rightX) / 2, (topY + rightY) / 2);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.11)';
        ctx.fill();

        ctx.strokeStyle = '#dbe2f0';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        for (let index = 1; index < 3; index++) {
            const ratio = index / 3;
            const y = topY + ((leftY - topY) * ratio);
            const startX = topX - ((topX - leftX) * ratio);
            const endX = topX + ((rightX - topX) * ratio);
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.font = '600 12px "Public Sans", sans-serif';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.fillText('Impact', topX, topY - 10);
        ctx.textAlign = 'right';
        ctx.fillText('Coût', leftX - 8, leftY + 4);
        ctx.textAlign = 'left';
        ctx.fillText('Délai', rightX + 8, rightY + 4);
        ctx.font = '700 11px "Public Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#166534';
        ctx.fillText('À privilégier', centerX, centerY - 8);
        ctx.fillStyle = '#b45309';
        ctx.fillText('À arbitrer', leftX + ((rightX - leftX) * 0.34), leftY - 18);
        ctx.fillStyle = '#b91c1c';
        ctx.fillText('À éviter', rightX - 18, rightY - 18);
        ctx.restore();
    },

    renderTriangleLegend(points) {
        if (points.length === 0) return '';
        const average = Math.round(points.reduce((sum, point) => sum + point.balance, 0) / points.length);
        const best = [...points].sort((left, right) => right.relevance - left.relevance).slice(0, 3);
        return `
            <div class="triangle-guide-note">
                Le fond vert identifie la zone à privilégier, l'ambre la zone à arbitrer et le rouge la zone à éviter. Le centre traduit le meilleur équilibre coût / délai / impact.
            </div>
            <div class="triangle-stats">
                <span>Équilibre moyen <strong>${average}%</strong></span>
                ${best.map((point, index) => `<span class="triangle-top">#${index + 1} ${this.escapeValue(point.piste.numero)} <strong>${point.relevance}/100</strong></span>`).join('')}
            </div>
        `;
    },

    destroyDiagramCharts() {
        Object.values(this.diagramCharts).forEach(chart => chart?.destroy?.());
        this.diagramCharts = {};
    },

    refreshDiagrams() {
        if (this.activeMatrix !== 'diagrams') return;
        const pistes = this.getDiagramPistes();
        this.destroyDiagramCharts();
        const legend = document.getElementById('diagram-legend');
        if (!window.Chart || pistes.length === 0) {
            if (legend) legend.innerHTML = pistes.length === 0 ? '<span>Aucune piste ne correspond aux filtres actifs.</span>' : '';
            return;
        }

        const labels = pistes.map(piste => piste.numero);
        const pointColors = pistes.map(piste => this.getDiagramPriorityColor(piste.priorite));
        const maxCost = Math.max(...pistes.map(piste => Number(piste.budget?.cout_3_ans || 0)), 1);
        const maxDelay = Math.max(...pistes.map(piste => Number(piste.delai_mois || 0)), 1);
        const shared = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
        };
        const scoresCanvas = document.getElementById('explore-diagram-scores');
        if (scoresCanvas) {
            this.diagramCharts.scores = new window.Chart(scoresCanvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Score / 5',
                        data: pistes.map(piste => this.getDiagramScore(piste)),
                        borderColor: '#003D82',
                        backgroundColor: 'rgba(0, 61, 130, 0.10)',
                        pointBackgroundColor: pointColors,
                        pointRadius: 5,
                        fill: true,
                        tension: 0.2
                    }]
                },
                options: {
                    ...shared,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: context => {
                            const piste = pistes[context.dataIndex];
                            return `${piste.numero} - ${piste.titre} : score ${this.getDiagramScore(piste)}/5`;
                        } } }
                    },
                    scales: { y: { beginAtZero: true, max: 5, title: { display: true, text: 'Score / 5' } } }
                }
            });
        }
        const histogramCanvas = document.getElementById('explore-diagram-histogram');
        if (histogramCanvas) {
            this.diagramCharts.histogram = new window.Chart(histogramCanvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        { label: 'Coût normalisé', data: pistes.map(piste => Number(piste.budget?.cout_3_ans || 0) / maxCost * 5), backgroundColor: '#2563eb' },
                        { label: 'Délai normalisé', data: pistes.map(piste => Number(piste.delai_mois || 0) / maxDelay * 5), backgroundColor: '#059669' },
                        { label: 'Impact / 5', data: pistes.map(piste => Number(piste.niveau_impact || Math.round(Number(piste.impact_score || 0) / 20))), backgroundColor: '#d97706' }
                    ]
                },
                options: {
                    ...shared,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: { callbacks: { afterBody: items => {
                            const piste = pistes[items[0].dataIndex];
                            return `${piste.numero} - ${piste.titre}`;
                        } } }
                    },
                    scales: { y: { beginAtZero: true, max: 5 } }
                }
            });
        }
        const bubbleCanvas = document.getElementById('explore-diagram-bubble');
        if (bubbleCanvas) {
            this.diagramCharts.bubble = new window.Chart(bubbleCanvas.getContext('2d'), {
                type: 'bubble',
                data: {
                    datasets: pistes.map(piste => ({
                        label: piste.numero,
                        data: [{
                            x: Number(piste.delai_mois || 0),
                            y: Number(piste.budget?.cout_3_ans || 0) / 1000000,
                            r: 5 + (Number(piste.niveau_impact || Math.round(Number(piste.impact_score || 0) / 20)) * 3)
                        }],
                        backgroundColor: this.getDiagramPriorityColor(piste.priorite)
                    }))
                },
                options: {
                    ...shared,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: context => {
                            const piste = pistes[context.datasetIndex];
                            return `${piste.numero} - ${piste.titre} : ${piste.delai_mois || 0} mois, ${Utils.formatCurrency(piste.budget?.cout_3_ans || 0)}, impact ${piste.niveau_impact || 0}/5`;
                        } } }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Délai (mois)' } },
                        y: { title: { display: true, text: 'Coût (M€)' } }
                    }
                }
            });
        }
        const triangleCanvas = document.getElementById('explore-diagram-triangle');
        const trianglePoints = this.getTrianglePoints(pistes);
        if (triangleCanvas) {
            const bestRelevance = Math.max(...trianglePoints.map(point => point.relevance), 0);
            this.diagramCharts.triangle = new window.Chart(triangleCanvas.getContext('2d'), {
                type: 'scatter',
                data: {
                    datasets: trianglePoints.map(point => ({
                        label: point.piste.numero,
                        data: [{ x: point.plotX, y: point.plotY }],
                        backgroundColor: this.getDiagramPriorityColor(point.piste.priorite),
                        borderColor: point.relevance === bestRelevance ? '#f59e0b' : '#fff',
                        borderWidth: point.relevance === bestRelevance ? 3 : 1,
                        pointRadius: 4 + (point.balance / 100 * 4)
                    }))
                },
                plugins: [{
                    id: 'exploreTriangleBackground',
                    beforeDatasetsDraw: chart => this.drawTriangleGuide(chart.ctx, chart.chartArea)
                }],
                options: {
                    ...shared,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: context => {
                            const point = trianglePoints[context.datasetIndex];
                            return [
                                `${point.piste.numero} - ${point.piste.titre}`,
                                `Coût ${Math.round(point.costPart * 100)}% - Délai ${Math.round(point.delayPart * 100)}% - Impact ${Math.round(point.impactPart * 100)}%`,
                                `Équilibre ${point.balance}% - Pertinence ${point.relevance}/100`
                            ];
                        } } }
                    },
                    scales: {
                        x: { display: false, min: 0, max: 1 },
                        y: { display: false, min: 0, max: 0.9 }
                    }
                }
            });
        }
        if (legend) {
            legend.innerHTML = `
                <span class="diagram-priority p1">CRITICAL</span>
                <span class="diagram-priority p2">HIGH</span>
                <span class="diagram-priority p3">MEDIUM</span>
                <span class="diagram-priority p4">LOW</span>
                ${this.diagramTab === 'triangle' ? this.renderTriangleLegend(trianglePoints) : ''}
            `;
        }
    },

    selectDiagramTab(tab) {
        this.diagramTab = tab;
        document.querySelectorAll('[data-diagram-tab]').forEach(button => {
            button.classList.toggle('active', button.dataset.diagramTab === tab);
        });
        document.querySelectorAll('[data-diagram-panel]').forEach(panel => {
            panel.classList.toggle('active', panel.dataset.diagramPanel === tab);
        });
        this.diagramCharts[tab]?.resize?.();
        if (this.activeMatrix === 'diagrams') this.refreshDiagrams();
    },

    normalizePisteReference(value) {
        const reference = String(value || '').trim();
        if (/^\d+$/.test(reference)) return `P${reference}`;
        return reference.toUpperCase();
    },

    getRelation(source, targetNumber) {
        const expectedTarget = this.normalizePisteReference(targetNumber);
        return (source.relations || []).find(relation =>
            this.normalizePisteReference(relation.piste_liee || relation.target) === expectedTarget
        );
    },

    getRelationDisplay(type) {
        const relationTypes = {
            prerequisite: { label: 'Prérequis', symbol: 'PR', icon: 'arrow_forward', color: '#d97706' },
            requires: { label: 'Requiert', symbol: 'RQ', icon: 'conversion_path', color: '#4338ca' },
            synergy: { label: 'Synergie', symbol: 'SY', icon: 'handshake', color: '#059669' },
            feeds_data: { label: 'Données', symbol: 'DA', icon: 'database', color: '#2563eb' },
            process_flow: { label: 'Processus', symbol: 'FL', icon: 'account_tree', color: '#7c3aed' },
            conflict: { label: 'Conflit', symbol: '!', icon: 'error', color: '#dc2626' },
            neutral: { label: 'Indépendant', symbol: '-', icon: 'radio_button_unchecked', color: '#9ca3af' }
        };
        return relationTypes[type] || relationTypes.neutral;
    },

    getRelationDescription(type) {
        const descriptions = {
            prerequisite: 'La piste source est un prérequis à la mise en oeuvre de la piste cible.',
            requires: 'La piste source requiert la piste cible pour être pleinement déployée.',
            synergy: 'Ces pistes apportent davantage de valeur lorsqu elles sont conduites ensemble.',
            feeds_data: 'La piste source fournit des données utiles à la piste cible.',
            process_flow: 'Les pistes s inscrivent dans une même séquence opérationnelle.',
            conflict: 'Ces pistes présentent un risque de conflit ou de redondance.',
            neutral: 'Aucune interaction particulière n est identifiée entre ces pistes.'
        };
        return descriptions[type] || descriptions.neutral;
    },

    renderRelationTooltip(source, target, relation) {
        const type = relation?.type || 'neutral';
        const display = this.getRelationDisplay(type);
        const rationale = relation?.description || relation?.reason || this.getRelationDescription(type);
        const reverse = this.getRelation(target, source.numero);
        return `
            <div class="relation-tooltip-header">
                <span class="material-symbols-outlined" style="color:${display.color}">${display.icon}</span>
                <strong>Relation ${display.label}</strong>
            </div>
            <div class="relation-tooltip-route">
                <div><strong>${this.escapeValue(source.numero)}</strong><span>${this.escapeValue(source.titre || '')}</span></div>
                <span class="material-symbols-outlined" style="color:${display.color}">arrow_forward</span>
                <div><strong>${this.escapeValue(target.numero)}</strong><span>${this.escapeValue(target.titre || '')}</span></div>
            </div>
            <p class="relation-tooltip-reason">${this.escapeValue(rationale)}</p>
            <div class="relation-tooltip-meta">
                <span>Priorité source <strong>${this.getPriorityLabel(source.priorite)}</strong></span>
                <span>Priorité cible <strong>${this.getPriorityLabel(target.priorite)}</strong></span>
                <span>Note source <strong>${this.getTrackRating(source)}/5</strong></span>
                <span>Note cible <strong>${this.getTrackRating(target)}/5</strong></span>
            </div>
            ${reverse && type !== 'neutral' ? '<p class="relation-tooltip-bidirectional">Relation bidirectionnelle détectée</p>' : ''}
        `;
    },

    getRelationPistes() {
        const search = this.relationSearch.toLowerCase();
        return this.allPistes
            .filter(piste => !search || String(piste.numero || '').toLowerCase().includes(search) ||
                String(piste.titre || '').toLowerCase().includes(search))
            .sort((a, b) => String(a.numero || '').localeCompare(String(b.numero || ''), 'fr', { numeric: true }));
    },

    getRelationsSummary(pistes = this.getRelationPistes()) {
        let shownRelations = 0;
        pistes.forEach(source => {
            pistes.forEach(target => {
                if (source.numero === target.numero) return;
                const relation = this.getRelation(source, target.numero);
                const reverse = this.getRelation(target, source.numero);
                const visible = relation &&
                    (this.relationFilter === 'all' || relation.type === this.relationFilter) &&
                    (!this.relationBidirectionalOnly || reverse);
                if (visible) shownRelations += 1;
            });
        });
        return { pistes: pistes.length, relations: shownRelations };
    },

    renderRelationsToolbarStats() {
        const summary = this.getRelationsSummary();
        return `
            <span><strong>${summary.pistes}</strong> Pistes affichées</span>
            <span><strong>${summary.relations}</strong> Relations visibles</span>
        `;
    },

    renderRelationsMatrixResults() {
        const pistes = this.getRelationPistes();
        if (pistes.length === 0) {
            return '<div class="matrix-empty">Aucune piste ne correspond à la recherche.</div>';
        }
        const rows = pistes.map(source => `
            <tr>
                <th class="relations-source" title="${this.escapeValue(source.titre || '')}">
                    <strong>${this.escapeValue(source.numero || '')}</strong>
                    <span>${this.escapeValue(source.titre || '')}</span>
                </th>
                ${pistes.map(target => {
                    if (source.numero === target.numero) return '<td class="relation-cell diagonal">-</td>';
                    const relation = this.getRelation(source, target.numero);
                    const type = relation?.type || 'neutral';
                    const reverse = this.getRelation(target, source.numero);
                    const visible = (this.relationFilter === 'all' || type === this.relationFilter) &&
                        (!this.relationBidirectionalOnly || (relation && reverse));
                    if (!visible) return '<td class="relation-cell filtered"></td>';
                    const display = this.getRelationDisplay(type);
                    return `
                        <td class="relation-cell relation-${type}" data-relation-source="${this.escapeValue(source.numero)}" data-relation-target="${this.escapeValue(target.numero)}">
                            <span class="material-symbols-outlined">${display.icon}</span>
                            ${reverse && type !== 'neutral' ? '<span class="material-symbols-outlined relation-bidirectional">sync_alt</span>' : ''}
                        </td>
                    `;
                }).join('')}
            </tr>
        `).join('');
        return `
            <div class="relations-legend">
                ${['prerequisite', 'requires', 'synergy', 'feeds_data', 'process_flow', 'conflict', 'neutral'].map(type => {
                    const display = this.getRelationDisplay(type);
                    return `<span class="relation-${type}"><span class="material-symbols-outlined">${display.icon}</span>${display.label}</span>`;
                }).join('')}
            </div>
            <div class="matrix-table-shell relations-shell">
                <table class="relations-matrix">
                    <thead><tr><th>Piste</th>${pistes.map(piste => `<th title="${this.escapeValue(piste.titre || '')}">${this.escapeValue(piste.numero || '')}</th>`).join('')}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    },

    async openMatrix(type) {
        this.activeMatrix = type;
        const modal = document.getElementById(`${type}-matrix-modal`);
        modal?.classList.add('is-open');
        document.body.classList.add('matrix-modal-open');
        if (type === 'decision') {
            this.decisionFilters = { priority: '', category: '', search: '' };
            this.decisionSort = { column: 'global', direction: 'desc' };
            const search = document.getElementById('decision-matrix-search');
            const priority = document.getElementById('decision-matrix-priority');
            const category = document.getElementById('decision-matrix-category');
            if (search) search.value = '';
            if (priority) priority.value = '';
            if (category) category.value = '';
            this.refreshDecisionMatrix();
        } else if (type === 'relations') {
            this.relationFilter = 'all';
            this.relationSearch = '';
            this.relationBidirectionalOnly = false;
            const search = document.getElementById('relations-matrix-search');
            const filter = document.getElementById('relations-matrix-type');
            const bidirectional = document.getElementById('relations-bidirectional');
            if (search) search.value = '';
            if (filter) filter.value = 'all';
            if (bidirectional) bidirectional.checked = false;
            await this.reloadRelationsFromXml();
        } else if (type === 'diagrams') {
            this.diagramTab = 'scores';
            this.diagramFilters = { category: '', priority: '' };
            const category = document.getElementById('diagrams-category');
            const priority = document.getElementById('diagrams-priority');
            if (category) category.value = '';
            if (priority) priority.value = '';
            this.selectDiagramTab(this.diagramTab);
        }
    },

    closeMatrices() {
        this.activeMatrix = null;
        this.destroyDiagramCharts();
        document.querySelectorAll('.matrix-modal').forEach(modal => modal.classList.remove('is-open'));
        document.body.classList.remove('matrix-modal-open');
    },

    refreshDecisionMatrix() {
        const container = document.getElementById('decision-matrix-results');
        if (container) container.innerHTML = this.renderDecisionMatrixResults();
        const stats = document.getElementById('decision-toolbar-stats');
        if (stats) stats.innerHTML = this.renderDecisionToolbarStats();
        this.setupDecisionSortEvents();
    },

    refreshRelationsMatrix() {
        const container = document.getElementById('relations-matrix-results');
        if (container) container.innerHTML = this.renderRelationsMatrixResults();
        const stats = document.getElementById('relations-toolbar-stats');
        if (stats) stats.innerHTML = this.renderRelationsToolbarStats();
        this.setupRelationTooltips();
    },

    async reloadRelationsFromXml() {
        const parser = window.XMLParser || (typeof XMLParser !== 'undefined' ? XMLParser : null);
        if (!parser || typeof parser.parsePistes !== 'function') {
            this.refreshRelationsMatrix();
            return;
        }

        const container = document.getElementById('relations-matrix-results');
        if (container) {
            container.innerHTML = '<div class="matrix-empty">Chargement des relations depuis pistes.xml...</div>';
        }

        try {
            const data = await parser.parsePistes('data/pistes.xml');
            const xmlPistes = new Map((data.pistes || []).map(piste => [String(piste.numero), piste]));
            this.allPistes = this.allPistes.map(piste => {
                const xmlPiste = xmlPistes.get(String(piste.numero));
                const relations = typeof Utils.escapeDeep === 'function'
                    ? Utils.escapeDeep(xmlPiste?.relations || [])
                    : (xmlPiste?.relations || []);
                return xmlPiste ? { ...piste, relations } : piste;
            });
        } catch (error) {
            console.error('Erreur chargement relations XML:', error);
        }

        this.refreshRelationsMatrix();
    },

    setupRelationTooltips() {
        if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
        document.querySelectorAll('[data-relation-source][data-relation-target]').forEach(cell => {
            cell.addEventListener('mouseenter', () => {
                const source = this.allPistes.find(piste => String(piste.numero) === cell.dataset.relationSource);
                const target = this.allPistes.find(piste => String(piste.numero) === cell.dataset.relationTarget);
                if (!source || !target) return;
                const tooltip = document.createElement('div');
                tooltip.className = 'relation-tooltip-popup';
                tooltip.innerHTML = this.renderRelationTooltip(source, target, this.getRelation(source, target.numero));
                document.body.appendChild(tooltip);
                const rect = cell.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                const left = Math.max(12, Math.min(window.innerWidth - tooltipRect.width - 12, rect.left + rect.width / 2 - tooltipRect.width / 2));
                const above = rect.top - tooltipRect.height - 12;
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${above > 12 ? above : rect.bottom + 12}px`;
                cell._relationTooltip = tooltip;
            });
            cell.addEventListener('mouseleave', () => {
                cell._relationTooltip?.remove();
                cell._relationTooltip = null;
            });
        });
    },

    setupDecisionSortEvents() {
        document.querySelectorAll('[data-decision-sort]').forEach(button => {
            button.addEventListener('click', () => {
                const column = button.dataset.decisionSort;
                this.decisionSort = this.decisionSort.column === column
                    ? { column, direction: this.decisionSort.direction === 'asc' ? 'desc' : 'asc' }
                    : { column, direction: 'desc' };
                this.refreshDecisionMatrix();
            });
        });
    },

    loadRatings() {
        try {
            const raw = window.localStorage?.getItem('exploreTrackRatings');
            this.trackRatings = raw ? JSON.parse(raw) : {};
        } catch (error) {
            this.trackRatings = {};
        }
    },

    saveRatings() {
        try {
            window.localStorage?.setItem('exploreTrackRatings', JSON.stringify(this.trackRatings));
        } catch (error) {
            // Ignore localStorage errors
        }
    },

    getTrackRating(piste) {
        const key = String(piste?.numero || piste?.id || '');
        const localRating = Number(this.trackRatings?.[key]);
        const baseRating = Number(piste?.rating || 0);
        const value = Number.isFinite(localRating) && localRating > 0 ? localRating : baseRating;
        return Math.min(5, Math.max(0, value));
    },

    getMinRatingLabel(minRating) {
        const value = Math.min(5, Math.max(0, Number(minRating) || 0));
        return value === 0 ? 'Toutes' : `≥ ${value}★`;
    },

    formatBudgetFilterValue(value) {
        const amount = Number(value) || 0;
        if (amount >= 3000000) return '3M+ €';
        if (amount >= 1000000) return `${(amount / 1000000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M €`;
        return `${Math.round(amount / 1000)}k €`;
    },

    rateTrack(pisteId, rating) {
        const key = String(pisteId);
        const value = Math.min(5, Math.max(1, Number(rating)));

        this.trackRatings[key] = value;
        this.saveRatings();

        this.allPistes.forEach(piste => {
            if (String(piste?.numero) === key) {
                piste.rating = value;
            }
        });

        if (window.appStore && typeof window.appStore.getState === 'function' && typeof window.appStore.setState === 'function') {
            const state = window.appStore.getState();
            const updatedPistes = (state.allPistes || []).map((piste) => {
                if (String(piste?.numero) === key) {
                    return { ...piste, rating: value };
                }
                return piste;
            });
            window.appStore.setState({ allPistes: updatedPistes });
        }

        this.filterPistes();
    },

    goToDetail(pisteId) {
        console.log('Navigating to detail for piste:', pisteId);
        // Créer une route directe vers la page détail
        if (window.router) {
            window.router.navigate(`/piste-detail/${pisteId}`);
        } else {
            window.location.hash = `piste-detail/${pisteId}`;
        }
    },

    async goToEdition(pisteId) {
        if (!this.isAdminUser()) {
            window.Notifications?.error?.('Accès réservé aux administrateurs');
            return;
        }
        if (window.router) {
            await window.router.navigate('/edition');
            if (window.pages?.Edition) {
                window.pages.Edition.selectedTrackId = String(pisteId);
                window.pages.Edition.activeTab = 'general';
                window.pages.Edition.rerender();
            }
            return;
        }
        window.location.href = '/edition';
    },

    createTrack() {
        if (!this.isAdminUser()) {
            window.Notifications?.error?.('Accès réservé aux administrateurs');
            return;
        }
        if (window.router && typeof window.router.navigate === 'function') {
            window.router.navigate('/edition');
        } else {
            window.location.href = '/edition';
        }
    },

    setupEventListeners() {
        console.log('Setting up event listeners for Explore page');
        
        // Recherche
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                console.log('Search input changed:', e.target.value);
                this.filterPistes();
            });
        }

        const filteredPistesShortcut = document.getElementById('filtered-pistes-shortcut');
        filteredPistesShortcut?.addEventListener('change', event => {
            const pisteId = event.target.value;
            if (pisteId) this.goToDetail(pisteId);
        });

        // Catégories
        document.querySelectorAll('.category-filter').forEach(cb => {
            cb.addEventListener('change', (e) => {
                console.log('Category filter changed:', e.target.value);
                this.filterPistes();
            });
        });

        // Priorités
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Priority button clicked:', btn.dataset.priority);
                btn.classList.toggle('active');
                this.filterPistes();
            });
        });

        // Filtre notation (jauge)
        const ratingRange = document.getElementById('rating-range');
        if (ratingRange) {
            ratingRange.addEventListener('input', (e) => {
                this.minRatingFilter = parseInt(e.target.value || '0', 10);
                const ratingValue = document.getElementById('rating-value');
                if (ratingValue) ratingValue.textContent = this.getMinRatingLabel(this.minRatingFilter);
                this.filterPistes();
            });
        }

        // Budget
        const budgetRange = document.getElementById('budget-range');
        if (budgetRange) {
            budgetRange.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                console.log('Budget changed:', value);
                document.getElementById('budget-value').textContent = this.formatBudgetFilterValue(value);
                this.filterPistes();
            });
        }

        // Status
        const statusSelect = document.getElementById('status-select');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                console.log('Status changed:', e.target.value);
                this.filterPistes();
            });
        }

        // Reset
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Reset filters clicked');
                this.resetFilters();
            });
        }

        // Tri impact
        const sortImpactBtn = document.getElementById('sort-impact-btn');
        if (sortImpactBtn) {
            sortImpactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
                this.applySorting();
                this.currentPage = 1;
                this.renderCurrentPage();
                this.updateSortButtonLabel();
            });
        }

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('View toggle clicked:', btn.dataset.view);
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.viewMode = btn.dataset.view;
                this.renderCurrentPage();
            });
        });

        // Pagination
        this.setupPaginationEvents();

        document.querySelectorAll('[data-explore-matrix]').forEach(button => {
            button.addEventListener('click', () => this.openMatrix(button.dataset.exploreMatrix));
        });

        document.querySelectorAll('[data-matrix-close]').forEach(button => {
            button.addEventListener('click', () => this.closeMatrices());
        });

        document.querySelectorAll('.matrix-modal').forEach(modal => {
            modal.addEventListener('click', event => {
                if (event.target === modal) this.closeMatrices();
            });
        });

        const decisionSearch = document.getElementById('decision-matrix-search');
        const decisionPriority = document.getElementById('decision-matrix-priority');
        const decisionCategory = document.getElementById('decision-matrix-category');
        decisionSearch?.addEventListener('input', event => {
            this.decisionFilters.search = event.target.value;
            this.refreshDecisionMatrix();
        });
        decisionPriority?.addEventListener('change', event => {
            this.decisionFilters.priority = event.target.value;
            this.refreshDecisionMatrix();
        });
        decisionCategory?.addEventListener('change', event => {
            this.decisionFilters.category = event.target.value;
            this.refreshDecisionMatrix();
        });
        this.setupDecisionSortEvents();

        const relationSearch = document.getElementById('relations-matrix-search');
        const relationType = document.getElementById('relations-matrix-type');
        const relationBidirectional = document.getElementById('relations-bidirectional');
        relationSearch?.addEventListener('input', event => {
            this.relationSearch = event.target.value;
            this.refreshRelationsMatrix();
        });
        relationType?.addEventListener('change', event => {
            this.relationFilter = event.target.value;
            this.refreshRelationsMatrix();
        });
        relationBidirectional?.addEventListener('change', event => {
            this.relationBidirectionalOnly = event.target.checked;
            this.refreshRelationsMatrix();
        });

        document.querySelectorAll('[data-diagram-tab]').forEach(button => {
            button.addEventListener('click', () => this.selectDiagramTab(button.dataset.diagramTab));
        });
        const diagramCategory = document.getElementById('diagrams-category');
        const diagramPriority = document.getElementById('diagrams-priority');
        const diagramReset = document.getElementById('diagrams-reset');
        diagramCategory?.addEventListener('change', event => {
            this.diagramFilters.category = event.target.value;
            this.refreshDiagrams();
        });
        diagramPriority?.addEventListener('change', event => {
            this.diagramFilters.priority = event.target.value;
            this.refreshDiagrams();
        });
        diagramReset?.addEventListener('click', () => {
            this.diagramFilters = { category: '', priority: '' };
            if (diagramCategory) diagramCategory.value = '';
            if (diagramPriority) diagramPriority.value = '';
            this.refreshDiagrams();
        });

        document.addEventListener('keydown', this.handleMatrixKeydown ||= event => {
            if (event.key === 'Escape' && this.activeMatrix) this.closeMatrices();
        });

        // Navigation detail uniquement via "Détails"
    },

    setupPaginationEvents() {
        document.querySelectorAll('.pagination-num, .pagination-prev, .pagination-next').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePagination(btn);
            });
        });
    },

    filterPistes() {
        console.log('Filtering pistes...');
        const search = (document.getElementById('search-input')?.value || '').toLowerCase();
        const categories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
        const priorities = Array.from(document.querySelectorAll('.priority-btn.active')).map(btn => btn.dataset.priority);
        const maxBudget = parseInt(document.getElementById('budget-range')?.value || '3000000');
        const status = document.getElementById('status-select')?.value || '';
        const minRating = this.minRatingFilter;

        console.log('Filter criteria:', { search, categories, priorities, maxBudget, status, minRating });

        this.filteredPistes = this.allPistes.filter(p => {
            const matchSearch = !search || 
                (p.titre && p.titre.toLowerCase().includes(search)) || 
                (p.numero && p.numero.toLowerCase().includes(search));
            
            const matchCategory = categories.length === 0 || categories.some(
                category => this.normalizeCategory(category) === this.normalizeCategory(p.categorie)
            );
            const matchPriority = priorities.length === 0 || priorities.includes(p.priorite || 'P3');
            const matchBudget = p.budget && p.budget.cout_3_ans <= maxBudget;
            const matchRating = this.getTrackRating(p) >= minRating;
            
            return matchSearch && matchCategory && matchPriority && matchBudget && matchRating;
        });

        this.applySorting();

        console.log('Filtered pistes count:', this.filteredPistes.length);

        this.currentPage = 1;
        this.renderCurrentPage();
    },

    applySorting() {
        this.filteredPistes.sort((a, b) => {
            const impactA = Number(a?.impact_score || 0);
            const impactB = Number(b?.impact_score || 0);

            if (this.sortDirection === 'asc') {
                return impactA - impactB;
            }
            return impactB - impactA;
        });
    },

    updateSortButtonLabel() {
        const sortImpactBtn = document.getElementById('sort-impact-btn');
        if (!sortImpactBtn) return;
        sortImpactBtn.innerHTML = `
            <span class="material-symbols-outlined">sort</span>
            Trier par Impact (${this.sortDirection === 'desc' ? 'décroissant' : 'croissant'})
        `;
    },

    renderCurrentPage() {
        console.log('Rendering current page:', this.currentPage);
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pagePistes = this.filteredPistes.slice(start, end);

        console.log('Page pistes:', pagePistes.length, 'from', start, 'to', end);

        const container = document.getElementById('piste-container');
        if (container) {
            container.className = `piste-container ${this.viewMode === 'list' ? 'list-mode' : ''}`;
            const html = this.renderPistes(pagePistes);
            console.log('Rendering HTML with length:', html.length);
            container.innerHTML = html;
            
            // Navigation detail uniquement via "Détails"
        }

        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.innerHTML = this.renderPagination(this.filteredPistes.length);
            this.setupPaginationEvents();
        }

        const resultCount = document.getElementById('result-count');
        if (resultCount) {
            resultCount.textContent = `Affichage de ${this.filteredPistes.length} résultats selon vos filtres`;
        }
        this.updateFilteredPistesShortcut();
    },

    handlePagination(btn) {
        const totalPages = Math.ceil(this.filteredPistes.length / this.itemsPerPage);
        
        if (btn.classList.contains('pagination-prev')) {
            if (this.currentPage > 1) this.currentPage--;
        } else if (btn.classList.contains('pagination-next')) {
            if (this.currentPage < totalPages) this.currentPage++;
        } else {
            this.currentPage = parseInt(btn.dataset.page);
        }
        
        console.log('Page changed to:', this.currentPage);
        this.renderCurrentPage();
    },

    resetFilters() {
        console.log('Resetting all filters');
        
        // Reset checkboxes
        document.querySelectorAll('.category-filter').forEach(cb => cb.checked = true);
        
        // Reset priorities
        document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('active'));

        // Reset notation
        this.minRatingFilter = 0;
        const ratingRange = document.getElementById('rating-range');
        if (ratingRange) ratingRange.value = '0';
        const ratingValue = document.getElementById('rating-value');
        if (ratingValue) ratingValue.textContent = this.getMinRatingLabel(0);
        
        // Reset budget
        const budgetRange = document.getElementById('budget-range');
        if (budgetRange) {
            budgetRange.value = '3000000';
            document.getElementById('budget-value').textContent = '3M+ €';
        }
        
        // Reset search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset status
        const statusSelect = document.getElementById('status-select');
        if (statusSelect) {
            statusSelect.value = '';
        }
        
        this.filterPistes();
    }
};

// Exporter pour usage global
window.pages = window.pages || {};
window.pages.Explore = pages.Explore;
