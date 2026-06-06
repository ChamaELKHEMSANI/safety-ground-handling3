﻿/**
 * PAGES/HOME.JS - Page d'accueil améliorée
 * Design moderne avec animations et données dynamiques
 */

const pages = window.pages || {};

pages.Home = {
    async render() {
        const state = appStore.getState();
        const pistes = Utils.escapeDeep(state.allPistes || []);

        if (!pistes || pistes.length === 0) {
            return '<div class="loading-container"><div class="spinner"></div><p>Chargement des données...</p></div>';
        }

        // Calculer les métriques clés
        const totalBudget = pistes.reduce((sum, p) => sum + (p.budget?.cout_3_ans || 0), 0);
        const avgImpact = Math.round(pistes.reduce((sum, p) => sum + (p.impact_score || 0), 0) / pistes.length);
        const avgROI = Math.round(pistes.reduce((sum, p) => sum + (p.roi_mois || 0), 0) / pistes.length);
        const totalAccidents = pistes.reduce((sum, p) => sum + (p.impact_accidents_evites || 0), 0);
        
        // Compter par priorité
        const p1Count = pistes.filter(p => p.priorite === 'P1').length;
        const p2Count = pistes.filter(p => p.priorite === 'P2').length;
        const p3Count = pistes.filter(p => p.priorite === 'P3').length;
        const p4Count = pistes.filter(p => p.priorite === 'P4').length;

        // Récupérer les dernières pistes ajoutées
        const recentPistes = [...pistes].slice(0, 3);

        return `
            <div class="home-wrapper">
                <!-- Hero Section -->
                <section class="home-hero">
                    <div class="container">
                        <div class="hero-content">
                            <div class="hero-text animate-fade-in">
                                <h1>
                                    Simulateur Sécurité
                                    <span class="text-gradient"></span>
                                </h1>
                                <p class="hero-subtitle">
                                    Plateforme d'aide à la décision pour optimiser la sécurité aéroportuaire
                                    et réduire les risques opérationnels.
                                </p>
                                <div class="hero-cta">
                                    <a href="/diagnostic" class="btn-primary">
                                        <span class="material-symbols-outlined">assignment</span>
                                        Démarrer un diagnostic
                                    </a>
                                    <a href="/simulateur" class="btn-secondary">
                                        <span class="material-symbols-outlined">play_arrow</span>
                                        Lancer une simulation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Background decoration -->
                    <div class="hero-background">
                        <div class="gradient-orb orb-1"></div>
                        <div class="gradient-orb orb-2"></div>
                    </div>
                </section>

                <!-- Context Section -->
                <section class="context-section">
                    <div class="container">
                        <div class="section-header">
                            <h2>Contexte et enjeux</h2>
                            <p>Pourquoi agir maintenant ?</p>
                        </div>
                        
                        <div class="context-grid">
                            <div class="context-card animate-on-scroll">
                                <div class="context-icon warning">
                                    <span class="material-symbols-outlined">trending_up</span>
                                </div>
                                <h3>+100% Accidents corporels</h3>
                                <p>Hausse critique observée en 2024-2025 nécessitant une action immédiate.</p>
                            </div>
                            
                            <div class="context-card animate-on-scroll">
                                <div class="context-icon info">
                                    <span class="material-symbols-outlined">groups</span>
                                </div>
                                <h3>Renouvellement des effectifs</h3>
                                <p>Intégration massive de nouveaux profils à acculturer aux règles de sécurité.</p>
                            </div>
                            
                            <div class="context-card animate-on-scroll">
                                <div class="context-icon success">
                                    <span class="material-symbols-outlined">verified_user</span>
                                </div>
                                <h3>Complexité opérationnelle</h3>
                                <p>61 pistes à aligner sur une trajectoire commune pour maximiser l'impact.</p>
                            </div>
                            
                            <div class="context-card animate-on-scroll">
                                <div class="context-icon accent">
                                    <span class="material-symbols-outlined">payments</span>
                                </div>
                                <h3>Optimisation budgétaire</h3>
                                <p>Nécessité de prioriser les investissements à fort retour sur investissement.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- KPIs Section -->
                <section class="kpi-section">
                    <div class="container">
                        <div class="kpi-grid">
                            <div class="kpi-card animate-scale">
                                <div class="kpi-icon">
                                    <span class="material-symbols-outlined">analytics</span>
                                </div>
                                <div class="kpi-content">
                                    <span class="kpi-label">Impact moyen</span>
                                    <span class="kpi-value">${avgImpact}/100</span>
                                    <span class="kpi-trend positive">+${Math.round(avgImpact * 0.15)} vs 2025</span>
                                </div>
                            </div>
                            
                            <div class="kpi-card animate-scale">
                                <div class="kpi-icon">
                                    <span class="material-symbols-outlined">schedule</span>
                                </div>
                                <div class="kpi-content">
                                    <span class="kpi-label">Délai de retour moyen</span>
                                    <span class="kpi-value">${avgROI} mois</span>
                                    <span class="kpi-trend positive">-${Math.round(avgROI * 0.1)} mois</span>
                                </div>
                            </div>
                            
                            <div class="kpi-card animate-scale">
                                <div class="kpi-icon">
                                    <span class="material-symbols-outlined">trending_down</span>
                                </div>
                                <div class="kpi-content">
                                    <span class="kpi-label">Accidents évités</span>
                                    <span class="kpi-value">${totalAccidents}/an</span>
                                    <span class="kpi-trend positive">+${Math.round(totalAccidents * 0.2)} vs cible</span>
                                </div>
                            </div>
                            
                            <div class="kpi-card animate-scale">
                                <div class="kpi-icon">
                                    <span class="material-symbols-outlined">savings</span>
                                </div>
                                <div class="kpi-content">
                                    <span class="kpi-label">Économies estimées</span>
                                    <span class="kpi-value">${(totalBudget * 1.2 / 1000000).toFixed(1)}M€</span>
                                    <span class="kpi-trend positive">ROI global</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Recent Tracks Section -->
                <section class="recent-section">
                    <div class="container">
                        <div class="section-header">
                            <h2>Pistes récentes</h2>
                            <p>Les dernières pistes d'amélioration ajoutées</p>
                        </div>
                        
                        <div class="recent-grid">
                            ${recentPistes.map(piste => `
                                <div class="track-card animate-on-scroll" role="link" tabindex="0" onclick="pages.Home.goToDetail('${piste.numero}')" onkeydown="if(event.key === 'Enter' || event.key === ' '){ event.preventDefault(); pages.Home.goToDetail('${piste.numero}'); }">
                                    <div class="track-header">
                                        <span class="track-id">${piste.numero}</span>
                                        <span class="priority-badge priority-${this.getPriorityClass(piste.priorite)}">
                                            ${Utils.getPriorityLabel(piste.priorite)}
                                        </span>
                                    </div>
                                    <h3 class="track-title">${piste.titre}</h3>
                                    <p class="track-description">${piste.description || 'Aucune description'}</p>
                                    <div class="track-footer">
                                        <div class="track-meta">
                                            <span class="meta-item">
                                                <span class="material-symbols-outlined">payments</span>
                                                ${this.formatCurrency(piste.budget?.cout_3_ans || 0)}
                                            </span>
                                            <span class="meta-item">
                                                <span class="material-symbols-outlined">analytics</span>
                                                ${piste.impact_score || 0}/100
                                            </span>
                                        </div>
                                        <button class="btn-view">
                                            <span class="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="section-action">
                            <a href="/explorer" class="btn-outline">
                                Voir toutes les pistes
                                <span class="material-symbols-outlined">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Features Section -->
                <section class="features-section">
                    <div class="container">
                        <div class="section-header">
                            <h2>Fonctionnalités</h2>
                            <p>Explorez tous les outils à votre disposition</p>
                        </div>
                        
                        <div class="features-grid">
                            <div class="feature-card animate-on-scroll">
                                <div class="feature-icon explore">
                                    <span class="material-symbols-outlined">explore</span>
                                </div>
                                <h3>Explorer</h3>
                                <p>Consultez l'inventaire des 61 pistes d'amélioration avec filtres avancés et système de notation.</p>
                                <div class="feature-stats">
                                    <span>${pistes.length} pistes</span>
                                    <span>${pistes.filter(p => p.categorie === 'Technique').length} techniques</span>
                                </div>
                                <a href="/explorer" class="feature-link">
                                    Parcourir
                                    <span class="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                            
                            <div class="feature-card animate-on-scroll">
                                <div class="feature-icon simulate">
                                    <span class="material-symbols-outlined">auto_awesome</span>
                                </div>
                                <h3>Simuler</h3>
                                <p>Testez vos scénarios d'investissement avec contraintes budgétaires, dimensionnelles et temporelles.</p>
                                <div class="feature-stats">
                                    <span>Optimisation multi-critères</span>
                                    <span>Front de Pareto</span>
                                </div>
                                <a href="/simulateur" class="feature-link">
                                    Lancer
                                    <span class="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                            
                            <div class="feature-card animate-on-scroll">
                                <div class="feature-icon compare">
                                    <span class="material-symbols-outlined">compare_arrows</span>
                                </div>
                                <h3>Comparer</h3>
                                <p>Analysez côte à côte plusieurs stratégies d'investissement avec visualisation radar.</p>
                                <div class="feature-stats">
                                    <span>Comparaison multi-scénarios</span>
                                    <span>Graphiques interactifs</span>
                                </div>
                                <a href="/compare" class="feature-link">
                                    Comparer
                                    <span class="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                            
                            <div class="feature-card animate-on-scroll">
                                <div class="feature-icon decide">
                                    <span class="material-symbols-outlined">check_circle</span>
                                </div>
                                <h3>Décider</h3>
                                <p>Validez et exportez votre plan d'action en PDF, JSON ou Excel pour présentation.</p>
                                <div class="feature-stats">
                                    <span>Exports professionnels</span>
                                    <span>Prêt pour validation</span>
                                </div>
                                <a href="/decide" class="feature-link">
                                    Exporter
                                    <span class="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="cta-section">
                    <div class="container">
                        <div class="cta-content">
                            <h2>Prêt à optimiser votre stratégie de sécurité ?</h2>
                            <p>Répondez à quelques questions et obtenez trois plans recommandés à présenter.</p>
                            <div class="cta-buttons">
                                <a href="/diagnostic" class="btn-primary btn-large">
                                    <span class="material-symbols-outlined">assignment</span>
                                    Démarrer un diagnostic
                                </a>
                                <a href="/simulateur" class="btn-secondary btn-large">
                                    <span class="material-symbols-outlined">play_arrow</span>
                                    Lancer une simulation
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    },

    getPriorityClass(priority) {
        const map = { 'P1': 'critical', 'P2': 'high', 'P3': 'medium', 'P4': 'low' };
        return map[priority] || 'medium';
    },

    formatCurrency(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + ' M€';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + ' k€';
        }
        return amount + ' €';
    },

    goToDetail(pisteId) {
        if (window.router) {
            window.router.navigate(`/piste-detail/${pisteId}`);
        }
    }
};

window.pages = pages;
