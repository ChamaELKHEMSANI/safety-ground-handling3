/**
 * PAGES/EDITION.JS - Page d'édition des pistes (Design professionnel)
 * Version enrichie avec tous les champs de piste-detail.js
 * CORRECTION : Données alignées sur data/pistes.xml, sans valeurs par défaut au rendu
 */

pages.Edition = {
    selectedTrackId: null,
    filteredTracks: [],
    filterPriority: 'Tous',
    searchTerm: '',
    activeTab: 'general', // general, dimensions, dispositif, phases, indicateurs, avantages, risques, justificatifs, elements

    // Mapping des icônes par type d'élément (copié de piste-detail.js)
    TYPE_ICONS: {
        'problematique': '⚠️',
        'principe': '🔧',
        'perimetre': '📍',
        'bareme': '📉',
        'seuil': '📊',
        'recidive': '🔄',
        'reconquete': '➕',
        'modalite': '⚙️',
        'articulation_disciplinaire': '⚖️',
        'avantage': '✅',
        'risque': '⚠️',
        'comparaison': '🔍',
        'phase': '📅',
        'indicateur': '📈',
        'question': '❓',
        'question_technique': '🔬',
        'question_operationnelle': '⚙️',
        'message_cle': '💬',
        'demande': '📢',
        'visuel': '🎯',
        'dimension': '📊',
        'approche_technologique': '🤖',
        'approche_humaine': '👥',
        'dispositif_technique': '🖥️',
        'perimetre_deploiement': '🎯',
        'technologie': '🔬',
        'etat_lieux': '📋',
        'emps': '🚓',
        'plan_controles': '📅',
        'rotation_zones': '🔄',
        'protocole_alcool': '🍷',
        'protocole_stupefiant': '💊',
        'articulation_p1': '🔗',
        'complementarite': '🤝',
        'complementarite_audits': '🤝',
        'base_legale': '⚖️',
        'obligation': '📋',
        'obligation_prealable': '📋',
        'condition_juridique': '⚖️',
        'investissement': '💰',
        'economie': '💶',
        'indicateur_activite': '📊',
        'indicateur_resultat': '🎯',
        'indicateur_cle': '🔑',
        'seuil_alcool': '🍷',
        'seuil_stupefiant': '💊',
        'video_profil': '🎬',
        'affichage_zone': '📍',
        'scenario_vr': '🥽',
        'objectif_adoption': '📊',
        'indicateur_impact': '📈',
        'impact': '🎯',
        'faisabilite': '📐',
        'acceptabilite': '🤝',
        'recommandation': '💡',
        'conclusion': '📌',
        'objectif': '🎯',
        'chiffre_cle': '🔢',
        'calendrier': '📅',
        'suivi': '📊',
        'detail': '🔍',
        'contexte': '📋',
        'pilote': '🚀',
        'generalisation': '🌍',
        'extension': '📈'
    },

    // Mapping des titres pour les types d'éléments
    TYPE_TITLES: {
        'problematique': 'Problématique',
        'principe': 'Principes généraux',
        'perimetre': "Périmètre d'application",
        'perimetre_deploiement': 'Périmètre de déploiement',
        'bareme': 'Barème de retrait de points',
        'seuil': 'Seuils progressifs',
        'seuil_alcool': 'Protocoles alcoolémie',
        'seuil_stupefiant': 'Protocoles stupéfiants',
        'recidive': 'Récidive',
        'reconquete': 'Reconquête de points',
        'modalite': 'Modalités opérationnelles',
        'articulation_disciplinaire': 'Articulation avec le cadre disciplinaire',
        'articulation_p1': 'Articulation avec le permis à points (P1)',
        'avantage': 'Avantages',
        'risque': 'Risques et mitigation',
        'comparaison': 'Comparaison avec dispositifs existants',
        'phase': 'Phases de déploiement',
        'indicateur': 'Indicateurs de suivi',
        'indicateur_activite': "Indicateurs d'activité",
        'indicateur_resultat': 'Indicateurs de résultat',
        'indicateur_cle': 'Indicateurs clés',
        'question': 'Questions à valider',
        'question_technique': 'Questions techniques',
        'question_operationnelle': 'Questions opérationnelles',
        'message_cle': 'Message clé',
        'demande': 'Notre demande',
        'visuel': 'Visuel de synthèse',
        'dimension': 'Dimensions Balancing',
        'approche_technologique': 'Approche technologique',
        'approche_humaine': 'Approche humaine',
        'dispositif_technique': 'Dispositif technique',
        'technologie': 'Technologie',
        'etat_lieux': 'État des lieux',
        'emps': 'Équipes Mobiles de Prévention Sécurité (EMPS)',
        'plan_controles': 'Plan de contrôles',
        'rotation_zones': 'Rotation des zones',
        'protocole_alcool': 'Protocole alcoolémie',
        'protocole_stupefiant': 'Protocole stupéfiants',
        'complementarite': 'Complémentarités',
        'complementarite_audits': 'Complémentarités avec audits',
        'base_legale': 'Base légale',
        'obligation': 'Obligations',
        'obligation_prealable': 'Obligations préalables',
        'condition_juridique': 'Conditions juridiques',
        'investissement': 'Investissement',
        'economie': 'Économies estimées',
        'video_profil': 'Personnalisation des vidéos par profil',
        'affichage_zone': 'Rotation et localisation des affichages',
        'scenario_vr': 'Scénarios de réalité virtuelle',
        'objectif_adoption': "Objectifs d'adoption de l'application",
        'indicateur_impact': "Indicateurs d'impact des campagnes",
        'impact': 'Niveau impact',
        'faisabilite': 'Niveau faisabilité',
        'acceptabilite': "Niveau d'acceptabilité",
        'recommandation': 'Recommandation',
        'conclusion': 'Conclusion',
        'objectif': 'Objectifs',
        'chiffre_cle': 'Chiffres clés',
        'calendrier': 'Calendrier prévisionnel',
        'suivi': 'Suivi et indicateurs',
        'detail': 'Détails complémentaires',
        'contexte': 'Contexte',
        'pilote': 'Phase pilote',
        'extension': "Phase d'extension",
        'generalisation': 'Phase de généralisation'
    },

    async render() {
        const state = appStore ? appStore.getState() : {};
        const allPistes = Utils.escapeDeep(state.allPistes || []);
        this.applyFilters(allPistes);
        const selectedTrack = this.findTrackById(allPistes, this.selectedTrackId);
        
        // Si aucune piste n'est sélectionnée et qu'il y a des pistes, sélectionner la première
        if (!selectedTrack && allPistes.length > 0) {
            this.selectedTrackId = allPistes[0].numero;
        }
        
        const currentTrack = this.findTrackById(allPistes, this.selectedTrackId);

        // Normaliser uniquement les conteneurs absents, sans injecter de contenu métier.
        if (currentTrack) {
            this.ensureCompleteData(currentTrack);
        }

        return `
            <div class="edition-wrapper">
                <!-- Main Content -->
                <main class="edition-main">
                    <!-- Left Sidebar: Track List -->
                    <aside class="edition-sidebar">
                        <div class="sidebar-top">
                            <button class="btn-new-track" data-edition-action="createNewTrack">
                                 <span class="material-icons">add</span>
                                 Nouvelle piste de sécurité
                           </button>
                            <div class="search-box">
                                <span class="material-symbols-outlined">search</span> <input type="text" placeholder="Rechercher une piste..." class="search-input" value="${this.searchTerm}" data-edition-input="filterTracks">
                            </div>
                            <div class="filter-title">Niveau de Priorité</div>
                            <div class="filter-tabs">
                                <button class="filter-btn ${this.filterPriority === 'Tous' ? 'active' : ''}" style="${this.getFilterAllStyle(this.filterPriority === 'Tous')}" data-edition-action="setFilter" data-value="Tous">Tous</button>
                                <button class="filter-btn filter-p1 ${this.filterPriority === 'P1' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P1', this.filterPriority === 'P1')}" data-edition-action="setFilter" data-value="P1">${this.getPriorityLabel('P1')}</button>
                                <button class="filter-btn filter-p2 ${this.filterPriority === 'P2' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P2', this.filterPriority === 'P2')}" data-edition-action="setFilter" data-value="P2">${this.getPriorityLabel('P2')}</button>
                                <button class="filter-btn filter-p3 ${this.filterPriority === 'P3' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P3', this.filterPriority === 'P3')}" data-edition-action="setFilter" data-value="P3">${this.getPriorityLabel('P3')}</button>
                                <button class="filter-btn filter-p4 ${this.filterPriority === 'P4' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P4', this.filterPriority === 'P4')}" data-edition-action="setFilter" data-value="P4"> ${this.getPriorityLabel('P4')}</button>
                            </div>
                        </div>

                        <div class="tracks-list">
                            ${this.filteredTracks.map((track, idx) => `
                                <div class="track-item ${this.isSameTrackId(track.numero, this.selectedTrackId) ? 'active' : ''}" role="button" tabindex="0" data-edition-action="selectTrack" data-track-id="${track.numero}" data-edition-keydown="activateAction">
                                    <div class="track-header">
                                        <span class="track-id">${track.numero}</span>
                                        <span class="priority-badge priority-${this.getPriorityClass(track.priorite)}">${this.getPriorityLabel(track.priorite)}</span>
                                    </div>
                                    <h3 class="track-title">${track.titre}</h3>
                                    <div class="track-meta">
                                        <span class="meta-item">
                                            <span class="material-symbols-outlined">groups</span>
                                            ${track.categorie}
                                        </span>
                                        <span class="meta-item">
                                            <span class="material-symbols-outlined">trending_down</span>
                                            ${track.impact_texte || ''}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>


                    </aside>

                    <!-- Right Panel: Edit Form -->
                    <section class="edition-panel">
                        ${currentTrack ? this.renderEditForm(currentTrack) : '<div class="no-track">Aucune piste sélectionnée</div>'}
                    </section>
                </main>
            </div>
        `;
    },

    renderEditForm(track) {
        return `
            <div class="panel-header">
                <h2 class="panel-title">${track.numero} - ${track.titre}</h2>
                <div class="panel-meta">
                    <span class="badge priority-${this.getPriorityClass(track.priorite)}">${this.getPriorityLabel(track.priorite)}</span>
                    <span class="badge category">${track.categorie}</span>
                    ${track.famille ? `<span class="badge family">${track.famille}</span>` : ''}
                </div>
            </div>

            <div class="panel-actions">
                <button class="btn-delete" data-edition-action="deleteTrack" data-track-id="${track.numero}">
                    <span class="material-symbols-outlined">delete_outline</span>
                    Supprimer
                </button>
                <button class="btn-cancel" data-edition-action="cancelEdit">Annuler</button>
                <button class="btn-view" data-edition-action="viewTrack" data-track-id="${track.numero}">
                    <span class="material-symbols-outlined">visibility</span>
                    Visualiser la piste
                </button>
                <button class="btn-save" data-edition-action="saveTrack" data-track-id="${track.numero}">
                    <span class="material-symbols-outlined">check</span>
                    Enregistrer les modifications
                </button>
            </div>

            <!-- Tabs Navigation -->
            <div class="tabs-navigation">
                <button class="tab-btn ${this.activeTab === 'general' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="general">
                    <span class="material-symbols-outlined">info</span>
                    Général
                </button>
                <button class="tab-btn ${this.activeTab === 'dimensions' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="dimensions">
                    <span class="material-symbols-outlined">donut_large</span>
                    Dimensions
                </button>
                <button class="tab-btn ${this.activeTab === 'dispositif' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="dispositif">
                    <span class="material-symbols-outlined">construction</span>
                    Dispositif
                </button>
                <button class="tab-btn ${this.activeTab === 'phases' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="phases">
                    <span class="material-symbols-outlined">timeline</span>
                    Phases
                </button>
                <button class="tab-btn ${this.activeTab === 'indicateurs' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="indicateurs">
                    <span class="material-symbols-outlined">analytics</span>
                    Indicateurs
                </button>
                <button class="tab-btn ${this.activeTab === 'avantages' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="avantages">
                    <span class="material-symbols-outlined">thumb_up</span>
                    Avantages
                </button>
                <button class="tab-btn ${this.activeTab === 'risques' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="risques">
                    <span class="material-symbols-outlined">warning</span>
                    Risques
                </button>
                <button class="tab-btn ${this.activeTab === 'justificatifs' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="justificatifs">
                    <span class="material-symbols-outlined">attach_file</span>
                    Justificatifs
                </button>
                <button class="tab-btn ${this.activeTab === 'elements' ? 'active' : ''}" data-edition-action="setActiveTab" data-value="elements">
                    <span class="material-symbols-outlined">list_alt</span>
                    Éléments
                </button>
            </div>

            <!-- Tab Content -->
            <div class="edition-tab-content">
                ${this.renderTabContent(track)}
            </div>
        `;
    },

    renderTabContent(track) {
        switch(this.activeTab) {
            case 'general':
                return this.renderGeneralTab(track);
            case 'dimensions':
                return this.renderDimensionsTab(track);
            case 'dispositif':
                return this.renderDispositifTab(track);
            case 'phases':
                return this.renderPhasesTab(track);
            case 'indicateurs':
                return this.renderIndicateursTab(track);
            case 'avantages':
                return this.renderAvantagesTab(track);
            case 'risques':
                return this.renderRisquesTab(track);
            case 'justificatifs':
                return this.renderJustificatifsTab(track);
            case 'elements':
                return this.renderElementsTab(track);
            default:
                return this.renderGeneralTab(track);
        }
    },

    renderGeneralTab(track) {
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Informations générales</h3>
                
                <!-- Row 1: Title & ID -->
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">TITRE COURT</label>
                        <input type="text" class="form-input" value="${track.titre || ''}" placeholder="Titre court" data-field="titre" data-edition-change="updateField" data-track-id="${track.numero}" data-field="titre">
                    </div>
                    <div class="form-group">
                        <label class="form-label">IDENTIFIANT (ID)</label>
                        <input type="text" class="form-input" value="${track.numero || ''}" placeholder="ID" readonly>
                    </div>
                </div>

                <!-- Row 2: Titre long -->
                <div class="form-group full-width">
                    <label class="form-label">TITRE LONG</label>
                    <input type="text" class="form-input" value="${track.titre_long || ''}" placeholder="Titre long descriptif" data-field="titre_long" data-edition-change="updateField" data-track-id="${track.numero}" data-field="titre_long">
                </div>

                <!-- Row 3: Category, Priority, Family -->
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">CATÉGORIE</label>
                        <select class="form-input" data-field="categorie" data-edition-change="updateField" data-track-id="${track.numero}" data-field="categorie">
                            <option value="" ${!track.categorie ? 'selected' : ''}></option>
                            <option value="Culture et reconnaissance" ${track.categorie === 'Culture et reconnaissance' ? 'selected' : ''}>Culture et reconnaissance</option>
                            <option value="Données et analyse" ${track.categorie === 'Données et analyse' ? 'selected' : ''}>Données et analyse</option>
                            <option value="Formation et pédagogie" ${track.categorie === 'Formation et pédagogie' ? 'selected' : ''}>Formation et pédagogie</option>
                            <option value="Gouvernance et participation" ${track.categorie === 'Gouvernance et participation' ? 'selected' : ''}>Gouvernance et participation</option>
                            <option value="Infrastructure et aménagement" ${track.categorie === 'Infrastructure et aménagement' ? 'selected' : ''}>Infrastructure et aménagement</option>
                            <option value="Organisation et processus" ${track.categorie === 'Organisation et processus' ? 'selected' : ''}>Organisation et processus</option>
                            <option value="Régulation et sanction" ${track.categorie === 'Régulation et sanction' ? 'selected' : ''}>Régulation et sanction</option>
                            <option value="Santé et bien-être" ${track.categorie === 'Santé et bien-être' ? 'selected' : ''}>Santé et bien-être</option>
                            <option value="Technologie embarquée" ${track.categorie === 'Technologie embarquée' ? 'selected' : ''}>Technologie embarquée</option>
                        </select>

                    </div>
                    <div class="form-group">
                        <label class="form-label">FAMILLE</label>
                        <select class="form-input" data-field="famille" data-edition-change="updateField" data-track-id="${track.numero}" data-field="famille">
                            <option value="" ${!track.famille ? 'selected' : ''}></option>
                            <option value="Prévention" ${track.famille === 'Prévention' ? 'selected' : ''}>Prévention</option>
                            <option value="Détection" ${track.famille === 'Détection' ? 'selected' : ''}>Détection</option>
                            <option value="Contrôle" ${track.famille === 'Contrôle' ? 'selected' : ''}>Contrôle</option>
                            <option value="Sanction" ${track.famille === 'Sanction' ? 'selected' : ''}>Sanction</option>
                            <option value="Formation" ${track.famille === 'Formation' ? 'selected' : ''}>Formation</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">NIVEAU DE PRIORITÉ</label>
                        <div class="priority-buttons">
                            <button class="priority-btn ${track.priorite === 'P1' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P1', track.priorite === 'P1')}" data-edition-action="updatePriority" data-track-id="${track.numero}" data-value="P1">${this.getPriorityLabel('P1')}</button>
                            <button class="priority-btn ${track.priorite === 'P2' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P2', track.priorite === 'P2')}" data-edition-action="updatePriority" data-track-id="${track.numero}" data-value="P2">${this.getPriorityLabel('P2')}</button>
                            <button class="priority-btn ${track.priorite === 'P3' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P3', track.priorite === 'P3')}" data-edition-action="updatePriority" data-track-id="${track.numero}" data-value="P3">${this.getPriorityLabel('P3')}</button>
                            <button class="priority-btn ${track.priorite === 'P4' ? 'active' : ''}" style="${this.getFilterPriorityStyle('P4', track.priorite === 'P4')}" data-edition-action="updatePriority" data-track-id="${track.numero}" data-value="P4">${this.getPriorityLabel('P4')}</button>
                        </div>
                    </div>
                </div>

                <!-- Row 4: Tags -->
                <div class="form-group full-width">
                    <label class="form-label">TAGS</label>
                    <div class="tags-input-container">
                        <input type="text" class="form-input tags-input" placeholder="Ajouter un tag (Entrée pour valider)" data-edition-keydown="handleTagInput" data-track-id="${track.numero}">
                        <div class="tags-list">
                            ${(track.tags || []).map(tag => `
                                <span class="tag-item">
                                    ${tag}
                                    <span class="tag-remove" data-edition-action="removeTag" data-track-id="${track.numero}" data-value="${tag}">&times;</span>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Row 5: Description courte -->
                <div class="form-group full-width">
                    <label class="form-label">DESCRIPTION COURTE</label>
                    <textarea class="form-input" rows="3" placeholder="Description courte..." data-field="description" data-edition-change="updateField" data-track-id="${track.numero}" data-field="description">${track.description || ''}</textarea>
                </div>

                <!-- Row 6: Description longue -->
                <div class="form-group full-width">
                    <label class="form-label">DESCRIPTION LONGUE</label>
                    <div class="rich-editor">
                        <div class="editor-toolbar">
                            <button class="editor-btn" title="Gras"><strong>B</strong></button>
                            <button class="editor-btn" title="Italique"><em>I</em></button>
                            <button class="editor-btn" title="Liste"><span class="material-icons">list</span></button>
                            <button class="editor-btn" title="Lien"><span class="material-icons">link</span></button>
                        </div>
                        <textarea class="editor-content" rows="5" placeholder="Description détaillée..." data-field="description_longue" data-edition-change="updateField" data-track-id="${track.numero}" data-field="description_longue">${track.description_longue || track.description || ''}</textarea>
                    </div>
                </div>

                <!-- Row 7: Budget & Impact -->
                <h3 class="section-subtitle" style="margin-top: 30px;">Budget et impact</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">BUDGET 2026 (€)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.budget?.cout_2026)}" placeholder="Budget 2026" data-field="budget.cout_2026" data-edition-change="updateNestedField" data-track-id="${track.numero}" data-parent="budget" data-field="cout_2026">
                    </div>
                    <div class="form-group">
                        <label class="form-label">BUDGET 2027 (€)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.budget?.cout_2027)}" placeholder="Budget 2027" data-field="budget.cout_2027" data-edition-change="updateNestedField" data-track-id="${track.numero}" data-parent="budget" data-field="cout_2027">
                    </div>
                    <div class="form-group">
                        <label class="form-label">BUDGET 2028 (€)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.budget?.cout_2028)}" placeholder="Budget 2028" data-field="budget.cout_2028" data-edition-change="updateNestedField" data-track-id="${track.numero}" data-parent="budget" data-field="cout_2028">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">BUDGET TRIENNAL TOTAL (€)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.budget?.cout_3_ans)}" placeholder="Total 3 ans" data-field="budget.cout_3_ans" data-edition-change="updateNestedField" data-track-id="${track.numero}" data-parent="budget" data-field="cout_3_ans">
                    </div>
                    <div class="form-group">
                        <label class="form-label">COÛT RÉCURRENT ANNUEL (€)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.budget?.cout_recurrent_annuel)}" placeholder="Coût récurrent" data-field="budget.cout_recurrent_annuel" data-edition-change="updateNestedField" data-track-id="${track.numero}" data-parent="budget" data-field="cout_recurrent_annuel">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">SCORE D'IMPACT (0-100)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.impact_score)}" min="0" max="100" placeholder="Score d'impact" data-field="impact_score" data-edition-change="updateField" data-track-id="${track.numero}" data-field="impact_score">
                    </div>
                    <div class="form-group">
                        <label class="form-label">RÉDUCTION D'ACCIDENTS (%)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.impact_reduction)}" min="0" max="100" placeholder="Réduction %" data-field="impact_reduction" data-edition-change="updateField" data-track-id="${track.numero}" data-field="impact_reduction">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">ACCIDENTS ÉVITÉS ESTIMÉS (/an)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.impact_accidents_evites)}" placeholder="Accidents évités" data-field="impact_accidents_evites" data-edition-change="updateField" data-track-id="${track.numero}" data-field="impact_accidents_evites">
                    </div>
                    <div class="form-group">
                        <label class="form-label">ÉCONOMIES ESTIMÉES (€/an)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.impact_economies)}" placeholder="Économies annuelles" data-field="impact_economies" data-edition-change="updateField" data-track-id="${track.numero}" data-field="impact_economies">
                    </div>
                </div>

                <div class="form-group full-width">
                    <label class="form-label">TEXTE D'IMPACT</label>
                    <input type="text" class="form-input" value="${track.impact_texte || ''}" placeholder="Description textuelle de l'impact" data-field="impact_texte" data-edition-change="updateField" data-track-id="${track.numero}" data-field="impact_texte">
                </div>

                <!-- Row 8: Délais de mise en oeuvre et de retour -->
                <h3 class="section-subtitle" style="margin-top: 30px;">Délais de mise en oeuvre et de retour</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">DÉLAI DE DÉPLOIEMENT (mois)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.delai_mois)}" placeholder="Délai en mois" data-field="delai_mois" data-edition-change="updateField" data-track-id="${track.numero}" data-field="delai_mois">
                    </div>
                    <div class="form-group">
                        <label class="form-label">TEXTE DÉLAI</label>
                        <input type="text" class="form-input" value="${track.delai_texte || ''}" placeholder="Description textuelle du délai" data-field="delai_texte" data-edition-change="updateField" data-track-id="${track.numero}" data-field="delai_texte">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">DÉLAI DE RETOUR SUR INVESTISSEMENT (mois)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.roi_mois)}" placeholder="Délai de retour en mois" data-field="roi_mois" data-edition-change="updateField" data-track-id="${track.numero}" data-field="roi_mois">
                    </div>
                    <div class="form-group">
                        <label class="form-label">TEXTE DÉLAI DE RETOUR</label>
                        <input type="text" class="form-input" value="${track.roi_texte || ''}" placeholder="Description textuelle du délai de retour" data-field="roi_texte" data-edition-change="updateField" data-track-id="${track.numero}" data-field="roi_texte">
                    </div>
                </div>

                <!-- Row 9: Niveaux d'évaluation -->
                <h3 class="section-subtitle" style="margin-top: 30px;">Niveaux d'évaluation</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">NIVEAU D'IMPACT (1-4)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.niveau_impact)}" min="1" max="4" placeholder="Niveau 1-4" data-field="niveau_impact" data-edition-change="updateField" data-track-id="${track.numero}" data-field="niveau_impact">
                    </div>
                    <div class="form-group">
                        <label class="form-label">NIVEAU DE FAISABILITÉ (1-4)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.niveau_faisabilite)}" min="1" max="4" placeholder="Niveau 1-4" data-field="niveau_faisabilite" data-edition-change="updateField" data-track-id="${track.numero}" data-field="niveau_faisabilite">
                    </div>
                    <div class="form-group">
                        <label class="form-label">NIVEAU D'ACCEPTABILITÉ (1-4)</label>
                        <input type="number" class="form-input" value="${this.fieldValue(track.niveau_acceptabilite)}" min="1" max="4" placeholder="Niveau 1-4" data-field="niveau_acceptabilite" data-edition-change="updateField" data-track-id="${track.numero}" data-field="niveau_acceptabilite">
                    </div>
                </div>
            </div>
        `;
    },

    renderDimensionsTab(track) {
        // S'assurer que les dimensions sont définies
        if (!track.dimensions) {
            track.dimensions = { culture: 20, technique: 20, humain: 20, organisationnel: 20, economique: 20 };
        }
        
        const dimensions = track.dimensions;
        
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Dimensions Balancing</h3>
                <p class="dimensions-description">Répartissez le poids de la piste sur les 5 dimensions (total = 100%)</p>
                
                <div class="dimensions-container">
                    <div class="dimension-item">
                        <label class="form-label">CULTURE</label>
                        <div class="dimension-control">
                            <input type="range" min="0" max="100" step="5" value="${this.fieldValue(dimensions.culture)}" class="dimension-slider" data-dim="culture" data-edition-input="updateDimension" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="culture">
                            <input type="number" min="0" max="100" value="${this.fieldValue(dimensions.culture)}" class="dimension-input" data-dim="culture" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="culture">
                            <span class="dimension-unit">%</span>
                        </div>
                    </div>
                    
                    <div class="dimension-item">
                        <label class="form-label">TECHNIQUE</label>
                        <div class="dimension-control">
                            <input type="range" min="0" max="100" step="5" value="${this.fieldValue(dimensions.technique)}" class="dimension-slider" data-dim="technique" data-edition-input="updateDimension" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="technique">
                            <input type="number" min="0" max="100" value="${this.fieldValue(dimensions.technique)}" class="dimension-input" data-dim="technique" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="technique">
                            <span class="dimension-unit">%</span>
                        </div>
                    </div>
                    
                    <div class="dimension-item">
                        <label class="form-label">HUMAIN</label>
                        <div class="dimension-control">
                            <input type="range" min="0" max="100" step="5" value="${this.fieldValue(dimensions.humain)}" class="dimension-slider" data-dim="humain" data-edition-input="updateDimension" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="humain">
                            <input type="number" min="0" max="100" value="${this.fieldValue(dimensions.humain)}" class="dimension-input" data-dim="humain" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="humain">
                            <span class="dimension-unit">%</span>
                        </div>
                    </div>
                    
                    <div class="dimension-item">
                        <label class="form-label">ORGANISATIONNEL</label>
                        <div class="dimension-control">
                            <input type="range" min="0" max="100" step="5" value="${this.fieldValue(dimensions.organisationnel)}" class="dimension-slider" data-dim="organisationnel" data-edition-input="updateDimension" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="organisationnel">
                            <input type="number" min="0" max="100" value="${this.fieldValue(dimensions.organisationnel)}" class="dimension-input" data-dim="organisationnel" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="organisationnel">
                            <span class="dimension-unit">%</span>
                        </div>
                    </div>
                    
                    <div class="dimension-item">
                        <label class="form-label">ÉCONOMIQUE</label>
                        <div class="dimension-control">
                            <input type="range" min="0" max="100" step="5" value="${this.fieldValue(dimensions.economique)}" class="dimension-slider" data-dim="economique" data-edition-input="updateDimension" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="economique">
                            <input type="number" min="0" max="100" value="${this.fieldValue(dimensions.economique)}" class="dimension-input" data-dim="economique" data-edition-change="updateDimension" data-track-id="${track.numero}" data-dimension="economique">
                            <span class="dimension-unit">%</span>
                        </div>
                    </div>
                </div>
                
                <div class="dimension-total">
                    <span class="total-label">Total :</span>
                    <span class="total-value" id="dimension-total">${this.calculateDimensionsTotal(dimensions)}%</span>
                </div>
            </div>
        `;
    },

    renderDispositifTab(track) {
        const elements = track.dispositif_elements;
        const visibleTypes = Object.keys(elements || {}).filter(type => Array.isArray(elements[type]) && elements[type].length > 0);
        
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Détails du dispositif</h3>
                ${visibleTypes.length === 0 ? '<p class="empty-message">Aucun élément défini dans le XML pour cette piste.</p>' : visibleTypes.map(type => this.renderElementGroup(track, type, elements[type])).join('')}
            </div>
        `;
    },

    renderElementGroup(track, type, items) {
        const title = this.TYPE_TITLES[type] || type.replace(/_/g, ' ');
        return `
            <div class="element-group">
                <div class="element-group-header">
                    <span class="element-icon">${this.TYPE_ICONS[type] || '📌'}</span>
                    <h4>${title}</h4>
                    <button class="btn-add-element" data-edition-action="addElement" data-track-id="${track.numero}" data-type="${type}">
                        <span class="material-icons">add</span>
                    </button>
                </div>
                <div class="element-list">
                    ${this.renderElementItems(track, type, items)}
                </div>
            </div>
        `;
    },

    renderElementItems(track, type, items) {
        if (!items || items.length === 0) {
            return `
                <div class="element-empty" data-edition-action="addElement" data-track-id="${track.numero}" data-type="${type}">
                    <span class="material-symbols-outlined">add_circle_outline</span>
                    <span>Ajouter un élément</span>
                </div>
            `;
        }

        return items.map((item, index) => `
            <div class="element-item" data-type="${type}" data-index="${index}">
                <div class="element-item-header">
                    <input type="text" class="element-item-name" value="${item.nom || ''}" placeholder="Titre" data-field="nom" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="nom">
                    <button class="element-item-remove" data-edition-action="removeElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                
                <div class="element-item-content">
                    <textarea class="element-item-description" placeholder="Description" data-field="description" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="description">${item.description || ''}</textarea>
                    
                    ${this.renderElementSpecificFields(type, item, track, index)}
                </div>
            </div>
        `).join('');
    },

    renderElementSpecificFields(type, item, track, index) {
        switch(type) {
            case 'phase':
                return `
                    <div class="element-fields-row">
                        <input type="text" class="element-field" value="${item.etape_duree || ''}" placeholder="Durée" data-field="etape_duree" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="etape_duree">
                        <input type="text" class="element-field" value="${item.activites || ''}" placeholder="Activités" data-field="activites" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="activites">
                    </div>
                    <div class="element-fields-row">
                        <input type="text" class="element-field" value="${item.objectifs_etape || ''}" placeholder="Objectifs" data-field="objectifs_etape" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="objectifs_etape">
                        <input type="text" class="element-field" value="${item.livrable_etape || ''}" placeholder="Livrable" data-field="livrable_etape" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="livrable_etape">
                    </div>
                `;
            
            case 'bareme':
                return `
                    <div class="element-fields-row">
                        <input type="text" class="element-field" value="${item.libelle_infraction || ''}" placeholder="Type d'infraction" data-field="libelle_infraction" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="libelle_infraction">
                        <input type="text" class="element-field" value="${item.meta_donnees || ''}" placeholder="Points retirés" data-field="meta_donnees" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="meta_donnees">
                    </div>
                    <input type="text" class="element-field" value="${item.constat || ''}" placeholder="Constat" data-field="constat" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="constat">
                `;
            
            case 'investissement':
            case 'economie':
                return `
                    <input type="text" class="element-field" value="${item.nom || ''}" placeholder="Poste" data-field="nom" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="nom">
                    <input type="text" class="element-field" value="${item.description || ''}" placeholder="Détail" data-field="description" data-edition-change="updateElement" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="description">
                `;
            
            default:
                return '';
        }
    },

    renderPhasesTab(track) {
        const phases = track.phases;
        
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Phases de déploiement</h3>
                
                <div class="phases-container">
                    ${phases.map((phase, index) => `
                        <div class="phase-card">
                            <div class="phase-header">
                                <input type="text" class="phase-name" value="${phase.nom || ''}" placeholder="Nom de la phase" data-index="${index}" data-field="nom" data-edition-change="updatePhase" data-track-id="${track.numero}" data-index="${index}" data-field="nom">
                                <button class="phase-remove" data-edition-action="removePhase" data-track-id="${track.numero}" data-index="${index}">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                            
                            <div class="phase-content">
                                <div class="form-group">
                                    <label class="form-label">Durée</label>
                                    <input type="text" class="form-input" value="${phase.etape_duree || ''}" placeholder="Ex: 3-6 mois" data-index="${index}" data-field="etape_duree" data-edition-change="updatePhase" data-track-id="${track.numero}" data-index="${index}" data-field="etape_duree">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Activités</label>
                                    <textarea class="form-input" rows="2" placeholder="Description des activités" data-index="${index}" data-field="activites" data-edition-change="updatePhase" data-track-id="${track.numero}" data-index="${index}" data-field="activites">${phase.activites || ''}</textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Objectifs</label>
                                    <input type="text" class="form-input" value="${phase.objectifs_etape || ''}" placeholder="Objectifs de l'étape" data-index="${index}" data-field="objectifs_etape" data-edition-change="updatePhase" data-track-id="${track.numero}" data-index="${index}" data-field="objectifs_etape">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Livrable</label>
                                    <input type="text" class="form-input" value="${phase.livrable_etape || ''}" placeholder="Livrable attendu" data-index="${index}" data-field="livrable_etape" data-edition-change="updatePhase" data-track-id="${track.numero}" data-index="${index}" data-field="livrable_etape">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <button class="btn-add-phase" data-edition-action="addPhase" data-track-id="${track.numero}">
                    <span class="material-icons">add</span>
                    Ajouter une phase
                </button>
            </div>
        `;
    },

    renderIndicateursTab(track) {
        const indicateurs = track.indicateurs;
        
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Indicateurs de suivi</h3>
                
                <!-- Indicateurs d'activité -->
                <div class="indicateurs-group">
                    <h4>Indicateurs d'activité</h4>
                    <table class="indicateurs-table">
                        <thead>
                            <tr>
                                <th>Indicateur</th>
                                <th>Cible</th>
                                <th>Unité</th>
                                <th>Périodicité</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="indicateurs-activite-body">
                            ${this.renderIndicateurRows(track, 'activite', indicateurs.activite || [])}
                        </tbody>
                    </table>
                    <button class="btn-add-indicateur" data-edition-action="addIndicateur" data-track-id="${track.numero}" data-type="activite">
                        <span class="material-icons">add</span>
                        Ajouter un indicateur d'activité
                    </button>
                </div>
                
                <!-- Indicateurs de résultat -->
                <div class="indicateurs-group">
                    <h4>Indicateurs de résultat</h4>
                    <table class="indicateurs-table">
                        <thead>
                            <tr>
                                <th>Indicateur</th>
                                <th>Cible</th>
                                <th>Unité</th>
                                <th>Périodicité</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="indicateurs-resultat-body">
                            ${this.renderIndicateurRows(track, 'resultat', indicateurs.resultat || [])}
                        </tbody>
                    </table>
                    <button class="btn-add-indicateur" data-edition-action="addIndicateur" data-track-id="${track.numero}" data-type="resultat">
                        <span class="material-icons">add</span>
                        Ajouter un indicateur de résultat
                    </button>
                </div>
                
                <!-- Indicateurs clés -->
                <div class="indicateurs-group">
                    <h4>Indicateurs clés</h4>
                    <table class="indicateurs-table">
                        <thead>
                            <tr>
                                <th>Indicateur</th>
                                <th>Cible</th>
                                <th>Unité</th>
                                <th>Périodicité</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="indicateurs-cle-body">
                            ${this.renderIndicateurRows(track, 'cle', indicateurs.cle || [])}
                        </tbody>
                    </table>
                    <button class="btn-add-indicateur" data-edition-action="addIndicateur" data-track-id="${track.numero}" data-type="cle">
                        <span class="material-icons">add</span>
                        Ajouter un indicateur clé
                    </button>
                </div>
            </div>
        `;
    },

    renderIndicateurRows(track, type, items) {
        if (!items || items.length === 0) {
            return `
                <tr class="empty-row">
                    <td colspan="5">Aucun indicateur défini</td>
                </tr>
            `;
        }

        return items.map((item, index) => `
            <tr>
                <td><input type="text" value="${item.nom || ''}" placeholder="Nom" data-type="${type}" data-index="${index}" data-field="nom" data-edition-change="updateIndicateur" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="nom"></td>
                <td><input type="text" value="${item.cible || ''}" placeholder="Cible" data-type="${type}" data-index="${index}" data-field="cible" data-edition-change="updateIndicateur" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="cible"></td>
                <td><input type="text" value="${item.unite || ''}" placeholder="Unité" data-type="${type}" data-index="${index}" data-field="unite" data-edition-change="updateIndicateur" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="unite"></td>
                <td>
                    <select data-type="${type}" data-index="${index}" data-field="periodicite" data-edition-change="updateIndicateur" data-track-id="${track.numero}" data-type="${type}" data-index="${index}" data-field="periodicite">
                        <option value="" ${!item.periodicite ? 'selected' : ''}></option>
                        <option value="mensuelle" ${item.periodicite === 'mensuelle' ? 'selected' : ''}>Mensuelle</option>
                        <option value="trimestrielle" ${item.periodicite === 'trimestrielle' ? 'selected' : ''}>Trimestrielle</option>
                        <option value="semestrielle" ${item.periodicite === 'semestrielle' ? 'selected' : ''}>Semestrielle</option>
                        <option value="annuelle" ${item.periodicite === 'annuelle' ? 'selected' : ''}>Annuelle</option>
                    </select>
                </td>
                <td>
                    <button class="btn-remove-indicateur" data-edition-action="removeIndicateur" data-track-id="${track.numero}" data-type="${type}" data-index="${index}">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderAvantagesTab(track) {
        const avantages = track.avantages;
        
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Avantages</h3>
                
                <table class="avantages-table">
                    <thead>
                        <tr>
                            <th>Bénéficiaire</th>
                            <th>Avantage</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="avantages-body">
                        ${this.renderAvantageRows(track, avantages)}
                    </tbody>
                </table>
                
                <button class="btn-add-avantage" data-edition-action="addAvantage" data-track-id="${track.numero}">
                    <span class="material-icons">add</span>
                    Ajouter un avantage
                </button>
            </div>
        `;
    },

    renderAvantageRows(track, items) {
        if (!items || items.length === 0) {
            return `
                <tr class="empty-row">
                    <td colspan="3">Aucun avantage défini</td>
                </tr>
            `;
        }

        return items.map((item, index) => `
            <tr>
                <td><input type="text" value="${item.beneficiaire || ''}" placeholder="Bénéficiaire" data-index="${index}" data-field="beneficiaire" data-edition-change="updateAvantage" data-track-id="${track.numero}" data-index="${index}" data-field="beneficiaire"></td>
                <td><input type="text" value="${item.texte || ''}" placeholder="Description de l'avantage" data-index="${index}" data-field="texte" data-edition-change="updateAvantage" data-track-id="${track.numero}" data-index="${index}" data-field="texte"></td>
                <td>
                    <button class="btn-remove-avantage" data-edition-action="removeAvantage" data-track-id="${track.numero}" data-index="${index}">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderRisquesTab(track) {
        const risques = track.risques;
        
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Risques et mitigation</h3>
                
                <table class="risques-table">
                    <thead>
                        <tr>
                            <th>Risque</th>
                            <th>Probabilité</th>
                            <th>Gravité</th>
                            <th>Mitigation</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="risques-body">
                        ${this.renderRisqueRows(track, risques)}
                    </tbody>
                </table>
                
                <button class="btn-add-risque" data-edition-action="addRisque" data-track-id="${track.numero}">
                    <span class="material-icons">add</span>
                    Ajouter un risque
                </button>
            </div>
        `;
    },

    renderRisqueRows(track, items) {
        if (!items || items.length === 0) {
            return `
                <tr class="empty-row">
                    <td colspan="5">Aucun risque défini</td>
                </tr>
            `;
        }

        return items.map((item, index) => `
            <tr>
                <td><input type="text" value="${item.nom || ''}" placeholder="Nom du risque" data-index="${index}" data-field="nom" data-edition-change="updateRisque" data-track-id="${track.numero}" data-index="${index}" data-field="nom"></td>
                <td>
                    <select data-index="${index}" data-field="probabilite" data-edition-change="updateRisque" data-track-id="${track.numero}" data-index="${index}" data-field="probabilite">
                        <option value="" ${!item.probabilite ? 'selected' : ''}></option>
                        <option value="faible" ${item.probabilite === 'faible' ? 'selected' : ''}>Faible</option>
                        <option value="moyenne" ${item.probabilite === 'moyenne' ? 'selected' : ''}>Moyenne</option>
                        <option value="élevée" ${item.probabilite === 'élevée' ? 'selected' : ''}>Élevée</option>
                    </select>
                </td>
                <td>
                    <select data-index="${index}" data-field="gravite" data-edition-change="updateRisque" data-track-id="${track.numero}" data-index="${index}" data-field="gravite">
                        <option value="" ${!item.gravite ? 'selected' : ''}></option>
                        <option value="faible" ${item.gravite === 'faible' ? 'selected' : ''}>Faible</option>
                        <option value="modérée" ${item.gravite === 'modérée' ? 'selected' : ''}>Modérée</option>
                        <option value="élevée" ${item.gravite === 'élevée' ? 'selected' : ''}>Élevée</option>
                        <option value="critique" ${item.gravite === 'critique' ? 'selected' : ''}>Critique</option>
                    </select>
                </td>
                <td><input type="text" value="${item.mitigation || ''}" placeholder="Mesure de mitigation" data-index="${index}" data-field="mitigation" data-edition-change="updateRisque" data-track-id="${track.numero}" data-index="${index}" data-field="mitigation"></td>
                <td>
                    <button class="btn-remove-risque" data-edition-action="removeRisque" data-track-id="${track.numero}" data-index="${index}">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderJustificatifsTab(track) {
        const justificatifs = track.justificatifs;
        
        return `
            <div class="form-section">
                <h3 class="section-subtitle">Justificatifs et sources</h3>
                <div id="justificatifs-body" class="justificatifs-list">
                    ${this.renderJustificatifRows(track, justificatifs)}
                </div>
                
                <button class="btn-add-justificatif" data-edition-action="addJustificatif" data-track-id="${track.numero}">
                    <span class="material-icons">add</span>
                    Ajouter un justificatif
                </button>
            </div>
            
            <!-- Documents section -->
            <div class="documents-section">
                <h3 class="documents-title">
                    <span class="material-icons">attach_file</span>
                    Documents joints
                </h3>
                <div class="documents-grid">
                    ${(track.documents || []).map(doc => `
                        <div class="document-item">
                            <span class="material-icons">${doc.type === 'pdf' ? 'picture_as_pdf' : 'table_chart'}</span>
                            <p class="document-name">${doc.nom}</p>
                            <p class="document-size">${doc.taille}</p>
                            <button class="document-remove" data-edition-action="removeDocument" data-track-id="${track.numero}" data-value="${doc.id}">
                                <span class="material-icons">close</span>
                            </button>
                        </div>
                    `).join('')}
                    <div class="document-item add-document" data-edition-action="addDocument" data-track-id="${track.numero}">
                        <span class="material-symbols-outlined">add_circle_outline</span>
                        <p>Ajouter</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderJustificatifRows(track, items) {
        if (!items || items.length === 0) {
            return `
                <div class="empty-row">Aucun justificatif défini</div>
            `;
        }

        return items.map((item, index) => `
            <div class="justificatif-card">
                <div class="justificatif-card-header">
                    <input type="text" class="form-input" value="${item.id || ''}" placeholder="id" data-field="id" data-edition-change="updateJustificatif" data-track-id="${track.numero}" data-index="${index}">
                    <button class="btn-remove-justificatif" data-edition-action="removeJustificatif" data-track-id="${track.numero}" data-index="${index}" title="Supprimer">
                        <span class="material-icons">delete</span>
                    </button>
                </div>

                <div class="form-row">
                    ${this.renderJustificatifField(track, item, index, 'year', 'Year')}
                    ${this.renderJustificatifField(track, item, index, 'country', 'Country')}
                </div>

                <div class="form-row">
                    ${this.renderJustificatifField(track, item, index, 'title', 'Title')}
                    ${this.renderJustificatifField(track, item, index, 'organization', 'Organization')}
                </div>

                ${this.renderJustificatifField(track, item, index, 'subtitle', 'Subtitle')}
                ${this.renderJustificatifTextarea(track, item, index, 'description', 'Description')}
                ${this.renderJustificatifTextarea(track, item, index, 'resultat', 'Résultat / results.text')}
                ${this.renderJustificatifTextarea(track, item, index, 'lesson', 'Lesson')}

                <div class="form-row">
                    ${this.renderJustificatifTextarea(track, item, index, 'links', 'Links', this.formatJustificatifList(item.links))}
                    ${this.renderJustificatifTextarea(track, item, index, 'technologies', 'Technologies', this.formatJustificatifList(item.technologies))}
                </div>
                <div class="form-row">
                    ${this.renderJustificatifTextarea(track, item, index, 'results_metrics', 'Results metrics', this.formatMetrics(item.results?.metrics))}
                    ${this.renderJustificatifTextarea(track, item, index, 'inspirations', 'Inspirations', this.formatJustificatifList(item.inspirations))}
                </div>
                ${this.renderJustificatifTextarea(track, item, index, 'customData', 'Custom data', this.formatCustomData(item.customData))}

                ${this.renderLegacyJustificatifFields(track, item, index)}
            </div>
        `).join('');
    },

    renderJustificatifField(track, item, index, field, label) {
        return `
            <div class="form-group">
                <label class="form-label">${label}</label>
                <input type="text" class="form-input" value="${this.getJustificatifFieldValue(item, field)}" placeholder="${label}" data-field="${field}" data-edition-change="updateJustificatif" data-track-id="${track.numero}" data-index="${index}">
            </div>
        `;
    },

    renderJustificatifTextarea(track, item, index, field, label, value = null) {
        return `
            <div class="form-group full-width">
                <label class="form-label">${label}</label>
                <textarea class="form-input" rows="3" placeholder="${label}" data-field="${field}" data-edition-change="updateJustificatif" data-track-id="${track.numero}" data-index="${index}">${value ?? this.getJustificatifFieldValue(item, field)}</textarea>
            </div>
        `;
    },

    renderLegacyJustificatifFields(track, item, index) {
        return `
            <details class="justificatif-legacy-fields">
                <summary>Champs historiques</summary>
                <div class="form-row">
                    ${this.renderJustificatifField(track, item, index, 'type', 'Type')}
                    ${this.renderJustificatifField(track, item, index, 'pertinence', 'Pertinence')}
                    ${this.renderJustificatifField(track, item, index, 'titre', 'Titre')}
                    ${this.renderJustificatifField(track, item, index, 'source', 'Source')}
                    ${this.renderJustificatifField(track, item, index, 'pays_origine', 'Pays origine')}
                    ${this.renderJustificatifField(track, item, index, 'annee', 'Année')}
                </div>
                ${this.renderJustificatifField(track, item, index, 'url', 'URL')}
            </details>
        `;
    },

    getJustificatifFieldValue(item, field) {
        if (field === 'resultat') return item.resultat || item.results?.text || '';
        return item[field] ?? '';
    },

    formatJustificatifList(value) {
        return Array.isArray(value) ? value.join('\n') : (value || '');
    },

    formatMetrics(metrics) {
        if (!Array.isArray(metrics)) return metrics || '';
        return metrics.map(metric => `${metric.name || ''}: ${metric.value || ''}`.trim()).join('\n');
    },

    formatCustomData(customData) {
        if (!customData || (typeof customData === 'object' && Object.keys(customData).length === 0)) return '';
        if (typeof customData === 'string') return customData;
        return JSON.stringify(customData, null, 2);
    },

    renderElementsTab(track) {
        const dispositifElements = track.dispositif_elements || {};
        const firstTypeWithItems = Object.keys(dispositifElements)
            .find(key => Array.isArray(dispositifElements[key]) && dispositifElements[key].length > 0);
        const selectedType = firstTypeWithItems || '';
        const elementTypes = Array.from(new Set([
            ...Object.keys(dispositifElements),
            ...Object.keys(this.TYPE_TITLES)
        ])).sort();
        const populatedTypes = elementTypes.filter(key =>
            Array.isArray(dispositifElements[key]) && dispositifElements[key].length > 0
        );

        return `
            <div class="form-section">
                <h3 class="section-subtitle">Tous les éléments</h3>
                <p class="elements-description">
                    ${populatedTypes.length > 0
                        ? `${populatedTypes.length} type(s) alimenté(s) sur ${elementTypes.length}. Les compteurs dans la liste indiquent les données présentes dans le XML.`
                        : `Aucun type alimenté pour cette piste.`
                    }
                </p>
                
                <div class="elements-selector">
                    <select class="element-type-select" data-edition-change="showElementTypeEditor" data-track-id="${track.numero}">
                        <option value="">Sélectionner un type d'élément</option>
                        ${elementTypes.map(key => `
                            <option value="${key}" ${key === selectedType ? 'selected' : ''}>${this.getElementTypeOptionLabel(key, dispositifElements)}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div id="element-type-editor" class="element-type-editor">
                    ${selectedType ? this.renderElementTypeEditor(track, selectedType) : '<p class="empty-message">Aucun élément disponible pour cette piste</p>'}
                </div>
            </div>
        `;
    },

    getElementTypeOptionLabel(type, dispositifElements = {}) {
        const count = Array.isArray(dispositifElements[type]) ? dispositifElements[type].length : 0;
        const icon = this.TYPE_ICONS[type] || '📌';
        const title = this.TYPE_TITLES[type] || type.replace(/_/g, ' ');
        return `${count > 0 ? '●' : '○'} ${icon} ${title} (${count})`;
    },

    // Méthodes utilitaires
    fieldValue(value) {
        return value === undefined || value === null ? '' : value;
    },

    ensureCompleteData(track) {
        if (!track.budget) track.budget = {};
        if (!track.dimensions) track.dimensions = {};
        if (!track.tags) track.tags = [];
        if (!track.dispositif_elements || typeof track.dispositif_elements !== 'object') track.dispositif_elements = {};
        if (!Array.isArray(track.phases)) track.phases = [];
        if (!track.indicateurs || typeof track.indicateurs !== 'object') track.indicateurs = {};
        ['activite', 'resultat', 'cle'].forEach((key) => {
            if (!Array.isArray(track.indicateurs[key])) track.indicateurs[key] = [];
        });
        if (!Array.isArray(track.avantages)) track.avantages = [];
        if (!Array.isArray(track.risques)) track.risques = [];
        if (!Array.isArray(track.justificatifs)) track.justificatifs = [];
        if (!track.documents) track.documents = [];
    },

    calculateDimensionsTotal(dimensions) {
        const total = (dimensions.culture || 0) + (dimensions.technique || 0) + 
                     (dimensions.humain || 0) + (dimensions.organisationnel || 0) + 
                     (dimensions.economique || 0);
        return total;
    },

    formatDate(date) {
        if (typeof date === 'string') date = new Date(date);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    getPriorityClass(priority) {
        const map = { 'P1': 'critical', 'P2': 'high', 'P3': 'medium', 'P4': 'low' };
        return map[priority] || 'medium';
    },

    getPriorityLabel(priority) {
        const map = { 'P1': 'CRITICAL', 'P2': 'HIGH', 'P3': 'MEDIUM', 'P4': 'LOW' };
        return map[priority] || 'MEDIUM';
    },

    getFilterPriorityStyle(priority, isActive) {
        const base = 'border:none;border-radius:999px;padding:3px 6px;font-size:10px;font-weight:600;cursor:pointer;display:inline-block;';
        const styles = {
            P1: { bg: '#fee2e2', fg: '#dc2626', activeBg: '#dc2626' },
            P2: { bg: '#ffedd5', fg: '#ea580c', activeBg: '#ea580c' },
            P3: { bg: '#fef9c3', fg: '#a16207', activeBg: '#a16207' },
            P4: { bg: '#dbeafe', fg: '#2563eb', activeBg: '#2563eb' }
        };
        const variant = styles[priority];
        if (!variant) return base;
        if (isActive) return `${base}background-color:${variant.activeBg};color:white;`;
        return `${base}background-color:${variant.bg};color:${variant.fg};`;
    },

    getFilterAllStyle(isActive) {
        const base = 'border:none;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;display:inline-block;';
        if (isActive) return `${base}background-color:var(--cdg-orange);color:white;`;
        return `${base}background-color:rgba(255,107,53,0.12);color:var(--cdg-orange);`;
    },

    normalizeTrackId(trackId) {
        return trackId == null ? '' : String(trackId);
    },

    isSameTrackId(leftId, rightId) {
        return this.normalizeTrackId(leftId) === this.normalizeTrackId(rightId);
    },

    findTrackById(allPistes, trackId) {
        return allPistes.find(t => this.isSameTrackId(t.numero, trackId)) || null;
    },

    // Méthodes CRUD et événements
    selectTrack(trackId) {
        this.selectedTrackId = this.normalizeTrackId(trackId);
        this.activeTab = 'general';
        this.rerender();
    },

    setActiveTab(tab) {
        this.activeTab = tab;
        this.rerender();
    },

    filterTracks(searchTerm) {
        this.searchTerm = searchTerm || '';
        const state = appStore ? appStore.getState() : {};
        this.applyFilters(state.allPistes || []);
        this.rerender();
    },

    setFilter(priority) {
        this.filterPriority = priority;
        const state = appStore ? appStore.getState() : {};
        this.applyFilters(state.allPistes || []);
        this.rerender();
    },

    applyFilters(allPistes) {
        const searchValue = this.searchTerm.toLowerCase();
        this.filteredTracks = allPistes.filter(track => {
            const trackTitle = (track.titre || '').toLowerCase();
            const trackNumero = (track.numero || '').toLowerCase();
            const trackPriority = track.priorite || '';
            const matchSearch =
                !searchValue ||
                trackTitle.includes(searchValue) ||
                trackNumero.includes(searchValue);

            const matchPriority =
                this.filterPriority === 'Tous' ||
                trackPriority === this.filterPriority;
            return matchSearch && matchPriority;
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
    },

    // Méthodes de mise à jour des champs
    updateField(trackId, field, value) {
        console.log(`Updating ${field} for ${trackId}:`, value);
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            track[field] = value;
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    updateNestedField(trackId, parent, field, value) {
        console.log(`Updating ${parent}.${field} for ${trackId}:`, value);
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track[parent]) track[parent] = {};
            track[parent][field] = value === '' ? '' : Number(value);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    updatePriority(trackId, priority) {
        this.updateField(trackId, 'priorite', priority);
        this.rerender();
    },

    updateDimension(trackId, dimension, value) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track.dimensions) track.dimensions = {};
            track.dimensions[dimension] = value === '' ? '' : Number(value);
            track.updated_at = new Date();
            
            // Mettre à jour l'affichage du total
            const total = this.calculateDimensionsTotal(track.dimensions);
            const totalElement = document.getElementById('dimension-total');
            if (totalElement) totalElement.textContent = total + '%';
            
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    handleTagInput(event, trackId) {
        if (event.key === 'Enter') {
            const input = event.target;
            const tag = input.value.trim();
            if (tag) {
                const state = appStore.getState();
                const track = state.allPistes.find(t => t.numero === trackId);
                if (track) {
                    if (!track.tags) track.tags = [];
                    if (!track.tags.includes(tag)) {
                        track.tags.push(tag);
                        track.updated_at = new Date();
                        if (window.appStore && window.appActions) {
                            appActions.updatePiste(track);
                        }
                    }
                }
                input.value = '';
                this.rerender();
            }
        }
    },

    removeTag(trackId, tag) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.tags) {
            track.tags = track.tags.filter(t => t !== tag);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes pour les phases
    addPhase(trackId) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track.phases) track.phases = [];
            track.phases.push({
                nom: '',
                etape_duree: '',
                activites: '',
                objectifs_etape: '',
                livrable_etape: ''
            });
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    updatePhase(trackId, index, field, value) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.phases && track.phases[index]) {
            track.phases[index][field] = value;
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    removePhase(trackId, index) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.phases) {
            track.phases.splice(index, 1);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes pour les indicateurs
    addIndicateur(trackId, type) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track.indicateurs) track.indicateurs = { activite: [], resultat: [], cle: [] };
            if (!track.indicateurs[type]) track.indicateurs[type] = [];
            
            track.indicateurs[type].push({
                nom: '',
                cible: '',
                unite: '',
                periodicite: ''
            });
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    updateIndicateur(trackId, type, index, field, value) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.indicateurs && track.indicateurs[type] && track.indicateurs[type][index]) {
            track.indicateurs[type][index][field] = value;
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    removeIndicateur(trackId, type, index) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.indicateurs && track.indicateurs[type]) {
            track.indicateurs[type].splice(index, 1);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes pour les avantages
    addAvantage(trackId) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track.avantages) track.avantages = [];
            track.avantages.push({
                beneficiaire: '',
                texte: ''
            });
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    updateAvantage(trackId, index, field, value) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.avantages && track.avantages[index]) {
            track.avantages[index][field] = value;
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    removeAvantage(trackId, index) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.avantages) {
            track.avantages.splice(index, 1);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes pour les risques
    addRisque(trackId) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track.risques) track.risques = [];
            track.risques.push({
                nom: '',
                probabilite: '',
                gravite: '',
                mitigation: ''
            });
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    updateRisque(trackId, index, field, value) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.risques && track.risques[index]) {
            track.risques[index][field] = value;
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    removeRisque(trackId, index) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.risques) {
            track.risques.splice(index, 1);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes pour les justificatifs
    addJustificatif(trackId) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track.justificatifs) track.justificatifs = [];
            track.justificatifs.push({
                id: '',
                type: '',
                titre: '',
                title: '',
                subtitle: '',
                organization: '',
                source: '',
                country: '',
                year: '',
                pays_origine: '',
                annee: '',
                url: '',
                resultat: '',
                pertinence: '',
                description: '',
                links: [],
                technologies: [],
                results: { metrics: [], text: '' },
                lesson: '',
                inspirations: [],
                customData: {}
            });
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    updateJustificatif(trackId, index, field, value) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.justificatifs && track.justificatifs[index]) {
            const justificatif = track.justificatifs[index];
            this.setJustificatifField(justificatif, field, value);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    setJustificatifField(justificatif, field, value) {
        const asList = text => String(text || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
        const sync = (target, nextValue) => {
            justificatif[target] = nextValue;
        };

        switch (field) {
            case 'pertinence':
                justificatif.pertinence = value === '' ? '' : parseInt(value, 10);
                break;
            case 'links':
                justificatif.links = asList(value);
                justificatif.url = justificatif.links[0] || '';
                break;
            case 'technologies':
                justificatif.technologies = asList(value);
                break;
            case 'inspirations':
                justificatif.inspirations = asList(value);
                break;
            case 'results_metrics':
                justificatif.results = justificatif.results || {};
                justificatif.results.metrics = asList(value).map(line => {
                    const [name, ...rest] = line.split(':');
                    return { name: name.trim(), value: rest.join(':').trim() };
                });
                break;
            case 'resultat':
                justificatif.resultat = value;
                justificatif.results = justificatif.results || {};
                justificatif.results.text = value;
                break;
            case 'customData':
                try {
                    justificatif.customData = value.trim() ? JSON.parse(value) : {};
                } catch (error) {
                    justificatif.customData = value;
                }
                break;
            case 'title':
                sync('title', value);
                sync('titre', value);
                break;
            case 'organization':
                sync('organization', value);
                sync('source', value);
                break;
            case 'country':
                sync('country', value);
                sync('pays_origine', value);
                break;
            case 'year':
                sync('year', value);
                sync('annee', value);
                break;
            default:
                justificatif[field] = value;
        }
    },

    removeJustificatif(trackId, index) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.justificatifs) {
            track.justificatifs.splice(index, 1);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes pour les éléments du dispositif
    addElement(trackId, type) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            if (!track.dispositif_elements) track.dispositif_elements = {};
            if (!track.dispositif_elements[type]) track.dispositif_elements[type] = [];
            
            track.dispositif_elements[type].push({
                nom: '',
                description: ''
            });
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    updateElement(trackId, type, index, field, value) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.dispositif_elements && track.dispositif_elements[type] && track.dispositif_elements[type][index]) {
            track.dispositif_elements[type][index][field] = value;
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
        }
    },

    removeElement(trackId, type, index) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.dispositif_elements && track.dispositif_elements[type]) {
            track.dispositif_elements[type].splice(index, 1);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes pour les documents
    addDocument(trackId) {
        // Simulation d'ajout de document
        alert('Fonctionnalité d\'ajout de document à implémenter');
    },

    removeDocument(trackId, docId) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track && track.documents) {
            track.documents = track.documents.filter(d => d.id !== docId);
            track.updated_at = new Date();
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            this.rerender();
        }
    },

    // Méthodes générales
    createNewTrack() {
        alert('Création d\'une nouvelle piste à implémenter');
    },

    deleteTrack(trackId) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la piste ${trackId} ?`)) {
            const state = appStore.getState();
            const updatedPistes = state.allPistes.filter(t => t.numero !== trackId);
            if (window.appStore && window.appActions) {
                appActions.setAllPistes(updatedPistes);
            }
            this.selectedTrackId = updatedPistes[0]?.numero || null;
            this.rerender();
        }
    },

    cancelEdit() {
        if (confirm('Annuler les modifications non enregistrées ?')) {
            // Recharger les données depuis le store
            this.rerender();
        }
    },

    viewTrack(trackId) {
        if (window.router) {
            router.navigate(`/piste-detail/${trackId}`);
        }
    },

    saveTrack(trackId) {
        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (track) {
            track.updated_at = new Date();
            track.updated_by = 'C. Dubuisson';
            
            if (window.appStore && window.appActions) {
                appActions.updatePiste(track);
            }
            
            if (window.Notifications) {
                Notifications.success(`Piste ${trackId} enregistrée avec succès`);
            } else {
                alert(`Piste ${trackId} enregistrée avec succès`);
            }
        }
    },

    showElementTypeEditor(trackId, type) {
        if (!type) return;

        const editor = document.getElementById('element-type-editor');
        if (!editor) return;

        const state = appStore.getState();
        const track = state.allPistes.find(t => t.numero === trackId);
        if (!track) return;

        editor.innerHTML = this.renderElementTypeEditor(track, type);
    },

    renderElementTypeEditor(track, type) {
        if (!track.dispositif_elements) track.dispositif_elements = {};
        if (!track.dispositif_elements[type]) track.dispositif_elements[type] = [];

        const trackId = track.numero;
        const items = track.dispositif_elements[type];
        const icon = this.TYPE_ICONS[type] || '📌';
        const title = this.TYPE_TITLES[type] || type;

        let html = `
            <div class="element-type-editor-header">
                <h4>${icon} ${title}</h4>
                <button class="btn-add-element-small" data-edition-action="addElement" data-track-id="${trackId}" data-type="${type}">
                    <span class="material-icons">add</span>
                    Ajouter
                </button>
            </div>
            <div class="element-type-editor-list">
        `;
        
        if (items.length === 0) {
            html += '<p class="empty-message">Aucun élément de ce type</p>';
        } else {
            items.forEach((item, index) => {
                const fields = this.getElementEditableFields(item);
                html += `
                    <div class="element-type-editor-item">
                        <div class="item-header">
                            <input type="text" value="${item.nom || ''}" placeholder="Nom" data-type="${type}" data-index="${index}" data-field="nom" data-edition-change="updateElement" data-track-id="${trackId}" data-type="${type}" data-index="${index}" data-field="nom">
                            <button class="item-remove" data-edition-action="removeElement" data-track-id="${trackId}" data-type="${type}" data-index="${index}">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                        <div class="element-dynamic-fields">
                            ${fields.map(field => this.renderElementField(trackId, type, index, field, item[field])).join('')}
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        return html;
    },

    getElementEditableFields(item) {
        const preferredOrder = ['description'];
        const ignoredFields = new Set(['nom', 'attributes']);
        const keys = Object.keys(item || {}).filter(key => !ignoredFields.has(key));
        return [
            ...preferredOrder.filter(key => keys.includes(key)),
            ...keys.filter(key => !preferredOrder.includes(key)).sort()
        ];
    },

    formatElementFieldLabel(field) {
        return field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    },

    renderElementField(trackId, type, index, field, value) {
        const stringValue = value === undefined || value === null ? '' : String(value);
        const escapedValue = Utils.escapeHtml(stringValue);
        const label = this.formatElementFieldLabel(field);
        const commonAttributes = `data-type="${type}" data-index="${index}" data-field="${field}" data-edition-change="updateElement" data-track-id="${trackId}"`;

        return `
            <label class="element-dynamic-field">
                <span>${label}</span>
                ${stringValue.length > 80 || field === 'description'
                    ? `<textarea placeholder="${label}" ${commonAttributes}>${escapedValue}</textarea>`
                    : `<input type="text" value="${escapedValue}" placeholder="${label}" ${commonAttributes}>`
                }
            </label>
        `;
    },

    setupEventListeners() {
        console.log('Setup event listeners - Edition enrichie');
        const root = document.querySelector('.edition-wrapper');
        if (!root) return;

        root.addEventListener('click', event => {
            const target = event.target.closest('[data-edition-action]');
            if (!target || !root.contains(target)) return;

            const { editionAction: action, trackId, type, value, index } = target.dataset;
            const rowIndex = index == null ? null : Number(index);
            const calls = {
                createNewTrack: () => this.createNewTrack(),
                cancelEdit: () => this.cancelEdit(),
                setFilter: () => this.setFilter(value),
                setActiveTab: () => this.setActiveTab(value),
                selectTrack: () => this.selectTrack(trackId),
                deleteTrack: () => this.deleteTrack(trackId),
                viewTrack: () => this.viewTrack(trackId),
                saveTrack: () => this.saveTrack(trackId),
                updatePriority: () => this.updatePriority(trackId, value),
                removeTag: () => this.removeTag(trackId, value),
                addElement: () => this.addElement(trackId, type),
                removeElement: () => this.removeElement(trackId, type, rowIndex),
                addPhase: () => this.addPhase(trackId),
                removePhase: () => this.removePhase(trackId, rowIndex),
                addIndicateur: () => this.addIndicateur(trackId, type),
                removeIndicateur: () => this.removeIndicateur(trackId, type, rowIndex),
                addAvantage: () => this.addAvantage(trackId),
                removeAvantage: () => this.removeAvantage(trackId, rowIndex),
                addRisque: () => this.addRisque(trackId),
                removeRisque: () => this.removeRisque(trackId, rowIndex),
                addJustificatif: () => this.addJustificatif(trackId),
                removeJustificatif: () => this.removeJustificatif(trackId, rowIndex),
                addDocument: () => this.addDocument(trackId),
                removeDocument: () => this.removeDocument(trackId, value)
            };

            if (calls[action]) calls[action]();
        });

        root.addEventListener('input', event => {
            const target = event.target;
            if (target.dataset.editionInput === 'filterTracks') {
                this.filterTracks(target.value);
            } else if (target.dataset.editionInput === 'updateDimension') {
                this.updateDimension(target.dataset.trackId, target.dataset.dimension, target.value);
            }
        });

        root.addEventListener('change', event => {
            const target = event.target;
            const { editionChange: action, trackId, parent, field, dimension, type, index } = target.dataset;
            if (!action) return;

            const rowIndex = index == null ? null : Number(index);
            const calls = {
                updateField: () => this.updateField(trackId, field, target.value),
                updateNestedField: () => this.updateNestedField(trackId, parent, field, target.value),
                updateDimension: () => this.updateDimension(trackId, dimension, target.value),
                updatePhase: () => this.updatePhase(trackId, rowIndex, field, target.value),
                updateIndicateur: () => this.updateIndicateur(trackId, type, rowIndex, field, target.value),
                updateAvantage: () => this.updateAvantage(trackId, rowIndex, field, target.value),
                updateRisque: () => this.updateRisque(trackId, rowIndex, field, target.value),
                updateJustificatif: () => this.updateJustificatif(trackId, rowIndex, field, target.value),
                updateElement: () => this.updateElement(trackId, type, rowIndex, field, target.value),
                showElementTypeEditor: () => this.showElementTypeEditor(trackId, target.value)
            };

            if (calls[action]) calls[action]();
        });

        root.addEventListener('keydown', event => {
            const target = event.target.closest('[data-edition-keydown]');
            if (!target) return;
            if (target.dataset.editionKeydown === 'handleTagInput') {
                this.handleTagInput(event, target.dataset.trackId);
                return;
            }
            if (target.dataset.editionKeydown === 'activateAction' &&
                (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                target.click();
            }
        });
        
        // Initialiser les écouteurs pour les sliders de dimensions
        document.querySelectorAll('.dimension-slider').forEach(slider => {
            slider.addEventListener('input', function() {
                const dim = this.dataset.dim;
                const input = document.querySelector(`.dimension-input[data-dim="${dim}"]`);
                if (input) input.value = this.value;
            });
        });
        
        document.querySelectorAll('.dimension-input').forEach(input => {
            input.addEventListener('change', function() {
                const dim = this.dataset.dim;
                const slider = document.querySelector(`.dimension-slider[data-dim="${dim}"]`);
                if (slider) slider.value = this.value;
            });
        });
    }
};

window.pages = window.pages || {};
window.pages.Edition = pages.Edition;
