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
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Real-time statistics and system status</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border flex items-center gap-3 transition-all duration-300 ${stats.mongoStatus === 'connected' ? 'border-green-500/30 text-green-700 bg-green-50/50' : 'border-red-500/30 text-red-700 bg-red-50/50'}`}>
                    <span className={`relative flex h-3 w-3`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stats.mongoStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${stats.mongoStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-sm font-bold tracking-wide uppercase">
                        Database {stats.mongoStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-4xl opacity-10 group-hover:scale-110 transition-transform">👥</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Total Students</div>
                    <div className="text-5xl font-black mt-4 text-slate-900 tracking-tight leading-none tabular-nums">
                        {loading ? <span className="animate-pulse opacity-20">---</span> : stats.students}
                    </div>
                </div>

                <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-4xl opacity-10 group-hover:scale-110 transition-transform">🏛️</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Total Schools</div>
                    <div className="text-5xl font-black mt-4 text-slate-900 tracking-tight leading-none tabular-nums">
                        {loading ? <span className="animate-pulse opacity-20">---</span> : stats.schools}
                    </div>
                </div>

                <div className="group bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-lg shadow-blue-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-4xl opacity-20 group-hover:scale-110 transition-transform text-white">⚙️</div>
                    <div className="text-sm font-bold text-blue-100/70 uppercase tracking-[0.2em]">System Mode</div>
                    <div className="text-3xl font-black mt-4 text-white tracking-tight">
                        {stats.source || 'Standard'}
                    </div>
                    <div className="mt-4 inline-flex px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                        Optimized Engine
                    </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-4 text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-base">👋</span>
                        Welcome back, {user.username}
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-2xl font-medium">
                        Your central control hub is ready. You have complete administrative oversight of all registered institutions and their student populations.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                            System Logs
                        </button>
                        <button className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                            Security Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
