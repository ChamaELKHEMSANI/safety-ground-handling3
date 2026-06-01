/**
 * FOOTER.JS - Composant footer
 */

const Footer = {
    render() {
        const currentYear = new Date().getFullYear();
        
        return `
            <div class="footer-wrapper">
                <div class="container-lg">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h4><a href="/apropos">À propos</a></h4>
                            <p>Simulateur de sécurité pour la plateforme aéroportuaire.</p>
                        </div>

                        <div class="footer-section">
                            <h4><a href="/">Navigation</a></h4>
                            <ul>
                                <li><a href="/explorer">Explorer</a></li>
                                <li><a href="/simuler">Simuler</a></li>
                                <li><a href="/admin">Admin</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h4><a href="/support">Support</a></h4>
                            <ul>
                                <li><a href="/modeemploie" >Mode d'emploie</a></li>
                                <li><a href="/documentation" >Documentation</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h4><a href="/problematique" >Informations</a></h4>
                            <p class="footer-info">Chama EL KHEMSANI . Tous droits réservés.</p>
                            <p class="footer-info">Version 3.0.0</p>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>Simulateur Sécurité | Propulsé par la Direction de la Sûreté</p>
                    </div>
                </div>
            </div>

            <style>
                .footer-wrapper {
                    background: var(--gray-900);
                    color: var(--gray-300);
                    padding: var(--spacing-16) 0 var(--spacing-8);
                    margin-top: auto;
                    border-top: 1px solid var(--gray-800);
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-8);
                    margin-bottom: var(--spacing-8);
                }

                .footer-section h4 {
                    color: white;
                    margin-bottom: var(--spacing-3);
                    font-size: var(--text-sm);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .footer-section p {
                    font-size: var(--text-sm);
                    line-height: 1.6;
                }

                .footer-section ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .footer-section li {
                    margin: var(--spacing-2) 0;
                }

                .footer-section a {
                    color: var(--gray-400);
                    text-decoration: none;
                    transition: color var(--transition-base);
                    font-size: var(--text-sm);
                }

                .footer-section a:hover {
                    color: var(--cdg-orange);
                }

                .footer-info {
                    margin: var(--spacing-2) 0;
                    font-size: var(--text-xs);
                }

                .footer-bottom {
                    padding-top: var(--spacing-6);
                    border-top: 1px solid var(--gray-800);
                    text-align: center;
                    font-size: var(--text-xs);
                    color: var(--gray-500);
                }

                @media (max-width: 640px) {
                    .footer-content {
                        grid-template-columns: repeat(2, 1fr);
                        gap: var(--spacing-6);
                    }
                }
            </style>
        `;
    }
};

window.Footer = Footer;
