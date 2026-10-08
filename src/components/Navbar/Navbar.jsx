import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/home')}>
        🎲 <span className="brand-text">DiceCall</span>
      </div>
      
      <div className="navbar-links">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          📜 Tabern
        </NavLink>
        
        <NavLink to="/create-character" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          ⚔️ Create Character
        </NavLink>
        
        <NavLink to="/create-campaign" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          🏰 Create Campaign
        </NavLink>
        
        <NavLink to="/dm-dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          🎙️ DM Screen
        </NavLink>

        <NavLink to="/player-dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          🛡️ Characters Screen
        </NavLink>
      </div>

      <div className="navbar-user">
        <span className="user-welcome">Adventurer: <strong>{user.name || 'Adventurer'}</strong></span>
        <button className="btn-logout" onClick={handleLogout}>
          Exit from Tabern
        </button>
      </div>
    </nav>
  );
};