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
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Link to="/schools" className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                    Back to Schools
                </Link>
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>
                        {school && <p className="text-slate-500 text-sm">Managing students for <span className="font-semibold text-slate-700">{school.name}</span></p>}
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
                        {showForm ? 'Cancel' : '+ Add Student'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900">{editingId ? 'Edit Student' : 'Register New Student'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Admission Number</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.admissionNumber}
                                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                                {editingId ? 'Update Student' : 'Save Student'}
                            </button>
                            <button
                                type="button"
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-md transition-colors"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ name: '', email: '', admissionNumber: '' });
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
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Admission No</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No students registered.</td></tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{student.admissionNumber}</td>
                                        <td className="px-6 py-4 text-slate-700">{student.name}</td>
                                        <td className="px-6 py-4 text-slate-700">{student.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                            >
                                                Edit
                                            </button>
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
