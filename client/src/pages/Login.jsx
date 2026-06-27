import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'driver' ? '/driver' : '/rider');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      padding: '1rem',
    }}>
      <form onSubmit={handleSubmit} className="glass" style={{
        width: '100%', maxWidth: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome back</h2>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {error && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>}
        <button type="submit" className="btn">Log In</button>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Register</a>
        </p>
      </form>
    </div>
  );
}