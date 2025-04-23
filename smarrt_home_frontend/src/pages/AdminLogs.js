import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/audit-logs/')
      .then(res => setLogs(res.data))
      .catch(() => console.error("Error loading logs"));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '30px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>📜 System Audit Logs</h2>
          {logs.length === 0 ? (
            <p>No logs found.</p>
          ) : (
            <ul style={{ paddingLeft: '20px' }}>
              {logs.map(log => (
                <li key={log.id} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                  <span style={{ display: 'inline-block', padding: '3px 8px', backgroundColor: '#e0f2fe', borderRadius: '8px', fontWeight: 'bold', color: '#0c4a6e', marginRight: '6px' }}>{log.user}</span>
                  scheduled
                  <span style={{ fontWeight: 'bold', color: '#1e3a8a', marginLeft: '6px' }}>{log.appliance}</span> to
                  <span style={{ fontWeight: 'bold', color: log.action === 'ON' ? '#059669' : '#dc2626', marginLeft: '6px' }}>{log.action}</span> at
                  <span style={{ color: '#4b5563', marginLeft: '6px' }}>{new Date(log.scheduled_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}