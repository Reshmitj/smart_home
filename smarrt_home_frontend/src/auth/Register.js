import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register/', { username, email, password, role });
      alert("Registration successful!");
      navigate('/');
    } catch {
      alert("Registration failed.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>📝</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Sign up to control your smart appliances</p>
        </div>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" style={styles.button}>Register</button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <span onClick={() => navigate('/')} style={styles.link}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to top left, #dbeafe, #e0f2fe)',
    padding: '20px',
  },
  card: {
    background: '#fff',
    padding: '35px 30px',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease-in',
  },
  header: {
    marginBottom: '25px',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#f9fafb',
    fontSize: '14px',
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#f9fafb',
    fontSize: '14px',
  },
  button: {
    background: '#10b981',
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


