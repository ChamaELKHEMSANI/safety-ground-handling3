/**
 * API.JS - Services API
 * Abstractions pour requêtes
 */

class APIService {
    constructor(baseUrl = '/data') {
        this.baseUrl = baseUrl;
        this.timeout = 5000;
    }

    /**
     * Charger pistes XML
     */
    async loadPistes() {
        try {
            const response = await fetch(`${this.baseUrl}/pistes.xml`, {
                timeout: this.timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const xml = await response.text();
            return XMLParser.parsePistes(xml);
        } catch (error) {
            console.error('Erreur chargement pistes:', error);
            throw error;
        }
    }

    /**
     * Charger scénarios
     */
    async loadScenarios() {
        try {
            const response = await fetch(`${this.baseUrl}/scenarios.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur chargement scénarios:', error);
            return [];
        }
    }

    /**
     * Charger config
     */
    async loadConfig() {
        try {
            const response = await fetch(`${this.baseUrl}/config.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur chargement config:', error);
            return {};
        }
    }

    /**
     * Chercher piste
     */
    searchPistes(pistes, query) {
        return pistes.filter(p =>
            p.titre.toLowerCase().includes(query.toLowerCase()) ||
            p.numero.toLowerCase().includes(query.toLowerCase())
        );
    }

    /**
     * Filtrer pistes
     */
    filterPistes(pistes, filters) {
        return pistes.filter(p => {
            if (filters.categories && filters.categories.length > 0) {
                if (!filters.categories.includes(p.categorie)) return false;
            }
            if (filters.maxBudget) {
                if (p.budget.cout_3_ans > filters.maxBudget) return false;
            }
            if (filters.minImpact) {
                if (p.impact_score < filters.minImpact) return false;
            }
            return true;
        });
    }

    /**
     * Trier pistes
     */
    sortPistes(pistes, sortBy = 'numero', order = 'asc') {
        const sorted = [...pistes];
        sorted.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        return sorted;
    }

    /**
     * Calculer statistiques
     */
    calculateStats(pistes) {
        if (pistes.length === 0) {
            return {
                count: 0,
                totalBudget: 0,
                avgBudget: 0,
                avgImpact: 0,
                totalImpact: 0,
                maxBudget: 0,
                minBudget: 0
            };
        }

        const budgets = pistes.map(p => p.budget.cout_3_ans);
        const impacts = pistes.map(p => p.impact_score);

        return {
            count: pistes.length,
            totalBudget: budgets.reduce((a, b) => a + b, 0),
            avgBudget: budgets.reduce((a, b) => a + b, 0) / pistes.length,
            avgImpact: Math.round(impacts.reduce((a, b) => a + b, 0) / pistes.length),
            totalImpact: impacts.reduce((a, b) => a + b, 0),
            maxBudget: Math.max(...budgets),
            minBudget: Math.min(...budgets)
        };
    }

    /**
     * Exporter données
     */
    exportData(data, format = 'json', filename = 'export') {
        let content, type;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            type = 'application/json';
        } else if (format === 'csv') {
            content = this.convertToCSV(data);
            type = 'text/csv';
        } else {
            content = JSON.stringify(data);
            type = 'text/plain';
        }

        Utils.downloadFile(content, `${filename}.${format}`, type);
    }

    /**
     * Convertir en CSV
     */
    convertToCSV(data) {
        if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]);
            const rows = data.map(item =>
                headers.map(header => {
                    const value = item[header];
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value}"`;
                    }
                    return value;
                })
            );
            return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        }
        return '';
    }
}

// Instance globale
const api = new APIService();

window.APIService = APIService;
window.api = api;
