import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const DebugHistoryPage: React.FC = () => {
    const { token, user } = useAuth();
    const [sessionId, setSessionId] = useState('');
    const [apiResult, setApiResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check what's in localStorage
        const storedSessionId = localStorage.getItem('insure_chat_session_id');
        const hashSessionId = window.location.hash.replace('#', '');
        setSessionId(storedSessionId || hashSessionId || 'session-1766497101132');
    }, []);

    const testAPI = async () => {
        setLoading(true);
        setError(null);
        setApiResult(null);

        try {
            const API_HOST = 'http://127.0.0.1:3001';
            const url = `${API_HOST}/api/sessions/${sessionId}`;

            console.log('🔍 Testing API:', url);
            console.log('🔍 Token:', token ? `${token.substring(0, 20)}...` : 'NULL');

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log('📡 API Response:', data);

            setApiResult(data);
        } catch (err: any) {
            setError(err.message);
            console.error('❌ API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', background: '#1e1e1e', color: '#d4d4d4', minHeight: '100vh' }}>
            <h1>🔍 History Loading Debug</h1>

            <div style={{ background: '#2d2d2d', padding: '15px', margin: '20px 0', borderRadius: '5px' }}>
                <h2>1. Auth Context Status</h2>
                <div style={{ color: token ? '#4ec9b0' : '#f48771' }}>
                    ✓ Token: {token ? 'Present' : 'MISSING ❌'}
                </div>
                {token && <pre style={{ fontSize: '10px', overflow: 'auto' }}>{token.substring(0, 100)}...</pre>}
                <div style={{ color: user ? '#4ec9b0' : '#f48771' }}>
                    ✓ User: {user ? JSON.stringify(user) : 'MISSING ❌'}
                </div>
            </div>

            <div style={{ background: '#2d2d2d', padding: '15px', margin: '20px 0', borderRadius: '5px' }}>
                <h2>2. LocalStorage Check</h2>
                <div>auth_token: {localStorage.getItem('auth_token') ? '✅ Present' : '❌ Missing'}</div>
                <div>auth_user: {localStorage.getItem('auth_user') || '❌ Missing'}</div>
                <div>insure_chat_session_id: {localStorage.getItem('insure_chat_session_id') || '❌ Missing'}</div>
            </div>

            <div style={{ background: '#2d2d2d', padding: '15px', margin: '20px 0', borderRadius: '5px' }}>
                <h2>3. Test Session API</h2>
                <div>
                    <label>Session ID: </label>
                    <input
                        type="text"
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                        style={{ width: '400px', padding: '8px', background: '#3c3c3c', border: '1px solid #555', color: '#d4d4d4' }}
                    />
                </div>
                <button
                    onClick={testAPI}
                    disabled={loading || !token}
                    style={{
                        padding: '10px 20px',
                        margin: '10px 0',
                        background: token ? '#0e639c' : '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: token ? 'pointer' : 'not-allowed'
                    }}
                >
                    {loading ? 'Loading...' : 'Test API Call'}
                </button>

                {!token && <div style={{ color: '#f48771' }}>⚠️ No token available. Please login first at /login</div>}

                {error && (
                    <div style={{ color: '#f48771', marginTop: '10px' }}>
                        ❌ Error: {error}
                    </div>
                )}

                {apiResult && (
                    <div style={{ marginTop: '10px' }}>
                        {apiResult.ok ? (
                            <div style={{ color: '#4ec9b0' }}>
                                ✅ Success! Messages count: {apiResult.session?.messages?.length || 0}
                                <pre style={{ background: '#1e1e1e', padding: '10px', overflow: 'auto', maxHeight: '400px' }}>
                                    {JSON.stringify(apiResult, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div style={{ color: '#f48771' }}>
                                ❌ API returned error: {apiResult.error}
                                <pre style={{ background: '#1e1e1e', padding: '10px' }}>
                                    {JSON.stringify(apiResult, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ background: '#2d2d2d', padding: '15px', margin: '20px 0', borderRadius: '5px' }}>
                <h2>4. Quick Actions</h2>
                <button
                    onClick={() => {
                        localStorage.setItem('insure_chat_session_id', 'session-1766497101132');
                        window.location.hash = 'session-1766497101132';
                        alert('Session ID set to session-1766497101132. Refresh the page.');
                    }}
                    style={{
                        padding: '10px 20px',
                        margin: '5px',
                        background: '#0e639c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    Set Session ID to session-1766497101132
                </button>
                <button
                    onClick={() => {
                        window.location.href = '/login';
                    }}
                    style={{
                        padding: '10px 20px',
                        margin: '5px',
                        background: '#0e639c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};
