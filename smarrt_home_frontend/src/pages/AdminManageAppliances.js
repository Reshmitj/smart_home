import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminManageAppliances() {
  const [appliances, setAppliances] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', type: '', connection: '' });

  useEffect(() => {
    fetchAppliances();
  }, []);

  const fetchAppliances = async () => {
    try {
      const response = await axios.get('/appliances/');
      setAppliances(response.data);
    } catch {
      alert("Error fetching appliances");
    }
  };

  const handleEditClick = (appliance) => {
    setEditingId(appliance.id);
    setEditForm({ name: appliance.name, type: appliance.type, connection: appliance.connection });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`/appliances/${id}/`, {
        name: editForm.name,
        type: editForm.type,
        connection: editForm.connection,
      });
      fetchAppliances();
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update appliance.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appliance?")) {
      try {
        await axios.delete(`/appliances/${id}/`);
        fetchAppliances();
        alert("Appliance deleted successfully.");
      } catch {
        alert("Failed to delete appliance.");
      }
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
            Manage Appliances
          </h2>

          {appliances.length === 0 ? (
            <p>No appliances found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {appliances.map((appliance) => (
                <div key={appliance.id} style={{
                  background: '#f3f4f6',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '15px'
                }}>
                  {editingId === appliance.id ? (
                    <div>
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Name"
                        style={inputStyle}
                      />
                      <input
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        placeholder="Type"
                        style={inputStyle}
                      />
                      <select
                        value={editForm.connection}
                        onChange={(e) => setEditForm({ ...editForm, connection: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">--Select Connection--</option>
                        <option value="WiFi">WiFi</option>
                        <option value="Bluetooth">Bluetooth</option>
                      </select>

                      <button onClick={() => handleEditSubmit(appliance.id)} style={buttonStyle('#10b981')}>Save</button>
                      <button onClick={() => setEditingId(null)} style={buttonStyle('#6b7280')}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <strong>{appliance.name}</strong><br />
                      <span>Type: {appliance.type}</span><br />
                      <span>Connection: {appliance.connection}</span><br />
                      {appliance.user && (
                        <span>Assigned to: <strong>{appliance.user.username}</strong></span>
                      )}<br /><br />
                      <button onClick={() => handleEditClick(appliance)} style={buttonStyle('#10b981')}>Edit</button>
                      <button onClick={() => handleDelete(appliance.id)} style={buttonStyle('#ef4444')}>Delete</button>
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