import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './Login.css';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !email || !password) {
      setLoading(false);
      return setError('All fields are mandatory');
    }

    try {
      const data = await apiRequest('/api/api/auth/signup', 'POST', { name, email, password });
      if (data.Success) {
        setSuccess('Account created! Prepare for the adventure.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Error on the sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Create user</h2>
        <p className="subtitle">Sign up to start playing</p>
        
        {error && <div className="error-message">⚠️ {error}</div>}
        {success && <div className="success-message">⚔️ {success}</div>}

        <div className="form-group">
          <label htmlFor="name">User name / DM</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. LoremIpsum"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="loremIpsum@rol.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Importing...' : 'Creating user sheet'}
        </button>

        <p className="switch-auth">
          ¿You have already an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};