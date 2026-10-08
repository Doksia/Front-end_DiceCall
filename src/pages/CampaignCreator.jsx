import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './CampaignCreator.css';

export const CampaignCreator = () => {
  const [gameSystem, setGameSystem] = useState('');
  const [format, setFormat] = useState('Online');
  const [shortDescription, setShortDescription] = useState('');
  const [lookingFor, setLookingFor] = useState('All');
  const [currentPlayers, setCurrentPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [campaignLevel, setCampaignLevel] = useState(1);
  const [title, setTitle] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!gameSystem || !maxPlayers) {
      setLoading(false);
      return setError('Game System and maximum players are mandatory.');
    }
    const campaignData = {
      title: title || `Campaign in ${gameSystem}`, 
      game_system: gameSystem,
      format,
      short_description: shortDescription,
      status: Number(currentPlayers) >= Number(maxPlayers) ? 'Full' : 'Open',
      looking_for: lookingFor,
      current_players: Number(currentPlayers),
      max_players: Number(maxPlayers),
      campaign_level: Number(campaignLevel)
    };

    try {
      await apiRequest('/api/api/campaigns', 'POST', campaignData);
      
      setSuccess('Campaign successfully published!');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error creating the campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-creator-container">
      <form className="campaign-creator-card" onSubmit={handleSubmit}>
        <h2>Create New Campaign</h2>
        <p className="subtitle">Setup your campaign and find your next players</p>

        {error && <div className="error-message">⚠️ {error}</div>}
        {success && <div className="success-message">📜 {success}</div>}

        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title">Title of the Campaign (Optional)</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. LoremIpsum"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gameSystem">Game System *</label>
            <input
              type="text"
              id="gameSystem"
              value={gameSystem}
              onChange={(e) => setGameSystem(e.target.value)}
              placeholder="Ex. dnd E5, pathfinder E2..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="format">Format</label>
            <select id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="lookingFor">Searching for</label>
            <select id="lookingFor" value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
              <option value="All">All (Dont care)</option>
              <option value="Healer">Healer</option>
              <option value="Tank">Tank</option>
              <option value="Dps">Dps</option>
              <option value="Healer and Tank">Healer & Tank</option>
              <option value="Healer and Dps">Healer & Dps</option>
              <option value="Tank and Dps">Tank & Dps</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="campaignLevel">Party level</label>
            <input
              type="number"
              id="campaignLevel"
              min="1"
              value={campaignLevel}
              onChange={(e) => setCampaignLevel(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentPlayers">Characters already in the party</label>
            <input
              type="number"
              id="currentPlayers"
              min="0"
              value={currentPlayers}
              onChange={(e) => setCurrentPlayers(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxPlayers">Maximum Players on the party *</label>
            <input
              type="number"
              id="maxPlayers"
              min="1"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="shortDescription">Short description of the campaign</label>
            <textarea
              id="shortDescription"
              maxLength="200"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Write a short introduction to the story or anything worth mentioning to your future players (Máx. 200 characters long)..."
              rows="3"
            />
          </div>
        </div>

        <div className="creator-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/home')}>
            Return to the Tabern
          </button>
          <button type="submit" className="btn-submit-campaign" disabled={loading}>
            {loading ? 'Invoking Campaign...' : 'Publish Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};