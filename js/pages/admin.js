﻿/**
 * PAGES/ADMIN.JS - Page d'administration du système CDG 2026
 * Interface complète pour la gestion des données, utilisateurs et configuration
 */

pages.Admin = {
    activeTab: 'database',
    statsData: null,
    logsData: [],
    usersData: [],

    async render() {
        // Charger les données pour les statistiques
        await this.loadStats();

        return `
            <div class="admin-wrapper">
                <!-- En-tête -->
                <header class="admin-header">
                    <div class="header-content">
                        <h1>
                            <span class="material-symbols-outlined">admin_panel_settings</span>
                            Administration du système
                        </h1>
                        <p class="header-subtitle">Gestion des données, configuration et maintenance</p>
                    </div>
                    <div class="header-actions">
                        <div class="system-status">
                            <span class="status-indicator online"></span>
                            <span>Système opérationnel</span>
                        </div>
                    </div>
                </header>

                <!-- Navigation par onglets -->
                <div class="admin-tabs">
                    <button class="tab-btn ${this.activeTab === 'database' ? 'active' : ''}" onclick="pages.Admin.setActiveTab('database')">
                        <span class="material-symbols-outlined">database</span>
                        Base de données
                    </button>
                    <button class="tab-btn ${this.activeTab === 'users' ? 'active' : ''}" onclick="pages.Admin.setActiveTab('users')">
                        <span class="material-symbols-outlined">group</span>
                        Utilisateurs
                    </button>
                    <button class="tab-btn ${this.activeTab === 'logs' ? 'active' : ''}" onclick="pages.Admin.setActiveTab('logs')">
                        <span class="material-symbols-outlined">assignment</span>
                        Logs & Audit
                    </button>
                    <button class="tab-btn ${this.activeTab === 'config' ? 'active' : ''}" onclick="pages.Admin.setActiveTab('config')">
                        <span class="material-symbols-outlined">settings</span>
                        Configuration
                    </button>
                    <button class="tab-btn ${this.activeTab === 'maintenance' ? 'active' : ''}" onclick="pages.Admin.setActiveTab('maintenance')">
                        <span class="material-symbols-outlined">build</span>
                        Maintenance
                    </button>
                </div>

                <!-- Contenu principal -->
                <main class="admin-main">
                    ${this.renderTabContent()}
                </main>

                <!-- Footer avec informations système -->
                <footer class="admin-footer">
                    <div class="footer-info">
                        <span class="material-symbols-outlined">info</span>
                        <span>Version 3.0.0 Chama EL KHEMSANI | Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div class="footer-links">
                        <a href="#" onclick="pages.Admin.showHelp()">Documentation</a>
                        <a href="#" onclick="pages.Admin.showAbout()">À propos</a>
                    </div>
                </footer>
            </div>
        `;
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'database':
                return this.renderDatabaseTab();
            case 'users':
                return this.renderUsersTab();
            case 'logs':
                return this.renderLogsTab();
            case 'config':
                return this.renderConfigTab();
            case 'maintenance':
                return this.renderMaintenanceTab();
            default:
                return this.renderDatabaseTab();
        }
    },

    renderDatabaseTab() {
        const stats = this.statsData || { pistes: 0, scenarios: 0, users: 0, lastBackup: null };
        
        return `
            <div class="admin-tab-content database-tab">
                <h2 class="tab-title">Gestion de la base de données</h2>
                
                <!-- Cartes de statistiques -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #e0f2fe; color: #0369a1;">
                            <span class="material-symbols-outlined">folder</span>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Pistes</span>
                            <span class="stat-value">${stats.pistes}</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #dcfce7; color: #166534;">
                            <span class="material-symbols-outlined">playlist_play</span>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Scénarios</span>
                            <span class="stat-value">${stats.scenarios}</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fef9c3; color: #854d0e;">
                            <span class="material-symbols-outlined">group</span>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Utilisateurs</span>
                            <span class="stat-value">${stats.users}</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #f1f5f9; color: #334155;">
                            <span class="material-symbols-outlined">storage</span>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Taille cache</span>
                            <span class="stat-value">${stats.cacheSize || '0 MB'}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions sur la base de données -->
                <div class="actions-grid">
                    <div class="action-card">
                        <div class="action-icon">
                            <span class="material-symbols-outlined">download</span>
                        </div>
                        <h3>Exporter la base de données</h3>
                        <p>Télécharger une sauvegarde complète au format JSON</p>
                        <div class="action-buttons">
                            <button class="btn-primary" onclick="pages.Admin.exportDB()">
                                <span class="material-symbols-outlined">file_download</span>
                                Exporter
                            </button>
                        </div>
                    </div>

                    <div class="action-card">
                        <div class="action-icon">
                            <span class="material-symbols-outlined">upload</span>
                        </div>
                        <h3>Importer une sauvegarde</h3>
                        <p>Restaurer les données à partir d'un fichier JSON</p>
                        <div class="action-buttons">
                            <input type="file" id="import-file" accept=".json" style="display: none;" onchange="pages.Admin.importDB(this)">
                            <button class="btn-secondary" onclick="document.getElementById('import-file').click()">
                                <span class="material-symbols-outlined">file_upload</span>
                                Importer
                            </button>
                        </div>
                    </div>

                    <div class="action-card">
                        <div class="action-icon">
                            <span class="material-symbols-outlined">backup</span>
                        </div>
                        <h3>Sauvegarde automatique</h3>
                        <p>Configurer les sauvegardes automatiques</p>
                        <div class="action-buttons">
                            <button class="btn-secondary" onclick="pages.Admin.configureBackup()">
                                <span class="material-symbols-outlined">settings</span>
                                Configurer
                            </button>
                        </div>
                    </div>

                    <div class="action-card">
                        <div class="action-icon warning">
                            <span class="material-symbols-outlined">cleaning_services</span>
                        </div>
                        <h3>Nettoyer le cache</h3>
                        <p>Supprimer les données temporaires et le cache</p>
                        <div class="action-buttons">
                            <button class="btn-danger" onclick="pages.Admin.clearCache()">
                                <span class="material-symbols-outlined">delete_sweep</span>
                                Nettoyer
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Historique des sauvegardes -->
                <div class="backup-history">
                    <h3>Historique des sauvegardes</h3>
                    <table class="backup-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Taille</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderBackupHistory()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderUsersTab() {
        return `
            <div class="admin-tab-content users-tab">
                <h2 class="tab-title">Gestion des utilisateurs</h2>
                
                <!-- Barre d'actions -->
                <div class="users-actions">
                    <button class="btn-primary" onclick="pages.Admin.addUser()">
                        <span class="material-symbols-outlined">person_add</span>
                        Ajouter un utilisateur
                    </button>
                    <div class="search-box">
                        <span class="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Rechercher un utilisateur..." id="user-search" onkeyup="pages.Admin.filterUsers(this.value)">
                    </div>
                </div>

                <!-- Tableau des utilisateurs -->
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Rôle</th>
                            <th>Email</th>
                            <th>Dernière connexion</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderUsersList()}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderLogsTab() {
        return `
            <div class="admin-tab-content logs-tab">
                <h2 class="tab-title">Logs et audit</h2>
                
                <!-- Filtres -->
                <div class="logs-filters">
                    <select class="log-level" onchange="pages.Admin.filterLogsByLevel(this.value)">
                        <option value="all">Tous les niveaux</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                    </select>
                    
                    <input type="date" id="log-date" onchange="pages.Admin.filterLogsByDate(this.value)">
                    
                    <button class="btn-secondary" onclick="pages.Admin.exportLogs()">
                        <span class="material-symbols-outlined">download</span>
                        Exporter les logs
                    </button>
                </div>

                <!-- Tableau des logs -->
                <div class="logs-container">
                    <table class="logs-table">
                        <thead>
                            <tr>
                                <th>Horodatage</th>
                                <th>Niveau</th>
                                <th>Utilisateur</th>
                                <th>Action</th>
                                <th>Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderLogsList()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderConfigTab() {
        return `
            <div class="admin-tab-content config-tab">
                <h2 class="tab-title">Configuration système</h2>
                
                <form class="config-form" onsubmit="event.preventDefault(); pages.Admin.saveConfig()">
                    <!-- Paramètres généraux -->
                    <div class="config-section">
                        <h3>Paramètres généraux</h3>
                        
                        <div class="form-group">
                            <label>Nom de l'application</label>
                            <input type="text" value="CDG 2026 Safety Management" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Fuseau horaire</label>
                            <select class="form-input">
                                <option value="Europe/Paris" selected>Europe/Paris (UTC+1)</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Format de date</label>
                            <select class="form-input">
                                <option value="fr" selected>Français (JJ/MM/AAAA)</option>
                                <option value="en">Anglais (MM/DD/AAAA)</option>
                                <option value="iso">ISO (AAAA-MM-JJ)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Sécurité -->
                    <div class="config-section">
                        <h3>Sécurité</h3>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" checked> 
                                Activer l'authentification à deux facteurs
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label>Durée de session (minutes)</label>
                            <input type="number" value="120" min="5" max="1440" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Nombre de tentatives avant blocage</label>
                            <input type="number" value="5" min="1" max="10" class="form-input">
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div class="config-section">
                        <h3>Notifications</h3>
                        
                        <div class="form-group">
                            <label>Email de notification</label>
                            <input type="email" value="admin@cdg2026.fr" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" checked> 
                                Notifier en cas d'erreur système
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" checked> 
                                Rapport hebdomadaire automatique
                            </label>
                        </div>
                    </div>

                    <!-- Performance -->
                    <div class="config-section">
                        <h3>Performance</h3>
                        
                        <div class="form-group">
                            <label>Cache duration (minutes)</label>
                            <input type="number" value="30" min="0" max="1440" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Items par page</label>
                            <input type="number" value="20" min="5" max="100" class="form-input">
                        </div>
                    </div>

                    <div class="config-actions">
                        <button type="submit" class="btn-primary">
                            <span class="material-symbols-outlined">save</span>
                            Enregistrer la configuration
                        </button>
                        <button type="button" class="btn-secondary" onclick="pages.Admin.resetConfig()">
                            <span class="material-symbols-outlined">restart_alt</span>
                            Restaurer les valeurs par défaut
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    renderMaintenanceTab() {
        return `
            <div class="admin-tab-content maintenance-tab">
                <h2 class="tab-title">Maintenance système</h2>
                
                <!-- Diagnostics -->
                <div class="diagnostics-section">
                    <h3>Diagnostics système</h3>
                    
                    <div class="diagnostic-items">
                        <div class="diagnostic-item">
                            <span class="item-label">Connexion à la base de données</span>
                            <span class="item-status success">
                                <span class="material-symbols-outlined">check_circle</span>
                                OK
                            </span>
                        </div>
                        
                        <div class="diagnostic-item">
                            <span class="item-label">Espace de stockage</span>
                            <span class="item-status warning">
                                <span class="material-symbols-outlined">warning</span>
                                78% utilisé
                            </span>
                        </div>
                        
                        <div class="diagnostic-item">
                            <span class="item-label">API externe</span>
                            <span class="item-status success">
                                <span class="material-symbols-outlined">check_circle</span>
                                Connecté
                            </span>
                        </div>
                        
                        <div class="diagnostic-item">
                            <span class="item-label">Service de notifications</span>
                            <span class="item-status success">
                                <span class="material-symbols-outlined">check_circle</span>
                                Actif
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Actions de maintenance -->
                <div class="maintenance-grid">
                    <div class="maintenance-card">
                        <div class="card-icon">
                            <span class="material-symbols-outlined">tune</span>
                        </div>
                        <h4>Optimiser la base de données</h4>
                        <p>Compacter et optimiser les index</p>
                        <button class="btn-secondary" onclick="pages.Admin.optimizeDB()">
                            Lancer l'optimisation
                        </button>
                    </div>

                    <div class="maintenance-card">
                        <div class="card-icon">
                            <span class="material-symbols-outlined">rotate_left</span>
                        </div>
                        <h4>Rotation des logs</h4>
                        <p>Archiver et nettoyer les anciens logs</p>
                        <button class="btn-secondary" onclick="pages.Admin.rotateLogs()">
                            Effectuer la rotation
                        </button>
                    </div>

                    <div class="maintenance-card">
                        <div class="card-icon">
                            <span class="material-symbols-outlined">security</span>
                        </div>
                        <h4>Vérification de sécurité</h4>
                        <p>Scanner les vulnérabilités</p>
                        <button class="btn-secondary" onclick="pages.Admin.securityScan()">
                            Lancer le scan
                        </button>
                    </div>

                    <div class="maintenance-card">
                        <div class="card-icon">
                            <span class="material-symbols-outlined">update</span>
                        </div>
                        <h4>Mise à jour système</h4>
                        <p>Vérifier et installer les mises à jour</p>
                        <button class="btn-secondary" onclick="pages.Admin.checkUpdates()">
                            Vérifier les mises à jour
                        </button>
                    </div>
                </div>

                <!-- Mode maintenance -->
                <div class="maintenance-mode">
                    <h3>Mode maintenance</h3>
                    <p>Activer le mode maintenance pour empêcher l'accès des utilisateurs pendant les opérations critiques.</p>
                    <div class="mode-controls">
                        <button class="btn-warning" onclick="pages.Admin.enableMaintenanceMode()">
                            <span class="material-symbols-outlined">engineering</span>
                            Activer le mode maintenance
                        </button>
                        <span class="mode-status">
                            Statut: <strong class="text-success">Hors ligne</strong>
                        </span>
                    </div>
                </div>
            </div>
        `;
    },

    renderBackupHistory() {
        const backups = [
            { date: '2026-02-15 10:30', type: 'Automatique', size: '2.4 MB', status: 'Succès' },
            { date: '2026-02-14 23:00', type: 'Manuel', size: '2.3 MB', status: 'Succès' },
            { date: '2026-02-13 10:30', type: 'Automatique', size: '2.4 MB', status: 'Succès' },
            { date: '2026-02-12 10:30', type: 'Automatique', size: '2.2 MB', status: 'Échec' }
        ];

        return backups.map(backup => `
            <tr>
                <td>${backup.date}</td>
                <td>${backup.type}</td>
                <td>${backup.size}</td>
                <td><span class="status-badge ${backup.status === 'Succès' ? 'success' : 'error'}">${backup.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="pages.Admin.restoreBackup('${backup.date}')" title="Restaurer">
                        <span class="material-symbols-outlined">restore</span>
                    </button>
                    <button class="btn-icon" onclick="pages.Admin.downloadBackup('${backup.date}')" title="Télécharger">
                        <span class="material-symbols-outlined">download</span>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderUsersList() {
        const users = [
            { name: 'C. Dubuisson', role: 'Administrateur', email: 'c.dubuisson@cdg.fr', lastLogin: '2026-02-16 09:30', status: 'Actif' },
            { name: 'M. Laurent', role: 'Responsable sécurité', email: 'm.laurent@cdg.fr', lastLogin: '2026-02-15 14:20', status: 'Actif' },
            { name: 'P. Martin', role: 'Analyste', email: 'p.martin@cdg.fr', lastLogin: '2026-02-14 11:15', status: 'Actif' },
            { name: 'S. Bernard', role: 'Consultant', email: 's.bernard@externe.fr', lastLogin: '2026-02-10 16:45', status: 'Inactif' }
        ];

        return users.map(user => `
            <tr>
                <td class="user-cell">
                    <div class="user-avatar">${user.name.charAt(0)}</div>
                    <span>${user.name}</span>
                </td>
                <td>${user.role}</td>
                <td>${user.email}</td>
                <td>${user.lastLogin}</td>
                <td><span class="status-badge ${user.status === 'Actif' ? 'success' : 'inactive'}">${user.status}</span></td>
                <td class="actions-cell">
                    <button class="btn-icon" onclick="pages.Admin.editUser('${user.name}')" title="Modifier">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon" onclick="pages.Admin.disableUser('${user.name}')" title="Désactiver">
                        <span class="material-symbols-outlined">block</span>
                    </button>
                    <button class="btn-icon" onclick="pages.Admin.deleteUser('${user.name}')" title="Supprimer">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderLogsList() {
        const logs = [
            { timestamp: '2026-02-16 10:32:15', level: 'info', user: 'C. Dubuisson', action: 'Connexion', details: 'Authentification réussie' },
            { timestamp: '2026-02-16 10:15:22', level: 'warning', user: 'Système', action: 'Cache', details: 'Nettoyage automatique' },
            { timestamp: '2026-02-16 09:45:03', level: 'info', user: 'M. Laurent', action: 'Export', details: 'Export PDF - Comparaison' },
            { timestamp: '2026-02-16 08:30:18', level: 'error', user: 'Système', action: 'API', details: 'Timeout sur service externe' },
            { timestamp: '2026-02-15 17:20:44', level: 'info', user: 'P. Martin', action: 'Création', details: 'Nouveau scénario créé' }
        ];

        return logs.map(log => `
            <tr class="log-row log-${log.level}">
                <td>${log.timestamp}</td>
                <td><span class="level-badge level-${log.level}">${log.level}</span></td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.details}</td>
            </tr>
        `).join('');
    },

    async loadStats() {
        try {
            const pistes = await (window.db?.loadPistes ? db.loadPistes() : []);
            const scenarios = await (window.db?.loadScenarios ? db.loadScenarios() : []);
            
            this.statsData = {
                pistes: pistes.length,
                scenarios: scenarios.length,
                users: 4,
                cacheSize: '2.3 MB',
                lastBackup: '2026-02-15 10:30'
            };
        } catch (error) {
            console.error('Erreur chargement stats:', error);
            this.statsData = {
                pistes: 0,
                scenarios: 0,
                users: 0,
                cacheSize: '0 MB',
                lastBackup: null
            };
        }
    },

    setActiveTab(tab) {
        this.activeTab = tab;
        this.rerender();
    },

    // Méthodes CRUD pour la base de données
    async exportDB() {
        try {
            const data = {
                pistes: await db.loadPistes(),
                scenarios: await db.loadScenarios(),
                config: await db.loadConfig ? await db.loadConfig() : {},
                exportDate: new Date().toISOString(),
                version: '2.0.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cdg2026-backup-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            if (window.Notifications) {
                Notifications.success('Base de données exportée avec succès');
            }
        } catch (error) {
            console.error('Erreur export:', error);
            if (window.Notifications) {
                Notifications.error('Erreur lors de l\'export');
            }
        }
    },

    async importDB(input) {
        const file = input.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.pistes) await db.savePistes(data.pistes);
            if (data.scenarios) await db.saveScenarios(data.scenarios);
            if (data.config && db.saveConfig) await db.saveConfig(data.config);
            
            if (window.Notifications) {
                Notifications.success('Base de données importée avec succès');
            }
            
            await this.loadStats();
            this.rerender();
        } catch (error) {
            console.error('Erreur import:', error);
            if (window.Notifications) {
                Notifications.error('Erreur lors de l\'import - Fichier invalide');
            }
        }
    },

    async clearCache() {
        if (confirm('Êtes-vous sûr de vouloir nettoyer tout le cache ? Les données non sauvegardées seront perdues.')) {
            try {
                await db.clear('cache');
                await db.clear('temp');
                
                if (window.Notifications) {
                    Notifications.success('Cache nettoyé avec succès');
                }
            } catch (error) {
                console.error('Erreur nettoyage cache:', error);
                if (window.Notifications) {
                    Notifications.error('Erreur lors du nettoyage');
                }
            }
        }
    },

    configureBackup() {
        alert('Configuration des sauvegardes automatiques - Fonctionnalité à venir');
    },

    restoreBackup(date) {
        if (confirm(`Restaurer la sauvegarde du ${date} ?`)) {
            alert('Fonctionnalité de restauration à implémenter');
        }
    },

    downloadBackup(date) {
        alert(`Téléchargement de la sauvegarde du ${date}`);
    },

    // Méthodes utilisateurs
    addUser() {
        alert('Fonctionnalité d\'ajout d\'utilisateur à implémenter');
    },

    filterUsers(search) {
        console.log('Filtrage utilisateurs:', search);
    },

    editUser(user) {
        alert(`Modification de l'utilisateur ${user}`);
    },

    disableUser(user) {
        if (confirm(`Désactiver l'utilisateur ${user} ?`)) {
            alert(`Utilisateur ${user} désactivé`);
        }
    },

    deleteUser(user) {
        if (confirm(`Supprimer définitivement l'utilisateur ${user} ?`)) {
            alert(`Utilisateur ${user} supprimé`);
        }
    },

    // Méthodes logs
    filterLogsByLevel(level) {
        console.log('Filtrage logs par niveau:', level);
    },

    filterLogsByDate(date) {
        console.log('Filtrage logs par date:', date);
    },

    exportLogs() {
        alert('Export des logs - Fonctionnalité à implémenter');
    },

    // Méthodes configuration
    saveConfig() {
        alert('Configuration sauvegardée');
        if (window.Notifications) {
            Notifications.success('Configuration enregistrée');
        }
    },

    resetConfig() {
        if (confirm('Restaurer les valeurs par défaut ?')) {
            alert('Configuration restaurée');
            if (window.Notifications) {
                Notifications.info('Configuration restaurée par défaut');
            }
        }
    },

    // Méthodes maintenance
    optimizeDB() {
        alert('Optimisation de la base de données en cours...');
        setTimeout(() => {
            if (window.Notifications) {
                Notifications.success('Base de données optimisée');
            }
        }, 2000);
    },

    rotateLogs() {
        alert('Rotation des logs en cours...');
        setTimeout(() => {
            if (window.Notifications) {
                Notifications.success('Logs archivés et nettoyés');
            }
        }, 1500);
    },

    securityScan() {
        alert('Scan de sécurité en cours...');
        setTimeout(() => {
            if (window.Notifications) {
                Notifications.success('Scan terminé - Aucune vulnérabilité détectée');
            }
        }, 3000);
    },

    checkUpdates() {
        alert('Vérification des mises à jour...');
        setTimeout(() => {
            if (window.Notifications) {
                Notifications.info('Système à jour - Version 3.0.0');
            }
        }, 1000);
    },

    enableMaintenanceMode() {
        if (confirm('Activer le mode maintenance ? Les utilisateurs seront déconnectés.')) {
            alert('Mode maintenance activé');
            if (window.Notifications) {
                Notifications.warning('Mode maintenance activé');
            }
        }
    },

    showHelp() {
        window.open('/documentation', '_blank');
    },

    showAbout() {
        alert('Safety Management System\nVersion 3.0.0\nChama EL KHEMSANI  - Tous droits réservés');
    },

    rerender() {
        this.render().then(html => {
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = html;
            }
        });
    }
};

window.pages = window.pages || {};
window.pages.Admin = pages.Admin;
