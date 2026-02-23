import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password
            });

            if (response.data.success) {
                onLogin(response.data);
            } else {
                setError(response.data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection error. Please ensure the backend server is running.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6 bg-slate-950 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/70 backdrop-blur-md border border-white/20 px-10 py-12 rounded-[2rem] shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 text-3xl shadow-xl shadow-blue-500/20">
                            🎓
                        </div>
                        <h1 className="text-4xl font-extrabold mb-3 text-slate-900 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 font-medium">Log in to manage your school system</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 text-red-600 rounded-2xl mb-8 text-sm border border-red-500/20 font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold ml-1 text-slate-700">Username</label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all duration-200 placeholder-slate-400 font-medium"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold ml-1 text-slate-700">Password</label>
                            <input
                                type="password"
                                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all duration-200 placeholder-slate-400 font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Validating...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-200/50">
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                            <span className="text-xl">💡</span>
                            <div className="text-xs text-slate-500 leading-relaxed font-medium">
                                <strong className="text-slate-700">Demo credentials:</strong><br />
                                Username: <span className="text-blue-600 underline">admin</span> / Password: <span className="text-blue-600 underline">admin123</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center mt-8 text-slate-500 text-sm font-medium">
                    &copy; {new Date().getFullYear()} School Management System. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
