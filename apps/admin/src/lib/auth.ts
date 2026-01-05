/**
 * PRODUCTION AUTH LIFECYCLE - ZERO TOLERANCE
 * 
 * ABSOLUTE RULES:
 * 1. Logout is ALWAYS frontend-authoritative
 * 2. Token clearing NEVER depends on API success
 * 3. Redirect ALWAYS happens
 * 4. API logout is best-effort only
 */

/**
 * Clear all auth state - ALWAYS succeeds
 */
export function clearAuth(): void {
    if (typeof window === 'undefined') return;

    // Clear token
    localStorage.removeItem('admin_token');

    // Clear any cached user data
    localStorage.removeItem('admin_user');

    // Clear any other auth-related data
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('admin_') || key.startsWith('auth_')) {
            localStorage.removeItem(key);
        }
    });
}

/**
 * Force redirect to login - ALWAYS succeeds
 */
export function forceRedirectToLogin(): void {
    if (typeof window === 'undefined') return;

    // Clear auth first
    clearAuth();

    // Force redirect
    window.location.href = '/login';
}

/**
 * Logout - ALWAYS succeeds, API call is best-effort
 */
export async function logout(api: any): Promise<void> {
    // CRITICAL: Clear auth FIRST, before API call
    clearAuth();

    // Try to notify backend (best-effort)
    try {
        await api.post('/auth/logout');
        console.log('✅ Backend logout successful');
    } catch (error) {
        console.warn('⚠️ Backend logout failed (non-critical):', error);
        // DO NOT throw - logout already succeeded client-side
    }

    // Force redirect
    forceRedirectToLogin();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('admin_token');
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
}

/**
 * Set auth token
 */
export function setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_token', token);
}
