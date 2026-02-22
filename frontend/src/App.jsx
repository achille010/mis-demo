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
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            School MIS
          </div>
          <nav>
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/students" className={`nav-item ${location.pathname === '/students' ? 'active' : ''}`}>
              Students
            </Link>
            <Link to="/schools" className={`nav-item ${location.pathname === '/schools' ? 'active' : ''}`}>
              Schools
            </Link>
            <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
              Logout
            </button>
          </nav>
        </aside>
        <main className="main-content">
          {children}
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
        <Route path="/students" element={
          <PrivateRoute>
            <Layout>
              <StudentManagement />
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
      </Routes>
    </Router>
  );
};

export default App;
