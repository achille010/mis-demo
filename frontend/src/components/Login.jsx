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
        <div className="flex justify-center items-center min-h-screen p-6 bg-slate-50">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md border border-slate-200">
                <h1 className="text-3xl font-bold mb-2 text-slate-900 text-center">Welcome Back</h1>
                <p className="text-slate-500 text-center mb-8 text-sm">Log in to manage your school system</p>

                {error && (
                    <div className="p-3 bg-red-100 text-red-600 rounded-md mb-6 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
                    <strong>Demo credentials:</strong> admin / admin123
                </div>
            </div>
        </div>
    );
};

export default Login;
