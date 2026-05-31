/**
 * UTILS.JS - Fonctions utilitaires globales
 */

const Utils = {
    /**
     * Formater une devise en EUR
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Formater un nombre avec séparateurs
     */
    formatNumber(num) {
        return new Intl.NumberFormat('fr-FR').format(num);
    },

    /**
     * Formater une date
     */
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Formater un pourcentage
     */
    formatPercent(value, decimals = 0) {
        return (value).toFixed(decimals) + '%';
    },

    /**
     * Calculer le ROI
     */
    calculateROI(investment, saving) {
        if (investment === 0) return 0;
        return ((saving - investment) / investment * 100).toFixed(2);
    },

    /**
     * Calculer la période de retour (mois)
     */
    calculatePaybackPeriod(investment, monthlySaving) {
        if (monthlySaving === 0) return Infinity;
        return Math.ceil(investment / monthlySaving);
    },

    /**
     * Générer un ID unique
     */
    generateUID() {
        return 'UID_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    },

    /**
     * Cloner un objet profondément
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Fusionner des objets
     */
    merge(target, source) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    },

    /**
     * Filtrer un tableau d'objets
     */
    filterByKey(array, key, value) {
        return array.filter(item => item[key] === value);
    },

    /**
     * Grouper un tableau par clé
     */
    groupBy(array, key) {
        return array.reduce((grouped, item) => {
            const group = item[key];
            grouped[group] = grouped[group] || [];
            grouped[group].push(item);
            return grouped;
        }, {});
    },

    /**
     * Trier un tableau d'objets
     */
    sortByKey(array, key, direction = 'asc') {
        return array.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            
            if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }
            
            if (direction === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
    },

    /**
     * Obtenir valeur depuis objet imbriqué
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    },

    /**
     * Valider un email
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Valider un nombre
     */
    validateNumber(num) {
        return !isNaN(num) && isFinite(num);
    },

    /**
     * Tronquer un texte
     */
    truncate(text, length, suffix = '...') {
        if (text.length > length) {
            return text.substring(0, length - suffix.length) + suffix;
        }
        return text;
    },

    /**
     * Escape text before interpolation in HTML templates.
     */
    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character]));
    },

    /**
     * Clone render data and escape strings without changing store values.
     */
    escapeDeep(value) {
        if (typeof value === 'string') return this.escapeHtml(value);
        if (Array.isArray(value)) return value.map(item => this.escapeDeep(item));
        if (value && typeof value === 'object') {
            return Object.fromEntries(
                Object.entries(value).map(([key, item]) => [key, this.escapeDeep(item)])
            );
        }
        return value;
    },

    /**
     * Escape an argument inserted into an inline handler.
     */
    escapeInlineArgument(value) {
        const jsValue = String(value ?? '')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
            .replace(/</g, '\\x3c')
            .replace(/>/g, '\\x3e');
        return this.escapeHtml(jsValue);
    },

    getPriorityLabel(priority) {
        const labels = { P1: 'CRITICAL', P2: 'HIGH', P3: 'MEDIUM', P4: 'LOW' };
        return labels[priority] || labels.P3;
    },

    unescapeHtml(value) {
        return String(value ?? '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&');
    },

    /**
     * Capitaliser première lettre
     */
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    /**
     * Convertir camelCase en kebab-case
     */
    camelToKebab(text) {
        return text.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    },

    /**
     * Convertir kebab-case en camelCase
     */
    kebabToCamel(text) {
        return text.replace(/-./g, match => match[1].toUpperCase());
    },

    /**
     * Délai (Promise)
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Attendre le DOM
     */
    onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    },

    /**
     * Créditer un événement avec debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle une fonction
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Obtenir paramètre URL
     */
    getQueryParam(param) {
        const params = new URLSearchParams(window.location.search);
        return params.get(param);
    },

    /**
     * Définir paramètre URL
     */
    setQueryParam(param, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(param, value);
        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    },

    /**
     * Copier texte dans presse-papiers
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Erreur copie:', err);
        });
    },

    /**
     * Télécharger fichier
     */
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Calculer moyenne
     */
    average(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    },

    /**
     * Calculer médiane
     */
    median(array) {
        const sorted = array.sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    /**
     * Calculer somme
     */
    sum(array) {
        return array.reduce((a, b) => a + b, 0);
    },

    /**
     * Trouver min
     */
    min(array) {
        return Math.min(...array);
    },

    /**
     * Trouver max
     */
    max(array) {
        return Math.max(...array);
    }
};
