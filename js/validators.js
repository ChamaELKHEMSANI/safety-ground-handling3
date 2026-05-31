/**
 * VALIDATORS.JS - Validation des données
 */

const Validators = {
    /**
     * Valider piste
     */
    validatePiste(piste) {
        if (!piste) return false;
        return (
            piste.numero &&
            piste.titre &&
            piste.budget &&
            piste.impact_score !== undefined
        );
    },

    /**
     * Valider scénario
     */
    validateScenario(scenario) {
        if (!scenario) return false;
        return (
            scenario.name &&
            Array.isArray(scenario.pistes) &&
            scenario.pistes.length > 0 &&
            scenario.pistes.every(p => p && (p.numero || p.id))
        );
    },

    /**
     * Valider les références de pistes d'un scénario
     */
    validateScenarioPistes(scenario, allPistes = []) {
        if (!scenario || !Array.isArray(scenario.pistes)) {
            return { valid: false, missing: [] };
        }

        const pisteIds = new Set();
        allPistes.forEach((p) => {
            if (p?.numero) pisteIds.add(String(p.numero));
            if (p?.id) pisteIds.add(String(p.id));
        });

        const missing = scenario.pistes
            .map((p) => {
                if (!p) return null;
                if (typeof p === 'string') return p;
                return p.numero || p.id || null;
            })
            .filter(Boolean)
            .map(String)
            .filter((id) => !pisteIds.has(id));

        return {
            valid: missing.length === 0,
            missing
        };
    },

    /**
     * Valider budget
     */
    validateBudget(budget) {
        return typeof budget === 'number' && budget > 0;
    },

    /**
     * Valider score impact
     */
    validateScore(score) {
        return typeof score === 'number' && score >= 0 && score <= 100;
    },

    /**
     * Valider email
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Valider URL
     */
    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Valider texte
     */
    validateText(text, minLength = 3, maxLength = 500) {
        return (
            typeof text === 'string' &&
            text.length >= minLength &&
            text.length <= maxLength
        );
    },

    /**
     * Valider JSON
     */
    validateJson(json) {
        try {
            JSON.parse(json);
            return true;
        } catch {
            return false;
        }
    }
};

window.Validators = Validators;
