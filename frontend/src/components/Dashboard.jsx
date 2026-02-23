import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({ students: 0, schools: 0, mongoStatus: 'unknown' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/stats`);
                setStats(response.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">System Dashboard</h1>
                <div className={`text-sm font-semibold flex items-center gap-2 ${stats.mongoStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${stats.mongoStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                    Database {stats.mongoStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Students</div>
                    <div className="text-3xl font-bold mt-2 text-slate-900">{loading ? '...' : stats.students}</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Schools</div>
                    <div className="text-3xl font-bold mt-2 text-slate-900">{loading ? '...' : stats.schools}</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">System Mode</div>
                    <div className="text-xl font-bold mt-2 text-blue-600">{stats.source || 'Standard'}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-2 text-slate-900">Welcome, {user.username}</h2>
                <p className="text-slate-600 text-sm">
                    You are logged in as an Administrator. Use the sidebar to manage students and schools.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
