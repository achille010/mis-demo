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

    const navItems = [
      { path: '/', label: 'Dashboard', icon: '📊' },
      { path: '/schools', label: 'Schools', icon: '🏫' },
    ];

    return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Sidebar */}
        <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-20">
          <div className="p-8 flex items-center gap-3 border-b border-slate-800/50">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              🎓
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              School MIS
            </span>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2">
            {navItems.map((item) => {
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                >
                  <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-800/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
            <div className="mt-6 px-4 py-4 bg-slate-800/30 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold font-sans">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.username}</p>
                  <p className="text-xs text-slate-500 truncate">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 min-h-screen relative">
          <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-slate-200/50">
            <div className="text-sm font-medium text-slate-500 italic">
              Welcome back, <span className="text-blue-600 font-bold">@{user.username}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </header>

          <div className="p-10">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
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
