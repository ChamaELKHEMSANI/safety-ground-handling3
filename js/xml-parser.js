/**
 * XML-PARSER.JS - Parser XML vers JSON
 */

class XMLParser {
    static extractText(obj) {
        if (!obj) return null;
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) return this.extractText(obj[0]);
        if (obj['#text']) return obj['#text'];
        return null;
    }

    static extractArray(obj) {
        if (!obj) return [];
        return Array.isArray(obj) ? obj : [obj];
    }

    static transformElement(elementXML) {
        if (!elementXML) return null;
        const element = {};

        Object.keys(elementXML).forEach((key) => {
            if (key === '@attributes' || key === '#text') return;
            const value = elementXML[key];
            if (Array.isArray(value)) {
                element[key] = value.map(item => this.extractText(item)).filter(Boolean).join(' | ');
            } else {
                element[key] = this.extractText(value);
            }
        });

        if (elementXML['@attributes']) {
            element.attributes = { ...elementXML['@attributes'] };
        }

        return Object.keys(element).length > 0 ? element : null;
    }

    static transformElementList(sectionXML) {
        return this.extractArray(sectionXML?.element)
            .map(element => this.transformElement(element))
            .filter(Boolean);
    }

    static normalizeCustomData(customDataXML) {
        if (!customDataXML || typeof customDataXML !== 'object') return {};
        return Object.keys(customDataXML).length > 0 ? customDataXML : {};
    }

    static transformJustificatif(justificatifXML) {
        if (!justificatifXML) return null;
        const links = this.extractArray(justificatifXML.links?.url)
            .map(url => this.extractText(url))
            .filter(Boolean);
        const technologies = this.extractArray(justificatifXML.technologies?.technology)
            .map(technology => this.extractText(technology))
            .filter(Boolean);
        const inspirations = this.extractArray(justificatifXML.inspirations?.aspect)
            .map(aspect => this.extractText(aspect))
            .filter(Boolean);
        const resultMetrics = this.extractArray(justificatifXML.results?.metric)
            .map(metric => ({
                name: metric?.['@attributes']?.name || '',
                value: this.extractText(metric)
            }))
            .filter(metric => metric.name || metric.value);

        const title = this.extractText(justificatifXML.title);
        const organization = this.extractText(justificatifXML.organization);
        const country = this.extractText(justificatifXML.country);
        const year = this.extractText(justificatifXML.year);
        const resultText = this.extractText(justificatifXML.results?.text);

        return {
            id: justificatifXML['@attributes']?.id,
            type: this.extractText(justificatifXML.type),
            titre: this.extractText(justificatifXML.titre) || title,
            description: this.extractText(justificatifXML.description),
            url: this.extractText(justificatifXML.url) || links[0] || '',
            source: this.extractText(justificatifXML.source) || organization,
            pays_origine: this.extractText(justificatifXML.pays_origine) || country,
            annee: this.extractText(justificatifXML.annee) || year,
            pertinence: this.extractText(justificatifXML.pertinence),
            resultat: this.extractText(justificatifXML.resultat) || resultText,
            title,
            subtitle: this.extractText(justificatifXML.subtitle),
            organization,
            country,
            year,
            links,
            technologies,
            results: {
                metrics: resultMetrics,
                text: resultText
            },
            lesson: this.extractText(justificatifXML.lesson),
            inspirations,
            customData: this.normalizeCustomData(justificatifXML.customData)
        };
    }

    static transformDispositifElements(pisteXML) {
        const elementsRoot = pisteXML?.elements && typeof pisteXML.elements === 'object'
            ? pisteXML.elements
            : pisteXML;
        const ignoredSections = new Set([
            '@attributes',
            'elements',
            'numero',
            'titre',
            'slogan',
            'titre_long',
            'description',
            'description_longue',
            'categorie',
            'famille',
            'priorite',
            'priorite_score',
            'budget',
            'delai_mois',
            'delai_texte',
            'impact_texte',
            'impact_score',
            'impact_accidents_evites',
            'impact_economies',
            'roi_texte',
            'roi_mois',
            'niveau_impact',
            'niveau_faisabilite',
            'niveau_acceptabilite',
            'status',
            'rating',
            'active',
            'date_creation',
            'date_modification',
            'dimensions',
            'tags',
            'justificatifs',
            'risques',
            'avantages',
            'relations'
        ]);

        return Object.keys(elementsRoot || {}).reduce((sections, key) => {
            if (ignoredSections.has(key)) return sections;
            const items = this.transformElementList(elementsRoot[key]);
            if (items.length > 0) {
                sections[key] = items;
            }
            return sections;
        }, {});
    }

    /**
     * Parser fichier XML
     */
    static async parseXML(url) {
        try {
            const response = await fetch(url);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            if (xmlDoc.documentElement.nodeName === 'parsererror') {
                throw new Error('Erreur parsing XML');
            }
            
            return this.xmlToJSON(xmlDoc.documentElement);
        } catch (error) {
            console.error('Erreur chargement XML:', error);
            throw error;
        }
    }

    /**
     * Convertir élément XML en JSON
     */
    static xmlToJSON(element) {
        const obj = {};
        
        // Ajouter attributs
        if (element.attributes && element.attributes.length) {
            obj['@attributes'] = {};
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                obj['@attributes'][attr.name] = attr.value;
            }
        }

        // Traiter les enfants
        const children = Array.from(element.childNodes).filter(
            node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
        );

        if (children.length === 0) {
            // Noeud terminal
            const text = element.textContent.trim();
            return obj['@attributes'] ? obj : text || null;
        }

        const childMap = {};
        
        for (const child of children) {
            if (child.nodeType === 3) {
                // Noeud texte
                const text = child.textContent.trim();
                if (text) {
                    obj['#text'] = text;
                }
            } else if (child.nodeType === 1) {
                // Noeud élément
                const childName = child.nodeName;
                const childValue = this.xmlToJSON(child);
                
                if (childMap[childName]) {
                    // Convertir en array si multiple
                    if (!Array.isArray(childMap[childName])) {
                        childMap[childName] = [childMap[childName]];
                    }
                    childMap[childName].push(childValue);
                } else {
                    childMap[childName] = childValue;
                }
            }
        }

        return { ...obj, ...childMap };
    }

    /**
     * Parser les pistes depuis XML
     */
    static async parsePistes(xmlData) {
        try {
            const data = typeof xmlData === 'string' ? 
                await this.parseXML(xmlData) : 
                xmlData;

            const projectData = data?.projet || data || {};
            const config = projectData.config || {};
            const pisteElements = this.extractArray(projectData.pistes?.piste || projectData.piste);

            const pistes = pisteElements
                .filter(p => p && p['@attributes'])
                .map(p => this.transformPiste(p));

            const pistesValides = pistes.filter(p => p !== null);
            const pisteMap = new Map();
            pistesValides.forEach((piste) => {
                if (piste?.numero) pisteMap.set(String(piste.numero), piste);
                if (piste?.id) pisteMap.set(String(piste.id), piste);
            });

            const scenariosRaw = this.extractArray(projectData.scenarios?.scenario);
            const missingScenarioPisteRefs = [];
            const scenarios = scenariosRaw
                .map((scenarioXML) => this.transformScenario(scenarioXML, pisteMap, missingScenarioPisteRefs))
                .filter(Boolean);

            const utilisateursRaw = this.extractArray(projectData.utilisateurs?.utilisateur);
            const utilisateurs = utilisateursRaw
                .map((userXML) => this.transformUtilisateur(userXML))
                .filter(Boolean);

            return {
                config: {
                    totalPistes: parseInt(this.extractText(config.totalPistes) || `${pistesValides.length || 61}`, 10),
                    totalScenarios: parseInt(this.extractText(config.totalScenarios) || `${scenarios.length}`, 10),
                    totalUtilisateurs: parseInt(this.extractText(config.totalUtilisateurs) || `${utilisateurs.length}`, 10),
                    dateCreation: this.extractText(config.dateCreation),
                    version: this.extractText(config.version),
                    baselineAccidents: parseInt(this.extractText(config.baselineAccidents) || '24', 10)
                },
                pistes: pistesValides,
                scenarios,
                utilisateurs,
                integrity: {
                    missingScenarioPisteRefs
                }
            };
        } catch (error) {
            console.error('Erreur parsing pistes:', error);
            throw error;
        }
    }

    /**
     * Transformer élément piste XML en objet
     */
    static transformPiste(pisteXML) {
        try {
            const piste = {
                id: pisteXML['@attributes']?.id,
                numero: this.extractText(pisteXML.numero),
                titre: this.extractText(pisteXML.titre),
                slogan: this.extractText(pisteXML.slogan),
                titre_long: this.extractText(pisteXML.titre_long),
                description: this.extractText(pisteXML.description),
                description_longue: this.extractText(pisteXML.description_longue),
                categorie: this.extractText(pisteXML.categorie),
                famille: this.extractText(pisteXML.famille),
                priorite: this.extractText(pisteXML.priorite),
                priorite_score: parseInt(this.extractText(pisteXML.priorite_score) || '0', 10),
                rating: parseInt(this.extractText(pisteXML.rating) || '0', 10),
                 
                budget: {
                    cout_3_ans: parseInt(this.extractText(pisteXML.budget?.cout_3_ans) || '0', 10),
                    cout_2026: parseInt(this.extractText(pisteXML.budget?.cout_2026) || '0', 10),
                    cout_2027: parseInt(this.extractText(pisteXML.budget?.cout_2027) || '0', 10),
                    cout_2028: parseInt(this.extractText(pisteXML.budget?.cout_2028) || '0', 10),
                    cout_recurrent_annuel: parseInt(this.extractText(pisteXML.budget?.cout_recurrent_annuel) || '0', 10)
                },
                
                delai_mois: parseInt(this.extractText(pisteXML.delai_mois) || '0', 10),
                delai_texte: this.extractText(pisteXML.delai_texte),
                
                impact_texte: this.extractText(pisteXML.impact_texte),
                impact_score: parseInt(this.extractText(pisteXML.impact_score) || '0', 10),
                impact_accidents_evites: parseInt(this.extractText(pisteXML.impact_accidents_evites) || '0', 10),
                impact_economies: parseInt(this.extractText(pisteXML.impact_economies) || '0', 10),
                
                roi_texte: this.extractText(pisteXML.roi_texte),
                roi_mois: parseInt(this.extractText(pisteXML.roi_mois) || '0', 10),
                
                niveau_impact: parseInt(this.extractText(pisteXML.niveau_impact) || '0', 10),
                niveau_faisabilite: parseInt(this.extractText(pisteXML.niveau_faisabilite) || '0', 10),
                niveau_acceptabilite: parseInt(this.extractText(pisteXML.niveau_acceptabilite) || '0', 10),
                
                status: this.extractText(pisteXML.status),
                active: this.extractText(pisteXML.active) === 'true',
                
                date_creation: this.extractText(pisteXML.date_creation),
                date_modification: this.extractText(pisteXML.date_modification),
                
                dimensions: {
                    culture: parseInt(this.extractText(pisteXML.dimensions?.culture) || '0', 10),
                    technique: parseInt(this.extractText(pisteXML.dimensions?.technique) || '0', 10),
                    humain: parseInt(this.extractText(pisteXML.dimensions?.humain) || '0', 10),
                    organisationnel: parseInt(this.extractText(pisteXML.dimensions?.organisationnel) || '0', 10),
                    economique: parseInt(this.extractText(pisteXML.dimensions?.economique) || '0', 10)
                },
                
                tags: this.extractArray(pisteXML.tags?.tag).map(t => this.extractText(t)).filter(Boolean),
                
                justificatifs: this.extractArray(pisteXML.justificatifs?.justificatif)
                    .map(j => this.transformJustificatif(j))
                    .filter(Boolean),
                
                risques: this.extractArray(pisteXML.risques?.risque).map(r => ({
                    nom: this.extractText(r.nom),
                    probabilite: this.extractText(r.probabilite),
                    gravite: this.extractText(r.gravite),
                    mitigation: this.extractText(r.mitigation)
                })),
                
                avantages: this.extractArray(pisteXML.avantages?.avantage).map(a => ({
                    beneficiaire: this.extractText(a.beneficiaire),
                    texte: this.extractText(a.texte)
                })),
                
                relations: this.extractArray(pisteXML.relations?.relation).map(rel => {
                    const target = this.extractText(rel.piste_liee || rel.target);
                    return {
                        type: this.extractText(rel.type),
                        piste_liee: target && /^\d+$/.test(target) ? `P${target}` : target,
                        force: parseInt(this.extractText(rel.force) || '0', 10),
                        description: this.extractText(rel.description || rel.reason)
                    };
                }),

                phases: this.transformElementList(pisteXML.phase),
                dispositif_elements: this.transformDispositifElements(pisteXML)
            };

            const indicateurs = this.transformElementList(pisteXML.indicateur);
            if (indicateurs.length > 0) {
                piste.indicateurs = { activite: [], resultat: [], cle: indicateurs };
            }
            
            return piste;
        } catch (error) {
            console.error('Erreur transformation piste:', error);
            return null;
        }
    }

    static transformScenario(scenarioXML, pisteMap, missingRefs) {
        try {
            if (!scenarioXML) return null;
            const scenarioId = String(scenarioXML['@attributes']?.id || this.extractText(scenarioXML.id) || '');
            if (!scenarioId) return null;

            const pisteRefs = this.extractArray(scenarioXML.pistes?.piste)
                .map(ref => this.extractText(ref))
                .filter(Boolean)
                .map(ref => String(ref));

            const pistes = pisteRefs
                .map((ref) => {
                    const piste = pisteMap.get(ref);
                    if (!piste && Array.isArray(missingRefs)) {
                        missingRefs.push({ scenarioId, pisteRef: ref });
                    }
                    return piste || null;
                })
                .filter(Boolean);

            return {
                id: scenarioId,
                name: this.extractText(scenarioXML.nom) || this.extractText(scenarioXML.name) || `Scenario ${scenarioId}`,
                description: this.extractText(scenarioXML.description) || '',
                createdAt: this.extractText(scenarioXML.date_creation) || new Date().toISOString(),
                updatedAt: this.extractText(scenarioXML.date_modification) || null,
                author: this.extractText(scenarioXML.auteur) || null,
                isFavorite: this.extractText(scenarioXML.est_favori) === 'true',
                version: parseInt(this.extractText(scenarioXML.version) || '1', 10),
                pistes
            };
        } catch (error) {
            console.error('Erreur transformation scenario:', error);
            return null;
        }
    }

    static transformUtilisateur(userXML) {
        try {
            if (!userXML) return null;
            const id = String(userXML['@attributes']?.id || this.extractText(userXML.id) || '');
            if (!id) return null;

            return {
                id,
                nom: this.extractText(userXML.nom) || '',
                role: this.extractText(userXML.role) || 'user',
                email: this.extractText(userXML.email) || '',
                date_creation: this.extractText(userXML.date_creation) || null,
                actif: this.extractText(userXML.actif) === 'true'
            };
        } catch (error) {
            console.error('Erreur transformation utilisateur:', error);
            return null;
        }
    }
}

// Export global
window.XMLParser = XMLParser;
