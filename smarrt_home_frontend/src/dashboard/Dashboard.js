import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import ScheduleForm from '../schedule/ScheduleForm';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Menu } from 'lucide-react';
import { ThemeContext } from '../ThemeContext';

const COLORS = ['#10b981', '#2563eb', '#facc15', '#f97316', '#ef4444'];

export default function Dashboard() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [appliances, setAppliances] = useState([]);
  const [showFormId, setShowFormId] = useState(null);
  const [statusSelections, setStatusSelections] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetchAppliances();
  }, []);

  const fetchAppliances = async () => {
    try {
      const response = await axios.get('/appliances/');
      setAppliances(response.data);
    } catch (error) {
      console.error("Failed to load appliances:", error);
      setAppliances([]);
    }
  };

  const toggleAppliance = async (applianceId) => {
    try {
      const status = statusSelections[applianceId];
      if (!status || !["ON", "OFF"].includes(status.toUpperCase())) {
        return alert("Please select a valid status (ON/OFF)");
      }

      await axios.put(`/appliances/status/${applianceId}/`, {
        appliance_id: applianceId,
        status: status.toUpperCase(),
      });

      alert(`Appliance ${applianceId} turned ${status.toUpperCase()}`);
      fetchAppliances();
    } catch (error) {
      alert("Failed to update appliance status");
    }
  };

  const onAppliances = appliances.filter(item => item.status === 'ON' || item.status?.status === 'ON');
  const offAppliances = appliances.filter(item => item.status === 'OFF' || item.status?.status === 'OFF');

  const energyData = appliances.map((appliance) => ({
    name: appliance.name,
    energy: appliance.energy_usage || 0,
  }));

  return (
    <div style={{ flex: 1, background: darkMode ? '#1f2937' : '#f3f4f6', padding: '30px', color: darkMode ? '#f9fafb' : '#111827' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>🏠 Your Smart Appliances</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={toggleTheme} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div style={{ backgroundColor: darkMode ? '#374151' : '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
          <p style={{ fontWeight: 'bold' }}>📱 Mobile-Friendly Mode Active</p>
          <p style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#6b7280' }}>Optimized layout for mobile view</p>
        </div>
      )}

      {/* Status Table */}
      <div style={{
        background: darkMode ? '#374151' : '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
        fontSize: '16px'
      }}>
        <h3>Status Summary</h3>
        <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: darkMode ? '#4b5563' : '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>Appliance Names</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', fontWeight: 'bold', color: '#10b981' }}>ON</td>
              <td style={{ padding: '10px' }}>{onAppliances.map(a => a.name).join(', ') || 'None'}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', fontWeight: 'bold', color: '#ef4444' }}>OFF</td>
              <td style={{ padding: '10px' }}>{offAppliances.map(a => a.name).join(', ') || 'None'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Energy Chart */}
      <div style={{
        background: darkMode ? '#374151' : '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Energy Consumption</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={energyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} kWh`} />
            <Legend />
            <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ marginTop: '10px', color: '#6b7280' }}><em>Measured in kilowatt-hours (kWh)</em></p>
      </div>

      {/* Appliance Cards */}
      {appliances.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No appliances found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {appliances.map((item) => (
            <li key={item.id} style={{
              background: darkMode ? '#374151' : '#ffffff',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <strong style={{ fontSize: '16px' }}>{item.name}</strong>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>({item.type})</span>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
                <select
                  value={statusSelections[item.id] || ''}
                  onChange={(e) => setStatusSelections((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    flex: 1,
                    minWidth: '120px'
                  }}
                >
                  <option value="">--Select Status--</option>
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </select>

                <button onClick={() => toggleAppliance(item.id)}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                  Update
                </button>

                <button onClick={() => setShowFormId(item.id)}
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                  Schedule
                </button>
              </div>

              {showFormId === item.id && (
                <ScheduleForm applianceId={item.id} onClose={() => setShowFormId(null)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
