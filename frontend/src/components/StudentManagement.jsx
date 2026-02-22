import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        admissionNumber: ''
    });

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${API_URL}/students`);
            setStudents(response.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/students`, formData);
            setFormData({ name: '', email: '', admissionNumber: '' });
            setShowForm(false);
            fetchStudents();
        } catch (err) {
            alert('Failed to register student: ' + err.message);
        }
    };

    return (
        <div>
            <div className="content-header">
                <h1 className="title">Student Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ width: 'auto' }}>
                    {showForm ? 'Cancel' : '+ Add Student'}
                </button>
            </div>

            {showForm && (
                <div className="card form-card">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Register New Student</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            <div className="form-group">
                                <label className="form-label">Admission Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.admissionNumber}
                                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                                Save Student
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
                                <th>Admission No</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No students registered.</td></tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student._id}>
                                        <td style={{ fontWeight: '600' }}>{student.admissionNumber}</td>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{new Date(student.createdAt).toLocaleDateString()}</td>
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

export default StudentManagement;
