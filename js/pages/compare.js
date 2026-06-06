/**
 * PAGES/COMPARE.JS - Page de comparaison des scénarios (VERSION DYNAMIQUE AVEC RADARS)
 */

pages.Compare = {
    selectedScenarios: [], // IDs des scénarios sélectionnés
    knownScenarioIds: null,
    excludedScenarioIds: [],
    chartInstances: {},    // Stockage des instances de graphiques

    async render() {
        const state = appStore.getState();
        const allScenarios = this.getAvailableScenarios(state);
        this.syncScenarioSelection(allScenarios);

        return `
            <div class="compare-wrapper">
                <div class="compare-header">
                    <div>
                        <h1>
                            <span class="material-symbols-outlined">compare_arrows</span>
                            Comparaison des Scénarios
                        </h1>
                        <p class="header-subtitle">Sélectionnez les scénarios à comparer (2-4 recommandé)</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn-export" onclick="pages.Compare.exportToPDF()" ${this.selectedScenarios.length === 0 ? 'disabled' : ''}>
                            <span class="material-symbols-outlined">picture_as_pdf</span>
                            Exporter en PDF
                        </button>
                    </div>
                </div>

                <!-- Sélecteur de scénarios -->
                <div class="scenario-selector">
                    <h3>Scénarios disponibles</h3>
                    <div class="selector-grid">
                        ${allScenarios.map(scenario => `
                            <label class="scenario-checkbox ${scenario.isCurrent ? 'current' : ''}">
                                <input 
                                    type="checkbox" 
                                    value="${scenario.id}" 
                                    ${this.selectedScenarios.includes(scenario.id) ? 'checked' : ''}
                                    onchange="pages.Compare.toggleScenario('${scenario.id}')"
                                >
                                <div class="checkbox-content">
                                    <span class="scenario-name">${scenario.name}</span>
                                    <span class="scenario-count">${scenario.pistes.length} pistes</span>
                                    <span class="scenario-date">${new Date(scenario.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                    <div class="selection-info">
                        <span class="material-symbols-outlined">info</span>
                        <span>${this.selectedScenarios.length} scénario(s) sélectionné(s) pour comparaison</span>
                    </div>
                </div>

                <!-- Tableau de scoring comparatif -->
                <div class="scoring-table-container">
                    <h3>Tableau de scoring comparatif</h3>
                    <table class="scoring-table">
                        <thead>
                            <tr>
                                <th>Métrique</th>
                                ${allScenarios.filter(s => this.selectedScenarios.includes(s.id)).map(s => `
                                    <th class="scenario-header-cell">
                                        <div class="scenario-header-title">
                                            <span class="scenario-name">${s.name}</span>
                                            ${s.isCurrent ? '<span class="current-badge">Actuel</span>' : ''}
                                        </div>
                                    </th>
                                `).join('')}
                                <th class="best-score">Meilleur</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderScoringRows(allScenarios)}
                        </tbody>
                    </table>
                </div>

                <!-- Grille de comparaison avec radars -->
                <div class="compare-container" id="compare-content">
                    ${allScenarios.filter(s => this.selectedScenarios.includes(s.id)).map((scenario, idx) => {
                        const metrics = this.calculateDetailedMetrics(scenario.pistes);
                        const dimensions = this.calculateAggregatedDimensions(scenario.pistes);
                        return `
                            <div class="scenario-column ${scenario.isCurrent ? 'current' : ''}">
                                <div class="scenario-header">
                                    <div class="scenario-title">
                                        <h3>${scenario.name}</h3>
                                        ${scenario.isCurrent ? '<span class="badge-current">Actuel</span>' : ''}
                                    </div>
                                    <p class="scenario-date">Créé le ${new Date(scenario.createdAt).toLocaleDateString('fr-FR')}</p>
                                    <button class="btn-remove" onclick="pages.Compare.removeScenario('${scenario.id}')" title="Retirer de la comparaison">
                                        <span class="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                
                                <!-- Radar des dimensions -->
                                <div class="dimension-radar-container">
                                    <h4>Distribution dimensionnelle</h4>
                                    <canvas id="radar-${scenario.id}" width="250" height="250" class="dimension-radar"></canvas>
                                    <div class="dimension-legend">
                                        ${Object.entries(dimensions).map(([key, value]) => `
                                            <div class="legend-item">
                                                <span class="legend-color" style="background-color: ${this.getDimensionColor(key)}"></span>
                                                <span class="legend-label">${this.getDimensionLabel(key)}</span>
                                                <span class="legend-value">${Math.round(value)}%</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- KPIs principaux -->
                                <div class="scenario-metrics">
                                    ${metrics.map(metric => `
                                        <div class="metric-card" title="${metric.tooltip || ''}">
                                            <span class="metric-label">${metric.label}</span>
                                            <span class="metric-value ${metric.class}">${metric.value}</span>
                                            ${metric.trend ? `<span class="metric-trend ${metric.trendClass}">${metric.trend}</span>` : ''}
                                        </div>
                                    `).join('')}
                                </div>

                                ${this.renderScenarioTimeline(scenario)}

                                <!-- Liste des pistes -->
                                <div class="pistes-list">
                                    <h4>
                                        <span class="material-symbols-outlined">list</span>
                                        Pistes incluses (${scenario.pistes.length})
                                    </h4>
                                    <div class="pistes-scroll">
                                        ${scenario.pistes.map(p => `
                                            <div class="piste-item-compare" onclick="pages.Compare.viewPisteDetails('${p.numero}')">
                                                <span class="piste-id">${p.numero}</span>
                                                <span class="piste-title">${Utils.escapeHtml(p.titre || 'Sans titre')}</span>
                                                <span class="priority-dot priority-${this.getPriorityClass(p.priorite)}" title="Priorité ${Utils.getPriorityLabel(p.priorite)}"></span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>

                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Si aucun scénario sélectionné -->
                ${this.selectedScenarios.length === 0 ? `
                    <div class="no-selection">
                        <span class="material-symbols-outlined">info</span>
                        <h3>Aucun scénario sélectionné</h3>
                        <p>Cochez des scénarios ci-dessus pour les comparer.</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    getAvailableScenarios(state) {
        const scenarios = state.scenarios || [];
        return scenarios.length > 0 ? scenarios : this.getDefaultScenarios(state.allPistes || []);
    },

    isUserScenario(scenario) {
        const id = String(scenario?.id || '');
        return Boolean(id) && !['1', '2', '3'].includes(id) && !id.startsWith('default-');
    },

    syncScenarioSelection(allScenarios) {
        const ids = allScenarios.map(scenario => String(scenario.id));
        const availableIds = new Set(ids);
        this.selectedScenarios = this.selectedScenarios
            .map(String)
            .filter(id => availableIds.has(id));
        this.excludedScenarioIds = this.excludedScenarioIds.filter(id => availableIds.has(String(id)));

        if (this.knownScenarioIds === null) {
            const initial = allScenarios.slice(0, Math.min(3, allScenarios.length)).map(scenario => String(scenario.id));
            const userScenarios = allScenarios.filter(scenario => this.isUserScenario(scenario)).map(scenario => String(scenario.id));
            this.selectedScenarios = [...new Set([...initial, ...userScenarios])];
        } else {
            const knownIds = new Set(this.knownScenarioIds);
            const newUserScenarios = allScenarios
                .filter(scenario => !knownIds.has(String(scenario.id)) && this.isUserScenario(scenario))
                .map(scenario => String(scenario.id))
                .filter(id => !this.excludedScenarioIds.includes(id));
            this.selectedScenarios = [...new Set([...this.selectedScenarios, ...newUserScenarios])];
        }

        this.knownScenarioIds = ids;
    },

    renderScoringRows(allScenarios) {
        const selected = allScenarios.filter(s => this.selectedScenarios.includes(s.id));
        if (selected.length === 0) return '';

        const metrics = [
            { key: 'budget', label: 'Budget total', format: 'currency', higher: false },
            { key: 'impact', label: 'Impact moyen', format: 'number', higher: true, suffix: '/100' },
            { key: 'accidents', label: 'Accidents évités/an', format: 'number', higher: true },
            { key: 'pistes', label: 'Nombre de pistes', format: 'number', higher: false },
            { key: 'roi', label: 'Délai de retour moyen', format: 'months', higher: false },
            { key: 'planning', label: 'Durée totale planifiée', format: 'months', higher: false },
            { key: 'duree', label: 'Durée moyenne', format: 'months', higher: false },
            { key: 'equilibre', label: 'Équilibre dimensions', format: 'percent', higher: true }
        ];

        return metrics.map(metric => {
            const values = selected.map(s => this.getMetricValue(s.pistes, metric.key, s));
            const bestValue = metric.higher ? Math.max(...values) : Math.min(...values);
            
            return `
                <tr>
                    <td class="metric-label-cell">${metric.label}</td>
                    ${selected.map(s => {
                        const value = this.getMetricValue(s.pistes, metric.key, s);
                        const isBest = value === bestValue;
                        return `
                            <td class="metric-value-cell ${isBest ? 'best-value' : ''}">
                                ${this.formatMetricValue(value, metric.format)}
                                ${isBest ? '<span class="best-badge">Meilleur</span>' : ''}
                            </td>
                        `;
                    }).join('')}
                    <td class="best-score-cell">${this.formatMetricValue(bestValue, metric.format)}</td>
                </tr>
            `;
        }).join('');
    },

    getMetricValue(pistes, metricKey, scenario = {}) {
        switch(metricKey) {
            case 'budget':
                return pistes.reduce((sum, p) => sum + (p.budget?.cout_3_ans || 0), 0);
            case 'impact':
                return pistes.length > 0 
                    ? Math.round(pistes.reduce((sum, p) => sum + (p.impact_score || 0), 0) / pistes.length)
                    : 0;
            case 'accidents':
                return pistes.reduce((sum, p) => sum + (p.impact_accidents_evites || 0), 0);
            case 'pistes':
                return pistes.length;
            case 'roi':
                return pistes.length > 0
                    ? Math.round(pistes.reduce((sum, p) => sum + (p.roi_mois || 0), 0) / pistes.length)
                    : 0;
            case 'duree':
                return pistes.length > 0
                    ? Math.round(pistes.reduce((sum, p) => sum + (p.delai_mois || 0), 0) / pistes.length)
                    : 0;
            case 'planning':
                return this.calculatePlanning(pistes, scenario).totalDuration;
            case 'equilibre':
                const dims = this.calculateAggregatedDimensions(pistes);
                const values = Object.values(dims);
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
                const equilibre = Math.max(0, 100 - variance * 2);
                return Math.round(equilibre);
            default:
                return 0;
        }
    },

    formatMetricValue(value, format) {
        switch(format) {
            case 'currency':
                return Utils.formatCurrency(value);
            case 'months':
                return value + ' mois';
            case 'percent':
                return value + '%';
            default:
                return value.toString();
        }
    },

    calculateDetailedMetrics(pistes) {
        const totalBudget = pistes.reduce((sum, p) => sum + (p.budget?.cout_3_ans || 0), 0);
        const avgImpact = pistes.length > 0 
            ? Math.round(pistes.reduce((sum, p) => sum + (p.impact_score || 0), 0) / pistes.length)
            : 0;
        const totalAccidents = pistes.reduce((sum, p) => sum + (p.impact_accidents_evites || 0), 0);
        const totalEco = pistes.reduce((sum, p) => sum + (p.impact_economies || 0), 0);
        const avgRoi = pistes.length > 0
            ? Math.round(pistes.reduce((sum, p) => sum + (p.roi_mois || 0), 0) / pistes.length)
            : 0;
        const avgDuree = pistes.length > 0
            ? Math.round(pistes.reduce((sum, p) => sum + (p.delai_mois || 0), 0) / pistes.length)
            : 0;

        return [
            { 
                label: 'Budget total', 
                value: Utils.formatCurrency(totalBudget), 
                class: '',
                tooltip: 'Budget total sur 3 ans'
            },
            { 
                label: 'Impact moyen', 
                value: avgImpact + '/100', 
                class: 'impact',
                tooltip: 'Score d\'impact moyen des pistes'
            },
            { 
                label: 'Accidents évités', 
                value: totalAccidents, 
                class: 'success',
                tooltip: 'Nombre total d\'accidents évités par an'
            },
            { 
                label: 'Économies', 
                value: Utils.formatCurrency(totalEco), 
                class: 'success',
                tooltip: 'Économies annuelles estimées'
            },
            { 
                label: 'Délai de retour moyen', 
                value: avgRoi + ' mois', 
                class: '',
                tooltip: 'Retour sur investissement moyen'
            },
            { 
                label: 'Durée moyenne', 
                value: avgDuree + ' mois', 
                class: '',
                tooltip: 'Durée de déploiement moyenne'
            }
        ];
    },

    calculatePlanning(pistes, scenario = {}) {
        if (scenario.planning && Array.isArray(scenario.planning.teams)) return scenario.planning;
        const configuredTeams = scenario.constraints?.equipes?.value || 1;
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
    renderScenarioTimeline(scenario) {
        const planning = this.calculatePlanning(scenario.pistes, scenario);
        const horizon = Math.max(1, planning.totalDuration);
        return `
            <div class="compare-timeline">
                <div class="compare-timeline-header">
                    <h4>Calendrier de déploiement</h4>
                    <span>${planning.totalDuration} mois - ${planning.teamCount} équipe${planning.teamCount > 1 ? 's' : ''}</span>
                </div>
                <p>Gain vs séquentiel : <strong>${planning.savedMonths} mois</strong></p>
                ${planning.teams.map(team => `
                    <div class="compare-team-row">
                        <span>E${team.id}</span>
                        <div class="compare-team-track">
                            ${team.tasks.map(task => {
                                const piste = task.piste || task.track;
                                if (!piste) return '';
                                const style = this.getTimelinePriorityStyle(piste);
                                return `
                                <span class="compare-task timeline-task-priority" style="left: ${(task.start / horizon) * 100}%; width: ${(task.duration / horizon) * 100}%; background: ${style.bg}; border-left-color: ${style.text};">
                                    ${Utils.escapeHtml(piste.numero || '')}
                                    ${this.renderTimelineTaskTooltip(piste, task)}
                                </span>
                            `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderPDFScenarioTimeline(scenario) {
        const planning = this.calculatePlanning(scenario.pistes, scenario);
        const horizon = Math.max(1, planning.totalDuration);
        return `
            <div style="margin: 15px 0; padding: 12px; border: 1px solid #dbeafe; border-radius: 8px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 8px;">
                    <h4 style="margin: 0; font-size: 14px; color: #003D82;">Calendrier de déploiement</h4>
                    <span style="font-size: 12px; color: #475569;">${planning.totalDuration} mois - ${planning.teamCount} équipe${planning.teamCount > 1 ? 's' : ''}</span>
                </div>
                <p style="margin: 0 0 10px; font-size: 11px; color: #64748b;">
                    Séquentiel : ${planning.sequentialDuration} mois - Gain : <strong style="color: #047857;">${planning.savedMonths} mois</strong>
                </p>
                ${planning.teams.map((team, teamIndex) => `
                    <div style="display: grid; grid-template-columns: 28px 1fr; gap: 6px; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b;">E${team.id}</span>
                        <div style="height: 22px; position: relative; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                            ${(team.tasks || []).map((task, taskIndex) => {
                                const piste = task.piste || task.track;
                                if (!piste) return '';
                                const color = this.getTimelinePriorityStyle(piste).bg;
                                return `
                                    <span style="position: absolute; left: ${(task.start / horizon) * 100}%; width: ${(task.duration / horizon) * 100}%; top: 2px; height: 18px; box-sizing: border-box; padding: 2px 4px; overflow: hidden; border-radius: 3px; background: ${color}; color: white; font-size: 9px; font-weight: 700; -webkit-print-color-adjust: exact; print-color-adjust: exact;"
                                        title="${Utils.escapeHtml(piste.titre || piste.numero)}">${Utils.escapeHtml(piste.numero || '')}</span>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
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
        
        // Normaliser à 100%
        const total = Object.values(dims).reduce((a, b) => a + b, 0);
        if (total > 0) {
            Object.keys(dims).forEach(key => {
                dims[key] = (dims[key] / total) * 100;
            });
        }
        
        return dims;
    },

    toggleScenario(scenarioId) {
        const id = String(scenarioId);
        if (this.selectedScenarios.includes(id)) {
            this.selectedScenarios = this.selectedScenarios.filter(selectedId => selectedId !== id);
            if (!this.excludedScenarioIds.includes(id)) this.excludedScenarioIds.push(id);
        } else {
            this.selectedScenarios.push(id);
            this.excludedScenarioIds = this.excludedScenarioIds.filter(excludedId => excludedId !== id);
        }
        this.rerender();
    },

    removeScenario(scenarioId) {
        const id = String(scenarioId);
        this.selectedScenarios = this.selectedScenarios.filter(selectedId => selectedId !== id);
        if (!this.excludedScenarioIds.includes(id)) this.excludedScenarioIds.push(id);
        this.rerender();
    },

    viewPisteDetails(pisteId) {
        if (window.router) {
            window.router.navigate(`/piste-detail/${pisteId}`);
        }
    },

    duplicateScenario(scenarioId) {
        const state = appStore.getState();
        const scenarios = state.scenarios || [];
        const scenario = scenarios.find(s => s.id === scenarioId);
        
        if (scenario && window.appActions) {
            const newScenario = {
                ...scenario,
                id: 'scenario-' + Date.now(),
                name: scenario.name + ' (copie)',
                createdAt: new Date().toISOString()
            };
            appActions.addScenario(newScenario);
            
            if (window.Notifications) {
                Notifications.success('Scénario dupliqué avec succès');
            }
        }
    },

    editScenario(scenarioId) {
        // Navigation vers l'éditeur de scénario (à implémenter)
        console.log('Edit scenario:', scenarioId);
    },

    getDefaultScenarios(allPistes) {
        if (allPistes.length === 0) return [];

        return [
            {
                id: 'default-quick-wins',
                name: 'Quick Wins',
                pistes: allPistes.filter(p => p.priorite === 'P1').slice(0, 4),
                createdAt: new Date().toISOString()
            },
            {
                id: 'default-balanced',
                name: 'Équilibré',
                pistes: allPistes.filter(p => ['P1', 'P2'].includes(p.priorite)).slice(0, 6),
                createdAt: new Date().toISOString()
            },
            {
                id: 'default-impact-max',
                name: 'Impact Maximum',
                pistes: [...allPistes]
                    .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
                    .slice(0, 5),
                createdAt: new Date().toISOString()
            },
            {
                id: 'default-budget',
                name: 'Économique',
                pistes: [...allPistes]
                    .sort((a, b) => (a.budget?.cout_3_ans || 0) - (b.budget?.cout_3_ans || 0))
                    .slice(0, 8),
                createdAt: new Date().toISOString()
            }
        ];
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

    initRadarCharts() {
        if (!window.Chart) return;
        
        // Détruire les anciennes instances
        Object.values(this.chartInstances).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.chartInstances = {};
        
        const state = appStore.getState();
        const scenarios = state.scenarios || [];
        const currentScenario = state.currentScenario || [];
        
        let allScenarios = [];
        if (currentScenario.length > 0) {
            allScenarios.push({
                id: 'current',
                pistes: currentScenario
            });
        }
        allScenarios = [...allScenarios, ...scenarios];
        
        if (allScenarios.length === 0) {
            allScenarios = this.getDefaultScenarios(state.allPistes || []);
        }
        
        allScenarios.filter(s => this.selectedScenarios.includes(s.id)).forEach(scenario => {
            const canvas = document.getElementById(`radar-${scenario.id}`);
            if (!canvas) return;
            
            const dimensions = this.calculateAggregatedDimensions(scenario.pistes);
            const ctx = canvas.getContext('2d');
            
            this.chartInstances[scenario.id] = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['CULTURE', 'TECH', 'HUMAIN', 'ORG', 'ECO'],
                    datasets: [{
                        label: 'Distribution',
                        data: [
                            dimensions.culture || 0,
                            dimensions.technique || 0,
                            dimensions.humain || 0,
                            dimensions.organisationnel || 0,
                            dimensions.economique || 0
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
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: context => context.raw.toFixed(1) + '%'
                            }
                        }
                    }
                }
            });
        });
    },

    async loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    async exportToPDF() {
        try {
            // Vérifier qu'il y a des scénarios sélectionnés
            if (this.selectedScenarios.length === 0) {
                if (window.Notifications) {
                    Notifications.warning('Aucun scénario sélectionné à exporter');
                }
                return;
            }

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

            // Vérifier si html2pdf est chargé, sinon le charger dynamiquement
            if (typeof window.html2pdf === 'undefined') {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
            }

            // Récupérer les éléments à exporter
            const state = appStore.getState();
            const allScenariosList = this.getAvailableScenarios(state);
            const selectedScenariosData = allScenariosList.filter(s => this.selectedScenarios.includes(String(s.id)));

            // Créer un conteneur temporaire pour le PDF
            const pdfContainer = document.createElement('div');
            pdfContainer.className = 'pdf-export-container';
            pdfContainer.style.padding = '20px';
            pdfContainer.style.fontFamily = 'Public Sans, sans-serif';
            pdfContainer.style.background = 'white';

            // Titre du PDF
            pdfContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #003D82; font-size: 24px; margin-bottom: 8px;">Comparaison des Scénarios</h1>
                    <p style="color: #64748b; font-size: 14px;">Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #1e293b; font-size: 18px; border-bottom: 2px solid #FF6B35; padding-bottom: 8px;">Scénarios comparés</h2>
                    <ul style="list-style: none; padding: 0;">
                        ${selectedScenariosData.map(s => `
                            <li style="margin: 8px 0; padding: 8px; background: #f8fafc; border-radius: 6px;">
                                <strong style="color: #FF6B35;">${s.name}</strong> - ${s.pistes.length} pistes
                                ${s.isCurrent ? ' <span style="background: #003D82; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Actuel</span>' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="color: #1e293b; font-size: 18px; border-bottom: 2px solid #FF6B35; padding-bottom: 8px;">Tableau de scoring</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 10px; text-align: left; border: 1px solid #e2e8f0;">Métrique</th>
                                ${selectedScenariosData.map(s => `
                                    <th style="padding: 10px; text-align: center; border: 1px solid #e2e8f0;">${s.name}</th>
                                `).join('')}
                                <th style="padding: 10px; text-align: center; border: 1px solid #e2e8f0;">Meilleur</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderPDFScoringRows(selectedScenariosData)}
                        </tbody>
                    </table>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="color: #1e293b; font-size: 18px; border-bottom: 2px solid #FF6B35; padding-bottom: 8px;">Détail des scénarios</h2>
                    ${selectedScenariosData.map(s => {
                        const metrics = this.calculateDetailedMetrics(s.pistes);
                        const dimensions = this.calculateAggregatedDimensions(s.pistes);
                        return `
                            <div style="margin-bottom: 30px; page-break-inside: avoid;">
                                <h3 style="color: #FF6B35; font-size: 16px; margin-bottom: 12px;">${s.name}</h3>
                                
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                                    ${metrics.map(m => `
                                        <div style="background: #f8fafc; padding: 10px; border-radius: 6px;">
                                            <div style="font-size: 11px; color: #64748b;">${m.label}</div>
                                            <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${m.value}</div>
                                        </div>
                                    `).join('')}
                                </div>

                                ${this.renderPDFScenarioTimeline(s)}
                                
                                <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                                    <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #475569;">Distribution dimensionnelle</h4>
                                    <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                                        ${Object.entries(dimensions).map(([key, value]) => `
                                            <div style="flex: 1; min-width: 100px;">
                                                <div style="font-size: 11px; color: #64748b;">${this.getDimensionLabel(key)}</div>
                                                <div style="height: 6px; background: #e2e8f0; border-radius: 3px; margin: 5px 0;">
                                                    <div style="height: 100%; width: ${value}%; background: ${this.getDimensionColor(key)}; border-radius: 3px;"></div>
                                                </div>
                                                <div style="font-size: 12px; font-weight: 600; color: #1e293b;">${Math.round(value)}%</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div style="margin-top: 15px;">
                                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">Pistes incluses (${s.pistes.length})</h4>
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        ${s.pistes.slice(0, 10).map(p => `
                                            <li style="padding: 6px; border-bottom: 1px solid #f1f5f9; display: flex; gap: 8px;">
                                                <span style="font-family: monospace; color: #FF6B35; min-width: 45px;">${p.numero}</span>
                                                <span style="color: #334155;">${Utils.escapeHtml(p.titre || 'Sans titre')}</span>
                                                <span style="margin-left: auto; width: 8px; height: 8px; border-radius: 50%; background: ${this.getPriorityColor(p.priorite)};"></span>
                                            </li>
                                        `).join('')}
                                        ${s.pistes.length > 10 ? `<li style="padding: 6px; color: #64748b; font-style: italic;">... et ${s.pistes.length - 10} autres pistes</li>` : ''}
                                    </ul>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div style="text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p>Document généré automatiquement - Safety Management System</p>
                </div>
            `;

            // Ajouter au body temporairement
            document.body.appendChild(pdfContainer);

            // Options pour le PDF
            const opt = {
                margin:        [0.5, 0.5, 0.5, 0.5],
                filename:      `comparaison-scenarios-${new Date().toISOString().slice(0,10)}.pdf`,
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
            await html2pdf().set(opt).from(pdfContainer).save();

            // Nettoyer
            document.body.removeChild(pdfContainer);
            document.body.removeChild(loadingMsg);

            if (window.Notifications) {
                Notifications.success('PDF généré avec succès !');
            }

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            
            const loadingMsg = document.querySelector('.pdf-loading');
            if (loadingMsg) document.body.removeChild(loadingMsg);

            if (window.Notifications) {
                Notifications.error('Erreur lors de la génération du PDF');
            } else {
                alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
            }
        }
    },

    renderPDFScoringRows(selectedScenarios) {
        const metrics = [
            { key: 'budget', label: 'Budget total', format: 'currency', higher: false },
            { key: 'impact', label: 'Impact moyen', format: 'number', higher: true, suffix: '/100' },
            { key: 'accidents', label: 'Accidents évités/an', format: 'number', higher: true },
            { key: 'pistes', label: 'Nombre de pistes', format: 'number', higher: false },
            { key: 'roi', label: 'Délai de retour moyen', format: 'months', higher: false },
            { key: 'planning', label: 'Durée totale planifiée', format: 'months', higher: false },
            { key: 'duree', label: 'Durée moyenne', format: 'months', higher: false },
            { key: 'equilibre', label: 'Équilibre dimensions', format: 'percent', higher: true }
        ];

        return metrics.map(metric => {
            const values = selectedScenarios.map(s => this.getMetricValue(s.pistes, metric.key, s));
            const bestValue = metric.higher ? Math.max(...values) : Math.min(...values);
            
            return `
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 500;">${metric.label}</td>
                    ${selectedScenarios.map(s => {
                        const value = this.getMetricValue(s.pistes, metric.key, s);
                        const isBest = value === bestValue;
                        return `
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; ${isBest ? 'background: #f0fdf4; font-weight: 600;' : ''}">
                                ${this.formatMetricValue(value, metric.format)}
                                ${isBest ? ' ★' : ''}
                            </td>
                        `;
                    }).join('')}
                    <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: 700; background: #eff6ff; color: #003D82;">
                        ${this.formatMetricValue(bestValue, metric.format)}
                    </td>
                </tr>
            `;
        }).join('');
    },

    getPriorityColor(priority) {
        const colors = { 'P1': '#dc2626', 'P2': '#f97316', 'P3': '#eab308', 'P4': '#3b82f6' };
        return colors[priority] || '#94a3b8';
    },

    rerender() {
        this.render().then(html => {
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = html;
                setTimeout(() => this.initRadarCharts(), 100);
            }
        });
    },

    setup() {
        setTimeout(() => this.initRadarCharts(), 100);
    }
};

// Exporter pour usage global
window.pages = window.pages || {};
window.pages.Compare = pages.Compare;
