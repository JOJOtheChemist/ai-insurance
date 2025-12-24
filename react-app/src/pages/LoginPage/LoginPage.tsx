import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

type Mode = 'login' | 'register' | 'reset';

const API_HOST = (import.meta.env.VITE_CRM_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_BASE = API_HOST ? `${API_HOST}/api/v1` : '/api/v1';

const LoginPage: React.FC = () => {
    const [mode, setMode] = useState<Mode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleGuestLogin = () => {
        // 模拟访客登录
        login('guest_token', { id: 0, username: '访客' });
        navigate('/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 基本验证
        if (mode === 'register' && formData.password !== formData.confirmPassword) {
            setError('两次填写的密码不一致');
            setLoading(false);
            return;
        }

        try {
            const endpoint = mode === 'login' ? '/users/auth/login' : '/users/auth/register';
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    invite_code: formData.inviteCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || '操作失败');
            }

            if (mode === 'login') {
                login(data.access_token, data.user);
                navigate('/');
            } else {
                setSuccess('注册成功，请登录');
                setMode('login');
                setFormData({ ...formData, password: '', confirmPassword: '' });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo-circle">🛡️</div>
                    <h1 className="app-title">保险 AI 助手</h1>
                    <p className="app-subtitle">欢迎使用智能保险规划系统</p>
                </div>

                <div className="mode-tabs">
                    <button
                        type="button"
                        className={`mode-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => setMode('login')}
                    >
                        登录
                    </button>
                    <button
                        type="button"
                        className={`mode-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => setMode('register')}
                    >
                        注册
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>用户名</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="请输入用户名"
                                required
                            />
                        </div>
                    </div>

                    {mode === 'register' && (
                        <div className="input-group">
                            <label>电子邮箱</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="请输入邮箱"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>密码</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="请输入密码"
                                required
                            />
                        </div>
                    </div>

                    {mode === 'register' && (
                        <>
                            <div className="input-group">
                                <label>确认密码</label>
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="请再次输入密码"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>邀请码</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="inviteCode"
                                        value={formData.inviteCode}
                                        onChange={handleChange}
                                        placeholder="请输入授权邀请码"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="login-button" disabled={loading} style={{ background: '#667eea' }}>
                        {loading ? '处理中...' : mode === 'login' ? '立即登录' : '注册账号'}
                    </button>

                    {mode === 'login' && (
                        <>
                            <div className="login-divider"><span>或</span></div>
                            <button type="button" className="guest-button" onClick={handleGuestLogin}>
                                访客体验
                            </button>
                        </>
                    )}
                </form>
            </div>

            <div className="login-background">
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-circle bg-circle-3"></div>
            </div>
        </div>
    );
};

export default LoginPage;
