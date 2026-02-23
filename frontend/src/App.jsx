import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import SchoolManagement from './components/SchoolManagement';

const API_URL = 'http://localhost:3000/api/v1';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, user]);

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.warn('Logout API call failed', err);
    }
    setToken('');
    setUser({});
  };

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const Layout = ({ children }) => {
    const location = useLocation();

    return (
      <div className="flex min-h-screen bg-slate-50">
        <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
          <div className="p-6 text-xl font-bold tracking-tight border-b border-slate-800">
            School MIS
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link to="/" className={`flex items-center px-4 py-3 rounded-md transition-colors ${location.pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              Dashboard
            </Link>
            <Link to="/schools" className={`flex items-center px-4 py-3 rounded-md transition-colors ${location.pathname.startsWith('/schools') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              Schools
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          token ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard user={user} />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/schools" element={
          <PrivateRoute>
            <Layout>
              <SchoolManagement />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/schools/:schoolId/students" element={
          <PrivateRoute>
            <Layout>
              <StudentManagement />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
