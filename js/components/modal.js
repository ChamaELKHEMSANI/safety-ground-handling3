/**
 * MODAL.JS - Composant modal générique
 */

class ModalComponent {
    constructor() {
        this.currentModal = null;
    }

    /**
     * Ouvrir une modal
     */
    open(title, content, actions = []) {
        const container = document.getElementById('modal-container');
        if (!container) return;

        const modalHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.style.display='none'">
                <div class="modal-dialog" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2 class="modal-title">${title}</h2>
                        <button class="modal-close" onclick="this.closest('.modal-dialog').parentElement.style.display='none'">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        ${typeof content === 'string' ? content : ''}
                    </div>

                    ${actions.length > 0 ? `
                        <div class="modal-footer">
                            ${actions.map((action, idx) => `
                                <button class="btn ${action.className || 'btn-secondary'}" id="action-${idx}">
                                    ${action.label}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            <style>
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                }

                .modal-dialog {
                    background: white;
                    border-radius: var(--radius-xl);
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: var(--shadow-2xl);
                    animation: slideUp 0.3s ease-out;
                }

                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--spacing-6);
                    border-bottom: 1px solid var(--gray-200);
                }

                .modal-title {
                    margin: 0;
                    color: var(--cdg-navy);
                }

                .modal-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--gray-400);
                    transition: color var(--transition-base);
                    padding: 0;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-close:hover {
                    color: var(--gray-600);
                }

                .modal-body {
                    padding: var(--spacing-6);
                }

                .modal-footer {
                    display: flex;
                    gap: var(--spacing-4);
                    justify-content: flex-end;
                    padding: var(--spacing-6);
                    border-top: 1px solid var(--gray-200);
                    background: var(--gray-50);
                }

                .modal-footer .btn {
                    flex-shrink: 0;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            </style>
        `;

        container.innerHTML = modalHTML;
        container.style.display = 'flex';

        // Attacher les événements des actions
        actions.forEach((action, idx) => {
            const btn = document.getElementById(`action-${idx}`);
            if (btn && action.action) {
                btn.addEventListener('click', action.action);
            }
        });

        this.currentModal = container;
    }

    /**
     * Fermer la modal
     */
    close() {
        const container = document.getElementById('modal-container');
        if (container) {
            container.style.display = 'none';
        }
        this.currentModal = null;
    }

    /**
     * Afficher détails piste
     */
    showPisteDetails(piste) {
        piste = Utils.escapeDeep(piste);
        const content = `
            <div class="piste-details">
                <div class="detail-section">
                    <h3>${piste.titre}</h3>
                    <p class="detail-id">Piste ${piste.numero}</p>
                </div>

                <div class="detail-section">
                    <h4>Description</h4>
                    <p>${piste.description_longue || piste.description}</p>
                </div>

                <div class="detail-metrics">
                    <div class="metric-box">
                        <span class="metric-label">Budget 3 ans</span>
                        <span class="metric-value">${Utils.formatCurrency(piste.budget.cout_3_ans)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Impact</span>
                        <span class="metric-value">${piste.impact_score}/100</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Délai de retour</span>
                        <span class="metric-value">${piste.roi_mois} mois</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Délai de déploiement</span>
                        <span class="metric-value">${piste.delai_texte}</span>
                    </div>
                </div>

                ${piste.justificatifs && piste.justificatifs.length > 0 ? `
                    <div class="detail-section">
                        <h4>Justificatifs</h4>
                        <ul class="justificatifs-list">
                            ${piste.justificatifs.map(j => `
                                <li>
                                    <strong>${j.titre}</strong>
                                    <p>${j.description}</p>
                                    ${j.url ? `<a href="${j.url}" target="_blank">Lire plus →</a>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                <style>
                    .piste-details { padding: var(--spacing-4) 0; }
                    .detail-section { margin-bottom: var(--spacing-6); }
                    .detail-section h3 { color: var(--cdg-navy); margin-bottom: var(--spacing-2); }
                    .detail-section h4 { color: var(--cdg-navy); margin-bottom: var(--spacing-3); font-size: var(--text-base); }
                    .detail-id { font-size: var(--text-sm); color: var(--gray-500); }
                    .detail-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-4); margin: var(--spacing-6) 0; }
                    .metric-box { padding: var(--spacing-4); background: var(--gray-50); border-radius: var(--radius-md); }
                    .metric-label { display: block; font-size: var(--text-xs); color: var(--gray-500); text-transform: uppercase; margin-bottom: var(--spacing-2); }
                    .metric-value { display: block; font-size: var(--text-lg); font-weight: var(--font-weight-bold); color: var(--cdg-navy); }
                    .justificatifs-list { list-style: none; padding: 0; }
                    .justificatifs-list li { margin-bottom: var(--spacing-4); padding: var(--spacing-3); background: var(--gray-50); border-radius: var(--radius-md); }
                    .justificatifs-list strong { color: var(--cdg-navy); display: block; margin-bottom: var(--spacing-1); }
                    .justificatifs-list p { font-size: var(--text-sm); color: var(--gray-600); margin-bottom: var(--spacing-2); }
                    .justificatifs-list a { font-size: var(--text-sm); color: var(--cdg-navy); text-decoration: none; }
                    .justificatifs-list a:hover { text-decoration: underline; }
                </style>
            </div>
        `;

        this.open(piste.titre, content, [
            {
                label: 'Ajouter au scénario',
                className: 'btn btn-primary',
                action: () => {
                    appActions.addPisteToScenario(piste);
                    Notifications.success(`${piste.numero} ajoutée au scénario`);
                    this.close();
                }
            },
            {
                label: 'Fermer',
                className: 'btn btn-ghost',
                action: () => this.close()
            }
        ]);
    }
}

// Instance globale
const modal = new ModalComponent();

// Export
window.ModalComponent = ModalComponent;
window.modal = modal;
