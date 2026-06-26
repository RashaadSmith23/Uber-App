import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '', role: 'rider' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await register(form);
    navigate(user.role === 'driver' ? '/driver' : '/rider');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs */}
      <button type="submit">Register</button>
    </form>
  );
}