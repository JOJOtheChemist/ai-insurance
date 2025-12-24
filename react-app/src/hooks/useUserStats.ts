import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_HOST = (import.meta.env.VITE_CRM_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_BASE = API_HOST ? `${API_HOST}/api/v1` : '/api/v1';

interface UserStats {
    balance: number;
    clients_count: number;
    plans_count: number;
    tokens_consumed_today: number;
}

export const useUserStats = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.id || !token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/users/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user stats');
                }

                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (err: any) {
                console.error('❌ [useUserStats] Error:', err);
                setError(err.message);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user?.id, token]);

    return { stats, loading, error };
};
