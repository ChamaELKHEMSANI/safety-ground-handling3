/**
 * PISTE-CARD.JS - Composant carte piste
 */

const PisteCard = {
    render(piste) {
        const safePiste = Utils.escapeDeep(piste);
        const encodedPiste = Utils.escapeInlineArgument(encodeURIComponent(JSON.stringify(piste)));
        return `
            <div class="piste-card" role="button" tabindex="0" onclick="modal.showPisteDetails(JSON.parse(decodeURIComponent('${encodedPiste}')))" onkeydown="if(event.key === 'Enter' || event.key === ' '){ event.preventDefault(); modal.showPisteDetails(JSON.parse(decodeURIComponent('${encodedPiste}'))); }">
                <div class="card-header">
                    <span class="piste-id">${safePiste.numero}</span>
                    <span class="category-badge">${safePiste.categorie}</span>
                </div>
                <h3 class="piste-title">${safePiste.titre}</h3>
                <p class="piste-desc">${safePiste.description}</p>
                <div class="piste-footer">
                    <div class="stat-small">
                        <span class="label">${Utils.formatCurrency(piste.budget.cout_3_ans)}</span>
                    </div>
                    <div class="stat-small">
                        <span class="label">${piste.impact_score}/100</span>
                    </div>
                </div>
            </div>
        `;
    }
};

window.PisteCard = PisteCard;
