import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const [editingId, setEditingId] = useState(null);

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

    const handleEdit = (school) => {
        setFormData({
            name: school.name,
            address: school.address,
            principalName: school.principalName,
            email: school.email
        });
        setEditingId(school._id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/schools/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/schools`, formData);
            }
            setFormData({ name: '', address: '', principalName: '', email: '' });
            setShowForm(false);
            setEditingId(null);
            fetchSchools();
        } catch (err) {
            alert(`Failed to ${editingId ? 'update' : 'register'} school: ` + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">School Management</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({ name: '', address: '', principalName: '', email: '' });
                        } else {
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add School'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900">{editingId ? 'Edit Institution' : 'Register New Institution'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">School Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Principal Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.principalName}
                                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1 text-slate-700">Physical Address</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                                {editingId ? 'Update School' : 'Save School'}
                            </button>
                            <button
                                type="button"
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-md transition-colors"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ name: '', address: '', principalName: '', email: '' });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50 border-bottom border-slate-200">
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Institution Name</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                            ) : schools.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">No schools registered.</td></tr>
                            ) : (
                                schools.map((school) => (
                                    <tr key={school._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{school.name}</td>
                                        <td className="px-6 py-4 text-slate-700">{school.principalName}</td>
                                        <td className="px-6 py-4 text-slate-700">{school.email}</td>
                                        <td className="px-6 py-4 text-slate-700">{school.address}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => handleEdit(school)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <Link
                                                to={`/schools/${school._id}/students`}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                            >
                                                Manage Students
                                            </Link>
                                        </td>
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
