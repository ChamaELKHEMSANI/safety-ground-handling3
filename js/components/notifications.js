/**
 * NOTIFICATIONS.JS - Système de notifications toast
 */

const Notifications = {
    /**
     * Afficher une notification de succès
     */
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    },

    /**
     * Afficher une notification d'erreur
     */
    error(message, duration = 4000) {
        this.show(message, 'error', duration);
    },

    /**
     * Afficher une notification d'information
     */
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    },

    /**
     * Afficher une notification d'avertissement
     */
    warning(message, duration = 3500) {
        this.show(message, 'warning', duration);
    },

    /**
     * Afficher une notification
     */
    show(message, type = 'info', duration = 3000) {
        // Utiliser le système de notification du store si disponible
        if (window.appActions && window.appActions.showNotification) {
            appActions.showNotification(message, type, duration);
            return;
        }

        // Fallback: notification DOM directe
        const container = document.getElementById('toast-container');
        if (!container) {
            alert(message);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            padding: 12px 20px;
            background: ${this.getColor(type)};
            color: white;
            border-radius: 8px;
            margin-bottom: 10px;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Obtenir la couleur selon le type
     */
    getColor(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        return colors[type] || colors.info;
    }
};

// Ajouter les animations CSS si pas déjà présentes
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
}

window.Notifications = Notifications;