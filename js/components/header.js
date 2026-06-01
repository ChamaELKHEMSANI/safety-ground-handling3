/**
 * HEADER.JS - Composant header/navigation
 */

const Header = {
    render() {
        const currentPath = router?.currentPath || '/';
        const state = window.appStore?.getState?.() || {};
        const isAuthenticated = Boolean(state.isAuthenticated && state.user);
        const role = String(state.user?.role || '').toLowerCase();
        const isAdmin = isAuthenticated && role === 'admin';
        const userName = String(state.user?.name || 'Utilisateur');
        const userRoleLabel = role ? (role === 'admin' ? 'Administrateur' : 'Utilisateur') : '';

        return `
            <div class="header-wrapper">
                <div class="container-lg">
                    <div class="header-content">
                        <div class="header-logo">
                            <div class="logo-icon"><span class="material-symbols-outlined">flight_takeoff</span></div>
                            <div class="logo-text">
                                <span class="logo-main">CDG 2026</span>
                                <span class="logo-sub">Safety Simulator</span>
                            </div>
                        </div>

                        <nav class="header-nav show-desktop">
                            <a href="/" class="nav-link ${currentPath === '/' ? 'active' : ''}">
                                <span>Accueil</span>
                            </a>
                            ${isAuthenticated ? `
                                ${isAdmin ? `
                                    <a href="/edition" class="nav-link ${currentPath === '/edition' ? 'active' : ''}">
                                        <span>Editer</span>
                                    </a>
                                ` : ''}
                                <a href="/explorer" class="nav-link ${currentPath === '/explorer' ? 'active' : ''}">
                                    <span>Explorer</span>
                                </a>
                                <a href="/diagnostic" class="nav-link ${currentPath === '/diagnostic' ? 'active' : ''}">
                                    <span>Diagnostic</span>
                                </a>
                                <a href="/simuler" class="nav-link ${currentPath === '/simuler' ? 'active' : ''}">
                                    <span>Simuler</span>
                                </a>
                                <a href="/comparer" class="nav-link ${currentPath === '/comparer' ? 'active' : ''}">
                                    <span>Comparer</span>
                                </a>
                                <a href="/decider" class="nav-link ${currentPath === '/decider' ? 'active' : ''}">
                                    <span>Decider</span>
                                </a>
                            ` : `
                                <a href="/connexion" class="nav-link ${currentPath === '/connexion' ? 'active' : ''}">
                                    <span>Connexion</span>
                                </a>
                            `}
                        </nav>

                        <div class="header-actions">
                            ${isAuthenticated ? `
                                <div class="header-user-info show-desktop">
                                    <span class="header-user-name">${userName}</span>
                                    <span class="header-user-role">${userRoleLabel}</span>
                                </div>
                            ` : ''}
                            ${isAdmin ? `
                                <button class="btn btn-ghost header-admin" id="admin-btn">
                                    <span class="material-symbols-outlined">admin_panel_settings</span>
                                    <span class="show-desktop">Admin</span>
                                </button>
                            ` : ''}
                            ${isAuthenticated ? `
                                <button class="btn btn-ghost header-logout" id="logout-btn">
                                    <span class="material-symbols-outlined">logout</span>
                                    <span class="show-desktop">Deconnexion</span>
                                </button>
                            ` : ''}
                        </div>

                        <button class="mobile-menu-toggle show-mobile" id="mobile-menu-btn">
                            <span class="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </div>

            <nav class="mobile-menu" id="mobile-menu" style="display: none;">
                <a href="/" class="mobile-nav-link ${currentPath === '/' ? 'active' : ''}">Accueil</a>
                ${isAuthenticated ? `
                    <div class="mobile-user-info">
                        <span class="mobile-user-name">${userName}</span>
                        <span class="mobile-user-role">${userRoleLabel}</span>
                    </div>
                    ${isAdmin ? `<a href="/edition" class="mobile-nav-link ${currentPath === '/edition' ? 'active' : ''}">Edition</a>` : ''}
                    <a href="/explorer" class="mobile-nav-link ${currentPath === '/explorer' ? 'active' : ''}">Explorer</a>
                    <a href="/diagnostic" class="mobile-nav-link ${currentPath === '/diagnostic' ? 'active' : ''}">Diagnostic</a>
                    <a href="/simuler" class="mobile-nav-link ${currentPath === '/simuler' ? 'active' : ''}">Simuler</a>
                    <a href="/comparer" class="mobile-nav-link ${currentPath === '/comparer' ? 'active' : ''}">Comparer</a>
                    <a href="/decider" class="mobile-nav-link ${currentPath === '/decider' ? 'active' : ''}">Decider</a>
                    ${isAdmin ? '<a href="/admin" class="mobile-nav-link">Admin</a>' : ''}
                    <button class="mobile-nav-link mobile-logout-btn" id="mobile-logout-btn" type="button">Deconnexion</button>
                ` : `
                    <a href="/connexion" class="mobile-nav-link ${currentPath === '/connexion' ? 'active' : ''}">Connexion</a>
                `}
            </nav>

            <style>
                .header-wrapper {
                    background: var(--cdg-navy);
                    color: white;
                    padding: 0;
                    box-shadow: var(--shadow-md);
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-8);
                    padding: var(--spacing-4) 0;
                    height: 70px;
                }

                .header-logo {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-4);
                    flex-shrink: 0;
                    cursor: pointer;
                }

                .logo-icon {
                    font-size: 32px;
                    line-height: 1;
                }

                .logo-text {
                    display: flex;
                    flex-direction: column;
                }

                .logo-main {
                    font-size: var(--text-lg);
                    font-weight: var(--font-weight-bold);
                    letter-spacing: 0.05em;
                }

                .logo-sub {
                    font-size: var(--text-xs);
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .header-nav {
                    display: flex;
                    gap: 0;
                    flex: 1;
                }

                .show-mobile {
                    display: none !important;
                }

                .show-desktop {
                    display: flex !important;
                }

                .nav-link {
                    color: white;
                    opacity: 0.8;
                    padding: var(--spacing-4) var(--spacing-6);
                    border-bottom: 3px solid transparent;
                    transition: all var(--transition-base);
                    font-weight: var(--font-weight-medium);
                    font-size: var(--text-sm);
                    text-decoration: none;
                }

                .nav-link:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                }

                .nav-link.active {
                    border-bottom-color: var(--cdg-orange);
                    opacity: 1;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-4);
                    flex-shrink: 0;
                }

                .header-user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    line-height: 1.1;
                    text-align: right;
                }

                .header-user-name {
                    font-size: var(--text-xs);
                    font-weight: var(--font-weight-semibold);
                    color: white;
                }

                .header-user-role {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.75);
                }

                .header-admin {
                    color: white;
                    opacity: 0.8;
                    transition: all var(--transition-base);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-2);
                }

                .header-admin:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                }

                .header-logout {
                    color: white;
                    opacity: 0.8;
                    transition: all var(--transition-base);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-2);
                }

                .header-logout:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                }

                .mobile-menu-toggle {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: var(--spacing-2);
                    display: flex;
                    align-items: center;
                }

                .mobile-menu {
                    display: none;
                    flex-direction: column;
                    gap: 0;
                    background: rgba(0, 61, 130, 0.95);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .mobile-menu.open {
                    display: flex;
                }

                .mobile-user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding: var(--spacing-4) var(--spacing-6);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                    background: rgba(255, 255, 255, 0.04);
                }

                .mobile-user-name {
                    font-size: var(--text-sm);
                    font-weight: var(--font-weight-semibold);
                    color: white;
                }

                .mobile-user-role {
                    font-size: var(--text-xs);
                    color: rgba(255, 255, 255, 0.75);
                }

                .mobile-nav-link {
                    color: white;
                    padding: var(--spacing-4) var(--spacing-6);
                    text-decoration: none;
                    border-left: 3px solid transparent;
                    transition: all var(--transition-base);
                    display: block;
                }

                .mobile-nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-left-color: var(--cdg-orange);
                }

                .mobile-nav-link.active {
                    background: rgba(255, 107, 53, 0.1);
                    border-left-color: var(--cdg-orange);
                    color: var(--cdg-orange);
                }

                .mobile-logout-btn {
                    background: transparent;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                    font: inherit;
                    width: 100%;
                }

                @media (max-width: 1024px) {
                    .show-mobile {
                        display: flex !important;
                    }

                    .show-desktop {
                        display: none !important;
                    }

                    .header-content {
                        gap: var(--spacing-4);
                        padding: var(--spacing-3) 0;
                        height: 60px;
                    }

                    .logo-text {
                        display: none;
                    }

                    .logo-icon {
                        font-size: 28px;
                    }

                    .nav-link {
                        padding: var(--spacing-3) var(--spacing-4);
                        font-size: var(--text-xs);
                    }
                }
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                }

                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                } 
                /* modele.html visual language overrides */
                .header-wrapper {
                    background: var(--surface-container-lowest);
                    color: var(--on-surface);
                    border-bottom: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    height: 64px;
                    padding: 0;
                }

                .logo-icon {
                    width: 38px;
                    height: 38px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-lg);
                    background: var(--cdg-navy);
                    color: var(--on-primary);
                    font-size: 24px;
                }

                .logo-main {
                    color: var(--cdg-navy);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .logo-sub,
                .header-user-role {
                    color: var(--on-surface-variant);
                    opacity: 1;
                }

                .nav-link {
                    color: var(--on-surface-variant);
                    opacity: 1;
                    padding: 22px var(--spacing-4) 19px;
                    border-bottom-width: 2px;
                }

                .nav-link:hover {
                    color: var(--cdg-navy);
                    background: transparent;
                    text-decoration: none;
                }

                .nav-link.active {
                    color: var(--on-surface);
                    border-bottom-color: var(--cdg-orange-bright);
                }

                .header-user-name,
                .mobile-user-name {
                    color: var(--on-surface);
                }

                .header-admin,
                .header-logout,
                .mobile-menu-toggle {
                    color: var(--cdg-navy);
                    opacity: 1;
                }

                .header-admin:hover,
                .header-logout:hover {
                    background: var(--surface-container-low);
                }

                .mobile-menu {
                    background: var(--surface-container-lowest);
                    border-top: 1px solid var(--outline-variant);
                    box-shadow: var(--shadow-md);
                }

                .mobile-user-info {
                    background: var(--surface-container-low);
                    border-bottom: 1px solid var(--outline-variant);
                }

                .mobile-user-role,
                .mobile-nav-link {
                    color: var(--on-surface-variant);
                }

                .mobile-nav-link:hover {
                    background: var(--surface-container-low);
                    color: var(--cdg-navy);
                    border-left-color: var(--cdg-orange-bright);
                }

                .mobile-nav-link.active {
                    background: var(--secondary-fixed);
                    border-left-color: var(--cdg-orange-bright);
                    color: var(--cdg-orange);
                }</style>
        `;
    },

    setupEventListeners() {
        const toggleBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (toggleBtn && mobileMenu) {
            toggleBtn.addEventListener('click', () => {
                if (mobileMenu.style.display === 'none') {
                    mobileMenu.style.display = 'flex';
                    mobileMenu.classList.add('open');
                } else {
                    mobileMenu.style.display = 'none';
                    mobileMenu.classList.remove('open');
                }
            });

            mobileMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    mobileMenu.style.display = 'none';
                    mobileMenu.classList.remove('open');
                }
            });
        }

        const logo = document.querySelector('.header-logo');
        if (logo) {
            logo.addEventListener('click', () => router.navigate('/'));
        }

        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => router.navigate('/admin'));
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.appActions?.logout) {
                    window.appActions.logout();
                }
                router.navigate('/connexion', { replaceState: true });
            });
        }

        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => {
                if (window.appActions?.logout) {
                    window.appActions.logout();
                }
                const mobileMenuNode = document.getElementById('mobile-menu');
                if (mobileMenuNode) {
                    mobileMenuNode.style.display = 'none';
                    mobileMenuNode.classList.remove('open');
                }
                router.navigate('/connexion', { replaceState: true });
            });
        }
    }
};

window.Header = Header;
