/**
 * PAGES/SIMULATE.JS - Page de simulation des scénarios avec gestion CRUD
 * AJOUT: Boutons pour visualiser le détail du scénario
 */

pages.Simulate = {
    currentScenario: {
        id: null,
        name: 'Nouveau scénario',
        tracks: [],
        createdAt: new Date().toISOString()
    },
    scenarios: [],

    async render() {
        // Charger les pistes depuis appStore
        const state = appStore ? appStore.getState() : {};
        let allPistes = state.allPistes || [];
        
        // Charger les scénarios depuis le store
        this.scenarios = state.scenarios || [];
        
        console.log('🔍 Simulate render - allPistes count:', allPistes.length);
        console.log('🔍 Scénarios chargés:', this.scenarios.length);
        
        // Récupérer le scénario courant
        const currentTracks = state.currentScenario || [];
        this.currentScenario.tracks = currentTracks;
        
        // IMPORTANT: Vérifier si un ID de scénario est stocké dans le state
        if (state.currentScenarioId) {
            const selectedScenario = this.scenarios.find(s => s.id === state.currentScenarioId);
            if (selectedScenario) {
                this.currentScenario.id = selectedScenario.id;
                this.currentScenario.name = selectedScenario.name;
                this.currentScenario.createdAt = selectedScenario.createdAt;
            }
        } else if (currentTracks.length > 0 && !this.currentScenario.id) {
            this.currentScenario.name = 'Scénario en cours';
        }
        
        // Calculer les métriques
        const totalBudget = currentTracks.reduce((sum, t) => sum + (t.budget?.cout_3_ans || 0), 0);
        const totalImpact = currentTracks.reduce((sum, t) => sum + (t.impact_score || 0), 0);
        const avgRoi = currentTracks.length > 0 
            ? Math.round(currentTracks.reduce((sum, t) => sum + (t.roi_mois || 0), 0) / currentTracks.length) 
            : 0;
        const teamCount = this.getTeamCount(state);
        const planning = this.calculatePlanning(currentTracks, teamCount);

        // Créer map des pistes sélectionnées
        const selectedMap = new Set(currentTracks.map(t => t.numero));

        // Générer HTML des pistes
        let pistesList = this.renderPistesList(allPistes, selectedMap);

        return `
            <div class="simulate-wrapper">
                <!-- Barre d'en-tête avec gestion CRUD -->
                <div class="simulate-header">
                    <div class="scenario-crud">
                        <label class="scenario-label">SCÉNARIO</label>
                        <div class="scenario-selector">
                            <select id="scenario-select" class="scenario-select" onchange="pages.Simulate.loadSelectedScenario(this.value)">
                                <option value="">-- Nouveau scénario --</option>
                                ${this.renderScenarioOptions()}
                            </select>
                            
                            <div class="scenario-actions">
                                <button class="crud-btn save-btn" onclick="pages.Simulate.saveCurrentScenario()" title="Sauvegarder">
                                    <span class="material-symbols-outlined">save</span>
                                </button>
                                <button class="crud-btn new-btn" onclick="pages.Simulate.createNewScenario()" title="Nouveau scénario">
                                    <span class="material-symbols-outlined">add_circle</span>
                                </button>
                                <button class="crud-btn delete-btn" onclick="pages.Simulate.deleteCurrentScenario()" title="Supprimer">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                                <button class="crud-btn duplicate-btn" onclick="pages.Simulate.duplicateScenario()" title="Dupliquer">
                                    <span class="material-symbols-outlined">content_copy</span>
                                </button>
                                <button class="crud-btn simulator-btn" onclick="pages.Simulate.openSimulateur()" title="Ouvrir le simulateur">
                                    <span class="material-symbols-outlined">tune</span>
                                </button>
                                <button class="crud-btn view-detail-btn" onclick="pages.Simulate.viewScenarioDetail()" title="Voir le détail du scénario" ${!this.currentScenario.id && this.currentScenario.tracks.length === 0 ? 'disabled' : ''}>
                                    <span class="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="scenario-name-display">
                            <span id="current-scenario-name" class="scenario-name">${Utils.escapeHtml(this.currentScenario.name)}</span>
                            <button class="edit-name-btn" onclick="pages.Simulate.editScenarioName()">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                        </div>

                        <div class="scenario-capacity scenario-capacity-header">
                            <label for="scenario-teams">
                                <span class="material-symbols-outlined">groups</span>
                                Nombre d'équipes mobilisables
                            </label>
                            <select id="scenario-teams" onchange="pages.Simulate.updateTeamCount(this.value)">
                                ${[1, 2, 3, 4, 5].map(count => `
                                    <option value="${count}" ${count === teamCount ? 'selected' : ''}>${count} équipe${count > 1 ? 's' : ''}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        ${this.currentScenario.id ? `
                            <div class="scenario-meta">
                                <span class="scenario-id">ID: ${this.currentScenario.id}</span>
                                <span class="scenario-date">Créé: ${new Date(this.currentScenario.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                </div>

                <main class="simulate-main">
                    <!-- Métriques principales -->
                    <div class="metrics-grid">
                        ${this.renderMetrics(currentTracks, totalBudget, totalImpact, avgRoi)}
                    </div>

                    <div class="simulate-content">
                        <!-- Section Pistes Disponibles -->
                        <div class="tracks-section">
                            <div class="section-header">
                                <h2>Pistes Disponibles</h2>
                                <span class="track-count">${allPistes.length} Pistes</span>
                                <div class="section-controls">
                                    <button class="control-btn" onclick="pages.Simulate.selectAll()">
                                        <span class="material-symbols-outlined">done_all</span>
                                        Tout sélectionner
                                    </button>
                                    <button class="control-btn" onclick="pages.Simulate.deselectAll()">
                                        <span class="material-symbols-outlined">clear_all</span>
                                        Tout désélectionner
                                    </button>
                                </div>
                            </div>

                            <div class="tracks-list">
                                ${pistesList}
                            </div>
                        </div>

                        <!-- Section Résumé du Scénario -->
                        <div class="scenario-summary">
                            <h3 class="section-title">Résumé du scénario</h3>
                             
                            <div class="summary-stats">
                                <div class="summary-stat">
                                    <span class="summary-stat-label">Pistes sélectionnées</span>
                                    <span class="summary-stat-value">${currentTracks.length}</span>
                                </div>
                                <div class="summary-stat">
                                    <span class="summary-stat-label">Budget total</span>
                                    <span class="summary-stat-value">${this.formatBudget(totalBudget)}</span>
                                </div>
                                <div class="summary-stat">
                                    <span class="summary-stat-label">Impact moyen</span>
                                    <span class="summary-stat-value">${Math.round(totalImpact / (currentTracks.length || 1))}%</span>
                                </div>
                                <div class="summary-stat">
                                    <span class="summary-stat-label">Délai de retour moyen</span>
                                    <span class="summary-stat-value">${avgRoi} mois</span>
                                </div>
                                <div class="summary-stat">
                                    <span class="summary-stat-label">Durée planifiée</span>
                                    <span class="summary-stat-value">${planning.totalDuration} mois</span>
                                </div>
                                <div class="summary-stat">
                                    <span class="summary-stat-label">Gain parallèle</span>
                                    <span class="summary-stat-value">${planning.savedMonths} mois</span>
                                </div>
                            </div>

                            ${currentTracks.length > 0 ? this.renderPlanningTimeline(planning) : ''}
                            
                            <div class="selected-tracks-list">
                                <h4>Pistes sélectionnées (${currentTracks.length})</h4>
                                ${currentTracks.length > 0 ? `
                                    <ul class="selected-tracks">
                                        ${currentTracks.map(track => `
                                            <li class="selected-track-item">
                                                <span class="selected-track-id">${track.numero}</span>
                                                <span class="selected-track-title">${Utils.escapeHtml(track.titre)}</span>
                                                <button class="remove-track-btn" onclick="pages.Simulate.togglePiste('${track.numero}')" title="Retirer">
                                                    <span class="material-symbols-outlined">close</span>
                                                </button>
                                            </li>
                                        `).join('')}
                                    </ul>
                                ` : `
                                    <p class="no-tracks">Aucune piste sélectionnée</p>
                                `}
                            </div>
                            
                            <div class="summary-actions">
                                <button class="btn-clear" onclick="pages.Simulate.clearScenario()">
                                    <span class="material-symbols-outlined">delete_sweep</span>
                                    Vider
                                </button>
                                <button class="btn-save-summary" onclick="pages.Simulate.saveCurrentScenario()">
                                    <span class="material-symbols-outlined">save</span>
                                    Enregistrer
                                </button>
                                <!-- NOUVEAU BOUTON: Visualiser le détail -->
                                <button class="btn-view-detail" onclick="pages.Simulate.viewScenarioDetail()" ${!this.currentScenario.id && this.currentScenario.tracks.length === 0 ? 'disabled' : ''}>
                                    <span class="material-symbols-outlined">visibility</span>
                                    Voir le détail
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <!-- Modal de confirmation pour la suppression -->
            <div id="delete-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <h3>Confirmer la suppression</h3>
                    <p>Êtes-vous sûr de vouloir supprimer le scénario "<span id="delete-scenario-name"></span>" ?</p>
                    <div class="modal-actions">
                        <button class="btn-cancel" onclick="pages.Simulate.hideDeleteModal()">Annuler</button>
                        <button class="btn-confirm-delete" onclick="pages.Simulate.confirmDelete()">Supprimer</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderPistesList(allPistes, selectedMap) {
        if (allPistes.length === 0) {
            return `
                <div class="empty-state">
                    <span class="material-symbols-outlined empty-icon">inventory_2</span>
                    <p>Aucune piste disponible</p>
                    <p class="empty-hint">Les pistes se chargeront automatiquement</p>
                </div>
            `;
        }

        return allPistes.map(piste => {
            const isSelected = selectedMap.has(piste.numero);
            const priorityColor = this.getPriorityColor(piste.priorite);
            const budget = piste.budget?.cout_3_ans || 0;
            const impact = piste.impact_score || 0;
            
            return `
                <div class="piste-item ${isSelected ? 'selected' : ''}" onclick="pages.Simulate.togglePiste('${piste.numero}')">
                    <div class="piste-checkbox-wrapper">
                        <input type="checkbox" 
                               class="piste-checkbox" 
                               data-piste-id="${piste.numero}"
                               ${isSelected ? 'checked' : ''}
                               onchange="event.stopPropagation(); pages.Simulate.togglePiste('${piste.numero}')">
                        <label class="checkbox-label"></label>
                    </div>
                    <div class="piste-info">
                        <div class="piste-header">
                            <span class="priority-badge priority-${priorityColor}">${Utils.getPriorityLabel(piste.priorite)}</span>
                            <h3 class="piste-title">${Utils.escapeHtml(piste.titre || 'Sans titre')}</h3>
                        </div>
                        <p class="piste-description">${Utils.escapeHtml(piste.description || '')}</p>
                        <div class="piste-meta">
                            <span class="meta-item">
                                <span class="material-symbols-outlined">category</span>
                                ${Utils.escapeHtml(piste.categorie || 'N/A')}
                            </span>
                        </div>
                    </div>
                    <div class="piste-stats">
                        <div class="stat">
                            <span class="stat-label">BUDGET</span>
                            <span class="stat-value">${window.Utils ? Utils.formatCurrency(budget) : this.formatBudget(budget)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">IMPACT</span>
                            <span class="stat-value impact">${impact}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderScenarioOptions() {
        if (!this.scenarios || this.scenarios.length === 0) {
            return '<option value="" disabled>Aucun scénario sauvegardé</option>';
        }
        
        return this.scenarios.map(scenario => {
            // CORRECTION: Vérifier si l'ID correspond au scénario courant
            const selected = scenario.id === this.currentScenario.id ? 'selected' : '';
            const date = new Date(scenario.createdAt).toLocaleDateString('fr-FR');
            const trackCount = scenario.pistes ? scenario.pistes.length : 0;
            return `<option value="${scenario.id}" ${selected}>${scenario.name} (${trackCount} pistes - ${date})</option>`;
        }).join('');
    },

    renderMetrics(currentTracks, totalBudget, totalImpact, avgRoi) {
        const reduction = currentTracks.length > 0 
            ? Math.min(100, Math.round(totalImpact / currentTracks.length * 0.8)) 
            : 0;
        
        return `
            <div class="metric-card">
                <div class="metric-header">
                    <span class="material-symbols-outlined metric-icon">trending_down</span>
                    <span class="metric-label">RÉDUCTION ACCIDENTS</span>
                </div>
                <div class="metric-value">-${reduction}%</div>
                <div class="metric-subtitle">Objectif: -50% en 2028</div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <span class="material-symbols-outlined metric-icon">payments</span>
                    <span class="metric-label">BUDGET TOTAL</span>
                </div>
                <div class="metric-value">${this.formatBudget(totalBudget)}</div>
                <div class="metric-subtitle">Sur 3 ans (2026-2028)</div>
            </div>

            <div class="metric-card">
                <div class="metric-header">
                    <span class="material-symbols-outlined metric-icon">trending_up</span>
                    <span class="metric-label">DÉLAI DE RETOUR MOYEN</span>
                </div>
                <div class="metric-value">${avgRoi} mois</div>
                <div class="metric-subtitle">Retour sur investissement</div>
            </div>
        `;
    },

    getTeamCount(state = appStore ? appStore.getState() : {}) {
        return Math.max(1, Math.min(5, Math.round(Number(state.currentScenarioConstraints?.equipes?.value) || 1)));
    },

    calculatePlanning(tracks, teamCount = 1) {
        const teams = Array.from({ length: teamCount }, (_, index) => ({ id: index + 1, availableAt: 0, tasks: [] }));
        const tasks = [...tracks]
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
            <div class="scenario-planning-editor">
                <div class="editor-planning-title">
                    <strong>Calendrier de déploiement</strong>
                    <span>${planning.sequentialDuration} mois séquentiels / ${planning.totalDuration} mois planifiés</span>
                </div>
                ${planning.teams.map(team => `
                    <div class="editor-team-row">
                        <span>E${team.id}</span>
                        <div class="editor-team-track">
                            ${team.tasks.map(task => {
                                const piste = task.piste || task.track;
                                if (!piste) return '';
                                return `
                                <span class="editor-task" style="left: ${(task.start / horizon) * 100}%; width: ${(task.duration / horizon) * 100}%"
                                    title="${Utils.escapeHtml(piste.titre || piste.numero)} : ${task.duration} mois">
                                    ${Utils.escapeHtml(piste.numero || '')}
                                </span>
                            `;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
                <p>Hypothèse : les pistes sont parallélisables sans dépendances.</p>
            </div>
        `;
    },

    updateTeamCount(value) {
        const teamCount = Math.max(1, Math.min(5, Math.round(Number(value) || 1)));
        const tracks = appStore ? appStore.getValue('currentScenario') || [] : this.currentScenario.tracks;
        const planning = this.calculatePlanning(tracks, teamCount);
        if (appStore) {
            appStore.setState({
                currentScenarioConstraints: { equipes: { enabled: true, value: teamCount, max: 5 } },
                currentScenarioPlanning: planning
            });
        }
        this.rerender();
    },

    syncCurrentPlanning() {
        const tracks = appStore ? appStore.getValue('currentScenario') || [] : this.currentScenario.tracks;
        const teamCount = this.getTeamCount();
        const planning = this.calculatePlanning(tracks, teamCount);
        if (appStore) {
            appStore.setState({
                currentScenarioConstraints: { equipes: { enabled: true, value: teamCount, max: 5 } },
                currentScenarioPlanning: planning
            });
        }
        return planning;
    },

    formatBudget(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(2) + ' M€';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + ' k€';
        } else {
            return amount + ' €';
        }
    },

    getPriorityColor(priority) {
        const colors = { 'P1': 'red', 'P2': 'orange', 'P3': 'yellow', 'P4': 'blue' };
        return colors[priority] || 'slate';
    },

    // ================ FONCTIONS CRUD ================

    // NOUVELLE FONCTION: Visualiser le détail du scénario
    viewScenarioDetail() {
        // Vérifier si un scénario est sélectionné
        if (!this.currentScenario.id && this.currentScenario.tracks.length === 0) {
            if (window.Notifications) {
                Notifications.warning('Aucun scénario à visualiser');
            }
            return;
        }

        // Si le scénario a un ID (sauvegardé), utiliser cet ID
        if (this.currentScenario.id) {
            console.log('👁️ Visualisation du scénario:', this.currentScenario.id);
            if (window.router) {
                router.navigate(`/scenario-detail/${this.currentScenario.id}`);
            }
        } else {
            // Sinon, créer un scénario temporaire pour la visualisation
            // On peut soit demander à sauvegarder d'abord, soit créer un ID temporaire
            if (confirm('Ce scénario n\'est pas sauvegardé. Voulez-vous le sauvegarder d\'abord avant de voir le détail ?')) {
                this.saveCurrentScenario();
                // La redirection se fera après la sauvegarde dans le setTimeout
            } else {
                // Option: créer un ID temporaire basé sur le timestamp
                const tempId = 'temp_' + Date.now();
                const tempScenario = {
                    id: tempId,
                    name: this.currentScenario.name,
                    pistes: this.currentScenario.tracks,
                    createdAt: new Date().toISOString(),
                    planning: this.syncCurrentPlanning(),
                    constraints: appStore?.getValue?.('currentScenarioConstraints') || null
                };
                
                // Sauvegarder temporairement dans le store ou localStorage
                // Pour l'exemple, on va simplement naviguer avec les données dans l'URL
                console.log('👁️ Visualisation d\'un scénario temporaire');
                
                if (window.router) {
                    // On pourrait passer les données en paramètre, mais c'est plus simple
                    // de naviguer vers la page avec l'ID temporaire et de stocker les données
                    // dans une variable globale temporaire
                    window.__tempScenario = tempScenario;
                    router.navigate(`/scenario-detail/${tempId}`);
                }
            }
        }
    },

    openSimulateur() {
        const state = appStore ? appStore.getState() : {};
        const currentTracks = this.currentScenario.tracks || state.currentScenario || [];

        if (window.appStore) {
            appStore.setState({
                currentScenario: currentTracks,
                currentScenarioId: this.currentScenario.id || state.currentScenarioId || null
            });
        }

        if (window.router) {
            router.navigate('/simulateur');
        }
    },

    async loadSelectedScenario(scenarioId) {
        if (!scenarioId) {
            this.createNewScenario();
            return;
        }
        
        console.log('📂 Chargement du scénario:', scenarioId);
        
        if (appActions && appActions.loadScenario) {
            appActions.loadScenario(scenarioId);
            
            // Mettre à jour l'affichage après un court délai
            setTimeout(() => {
                // Recharger l'état depuis le store
                const state = appStore.getState();
                this.scenarios = state.scenarios || [];
                
                // Trouver le scénario chargé
                const loadedScenario = this.scenarios.find(s => s.id === scenarioId);
                if (loadedScenario) {
                    this.currentScenario.id = loadedScenario.id;
                    this.currentScenario.name = loadedScenario.name;
                    this.currentScenario.createdAt = loadedScenario.createdAt;
                    this.currentScenario.tracks = state.currentScenario || [];
                }
                
                this.rerender();
            }, 100);
        }
    },

    saveCurrentScenario() {
        const tracks = appStore ? appStore.getValue('currentScenario') : [];
        
        if (tracks.length === 0) {
            if (window.Notifications) {
                Notifications.warning('Ajoutez au moins une piste avant de sauvegarder');
            } else {
                alert('Ajoutez au moins une piste avant de sauvegarder');
            }
            return;
        }
        this.syncCurrentPlanning();
        
        let scenarioName = this.currentScenario.name;
        
        // Si c'est un scénario temporaire, demander un nom
        if (!this.currentScenario.id || this.currentScenario.name === 'Scénario en cours' || this.currentScenario.name === 'Nouveau scénario') {
            scenarioName = prompt('Nom du scénario:', 'Mon scénario');
            if (!scenarioName) return;
        }
        
        if (appActions && appActions.saveScenario) {
            const savedScenario = appActions.saveScenario(scenarioName, this.currentScenario.id || null);
            const state = appStore.getState();
            this.scenarios = state.scenarios || [];

            if (savedScenario) {
                this.currentScenario.id = savedScenario.id;
                this.currentScenario.name = savedScenario.name;
                this.currentScenario.createdAt = savedScenario.createdAt;
            }

            this.rerender();

            if (window.Notifications) {
                Notifications.success(this.currentScenario.id ? 'Scénario enregistré' : 'Scénario sauvegardé');
            }
        }
    },

    createNewScenario() {
        console.log('➕ Création d\'un nouveau scénario');
        
        if (appActions && appActions.clearScenario) {
            appActions.clearScenario(true);
        }
        if (appStore) {
            appStore.setState({
                currentScenarioPlanning: null,
                currentScenarioConstraints: { equipes: { enabled: true, value: 1, max: 5 } }
            });
        }
        
        this.currentScenario = {
            id: null,
            name: 'Nouveau scénario',
            tracks: [],
            createdAt: new Date().toISOString()
        };
        
        this.rerender();
        
        if (window.Notifications) {
            Notifications.info('Nouveau scénario créé');
        }
    },

    deleteCurrentScenario() {
        if (!this.currentScenario.id) {
            if (window.Notifications) {
                Notifications.warning('Aucun scénario à supprimer');
            }
            return;
        }
        
        // Afficher la modale de confirmation
        const modal = document.getElementById('delete-modal');
        const nameSpan = document.getElementById('delete-scenario-name');
        if (modal && nameSpan) {
            nameSpan.textContent = this.currentScenario.name;
            modal.style.display = 'flex';
        }
    },

    confirmDelete() {
        const scenarioId = this.currentScenario.id;
        
        if (!scenarioId) {
            this.hideDeleteModal();
            return;
        }
        
        console.log('🗑️ Suppression du scénario:', scenarioId);
        
        if (appActions && appActions.deleteScenario) {
            appActions.deleteScenario(scenarioId);
            
            // Mettre à jour la liste
            setTimeout(() => {
                const state = appStore.getState();
                this.scenarios = state.scenarios || [];
                
                // Créer un nouveau scénario vide
                this.createNewScenario();
                
                this.hideDeleteModal();
                
                if (window.Notifications) {
                    Notifications.success('Scénario supprimé');
                }
            }, 100);
        } else {
            this.hideDeleteModal();
        }
    },

    hideDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) modal.style.display = 'none';
    },

    duplicateScenario() {
        if (!this.currentScenario.id && this.currentScenario.tracks.length === 0) {
            if (window.Notifications) {
                Notifications.warning('Aucun scénario à dupliquer');
            }
            return;
        }
        
        const newName = prompt('Nom du scénario dupliqué:', this.currentScenario.name + ' (copie)');
        if (!newName) return;
        
        console.log('📋 Duplication du scénario:', this.currentScenario.name);
        
        // Sauvegarder comme nouveau scénario
        if (appActions && appActions.saveScenario) {
            this.syncCurrentPlanning();
            appActions.saveScenario(newName);
            
            setTimeout(() => {
                const state = appStore.getState();
                this.scenarios = state.scenarios || [];
                
                // Trouver le nouveau scénario
                const newScenario = this.scenarios[this.scenarios.length - 1];
                if (newScenario) {
                    this.currentScenario.id = newScenario.id;
                    this.currentScenario.name = newScenario.name;
                    this.currentScenario.createdAt = newScenario.createdAt;
                }
                
                this.rerender();
                
                if (window.Notifications) {
                    Notifications.success('Scénario dupliqué');
                }
            }, 100);
        }
    },

    editScenarioName() {
        if (!this.currentScenario.id) {
            // Pour un scénario non sauvegardé, on peut juste renommer
            const newName = prompt('Nouveau nom du scénario:', this.currentScenario.name);
            if (newName) {
                this.currentScenario.name = newName;
                this.rerender();
            }
            return;
        }
        
        const newName = prompt('Nouveau nom du scénario:', this.currentScenario.name);
        if (!newName) return;
        
        console.log('✏️ Renommage du scénario:', this.currentScenario.id, '→', newName);
        
        // Mettre à jour le nom dans le scénario courant
        this.currentScenario.name = newName;
        
        // Mettre à jour le scénario dans la liste
        const scenarioIndex = this.scenarios.findIndex(s => s.id === this.currentScenario.id);
        if (scenarioIndex !== -1) {
            this.scenarios[scenarioIndex].name = newName;
        }
        
        this.rerender();
        
        if (window.Notifications) {
            Notifications.success('Scénario renommé');
        }
    },

    clearScenario() {
        if (this.currentScenario.tracks.length === 0) return;
        
        if (confirm('Vider toutes les pistes sélectionnées ?')) {
            if (appActions && appActions.clearScenario) {
                appActions.clearScenario();
            }
            
            this.currentScenario.tracks = [];
            this.rerender();
            
            if (window.Notifications) {
                Notifications.info('Scénario vidé');
            }
        }
    },

    compareScenarios() {
        if (this.scenarios.length < 2) {
            if (window.Notifications) {
                Notifications.warning('Créez au moins 2 scénarios pour comparer');
            } else {
                alert('Créez au moins 2 scénarios pour comparer');
            }
            return;
        }
        
        // Naviguer vers la page de comparaison
        if (window.router) {
            router.navigate('/comparer');
        }
    },

    exportScenario() {
        if (this.currentScenario.tracks.length === 0) {
            if (window.Notifications) {
                Notifications.warning('Aucune piste à exporter');
            }
            return;
        }
        const planning = this.syncCurrentPlanning();
        
        const data = {
            name: this.currentScenario.name,
            id: this.currentScenario.id,
            createdAt: this.currentScenario.createdAt,
            tracks: this.currentScenario.tracks.map(t => ({
                numero: t.numero,
                titre: t.titre,
                budget: t.budget?.cout_3_ans,
                impact: t.impact_score
            })),
            summary: {
                totalTracks: this.currentScenario.tracks.length,
                totalBudget: this.currentScenario.tracks.reduce((s, t) => s + (t.budget?.cout_3_ans || 0), 0),
                avgImpact: Math.round(this.currentScenario.tracks.reduce((s, t) => s + (t.impact_score || 0), 0) / this.currentScenario.tracks.length),
                planning
            },
            constraints: appStore?.getValue?.('currentScenarioConstraints') || null
        };
        
        const filename = `scenario_${this.currentScenario.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        
        if (window.Utils) {
            Utils.downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
        } else {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        if (window.Notifications) {
            Notifications.success('Scénario exporté');
        }
    },

    // ================ FONCTIONS DE SÉLECTION ================

    togglePiste(pisteId) {
        console.log('Toggle piste:', pisteId);
        const state = appStore ? appStore.getState() : {};
        const allPistes = state.allPistes || [];
        const piste = allPistes.find(p => p.numero === pisteId);
        const currentTracks = state.currentScenario || [];
        const isSelected = currentTracks.find(t => t.numero === pisteId);

        if (isSelected) {
            if (appActions && appActions.removePisteFromScenario) {
                appActions.removePisteFromScenario(pisteId);
            }
        } else {
            if (piste && appActions && appActions.addPisteToScenario) {
                appActions.addPisteToScenario(piste);
            }
        }

        this.rerender();
    },

    selectAll() {
        console.log('Select all pistes');
        const state = appStore ? appStore.getState() : {};
        const allPistes = state.allPistes || [];
        const currentTracks = state.currentScenario || [];

        allPistes.forEach(piste => {
            const isSelected = currentTracks.find(t => t.numero === piste.numero);
            if (!isSelected && appActions && appActions.addPisteToScenario) {
                appActions.addPisteToScenario(piste);
            }
        });

        this.rerender();
    },

    deselectAll() {
        console.log('Deselect all pistes');
        const state = appStore ? appStore.getState() : {};
        const currentTracks = state.currentScenario || [];

        currentTracks.forEach(track => {
            if (appActions && appActions.removePisteFromScenario) {
                appActions.removePisteFromScenario(track.numero);
            }
        });

        this.rerender();
    },

    rerender() {
        this.render().then(html => {
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = html;
                this.setupEventListeners();
            }
        }).catch(err => console.error('Rerender error:', err));
    },

    setupEventListeners() {
        console.log('Setup event listeners - Simulate');
        
        // Fermer la modale en cliquant en dehors
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideDeleteModal();
                }
            });
        }
        
        // Gérer la touche Echap pour fermer la modale
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideDeleteModal();
            }
        });
    }
};

window.pages = window.pages || {};
window.pages.Simulate = pages.Simulate;
