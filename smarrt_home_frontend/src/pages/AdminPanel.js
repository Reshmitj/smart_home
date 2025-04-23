import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ScheduleForm from '../schedule/ScheduleForm';
import AdminSidebar from '../components/AdminSidebar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LineChart, Line, Legend } from 'recharts'; 

const COLORS = ['#10b981', '#2563eb', '#facc15', '#f97316', '#ef4444'];

export default function AdminPanel() {
  const [appliances, setAppliances] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showFormId, setShowFormId] = useState(null);
  const [statusSelections, setStatusSelections] = useState({});
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    fetchAppliances();
    fetchLogs();
    fetchUsers();
  }, []);

  const fetchAppliances = async () => {
    try {
      const response = await axios.get('/appliances/');
      console.log("Appliances Data:",response.data);  // Check the API response
      setAppliances(response.data);
    } catch (error) {
      console.error("Failed to load appliances:", error);
      setAppliances([]);
    }
  };
  

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/audit-logs/');
      setLogs(response.data.slice(0, 5));  // Display only top 5 logs
    } catch (error) {
      console.error("Failed to fetch logs");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users/');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users");
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

  const countON = appliances.filter(item => item.status === 'ON' || item.status?.status === 'ON').length;
  const countOFF = appliances.filter(item => item.status === 'OFF' || item.status?.status === 'OFF').length;
  const totalAppliances = appliances.length;

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  const statusData = [
    { name: 'ON', value: countON },
    { name: 'OFF', value: countOFF },
  ];

  const actionFrequency = logs.reduce((acc, log) => {
    acc[log.appliance] = (acc[log.appliance] || 0) + 1;
    return acc;
  }, {});

  const topActions = Object.entries(actionFrequency).map(([name, count]) => ({ name, value: count })).slice(0, 5);

  const filteredAppliances = filterStatus
    ? appliances.filter(item => (item.status === filterStatus || item.status?.status === filterStatus))
    : appliances;

  // Energy consumption data
  const energyData = appliances.map((appliance) => ({
    name: appliance.name,
    energy: appliance.energy_usage || 0,
  }));
  
  

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activeTab="dashboard" />

      <div style={{ flex: 1, background: '#f9fafb', padding: '30px' }}>
        <h2>Admin Dashboard</h2>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1, background: '#ffffff', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3>Status Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(e) => setFilterStatus(e.name)}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {filterStatus && (
              <button onClick={() => setFilterStatus(null)} style={{ marginTop: '10px', padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}>
                Clear Filter
              </button>
            )}
          </div>

          <div style={{ flex: 1, background: '#ffffff', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3>Top Appliance Activities</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topActions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Energy Consumption Chart */}
        <div style={{ background: '#ffffff', padding: '15px 20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Energy Consumption Overview</h3>
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

        <div style={{ background: '#ffffff', padding: '15px 20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Analytics</h3>
          <p><strong>Total Appliances:</strong> {totalAppliances}</p>
          <p><strong>Total Users:</strong> {users.length} (Admins: {adminCount}, Users: {userCount})</p>
        </div>

        {filteredAppliances.length === 0 ? (
          <p>No appliances found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredAppliances.map((item) => (
              <li key={item.id} style={{ background: '#fff', padding: '15px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <strong>{item.name}</strong> ({item.type})<br />
                {item.user && (
  <span style={{ fontSize: '13px', color: '#4b5563' }}>
    Assigned to: <strong>{item.user.username}</strong>
  </span>
)}<br />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={statusSelections[item.id] || ''}
                    onChange={(e) => setStatusSelections((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">--Select Status--</option>
                    <option value="ON">ON</option>
                    <option value="OFF">OFF</option>
                  </select>

                  <button onClick={() => toggleAppliance(item.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px' }}>
                    Update
                  </button>

                  <button onClick={() => setShowFormId(item.id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px' }}>
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

        <div style={{ background: '#ffffff', padding: '15px 20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Recent Activity Logs</h3>
          {logs.length === 0 ? <p>No recent logs.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {logs.map((log) => (
                <li key={log.id} style={{ marginBottom: '10px' }}>
                  <strong>{log.user}</strong> scheduled <strong>{log.appliance}</strong> to <strong>{log.action}</strong> at {new Date(log.scheduled_at).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
