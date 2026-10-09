import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return setError('Please, fill all the fields.');
    }

    try {
      const data = await apiRequest('/api/api/auth/login', 'POST', { email, password });
      console.log("=== BACKEND RESPONSE ===", data);
       if (data.token) {
        const sanitizedUser = {
          ...data.user,
          _id: data.user.id 
        };
        login(data.token, sanitizedUser); 
        
        alert(`Welcome to the tabern, ${sanitizedUser.name}!`);
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Incorrect credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p className="subtitle">Search for your next adventure</p>
        
        {error && <div className="error-message">⚠️ {error}</div>}

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
          {loading ? 'Loading...' : 'Starting your turn (Enter)'}
        </button>

        <p className="switch-auth">
          ¿Not sign up yet? <Link to="/register">Sign up here</Link>
        </p>
      </form>
    </div>
  );
};