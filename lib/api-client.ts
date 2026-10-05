const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/admin';

export async function apiClient<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminAuthToken') : null;

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, config);

    if (!response.ok) {
        const isLoginRequest = endpoint === '/login' || endpoint === 'login';

        if ((response.status === 401 || response.status === 403) && typeof window !== 'undefined' && !isLoginRequest) {
            localStorage.removeItem('adminAuthToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userInfo');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || (response.status === 401 ? 'Invalid credentials provided.' : `API Error: ${response.status}`));
    }

    return response.json();
}
