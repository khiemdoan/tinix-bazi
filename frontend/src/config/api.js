/**
 * API Configuration
 * Automatically detects environment and sets API base URL
 */

// Detect if running on production domain
const isProduction = window.location.hostname === 'huyencobattu.com' ||
    window.location.hostname === 'www.huyencobattu.com';

// API Base URL
let API_HOST = isProduction ? '' : 'http://localhost:8888';

export const API_CONFIG = {
    HOST: API_HOST,
    BASE_URL: `${API_HOST}/api`,
    AUTH: `${API_HOST}/api/auth`,
    CONSULTANT: `${API_HOST}/api/consultant`,
    ADMIN: `${API_HOST}/api/admin`,
    BAZI: `${API_HOST}/api/bazi`,
};

// If running in Tauri, dynamically fetch backend port
if (window.__TAURI__) {
    import('@tauri-apps/api/tauri').then(({ invoke }) => {
        invoke('get_backend_port').then((port) => {
            API_HOST = `http://127.0.0.1:${port}`;
            console.log('[Tauri] Dynamic Backend Port configured:', API_HOST);
            API_CONFIG.HOST = API_HOST;
            API_CONFIG.BASE_URL = `${API_HOST}/api`;
            API_CONFIG.AUTH = `${API_HOST}/api/auth`;
            API_CONFIG.CONSULTANT = `${API_HOST}/api/consultant`;
            API_CONFIG.ADMIN = `${API_HOST}/api/admin`;
            API_CONFIG.BAZI = `${API_HOST}/api/bazi`;
        }).catch(err => console.error('[Tauri] Failed to get backend port', err));
    }).catch(err => console.error('[Tauri] Failed to import tauri api', err));
}

// For debugging
console.log('[API Config] Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('[API Config] API Host:', API_HOST);

export default API_CONFIG;
