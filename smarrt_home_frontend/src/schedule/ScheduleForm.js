import React, { useState } from 'react';
import axios from '../api/axios';

export default function ScheduleForm({ applianceId, onClose }) {
  const [action, setAction] = useState('OFF');
  const [time, setTime] = useState('');

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/appliances/schedule/', {
        appliance_id: applianceId,
        action,
        schedule_time: time,
      });
      alert("Schedule saved!");
      onClose(); // Close modal/form
    } catch (err) {
      alert("Failed to schedule appliance");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <form
        onSubmit={handleSchedule}
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          fontFamily: 'Segoe UI, sans-serif',
          zIndex: 1001,
        }}
      >
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Schedule Appliance</h3>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          Action:
          <select value={action} onChange={(e) => setAction(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px', border: '1px solid #ccc' }}>
            <option value="ON">ON</option>
            <option value="OFF">OFF</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: '20px' }}>
          Time:
          <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px', border: '1px solid #ccc' }} />
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit"
            style={{ flex: 1, marginRight: '10px', padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Save
          </button>
          <button type="button" onClick={onClose}
            style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
