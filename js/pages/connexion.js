/**
 * PAGES/CONNEXION.JS - Page de connexion et authentification
 * Interface moderne avec formulaire, options de connexion et design attrayant
 */

pages.Connexion = {
    activeForm: 'login', // 'login' ou 'register' ou 'forgot'
    rememberMe: false,
    showPassword: false,

    async render() {
        return `
            <div class="connexion-wrapper">
                <!-- Bannière latérale (visible sur desktop) -->
                <div class="connexion-sidebar">
                    <div class="sidebar-content">
                        <div class="logo-container">
                            <div class="logo-box">
                                <span class="material-symbols-outlined">shield</span>
                            </div>
                            <h1 class="logo-text"></h1>
                        </div>
                        
                        <h2 class="sidebar-title">Bienvenue sur la plateforme</h2>
                        <p class="sidebar-description">
                            Simulateur de sécurité aéroportuaire - Outil d'aide à la décision pour optimiser la prévention des accidents d'engins de piste.
                        </p>

                        <div class="features-mini">
                            <div class="feature-mini">
                                <span class="material-symbols-outlined">check_circle</span>
                                <span>Pistes d'amélioration</span>
                            </div>
                            <div class="feature-mini">
                                <span class="material-symbols-outlined">check_circle</span>
                                <span>Simulation multicritères</span>
                            </div>
                            <div class="feature-mini">
                                <span class="material-symbols-outlined">check_circle</span>
                                <span>Export PDF professionnel</span>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Formulaire principal -->
                <div class="connexion-main">
                    <div class="form-container">
                        <!-- Logo mobile (visible uniquement sur mobile) -->
                        <div class="mobile-logo">
                            <div class="logo-box">
                                <span class="material-symbols-outlined">shield</span>
                            </div>
                            <h1></h1>
                        </div>

                        <!-- Navigation des formulaires -->


                        <!-- Formulaire de connexion -->
                        ${this.activeForm === 'login' ? this.renderLoginForm() : ''}
                        

                        <!-- Lien d'aide -->
                        <div class="help-link">
                            <span class="material-symbols-outlined">help</span>
                            <a href="/support">Besoin d'aide ?</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderLoginForm() {
        return `
            <div class="form-box login-form">
                <h2>Connexion à votre compte</h2>
                
                <form onsubmit="event.preventDefault(); pages.Connexion.handleLogin()">
                    <!-- Email -->
                    <div class="form-group">
                        <label for="email">
                            <span class="material-symbols-outlined">mail</span>
                            Email professionnel
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="prenom.nom@entreprise.fr"
                            required
                        >
                    </div>

                    <!-- Mot de passe -->
                    <div class="form-group">
                        <label for="password">
                            <span class="material-symbols-outlined">lock</span>
                            Mot de passe
                        </label>
                        <div class="password-input">
                            <input 
                                type="${this.showPassword ? 'text' : 'password'}" 
                                id="password" 
                                placeholder="••••••••"
                                required
                            >
                            <button 
                                type="button" 
                                class="toggle-password"
                                onclick="pages.Connexion.togglePassword()"
                            >
                                <span class="material-symbols-outlined">
                                    ${this.showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Options -->
                    <div class="form-options">
                        <label class="checkbox">
                            <input 
                                type="checkbox" 
                                ${this.rememberMe ? 'checked' : ''} 
                                onchange="pages.Connexion.toggleRememberMe()"
                            >
                            <span>Se souvenir de moi</span>
                        </label>
                    </div>

                    <!-- Bouton de connexion -->
                    <button type="submit" class="btn-login">
                        <span class="material-symbols-outlined">login</span>
                        Se connecter
                    </button>
                </form>

                <!-- Informations de démonstration -->
                <div class="demo-info">
                    <p class="demo-title">Mode démonstration : accès et droits simulés dans le navigateur.</p>
                    <p class="demo-title">Comptes de démonstration :</p>
                    <div class="demo-accounts">
                        <div class="demo-account" onclick="pages.Connexion.fillDemoAccount('admin@cdg2026.fr', 'admin123')">
                            <span class="material-symbols-outlined">admin_panel_settings</span>
                            <span>admin@cdg2026.fr</span>
                        </div>
                        <div class="demo-account" onclick="pages.Connexion.fillDemoAccount('user@cdg2026.fr', 'user123')">
                            <span class="material-symbols-outlined">person</span>
                            <span>user@cdg2026.fr</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderRegisterForm() {
        return `
            <div class="form-box register-form">
                <h2>Créer un compte</h2>
                
                <form onsubmit="event.preventDefault(); pages.Connexion.handleRegister()">
                    <!-- Nom complet -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstname">
                                <span class="material-symbols-outlined">badge</span>
                                Prénom
                            </label>
                            <input type="text" id="firstname" placeholder="Jean" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="lastname">
                                <span class="material-symbols-outlined">badge</span>
                                Nom
                            </label>
                            <input type="text" id="lastname" placeholder="DUPONT" required>
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="form-group">
                        <label for="reg-email">
                            <span class="material-symbols-outlined">mail</span>
                            Email professionnel
                        </label>
                        <input 
                            type="email" 
                            id="reg-email" 
                            placeholder="jean.dupont@entreprise.fr"
                            required
                        >
                    </div>

                    <!-- Entreprise -->
                    <div class="form-group">
                        <label for="company">
                            <span class="material-symbols-outlined">business</span>
                            Entreprise / Organisation
                        </label>
                        <select id="company" required>
                            <option value="">Sélectionnez votre entreprise</option>
                            <option value="adp">ADP</option>
                            <option value="airfrance">Air France</option>
                            <option value="fedex">FedEx</option>
                            <option value="csa">CSA</option>
                            <option value="other">Autre (précisez)</option>
                        </select>
                    </div>

                    <!-- Rôle -->
                    <div class="form-group">
                        <label for="role">
                            <span class="material-symbols-outlined">work</span>
                            Fonction
                        </label>
                        <input 
                            type="text" 
                            id="role" 
                            placeholder="Responsable sécurité, Chef d'équipe, ..."
                            required
                        >
                    </div>

                    <!-- Mot de passe -->
                    <div class="form-group">
                        <label for="reg-password">
                            <span class="material-symbols-outlined">lock</span>
                            Mot de passe
                        </label>
                        <div class="password-input">
                            <input 
                                type="password" 
                                id="reg-password" 
                                placeholder="••••••••"
                                required
                            >
                        </div>
                        <div class="password-strength">
                            <div class="strength-bar" style="width: 0%"></div>
                        </div>
                        <p class="password-hint">8 caractères minimum, 1 majuscule, 1 chiffre</p>
                    </div>

                    <!-- Confirmation mot de passe -->
                    <div class="form-group">
                        <label for="confirm-password">
                            <span class="material-symbols-outlined">lock</span>
                            Confirmer le mot de passe
                        </label>
                        <div class="password-input">
                            <input 
                                type="password" 
                                id="confirm-password" 
                                placeholder="••••••••"
                                required
                            >
                        </div>
                    </div>

                    <!-- Conditions d'utilisation -->
                    <div class="form-group terms-group">
                        <label class="checkbox">
                            <input type="checkbox" id="terms" required>
                            <span>
                                J'accepte les 
                                <a href="#/cgu" target="_blank">conditions d'utilisation</a>
                                et la 
                                <a href="#/confidentialite" target="_blank">politique de confidentialité</a>
                            </span>
                        </label>
                    </div>

                    <!-- Newsletter -->
                    <div class="form-group">
                        <label class="checkbox">
                            <input type="checkbox" id="newsletter">
                            <span>Recevoir les actualités du projet</span>
                        </label>
                    </div>

                    <!-- Bouton d'inscription -->
                    <button type="submit" class="btn-register">
                        <span class="material-symbols-outlined">app_registration</span>
                        Créer mon compte
                    </button>
                </form>

                <p class="login-redirect">
                    Déjà un compte ? 
                    <button class="link-btn" onclick="pages.Connexion.switchForm('login')">
                        Se connecter
                    </button>
                </p>
            </div>
        `;
    },

    renderForgotForm() {
        return `
            <div class="form-box forgot-form">
                <h2>Réinitialisation du mot de passe</h2>
                
                <p class="forgot-description">
                    Saisissez votre adresse email professionnelle. Vous recevrez un lien pour réinitialiser votre mot de passe.
                </p>
                
                <form onsubmit="event.preventDefault(); pages.Connexion.handleForgotPassword()">
                    <!-- Email -->
                    <div class="form-group">
                        <label for="forgot-email">
                            <span class="material-symbols-outlined">mail</span>
                            Email professionnel
                        </label>
                        <input 
                            type="email" 
                            id="forgot-email" 
                            placeholder="prenom.nom@entreprise.fr"
                            required
                        >
                    </div>

                    <!-- Bouton d'envoi -->
                    <button type="submit" class="btn-forgot">
                        <span class="material-symbols-outlined">send</span>
                        Envoyer le lien
                    </button>
                </form>

                <p class="back-to-login">
                    <button class="link-btn" onclick="pages.Connexion.switchForm('login')">
                        <span class="material-symbols-outlined">arrow_back</span>
                        Retour à la connexion
                    </button>
                </p>
            </div>
        `;
    },

    switchForm(form) {
        this.activeForm = form;
        this.rerender();
    },

    toggleRememberMe() {
        this.rememberMe = !this.rememberMe;
    },

    togglePassword() {
        this.showPassword = !this.showPassword;
        this.rerender();
    },

    fillDemoAccount(email, password) {
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
    },

    handleLogin() {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            this.showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = this.resolveDemoUser(normalizedEmail, password);
        if (!user) {
            this.showNotification('Identifiants invalides', 'error');
            return;
        }

        if (window.appActions?.login) {
            window.appActions.login(user);
        }

        this.showNotification('Connexion réussie', 'success');

        const requestedPath = window.router?.getStoredPostLoginRedirect?.() || '/';
        if (window.router?.clearStoredPostLoginRedirect) {
            window.router.clearStoredPostLoginRedirect();
        }

        setTimeout(() => {
            if (window.router) {
                window.router.navigate(requestedPath || '/');
                return;
            }
            window.location.href = '/';
        }, 350);
    },

    resolveDemoUser(email, password) {
        if (email === 'admin@cdg2026.fr' && password === 'admin123') {
            return {
                name: 'Administrateur CDG',
                role: 'admin',
                permissions: ['read', 'write', 'export', 'admin']
            };
        }

        if (email === 'user@cdg2026.fr' && password === 'user123') {
            return {
                name: 'Utilisateur CDG',
                role: 'user',
                permissions: ['read']
            };
        }

        return null;
    },

    handleRegister() {
        // Simuler une inscription
        this.showNotification('Compte créé avec succès ! Vérifiez votre email pour activer votre compte.', 'success');
        
        setTimeout(() => {
            this.switchForm('login');
        }, 2000);
    },

    handleForgotPassword() {
        const email = document.getElementById('forgot-email')?.value;
        
        if (!email) {
            this.showNotification('Veuillez saisir votre email', 'error');
            return;
        }

        this.showNotification('Email envoyé ! Vérifiez votre boîte de réception.', 'success');
        
        setTimeout(() => {
            this.switchForm('login');
        }, 2000);
    },

    socialLogin(provider) {
        this.showNotification(`Connexion avec ${provider} - Fonctionnalité à venir`, 'info');
    },

    showNotification(message, type) {
        if (window.Notifications) {
            window.Notifications[type](message);
        } else {
            alert(message);
        }
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
window.pages.Connexion = pages.Connexion;
