import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTools, FaUsers, FaListAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <div style={{
      width: '220px',
      background: '#111827',
      color: '#fff',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh', // ✅ Ensure full height
      position: 'sticky',
      top: 0,
    }}>
      <div>
        <h2 style={{ fontSize: '30px',marginBottom: '30px' }}>SmartHome Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <NavLink to="/admin/dashboard" style={linkStyle}><FaHome /> Dashboard</NavLink>
          <NavLink to="/admin/appliances" style={linkStyle}><FaTools /> Manage Appliances</NavLink>
          <NavLink to="/admin/users" style={linkStyle}><FaUsers /> Manage Users</NavLink>
          <NavLink to="/admin/logs" style={linkStyle}><FaListAlt /> View Logs</NavLink>
        </nav>
      </div>
      <div>
        <button
          onClick={handleLogout}
          style={{
            ...linkStyle,
            background: '#dc2626',
            color: 'white',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: '#fff',
  padding: '10px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '500'
};
