import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function SidebarLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#1f2937',
        color: 'white',
        padding: '20px 15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: '30px', marginBottom: '30px' }}>SmartHome</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <NavLink to="/dashboard" style={linkStyle} className={({ isActive }) => isActive ? 'active' : ''}>
              <FaHome style={iconStyle} /> Dashboard
            </NavLink>
            <NavLink to="/schedule" style={linkStyle} className={({ isActive }) => isActive ? 'active' : ''}>
              <FaCalendarAlt style={iconStyle} /> Schedule
            </NavLink>
            <NavLink to="/settings" style={linkStyle} className={({ isActive }) => isActive ? 'active' : ''}>
              <FaCog style={iconStyle} /> Settings
            </NavLink>
            <NavLink to="/profile" style={linkStyle} className={({ isActive }) => isActive ? 'active' : ''}>
              <FaUser style={iconStyle} /> Profile
            </NavLink>
          </nav>
        </div>

        <button onClick={handleLogout} style={{
          ...linkStyle,
          background: '#dc2626',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '8px',
          marginTop: '40px'
        }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: '#f9fafb', padding: '30px' }}>
        <Outlet />
      </div>
    </div>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: 'white',
  padding: '10px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const iconStyle = {
  fontSize: '18px'
};
