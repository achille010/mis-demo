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
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">School Management</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Register and oversee educational institutions</p>
                </div>
                <button
                    className={`flex items-center gap-2 font-bold py-3.5 px-8 rounded-2xl transition-all duration-300 shadow-lg ${showForm
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/20'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.98]'
                        }`}
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
                    {showForm ? 'Cancel Operation' : <span className="flex items-center gap-2"><span className="text-xl">➕</span> Add New School</span>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                    <h2 className="text-2xl font-black mb-8 text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">📝</span>
                        {editingId ? 'Update Institution Profile' : 'Register New Institution'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold ml-1 text-slate-700 uppercase tracking-wider text-[10px]">Institution Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Saint Peter High"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold ml-1 text-slate-700 uppercase tracking-wider text-[10px]">Principal Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                    value={formData.principalName}
                                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                                    placeholder="Full legal name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold ml-1 text-slate-700 uppercase tracking-wider text-[10px]">Official Email</label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contact@school.edu"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold ml-1 text-slate-700 uppercase tracking-wider text-[10px]">Physical Address</label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Complete street address, city, and zip"
                                required
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
                                {editingId ? 'Apply Changes' : 'Confirm Registration'}
                            </button>
                            <button
                                type="button"
                                className="bg-white text-slate-500 font-bold py-4 px-10 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ name: '', address: '', principalName: '', email: '' });
                                }}
                            >
                                Discard
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institution</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Leadership</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Database...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : schools.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="text-6xl mb-4 grayscale opacity-20">📂</div>
                                        <p className="text-slate-400 font-medium">No institutions registered yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                schools.map((school) => (
                                    <tr key={school._id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{school.name}</div>
                                            <div className="text-xs text-slate-400 font-medium mt-1 truncate max-w-xs flex items-center gap-1.5">
                                                <span>📍</span> {school.address}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                {school.principalName}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-slate-600">{school.email}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={() => handleEdit(school)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit School"
                                                >
                                                    <span className="text-lg">✏️</span>
                                                </button>
                                                <Link
                                                    to={`/schools/${school._id}/students`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                                                >
                                                    Manage Students
                                                </Link>
                                            </div>
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
