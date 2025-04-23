import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FaUser } from 'react-icons/fa';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/me/');
      setProfile(response.data);
    } catch (error) {
      alert("Failed to load profile");
    }
  };

  return (
    <div style={{ flex: 1, background: '#f9fafb', padding: '30px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{
        background: '#fff',
        padding: '25px 30px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        maxWidth: '500px',
      }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937', marginBottom: '20px' }}>
          <FaUser size={22} style={{ color: '#6b7280' }} />
          Profile
        </h2>

        {profile ? (
          <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: '1.8', fontSize: '16px' }}>
            <li><strong>👤 Username:</strong> {profile.username}</li>
            <li><strong>📧 Email:</strong> {profile.email}</li>
            <li><strong>🛡️ Role:</strong> {profile.role}</li>
          </ul>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}
