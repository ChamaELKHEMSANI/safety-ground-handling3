/**
 * DB.JS - IndexedDB Wrapper pour persistance offline
 */

class Database {
    constructor(dbName = 'SimulateurCDG', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    /**
     * Initialiser la base de données
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                this.createStores();
            };
        });
    }

    /**
     * Créer les object stores
     */
    createStores() {
        const stores = [
            { name: 'pistes', keyPath: 'id' },
            { name: 'scenarios', keyPath: 'id' },
            { name: 'cache', keyPath: 'key' }
        ];

        stores.forEach(store => {
            if (!this.db.objectStoreNames.contains(store.name)) {
                this.db.createObjectStore(store.name, { keyPath: store.keyPath });
            }
        });
    }

    /**
     * Ajouter/Mettre à jour un enregistrement
     */
    async put(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtenir un enregistrement
     */
    async get(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtenir tous les enregistrements
     */
    async getAll(storeName) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Supprimer un enregistrement
     */
    async delete(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Vider un store
     */
    async clear(storeName) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Chercher avec index (ex: par catégorie)
     */
    async query(storeName, indexName, value) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Sauvegarder pistes localement
     */
    async savePistes(pistes) {
        try {
            for (const piste of pistes) {
                await this.put('pistes', piste);
            }
            console.log('Pistes sauvegardées en local');
        } catch (error) {
            console.error('Erreur sauvegarde pistes:', error);
        }
    }

    /**
     * Charger pistes depuis cache local
     */
    async loadPistes() {
        try {
            return await this.getAll('pistes');
        } catch (error) {
            console.error('Erreur chargement pistes:', error);
            return [];
        }
    }

    /**
     * Sauvegarder scénario
     */
    async saveScenario(scenario) {
        return await this.put('scenarios', scenario);
    }

    /**
     * Charger tous les scénarios
     */
    async loadScenarios() {
        try {
            return await this.getAll('scenarios');
        } catch (error) {
            console.error('Erreur chargement scénarios:', error);
            return [];
        }
    }

    /**
     * Sauvegarder données en cache
     */
    async cacheData(key, data, ttl = 3600000) {
        const cacheEntry = {
            key,
            data,
            timestamp: Date.now(),
            ttl
        };
        return await this.put('cache', cacheEntry);
    }

    /**
     * Obtenir données du cache
     */
    async getCachedData(key) {
        try {
            const entry = await this.get('cache', key);
            if (!entry) return null;
            
            // Vérifier si le cache n'a pas expiré
            const now = Date.now();
            if (now - entry.timestamp > entry.ttl) {
                await this.delete('cache', key);
                return null;
            }
            
            return entry.data;
        } catch (error) {
            console.error('Erreur cache:', error);
            return null;
        }
    }

    /**
     * Nettoyer les caches expirés
     */
    async cleanExpiredCache() {
        try {
            const entries = await this.getAll('cache');
            const now = Date.now();
            
            for (const entry of entries) {
                if (now - entry.timestamp > entry.ttl) {
                    await this.delete('cache', entry.key);
                }
            }
        } catch (error) {
            console.error('Erreur nettoyage cache:', error);
        }
    }

    /**
     * Exporter base de données
     */
    async export() {
        const pistes = await this.getAll('pistes');
        const scenarios = await this.getAll('scenarios');
        
        return {
            version: this.version,
            exported: new Date().toISOString(),
            pistes,
            scenarios
        };
    }

    /**
     * Importer base de données
     */
    async import(data) {
        try {
            await this.clear('pistes');
            await this.clear('scenarios');
            
            for (const piste of data.pistes) {
                await this.put('pistes', piste);
            }
            
            for (const scenario of data.scenarios) {
                await this.put('scenarios', scenario);
            }
            
            console.log('Base de données importée avec succès');
        } catch (error) {
            console.error('Erreur import:', error);
            throw error;
        }
    }
}

// Créer instance globale
const db = new Database();

// Initialiser au chargement
Utils.onReady(async () => {
    try {
        await db.init();
        console.log('Base de données initialisée');
    } catch (error) {
        console.error('Erreur initialisation DB:', error);
    }
});
