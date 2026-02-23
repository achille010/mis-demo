import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const StudentManagement = () => {
    const { schoolId } = useParams();
    const [students, setStudents] = useState([]);
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        admissionNumber: ''
    });
    const [editingId, setEditingId] = useState(null);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${API_URL}/students`, {
                params: { schoolId }
            });
            setStudents(response.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    };

    const fetchSchool = async () => {
        try {
            const response = await axios.get(`${API_URL}/schools`);
            const currentSchool = response.data.find(s => s._id === schoolId);
            setSchool(currentSchool);
        } catch (err) {
            console.error('Failed to fetch school info', err);
        }
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            email: student.email,
            admissionNumber: student.admissionNumber
        });
        setEditingId(student._id);
        setShowForm(true);
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchStudents(), fetchSchool()]);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [schoolId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                school: schoolId
            };

            if (editingId) {
                await axios.put(`${API_URL}/students/${editingId}`, data);
            } else {
                await axios.post(`${API_URL}/students`, data);
            }

            setFormData({ name: '', email: '', admissionNumber: '' });
            setShowForm(false);
            setEditingId(null);
            fetchStudents();
        } catch (err) {
            alert(`Failed to ${editingId ? 'update' : 'register'} student: ` + err.message);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col gap-6">
                <Link to="/schools" className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-all">
                    <span className="group-hover:-translate-x-1 transition-transform">⬅️</span> Back to Institutions
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Student Management</h1>
                        {school && (
                            <p className="text-slate-500 mt-1 font-medium italic">
                                Academic records for <span className="text-blue-600 font-bold not-italic underline decoration-blue-200 decoration-2 underline-offset-4">{school.name}</span>
                            </p>
                        )}
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
                                setFormData({ name: '', email: '', admissionNumber: '' });
                            } else {
                                setShowForm(true);
                            }
                        }}
                    >
                        {showForm ? 'Cancel Operation' : <span className="flex items-center gap-2"><span className="text-xl">➕</span> Add New Student</span>}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden animate-fade-in border-l-4 border-l-blue-600">
                    <h2 className="text-2xl font-black mb-8 text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">📁</span>
                        {editingId ? 'Edit Student Profile' : 'Enroll New Student'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold ml-1 text-slate-700 uppercase tracking-wider text-[10px]">Full Legal Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Jane Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold ml-1 text-slate-700 uppercase tracking-wider text-[10px]">Portal Email</label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="student@school.edu"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold ml-1 text-slate-700 uppercase tracking-wider text-[10px]">Admission Number</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                    value={formData.admissionNumber}
                                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                    placeholder="e.g. 2024-ADM-001"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
                                {editingId ? 'Save Profile' : 'Complete Enrollment'}
                            </button>
                            <button
                                type="button"
                                className="bg-white text-slate-500 font-bold py-4 px-10 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ name: '', email: '', admissionNumber: '' });
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
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admission ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Email</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="text-6xl mb-4 grayscale opacity-20">🎓</div>
                                        <p className="text-slate-400 font-medium">No students enrolled in this institution.</p>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student._id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black text-blue-700 uppercase tracking-wider">
                                                {student.admissionNumber}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                            {student.name}
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-slate-600">
                                            {student.email}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98]"
                                                >
                                                    <span>✏️</span> Edit Profile
                                                </button>
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

export default StudentManagement;
