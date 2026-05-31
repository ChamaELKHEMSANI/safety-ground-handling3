/**
 * CHART-UTILS.JS - Graphiques Canvas/SVG
 */

const ChartUtils = {
    drawLineChart(canvas, data) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Simple line drawing (produits complets peuvent utiliser Chart.js)
        ctx.fillStyle = '#003D82';
        ctx.fillRect(0, 0, canvas.width, 2);
    },

    drawBarChart(canvas, data) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FF6B35';
        const barWidth = canvas.width / data.length;
        data.forEach((val, idx) => {
            const height = (val / Math.max(...data)) * canvas.height;
            ctx.fillRect(idx * barWidth, canvas.height - height, barWidth - 2, height);
        });
    },

    drawRadarChart(canvas, data) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#003D82';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
        ctx.stroke();
    }
};

window.ChartUtils = ChartUtils;
