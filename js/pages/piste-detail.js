/**
 * PAGES/PISTE-DETAIL.JS - Page de détail d'une piste (VERSION ULTRA COMPLÈTE)
 * Inspirée du script Python export2html.py avec tous les types d'éléments
 */

pages.PisteDetail = {
    currentPiste: null,
    radarChartInstance: null,
    viewMode: 'compact',

    // Mapping des icônes par type d'élément
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

    // Mapping des couleurs par priorité
    PRIORITY_COLORS: {
        'P1': '#EF4444',  // Rouge pour Quick Wins
        'P2': '#F59E0B',  // Orange pour Stratégiques
        'P3': '#FF6B35',  // Orange clair pour Complémentaires
        'P4': '#3B82F6',  // Bleu pour Long terme
    },

    async render() {
        // Extraire l'ID de l'URL
        let path = (window.router && window.router.currentPath) || window.location.pathname || '/';
        path = path.split('?')[0];
        const segments = path.split('/').filter(s => s.length > 0);
        let pisteId = segments[segments.length - 1];
        
        console.log('📌 Détail pour piste ID:', pisteId);

        // Attendre que les pistes soient chargées
        const state = appStore.getState();
        let pistes = state.allPistes;
        
        if (!pistes || pistes.length === 0) {
            console.log('⏳ Attente du chargement des pistes...');
            await new Promise(resolve => setTimeout(resolve, 500));
            const newState = appStore.getState();
            pistes = newState.allPistes;
        }

        const piste = Utils.escapeDeep(pistes?.find(p => p.numero === pisteId));

        if (!piste) {
            return `
                <div class="detail-wrapper">
                    <div class="error-page">
                        <h2>Piste non trouvée</h2>
                        <p>ID recherché: ${pisteId}</p>
                        <button onclick="pages.PisteDetail.goBack()" class="btn-back">
                            ← Retour
                        </button>
                    </div>
                </div>
            `;
        }

        this.currentPiste = piste;

        // Grouper les éléments par type (simulation - à remplacer par des données réelles)
        const elementsByType = this.groupElementsByType(piste);

        return `
            <div class="container" id="pdf-content">
                <!-- Barre d'actions en haut -->
                <div class="action-bar">
                    <button class="btn-back-nav" onclick="pages.PisteDetail.goBack()">
                        <span class="material-symbols-outlined">arrow_back</span>
                        Retour
                    </button>
                    <div class="action-buttons">
                        <div class="detail-view-toggle" role="group" aria-label="Mode d'affichage">
                            <button class="btn-view-mode ${this.viewMode === 'compact' ? 'active' : ''}" onclick="pages.PisteDetail.setViewMode('compact')">
                                Compact
                            </button>
                            <button class="btn-view-mode ${this.viewMode === 'detailed' ? 'active' : ''}" onclick="pages.PisteDetail.setViewMode('detailed')">
                                Détaillé
                            </button>
                        </div>
                        ${this.renderSectionShortcuts(piste, elementsByType)}
                        <button class="btn-pdf" onclick="pages.PisteDetail.exportToPDF()">
                            <span class="material-symbols-outlined">picture_as_pdf</span>
                            Exporter en PDF
                        </button>
                        <button class="btn-print" onclick="window.print()">
                            <span class="material-symbols-outlined">print</span>
                            Imprimer
                        </button>
                    </div>
                </div>

                <!-- Header -->
                <div class="header" style="background: linear-gradient(135deg, var(--cdg-navy) 0%, #0055a8 100%);">
                    <div class="badge-piste">${piste.numero || 'N/A'}</div>
                    <h1>${piste.titre || 'Sans titre'}</h1>
                    <h2>${piste.titre_long || ''}</h2>
                    <div>
                        <span class="badge" style="background-color: ${this.getPriorityColor(piste.priorite)}; color: white;">${Utils.getPriorityLabel(piste.priorite)}</span>
                        <span class="badge" style="background-color: var(--gray-600); color: white;">${piste.categorie || 'N/A'}</span>
                        <span class="badge" style="background-color: var(--info); color: white;">${piste.famille || 'N/A'}</span>
                    </div>
                </div>
            
                <!-- Description -->
                <div class="section" id="section-description">
                    <div class="section-title"><span>📝</span> Description</div>
                    <p style="font-size: 1.1em; margin-bottom: 20px;">${piste.description || ''}</p>
                    <div class="info-card">
                        <h3>Description détaillée</h3>
                        <p>${piste.description_longue || piste.description || 'Aucune description détaillée disponible'}</p>
                    </div>
                </div>
            
                <!-- Indicateurs clés -->
                <div class="section" id="section-indicateurs">
                    <div class="section-title"><span>📊</span> Indicateurs clés</div>
                    <div class="grid-3">
                        <div class="stat-box">
                            <div class="stat-value">${this.formatBudget(piste.budget?.cout_3_ans || 0)}</div>
                            <div class="stat-label">Budget total 3 ans</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${piste.delai_texte || piste.delai_mois + ' mois' || 'N/A'}</div>
                            <div class="stat-label">Délai de déploiement</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${piste.impact_score || 0}/100</div>
                            <div class="stat-label">Score d'impact</div>
                        </div>
                    </div>
            
                    <div style="margin-top: 30px;">
                        <h3>Détail du budget</h3>
                        <table class="table">
                            <tr><td>Budget 2026</td><td>${this.formatBudget(piste.budget?.cout_2026 || 0)}</td></tr>
                            <tr><td>Budget 2027</td><td>${this.formatBudget(piste.budget?.cout_2027 || 0)}</td></tr>
                            <tr><td>Budget 2028</td><td>${this.formatBudget(piste.budget?.cout_2028 || 0)}</td></tr>
                            <tr><td>Coût récurrent annuel</td><td>${this.formatBudget(piste.budget?.cout_recurrent_annuel || 0)}</td></tr>
                        </table>
                    </div>
                </div>
            
                <!-- Délai de retour et impact -->
                <div class="section">
                    <div class="grid-2">
                        <div class="info-card">
                            <h3>📈 Délai de retour sur investissement</h3>
                            <p><strong>Délai de retour :</strong> ${piste.roi_texte || piste.roi_mois + ' mois' || 'N/A'}</p>
                        </div>
                        <div class="info-card">
                            <h3>🎯 Impact attendu</h3>
                            <p>${piste.impact_texte || ''}</p>
                            <p><strong>Accidents évités estimés :</strong> ${piste.impact_accidents_evites || 0}/an</p>
                            <p><strong>Économies estimées :</strong> ${this.formatBudget(piste.impact_economies || 0)}/an</p>
                        </div>
                    </div>
                </div>
            
                <!-- Matrice d'évaluation -->
                <div class="section">
                    <div class="section-title"><span>📐</span> Matrice d'évaluation</div>
                    <div class="grid-2">
                        <div>
                            <h3>Niveau d'impact</h3>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(piste.niveau_impact || 0) * 25}%;"></div>
                            </div>
                            <p>Niveau ${piste.niveau_impact || 0}/4</p>
                        </div>
                        <div>
                            <h3>Niveau de faisabilité</h3>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(piste.niveau_faisabilite || 0) * 25}%;"></div>
                            </div>
                            <p>Niveau ${piste.niveau_faisabilite || 0}/4</p>
                        </div>
                    </div>
                </div>
                
                <!-- Tags -->
                ${piste.tags && piste.tags.length > 0 ? `
                <div class="section">
                    <div class="section-title"><span>🏷️</span> Tags</div>
                    <div>
                        ${piste.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- Dimensions Balancing -->
                <div class="section" id="section-dimensions">
                    <div class="section-title"><span>📊</span> Dimensions Balancing</div>
                   
                    <div style="display: flex; justify-content: center; margin-bottom: 20px;">
                        <div style="width: 100%; max-width: 500px;">
                            <canvas id="radarChart" width="400" height="400"></canvas>
                        </div>
                    </div>
                    
                    <!-- Légende des dimensions -->
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
                        <div style="display: flex; align-items: center;">
                            <div style="width: 12px; height: 12px; background-color: rgba(0, 61, 130, 0.2); border: 2px solid rgba(0, 61, 130, 1); border-radius: 3px; margin-right: 5px;"></div>
                            <span style="font-size: 0.9em;">Culture: ${piste.dimensions?.culture || 0}%</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 12px; height: 12px; background-color: rgba(0, 61, 130, 0.2); border: 2px solid rgba(0, 61, 130, 1); border-radius: 3px; margin-right: 5px;"></div>
                            <span style="font-size: 0.9em;">Tech: ${piste.dimensions?.technique || 0}%</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 12px; height: 12px; background-color: rgba(0, 61, 130, 0.2); border: 2px solid rgba(0, 61, 130, 1); border-radius: 3px; margin-right: 5px;"></div>
                            <span style="font-size: 0.9em;">Humain: ${piste.dimensions?.humain || 0}%</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 12px; height: 12px; background-color: rgba(0, 61, 130, 0.2); border: 2px solid rgba(0, 61, 130, 1); border-radius: 3px; margin-right: 5px;"></div>
                            <span style="font-size: 0.9em;">Organisationnel: ${piste.dimensions?.organisationnel || 0}%</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div style="width: 12px; height: 12px; background-color: rgba(0, 61, 130, 0.2); border: 2px solid rgba(0, 61, 130, 1); border-radius: 3px; margin-right: 5px;"></div>
                            <span style="font-size: 0.9em;">Économique: ${piste.dimensions?.economique || 0}%</span>
                        </div>
                    </div>
                </div>
            
                ${this.viewMode === 'detailed' ? `
                <!-- SECTION DETAILS DU DISPOSITIF -->
                <div class="section" id="section-dispositif">
                    <div class="section-title"><span>details</span> Details du dispositif</div>

                    ${this.renderAllElementsByType(elementsByType)}

                </div>
                ` : ''}
                <!-- Avantages -->
                ${piste.avantages && piste.avantages.length > 0 ? `
                <div class="section">
                    <div class="section-title"><span>✅</span> Avantages</div>
                    <table class="table">
                        <tr><th>Bénéficiaire</th><th>Avantage</th></tr>
                        ${piste.avantages.map(av => `
                        <tr>
                            <td>${av.beneficiaire || 'N/A'}</td>
                            <td>${av.texte || 'N/A'}</td>
                        </tr>
                        `).join('')}
                    </table>
                </div>
                ` : ''}
            
                <!-- Risques et mitigation -->
                ${piste.risques && piste.risques.length > 0 ? `
                <div class="section">
                    <div class="section-title"><span>⚠️</span> Risques et mitigation</div>
                    <table class="table">
                        <tr><th>Risque</th><th>Probabilité</th><th>Gravité</th><th>Mitigation</th></tr>
                        ${piste.risques.map(r => this.renderRiskRow(r)).join('')}
                    </table>
                </div>
                ` : ''}
            
                <!-- Justificatifs et sources -->
                ${piste.justificatifs && piste.justificatifs.length > 0 ? `
                <div class="section" id="section-justificatifs">
                    <div class="section-title"><span>📚</span> Justificatifs et sources</div>
                    <table class="table">
                        <tr><th colspan="5">References documentees</th></tr>
                        ${piste.justificatifs.map(j => this.renderJustificatifCardRow(j)).join('')}
                    </table>
                </div>
                ` : ''}
            
                <!-- Actions >
                <div class="section" style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn-primary" onclick="pages.PisteDetail.addToScenario('${piste.numero}')">
                        <span class="material-symbols-outlined">add_circle</span>
                        Ajouter au scénario
                    </button>
                </div-->
            


            </div>
        `;
    },

    renderSectionShortcuts(piste, elementsByType) {
        const shortcuts = [
            { id: 'section-description', label: 'Description', icon: 'description' },
            { id: 'section-indicateurs', label: 'Indicateurs', icon: 'monitoring' },
            { id: 'section-dimensions', label: 'Dimensions', icon: 'donut_large' }
        ];

        if (this.viewMode === 'detailed' && Object.keys(elementsByType || {}).length > 0) {
            shortcuts.push({ id: 'section-dispositif', label: 'Dispositif', icon: 'construction' });
        }

        if (Array.isArray(piste.justificatifs) && piste.justificatifs.length > 0) {
            shortcuts.push({ id: 'section-justificatifs', label: 'Sources', icon: 'menu_book' });
        }

        return `
            <nav class="section-shortcuts" aria-label="Raccourcis de section">
                ${shortcuts.map(shortcut => `
                    <button class="btn-section-shortcut" onclick="pages.PisteDetail.scrollToSection('${shortcut.id}')" title="${shortcut.label}">
                        <span class="material-symbols-outlined">${shortcut.icon}</span>
                        <span>${shortcut.label}</span>
                    </button>
                `).join('')}
            </nav>
        `;
    },

    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /**
     * Groupe les éléments par type pour faciliter le rendu
     */
    groupElementsByType(piste) {
        const source = piste?.dispositif_elements || {};
        const hiddenTypes = new Set(['temoignage', 'visuel', 'question']);
        return Object.keys(source).reduce((elementsByType, type) => {
            if (hiddenTypes.has(type)) return elementsByType;
            if (Array.isArray(source[type]) && source[type].length > 0) {
                elementsByType[type] = source[type];
            }
            return elementsByType;
        }, {});
    },
    /**
     * Rend tous les éléments groupés par type
     */
    renderAllElementsByType(elementsByType) {
        let html = '';

        // Ordre d'affichage des types d'éléments
        const orderedTypes = [
            'problematique',
            'principe',
            'perimetre',
            'perimetre_deploiement',
            'approche_technologique',
            'approche_humaine',
            'dispositif_technique',
            'technologie',
            'etat_lieux',
            'emps',
            'plan_controles',
            'rotation_zones',
            'bareme',
            'seuil',
            'seuil_alcool',
            'seuil_stupefiant',
            'recidive',
            'reconquete',
            'modalite',
            'articulation_disciplinaire',
            'articulation_p1',
            'complementarite',
            'complementarite_audits',
            'base_legale',
            'obligation',
            'obligation_prealable',
            'condition_juridique',
            'investissement',
            'economie',
            'comparaison',
            'phase',
            'indicateur',
            'indicateur_activite',
            'indicateur_resultat',
            'indicateur_cle',
            'question',
            'question_technique',
            'question_operationnelle',
            'message_cle',
            'demande',
            'visuel',
            'video_profil',
            'affichage_zone',
            'scenario_vr',
            'objectif_adoption',
            'indicateur_impact'
        ];

        const processedTypes = new Set();

        for (const type of orderedTypes) {
            if (processedTypes.has(type)) continue;
            
            const elements = elementsByType[type];
            if (!elements || elements.length === 0) continue;

            const icon = this.TYPE_ICONS[type] || '📌';
            const title = this.TYPE_TITLES[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            // Style spécial pour la problématique
            if (type === 'problematique') {
                html += `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #e74c3c;">${title}</h3>
                ${this.renderElementGroup(type, elements)}
            </div>
                `;
            } else {
                html += `
            <div style="margin-bottom: 30px;">
                <h3>${title}</h3>
                ${this.renderElementGroup(type, elements)}
            </div>
                `;
            }

            processedTypes.add(type);
        }

        Object.keys(elementsByType)
            .filter(type => !processedTypes.has(type))
            .sort()
            .forEach(type => {
                const elements = elementsByType[type];
                if (!elements || elements.length === 0) return;

                const title = this.TYPE_TITLES[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                html += `
            <div style="margin-bottom: 30px;">
                <h3>${title}</h3>
                ${this.renderElementGroup(type, elements)}
            </div>
                `;
                processedTypes.add(type);
            });

        return html;
    },

    /**
     * Rend un groupe d'éléments selon leur type
     */
    renderElementGroup(type, elements) {
        switch(type) {
            case 'bareme':
                return this.renderBaremeElements(elements);
            
            case 'seuil':
                return this.renderSeuilElements(elements);
            
            case 'seuil_alcool':
            case 'seuil_stupefiant':
                return this.renderSeuilTableElements(elements);
            
            case 'obligation':
            case 'obligation_prealable':
                return this.renderObligationElements(elements);
            
            case 'condition_juridique':
                return this.renderConditionJuridiqueElements(elements);
            
            case 'complementarite':
            case 'complementarite_audits':
                return this.renderComplementariteElements(elements);
            
            case 'indicateur':
            case 'indicateur_activite':
            case 'indicateur_resultat':
            case 'indicateur_cle':
                return this.renderIndicateurElements(elements);
            
            case 'investissement':
            case 'economie':
                return this.renderInvestissementElements(elements);
            
            case 'phase':
                return this.renderPhaseElements(elements);
            
            case 'question':
            case 'question_technique':
            case 'question_operationnelle':
                return this.renderQuestionElements(elements);
            
            case 'visuel':
                return this.renderVisuelElements(elements);
            
            case 'video_profil':
                return this.renderVideoProfilElements(elements);
            
            case 'affichage_zone':
                return this.renderAffichageZoneElements(elements);
            
            case 'scenario_vr':
                return this.renderScenarioVRElements(elements);
            
            case 'objectif_adoption':
                return this.renderObjectifAdoptionElements(elements);
            
            case 'indicateur_impact':
                return this.renderIndicateurImpactElements(elements);
            
            default:
                return this.renderDefaultElements(elements);
        }
    },

    renderBaremeElements(elements) {
        let html = '<div class="points-grid">';
        elements.forEach(elem => {
            const classe = elem.libelle_infraction || 'modérée';
            const points = elem.meta_donnees || '-';
            html += `
                <div class="points-card ${classe}">
                    <h4>${elem.nom}</h4>
                    <div class="points negatif">${points}</div>
                    <div><strong>Gravité :</strong> ${classe}</div>
                    <div class="constat">
                        <strong>Constat :</strong> ${elem.description || ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    renderSeuilElements(elements) {
        let html = '';
        elements.forEach(elem => {
            const couleur = elem.couleur_hex || '#667eea';
            html += `
                <div class="seuil-bar">
                    <div class="seuil-indicator" style="background-color: ${couleur};"></div>
                    <div class="seuil-range">${elem.seuil_min || ''}-${elem.seuil_max || ''} points</div>
                    <div class="seuil-info">
                        <strong>${elem.statut || ''}</strong><br>
                        <span class="seuil-consequences">${elem.consequences || ''}</span>
                    </div>
                </div>
                <div style="margin-left: 45px; margin-bottom: 15px; font-size: 0.9em; color: #718096;">
                    ${elem.mesures_accompagnement || ''}
                </div>
            `;
        });
        return html;
    },

    renderSeuilTableElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Seuil</th><th>Qualification</th><th>Conséquence immédiate</th><th>Suivi</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td><strong>${elem.nom}</strong></td>
                    <td>${elem.meta_donnees || ''}</td>
                    <td>${elem.consequences || ''}</td>
                    <td>${elem.mesures_accompagnement || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderObligationElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Action</th><th>Autorité compétente</th><th>Délai estimé</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td>${elem.nom}</td>
                    <td>${elem.meta_donnees || ''}</td>
                    <td>${elem.etape_duree || elem.description || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderConditionJuridiqueElements(elements) {
        let html = '<ol style="padding-left: 20px;">';
        elements.forEach(elem => {
            html += `
                <li><strong>${elem.nom}</strong> : ${elem.description}</li>
            `;
        });
        html += '</ol>';
        return html;
    },

    renderComplementariteElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Action CSCE/CSCA</th><th>Notre proposition</th><th>Plus-value</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td><strong>${elem.nom}</strong></td>
                    <td>${elem.meta_donnees || ''}</td>
                    <td>${elem.description || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderIndicateurElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Indicateur</th><th>Cible</th><th>Périodicité</th></tr>
        `;
        elements.forEach(elem => {
            const cible = elem.cible || '';
            const unite = elem.unite || '';
            let cibleDisplay = cible;
            if (unite === '%' && !cible.includes('%')) {
                cibleDisplay = `${cible} %`;
            } else if (unite && !cible.includes(unite)) {
                cibleDisplay = `${cible} ${unite}`.trim();
            }
            
            html += `
                <tr>
                    <td>${elem.nom}</td>
                    <td>${cibleDisplay}</td>
                    <td>${elem.periodicite || '-'}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderInvestissementElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Poste</th><th>Détail</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td>${elem.nom}</td>
                    <td>${elem.description}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderPhaseElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Phase</th><th>Durée</th><th>Activités</th><th>Objectifs</th><th>Livrable</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td><strong>${elem.nom}</strong></td>
                    <td>${elem.etape_duree || '-'}</td>
                    <td>${elem.activites || '-'}</td>
                    <td>${elem.objectifs_etape || '-'}</td>
                    <td>${elem.livrable_etape || '-'}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderQuestionElements(elements) {
        let html = '<ol style="padding-left: 20px;">';
        elements.forEach(elem => {
            html += `<li>${elem.description}</li>`;
        });
        html += '</ol>';
        return html;
    },

    renderVisuelElements(elements) {
        let html = '<div class="visuel-synthese">';
        elements.forEach(elem => {
            if (elem.nom === 'Titre') {
                html += `
                    <div style="text-align: center; font-weight: bold; margin-bottom: 15px;">
                        ${elem.description}
                    </div>
                `;
            } else {
                html += `
                    <div><strong>${elem.nom}:</strong> ${elem.description}</div>
                `;
            }
        });
        html += '</div>';
        return html;
    },

    renderVideoProfilElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Profil conducteur</th><th>Vidéo recommandée</th><th>Angle pédagogique</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td><strong>${elem.nom}</strong></td>
                    <td>${elem.meta_donnees || ''}</td>
                    <td>${elem.description || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderAffichageZoneElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Zone</th><th>Thème prioritaire</th><th>Rotation</th><th>Responsable</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td><strong>${elem.nom}</strong></td>
                    <td>${elem.meta_donnees || ''}</td>
                    <td>${elem.meta_donnees2 || ''}</td>
                    <td>${elem.description || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderScenarioVRElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Scénario VR</th><th>Durée</th><th>Compétence visée</th><th>Public prioritaire</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td><strong>${elem.nom}</strong></td>
                    <td>${elem.meta_donnees || ''}</td>
                    <td>${elem.meta_donnees2 || ''}</td>
                    <td>${elem.description || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderObjectifAdoptionElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Échéance</th><th>Taux d'installation</th><th>Taux d'utilisation hebdomadaire</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td><strong>${elem.nom}</strong></td>
                    <td>${elem.meta_donnees || ''}</td>
                    <td>${elem.meta_donnees2 || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderIndicateurImpactElements(elements) {
        let html = `
            <table class="table">
                <tr><th>Indicateur</th><th>Cible</th><th>Source</th></tr>
        `;
        elements.forEach(elem => {
            html += `
                <tr>
                    <td>${elem.nom}</td>
                    <td>${elem.cible || ''}</td>
                    <td>${elem.source_mesure || ''}</td>
                </tr>
            `;
        });
        html += '</table>';
        return html;
    },

    renderDefaultElements(elements) {
        if (this.shouldRenderElementsAsTable(elements)) {
            return this.renderGenericElementsTable(elements);
        }

        let html = '';
        elements.forEach(elem => {
            const title = elem.nom || elem.risque || elem.titre || 'Element';
            const rows = Object.keys(elem)
                .filter(key => key !== 'nom' && key !== 'attributes')
                .map(key => `
                    <tr>
                        <td><strong>${this.formatFieldLabel(key)}</strong></td>
                        <td>${elem[key] || ''}</td>
                    </tr>
                `).join('');
            html += `
                <div class="info-card" style="margin-bottom: 15px;">
                    <h4>${title}</h4>
                    ${rows ? `<table class="table">${rows}</table>` : ''}
                </div>
            `;
        });
        return html;
    },

    shouldRenderElementsAsTable(elements) {
        if (!Array.isArray(elements) || elements.length < 2) return false;
        const fieldSets = elements.map(elem => Object.keys(elem || {}).filter(key => key !== 'attributes'));
        const uniqueFields = Array.from(new Set(fieldSets.flat()));
        if (uniqueFields.length <= 1 || uniqueFields.length > 6) return false;

        const rowsWithComparableShape = fieldSets.filter(fields => {
            const overlap = fields.filter(field => uniqueFields.includes(field)).length;
            return overlap >= Math.min(2, uniqueFields.length);
        }).length;

        return rowsWithComparableShape / elements.length >= 0.75;
    },

    renderGenericElementsTable(elements) {
        const fields = this.getGenericTableFields(elements);
        const header = fields.map(field => `<th>${this.formatFieldLabel(field)}</th>`).join('');
        const rows = elements.map(elem => `
            <tr>
                ${fields.map(field => `<td>${elem[field] || ''}</td>`).join('')}
            </tr>
        `).join('');

        return `
            <table class="table">
                <tr>${header}</tr>
                ${rows}
            </table>
        `;
    },

    getGenericTableFields(elements) {
        const preferredOrder = [
            'nom',
            'description',
            'categorie',
            'valeur_numerique',
            'meta_donnees',
            'cible',
            'unite',
            'periodicite',
            'source_mesure',
            'beneficiaire',
            'avantage',
            'probabilite',
            'gravite',
            'mitigation'
        ];
        const fields = Array.from(new Set(
            elements.flatMap(elem => Object.keys(elem || {}).filter(key => key !== 'attributes'))
        ));
        return [
            ...preferredOrder.filter(field => fields.includes(field)),
            ...fields.filter(field => !preferredOrder.includes(field)).sort()
        ];
    },

    formatFieldLabel(field) {
        return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    renderRiskRow(risk) {
        const probaMap = { 'élevée': '🔴', 'moyenne': '🟡', 'faible': '🟢' };
        const graviteMap = { 'critique': '🔴', 'élevée': '🟡', 'modérée': '🟢', 'faible': '⚪' };
        
        const probaIcone = probaMap[risk.probabilite] || '⚪';
        const graviteIcone = graviteMap[risk.gravite] || '⚪';
        
        return `
            <tr>
                <td>${risk.nom || ''}</td>
                <td>${probaIcone} ${risk.probabilite || ''}</td>
                <td>${graviteIcone} ${risk.gravite || ''}</td>
                <td>${risk.mitigation || ''}</td>
            </tr>
        `;
    },

    renderJustificatifCardRow(justif) {
        return `
            <tr class="justificatif-row">
                <td colspan="5">${this.renderJustificatifCard(justif)}</td>
            </tr>
        `;
    },

    renderJustificatifCard(justif) {
        const title = justif.title || justif.titre || 'Reference';
        const links = Array.isArray(justif.links) && justif.links.length > 0
            ? justif.links
            : (justif.url ? [justif.url] : []);
        const technologies = Array.isArray(justif.technologies) ? justif.technologies : [];
        const metrics = Array.isArray(justif.results?.metrics) ? justif.results.metrics : [];
        const resultText = justif.results?.text || justif.resultat || '';
        const inspirations = Array.isArray(justif.inspirations) ? justif.inspirations : [];

        return `
            <article class="justificatif-card">
                <div class="justificatif-card-header">
                    <div>
                        <h3>${links[0] ? `<a href="${links[0]}" target="_blank" rel="noopener noreferrer">${title}</a>` : title}</h3>
                        ${justif.subtitle ? `<p class="justificatif-subtitle">${justif.subtitle}</p>` : ''}
                    </div>
                    ${justif.id ? `<span class="justificatif-id">${justif.id}</span>` : ''}
                </div>
                ${this.renderJustificatifMeta(justif)}
                ${justif.description ? `<p class="justificatif-description">${justif.description}</p>` : ''}
                ${this.renderJustificatifLinks(links)}
                ${this.renderJustificatifList('Technologies', technologies)}
                ${this.renderJustificatifMetrics(metrics, resultText)}
                ${justif.lesson ? `<div class="justificatif-block"><h4>Lesson</h4><p>${justif.lesson}</p></div>` : ''}
                ${this.renderJustificatifList('Inspirations pour le projet', inspirations)}
                ${this.renderCustomData(justif.customData)}
            </article>
        `;
    },

    renderJustificatifMeta(justif) {
        const meta = [
            justif.organization || justif.source,
            justif.country || justif.pays_origine,
            justif.year || justif.annee
        ].filter(Boolean);

        return meta.length > 0
            ? `<div class="justificatif-meta">${meta.map(item => `<span>${item}</span>`).join('')}</div>`
            : '';
    },

    renderJustificatifLinks(links) {
        if (!Array.isArray(links) || links.length === 0) return '';
        return `
            <div class="justificatif-block">
                <h4>Liens</h4>
                <ul class="justificatif-list">
                    ${links.map(url => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></li>`).join('')}
                </ul>
            </div>
        `;
    },

    renderJustificatifList(title, items) {
        if (!Array.isArray(items) || items.length === 0) return '';
        return `
            <div class="justificatif-block">
                <h4>${title}</h4>
                <ul class="justificatif-list">
                    ${items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    },

    renderJustificatifMetrics(metrics, resultText) {
        if ((!Array.isArray(metrics) || metrics.length === 0) && !resultText) return '';
        return `
            <div class="justificatif-block">
                <h4>Results / metrics</h4>
                ${Array.isArray(metrics) && metrics.length > 0 ? `
                    <div class="justificatif-metrics">
                        ${metrics.map(metric => `
                            <div class="justificatif-metric">
                                <span>${metric.name || 'Metric'}</span>
                                <strong>${metric.value || ''}</strong>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${resultText ? `<p>${resultText}</p>` : ''}
            </div>
        `;
    },

    renderCustomData(customData) {
        if (!customData || (typeof customData === 'object' && Object.keys(customData).length === 0)) return '';
        const content = typeof customData === 'string'
            ? customData
            : JSON.stringify(customData, null, 2);
        return `
            <details class="justificatif-custom-data">
                <summary>Custom data</summary>
                <pre>${content}</pre>
            </details>
        `;
    },

    renderJustificatifRow(justif) {
        const etoiles = '★'.repeat(justif.pertinence || 0) + '☆'.repeat(5 - (justif.pertinence || 0));
        return `
            <tr>
                <td>${justif.type || 'N/A'}</td>
                <td>${justif.url ? `<a href="${justif.url}" target="_blank" style="color: var(--cdg-navy); text-decoration: none;">${justif.titre || 'N/A'}</a>` : (justif.titre || 'N/A')}</td>
                <td>${justif.source || 'N/A'}</td>
                <td>${justif.resultat || '-'}</td>
                <td>${etoiles}</td>
            </tr>
        `;
    },

    formatBudget(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + ' M€';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + ' k€';
        } else {
            return amount + ' €';
        }
    },

    getPriorityColor(priority) {
        const colors = { 
            'P1': '#EF4444',
            'P2': '#F59E0B',
            'P3': '#FF6B35',
            'P4': '#3B82F6'
        };
        return colors[priority] || '#6B7280';
    },

    addToScenario(pisteId) {
        const state = appStore.getState();
        const piste = state.allPistes?.find(p => p.numero === pisteId);
        if (piste) {
            appActions.addPisteToScenario(piste);
            if (window.Notifications) {
                Notifications.success(`${pisteId} ajoutée au scénario`);
            } else {
                alert(`${pisteId} ajoutée au scénario`);
            }
        }
    },

    goBack() {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }
        if (window.router) {
            router.navigate('/explorer');
        }
    },

    async exportToPDF() {
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

            // Vérifier si html2pdf est chargé, sinon le charger dynamiquement
            if (typeof window.html2pdf === 'undefined') {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
            }

            const element = document.getElementById('pdf-content');
            const piste = this.currentPiste;

            if (!element) {
                throw new Error('Contenu PDF introuvable');
            }

            const themeStyle = document.createElement('style');
            themeStyle.id = 'pdf-theme-vars';
            themeStyle.textContent = this.getThemeVariablesForPDF();
            document.head.appendChild(themeStyle);
            element.classList.add('pdf-export-mode');
            
            // Options pour le PDF
            const opt = {
                margin:        [0.3, 0.3, 0.3, 0.3],
                filename:      `Piste_${piste.numero}_${piste.titre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
                image:         { type: 'jpeg', quality: 0.98 },
                html2canvas:   {
                    scale: 2,
                    letterRendering: true,
                    useCORS: true,
                    logging: false,
                    scrollX: 0,
                    scrollY: 0,
                    x: 0,
                    y: 0,
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    windowWidth: element.scrollWidth,
                    windowHeight: element.scrollHeight,
                    backgroundColor: '#ffffff'
                },
                jsPDF:         { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            // Générer le PDF
            await html2pdf().set(opt).from(element).save();

            element.classList.remove('pdf-export-mode');
            const cleanupThemeStyle = document.getElementById('pdf-theme-vars');
            if (cleanupThemeStyle) cleanupThemeStyle.remove();

            document.body.removeChild(loadingMsg);

            if (window.Notifications) {
                Notifications.success('PDF généré avec succès !');
            }

        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            
            const loadingMsg = document.querySelector('.pdf-loading');
            if (loadingMsg) document.body.removeChild(loadingMsg);

            const element = document.getElementById('pdf-content');
            if (element) element.classList.remove('pdf-export-mode');
            const cleanupThemeStyle = document.getElementById('pdf-theme-vars');
            if (cleanupThemeStyle) cleanupThemeStyle.remove();

            if (window.Notifications) {
                Notifications.error('Erreur lors de la génération du PDF');
            } else {
                alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
            }
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

    getThemeVariablesForPDF() {
        const computed = getComputedStyle(document.documentElement);
        const defaults = {
            '--cdg-navy': '#003D82',
            '--cdg-orange': '#FF6B35',
            '--gray-50': '#F9FAFB',
            '--gray-100': '#F3F4F6',
            '--gray-200': '#E5E7EB',
            '--gray-300': '#D1D5DB',
            '--gray-400': '#9CA3AF',
            '--gray-500': '#6B7280',
            '--gray-600': '#4B5563',
            '--gray-700': '#374151',
            '--gray-800': '#1F2937',
            '--gray-900': '#111827',
            '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '--shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            '--info': '#3B82F6'
        };

        const lines = Object.entries(defaults).map(([name, fallback]) => {
            const value = computed.getPropertyValue(name).trim() || fallback;
            return `${name}: ${value};`;
        });

        return `:root { ${lines.join(' ')} }`;
    },

    setupEventListeners() {
        console.log('✅ Event listeners prêts');
        
        // Initialiser le graphique radar après le rendu
        setTimeout(() => {
            this.initRadarChart();
        }, 100);
    },

    setViewMode(mode) {
        this.viewMode = mode === 'detailed' ? 'detailed' : 'compact';
        if (window.router && typeof window.router.render === 'function') {
            window.router.render();
            return;
        }
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            this.render().then(html => {
                pageContent.innerHTML = html;
                this.setupEventListeners();
            });
        }
    },
    initRadarChart() {
        const canvas = document.getElementById('radarChart');
        if (!canvas || !window.Chart) return;
        
        const piste = this.currentPiste;
        if (!piste) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.radarChartInstance) {
            this.radarChartInstance.destroy();
        }
        this.radarChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['CULTURE', 'TECH', 'HUMAIN', 'ORGANISATIONNEL', 'ÉCONOMIQUE'],
                datasets: [{
                    label: 'Distribution',
                    data: [
                        piste.dimensions?.culture || 0,
                        piste.dimensions?.technique || 0,
                        piste.dimensions?.humain || 0,
                        piste.dimensions?.organisationnel || 0,
                        piste.dimensions?.economique || 0
                    ],
                    backgroundColor: 'rgba(0, 61, 130, 0.2)',
                    borderColor: 'rgba(0, 61, 130, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(0, 61, 130, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 61, 130, 1)'
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
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
};

window.pages = window.pages || {};
window.pages.PisteDetail = pages.PisteDetail;
