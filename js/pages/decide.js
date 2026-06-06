/**
 * PAGES/DECIDE.JS - Page de validation et export (Design professionnel)
 * ENRICHIE: Sélecteur de simulations, récapitulatif détaillé et impression
 */

pages.Decide = {
    selectedTracks: [],
    totalBudget: 0,
    totalImpact: 0,
    selectedSimulationId: 'current',
    simulations: [],
    expandedPistes: [], // IDs des pistes dépliées pour les détails

    async render() {
        const state = appStore ? appStore.getState() : {};
        const currentTracks = state.currentScenario || [];
        const currentPlanning = state.currentScenarioPlanning || null;
        const currentConstraints = state.currentScenarioConstraints || null;
        const allPistes = state.allPistes || [];
        const scenarios = state.scenarios || [];
        
        // Construire la liste des simulations disponibles
        this.simulations = [
            { id: 'current', name: 'Scénario en cours', pistes: currentTracks, createdAt: new Date(), planning: currentPlanning, constraints: currentConstraints },
            ...scenarios.map(s => ({ id: s.id, name: s.name, pistes: s.pistes, createdAt: new Date(s.createdAt), planning: s.planning, constraints: s.constraints }))
        ].filter(s => s.pistes.length > 0);

        // Simulation sélectionnée
        const selectedSim = this.simulations.find(s => s.id === this.selectedSimulationId) || this.simulations[0];
        const tracksToShow = selectedSim ? selectedSim.pistes : currentTracks;
        const planning = this.calculatePlanning(tracksToShow, selectedSim || {});

        // Calculer les métriques
        const totalBudget = tracksToShow.reduce((sum, t) => sum + (t.budget?.cout_3_ans || 0), 0);
        const totalImpact = tracksToShow.length > 0 
            ? Math.round(tracksToShow.reduce((sum, t) => sum + (t.impact_score || 0), 0) / tracksToShow.length)
            : 0;

        // Pistes à afficher (les 5 premières + indication des autres)
        const showAllTracks = this.showAllPistesForSimulation === (selectedSim?.id || 'current');
        const displayedTracks = showAllTracks ? tracksToShow : tracksToShow.slice(0, 5);
        const remainingCount = Math.max(0, tracksToShow.length - 5);

        // Statistiques par priorité
        const priorityStats = this.calculatePriorityStats(tracksToShow);
        
        // Distribution dimensionnelle
        const dimensionScores = this.calculateAggregatedDimensions(tracksToShow);

        return `
            <div class="decide-wrapper">
                <!-- Header avec sélecteur de simulation -->
                <header class="decide-header">
                    <div class="header-inner">
                        <div class="header-left">
                            <div class="logo-box">
                                <span class="material-symbols-outlined">shield</span>
                            </div>
                            <div>
                             </div>
                        </div>
                        
                        <div class="simulation-selector">
                            <label for="simulation-select" class="selector-label">
                                <span class="material-symbols-outlined">playlist_play</span>
                                Simulation :
                            </label>
                            <select id="simulation-select" class="simulation-select" onchange="pages.Decide.changeSimulation(this.value)">
                                ${this.simulations.map(s => `
                                    <option value="${s.id}" ${s.id === this.selectedSimulationId ? 'selected' : ''}>
                                        ${s.name} (${s.pistes.length} pistes - ${new Date(s.createdAt).toLocaleDateString('fr-FR')})
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="header-actions">
                            <button class="btn-print" onclick="window.print()">
                                <span class="material-symbols-outlined">print</span>
                                Imprimer
                            </button>
                        </div>
                    </div>
                </header>

                <main class="decide-main">
                    <!-- Titre et badge -->
                    <div class="title-section">
                        <div class="title-left">
                            <h2 class="main-title">Validation finale du plan d'action</h2>
                            <p class="main-subtitle">
                                ${selectedSim ? selectedSim.name : 'Scénario en cours'} - 
                                ${tracksToShow.length} pistes sélectionnées
                            </p>
                        </div>
                        <div class="validation-badge ${tracksToShow.length > 0 ? 'ready' : 'empty'}">
                            <span class="material-symbols-outlined">${tracksToShow.length > 0 ? 'check_circle' : 'info'}</span>
                            <span>${tracksToShow.length > 0 ? 'PRÊT POUR VALIDATION' : 'AUCUNE PISTE SÉLECTIONNÉE'}</span>
                        </div>
                    </div>

                    <!-- Statistiques clés -->
                    <div class="key-stats">
                        <div class="stat-card">
                            <span class="stat-icon material-symbols-outlined">payments</span>
                            <div class="stat-content">
                                <span class="stat-label">Budget total</span>
                                <span class="stat-value">${this.formatCurrency(totalBudget)}</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <span class="stat-icon material-symbols-outlined">analytics</span>
                            <div class="stat-content">
                                <span class="stat-label">Impact moyen</span>
                                <span class="stat-value">${totalImpact}/100</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <span class="stat-icon material-symbols-outlined">priority_high</span>
                            <div class="stat-content">
                                <span class="stat-label">Priorité CRITICAL</span>
                                <span class="stat-value">${priorityStats.P1 || 0}</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <span class="stat-icon material-symbols-outlined">trending_down</span>
                            <div class="stat-content">
                                <span class="stat-label">Accidents évités</span>
                                <span class="stat-value">${tracksToShow.reduce((sum, t) => sum + (t.impact_accidents_evites || 0), 0)}</span>
                            </div>
                        </div>
                    </div>

                    ${this.renderPlanningTimeline(planning)}

                    <!-- Distribution dimensionnelle -->
                    <div class="dimensions-section">
                        <h3 class="section-title">
                            <span class="material-symbols-outlined">donut_large</span>
                            Distribution dimensionnelle du plan
                        </h3>
                        <div class="dimensions-bars">
                            ${Object.entries(dimensionScores).map(([key, value]) => `
                                <div class="dimension-bar-item">
                                    <div class="dimension-bar-label">
                                        <span class="dimension-color" style="background-color: ${this.getDimensionColor(key)}"></span>
                                        <span class="dimension-name">${this.getDimensionLabel(key)}</span>
                                        <span class="dimension-value">${Math.round(value)}%</span>
                                    </div>
                                    <div class="dimension-bar-container">
                                        <div class="dimension-bar-fill" style="width: ${value}%; background-color: ${this.getDimensionColor(key)}"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Tableau des pistes avec détails expansibles -->
                    <div class="tracks-table-section">
                        <div class="table-header">
                            <h3 class="table-title">
                                <span class="material-symbols-outlined">list_alt</span>
                                Détail des pistes sélectionnées
                            </h3>
                            <span class="table-count">${tracksToShow.length} PISTE(S) SÉLECTIONNÉE(S)</span>
                        </div>

                        <div class="table-wrapper">
                            <table class="tracks-table" id="tracks-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>ID</th>
                                        <th>Titre</th>
                                        <th>Priorité</th>
                                        <th>Budget (3 ans)</th>
                                        <th>Impact</th>
                                        <th>Délai de retour</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${displayedTracks.map((track, idx) => `
                                        <tr class="track-main-row ${this.expandedPistes.includes(track.numero) ? 'expanded' : ''}">
                                            <td class="expand-cell">
                                                <button class="btn-expand" onclick="pages.Decide.togglePisteDetails('${track.numero}')">
                                                    <span class="material-symbols-outlined">
                                                        ${this.expandedPistes.includes(track.numero) ? 'expand_less' : 'expand_more'}
                                                    </span>
                                                </button>
                                            </td>
                                            <td class="id-cell">${track.numero}</td>
                                            <td class="title-cell">${Utils.escapeHtml(track.titre || 'Sans titre')}</td>
                                            <td class="priority-cell">
                                                <span class="priority-badge priority-${this.getPriorityClass(track.priorite)}">
                                                    ${Utils.getPriorityLabel(track.priorite)}
                                                </span>
                                            </td>
                                            <td class="budget-cell">${this.formatCurrency(track.budget?.cout_3_ans || 0)}</td>
                                            <td class="impact-cell">
                                                <span class="impact-badge impact-${this.getImpactLevel(track.impact_score || 0)}">
                                                    ${track.impact_score || 0}/100
                                                </span>
                                            </td>
                                            <td class="roi-cell">${track.roi_mois || '?'} mois</td>
                                            <td class="actions-cell">
                                                <button class="btn-icon" onclick="pages.Decide.viewPisteDetails('${track.numero}')" title="Voir détails">
                                                    <span class="material-symbols-outlined">visibility</span>
                                                </button>
                                                <button class="btn-icon" onclick="pages.Decide.removeFromScenario('${track.numero}')" title="Retirer">
                                                    <span class="material-symbols-outlined">close</span>
                                                </button>
                                            </td>
                                        </tr>
                                        ${this.expandedPistes.includes(track.numero) ? `
                                            <tr class="track-details-row">
                                                <td colspan="8">
                                                    <div class="track-details">
                                                        <div class="details-grid">
                                                            <div class="details-section">
                                                                <h4>Description</h4>
                                                                <p>${Utils.escapeHtml(track.description_longue || track.description || 'Aucune description disponible')}</p>
                                                            </div>
                                                            
                                                            <div class="details-section">
                                                                <h4>Métriques détaillées</h4>
                                                                <div class="metrics-grid">
                                                                    <div class="metric-detail">
                                                                        <span class="metric-detail-label">Budget 2026</span>
                                                                        <span class="metric-detail-value">${this.formatCurrency(track.budget?.cout_2026 || 0)}</span>
                                                                    </div>
                                                                    <div class="metric-detail">
                                                                        <span class="metric-detail-label">Budget 2027</span>
                                                                        <span class="metric-detail-value">${this.formatCurrency(track.budget?.cout_2027 || 0)}</span>
                                                                    </div>
                                                                    <div class="metric-detail">
                                                                        <span class="metric-detail-label">Budget 2028</span>
                                                                        <span class="metric-detail-value">${this.formatCurrency(track.budget?.cout_2028 || 0)}</span>
                                                                    </div>
                                                                    <div class="metric-detail">
                                                                        <span class="metric-detail-label">Coût récurrent</span>
                                                                        <span class="metric-detail-value">${this.formatCurrency(track.budget?.cout_recurrent_annuel || 0)}/an</span>
                                                                    </div>
                                                                    <div class="metric-detail">
                                                                        <span class="metric-detail-label">Accidents évités</span>
                                                                        <span class="metric-detail-value">${track.impact_accidents_evites || 0}/an</span>
                                                                    </div>
                                                                    <div class="metric-detail">
                                                                        <span class="metric-detail-label">Économies</span>
                                                                        <span class="metric-detail-value">${this.formatCurrency(track.impact_economies || 0)}/an</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            ${track.dimensions ? `
                                                                <div class="details-section">
                                                                    <h4>Dimensions</h4>
                                                                    <div class="dimensions-mini">
                                                                        ${Object.entries(track.dimensions).map(([key, value]) => `
                                                                            <div class="dimension-mini-item">
                                                                                <span class="dimension-mini-label">${this.getDimensionLabel(key)}</span>
                                                                                <div class="dimension-mini-bar">
                                                                                    <div class="dimension-mini-fill" style="width: ${value}%; background-color: ${this.getDimensionColor(key)}"></div>
                                                                                </div>
                                                                                <span class="dimension-mini-value">${value}%</span>
                                                                            </div>
                                                                        `).join('')}
                                                                    </div>
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ` : ''}
                                    `).join('')}
                                    
                                    ${remainingCount > 0 && !showAllTracks ? `
                                        <tr class="other-tracks-row">
                                            <td colspan="8" class="text-center">
                                                ... et ${remainingCount} autres pistes sélectionnées
                                                <button class="btn-show-all" onclick="pages.Decide.showAllTracks()">
                                                    Voir tout
                                                </button>
                                            </td>
                                        </tr>
                                    ` : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Résumé Exécutif -->
                    <div class="summary-section">
                        <div class="executive-summary">
                            <h3 class="summary-title">
                                <span class="material-symbols-outlined">analytics</span>
                                Résumé Exécutif
                            </h3>

                            <div class="summary-grid">
                                <div class="summary-box">
                                    <p class="summary-label">INVESTISSEMENT TOTAL (2026-2028)</p>
                                    <div class="summary-value">
                                        <span class="amount">${(totalBudget / 1000000).toFixed(1)}</span>
                                        <span class="currency">M €</span>
                                    </div>

                                    <div class="budget-breakdown">
                                        <div class="breakdown-item">
                                            <span class="breakdown-label">Investissement initial</span>
                                            <span class="breakdown-value">${this.formatCurrency(totalBudget * 0.7)}</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 70%"></div>
                                        </div>

                                        <div class="breakdown-item">
                                            <span class="breakdown-label">Coûts récurrents (3 ans)</span>
                                            <span class="breakdown-value">${this.formatCurrency(totalBudget * 0.3)}</span>
                                        </div>
                                        <div class="progress-bar opex">
                                            <div class="progress-fill" style="width: 30%"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="summary-box">
                                    <p class="summary-label">GAINS SÉCURITÉ ATTENDUS</p>
                                    <div class="summary-value gain">
                                        <span class="amount">-${(totalImpact * 0.34).toFixed(1)}</span>
                                        <span class="currency">%</span>
                                    </div>
                                    <p class="gain-subtitle">Réduction estimée des accidents corporels</p>

                                    <div class="gain-items">
                                        <div class="gain-item">
                                            <span class="material-symbols-outlined">trending_down</span>
                                            <span><strong>${tracksToShow.reduce((sum, t) => sum + (t.impact_accidents_evites || 0), 0)}</strong> accidents évités / an</span>
                                        </div>
                                        <div class="gain-item">
                                            <span class="material-symbols-outlined">savings</span>
                                            <span><strong>${this.formatCurrency(tracksToShow.reduce((sum, t) => sum + (t.impact_economies || 0), 0))}</strong> d'économies / an</span>
                                        </div>
                                        <div class="gain-item">
                                            <span class="material-symbols-outlined">schedule</span>
                                            <span><strong>Délai de retour moyen: ${Math.round(tracksToShow.reduce((sum, t) => sum + (t.roi_mois || 0), 0) / tracksToShow.length)} mois</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tableau récapitulatif des pistes -->
                            <div class="summary-tracks">
                                <h4>Récapitulatif des pistes</h4>
                                <table class="summary-tracks-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Titre</th>
                                            <th>Priorité</th>
                                            <th>Budget</th>
                                            <th>Impact</th>
                                            <th>Délai de retour</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${tracksToShow.map(track => `
                                            <tr>
                                                <td>${track.numero}</td>
                                                <td>${Utils.escapeHtml(track.titre)}</td>
                                                <td><span class="priority-dot priority-${this.getPriorityClass(track.priorite)}"></span> ${Utils.getPriorityLabel(track.priorite)}</td>
                                                <td>${this.formatCurrency(track.budget?.cout_3_ans || 0)}</td>
                                                <td>${track.impact_score || 0}</td>
                                                <td>${track.roi_mois || '?'} mois</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Note de Validation -->
                        <div class="validation-note">
                            <div class="note-header">
                                <span class="material-symbols-outlined">info</span>
                                <span>Note de Validation</span>
                            </div>
                            <p class="note-content">
                                Ce plan d'action a été consolidé sur la base des simulations multicritères. 
                                Les budgets incluent une marge de contingence de 10%. Les scores d'impact sont basés 
                                sur les données historiques CDG 2024-2025.
                            </p>
                            <div class="note-footer">
                                <p class="note-footer-label">ID DE CONFIGURATION</p>
                                <p class="note-footer-value">SEC-2026-${this.selectedSimulationId.toUpperCase().slice(0,8)}-${new Date().toISOString().slice(0,10).replace(/-/g, '')}</p>
                            </div>
                            <div class="note-footer">
                                <p class="note-footer-label">DATE DE GÉNÉRATION</p>
                                <p class="note-footer-value">${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div class="note-signature">
                                <p>Validé par : _________________________</p>
                                <p>Date : _________________________</p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions d'Export -->
                    <div class="export-section">
                        <button class="btn-export-pdf" onclick="pages.Decide.exportPDF()">
                            <span class="material-symbols-outlined">picture_as_pdf</span>
                            Exporter en PDF (Plan détaillé)
                        </button>
                    </div>
                    
                </main>

                <!-- Footer avec signature -->
                <footer class="decide-footer print-only">
                    <div class="footer-inner">
                        <div class="footer-left">
                            <span class="material-symbols-outlined">description</span>
                            Document généré le ${new Date().toLocaleDateString('fr-FR')}
                        </div>
                        <div class="footer-right">
                            <span>Safety Management System</span>
                        </div>
                    </div>
                </footer>
            </div>
            
            <!-- Styles d'impression -->
            <style media="print">
                @page {
                    size: A4;
                    margin: 1.5cm;
                }
                
                .decide-header, .export-section, .btn-expand, .btn-icon, .btn-show-all, 
                .simulation-selector, .header-actions, .btn-print {
                    display: none !important;
                }
                
                .print-only {
                    display: block !important;
                }
                
                .decide-wrapper {
                    background: white;
                    padding: 0;
                }
                
                .track-details {
                    display: block !important;
                    page-break-inside: avoid;
                }
                
                .tracks-table {
                    page-break-inside: auto;
                }
                
                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                
                thead {
                    display: table-header-group;
                }
                
                tfoot {
                    display: table-footer-group;
                }
                
                .validation-note {
                    border: 1px solid #000;
                    page-break-inside: avoid;
                }
                
                .note-signature {
                    margin-top: 40px;
                }
            </style>
        `;
    },

    calculatePriorityStats(tracks) {
        const stats = {};
        tracks.forEach(t => {
            const priority = t.priorite || 'P3';
            stats[priority] = (stats[priority] || 0) + 1;
        });
        return stats;
    },

    calculateAggregatedDimensions(pistes) {
        const dims = {
            culture: 0,
            technique: 0,
            humain: 0,
            organisationnel: 0,
            economique: 0
        };
        
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
        
        const total = Object.values(dims).reduce((a, b) => a + b, 0);
        if (total > 0) {
            Object.keys(dims).forEach(key => {
                dims[key] = (dims[key] / total) * 100;
            });
        }
        
        return dims;
    },

    calculatePlanning(pistes, simulation = {}) {
        if (simulation.planning && Array.isArray(simulation.planning.teams)) return simulation.planning;
        const configuredTeams = simulation.constraints?.equipes?.value || 1;
        const teamCount = Math.max(1, Math.round(Number(configuredTeams) || 1));
        const teams = Array.from({ length: teamCount }, (_, index) => ({ id: index + 1, availableAt: 0, tasks: [] }));
        const tasks = [...pistes]
            .map(piste => ({ piste, duration: Math.max(1, Math.round(Number(piste.delai_mois) || 1)) }))
            .sort((left, right) => right.duration - left.duration);
        tasks.forEach(task => {
            const team = teams.reduce((earliest, candidate) =>
                candidate.availableAt < earliest.availableAt ? candidate : earliest, teams[0]);
            const scheduled = { ...task, start: team.availableAt, end: team.availableAt + task.duration };
            team.tasks.push(scheduled);
            team.availableAt = scheduled.end;
        });
        const sequentialDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
        const totalDuration = teams.reduce((maximum, team) => Math.max(maximum, team.availableAt), 0);
        return { teamCount, teams, sequentialDuration, totalDuration, savedMonths: sequentialDuration - totalDuration };
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
        return `
            <section class="decision-timeline">
                <h3 class="section-title">
                    <span class="material-symbols-outlined">calendar_month</span>
                    Calendrier de mise en oeuvre
                </h3>
                <div class="decision-timeline-kpis">
                    <div><strong>${planning.totalDuration} mois</strong><span>Durée planifiée</span></div>
                    <div><strong>${planning.teamCount}</strong><span>Équipe${planning.teamCount > 1 ? 's' : ''} mobilisée${planning.teamCount > 1 ? 's' : ''}</span></div>
                    <div><strong>${planning.savedMonths} mois</strong><span>Gain vs séquentiel</span></div>
                </div>
                <p class="decision-planning-note">Hypothèse : exécution parallèle possible sans dépendances entre pistes.</p>
                <div class="decision-teams">
                    ${planning.teams.map(team => `
                        <div class="decision-team-row">
                            <strong>Équipe ${team.id}</strong>
                            <div class="decision-track">
                                ${team.tasks.map(task => {
                                    const piste = task.piste || task.track;
                                    if (!piste) return '';
                                    const style = this.getTimelinePriorityStyle(piste);
                                    return `
                                    <span class="decision-task timeline-task-priority" style="left: ${(task.start / horizon) * 100}%; width: ${(task.duration / horizon) * 100}%; background: ${style.bg}; border-left-color: ${style.text};">
                                        ${Utils.escapeHtml(piste.numero || '')} <small>${task.duration}m</small>
                                        ${this.renderTimelineTaskTooltip(piste, task)}
                                    </span>
                                `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
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

    getDimensionLabel(dimension) {
        const labels = {
            culture: 'CULTURE',
            technique: 'TECH',
            humain: 'HUMAIN',
            organisationnel: 'ORG',
            economique: 'ECO'
        };
        return labels[dimension] || dimension.toUpperCase();
    },

    changeSimulation(simulationId) {
        this.selectedSimulationId = simulationId;
        this.showAllPistesForSimulation = null;
        this.expandedPistes = []; // Replier toutes les pistes
        this.rerender();
    },

    togglePisteDetails(pisteId) {
        if (this.expandedPistes.includes(pisteId)) {
            this.expandedPistes = this.expandedPistes.filter(id => id !== pisteId);
        } else {
            this.expandedPistes.push(pisteId);
        }
        this.rerender();
    },

    viewPisteDetails(pisteId) {
        if (window.router) {
            window.router.navigate(`/piste-detail/${pisteId}`);
        }
    },

    removeFromScenario(pisteId) {
        const state = appStore.getState();
        const currentTracks = state.currentScenario || [];
        const updatedTracks = currentTracks.filter(t => t.numero !== pisteId);
        
        if (window.appActions) {
            appActions.setCurrentScenario(updatedTracks);
        }
        
        if (window.Notifications) {
            Notifications.success(`Piste ${pisteId} retirée du scénario`);
        }
        
        this.rerender();
    },

    showAllTracks() {
        this.showAllPistesForSimulation = this.selectedSimulationId;
        this.rerender();
    },

    getImpactLevel(impact) {
        if (impact >= 85) return 'high';
        if (impact >= 70) return 'medium';
        if (impact >= 50) return 'low';
        return 'minimal';
    },

    getPriorityClass(priority) {
        const map = { 'P1': 'critical', 'P2': 'high', 'P3': 'medium', 'P4': 'low' };
        return map[priority] || 'medium';
    },

    formatCurrency(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + ' M€';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + ' k€';
        }
        return amount + ' €';
    },

    getSelectedSimulationForExport() {
        const state = appStore ? appStore.getState() : {};
        const currentTracks = state.currentScenario || [];
        const currentPlanning = state.currentScenarioPlanning || null;
        const currentConstraints = state.currentScenarioConstraints || null;
        const scenarios = state.scenarios || [];
        const simulations = [
            { id: 'current', name: 'Scénario en cours', pistes: currentTracks, createdAt: new Date(), planning: currentPlanning, constraints: currentConstraints },
            ...scenarios.map(scenario => ({
                id: scenario.id,
                name: scenario.name,
                pistes: scenario.pistes || [],
                createdAt: new Date(scenario.createdAt || Date.now()),
                planning: scenario.planning,
                constraints: scenario.constraints
            }))
        ].filter(simulation => simulation.pistes.length > 0);

        return simulations.find(simulation => simulation.id === this.selectedSimulationId) || simulations[0] || null;
    },

    normalizeTask(task) {
        const piste = task.piste || task.track || {};
        const duration = Math.max(1, Math.round(Number(task.duration ?? piste.delai_mois) || 1));
        const start = Math.max(0, Math.round(Number(task.start) || 0));
        const end = Math.max(start + duration, Math.round(Number(task.end) || (start + duration)));
        return { ...task, piste, duration, start, end };
    },

    buildProjectPhases(planning) {
        const tasks = (planning.teams || [])
            .flatMap(team => (team.tasks || []).map(task => ({ ...this.normalizeTask(task), teamId: team.id })))
            .sort((left, right) => left.start - right.start || left.end - right.end);
        const horizon = Math.max(1, planning.totalDuration || tasks.reduce((max, task) => Math.max(max, task.end), 0));
        const phaseLength = Math.max(1, Math.ceil(horizon / 3));
        const phaseLabels = ['Cadrage et lancement', 'Déploiement opérationnel', 'Stabilisation et transfert'];

        return phaseLabels.map((label, index) => {
            const start = index * phaseLength;
            const end = index === phaseLabels.length - 1 ? horizon : Math.min(horizon, (index + 1) * phaseLength);
            const phaseTasks = tasks.filter(task => task.start < end && task.end > start);
            const budget = phaseTasks.reduce((sum, task) => sum + (task.piste.budget?.cout_3_ans || 0), 0);
            return { label, start, end, tasks: phaseTasks, budget };
        }).filter(phase => phase.start < phase.end);
    },

    getPhasingPeriodConfig(totalDuration) {
        if (totalDuration <= 3) return { unit: 'quinzaine', months: 0.5 };
        if (totalDuration <= 18) return { unit: 'mois', months: 1 };
        return { unit: 'trimestre', months: 3 };
    },

    formatPhasingPeriodLabel(index, start, end, periodConfig) {
        if (periodConfig.unit === 'quinzaine') {
            const month = Math.floor(start) + 1;
            const half = start % 1 === 0 ? 1 : 2;
            return `M${month} - quinzaine ${half}`;
        }
        if (periodConfig.unit === 'trimestre') {
            return `T${index + 1} - M${Math.floor(start)} à M${Math.ceil(end)}`;
        }
        return `Mois ${index + 1} - M${Math.floor(start)} à M${Math.ceil(end)}`;
    },

    getPeriodTaskStatus(task, start, end) {
        const startsHere = task.start >= start && task.start < end;
        const endsHere = task.end > start && task.end <= end;
        if (startsHere && endsHere) return 'Lancer et finaliser';
        if (startsHere) return 'Lancer';
        if (endsHere) return 'Finaliser';
        return 'Piloter';
    },

    getPeriodTaskInstruction(task, start, end) {
        const status = this.getPeriodTaskStatus(task, start, end);
        const piste = task.piste || {};
        const numero = piste.numero || 'Action';
        const title = piste.titre || 'Action planifiée';
        const category = piste.categorie || piste.famille || 'Non définie';
        const budget = this.formatCurrency(piste.budget?.cout_3_ans || 0);

        if (status === 'Lancer') {
            return {
                status,
                text: `${numero} - ${title}`,
                detail: `Cadrer le périmètre, confirmer les responsables, engager le budget ${budget} et sécuriser les prérequis (${category}).`
            };
        }
        if (status === 'Finaliser') {
            return {
                status,
                text: `${numero} - ${title}`,
                detail: `Valider les livrables, mesurer l'impact sécurité, documenter les écarts et préparer le passage en exploitation.`
            };
        }
        if (status === 'Lancer et finaliser') {
            return {
                status,
                text: `${numero} - ${title}`,
                detail: 'Exécuter en cycle court : cadrage, réalisation, validation terrain et bilan dans la période.'
            };
        }
        return {
            status,
            text: `${numero} - ${title}`,
            detail: 'Suivre l\'avancement, lever les blocages, contrôler le consommé budgétaire et préparer le prochain jalon.'
        };
    },

    buildDetailedPhasing(planning) {
        const tasks = (planning.teams || [])
            .flatMap(team => (team.tasks || []).map(task => ({ ...this.normalizeTask(task), teamId: team.id })))
            .sort((left, right) => left.start - right.start || left.end - right.end);
        const totalDuration = Math.max(1, planning.totalDuration || tasks.reduce((max, task) => Math.max(max, task.end), 0));
        const periodConfig = this.getPhasingPeriodConfig(totalDuration);
        const periodCount = Math.ceil(totalDuration / periodConfig.months);

        return Array.from({ length: periodCount }, (_, index) => {
            const start = index * periodConfig.months;
            const end = Math.min(totalDuration, start + periodConfig.months);
            const activeTasks = tasks
                .filter(task => task.start < end && task.end > start)
                .map(task => {
                    const instruction = this.getPeriodTaskInstruction(task, start, end);
                    return {
                        ...instruction,
                        teamId: task.teamId,
                        priority: this.getTimelinePriorityStyle(task.piste).name,
                        start: task.start,
                        end: task.end
                    };
                });
            const budget = tasks
                .filter(task => task.start >= start && task.start < end)
                .reduce((sum, task) => sum + (task.piste.budget?.cout_3_ans || 0), 0);

            return {
                label: this.formatPhasingPeriodLabel(index, start, end, periodConfig),
                start,
                end,
                budget,
                actions: activeTasks,
                decisions: activeTasks
                    .filter(action => action.status !== 'Piloter')
                    .map(action => `${action.status} ${action.text.split(' - ')[0]}`)
            };
        }).filter(period => period.actions.length > 0);
    },

    buildProjectMilestones(planning) {
        const tasks = (planning.teams || [])
            .flatMap(team => (team.tasks || []).map(task => ({ ...this.normalizeTask(task), teamId: team.id })))
            .sort((left, right) => left.end - right.end || left.start - right.start);

        if (tasks.length === 0) return [];

        const milestones = [
            { label: 'Lancement du programme', month: 0, detail: 'Validation du périmètre, des ressources et du calendrier de référence.' },
            ...tasks.slice(0, 8).map(task => ({
                label: `${task.piste.numero || 'Action'} - ${task.piste.titre || 'Action planifiée'}`,
                month: task.end,
                detail: `Fin prévisionnelle équipe ${task.teamId}.`
            }))
        ];

        const finalMonth = Math.max(...tasks.map(task => task.end));
        milestones.push({
            label: 'Comité de clôture et passage en run',
            month: finalMonth,
            detail: 'Bilan de déploiement, mesure des gains sécurité et transfert aux équipes opérationnelles.'
        });

        return milestones;
    },

    renderPDFPlanTimeline(planning) {
        const horizon = Math.max(1, planning.totalDuration);
        return `
            <div class="pdf-plan-gantt">
                ${(planning.teams || []).map(team => `
                    <div class="pdf-plan-team">
                        <strong>Équipe ${team.id}</strong>
                        <div class="pdf-plan-track">
                            ${(team.tasks || []).map(rawTask => {
                                const task = this.normalizeTask(rawTask);
                                const style = this.getTimelinePriorityStyle(task.piste);
                                return `
                                    <span class="pdf-plan-task" style="left:${(task.start / horizon) * 100}%;width:${Math.max(6, (task.duration / horizon) * 100)}%;background:${style.bg};">
                                        ${Utils.escapeHtml(task.piste.numero || '')}
                                    </span>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    generateActionPlanPDFHTML(simulation) {
        const safe = value => Utils.escapeHtml(value ?? '');
        const pistes = simulation?.pistes || [];
        const planning = this.calculatePlanning(pistes, simulation || {});
        const detailedPhasing = this.buildDetailedPhasing(planning);
        const milestones = this.buildProjectMilestones(planning);
        const priorityStats = this.calculatePriorityStats(pistes);
        const totalBudget = pistes.reduce((sum, piste) => sum + (piste.budget?.cout_3_ans || 0), 0);
        const totalAccidents = pistes.reduce((sum, piste) => sum + (piste.impact_accidents_evites || 0), 0);
        const totalEconomies = pistes.reduce((sum, piste) => sum + (piste.impact_economies || 0), 0);
        const averageImpact = pistes.length
            ? Math.round(pistes.reduce((sum, piste) => sum + (piste.impact_score || 0), 0) / pistes.length)
            : 0;
        const averageRoi = pistes.filter(piste => Number(piste.roi_mois)).length
            ? Math.round(pistes.reduce((sum, piste) => sum + (Number(piste.roi_mois) || 0), 0) / pistes.filter(piste => Number(piste.roi_mois)).length)
            : null;
        const generatedAt = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
        const configId = `SEC-${new Date().getFullYear()}-${String(simulation?.id || 'current').toUpperCase().slice(0, 8)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
        const styleOpen = '<' + 'style>';
        const styleClose = '</' + 'style>';

        return `
            <div class="pdf-action-plan">
                ${styleOpen}
                    .pdf-action-plan { width: 720px; box-sizing: border-box; padding: 28px; background: #fff; color: #172033; font-family: Arial, sans-serif; font-size: 11px; line-height: 1.45; }
                    .pdf-action-plan * { box-sizing: border-box; }
                    .pdf-cover { border-bottom: 3px solid #003D82; padding-bottom: 16px; margin-bottom: 18px; }
                    .pdf-eyebrow { color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
                    .pdf-cover h1 { margin: 6px 0 8px; color: #003D82; font-size: 26px; line-height: 1.15; }
                    .pdf-cover p { margin: 0; color: #475569; font-size: 12px; }
                    .pdf-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
                    .pdf-meta div, .pdf-kpi, .pdf-phase, .pdf-box { border: 1px solid #dbe3ef; border-radius: 6px; padding: 10px; background: #f8fafc; }
                    .pdf-meta span, .pdf-kpi span { display: block; color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; }
                    .pdf-meta strong, .pdf-kpi strong { display: block; color: #0f172a; font-size: 14px; margin-top: 3px; }
                    .pdf-section { page-break-inside: avoid; margin-top: 18px; }
                    .pdf-section h2 { color: #003D82; font-size: 15px; margin: 0 0 9px; padding-bottom: 5px; border-bottom: 1px solid #dbe3ef; }
                    .pdf-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
                    .pdf-kpi strong { font-size: 16px; }
                    .pdf-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                    .pdf-box ul, .pdf-period ul { margin: 8px 0 0 16px; padding: 0; }
                    .pdf-box li, .pdf-period li { margin: 3px 0; }
                    .pdf-period { border: 1px solid #dbe3ef; border-radius: 6px; padding: 10px; background: #f8fafc; margin-bottom: 8px; page-break-inside: avoid; }
                    .pdf-period h3 { margin: 0 0 5px; color: #0f172a; font-size: 12px; }
                    .pdf-period-head { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
                    .pdf-period-meta { color: #64748b; font-size: 9px; font-weight: 700; text-align: right; text-transform: uppercase; }
                    .pdf-period-action { border-top: 1px solid #e2e8f0; padding-top: 7px; margin-top: 7px; }
                    .pdf-period-action strong { color: #0f172a; }
                    .pdf-period-action span { color: #64748b; font-size: 9px; font-weight: 700; }
                    .pdf-period-action p { margin: 3px 0 0; color: #475569; }
                    .pdf-period-decisions { margin-top: 7px; padding: 7px; border-radius: 5px; background: #fff7ed; color: #9a3412; }
                    .pdf-plan-gantt { border: 1px solid #dbe3ef; border-radius: 6px; padding: 8px; background: #fff; }
                    .pdf-plan-team { display: grid; grid-template-columns: 70px 1fr; gap: 8px; align-items: center; margin: 6px 0; }
                    .pdf-plan-team strong { font-size: 10px; color: #334155; }
                    .pdf-plan-track { position: relative; height: 22px; background: #eef2f7; border-radius: 4px; overflow: hidden; }
                    .pdf-plan-task { position: absolute; top: 3px; height: 16px; border-radius: 3px; color: #fff; font-size: 8px; font-weight: 700; padding: 3px 4px; overflow: hidden; white-space: nowrap; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .pdf-table { width: 100%; border-collapse: collapse; }
                    .pdf-table th { background: #003D82; color: #fff; padding: 7px; text-align: left; font-size: 9px; }
                    .pdf-table td { border-bottom: 1px solid #e2e8f0; padding: 7px; vertical-align: top; }
                    .pdf-table tr { page-break-inside: avoid; }
                    .pdf-pill { display: inline-block; padding: 2px 6px; border-radius: 999px; background: #eef2ff; color: #1d4ed8; font-size: 9px; font-weight: 700; }
                    .pdf-milestone { display: grid; grid-template-columns: 52px 1fr; gap: 8px; padding: 7px 0; border-bottom: 1px solid #e2e8f0; }
                    .pdf-milestone strong { color: #003D82; }
                    .pdf-signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
                    .pdf-signatures div { min-height: 54px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; }
                    .pdf-footer { margin-top: 18px; color: #64748b; font-size: 9px; text-align: right; }
                ${styleClose}

                <section class="pdf-cover">
                    <div class="pdf-eyebrow">Plan d'action sécurité CDG</div>
                    <h1>${safe(simulation?.name || 'Scénario en cours')}</h1>
                    <p>Document de pilotage projet : actions retenues, phasage, jalons, charges budgétaires et points de gouvernance.</p>
                    <div class="pdf-meta">
                        <div><span>Date</span><strong>${safe(generatedAt)}</strong></div>
                        <div><span>Configuration</span><strong>${safe(configId)}</strong></div>
                        <div><span>Périmètre</span><strong>${pistes.length} action(s)</strong></div>
                    </div>
                </section>

                <section class="pdf-section">
                    <h2>1. Synthèse exécutive</h2>
                    <div class="pdf-kpis">
                        <div class="pdf-kpi"><span>Budget 3 ans</span><strong>${this.formatCurrency(totalBudget)}</strong></div>
                        <div class="pdf-kpi"><span>Impact moyen</span><strong>${averageImpact}/100</strong></div>
                        <div class="pdf-kpi"><span>Durée planifiée</span><strong>${planning.totalDuration} mois</strong></div>
                        <div class="pdf-kpi"><span>Équipes</span><strong>${planning.teamCount}</strong></div>
                    </div>
                    <div class="pdf-columns" style="margin-top:10px;">
                        <div class="pdf-box">
                            <strong>Objectif opérationnel</strong>
                            <p>Déployer les pistes retenues dans un ordre pilotable, en respectant les contraintes de ressources et en rendant visibles les bénéfices sécurité attendus.</p>
                        </div>
                        <div class="pdf-box">
                            <strong>Gains attendus</strong>
                            <ul>
                                <li>${totalAccidents} accident(s) évité(s) par an</li>
                                <li>${this.formatCurrency(totalEconomies)} d'économies annuelles estimées</li>
                                <li>${averageRoi ? `${averageRoi} mois de retour moyen` : 'Retour sur investissement à confirmer action par action'}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section class="pdf-section">
                    <h2>2. Phasage du plan</h2>
                    <p>Lecture chef de projet : chaque période indique les actions à lancer, piloter ou finaliser, l'équipe responsable et les décisions à préparer.</p>
                    <div class="pdf-periods">
                        ${detailedPhasing.map(period => `
                            <div class="pdf-period">
                                <div class="pdf-period-head">
                                    <h3>${safe(period.label)}</h3>
                                    <div class="pdf-period-meta">
                                        ${period.actions.length} action(s)<br>
                                        Budget engagé : ${this.formatCurrency(period.budget)}
                                    </div>
                                </div>
                                ${period.actions.map(action => `
                                    <div class="pdf-period-action">
                                        <span>${safe(action.status)} - Équipe ${safe(action.teamId)} - Priorité ${safe(action.priority)}</span>
                                        <strong>${safe(action.text)}</strong>
                                        <p>${safe(action.detail)}</p>
                                    </div>
                                `).join('')}
                                ${period.decisions.length ? `
                                    <div class="pdf-period-decisions">
                                        <strong>Décisions / jalons de période :</strong>
                                        ${period.decisions.map(decision => safe(decision)).join(' ; ')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>

                <section class="pdf-section">
                    <h2>3. Calendrier de déploiement</h2>
                    ${this.renderPDFPlanTimeline(planning)}
                    <p>Durée séquentielle : ${planning.sequentialDuration} mois. Gain lié à la parallélisation : ${planning.savedMonths} mois.</p>
                </section>

                <section class="pdf-section">
                    <h2>4. Jalons de pilotage</h2>
                    ${milestones.map(milestone => `
                        <div class="pdf-milestone">
                            <strong>M${milestone.month}</strong>
                            <div><b>${safe(milestone.label)}</b><br><span>${safe(milestone.detail)}</span></div>
                        </div>
                    `).join('')}
                </section>

                <section class="pdf-section">
                    <h2>5. Récapitulatif des actions</h2>
                    <table class="pdf-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Action</th>
                                <th>Priorité</th>
                                <th>Budget</th>
                                <th>Durée</th>
                                <th>Impact</th>
                                <th>Point de pilotage</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pistes.map(piste => {
                                const priority = this.getTimelinePriorityStyle(piste).name;
                                const budget = this.formatCurrency(piste.budget?.cout_3_ans || 0);
                                const duration = Math.max(1, Math.round(Number(piste.delai_mois) || 1));
                                const pilotage = piste.relations?.length
                                    ? `${piste.relations.length} relation(s) à coordonner`
                                    : (piste.roi_mois ? `ROI estimé ${piste.roi_mois} mois` : 'Suivi avancement mensuel');
                                return `
                                    <tr>
                                        <td><strong>${safe(piste.numero || '')}</strong></td>
                                        <td>${safe(piste.titre || 'Sans titre')}</td>
                                        <td><span class="pdf-pill">${safe(priority)}</span></td>
                                        <td>${budget}</td>
                                        <td>${duration} mois</td>
                                        <td>${piste.impact_score || 0}/100</td>
                                        <td>${safe(pilotage)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </section>

                <section class="pdf-section">
                    <h2>6. Gouvernance et points de vigilance</h2>
                    <div class="pdf-columns">
                        <div class="pdf-box">
                            <strong>Priorisation</strong>
                            <ul>
                                <li>Critique : ${priorityStats.P1 || 0} action(s)</li>
                                <li>Haute : ${priorityStats.P2 || 0} action(s)</li>
                                <li>Moyenne : ${priorityStats.P3 || 0} action(s)</li>
                                <li>Basse : ${priorityStats.P4 || 0} action(s)</li>
                            </ul>
                        </div>
                        <div class="pdf-box">
                            <strong>Rituels projet recommandés</strong>
                            <ul>
                                <li>Comité projet mensuel : avancement, risques, arbitrages.</li>
                                <li>Revue budgétaire trimestrielle : consommé, reste à engager, écarts.</li>
                                <li>Mesure sécurité : accidents évités, adoption terrain, économies observées.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="pdf-signatures">
                        <div><strong>Sponsor</strong><br><br>Signature :</div>
                        <div><strong>Chef de projet</strong><br><br>Signature :</div>
                        <div><strong>Validation sécurité</strong><br><br>Signature :</div>
                    </div>
                </section>

                <div class="pdf-footer">Document généré automatiquement depuis le simulateur sécurité CDG - ${safe(configId)}</div>
            </div>
        `;
    },

    generatePrintableActionPlanHTML(simulation) {
        const title = Utils.escapeHtml(`Plan d'action - ${simulation?.name || 'Scénario en cours'}`);
        const styleOpen = '<' + 'style>';
        const styleClose = '</' + 'style>';
        const scriptOpen = '<' + 'script>';
        const scriptClose = '</' + 'script>';
        return `<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    ${styleOpen}
        @page { size: A4; margin: 12mm; }
        html, body { margin: 0; padding: 0; background: #f1f5f9; }
        body { display: flex; justify-content: center; }
        .pdf-action-plan { box-shadow: 0 20px 60px rgba(15, 23, 42, .16); margin: 24px 0; }
        .print-toolbar {
            position: fixed;
            top: 12px;
            right: 12px;
            display: flex;
            gap: 8px;
            z-index: 10;
        }
        .print-toolbar button {
            border: 0;
            border-radius: 6px;
            padding: 10px 14px;
            background: #003D82;
            color: #fff;
            font: 700 13px Arial, sans-serif;
            cursor: pointer;
        }
        .print-toolbar button.secondary { background: #475569; }
        @media print {
            html, body { background: #fff; display: block; }
            .print-toolbar { display: none; }
            .pdf-action-plan {
                width: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
            }
            .pdf-section { break-inside: avoid; }
            .pdf-table tr, .pdf-phase, .pdf-box, .pdf-kpi { break-inside: avoid; }
        }
    ${styleClose}
</head>
<body>
    <div class="print-toolbar">
        <button type="button" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
        <button type="button" class="secondary" onclick="window.close()">Fermer</button>
    </div>
    ${this.generateActionPlanPDFHTML(simulation)}
    ${scriptOpen}
        window.addEventListener('load', function () {
            setTimeout(function () { window.print(); }, 300);
        });
    ${scriptClose}
</body>
</html>`;
    },

    async exportPDF() {
        try {
            const selectedSim = this.getSelectedSimulationForExport();
            if (!selectedSim || !selectedSim.pistes.length) {
                if (window.Notifications) Notifications.warning('Aucun plan à exporter');
                return;
            }

            const documentHtml = this.generatePrintableActionPlanHTML(selectedSim);
            const blob = new Blob([documentHtml], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const printWindow = window.open(url, '_blank', 'noopener,noreferrer');

            if (!printWindow) {
                URL.revokeObjectURL(url);
                if (window.Notifications) {
                    Notifications.error('Ouverture bloquée par le navigateur. Autorisez les pop-ups puis réessayez.');
                }
                return;
            }

            if (window.Notifications) {
                Notifications.success('Plan ouvert dans un nouvel onglet. Utilisez Imprimer puis Enregistrer en PDF.');
            }

        } catch (error) {
            console.error('Erreur PDF:', error);
             
            if (window.Notifications) {
                Notifications.error('Erreur lors de la génération du PDF');
            }
        }
    },

    exportJSON() {
        const state = appStore.getState();
        const selectedSim = this.simulations.find(s => s.id === this.selectedSimulationId);
        
        const exportData = {
            generatedAt: new Date().toISOString(),
            simulation: {
                id: selectedSim.id,
                name: selectedSim.name,
                createdAt: selectedSim.createdAt
            },
            metrics: {
                totalBudget: selectedSim.pistes.reduce((sum, t) => sum + (t.budget?.cout_3_ans || 0), 0),
                averageImpact: selectedSim.pistes.length > 0 
                    ? Math.round(selectedSim.pistes.reduce((sum, t) => sum + (t.impact_score || 0), 0) / selectedSim.pistes.length)
                    : 0,
                totalAccidents: selectedSim.pistes.reduce((sum, t) => sum + (t.impact_accidents_evites || 0), 0),
                totalEconomies: selectedSim.pistes.reduce((sum, t) => sum + (t.impact_economies || 0), 0),
                planning: this.calculatePlanning(selectedSim.pistes, selectedSim)
            },
            tracks: selectedSim.pistes.map(t => ({
                numero: t.numero,
                titre: t.titre,
                priorite: t.priorite,
                categorie: t.categorie,
                budget: t.budget,
                impact_score: t.impact_score,
                delai_mois: t.delai_mois,
                roi_mois: t.roi_mois,
                dimensions: t.dimensions
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan-action-${this.selectedSimulationId}-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        if (window.Notifications) {
            Notifications.success('JSON exporté avec succès');
        }
    },

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    setupEventListeners() {
        console.log('Setup event listeners - Decide');
        
        // Ajouter un écouteur pour l'impression
        window.addEventListener('beforeprint', () => {
            // Préparer l'affichage pour l'impression
            document.querySelectorAll('.track-details').forEach(el => {
                el.style.display = 'block';
            });
        });
    },

    rerender() {
        this.render().then(html => {
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = html;
                this.setupEventListeners();
            }
        });
    }
};

window.pages = window.pages || {};
window.pages.Decide = pages.Decide;
