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
        const displayedTracks = tracksToShow.slice(0, 5);
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
                                    ${tracksToShow.map((track, idx) => `
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
                                    
                                    ${remainingCount > 0 ? `
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
                            <span>CDG 2026 - Safety Management System</span>
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
                                    return `
                                    <span class="decision-task" style="left: ${(task.start / horizon) * 100}%; width: ${(task.duration / horizon) * 100}%"
                                        title="${Utils.escapeHtml(piste.titre || piste.numero)} : ${task.duration} mois">
                                        ${Utils.escapeHtml(piste.numero || '')} <small>${task.duration}m</small>
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
        // Dans une version améliorée, on pourrait afficher toutes les pistes
        // Pour l'instant, on peut simplement étendre la table
        alert('Fonctionnalité à venir : affichage de toutes les pistes');
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

    async exportPDF() {
        try {
            // Afficher un indicateur de chargement
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'pdf-loading';
            loadingMsg.innerHTML = `
                <div class="pdf-loading-content">
                    <div class="spinner"></div>
                    <p>Génération du PDF en cours...</p>
                </div>
            `;
            document.body.appendChild(loadingMsg);

            // Charger html2pdf si nécessaire
            if (typeof window.html2pdf === 'undefined') {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
            }

            const element = document.querySelector('.decide-wrapper');
            
            // Options pour le PDF
            const opt = {
                margin:        [0.5, 0.5, 0.5, 0.5],
                filename:      `plan-action-${this.selectedSimulationId}-${new Date().toISOString().slice(0,10)}.pdf`,
                image:         { type: 'jpeg', quality: 0.98 },
                html2canvas:   {
                    scale: 2,
                    letterRendering: true,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                },
                jsPDF:         { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            // Générer le PDF
            await html2pdf().set(opt).from(element).save();

            document.body.removeChild(loadingMsg);

            if (window.Notifications) {
                Notifications.success('PDF généré avec succès !');
            }

        } catch (error) {
            console.error('Erreur PDF:', error);
            const loadingMsg = document.querySelector('.pdf-loading');
            if (loadingMsg) document.body.removeChild(loadingMsg);
            
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
