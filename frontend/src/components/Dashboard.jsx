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
        <div>
            <div className="content-header">
                <h1 className="title">System Dashboard</h1>
                <div style={{ fontSize: '0.875rem', color: stats.mongoStatus === 'connected' ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
                    ● Database {stats.mongoStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Students</div>
                    <div className="stat-value">{loading ? '...' : stats.students}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Schools</div>
                    <div className="stat-value">{loading ? '...' : stats.schools}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">System Mode</div>
                    <div className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.source || 'Standard'}</div>
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Welcome, {user.username}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    You are logged in as an Administrator. Use the sidebar to manage students and schools.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
