import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/schedules/');
      console.log("✅ Schedule data from backend:", response.data);  // debug log
      setSchedules(response.data);
    } catch (error) {
      alert("Failed to load schedules");
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>📅 Scheduled Appliance Actions</h2>
      {schedules.length === 0 ? (
        <p>No scheduled actions found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {schedules.map((item) => (
            <li key={item.id} style={{
              background: '#fff',
              marginBottom: '10px',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #ddd'
            }}>
              <strong>{item.appliance_name || item.appliance}</strong><br />
              Action: <span>{item.action}</span><br />
              Scheduled for: <span>{new Date(item.schedule_time).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
