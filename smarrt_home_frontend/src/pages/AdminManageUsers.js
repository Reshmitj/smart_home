import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: 'user' });
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'user', password: '' });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [applianceForm, setApplianceForm] = useState({ name: '', type: '', connection: 'WiFi' });
  const [userAppliances, setUserAppliances] = useState({});
  const [viewingAppliancesFor, setViewingAppliancesFor] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users/');
      const onlyUsers = response.data.filter(user => user.role === 'user');
      setUsers(onlyUsers);
    } catch {
      alert("Error loading users");
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditForm({ username: user.username, email: user.email, role: user.role });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`/admin/users/${id}/`, editForm);
      fetchUsers();
      setEditingId(null);
    } catch (error) {
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/admin/users/${id}/`);
        fetchUsers();
        alert("User deleted successfully.");
      } catch {
        alert("Failed to delete user.");
      }
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('/register/', newUser);
      setNewUser({ username: '', email: '', role: 'user', password: '' });
      fetchUsers();
    } catch {
      alert("Failed to add user.");
    }
  };

  const handleAddAppliance = async () => {
    try {
      await axios.post('/appliances/', { ...applianceForm, user: selectedUserId });
      alert("Appliance added for user");
      setApplianceForm({ name: '', type: '', connection: 'WiFi' });
      setSelectedUserId(null);
    } catch {
      alert("Failed to add appliance.");
    }
  };

  const handleViewAppliances = async (userId) => {
    try {
      const res = await axios.get('/appliances/');
      const filtered = res.data.filter(a => a.user?.id === userId);
      setUserAppliances(prev => ({ ...prev, [userId]: filtered }));
      setViewingAppliancesFor(userId);
    } catch {
      alert("Failed to fetch appliances for user.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ marginBottom: '25px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
            👥 Manage Users
          </h2>

          <div style={{ marginBottom: '30px' }}>
            <h4>Add New User</h4>
            <input style={inputStyle} placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
            <input style={inputStyle} placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <input style={inputStyle} placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <select style={inputStyle} value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleAddUser} style={buttonStyle('#2563eb')}>Add User</button>
          </div>

          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {users.map(user => (
                <div key={user.id} style={{
                  background: '#f3f4f6',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '15px'
                }}>
                  {editingId === user.id ? (
                    <div>
                      <input style={inputStyle} value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
                      <input style={inputStyle} value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                      <select style={inputStyle} value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={() => handleEditSubmit(user.id)} style={buttonStyle('#10b981')}>Save</button>
                      <button onClick={() => setEditingId(null)} style={buttonStyle('#6b7280')}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <strong style={{ fontSize: '16px', color: '#111827' }}>{user.username}</strong><br />
                      <span style={{ color: '#4b5563' }}>{user.email}</span><br />
                      <span style={{
                        marginTop: '6px',
                        display: 'inline-block',
                        backgroundColor: user.role === 'admin' ? '#2563eb' : '#10b981',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '14px',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>{user.role}</span><br /><br />
                      <button onClick={() => handleEditClick(user)} style={buttonStyle('#10b981')}>Edit</button>
                      <button onClick={() => handleDelete(user.id)} style={buttonStyle('#ef4444')}>Delete</button>
                      <button onClick={() => setSelectedUserId(user.id)} style={buttonStyle('#2563eb')}>Add Appliance</button>
                      <button onClick={() => handleViewAppliances(user.id)} style={buttonStyle('#f59e0b')}>View Appliances</button>
                    </div>
                  )}

                  {selectedUserId === user.id && (
                    <div style={{ marginTop: '10px', backgroundColor: '#e0f2fe', padding: '10px', borderRadius: '8px' }}>
                      <h5 style={{ marginBottom: '10px' }}>Add Appliance for {user.username}</h5>
                      <input placeholder="Appliance Name" style={inputStyle} value={applianceForm.name} onChange={(e) => setApplianceForm({ ...applianceForm, name: e.target.value })} />
                      <input placeholder="Type" style={inputStyle} value={applianceForm.type} onChange={(e) => setApplianceForm({ ...applianceForm, type: e.target.value })} />
                      <select style={inputStyle} value={applianceForm.connection} onChange={(e) => setApplianceForm({ ...applianceForm, connection: e.target.value })}>
                        <option value="WiFi">WiFi</option>
                        <option value="Bluetooth">Bluetooth</option>
                      </select>
                      <button onClick={handleAddAppliance} style={buttonStyle('#0ea5e9')}>Save Appliance</button>
                    </div>
                  )}

                  {viewingAppliancesFor === user.id && userAppliances[user.id] && (
                    <div style={{ marginTop: '15px' }}>
                      <h5>Appliances:</h5>
                      <ul>
                        {userAppliances[user.id].map((appliance) => (
                          <li key={appliance.id}>{appliance.name} ({appliance.type}) - {appliance.connection}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const buttonStyle = (bgColor) => ({
  width: '100%',
  padding: '8px',
  marginBottom: '6px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: bgColor,
  color: '#fff',
  cursor: 'pointer',
  fontWeight: '500'
});

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};