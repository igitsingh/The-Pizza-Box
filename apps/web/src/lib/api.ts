import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies for SSO
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // Add retry logic for cold starts (5xx errors or network errors)
        // Only retry GET requests to avoid side effects on POST/PUT
        if (config && config.method === 'get' && (!response || response.status >= 500)) {
            config._retryCount = config._retryCount || 0;

            if (config._retryCount < 3) {
                config._retryCount += 1;
                // Exponential backoff: 2s, 4s, 8s
                const backoff = Math.pow(2, config._retryCount) * 1000;
                console.log(`📡 API Cold Start detected (Web). Retrying in ${backoff}ms... (Attempt ${config._retryCount})`);

                await new Promise(resolve => setTimeout(resolve, backoff));
                return api(config);
            }
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Clear user from Zustand store as well
            if (typeof window !== 'undefined') {
                const storage = localStorage.getItem('the-pizza-box-storage');
                if (storage) {
                    try {
                        const parsed = JSON.parse(storage);
                        parsed.state.user = null;
                        localStorage.setItem('the-pizza-box-storage', JSON.stringify(parsed));
                    } catch (e) {
                        console.error('Error clearing user from store:', e);
                    }
                }
            }
            // Only redirect if not already on login page to avoid loops
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
