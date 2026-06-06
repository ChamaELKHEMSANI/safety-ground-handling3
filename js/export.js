/**
 * EXPORT.JS - Export en PDF, JSON, Excel, HTML
 */

class Export {
    /**
     * Exporter en PDF
     */
    static async exportPDF(pistes, filename = 'plan-action.pdf') {
        try {
            appActions.setLoading(true);

            // Générer HTML pour PDF
            const html = this.generatePDFHTML(pistes);

            // Créer blob HTML
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // Utiliser print pour PDF (plus simple)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                    appActions.setLoading(false);
                    appActions.showNotification('PDF généré avec succès!', 'success');
                }, 1000);
            };

        } catch (error) {
            console.error('Erreur export PDF:', error);
            appActions.showNotification('Erreur lors de l\'export PDF', 'error');
            appActions.setLoading(false);
        }
    }

    /**
     * Générer HTML pour PDF
     */
    static generatePDFHTML(pistes) {
        const escape = value => Utils.escapeHtml(value);
        const now = new Date().toLocaleString('fr-FR');
        const totalBudget = pistes.reduce((sum, p) => sum + p.budget.cout_3_ans, 0);
        const avgImpact = Math.round(pistes.reduce((sum, p) => sum + p.impact_score, 0) / pistes.length);
        const totalAccidents = pistes.reduce((sum, p) => sum + p.impact_accidents_evites, 0);

        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Plan d'Action Sécurité CDG</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
                    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #003D82; padding-bottom: 20px; }
                    .header h1 { color: #003D82; font-size: 28px; margin-bottom: 10px; }
                    .header p { color: #666; font-size: 14px; }
                    .executive-summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                    .summary-item { display: inline-block; margin: 10px 20px 10px 0; }
                    .summary-value { font-size: 24px; font-weight: bold; color: #003D82; }
                    .summary-label { font-size: 12px; color: #999; text-transform: uppercase; }
                    .table-wrapper { margin: 30px 0; }
                    .table-title { font-size: 18px; font-weight: bold; color: #003D82; margin: 20px 0 15px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { background: #003D82; color: white; padding: 12px; text-align: left; font-weight: bold; }
                    td { padding: 12px; border-bottom: 1px solid #ddd; }
                    tr:nth-child(even) { background: #f9fafb; }
                    .page-break { page-break-after: always; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
                    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
                    .badge-high { background: #fecaca; color: #991b1b; }
                    .badge-medium { background: #fed7aa; color: #92400e; }
                    .badge-low { background: #d1fae5; color: #065f46; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Plan d'Action Sécurité</h1>
                        <p>Rapport de simulation - Généré le ${now}</p>
                    </div>

                    <div class="executive-summary">
                        <h2 style="margin-bottom: 15px; color: #003D82;">Résumé Exécutif</h2>
                        <div class="summary-item">
                            <div class="summary-value">${pistes.length}</div>
                            <div class="summary-label">Pistes sélectionnées</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${Utils.formatCurrency(totalBudget)}</div>
                            <div class="summary-label">Budget total</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">${avgImpact}/100</div>
                            <div class="summary-label">Impact moyen</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value">-${totalAccidents}</div>
                            <div class="summary-label">Accidents évités/an</div>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <h2 class="table-title">Détail des Pistes Sélectionnées</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titre</th>
                                    <th>Budget 3 ans</th>
                                    <th>Impact</th>
                                    <th>Délai de retour</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pistes.map(p => `
                                    <tr>
                                        <td><strong>${escape(p.numero)}</strong></td>
                                        <td>${escape(p.titre)}</td>
                                        <td>${Utils.formatCurrency(p.budget.cout_3_ans)}</td>
                                        <td>${p.impact_score}/100</td>
                                        <td>${p.roi_mois} mois</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="page-break"></div>

                    <div class="table-wrapper">
                        <h2 class="table-title">Récapitulatif Budgétaire par Année</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Année</th>
                                    <th>Budget</th>
                                    <th>% du total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2026</td>
                                    <td>${Utils.formatCurrency(pistes.reduce((s, p) => s + p.budget.cout_2026, 0))}</td>
                                    <td>${Math.round(pistes.reduce((s, p) => s + p.budget.cout_2026, 0) / totalBudget * 100)}%</td>
                                </tr>
                                <tr>
                                    <td>2027</td>
                                    <td>${Utils.formatCurrency(pistes.reduce((s, p) => s + p.budget.cout_2027, 0))}</td>
                                    <td>${Math.round(pistes.reduce((s, p) => s + p.budget.cout_2027, 0) / totalBudget * 100)}%</td>
                                </tr>
                                <tr>
                                    <td>2028</td>
                                    <td>${Utils.formatCurrency(pistes.reduce((s, p) => s + p.budget.cout_2028, 0))}</td>
                                    <td>${Math.round(pistes.reduce((s, p) => s + p.budget.cout_2028, 0) / totalBudget * 100)}%</td>
                                </tr>
                                <tr style="background: #003D82; color: white; font-weight: bold;">
                                    <td>TOTAL</td>
                                    <td>${Utils.formatCurrency(totalBudget)}</td>
                                    <td>100%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <p>Simulateur Sécurité  | v3.0.0</p>
                        <p>Document généré automatiquement - Confidentiel</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    static exportProspectPDF(profile, recommendation) {
        try {
            appActions.setLoading(true);
            const html = this.generateProspectHTML(profile, recommendation);
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            iframe.onload = () => {
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                    appActions.setLoading(false);
                    appActions.showNotification('Synthèse prospect prête à imprimer', 'success');
                }, 1000);
            };
        } catch (error) {
            console.error('Erreur export synthèse prospect:', error);
            appActions.setLoading(false);
            appActions.showNotification('Erreur lors de l\'export de la synthèse', 'error');
        }
    }

    static exportComparisonPDF(profile, recommendations, criterion) {
        try {
            appActions.setLoading(true);
            const html = this.generateComparisonHTML(profile, recommendations, criterion);
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            iframe.onload = () => {
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                    appActions.setLoading(false);
                    appActions.showNotification('Comparaison prête à imprimer', 'success');
                }, 1000);
            };
        } catch (error) {
            console.error('Erreur export comparaison:', error);
            appActions.setLoading(false);
            appActions.showNotification('Erreur lors de l\'export de la comparaison', 'error');
        }
    }

    static generateComparisonHTML(profile, recommendations, criterion) {
        const escape = value => Utils.escapeHtml(value);
        const prospectName = profile.prospectName || 'Organisation prospect';
        const criterionLabel = {
            equilibre: 'Meilleur compromis',
            budget: 'Budget minimal',
            rapidite: 'Déploiement rapide',
            impact: 'Impact maximal',
            gain: 'Gain net maximal'
        }[criterion] || 'Meilleur compromis';
        const recommended = recommendations.find(plan => plan.recommended) || recommendations[0] || {};
        const rows = [
            ['Nombre de pistes', plan => String((plan.pistes || []).length)],
            ['Budget sur 3 ans', plan => Utils.formatCurrency(plan.totalBudget || 0)],
            ['Impact moyen', plan => `${Number(plan.averageImpact || 0)}/100`],
            ['Gain net potentiel', plan => Utils.formatCurrency(plan.financial?.netGain || 0)],
            ['Délai de retour estimé', plan => plan.financial?.paybackMonths ? `${plan.financial.paybackMonths} mois` : 'Non atteint'],
            ['Déploiement moyen', plan => `${Number(plan.averageDelay || 0)} mois`]
        ];

        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Comparaison décisionnelle - ${escape(prospectName)}</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #1e293b; margin: 0; }
                    .page { max-width: 960px; margin: 0 auto; padding: 42px; }
                    header { border-bottom: 4px solid #ff6b35; padding-bottom: 20px; margin-bottom: 28px; }
                    .eyebrow { color: #ff6b35; font-size: 12px; font-weight: bold; letter-spacing: .12em; text-transform: uppercase; }
                    h1, h2 { color: #003d82; }
                    .decision { margin: 20px 0; padding: 16px; border-left: 4px solid #ff6b35; background: #fff7ed; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
                    thead th { color: white; background: #003d82; }
                    .selected { background: #fff7ed; font-weight: bold; }
                    .note { margin-top: 18px; color: #64748b; font-size: 12px; }
                    footer { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 15px; color: #64748b; font-size: 12px; }
                </style>
            </head>
            <body>
                <main class="page">
                    <header>
                        <div class="eyebrow">Comparaison décisionnelle</div>
                        <h1>${escape(prospectName)}</h1>
                        <p>Trois trajectoires comparées - généré le ${new Date().toLocaleDateString('fr-FR')}</p>
                    </header>
                    <div class="decision">
                        <strong>Plan recommandé : ${escape(recommended.name || '-')}</strong><br>
                        Priorité sélectionnée : ${escape(criterionLabel)}
                    </div>
                    <h2>Comparatif des plans</h2>
                    <table>
                        <thead>
                            <tr><th>Critère</th>${recommendations.map(plan => `<th class="${plan.recommended ? 'selected' : ''}">${escape(plan.name)}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${rows.map(([label, getValue]) => `
                                <tr>
                                    <th>${label}</th>
                                    ${recommendations.map(plan => `<td class="${plan.recommended ? 'selected' : ''}">${getValue(plan)}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <p class="note">Les montants reposent sur les hypothèses déclarées et sur une réduction estimée des pertes, plafonnée à 75%. Cette comparaison doit être confirmée lors de l'étude détaillée.</p>
                    <footer>Simulateur Sécurité - Support d'échange commercial.</footer>
                </main>
            </body>
            </html>
        `;
    }

    static generateProspectHTML(profile, recommendation) {
        const escape = value => Utils.escapeHtml(value);
        const pistes = recommendation.pistes || [];
        const planning = recommendation.planning || null;
        const prospectName = profile.prospectName || 'Organisation prospect';
        const riskLabels = {
            circulation: 'Collisions et circulation',
            humain: 'Comportements et formation',
            organisation: 'Organisation et pics d\'activité',
            technologie: 'Équipements et détection'
        };
        const financial = recommendation.financial || {};
        const annualCurrentCost = Number(profile.annualIncidents || 0) *
            (Number(profile.averageIncidentCost || 0) + Number(profile.disruptionDays || 0) * Number(profile.dailyOperationCost || 0));

        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Synthèse prospect - ${escape(prospectName)}</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #1e293b; margin: 0; }
                    .page { max-width: 920px; margin: 0 auto; padding: 42px; }
                    .header { border-bottom: 4px solid #ff6b35; padding-bottom: 20px; margin-bottom: 28px; }
                    h1 { margin: 8px 0; color: #003d82; }
                    h2 { color: #003d82; margin: 28px 0 14px; }
                    .eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: 12px; color: #ff6b35; font-weight: bold; }
                    .profile, .metrics { display: flex; gap: 12px; flex-wrap: wrap; }
                    .profile span { padding: 8px 12px; border-radius: 18px; background: #eff6ff; font-size: 13px; }
                    .metric { flex: 1; min-width: 150px; background: #f8fafc; padding: 16px; border-radius: 10px; }
                    .metric strong { display: block; color: #003d82; font-size: 23px; }
                    .metric small { color: #64748b; }
                    .reason { margin-top: 22px; padding: 16px; border-left: 4px solid #ff6b35; background: #fff7ed; }
                    .comparison { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 14px; }
                    .comparison div { padding: 14px; border: 1px solid #e2e8f0; border-radius: 9px; }
                    .comparison strong { display: block; color: #003d82; font-size: 19px; }
                    .comparison .alert strong { color: #b91c1c; }
                    .comparison .gain strong { color: #047857; }
                    .assumptions { font-size: 12px; color: #64748b; margin-top: 12px; }
                    .planning-kpis { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
                    .planning-kpis div { min-width: 145px; padding: 10px 13px; border-radius: 8px; background: #eff6ff; }
                    .planning-kpis strong { display: block; color: #003d82; font-size: 18px; }
                    .planning-kpis span { color: #64748b; font-size: 11px; }
                    .gantt { margin-top: 12px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px; page-break-inside: avoid; }
                    .gantt-row { display: flex; align-items: center; gap: 10px; margin: 9px 0; }
                    .gantt-label { flex: 0 0 68px; color: #475569; font-size: 12px; font-weight: bold; }
                    .gantt-track { position: relative; flex: 1; height: 29px; border-radius: 6px; background: repeating-linear-gradient(to right, #f8fafc, #f8fafc calc(8.333% - 1px), #e2e8f0 calc(8.333% - 1px), #e2e8f0 8.333%); }
                    .gantt-task { position: absolute; top: 4px; height: 21px; overflow: hidden; padding: 3px 7px; border-radius: 5px; color: white; font-size: 10px; font-weight: bold; white-space: nowrap; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .gantt-task.color-0 { background: #003d82; }
                    .gantt-task.color-1 { background: #ff6b35; }
                    .gantt-task.color-2 { background: #059669; }
                    .gantt-task.color-3 { background: #7c3aed; }
                    .gantt-note { margin: 10px 0 0; color: #64748b; font-size: 11px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { padding: 11px; background: #003d82; color: white; text-align: left; }
                    td { padding: 11px; border-bottom: 1px solid #e2e8f0; }
                    footer { margin-top: 34px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
                </style>
            </head>
            <body>
                <main class="page">
                    <header class="header">
                        <div class="eyebrow">Synthèse de diagnostic sécurité</div>
                        <h1>${escape(prospectName)}</h1>
                        <p>Plan ${escape(recommendation.name)} - généré le ${new Date().toLocaleDateString('fr-FR')}</p>
                    </header>
                    <div class="profile">
                        <span>Risque : ${escape(riskLabels[profile.risk] || 'Sécurité')}</span>
                        <span>Budget cible : ${Utils.formatCurrency(profile.budget || 0)}</span>
                        <span>Horizon : ${Number(profile.horizon || 0)} mois</span>
                    </div>
                    <h2>Coût de l'inaction</h2>
                    <div class="metrics">
                        <div class="metric"><strong>${Utils.formatCurrency(annualCurrentCost)}</strong><small>Coût annuel actuel estimé</small></div>
                        <div class="metric"><strong>${Utils.formatCurrency(financial.threeYearBaseline || annualCurrentCost * 3)}</strong><small>Sans action sur 3 ans</small></div>
                    </div>
                    <p class="assumptions">Hypothèses déclarées : ${Number(profile.annualIncidents || 0)} incidents/an, ${Utils.formatCurrency(profile.averageIncidentCost || 0)} par incident, ${Number(profile.disruptionDays || 0)} jour(s) de perturbation à ${Utils.formatCurrency(profile.dailyOperationCost || 0)} par jour.</p>
                    <h2>Recommandation</h2>
                    <div class="metrics">
                        <div class="metric"><strong>${pistes.length}</strong><small>Pistes retenues</small></div>
                        <div class="metric"><strong>${Utils.formatCurrency(recommendation.totalBudget)}</strong><small>Budget sur 3 ans</small></div>
                        <div class="metric"><strong>${recommendation.averageImpact}/100</strong><small>Impact moyen</small></div>
                        <div class="metric"><strong>${recommendation.averageDelay} mois</strong><small>Déploiement moyen</small></div>
                    </div>
                    <p class="reason"><strong>Pourquoi cette recommandation :</strong> ${escape(recommendation.reason)}</p>
                    <h2>Comparaison financière estimée</h2>
                    <div class="comparison">
                        <div class="alert"><small>Sans action</small><strong>${Utils.formatCurrency(financial.threeYearBaseline || 0)}</strong></div>
                        <div><small>Avec le plan</small><strong>${Utils.formatCurrency(financial.costWithPlan || 0)}</strong></div>
                        <div class="gain"><small>Gain net potentiel</small><strong>${Utils.formatCurrency(financial.netGain || 0)}</strong></div>
                        <div><small>Délai de retour estimé</small><strong>${financial.paybackMonths ? financial.paybackMonths + ' mois' : 'Non atteint'}</strong></div>
                    </div>
                    <p class="assumptions">Estimation indicative : le taux de réduction utilisé est plafonné à 75% et doit être confirmé par une étude détaillée.</p>
                    ${this.generateProspectPlanningHTML(planning)}
                    <h2>Actions retenues</h2>
                    <table>
                        <thead><tr><th>Piste</th><th>Action</th><th>Budget</th><th>Déploiement</th><th>Impact</th></tr></thead>
                        <tbody>
                            ${pistes.map(piste => `
                                <tr>
                                    <td>${escape(piste.numero)}</td>
                                    <td>${escape(piste.titre)}</td>
                                    <td>${Utils.formatCurrency(piste.budget?.cout_3_ans || 0)}</td>
                                    <td>${Number(piste.delai_mois || 0)} mois</td>
                                    <td>${Number(piste.impact_score || 0)}/100</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <footer>Simulateur Sécurité - Synthèse préparée pour échange commercial.</footer>
                </main>
            </body>
            </html>
        `;
    }

    static generateProspectPlanningHTML(planning) {
        if (!planning || !Array.isArray(planning.teams) || planning.teams.length === 0) return '';
        const escape = value => Utils.escapeHtml(value);
        const duration = Math.max(1, Number(planning.totalDuration) || 1);
        const teamCount = Math.max(1, Number(planning.teamCount) || planning.teams.length);
        const sequential = Number(planning.sequentialDuration) || duration;
        const saved = Number(planning.savedMonths) || 0;
        return `
            <h2>Calendrier de déploiement</h2>
            <div class="planning-kpis">
                <div><strong>${duration} mois</strong><span>Durée totale planifiée</span></div>
                <div><strong>${teamCount}</strong><span>Équipe${teamCount > 1 ? 's' : ''} mobilisée${teamCount > 1 ? 's' : ''}</span></div>
                <div><strong>${saved} mois</strong><span>Gain vs séquentiel (${sequential} mois)</span></div>
            </div>
            <div class="gantt">
                ${planning.teams.map((team, teamIndex) => `
                    <div class="gantt-row">
                        <span class="gantt-label">Équipe ${Number(team.id) || ''}</span>
                        <div class="gantt-track">
                            ${(team.tasks || []).map((task, taskIndex) => `
                                <span class="gantt-task color-${(teamIndex + taskIndex) % 4}"
                                    style="left:${(Number(task.start || 0) / duration) * 100}%;width:${(Number(task.duration || 0) / duration) * 100}%"
                                    title="${escape(task.piste?.titre || task.piste?.numero || '')} : ${Number(task.duration || 0)} mois">
                                    ${escape(task.piste?.numero || '')} (${Number(task.duration || 0)} m.)
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <p class="gantt-note">Hypothèse : exécution parallèle sans dépendances entre pistes.</p>
            </div>
        `;
    }

    /**
     * Exporter en JSON
     */
    static exportJSON(pistes, filename = 'scenario.json') {
        try {
            const data = {
                version: '1.0.0',
                generated: new Date().toISOString(),
                pistes: pistes.map(p => ({
                    id: p.id,
                    numero: p.numero,
                    titre: p.titre,
                    categorie: p.categorie,
                    budget: p.budget.cout_3_ans,
                    impact_score: p.impact_score,
                    roi_mois: p.roi_mois,
                    delai_mois: p.delai_mois
                })),
                summary: {
                    totalPistes: pistes.length,
                    totalBudget: pistes.reduce((s, p) => s + p.budget.cout_3_ans, 0),
                    averageImpact: Math.round(pistes.reduce((s, p) => s + p.impact_score, 0) / pistes.length),
                    totalAccidentsEvited: pistes.reduce((s, p) => s + p.impact_accidents_evites, 0)
                }
            };

            Utils.downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
            appActions.showNotification('Données exportées en JSON!', 'success');

        } catch (error) {
            console.error('Erreur export JSON:', error);
            appActions.showNotification('Erreur lors de l\'export JSON', 'error');
        }
    }

    /**
     * Exporter en HTML
     */
    static exportHTML(pistes, filename = 'rapport.html') {
        try {
            const html = this.generatePDFHTML(pistes);
            Utils.downloadFile(html, filename, 'text/html');
            appActions.showNotification('Rapport HTML généré!', 'success');
        } catch (error) {
            console.error('Erreur export HTML:', error);
            appActions.showNotification('Erreur lors de l\'export HTML', 'error');
        }
    }

    /**
     * Exporter en CSV
     */
    static exportCSV(pistes, filename = 'pistes.csv') {
        try {
            const headers = ['ID', 'Titre', 'Catégorie', 'Budget (3 ans)', 'Impact', 'Délai de retour (mois)', 'Délai de déploiement (mois)'];
            const rows = pistes.map(p => [
                p.numero,
                `"${p.titre}"`,
                p.categorie,
                p.budget.cout_3_ans,
                p.impact_score,
                p.roi_mois,
                p.delai_mois
            ]);

            const csv = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            Utils.downloadFile(csv, filename, 'text/csv');
            appActions.showNotification('Fichier CSV généré!', 'success');

        } catch (error) {
            console.error('Erreur export CSV:', error);
            appActions.showNotification('Erreur lors de l\'export CSV', 'error');
        }
    }

    /**
     * Télécharger fichier
     */
    static downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Export global
window.Export = Export;
