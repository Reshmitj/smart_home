import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './dashboard/Dashboard';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AdminManageAppliances from './pages/AdminManageAppliances';
import AdminManageUsers from './pages/AdminManageUsers';
import AdminLogs from './pages/AdminLogs';
import { ThemeProvider } from './ThemeContext';

import SidebarLayout from './layout/SidebarLayout';
import AdminSidebar from './components/AdminSidebar';
import { setAuthToken } from './api/axios';

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
if (token) {
  setAuthToken(token);
}

function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
  <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb' }}>
    <Outlet />
  </div>
</div>

  );
}

function App() {
  return (
    
    <BrowserRouter>
    <ThemeProvider>
      <Routes>
        {/* Login + Register */}
        <Route
          path="/"
          element={
            token
              ? role === 'admin'
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Login />
          }
        />
        <Route path="/register" element={<Register />} />

        {/* ✅ Admin Routes */}
        {token && role === 'admin' && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPanel />} />
            <Route path="appliances" element={<AdminManageAppliances />} />
            <Route path="users" element={<AdminManageUsers />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        )}

        {/* ✅ User Routes */}
        {token && role === 'user' && (
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
    </BrowserRouter>
    
  );
}

export default App;
