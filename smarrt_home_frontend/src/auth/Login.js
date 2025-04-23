import React, { useState } from 'react';
import axios, { setAuthToken } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/token/', { username, password });
      const token = response.data.access;
      const role = response.data.role;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setAuthToken(token);
      window.location.reload();
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🔒</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Login to your SmartHome</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.footer}>
          New here?{' '}
          <span onClick={() => navigate('/register')} style={styles.link}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(to top left, #dbeafe, #e0f2fe)',
    padding: '20px',
  },
  card: {
    background: '#fff',
    padding: '35px 30px',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
    textAlign: 'center',
    animation: 'slideIn 0.6s ease-out',
  },
  header: {
    marginBottom: '25px',
  },
  logo: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    background: '#f9fafb',
    transition: 'border 0.3s ease',
  },
  button: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '12px',
    fontSize: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.3s ease',
  },
  footer: {
    marginTop: '20px',
    fontSize: '13px',
    color: '#6b7280',
  },
  link: {
    color: '#2563eb',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};


