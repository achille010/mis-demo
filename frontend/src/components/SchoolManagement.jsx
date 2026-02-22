import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const SchoolManagement = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        principalName: '',
        email: ''
    });

    const fetchSchools = async () => {
        try {
            const response = await axios.get(`${API_URL}/schools`);
            setSchools(response.data);
        } catch (err) {
            console.error('Failed to fetch schools', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/schools`, formData);
            setFormData({ name: '', address: '', principalName: '', email: '' });
            setShowForm(false);
            fetchSchools();
        } catch (err) {
            alert('Failed to register school: ' + err.message);
        }
    };

    return (
        <div>
            <div className="content-header">
                <h1 className="title">School Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ width: 'auto' }}>
                    {showForm ? 'Cancel' : '+ Add School'}
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Register New Institution</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">School Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Principal Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.principalName}
                                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Physical Address</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                                Save School
                            </button>
                            <button type="button" className="btn" onClick={() => setShowForm(false)} style={{ width: 'auto', backgroundColor: '#f1f5f9', color: 'var(--text-main)' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>Institution Name</th>
                                <th>Principal</th>
                                <th>Email</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
                            ) : schools.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No schools registered.</td></tr>
                            ) : (
                                schools.map((school) => (
                                    <tr key={school._id}>
                                        <td style={{ fontWeight: '600' }}>{school.name}</td>
                                        <td>{school.principalName}</td>
                                        <td>{school.email}</td>
                                        <td>{school.address}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SchoolManagement;
