/**
 * TABLE.JS - Composant tableau dynamique
 */

class DataTable {
    constructor(data, columns) {
        this.data = data;
        this.columns = columns;
        this.sorted = [...data];
        this.filtered = [...data];
    }

    render() {
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        ${this.columns.map(col => `<th onclick="this.sort('${col.key}')">${col.label}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${this.filtered.map(row => `
                        <tr>
                            ${this.columns.map(col => `<td>${row[col.key]}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    sort(key) {
        this.sorted.reverse();
    }

    filter(predicate) {
        this.filtered = this.data.filter(predicate);
    }
}

window.DataTable = DataTable;
