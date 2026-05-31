/**
 * PAGES/DIAGNOSTIC.JS - Parcours prospect et plans recommandes
 */

window.pages = window.pages || {};

window.pages.Diagnostic = {
    profile: {
        prospectName: '',
        activity: 'aeroport',
        objective: 'rapidite',
        risk: 'circulation',
        budget: 1000000,
        horizon: 12,
        maximumPistes: 5,
        equipes: 1,
        annualIncidents: 8,
        averageIncidentCost: 75000,
        disruptionDays: 2,
        dailyOperationCost: 25000
    },
    recommendations: [],
    comparisonCriterion: 'equilibre',

    async render() {
        const state = window.appStore?.getState?.() || {};
        const savedDiagnostic = state.diagnostic || {};
        if (savedDiagnostic.profile) this.profile = { ...this.profile, ...savedDiagnostic.profile };
        if (Array.isArray(savedDiagnostic.recommendations)) this.recommendations = savedDiagnostic.recommendations;
        if (savedDiagnostic.comparisonCriterion) this.comparisonCriterion = savedDiagnostic.comparisonCriterion;

        return `
            <div class="diagnostic-page">
                <header class="diagnostic-hero">
                    <div>
                        <p class="diagnostic-eyebrow">Parcours prospect</p>
                        <h1>Diagnostic sécurité personnalisé</h1>
                        <p>Décrivez vos priorités en moins de deux minutes. Le simulateur prépare trois feuilles de route expliquées et exportables.</p>
                    </div>
                    <div class="diagnostic-steps" aria-label="Étapes du diagnostic">
                        <span class="active">1. Contexte</span>
                        <span>2. Recommandations</span>
                        <span>3. Présentation</span>
                    </div>
                </header>

                <div class="diagnostic-layout">
                    <section class="diagnostic-form-card">
                        <h2>Votre contexte</h2>
                        <form id="diagnostic-form">
                            <div class="diagnostic-field full">
                                <label for="diagnostic-name">Nom du prospect ou du site</label>
                                <input id="diagnostic-name" name="prospectName" type="text" value="${Utils.escapeHtml(this.profile.prospectName)}" placeholder="Ex. Hub Logistique Nord">
                            </div>
                            <div class="diagnostic-fields">
                                <div class="diagnostic-field">
                                    <label for="diagnostic-activity">Secteur</label>
                                    <select id="diagnostic-activity" name="activity">
                                        ${this.renderOption('aeroport', 'Aéroport / piste', this.profile.activity)}
                                        ${this.renderOption('logistique', 'Logistique', this.profile.activity)}
                                        ${this.renderOption('industrie', 'Industrie', this.profile.activity)}
                                        ${this.renderOption('collectivite', 'Collectivité', this.profile.activity)}
                                    </select>
                                </div>
                                <div class="diagnostic-field">
                                    <label for="diagnostic-objective">Objectif prioritaire</label>
                                    <select id="diagnostic-objective" name="objective">
                                        ${this.renderOption('rapidite', 'Réduire rapidement les incidents', this.profile.objective)}
                                        ${this.renderOption('budget', 'Agir avec un budget limité', this.profile.objective)}
                                        ${this.renderOption('transformation', 'Transformer sur 3 ans', this.profile.objective)}
                                    </select>
                                </div>
                                <div class="diagnostic-field">
                                    <label for="diagnostic-risk">Risque dominant</label>
                                    <select id="diagnostic-risk" name="risk">
                                        ${this.renderOption('circulation', 'Collisions et circulation', this.profile.risk)}
                                        ${this.renderOption('humain', 'Comportements / formation', this.profile.risk)}
                                        ${this.renderOption('organisation', 'Organisation / pics d’activité', this.profile.risk)}
                                        ${this.renderOption('technologie', 'Équipements et détection', this.profile.risk)}
                                    </select>
                                </div>
                                <div class="diagnostic-field">
                                    <label for="diagnostic-budget">Budget disponible sur 3 ans</label>
                                    <select id="diagnostic-budget" name="budget">
                                        ${this.renderOption('500000', '500 k€', String(this.profile.budget))}
                                        ${this.renderOption('1000000', '1 M€', String(this.profile.budget))}
                                        ${this.renderOption('2000000', '2 M€', String(this.profile.budget))}
                                        ${this.renderOption('5000000', '5 M€', String(this.profile.budget))}
                                    </select>
                                </div>
                                <div class="diagnostic-field">
                                    <label for="diagnostic-horizon">Horizon de déploiement</label>
                                    <select id="diagnostic-horizon" name="horizon">
                                        ${this.renderOption('6', '6 mois', String(this.profile.horizon))}
                                        ${this.renderOption('12', '12 mois', String(this.profile.horizon))}
                                        ${this.renderOption('24', '24 mois', String(this.profile.horizon))}
                                        ${this.renderOption('36', '36 mois', String(this.profile.horizon))}
                                    </select>
                                </div>
                                <div class="diagnostic-field">
                                    <label for="diagnostic-count">Nombre maximum de pistes</label>
                                    <select id="diagnostic-count" name="maximumPistes">
                                        ${this.renderOption('3', '3 pistes', String(this.profile.maximumPistes))}
                                        ${this.renderOption('5', '5 pistes', String(this.profile.maximumPistes))}
                                        ${this.renderOption('8', '8 pistes', String(this.profile.maximumPistes))}
                                    </select>
                                </div>
                                <div class="diagnostic-field">
                                    <label for="diagnostic-teams">Équipes mobilisables</label>
                                    <select id="diagnostic-teams" name="equipes">
                                        ${this.renderOption('1', '1 équipe', String(this.profile.equipes))}
                                        ${this.renderOption('2', '2 équipes', String(this.profile.equipes))}
                                        ${this.renderOption('3', '3 équipes', String(this.profile.equipes))}
                                        ${this.renderOption('5', '5 équipes', String(this.profile.equipes))}
                                    </select>
                                </div>
                            </div>
                            <div class="diagnostic-finance-inputs">
                                <h3>Coût actuel estimé</h3>
                                <p>Ces hypothèses servent à évaluer le coût de l’inaction et le gain potentiel.</p>
                                <div class="diagnostic-fields">
                                    <div class="diagnostic-field">
                                        <label for="diagnostic-incidents">Incidents par an</label>
                                        <input id="diagnostic-incidents" name="annualIncidents" type="number" min="0" step="1" value="${this.profile.annualIncidents}">
                                    </div>
                                    <div class="diagnostic-field">
                                        <label for="diagnostic-incident-cost">Coût moyen par incident (€)</label>
                                        <input id="diagnostic-incident-cost" name="averageIncidentCost" type="number" min="0" step="1000" value="${this.profile.averageIncidentCost}">
                                    </div>
                                    <div class="diagnostic-field">
                                        <label for="diagnostic-days">Jours perturbés / incident</label>
                                        <input id="diagnostic-days" name="disruptionDays" type="number" min="0" step="0.5" value="${this.profile.disruptionDays}">
                                    </div>
                                    <div class="diagnostic-field">
                                        <label for="diagnostic-daily-cost">Coût opérationnel / jour (€)</label>
                                        <input id="diagnostic-daily-cost" name="dailyOperationCost" type="number" min="0" step="1000" value="${this.profile.dailyOperationCost}">
                                    </div>
                                </div>
                            </div>
                            <button class="diagnostic-submit" type="submit">
                                <span class="material-symbols-outlined">auto_awesome</span>
                                Générer mes recommandations
                            </button>
                        </form>
                    </section>

                    <section class="diagnostic-results" id="diagnostic-results">
                        ${this.renderRecommendations()}
                    </section>
                </div>
            </div>
        `;
    },

    renderOption(value, label, selected) {
        return `<option value="${value}" ${String(value) === String(selected) ? 'selected' : ''}>${label}</option>`;
    },

    renderRecommendations() {
        if (this.recommendations.length === 0) {
            return `
                <div class="diagnostic-empty">
                    <span class="material-symbols-outlined">insights</span>
                    <h2>Trois plans prêts pour votre rendez-vous</h2>
                    <p>Complétez le diagnostic pour comparer un plan essentiel, un équilibre recommandé et une trajectoire ambitieuse.</p>
                </div>
            `;
        }

        this.recommendations = this.recommendations.map(recommendation => ({
            ...recommendation,
            planning: recommendation.planning || this.calculatePlanning(recommendation.pistes)
        }));
        const recommendedIndex = Math.max(0, this.recommendations.findIndex(recommendation => recommendation.recommended));
        return `
            <div class="recommendation-header">
                <div>
                    <p class="diagnostic-eyebrow">Résultats personnalisés</p>
                    <h2>${Utils.escapeHtml(this.profile.prospectName || 'Votre organisation')}</h2>
                </div>
                <button type="button" class="btn-report" data-diagnostic-action="export" data-index="${recommendedIndex}">
                    <span class="material-symbols-outlined">description</span>
                    Exporter le plan recommandé
                </button>
            </div>
            ${this.renderFinancialOverview()}
            ${this.renderPlanComparison()}
            <div class="recommendation-grid">
                ${this.recommendations.map((recommendation, index) => this.renderRecommendationCard(recommendation, index)).join('')}
            </div>
        `;
    },

    renderFinancialOverview() {
        const baseline = this.getBaselineCost();
        return `
            <div class="financial-overview">
                <div>
                    <span>Coût annuel actuel estimé</span>
                    <strong>${Utils.formatCurrency(baseline.annualCost)}</strong>
                </div>
                <div class="danger">
                    <span>Sans action sur 3 ans</span>
                    <strong>${Utils.formatCurrency(baseline.threeYearCost)}</strong>
                </div>
                <p>Hypothèses : ${this.profile.annualIncidents} incidents/an, ${Utils.formatCurrency(this.profile.averageIncidentCost)} par incident et ${this.profile.disruptionDays} jour(s) de perturbation.</p>
            </div>
        `;
    },

    renderPlanComparison() {
        const recommended = this.recommendations.find(recommendation => recommendation.recommended) || this.recommendations[0];
        const metrics = [
            { label: 'Nombre de pistes', value: plan => String(plan.pistes.length), rank: plan => plan.pistes.length, best: 'max' },
            { label: 'Budget 3 ans', value: plan => Utils.formatCurrency(plan.totalBudget), rank: plan => plan.totalBudget, best: 'min' },
            { label: 'Impact moyen', value: plan => `${plan.averageImpact}/100`, rank: plan => plan.averageImpact, best: 'max' },
            { label: 'Gain net potentiel', value: plan => Utils.formatCurrency(plan.financial.netGain), rank: plan => plan.financial.netGain, best: 'max' },
            { label: 'Délai de retour estimé', value: plan => plan.financial.paybackMonths ? `${plan.financial.paybackMonths} mois` : 'Non atteint', rank: plan => plan.financial.paybackMonths || Infinity, best: 'min' },
            { label: 'Durée totale planifiée', value: plan => `${plan.planning.totalDuration} mois`, rank: plan => plan.planning.totalDuration, best: 'min' },
            { label: 'Déploiement moyen', value: plan => `${plan.averageDelay} mois`, rank: plan => plan.averageDelay, best: 'min' }
        ];

        return `
            <section class="plan-comparison" aria-labelledby="comparison-title">
                <div class="comparison-toolbar">
                    <div>
                        <p class="diagnostic-eyebrow">Aide à la décision</p>
                        <h3 id="comparison-title">Comparer les trois plans</h3>
                    </div>
                    <label class="criterion-select" for="comparison-criterion">
                        Priorité de choix
                        <select id="comparison-criterion" data-diagnostic-change="criterion">
                            ${this.renderOption('equilibre', 'Meilleur compromis', this.comparisonCriterion)}
                            ${this.renderOption('budget', 'Budget minimal', this.comparisonCriterion)}
                            ${this.renderOption('rapidite', 'Déploiement rapide', this.comparisonCriterion)}
                            ${this.renderOption('impact', 'Impact maximal', this.comparisonCriterion)}
                            ${this.renderOption('gain', 'Gain net maximal', this.comparisonCriterion)}
                        </select>
                    </label>
                </div>
                <p class="decision-reason">
                    <strong>${Utils.escapeHtml(recommended.name)}</strong> est recommandé selon le critère
                    <strong>${Utils.escapeHtml(this.getCriterionLabel())}</strong> : ${Utils.escapeHtml(this.getDecisionExplanation(recommended))}
                </p>
                <div class="comparison-table-wrapper">
                    <table class="plans-table">
                        <thead>
                            <tr>
                                <th scope="col">Critère</th>
                                ${this.recommendations.map(plan => `
                                    <th scope="col" class="${plan.recommended ? 'recommended-column' : ''}">
                                        ${Utils.escapeHtml(plan.name)}
                                        ${plan.recommended ? '<span class="comparison-plan-badge">Recommandé</span>' : ''}
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${metrics.map(metric => `
                                <tr>
                                    <th scope="row">${metric.label}</th>
                                    ${this.recommendations.map(plan => `
                                        <td class="${this.isBestMetric(metric, plan) ? 'best-value' : ''}">${metric.value(plan)}</td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                            <tr class="comparison-actions-row">
                                <th scope="row">Décision</th>
                                ${this.recommendations.map((plan, index) => `
                                    <td>
                                        <button type="button" class="choose-plan-btn" data-diagnostic-action="choose" data-index="${index}">
                                            Choisir ce plan
                                        </button>
                                    </td>
                                `).join('')}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn-export-comparison" data-diagnostic-action="export-comparison">
                    <span class="material-symbols-outlined">table_view</span>
                    Exporter la comparaison
                </button>
            </section>
        `;
    },

    isBestMetric(metric, plan) {
        const values = this.recommendations.map(recommendation => metric.rank(recommendation));
        const target = metric.best === 'min' ? Math.min(...values) : Math.max(...values);
        return metric.rank(plan) === target && target !== Infinity;
    },

    renderRecommendationCard(recommendation, index) {
        const planning = recommendation.planning || this.calculatePlanning(recommendation.pistes);
        return `
            <article class="recommendation-card ${recommendation.recommended ? 'recommended' : ''}">
                ${recommendation.recommended ? '<span class="recommended-badge">Recommandé</span>' : ''}
                <div class="recommendation-title">
                    <h3>${recommendation.name}</h3>
                    <p>${recommendation.description}</p>
                </div>
                <div class="recommendation-metrics">
                    <div><strong>${recommendation.pistes.length}</strong><span>Pistes</span></div>
                    <div><strong>${Utils.formatCurrency(recommendation.totalBudget)}</strong><span>Budget 3 ans</span></div>
                    <div><strong>${recommendation.averageImpact}/100</strong><span>Impact moyen</span></div>
                    <div><strong>${recommendation.averageDelay} mois</strong><span>Déploiement moyen</span></div>
                </div>
                ${this.renderTimeline(planning)}
                <p class="recommendation-why"><strong>Pourquoi ce plan :</strong> ${recommendation.reason}</p>
                <div class="financial-comparison">
                    <h4>Impact financier estimé sur 3 ans</h4>
                    <div class="financial-comparison-grid">
                        <div class="baseline"><span>Sans action</span><strong>${Utils.formatCurrency(recommendation.financial.threeYearBaseline)}</strong></div>
                        <div><span>Avec le plan</span><strong>${Utils.formatCurrency(recommendation.financial.costWithPlan)}</strong></div>
                        <div class="${recommendation.financial.netGain >= 0 ? 'gain' : 'warning'}"><span>Gain net potentiel</span><strong>${Utils.formatCurrency(recommendation.financial.netGain)}</strong></div>
                        <div><span>Délai de retour estimé</span><strong>${recommendation.financial.paybackMonths ? recommendation.financial.paybackMonths + ' mois' : 'Non atteint'}</strong></div>
                    </div>
                    <p class="financial-note">Estimation indicative fondée sur les incidents renseignés et une réduction plafonnée à 75%.</p>
                </div>
                <div class="roadmap">
                    ${this.renderRoadmap(recommendation.pistes)}
                </div>
                <div class="recommendation-actions">
                    <button type="button" class="btn-export-plan" data-diagnostic-action="export" data-index="${index}">
                        <span class="material-symbols-outlined">description</span>
                        Exporter
                    </button>
                    <button type="button" class="btn-secondary" data-diagnostic-action="save" data-index="${index}">Sauvegarder</button>
                    <button type="button" class="btn-primary" data-diagnostic-action="simulate" data-index="${index}">Ouvrir dans le simulateur</button>
                </div>
            </article>
        `;
    },

    renderTimeline(planning) {
        const horizon = Math.max(1, planning.totalDuration);
        return `
            <div class="diagnostic-timeline">
                <div class="diagnostic-timeline-header">
                    <strong>Planning avec ${this.formatTeams(planning.teamCount)}</strong>
                    <span>${planning.totalDuration} mois au total - gain de ${planning.savedMonths} mois</span>
                </div>
                ${planning.teams.map(team => `
                    <div class="diagnostic-team-row">
                        <span>Équipe ${team.id}</span>
                        <div class="diagnostic-team-track">
                            ${team.tasks.map(task => `
                                <span class="diagnostic-task" style="left: ${(task.start / horizon) * 100}%; width: ${(task.duration / horizon) * 100}%"
                                    title="${Utils.escapeHtml(task.piste.titre || task.piste.numero)} : ${task.duration} mois">
                                    ${Utils.escapeHtml(task.piste.numero || '')}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <p>Hypothèse : exécution parallèle sans dépendances entre pistes.</p>
            </div>
        `;
    },

    renderRoadmap(pistes) {
        const phases = [
            { name: '0-6 mois', pistes: pistes.filter(piste => Number(piste.delai_mois || 0) <= 6) },
            { name: '6-12 mois', pistes: pistes.filter(piste => Number(piste.delai_mois || 0) > 6 && Number(piste.delai_mois || 0) <= 12) },
            { name: '12+ mois', pistes: pistes.filter(piste => Number(piste.delai_mois || 0) > 12) }
        ];

        return phases.map(phase => `
            <div class="roadmap-phase">
                <span>${phase.name}</span>
                <strong>${phase.pistes.length} action${phase.pistes.length > 1 ? 's' : ''}</strong>
            </div>
        `).join('');
    },

    setupEventListeners() {
        const root = document.querySelector('.diagnostic-page');
        if (!root || root.dataset.bound === 'true') return;
        root.dataset.bound = 'true';

        root.addEventListener('submit', event => {
            if (event.target.id !== 'diagnostic-form') return;
            event.preventDefault();
            this.generateRecommendations(new FormData(event.target));
        });

        root.addEventListener('click', event => {
            const button = event.target.closest('[data-diagnostic-action]');
            if (!button) return;
            const index = Number(button.dataset.index);
            if (button.dataset.diagnosticAction === 'simulate') this.openInSimulator(index);
            if (button.dataset.diagnosticAction === 'choose') this.openInSimulator(index);
            if (button.dataset.diagnosticAction === 'save') this.saveScenario(index);
            if (button.dataset.diagnosticAction === 'export') this.exportSummary(index);
            if (button.dataset.diagnosticAction === 'export-comparison') this.exportComparison();
        });

        root.addEventListener('change', event => {
            if (event.target.dataset.diagnosticChange !== 'criterion') return;
            this.selectComparisonCriterion(event.target.value);
        });
    },

    generateRecommendations(formData) {
        this.profile = {
            prospectName: String(formData.get('prospectName') || '').trim(),
            activity: String(formData.get('activity') || 'aeroport'),
            objective: String(formData.get('objective') || 'rapidite'),
            risk: String(formData.get('risk') || 'circulation'),
            budget: Number(formData.get('budget') || 1000000),
            horizon: Number(formData.get('horizon') || 12),
            maximumPistes: Number(formData.get('maximumPistes') || 5),
            equipes: Math.max(1, Number(formData.get('equipes') || 1)),
            annualIncidents: Math.max(0, Number(formData.get('annualIncidents') || 0)),
            averageIncidentCost: Math.max(0, Number(formData.get('averageIncidentCost') || 0)),
            disruptionDays: Math.max(0, Number(formData.get('disruptionDays') || 0)),
            dailyOperationCost: Math.max(0, Number(formData.get('dailyOperationCost') || 0))
        };

        const pistes = window.appStore?.getValue?.('allPistes') || [];
        const rankedPistes = this.rankPistes(pistes);
        this.recommendations = [
            this.buildRecommendation('Essentiel', 'Actions immédiatement mobilisables', rankedPistes, 0.55, Math.max(2, this.profile.maximumPistes - 2), false),
            this.buildRecommendation('Équilibré', 'Meilleur compromis impact, budget et délai', rankedPistes, 1, this.profile.maximumPistes, false),
            this.buildRecommendation('Ambitieux', 'Trajectoire structurante avec plus de couverture', rankedPistes, 1.8, Math.min(8, this.profile.maximumPistes + 2), false)
        ];
        this.applyRecommendationCriterion();

        window.appStore?.setState?.({
            diagnostic: {
                profile: this.profile,
                recommendations: this.recommendations,
                comparisonCriterion: this.comparisonCriterion
            }
        });
        this.rerender();
    },

    applyRecommendationCriterion() {
        const index = this.calculateRecommendedIndex();
        this.recommendations = this.recommendations.map((recommendation, recommendationIndex) => ({
            ...recommendation,
            recommended: recommendationIndex === index
        }));
    },

    calculateRecommendedIndex() {
        if (!this.recommendations.length) return 0;
        if (this.comparisonCriterion === 'equilibre') return Math.min(1, this.recommendations.length - 1);

        const compare = {
            budget: (left, right) => left.totalBudget - right.totalBudget,
            rapidite: (left, right) => left.averageDelay - right.averageDelay || right.averageImpact - left.averageImpact,
            impact: (left, right) => right.averageImpact - left.averageImpact || left.totalBudget - right.totalBudget,
            gain: (left, right) => right.financial.netGain - left.financial.netGain || left.totalBudget - right.totalBudget
        }[this.comparisonCriterion] || ((left, right) => left.totalBudget - right.totalBudget);

        return this.recommendations
            .map((recommendation, index) => ({ recommendation, index }))
            .sort((left, right) => compare(left.recommendation, right.recommendation))[0].index;
    },

    selectComparisonCriterion(criterion) {
        const allowed = ['equilibre', 'budget', 'rapidite', 'impact', 'gain'];
        this.comparisonCriterion = allowed.includes(criterion) ? criterion : 'equilibre';
        this.applyRecommendationCriterion();
        window.appStore?.setState?.({
            diagnostic: {
                profile: this.profile,
                recommendations: this.recommendations,
                comparisonCriterion: this.comparisonCriterion
            }
        });
        this.rerender();
    },

    getCriterionLabel() {
        return {
            equilibre: 'meilleur compromis',
            budget: 'budget minimal',
            rapidite: 'déploiement rapide',
            impact: 'impact maximal',
            gain: 'gain net maximal'
        }[this.comparisonCriterion] || 'meilleur compromis';
    },

    getDecisionExplanation(recommendation) {
        const messages = {
            equilibre: `il associe ${recommendation.averageImpact}/100 d'impact moyen et ${Utils.formatCurrency(recommendation.financial.netGain)} de gain net potentiel dans l'enveloppe visée.`,
            budget: `son investissement est limité à ${Utils.formatCurrency(recommendation.totalBudget)} sur trois ans.`,
            rapidite: `son déploiement moyen est estimé à ${recommendation.averageDelay} mois.`,
            impact: `son impact moyen atteint ${recommendation.averageImpact}/100.`,
            gain: `son gain net potentiel atteint ${Utils.formatCurrency(recommendation.financial.netGain)} sur trois ans.`
        };
        return messages[this.comparisonCriterion] || messages.equilibre;
    },

    rankPistes(pistes) {
        const tagTerms = {
            circulation: ['circulation', 'collision', 'geofencing', 'signalisation', 'vehicule'],
            humain: ['formation', 'culture', 'humain', 'sensibilisation', 'comportement'],
            organisation: ['organisationnel', 'management', 'processus', 'prevention', 'analyse'],
            technologie: ['technique', 'digital', 'capteur', 'technologie', 'ia']
        };
        const terms = tagTerms[this.profile.risk] || [];

        return [...pistes].map(piste => {
            const tags = Array.isArray(piste.tags) ? piste.tags.join(' ').toLowerCase() : '';
            const text = `${piste.titre || ''} ${piste.categorie || ''} ${tags}`.toLowerCase();
            const riskMatch = terms.some(term => text.includes(term)) ? 22 : 0;
            const impact = Number(piste.impact_score || 0);
            const budget = Number(piste.budget?.cout_3_ans || 0);
            const delay = Number(piste.delai_mois || 0);
            const fastBonus = this.profile.objective === 'rapidite' && delay <= this.profile.horizon ? 20 : 0;
            const budgetBonus = this.profile.objective === 'budget' && budget <= this.profile.budget / 3 ? 18 : 0;
            const strategicBonus = this.profile.objective === 'transformation' && impact >= 80 ? 15 : 0;
            return { piste, score: impact + riskMatch + fastBonus + budgetBonus + strategicBonus };
        }).sort((a, b) => b.score - a.score).map(entry => entry.piste);
    },

    buildRecommendation(name, description, rankedPistes, budgetFactor, limit, recommended) {
        const budgetLimit = this.profile.budget * budgetFactor;
        const horizon = name === 'Ambitieux' ? Math.max(this.profile.horizon, 24) : this.profile.horizon;
        const pistes = [];
        let totalBudget = 0;

        rankedPistes.forEach(piste => {
            if (pistes.length >= limit) return;
            const budget = Number(piste.budget?.cout_3_ans || 0);
            if (Number(piste.delai_mois || 0) > horizon) return;
            if (pistes.length > 0 && totalBudget + budget > budgetLimit) return;
            pistes.push(piste);
            totalBudget += budget;
        });

        if (pistes.length === 0 && rankedPistes.length > 0) {
            pistes.push(rankedPistes[0]);
            totalBudget = Number(rankedPistes[0].budget?.cout_3_ans || 0);
        }

        const averageImpact = Math.round(pistes.reduce((sum, piste) => sum + Number(piste.impact_score || 0), 0) / Math.max(1, pistes.length));
        const averageDelay = Math.round(pistes.reduce((sum, piste) => sum + Number(piste.delai_mois || 0), 0) / Math.max(1, pistes.length));
        const reasons = {
            Essentiel: 'priorise les actions rapides et un engagement financier réduit.',
            Équilibré: `respecte votre enveloppe cible et répond au risque ${this.getRiskLabel().toLowerCase()}.`,
            Ambitieux: 'élargit la couverture et prépare une transformation durable.'
        };
        const financial = this.calculateFinancialImpact(pistes, totalBudget);

        const planning = this.calculatePlanning(pistes);
        return { name, description, pistes, totalBudget, averageImpact, averageDelay, reason: reasons[name], recommended, financial, planning };
    },

    calculatePlanning(pistes) {
        const teamCount = Math.max(1, Math.round(Number(this.profile.equipes) || 1));
        const teams = Array.from({ length: teamCount }, (_, index) => ({ id: index + 1, availableAt: 0, tasks: [] }));
        const tasks = [...(pistes || [])]
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

    formatTeams(count) {
        return `${count} équipe${count > 1 ? 's' : ''}`;
    },

    getBaselineCost() {
        const costPerIncident = Number(this.profile.averageIncidentCost || 0) +
            (Number(this.profile.disruptionDays || 0) * Number(this.profile.dailyOperationCost || 0));
        const annualCost = Number(this.profile.annualIncidents || 0) * costPerIncident;
        return {
            costPerIncident,
            annualCost,
            threeYearCost: annualCost * 3
        };
    },

    calculateFinancialImpact(pistes, totalBudget) {
        const baseline = this.getBaselineCost();
        const averageImpact = pistes.reduce((sum, piste) => sum + Number(piste.impact_score || 0), 0) / Math.max(1, pistes.length);
        const reductionRate = Math.min(0.75, Math.max(0, averageImpact / 100) * 0.7);
        const avoidedLoss = Math.round(baseline.threeYearCost * reductionRate);
        const costWithPlan = Math.max(0, baseline.threeYearCost - avoidedLoss) + totalBudget;
        const netGain = baseline.threeYearCost - costWithPlan;
        const annualAvoidedLoss = avoidedLoss / 3;
        const paybackMonths = annualAvoidedLoss > 0 && totalBudget <= avoidedLoss
            ? Math.ceil((totalBudget / annualAvoidedLoss) * 12)
            : null;

        return {
            threeYearBaseline: baseline.threeYearCost,
            reductionRate,
            avoidedLoss,
            costWithPlan,
            netGain,
            paybackMonths
        };
    },

    getRiskLabel() {
        const labels = {
            circulation: 'Collisions et circulation',
            humain: 'Comportements et formation',
            organisation: 'Organisation et pics d’activité',
            technologie: 'Équipements et détection'
        };
        return labels[this.profile.risk] || 'sécurité';
    },

    openInSimulator(index) {
        const recommendation = this.recommendations[index];
        if (!recommendation) return;
        window.appStore?.setState?.({
            simulatorPreset: {
                source: 'diagnostic',
                name: recommendation.name,
                profile: this.profile,
                pistes: recommendation.pistes
            }
        });
        window.router?.navigate?.('/simulateur');
    },

    saveScenario(index) {
        const recommendation = this.recommendations[index];
        if (!recommendation) return;
        const namePrefix = this.profile.prospectName ? `${this.profile.prospectName} - ` : '';
        const scenario = {
            id: Utils.generateUID(),
            name: `${namePrefix}${recommendation.name}`,
            description: recommendation.description,
            createdAt: new Date().toISOString(),
            pistes: recommendation.pistes,
            diagnosticProfile: this.profile,
            totalBudget: recommendation.totalBudget,
            totalImpact: recommendation.averageImpact,
            financial: recommendation.financial,
            planning: recommendation.planning,
            constraints: { equipes: { enabled: true, value: this.profile.equipes, max: 5 } }
        };
        window.appActions?.addScenario?.(scenario);
        window.appActions?.showNotification?.(`Scénario "${scenario.name}" sauvegardé`, 'success');
    },

    exportSummary(index) {
        const recommendation = this.recommendations[index] || this.recommendations[1];
        if (!recommendation) return;
        window.Export?.exportProspectPDF?.(this.profile, recommendation);
    },

    exportComparison() {
        if (this.recommendations.length === 0) return;
        window.Export?.exportComparisonPDF?.(this.profile, this.recommendations, this.comparisonCriterion);
    },

    rerender() {
        this.render().then(html => {
            const content = document.getElementById('page-content');
            if (!content) return;
            content.innerHTML = html;
            this.setupEventListeners();
        });
    }
};
