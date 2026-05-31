/**
 * SIDEBAR.JS - Composant filtres sidebar
 */

const Sidebar = {
    render() {
        return `
            <aside class="sidebar">
                <h3>Filtres</h3>
                <div class="filter-section">
                    <label>Catégorie</label>
                    <select class="form-select">
                        <option>Tous</option>
                        <option>Humain</option>
                        <option>Technique</option>
                    </select>
                </div>
                <button class="btn btn-outline w-full">Réinitialiser</button>
            </aside>
        `;
    }
};

window.Sidebar = Sidebar;
