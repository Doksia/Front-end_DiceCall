import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './CharacterCreator.css';

export const CharacterCreator = () => {
  const [name, setName] = useState('');
  const [gameSystem, setGameSystem] = useState('');
  const [race, setRace] = useState('');
  const [charClass, setCharClass] = useState('');
  const [level, setLevel] = useState(1);
  const [alignment, setAlignment] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !gameSystem || !race || !charClass || !alignment) {
      setLoading(false);
      return setError('Please, fill in all the fields on the form.');
    }

     const characterData = {};
    characterData.name = name;
    characterData.game_system = gameSystem;
    characterData.race = race;
    characterData.class = charClass; 
    characterData.level = Number(level);
    characterData.alignment = alignment;

    try {
      setLoading(true);
      const data = await apiRequest('/api/api/characters', 'POST', characterData);
      
      if (data.Success || data.savedCharacter) {
        alert('Character sheet successfully saved in the tavern records!');
        navigate('/player-dashboard');
      }
    } catch (err) {
      setError(err.message || 'There was an error forging your character.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creator-container">
      <form className="creator-card" onSubmit={handleSubmit}>
        <h2>Create new character sheet</h2>
        <p className="subtitle">Create your character sheet to be able to join campaigns</p>

        {error && <div className="error-message">⚠️ {error}</div>}
        {success && <div className="success-message">⚔️ {success}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Character's name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. LoremIpsum"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gameSystem">Game System</label>
            <input
              type="text"
              id="gameSystem"
              value={gameSystem}
              onChange={(e) => setGameSystem(e.target.value)}
              placeholder="Ex. dnd E5, pathfinder E2..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="race">Race</label>
            <input
              type="text"
              id="race"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              placeholder="Ex. Dwarf, Elf, Human..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="charClass">Class & Subclass</label>
            <input
              type="text"
              id="charClass"
              value={charClass}
              onChange={(e) => setCharClass(e.target.value)}
              placeholder="Ex. Fighter (Champion)..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Character level</label>
            <input
              type="number"
              id="level"
              min="1"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="alignment">Alignment</label>
            <input
              type="text"
              id="alignment"
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              placeholder="Ex. Lawful Good, Chaotic Neutral..."
            />
          </div>
        </div>

        <div className="creator-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/home')}>
            Return to the tabern
          </button>
          <button type="submit" className="btn-submit-character" disabled={loading}>
            {loading ? 'Saving sheet...' : 'Save Character'}
          </button>
        </div>
      </form>
    </div>
  );
};